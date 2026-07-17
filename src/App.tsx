import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { generateCover } from './api/ai'
import { clearToken, getCurrentUser, signIn, signUp, TOKEN_STORAGE_KEY } from './api/auth'
import type { FeedTab } from './api/song'
import { generateSong, getFeed, getGenerateTaskStatus, getMySongs, publishSong, recordSongPlay, submitGenerateTask, updateSong } from './api/song'
import { AppLayout } from './components/AppLayout'
import { LoadingState } from './components/LoadingState'
import { PosterModal } from './components/PosterModal'
import { AuthPage } from './pages/auth/AuthPage'
import type { CreateSubmission } from './pages/create/CreateFormPage'
import { CreateFormPage } from './pages/create/CreateFormPage'
import { CreatePage } from './pages/create/CreatePage'
import { DiscoverPage } from './pages/DiscoverPage'
import { FeedPage } from './pages/FeedPage'
import { MePage } from './pages/me/MePage'
import { PlayerPage } from './pages/player/PlayerPage'
import { RadioPage } from './pages/radio/RadioPage'
import { SongDetailPage } from './pages/song-detail/SongDetailPage'
import { TaskPage } from './pages/TaskPage'
import type { Song, SongMode } from './types/song'
import type { User } from './types/user'
import { resolveAssetUrl } from './utils/asset'
import type { NavKey } from './utils/constants'

type AppView = NavKey | 'auth' | 'createForm' | 'task' | 'songDetail' | 'player'

type AuthMode = 'login' | 'register'

type AuthValues = {
  identifier?: string
  password?: string
  nickname?: string
  inviteCode?: string
}

type CreateTaskState = {
  status: 'running' | 'done' | 'error'
  stage: string
  description: string
  progress: number
  canOpenSong: boolean
}

const AUTH_STORAGE_KEY = 'echo-auth-user'
const VISUALIZER_BAR_COUNT = 48
const IDLE_VISUALIZER_BARS = Array.from({ length: VISUALIZER_BAR_COUNT }, (_, index) =>
  0.18 + ((index * 7) % 9) * 0.018
)

function App() {
  const [activeView, setActiveView] = useState<AppView>('auth')
  const [user, setUser] = useState<User | null>(null)
  const [feedSongs, setFeedSongs] = useState<Song[]>([])
  const [mySongs, setMySongs] = useState<Song[]>([])
  const [feedTab, setFeedTab] = useState<FeedTab>('resonance')
  const [createMode, setCreateMode] = useState<SongMode>('song')
  const [radioPreset, setRadioPreset] = useState({ prompt: '', style: '' })
  const [currentSongId, setCurrentSongId] = useState<string>()
  const [posterOpen, setPosterOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)
  const [createSubmitting, setCreateSubmitting] = useState(false)
  const [publishSubmitting, setPublishSubmitting] = useState(false)
  const [createTask, setCreateTask] = useState<CreateTaskState | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [playbackDuration, setPlaybackDuration] = useState(0)
  const [pendingPlaySongId, setPendingPlaySongId] = useState<string | null>(null)
  const [visualizerBars, setVisualizerBars] = useState<number[]>(IDLE_VISUALIZER_BARS)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const analyserDataRef = useRef<Uint8Array<ArrayBuffer> | null>(null)

  const allSongs = useMemo(() => {
    const songMap = new Map<string, Song>()
    ;[...feedSongs, ...mySongs].forEach((song) => songMap.set(song.id, song))
    return [...songMap.values()]
  }, [feedSongs, mySongs])

  const currentSong = currentSongId
    ? allSongs.find((song) => song.id === currentSongId)
    : undefined
  const currentSongIndex = currentSong ? allSongs.findIndex((song) => song.id === currentSong.id) : -1
  const playbackProgress = playbackDuration > 0 ? (currentTime / playbackDuration) * 100 : 0
  const audioElement = <audio ref={audioRef} hidden preload="metadata" />

  function ensureAudioAnalyser() {
    const audio = audioRef.current
    if (!audio) return null
    if (!audio.src) return null

    const audioUrl = new URL(audio.src, window.location.href)
    const canUseAnalyser =
      audioUrl.origin === window.location.origin ||
      audioUrl.protocol === 'blob:' ||
      audioUrl.protocol === 'data:'

    if (!canUseAnalyser) {
      return null
    }

    if (!audioContextRef.current) {
      try {
        const AudioContextClass = window.AudioContext
        if (!AudioContextClass) return null

        const context = new AudioContextClass()
        const analyser = context.createAnalyser()
        analyser.fftSize = 256
        analyser.smoothingTimeConstant = 0.86

        const source = context.createMediaElementSource(audio)
        source.connect(analyser)
        analyser.connect(context.destination)

        audioContextRef.current = context
        analyserRef.current = analyser
        sourceNodeRef.current = source
        analyserDataRef.current = new Uint8Array(analyser.frequencyBinCount)
      } catch (error) {
        console.error('failed to initialize audio analyser', error)
        return null
      }
    }

    return analyserRef.current
  }

  function openSong(songId: string) {
    setCurrentSongId(songId)
    setActiveView('songDetail')
  }

  function replaceSongInList(list: Song[], nextSong: Song) {
    const filteredSongs = list.filter((song) => song.id !== nextSong.id)
    return [nextSong, ...filteredSongs]
  }

  function syncSong(nextSong: Song) {
    setMySongs((currentSongs) => replaceSongInList(currentSongs, nextSong))
    setFeedSongs((currentSongs) => {
      const exists = currentSongs.some((song) => song.id === nextSong.id)
      if (!exists) return currentSongs
      return replaceSongInList(currentSongs, nextSong)
    })
    setCurrentSongId(nextSong.id)
  }

  function navigate(key: NavKey) {
    setActiveView(key)
  }

  function syncPlayCount(songId: string, nextPlayCount: number) {
    const applyPlayCount = (list: Song[]) =>
      list.map((song) => (song.id === songId ? { ...song, playCount: nextPlayCount } : song))

    setFeedSongs((currentSongs) => applyPlayCount(currentSongs))
    setMySongs((currentSongs) => applyPlayCount(currentSongs))
  }

  async function startPlayback(songId?: string) {
    const nextSongId = songId ?? currentSong?.id
    if (!nextSongId) return

    if (songId && songId !== currentSongId) {
      setCurrentSongId(songId)
      setPendingPlaySongId(songId)
    } else if (currentSong?.audioUrl) {
      try {
        await audioRef.current?.play()
        const audioContext = ensureAudioAnalyser() ? audioContextRef.current : null
        if (audioContext?.state === 'suspended') {
          await audioContext.resume()
        }
      } catch (error) {
        console.error(error)
      }
    }

    if (songId) {
      try {
        const nextPlayCount = await recordSongPlay(songId)
        syncPlayCount(songId, nextPlayCount)
      } catch (error) {
        console.error(error)
      }
    }
  }

  function pausePlayback() {
    audioRef.current?.pause()
  }

  function togglePlayback() {
    if (!currentSong) return
    if (isPlaying) {
      pausePlayback()
      return
    }
    void startPlayback()
  }

  function playAdjacentSong(direction: 'prev' | 'next') {
    if (!allSongs.length) return

    const baseIndex = currentSongIndex >= 0 ? currentSongIndex : 0
    const step = direction === 'next' ? 1 : -1
    const nextIndex = (baseIndex + step + allSongs.length) % allSongs.length
    const nextSong = allSongs[nextIndex]

    if (!nextSong) return
    setActiveView('player')
    void startPlayback(nextSong.id)
  }

  function seekPlayback(progress: number) {
    const audio = audioRef.current
    if (!audio || !playbackDuration) return
    const boundedProgress = Math.max(0, Math.min(progress, 100))
    audio.currentTime = (boundedProgress / 100) * playbackDuration
  }

  async function changeFeedTab(tab: FeedTab) {
    setFeedTab(tab)
    setFeedSongs(await getFeed(tab))
  }

  function openCreateForm(mode: SongMode) {
    setCreateMode(mode)
    setActiveView('createForm')
  }

  async function handleCreateSubmit(payload: CreateSubmission) {
    setCreateSubmitting(true)
    setCreateTask({
      status: 'running',
      stage: '正在生成中',
      description: '正在整理歌词、旋律和音频结果，完成后会继续生成封面。',
      progress: 24,
      canOpenSong: false,
    })
    setActiveView('task')

    try {
      let createdSong: Song
      if (payload.mode === 'radio') {
        const task = await submitGenerateTask(payload)
        if (!task.taskId) throw new Error('后端没有返回电台生成任务 ID。')

        let taskSong: Song | undefined
        for (let attempt = 0; attempt < 60; attempt += 1) {
          const status = await getGenerateTaskStatus(task.taskId)
          setCreateTask({
            status: status.status === 'error' || status.status === 'failed' ? 'error' : 'running',
            stage: status.stage || '正在生成电台音乐',
            description: status.status === 'queued' ? '任务正在排队，请稍等。' : '后端正在生成纯音乐和音频。',
            progress: status.progress ?? Math.min(90, 12 + attempt * 2),
            canOpenSong: false,
          })
          if (status.status === 'done') {
            taskSong = status.result?.song
            break
          }
          if (status.status === 'error' || status.status === 'failed') {
            throw new Error(status.error || '电台音乐生成失败。')
          }
          await new Promise((resolve) => window.setTimeout(resolve, 2000))
        }
        if (!taskSong) throw new Error('电台音乐仍在生成，请稍后在我的作品中查看。')
        createdSong = taskSong
      } else {
        createdSong = await generateSong(payload)
      }
      syncSong(createdSong)
      setCreateTask({
        status: 'running',
        stage: '正在生成中',
        description: '歌曲已经生成完成，正在继续生成封面，请再稍等一下。',
        progress: 76,
        canOpenSong: false,
      })

      try {
        const coverResult = await generateCover({
          title: createdSong.title,
          style: createdSong.style,
          prompt: payload.prompt,
        })

        if (coverResult.imageUrl) {
          const songWithCover = await updateSong(createdSong.id, {
            coverUrl: coverResult.imageUrl,
          })
          syncSong(songWithCover)
        }

        setCreateTask({
          status: 'done',
          stage: '生成完成',
          description: '歌曲和封面都已经准备好了，现在可以查看详情或继续发布。',
          progress: 100,
          canOpenSong: true,
        })
      } catch (coverError) {
        console.error(coverError)
        setCreateTask({
          status: 'done',
          stage: '生成完成',
          description: '歌曲已经生成完成，但封面暂时没有成功生成，可以先查看详情。',
          progress: 100,
          canOpenSong: true,
        })
      }
    } catch (error) {
      console.error(error)
      setCreateTask({
        status: 'error',
        stage: '生成失败',
        description: error instanceof Error ? error.message : '提交生成失败，请稍后重试。',
        progress: 100,
        canOpenSong: false,
      })
    } finally {
      setCreateSubmitting(false)
    }
  }

  async function handlePlaySong(songId: string) {
    setCurrentSongId(songId)
    setActiveView('player')
    void startPlayback(songId)
  }

  async function handlePublishSong(published: boolean) {
    if (!currentSong) return

    setPublishSubmitting(true)

    try {
      const nextSong = await publishSong(currentSong.id, {
        published,
        copyrightConfirmed: published ? true : undefined,
      })

      setMySongs((currentSongs) => replaceSongInList(currentSongs, nextSong))
      setFeedSongs((currentSongs) => {
        const nextSongs = currentSongs.filter((song) => song.id !== nextSong.id)
        return nextSong.published ? [nextSong, ...nextSongs] : nextSongs
      })
      setCurrentSongId(nextSong.id)

      window.alert(
        published ? '作品已发布，可以继续去首页或我的作品里查看。' : '作品已设为仅自己可见。'
      )
    } catch (error) {
      console.error(error)
      window.alert(error instanceof Error ? error.message : '作品状态更新失败，请稍后重试。')
    } finally {
      setPublishSubmitting(false)
    }
  }

  useEffect(() => {
    async function bootstrap() {
      const savedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY)
      if (!savedToken) {
        setUser(null)
        setActiveView('auth')
        setLoading(false)
        return
      }

      try {
        const nextUser = await getCurrentUser()
        setUser(nextUser)
        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser))
        setActiveView('feed')

        try {
          const [nextFeedSongs, nextMySongs] = await Promise.all([getFeed(feedTab), getMySongs()])
          setFeedSongs(nextFeedSongs)
          setMySongs(nextMySongs)
          setCurrentSongId(undefined)
        } catch (error) {
          console.error(error)
          setFeedSongs([])
          setMySongs([])
          setCurrentSongId(undefined)
        }
      } catch (error) {
        console.error(error)
        clearToken()
        window.localStorage.removeItem(AUTH_STORAGE_KEY)
        setUser(null)
        setActiveView('auth')
      } finally {
        setLoading(false)
      }
    }

    void bootstrap()
  }, [feedTab])

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current)
      }

      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        void audioContextRef.current.close()
      }
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleLoadedMetadata = () => setPlaybackDuration(audio.duration || currentSong?.duration || 0)
    const handleEnded = () => {
      setIsPlaying(false)
      playAdjacentSong('next')
    }

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentSong?.duration])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (!currentSong?.audioUrl) {
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
      setIsPlaying(false)
      setCurrentTime(0)
      setPlaybackDuration(0)
      return
    }

    const nextAudioUrl = resolveAssetUrl(currentSong.audioUrl)
    if (audio.src !== nextAudioUrl) {
      audio.src = nextAudioUrl
      audio.load()
      setCurrentTime(0)
      setPlaybackDuration(currentSong.duration ?? 0)
    }

    if (pendingPlaySongId === currentSong.id) {
      void audio
        .play()
        .then(() => {
          const audioContext = ensureAudioAnalyser() ? audioContextRef.current : null
          if (audioContext?.state === 'suspended') {
            void audioContext.resume()
          }
        })
        .catch((error) => {
          console.error(error)
        })
      setPendingPlaySongId(null)
    }
  }, [currentSong?.id, currentSong?.audioUrl, currentSong?.duration, pendingPlaySongId])

  useEffect(() => {
    const analyser = ensureAudioAnalyser()
    if (!analyser || !analyserDataRef.current) return

    if (animationFrameRef.current) {
      window.cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    if (!isPlaying) {
      setVisualizerBars((currentBars) =>
        currentBars.map((value, index) => Math.max(IDLE_VISUALIZER_BARS[index] ?? 0.16, value * 0.72))
      )
      return
    }

    const frameData = analyserDataRef.current

    const updateBars = () => {
      analyser.getByteFrequencyData(frameData)

      const bucketSize = Math.max(1, Math.floor(frameData.length / VISUALIZER_BAR_COUNT))
      const nextBars = Array.from({ length: VISUALIZER_BAR_COUNT }, (_, index) => {
        const start = index * bucketSize
        const end = Math.min(frameData.length, start + bucketSize)
        let total = 0

        for (let pointer = start; pointer < end; pointer += 1) {
          total += frameData[pointer]
        }

        const average = end > start ? total / (end - start) : 0
        return Math.max(0.08, Math.min(1, average / 180))
      })

      setVisualizerBars(nextBars)
      animationFrameRef.current = window.requestAnimationFrame(updateBars)
    }

    animationFrameRef.current = window.requestAnimationFrame(updateBars)

    return () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }, [isPlaying, currentSong?.id])

  async function handleAuthenticate(mode: AuthMode, values: AuthValues) {
    setAuthLoading(true)

    try {
      const nextUser =
        mode === 'login'
          ? await signIn({ identifier: values.identifier ?? '', password: values.password ?? '' })
          : await signUp({
              nickname: values.nickname ?? '',
              password: values.password ?? '',
              inviteCode: values.inviteCode,
            })

      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser))
      setUser(nextUser)
      setActiveView('feed')

      const [nextFeedSongs, nextMySongs] = await Promise.all([getFeed(feedTab), getMySongs()])
      setFeedSongs(nextFeedSongs)
      setMySongs(nextMySongs)
      setCurrentSongId(nextFeedSongs[0]?.id)
    } catch (error) {
      console.error(error)
      window.alert(error instanceof Error ? error.message : '璁よ瘉澶辫触锛岃绋嶅悗閲嶈瘯')
    } finally {
      setAuthLoading(false)
    }
  }

  function handleLogout() {
    clearToken()
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    setUser(null)
    setActiveView('auth')
    setFeedSongs([])
    setMySongs([])
    setCurrentSongId(undefined)
    setPosterOpen(false)
    setCreateTask(null)
  }

  if (loading) {
    return (
      <>
        {audioElement}
        <main className="standalone-shell">
          <LoadingState title="正在进入 Echo" description="准备用户、作品和页面骨架" />
        </main>
      </>
    )
  }

  if (!user) {
    return (
      <>
        {audioElement}
        <main className="standalone-shell">
          <AuthPage onAuthenticate={handleAuthenticate} loading={authLoading} />
        </main>
      </>
    )
  }

  const activeNavKey =
    activeView === 'player' || activeView === 'songDetail'
      ? 'feed'
      : activeView === 'task' || activeView === 'createForm'
        ? 'create'
        : activeView === 'auth'
          ? 'feed'
          : activeView

  if (activeView === 'player') {
    return (
      <>
        {audioElement}
        <PlayerPage
          song={currentSong}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={playbackDuration || currentSong?.duration || 0}
          visualizerBars={visualizerBars}
          onTogglePlay={togglePlayback}
          onPlayPrev={() => playAdjacentSong('prev')}
          onPlayNext={() => playAdjacentSong('next')}
          onSeek={seekPlayback}
          onClose={() => setActiveView(currentSong ? 'songDetail' : 'feed')}
          onBackHome={() => setActiveView('feed')}
        />
        {posterOpen && currentSong ? (
          <PosterModal song={currentSong} onClose={() => setPosterOpen(false)} />
        ) : null}
      </>
    )
  }

  return (
    <>
      {audioElement}
      <AppLayout
        active={activeNavKey as Exclude<NavKey, 'auth'>}
        currentSong={currentSong}
        isPlaying={isPlaying}
        progress={playbackProgress}
        user={user}
        onNavigate={navigate}
        onOpenPlayer={() => setActiveView('player')}
        onTogglePlay={togglePlayback}
        onPlayPrev={() => playAdjacentSong('prev')}
        onPlayNext={() => playAdjacentSong('next')}
        onLogout={handleLogout}
      >
        {activeView === 'feed' ? (
          <FeedPage
            activeTab={feedTab}
            songs={feedSongs}
            onChangeTab={(tab) => void changeFeedTab(tab)}
            onCreate={() => setActiveView('create')}
            onOpenSong={openSong}
          />
        ) : null}
        {activeView === 'discover' ? (
          <DiscoverPage
            user={user}
            songs={mySongs}
            onOpenSong={openSong}
            onPlaySong={(songId) => void handlePlaySong(songId)}
          />
        ) : null}
        {activeView === 'create' ? <CreatePage onOpenForm={openCreateForm} /> : null}
        {activeView === 'createForm' ? (
          <CreateFormPage
            mode={createMode}
            onSubmit={handleCreateSubmit}
            submitting={createSubmitting}
            initialPrompt={createMode === 'radio' ? radioPreset.prompt : ''}
            initialStyle={createMode === 'radio' ? radioPreset.style : ''}
          />
        ) : null}
        {activeView === 'radio' ? (
          <RadioPage
            songs={mySongs}
            onOpenSong={openSong}
            onPlaySong={(songId) => void handlePlaySong(songId)}
            onGenerate={(preset) => {
              setRadioPreset(preset)
              openCreateForm('radio')
            }}
          />
        ) : null}
        {activeView === 'me' ? <MePage user={user} songs={mySongs} onOpenSong={openSong} /> : null}
        {activeView === 'task' && createTask ? (
          <TaskPage task={createTask} onOpenSong={() => currentSong && openSong(currentSong.id)} />
        ) : null}
        {activeView === 'songDetail' && currentSong ? (
          <SongDetailPage
            song={currentSong}
            canManage={currentSong.author.id === user.id}
            publishing={publishSubmitting}
            onPlay={() => void handlePlaySong(currentSong.id)}
            onOpenPoster={() => setPosterOpen(true)}
            onPublish={() => void handlePublishSong(true)}
            onSetPrivate={() => void handlePublishSong(false)}
          />
        ) : null}
        {posterOpen && currentSong ? (
          <PosterModal song={currentSong} onClose={() => setPosterOpen(false)} />
        ) : null}
      </AppLayout>
    </>
  )
}

export default App
