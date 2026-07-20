import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { generateDjBroadcast } from './api/ai'
import { clearToken, getCurrentUser, signIn, signUp, TOKEN_STORAGE_KEY } from './api/auth'
import { getCuration, getHostPage, type HostCuration, type HostPage } from './api/host'
import type { FeedTab, ResonanceFeedResponse } from './api/song'
import { getFeed, getGenerateTaskStatus, getMySongs, getResonanceFeed, getSongDetail, publishSong, recordSongPlay, submitGenerateTask, submitRemixTask } from './api/song'
import { AppLayout } from './components/AppLayout'
import { LoadingState } from './components/LoadingState'
import { PosterModal } from './components/PosterModal'
import { AuthPage } from './pages/auth/AuthPage'
import type { CreateChallengeContext, CreateSubmission } from './pages/create/CreateFormPage'
import { CreateFormPage } from './pages/create/CreateFormPage'
import { CreatePage } from './pages/create/CreatePage'
import { DiscoverPage } from './pages/DiscoverPage'
import { FeedPage } from './pages/FeedPage'
import { HostPage as HostProfilePage } from './pages/host/HostPage'
import { MePage } from './pages/me/MePage'
import { PlayerPage } from './pages/player/PlayerPage'
import { RadioPage } from './pages/radio/RadioPage'
import { SongDetailPage } from './pages/song-detail/SongDetailPage'
import { TaskPage } from './pages/TaskPage'
import type { Song, SongMode } from './types/song'
import type { User } from './types/user'
import { resolveAssetUrl } from './utils/asset'
import type { NavKey } from './utils/constants'
import { AdminPage } from './pages/admin/AdminPage'

type AppView = NavKey | 'auth' | 'createForm' | 'task' | 'songDetail' | 'player' | 'host'

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

type CreatePreset = {
  prompt: string
  style: string
  title?: string
  lyrics?: string
  originId?: string
}

const AUTH_STORAGE_KEY = 'echo-auth-user'
const EMPTY_CREATE_PRESET: CreatePreset = { prompt: '', style: '' }

function UserApp() {
  const [activeView, setActiveView] = useState<AppView>('auth')
  const [user, setUser] = useState<User | null>(null)
  const [feedSongs, setFeedSongs] = useState<Song[]>([])
  const [mySongs, setMySongs] = useState<Song[]>([])
  const [hostPage, setHostPage] = useState<HostPage | null>(null)
  const [curation, setCuration] = useState<HostCuration | null>(null)
  const [resonance, setResonance] = useState<ResonanceFeedResponse | null>(null)
  const [feedTab, setFeedTab] = useState<FeedTab>('resonance')
  const [createMode, setCreateMode] = useState<SongMode>('song')
  const [createChallenge, setCreateChallenge] = useState<CreateChallengeContext | null>(null)
  const [radioPreset, setRadioPreset] = useState<CreatePreset>(EMPTY_CREATE_PRESET)
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
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const playerVisualizerCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null)
  const analyserDataRef = useRef<Uint8Array | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const djFollowSongIdRef = useRef<string | null>(null)

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
  const audioElement = <audio ref={audioRef} hidden preload="metadata" crossOrigin="anonymous" />

  function getAudioContext() {
    if (!audioContextRef.current) {
      try {
        const AudioContextClass = window.AudioContext
        if (!AudioContextClass) return null

        audioContextRef.current = new AudioContextClass()
      } catch (error) {
        console.error('failed to initialize audio context', error)
        return null
      }
    }

    return audioContextRef.current
  }

  function ensureAudioAnalyser() {
    if (analyserRef.current) return analyserRef.current

    const audio = audioRef.current
    const audioContext = getAudioContext()
    if (!audio || !audioContext) return null

    try {
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 128
      analyser.smoothingTimeConstant = 0.78

      const source = audioContext.createMediaElementSource(audio)
      source.connect(analyser)
      analyser.connect(audioContext.destination)

      analyserRef.current = analyser
      sourceNodeRef.current = source
      analyserDataRef.current = new Uint8Array(analyser.frequencyBinCount)
      return analyser
    } catch (error) {
      console.error('failed to initialize audio analyser', error)
      return null
    }
  }

  function clearPlayerVisualizer() {
    const canvas = playerVisualizerCanvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    context.clearRect(0, 0, canvas.width, canvas.height)
  }

  function openSong(songId: string) {
    setCurrentSongId(songId)
    setActiveView('songDetail')
    void getSongDetail(songId)
      .then((nextSong) => {
        const updateIfExists = (list: Song[]) =>
          list.map((song) => (song.id === nextSong.id ? nextSong : song))

        setFeedSongs((currentSongs) =>
          currentSongs.some((song) => song.id === nextSong.id)
            ? updateIfExists(currentSongs)
            : [nextSong, ...currentSongs],
        )
        setMySongs(updateIfExists)
        setCurrentSongId(nextSong.id)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  function replaceSongInList(list: Song[], nextSong: Song) {
    const existingSong = list.find((song) => song.id === nextSong.id)
    const mergedSong = existingSong
      ? { ...existingSong, ...nextSong, challengeId: nextSong.challengeId ?? existingSong.challengeId }
      : nextSong
    const filteredSongs = list.filter((song) => song.id !== nextSong.id)
    return [mergedSong, ...filteredSongs]
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

  async function loadHostContent() {
    const [hostResult, curationResult] = await Promise.allSettled([getHostPage(), getCuration()])

    if (hostResult.status === 'fulfilled') {
      setHostPage(hostResult.value)
    }

    if (curationResult.status === 'fulfilled') {
      setCuration(curationResult.value)
    }
  }

  async function loadFeedSongs(tab: FeedTab = feedTab, currentUser: User | null = user) {
    if (tab !== 'resonance') {
      setResonance(null)
      return getFeed(tab)
    }

    const result = await getResonanceFeed(currentUser?.nickname)
    setResonance(result)
    return result.list ?? []
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
        const audioContext = getAudioContext()
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
    setFeedSongs(await loadFeedSongs(tab))
  }

  function openCreateForm(mode: SongMode) {
    setCreateChallenge(null)
    if (mode !== 'radio' && mode !== 'remix') {
      setRadioPreset(EMPTY_CREATE_PRESET)
    }
    setCreateMode(mode)
    setActiveView('createForm')
  }

  function openChallengeCreate(challenge: CreateChallengeContext) {
    setCreateChallenge(challenge)
    setRadioPreset(EMPTY_CREATE_PRESET)
    setCreateMode('song')
    setActiveView('createForm')
  }

  function handleRemixSong(song: Song) {
    setRadioPreset({
      prompt: `基于《${song.title}》做一次翻唱二创，保留原曲情绪，尝试新的编曲和演唱表达。`,
      style: song.style,
      title: `${song.title}（翻唱）`,
      lyrics: song.lyrics ?? '',
      originId: song.id,
    })
    openCreateForm('remix')
  }

  async function pollGenerateTask(taskId: string, taskLabel: string) {
    let taskSong: Song | undefined
    for (let attempt = 0; attempt < 60; attempt += 1) {
      const status = await getGenerateTaskStatus(taskId)
      const taskError = typeof status.error === 'string' ? status.error : status.error?.message
      setCreateTask({
        status: status.status === 'error' || status.status === 'failed' ? 'error' : 'running',
        stage: status.stage || `正在生成${taskLabel}`,
        description: status.status === 'queued' ? '任务正在排队，请稍等。' : `后端正在生成${taskLabel}、音频、封面和乐评。`,
        progress: status.progress ?? Math.min(90, 12 + attempt * 2),
        canOpenSong: false,
      })
      if (status.status === 'done') {
        taskSong = status.result?.song
        break
      }
      if (status.status === 'error' || status.status === 'failed') {
        throw new Error(taskError || `${taskLabel}生成失败。`)
      }
      await new Promise((resolve) => window.setTimeout(resolve, 2000))
    }

    if (!taskSong) throw new Error(`${taskLabel}仍在生成，请稍后在我的作品中查看。`)
    return taskSong
  }

  async function handleCreateSubmit(payload: CreateSubmission) {
    setCreateSubmitting(true)
    setCreateTask({
      status: 'running',
      stage: '正在生成中',
      description: '正在提交生成任务，后端会继续生成音频、封面和乐评。',
      progress: 24,
      canOpenSong: false,
    })
    setActiveView('task')

    try {
      let createdSong: Song
      if (payload.mode === 'remix' && payload.originId) {
        const task = await submitRemixTask(payload.originId, {
          style: payload.style,
          lyrics: payload.lyrics,
          prompt: payload.prompt || `翻唱二创《${payload.title}》`,
        })
        if (!task.taskId) throw new Error('后端没有返回二创生成任务 ID。')
        createdSong = await pollGenerateTask(task.taskId, '翻唱二创')
      } else if (payload.mode === 'radio' || payload.challengeId) {
        const task = await submitGenerateTask(payload)
        if (!task.taskId) throw new Error('后端没有返回歌曲生成任务 ID。')
        createdSong = await pollGenerateTask(task.taskId, payload.challengeId ? '话题挑战歌曲' : '电台音乐')
        if (payload.challengeId) createdSong = { ...createdSong, challengeId: payload.challengeId }
      } else {
        const task = await submitGenerateTask(payload)
        if (!task.taskId) throw new Error('后端没有返回歌曲生成任务 ID。')
        createdSong = await pollGenerateTask(task.taskId, '歌曲')
      }
      syncSong(createdSong)
      let completionDescription = '歌曲、封面和乐评都已经准备好了，现在可以查看详情或继续发布。'

      if (payload.challengeId) {
        setCreateTask({
          status: 'running',
          stage: '正在加入话题',
          description: `歌曲已生成，正在发布并加入话题「${createChallenge?.title ?? '话题挑战'}」。`,
          progress: 90,
          canOpenSong: false,
        })
        const publishedSong = await publishSong(createdSong.id, {
          published: true,
          copyrightConfirmed: true,
        })
        createdSong = { ...createdSong, ...publishedSong, challengeId: payload.challengeId }
        syncSong(createdSong)
        completionDescription = `歌曲已经发布，并成功加入话题「${createChallenge?.title ?? '话题挑战'}」。`
      }

      setCreateTask({
        status: 'done',
        stage: '生成完成',
        description: completionDescription,
        progress: 100,
        canOpenSong: true,
      })
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

  async function handlePlayDjBroadcast(song: Song) {
    const audio = audioRef.current
    if (!audio) return

    try {
      const result = await generateDjBroadcast(song.id)
      const payload = result.data ?? result
      const djText = payload.djText ?? payload.text ?? 'AI DJ 播报已生成。'
      const djUrl = payload.djUrl ?? payload.audioUrl

      if (!djUrl) {
        window.alert(djText)
        return
      }

      setCurrentSongId(song.id)
      djFollowSongIdRef.current = song.id
      audio.src = resolveAssetUrl(djUrl)
      audio.load()
      await audio.play()

      const audioContext = getAudioContext()
      if (audioContext?.state === 'suspended') {
        await audioContext.resume()
      }

      window.alert(djText)
    } catch (error) {
      console.error(error)
      window.alert(error instanceof Error ? error.message : 'AI DJ 播报生成失败，请稍后重试')
    }
  }

  async function handlePublishSong(published: boolean) {
    if (!currentSong) return

    setPublishSubmitting(true)

    try {
      const nextSong = await publishSong(currentSong.id, {
        published,
        copyrightConfirmed: published ? true : undefined,
      })
      const preservedSong = { ...nextSong, challengeId: nextSong.challengeId ?? currentSong.challengeId }

      setMySongs((currentSongs) => replaceSongInList(currentSongs, preservedSong))
      setFeedSongs((currentSongs) => {
        const nextSongs = currentSongs.filter((song) => song.id !== preservedSong.id)
        return preservedSong.published ? [preservedSong, ...nextSongs] : nextSongs
      })
      setCurrentSongId(preservedSong.id)

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
          const [nextFeedSongs, nextMySongs] = await Promise.all([
            loadFeedSongs(feedTab, nextUser),
            getMySongs(),
          ])
          setFeedSongs(nextFeedSongs)
          setMySongs(nextMySongs)
          setCurrentSongId(undefined)
          void loadHostContent()
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
      if (djFollowSongIdRef.current) {
        const followSongId = djFollowSongIdRef.current
        djFollowSongIdRef.current = null
        void startPlayback(followSongId)
        return
      }
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
      clearPlayerVisualizer()
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
          const audioContext = getAudioContext()
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
    if (animationFrameRef.current) {
      window.cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    if (!isPlaying || !currentSong?.audioUrl) {
      clearPlayerVisualizer()
      return
    }

    const analyser = ensureAudioAnalyser()
    const frameData = analyserDataRef.current
    if (!analyser || !frameData) {
      clearPlayerVisualizer()
      return
    }

    const updateVisualizer = () => {
      animationFrameRef.current = window.requestAnimationFrame(updateVisualizer)
      analyser.getByteFrequencyData(frameData as Uint8Array<ArrayBuffer>)

      const canvas = playerVisualizerCanvasRef.current
      const context = canvas?.getContext('2d')
      if (!canvas || !context) return

      const ratio = window.devicePixelRatio || 1
      const width = Math.max(1, Math.floor(canvas.clientWidth * ratio))
      const height = Math.max(1, Math.floor(canvas.clientHeight * ratio))

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }

      context.fillStyle = 'rgba(8, 7, 16, 0.24)'
      context.fillRect(0, 0, width, height)

      const barCount = frameData.length
      const barWidth = width / barCount

      for (let index = 0; index < barCount; index += 1) {
        const value = frameData[index] / 255
        const barHeight = value * height * 0.42
        const x = index * barWidth
        const actualBarWidth = Math.max(2, barWidth * 0.72)

        const bottomGradient = context.createLinearGradient(0, height, 0, height - barHeight)
        bottomGradient.addColorStop(0, 'rgba(234, 76, 137, 0.95)')
        bottomGradient.addColorStop(1, 'rgba(255, 214, 231, 0.9)')

        context.globalAlpha = 0.72
        context.fillStyle = bottomGradient
        context.fillRect(x, height - barHeight, actualBarWidth, barHeight)

        const topGradient = context.createLinearGradient(0, 0, 0, barHeight * 0.6)
        topGradient.addColorStop(0, 'rgba(255, 214, 231, 0.9)')
        topGradient.addColorStop(1, 'rgba(234, 76, 137, 0.5)')

        context.fillStyle = topGradient
        context.fillRect(x, 0, actualBarWidth, barHeight * 0.6)
      }

      context.globalAlpha = 1
    }

    animationFrameRef.current = window.requestAnimationFrame(updateVisualizer)

    return () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }, [isPlaying, currentSong?.id, currentSong?.audioUrl])

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

      const [nextFeedSongs, nextMySongs] = await Promise.all([
        loadFeedSongs(feedTab, nextUser),
        getMySongs(),
      ])
      setFeedSongs(nextFeedSongs)
      setMySongs(nextMySongs)
      setCurrentSongId(nextFeedSongs[0]?.id)
      void loadHostContent()
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
    setHostPage(null)
    setCuration(null)
    setResonance(null)
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
      : activeView === 'host'
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
          visualizerCanvasRef={playerVisualizerCanvasRef}
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
            hostPage={hostPage}
            curation={curation}
            resonance={resonance}
            onChangeTab={(tab) => void changeFeedTab(tab)}
            onCreate={() => setActiveView('create')}
            onOpenHost={() => setActiveView('host')}
            onOpenSong={openSong}
          />
        ) : null}
        {activeView === 'host' ? (
          <HostProfilePage
            hostPage={hostPage}
            curation={curation}
            onBack={() => setActiveView('feed')}
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
            onSongGenerated={syncSong}
            onJoinChallenge={openChallengeCreate}
          />
        ) : null}
        {activeView === 'create' ? <CreatePage onOpenForm={openCreateForm} /> : null}
        {activeView === 'createForm' ? (
          <CreateFormPage
            mode={createMode}
            onSubmit={handleCreateSubmit}
            submitting={createSubmitting}
            initialPrompt={createMode === 'radio' || createMode === 'remix' ? radioPreset.prompt : ''}
            initialStyle={createMode === 'radio' || createMode === 'remix' ? radioPreset.style : ''}
            initialTitle={createMode === 'remix' ? radioPreset.title : ''}
            initialLyrics={createMode === 'remix' ? radioPreset.lyrics : ''}
            initialOriginId={createMode === 'remix' ? radioPreset.originId : undefined}
            challenge={createChallenge}
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
          <TaskPage
            task={createTask}
            onOpenSong={() => currentSong && openSong(currentSong.id)}
            challengeTitle={createChallenge?.title}
            onReturnToChallenge={createChallenge ? () => {
              window.history.pushState({}, '', `/challenges/${createChallenge.id}`)
              setActiveView('discover')
            } : undefined}
          />
        ) : null}
        {activeView === 'songDetail' && currentSong ? (
          <SongDetailPage
            song={currentSong}
            canManage={currentSong.author.id === user.id}
            publishing={publishSubmitting}
            onPlay={() => void handlePlaySong(currentSong.id)}
            onRemix={() => handleRemixSong(currentSong)}
            onPlayDj={() => void handlePlayDjBroadcast(currentSong)}
            onOpenPoster={() => setPosterOpen(true)}
            onPublish={() => void handlePublishSong(true)}
            onSetPrivate={() => void handlePublishSong(false)}
            onSongUpdate={syncSong}
          />
        ) : null}
        {posterOpen && currentSong ? (
          <PosterModal song={currentSong} onClose={() => setPosterOpen(false)} />
        ) : null}
      </AppLayout>
    </>
  )
}

function App() {
  if (window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/')) {
    return <AdminPage />
  }
  return <UserApp />
}

export default App
