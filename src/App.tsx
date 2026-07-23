import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { lazy, Suspense } from 'react'
import { generateDjBroadcast } from './api/ai'
import { clearToken, getCurrentUser, signIn, signUp, TOKEN_STORAGE_KEY } from './api/auth'
import { getCuration, getHostPage, type HostCuration, type HostPage } from './api/host'
import type { AlbumSummary, FeedTab, ResonanceFeedResponse } from './api/song'
import { deleteSong, getFeed, getGenerateTaskStatus, getMySongs, getResonanceFeed, getSongDetail, publishSong, recordSongPlay, searchSongs, submitAlbumTask, submitGenerateTask, submitRemixTask } from './api/song'
import { AppLayout } from './components/AppLayout'
import { BackButton } from './components/BackButton'
import { LoadingState, PageLoadingState } from './components/LoadingState'
import type { CreateChallengeContext, CreateSubmission } from './pages/create/CreateFormPage'
import type { Song, SongMode } from './types/song'
import type { User } from './types/user'
import { resolveAssetUrl } from './utils/asset'
import type { NavKey } from './utils/constants'

const AdminPage = lazy(() => import('./pages/admin/AdminPage').then((module) => ({ default: module.AdminPage })))
const AuthPage = lazy(() => import('./pages/auth/AuthPage').then((module) => ({ default: module.AuthPage })))
const CreateFormPage = lazy(() => import('./pages/create/CreateFormPage').then((module) => ({ default: module.CreateFormPage })))
const CreatePage = lazy(() => import('./pages/create/CreatePage').then((module) => ({ default: module.CreatePage })))
const CommentsPage = lazy(() => import('./pages/comments/CommentsPage').then((module) => ({ default: module.CommentsPage })))
const DiscoverPage = lazy(() => import('./pages/DiscoverPage').then((module) => ({ default: module.DiscoverPage })))
const FeedPage = lazy(() => import('./pages/FeedPage').then((module) => ({ default: module.FeedPage })))
const HostProfilePage = lazy(() => import('./pages/host/HostPage').then((module) => ({ default: module.HostPage })))
const MePage = lazy(() => import('./pages/me/MePage').then((module) => ({ default: module.MePage })))
const PlayerPage = lazy(() => import('./pages/player/PlayerPage').then((module) => ({ default: module.PlayerPage })))
const PosterModal = lazy(() => import('./components/PosterModal').then((module) => ({ default: module.PosterModal })))
const RadioPage = lazy(() => import('./pages/radio/RadioPage').then((module) => ({ default: module.RadioPage })))
const SearchPage = lazy(() => import('./pages/SearchPage').then((module) => ({ default: module.SearchPage })))
const SongDetailPage = lazy(() => import('./pages/song-detail/SongDetailPage').then((module) => ({ default: module.SongDetailPage })))
const TaskPage = lazy(() => import('./pages/TaskPage').then((module) => ({ default: module.TaskPage })))

type AppView = NavKey | 'auth' | 'createForm' | 'task' | 'songDetail' | 'comments' | 'player' | 'host' | 'search'

type AuthMode = 'login' | 'register'

type AuthValues = {
  identifier?: string
  password?: string
  nickname?: string
  inviteCode?: string
}

type CreateTaskState = {
  status: 'queued' | 'running' | 'done' | 'error'
  stage: string
  description: string
  progress: number
  canOpenSong: boolean
  queueAhead?: number
  active?: number
  maxConcurrency?: number
  albumResult?: {
    album: AlbumSummary
    tracks: Song[]
  }
}

type PendingCreateTask = {
  taskId: string
  taskLabel: string
  userId: string
  createdAt: string
  challengeId?: string
  challengeTitle?: string
  taskType?: 'song' | 'album'
}

type CreatePreset = {
  prompt: string
  style: string
  title?: string
  lyrics?: string
  originId?: string
}

type RepeatMode = 'off' | 'all' | 'one'

const AUTH_STORAGE_KEY = 'echo-auth-user'
const REPEAT_STORAGE_KEY = 'echo-repeat-mode'
const SHUFFLE_STORAGE_KEY = 'echo-shuffle-enabled'
const PENDING_CREATE_TASK_KEY = 'echo-pending-create-task'
const EMPTY_CREATE_PRESET: CreatePreset = { prompt: '', style: '' }

function waitForNextPoll(delay: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('Polling aborted', 'AbortError'))
      return
    }

    const timer = window.setTimeout(() => {
      signal.removeEventListener('abort', handleAbort)
      resolve()
    }, delay)
    const handleAbort = () => {
      window.clearTimeout(timer)
      reject(new DOMException('Polling aborted', 'AbortError'))
    }
    signal.addEventListener('abort', handleAbort, { once: true })
  })
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError'
}

function isTerminalTaskLookupError(error: unknown) {
  const message = error instanceof Error ? error.message.toLowerCase() : ''
  return message.includes('task not found') || message.includes('forbidden') || message.includes('unauthorized')
}

function getTaskErrorMessage(error: string | { message?: string } | null | undefined) {
  if (!error) return ''
  let message = typeof error === 'string' ? error : error.message ?? ''

  if (message.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(message) as { message?: unknown }
      if (typeof parsed.message === 'string') message = parsed.message
    } catch {
      // Keep a non-JSON provider message as-is.
    }
  }

  if (/prisma|invalid `.*invocation|argument `.*is missing/i.test(message)) {
    return '生成结果保存失败，请稍后重新尝试。'
  }
  return message
}

function formatGenerateStage(stage: string | undefined, taskLabel: string) {
  if (!stage) return `正在生成${taskLabel}`
  if (stage === 'generating music') return '正在生成音乐'
  if (stage === 'generating cover') return '正在生成封面'
  if (stage === 'generating review') return '正在生成 AI 乐评'
  if (stage === 'generating remix music') return '正在生成翻唱二创'
  if (stage === 'album running') return '正在策划专辑'
  if (stage === 'done') return '生成完成'
  if (stage === 'failed') return '生成失败'

  const waitingTrackStage = stage.match(/^waiting for track (\d+)\/(\d+) AI$/)
  if (waitingTrackStage) return `等待制作第 ${waitingTrackStage[1]}/${waitingTrackStage[2]} 首`

  const albumStage = stage.match(/^creating track (\d+)\/(\d+)(?:: (.+))?$/)
  if (albumStage) {
    const action = albumStage[3] === 'generating lyrics' ? '生成歌词' : albumStage[3] === 'generating music' ? '生成音乐' : '制作歌曲'
    return `正在${action} ${albumStage[1]}/${albumStage[2]}`
  }

  return stage
}

function describeRunningStage(stage: string, taskLabel: string) {
  if (stage.includes('封面')) return '音乐已经生成，AI 正在制作作品封面。'
  if (stage.includes('乐评')) return '音乐和封面已经就绪，AI 正在撰写乐评。'
  if (stage.includes('歌词')) return 'AI 正在根据主题和风格创作歌词。'
  return `AI 正在生成${taskLabel}，完成后会自动展示结果。`
}

function getSavedRepeatMode(): RepeatMode {
  const savedMode = window.localStorage.getItem(REPEAT_STORAGE_KEY)
  return savedMode === 'all' || savedMode === 'one' ? savedMode : 'off'
}

function getSavedShuffleEnabled() {
  return window.localStorage.getItem(SHUFFLE_STORAGE_KEY) === 'true'
}

function getSharedSongId() {
  return new URLSearchParams(window.location.search).get('s')?.trim() || null
}

function uniqSongs(songs: Song[]) {
  const songMap = new Map<string, Song>()
  songs.forEach((song) => songMap.set(song.id, song))
  return [...songMap.values()]
}

function uniqSongIds(songs: Song[]) {
  return uniqSongs(songs).map((song) => song.id)
}

function UserApp() {
  const [activeView, setActiveView] = useState<AppView>('auth')
  const [user, setUser] = useState<User | null>(null)
  const [feedSongs, setFeedSongs] = useState<Song[]>([])
  const [mySongs, setMySongs] = useState<Song[]>([])
  const [hostPage, setHostPage] = useState<HostPage | null>(null)
  const [curation, setCuration] = useState<HostCuration | null>(null)
  const [resonance, setResonance] = useState<ResonanceFeedResponse | null>(null)
  const [feedTab, setFeedTab] = useState<FeedTab>('resonance')
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Song[]>([])
  const [searchReturnView, setSearchReturnView] = useState<AppView>('feed')
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [createMode, setCreateMode] = useState<SongMode>('song')
  const [createChallenge, setCreateChallenge] = useState<CreateChallengeContext | null>(null)
  const [radioPreset, setRadioPreset] = useState<CreatePreset>(EMPTY_CREATE_PRESET)
  const [currentSongId, setCurrentSongId] = useState<string>()
  const [detailSongId, setDetailSongId] = useState<string>()
  const [posterOpen, setPosterOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)
  const [createSubmitting, setCreateSubmitting] = useState(false)
  const [publishSubmitting, setPublishSubmitting] = useState(false)
  const [createTask, setCreateTask] = useState<CreateTaskState | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [playbackDuration, setPlaybackDuration] = useState(0)
  const [pendingPlaySongId, setPendingPlaySongId] = useState<string | null>(null)
  const [playbackSongs, setPlaybackSongs] = useState<Song[]>([])
  const [playbackQueue, setPlaybackQueue] = useState<string[]>([])
  const [playbackQueueIndex, setPlaybackQueueIndex] = useState(0)
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(getSavedRepeatMode)
  const [shuffleEnabled, setShuffleEnabled] = useState(getSavedShuffleEnabled)
  const [songReturnView, setSongReturnView] = useState<AppView>('feed')
  const [playerReturnView, setPlayerReturnView] = useState<AppView>('feed')
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const playerVisualizerCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null)
  const analyserDataRef = useRef<Uint8Array | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const activeViewRef = useRef<AppView>(activeView)
  const taskPollingControllerRef = useRef<AbortController | null>(null)
  const pollingTaskIdRef = useRef<string | null>(null)
  const djFollowSongIdRef = useRef<string | null>(null)
  const sharedSongIdRef = useRef<string | null>(getSharedSongId())

  const allSongs = useMemo(() => {
    const songMap = new Map<string, Song>()
    ;[...feedSongs, ...mySongs, ...searchResults, ...playbackSongs].forEach((song) => {
      const existing = songMap.get(song.id)
      songMap.set(song.id, {
        ...existing,
        ...song,
        liked: Boolean(existing?.liked || song.liked),
      })
    })
    return [...songMap.values()]
  }, [feedSongs, mySongs, searchResults, playbackSongs])

  const currentSong = currentSongId
    ? allSongs.find((song) => song.id === currentSongId)
    : undefined
  const detailSong = detailSongId
    ? allSongs.find((song) => song.id === detailSongId)
    : undefined
  const currentQueueSongs = useMemo(() => {
    const queueIds =
      playbackQueue.length && currentSongId && playbackQueue.includes(currentSongId)
        ? playbackQueue
        : currentSongId
          ? uniqSongIds(getSourceSongsForPlayback(currentSongId))
          : []

    return queueIds
      .map((songId) => allSongs.find((song) => song.id === songId))
      .filter((song): song is Song => Boolean(song))
  }, [playbackQueue, currentSongId, allSongs, activeView, songReturnView, feedSongs, mySongs, hostPage, curation])
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
    if (activeView !== 'songDetail' && activeView !== 'player') {
      setSongReturnView(activeView)
    }
    setDetailSongId(songId)
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
        setDetailSongId(nextSong.id)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  function openSharedSong(songId: string) {
    setSongReturnView('feed')
    setDetailSongId(songId)
    setActiveView('songDetail')
    void getSongDetail(songId)
      .then((nextSong) => {
        setFeedSongs((currentSongs) => replaceSongInList(currentSongs, nextSong))
        setMySongs((currentSongs) =>
          currentSongs.some((song) => song.id === nextSong.id)
            ? replaceSongInList(currentSongs, nextSong)
            : currentSongs,
        )
        setPlaybackSongs((currentSongs) => replaceSongInList(currentSongs, nextSong))
        setDetailSongId(nextSong.id)
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

  function syncSong(nextSong: Song, options?: { makeCurrent?: boolean }) {
    setMySongs((currentSongs) => replaceSongInList(currentSongs, nextSong))
    setFeedSongs((currentSongs) => {
      const exists = currentSongs.some((song) => song.id === nextSong.id)
      if (!exists) return currentSongs
      return replaceSongInList(currentSongs, nextSong)
    })
    if (options?.makeCurrent) {
      setCurrentSongId(nextSong.id)
      setDetailSongId(nextSong.id)
    }
  }

  function navigate(key: NavKey) {
    if (key === 'discover') window.history.pushState({}, '', '/discover')
    setActiveView(key)
  }

  async function handleSearch() {
    const keyword = searchInput.trim()
    if (!keyword) return

    if (activeView !== 'search') setSearchReturnView(activeView)
    setSearchQuery(keyword)
    setSearchLoading(true)
    setSearchError('')
    setActiveView('search')
    window.history.pushState({}, '', `/search?q=${encodeURIComponent(keyword)}`)

    try {
      const results = await searchSongs(keyword)
      setSearchResults(results)
      rememberPlaybackSongs(results)
    } catch (error) {
      setSearchResults([])
      setSearchError(error instanceof Error ? error.message : '搜索失败，请稍后重试。')
    } finally {
      setSearchLoading(false)
    }
  }

  function openPlayerView() {
    if (activeView !== 'player') {
      setPlayerReturnView(activeView === 'auth' ? 'feed' : activeView)
    }
    setActiveView('player')
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

  function rememberPlaybackSongs(songs: Song[]) {
    if (!songs.length) return
    setPlaybackSongs((current) => uniqSongs([...songs, ...current]))
  }

  function getSourceSongsForPlayback(songId: string) {
    const sourceView = activeView === 'songDetail' || activeView === 'player' ? songReturnView : activeView

    if (sourceView === 'feed') {
      return feedSongs.some((song) => song.id === songId) ? feedSongs : allSongs
    }

    if (sourceView === 'me' || sourceView === 'discover' || sourceView === 'radio') {
      return mySongs.some((song) => song.id === songId) ? mySongs : allSongs
    }

    if (sourceView === 'host') {
      const hostSongs = uniqSongs([
        ...(hostPage?.featuredSongs ?? []),
        ...(hostPage?.todayPick ? [hostPage.todayPick] : []),
        ...(curation?.featuredSong ? [curation.featuredSong] : []),
        ...(curation?.recommendations ?? []),
      ])
      return hostSongs.some((song) => song.id === songId) ? hostSongs : allSongs
    }

    return allSongs
  }

  function preparePlaybackQueue(songId: string, queueSongs?: Song[]) {
    const sourceSongs = queueSongs?.length ? queueSongs : getSourceSongsForPlayback(songId)
    const sourceIds = uniqSongIds(sourceSongs)
    const nextQueue = sourceIds.includes(songId) ? sourceIds : [songId]

    rememberPlaybackSongs(sourceSongs)
    setPlaybackQueue(nextQueue)
    setPlaybackQueueIndex(Math.max(0, nextQueue.indexOf(songId)))
  }

  async function ensurePlayableSong(songId: string) {
    if (allSongs.some((song) => song.id === songId)) return

    try {
      const nextSong = await getSongDetail(songId)
      rememberPlaybackSongs([nextSong])
    } catch (error) {
      console.error(error)
    }
  }

  async function startPlayback(
    songId?: string,
    queueSongs?: Song[],
    forceSongSource = false,
  ) {
    const nextSongId = songId ?? currentSong?.id
    if (!nextSongId) return

    if (songId) djFollowSongIdRef.current = null

    if (songId) {
      preparePlaybackQueue(songId, queueSongs)
      await ensurePlayableSong(songId)
    }

    if (
      forceSongSource &&
      songId &&
      currentSong?.id === songId &&
      currentSong.audioUrl
    ) {
      const audio = audioRef.current
      if (audio) {
        audio.src = resolveAssetUrl(currentSong.audioUrl)
        audio.load()
        await audio.play()
        const audioContext = getAudioContext()
        if (audioContext?.state === 'suspended') {
          await audioContext.resume()
        }
      }
    } else if (songId && songId !== currentSongId) {
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

  function playAdjacentSong(direction: 'prev' | 'next', auto = false) {
    const audio = audioRef.current
    if (direction === 'prev' && audio && audio.currentTime > 3) {
      audio.currentTime = 0
      return
    }

    const queue =
      playbackQueue.length && currentSongId && playbackQueue.includes(currentSongId)
        ? playbackQueue
        : currentSongId
          ? uniqSongIds(getSourceSongsForPlayback(currentSongId))
          : []
    if (!queue.length) return

    const baseIndex = currentSongId ? Math.max(0, queue.indexOf(currentSongId)) : playbackQueueIndex
    let nextIndex = direction === 'next' ? baseIndex + 1 : baseIndex - 1

    if (direction === 'next' && shuffleEnabled && queue.length > 1) {
      const candidates = queue.map((_, index) => index).filter((index) => index !== baseIndex)
      nextIndex = candidates[Math.floor(Math.random() * candidates.length)]
    }

    if (direction === 'next' && nextIndex >= queue.length) {
      if (repeatMode === 'all' || !auto) nextIndex = 0
      else return
    }

    if (direction === 'prev' && nextIndex < 0) {
      nextIndex = queue.length - 1
    }

    const nextSongId = queue[nextIndex]
    if (!nextSongId) return

    setPlaybackQueue(queue)
    setPlaybackQueueIndex(nextIndex)
    const queueSongs = queue
      .map((queuedSongId) => allSongs.find((song) => song.id === queuedSongId))
      .filter((song): song is Song => Boolean(song))
    void startPlayback(nextSongId, queueSongs)
  }

  function playQueuedSong(songId: string, queueSongs: Song[]) {
    const queue = uniqSongIds(queueSongs)
    const nextIndex = Math.max(0, queue.indexOf(songId))
    setPlaybackQueue(queue.length ? queue : [songId])
    setPlaybackQueueIndex(nextIndex)
    void startPlayback(songId, queueSongs)
  }

  function removeQueuedSong(songId: string) {
    const queue = playbackQueue.length ? playbackQueue : uniqSongIds(currentQueueSongs)
    const removedIndex = queue.indexOf(songId)
    const nextQueue = queue.filter((queuedSongId) => queuedSongId !== songId)
    const nextQueueSongs = nextQueue
      .map((queuedSongId) => allSongs.find((song) => song.id === queuedSongId))
      .filter((queuedSong): queuedSong is Song => Boolean(queuedSong))

    setPlaybackQueue(nextQueue)

    if (currentSongId === songId) {
      const nextSongId = nextQueue[removedIndex] ?? nextQueue[removedIndex - 1] ?? nextQueue[0]
      if (nextSongId) {
        setPlaybackQueueIndex(Math.max(0, nextQueue.indexOf(nextSongId)))
        void startPlayback(nextSongId, nextQueueSongs)
      } else {
        pausePlayback()
        setCurrentSongId(undefined)
        setPendingPlaySongId(null)
        setPlaybackQueueIndex(0)
      }
      return
    }

    const activeIndex = currentSongId ? nextQueue.indexOf(currentSongId) : playbackQueueIndex
    setPlaybackQueueIndex(Math.max(0, activeIndex >= 0 ? activeIndex : Math.min(playbackQueueIndex, nextQueue.length - 1)))
  }

  function cycleRepeatMode() {
    let nextRepeatMode: RepeatMode = 'all'
    let nextShuffleEnabled = false

    if (shuffleEnabled) {
      nextRepeatMode = 'one'
    } else if (repeatMode === 'one') {
      nextRepeatMode = 'all'
    } else {
      nextRepeatMode = 'off'
      nextShuffleEnabled = true
    }

    setRepeatMode(nextRepeatMode)
    setShuffleEnabled(nextShuffleEnabled)
    window.localStorage.setItem(REPEAT_STORAGE_KEY, nextRepeatMode)
    window.localStorage.setItem(SHUFFLE_STORAGE_KEY, String(nextShuffleEnabled))
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

  function showSubmittedTask(task: Awaited<ReturnType<typeof submitGenerateTask>>, taskLabel: string) {
    const queueAhead = task.queueAhead ?? task.queuePos ?? 0
    const maxConcurrency = task.maxConcurrency ?? task.concurrency
    setCreateTask({
      status: 'queued',
      stage: queueAhead > 0 ? '等待生成' : '正在分配生成资源',
      description: queueAhead > 0
        ? `请求已进入 AI 队列，前面还有 ${queueAhead} 个请求。`
        : `任务已提交，正在等待生成${taskLabel}。`,
      progress: 10,
      canOpenSong: false,
      queueAhead,
      active: task.active,
      maxConcurrency,
    })
  }

  function rememberPendingTask(
    taskId: string,
    taskLabel: string,
    challenge?: { id: string; title?: string },
    taskType: 'song' | 'album' = 'song',
  ) {
    if (!user) return
    window.localStorage.setItem(PENDING_CREATE_TASK_KEY, JSON.stringify({
      taskId,
      taskLabel,
      userId: user.id,
      createdAt: new Date().toISOString(),
      challengeId: challenge?.id,
      challengeTitle: challenge?.title,
      taskType,
    } satisfies PendingCreateTask))
  }

  function clearPendingTask(taskId: string) {
    const saved = window.localStorage.getItem(PENDING_CREATE_TASK_KEY)
    if (!saved) return
    try {
      const pending = JSON.parse(saved) as PendingCreateTask
      if (pending.taskId === taskId) window.localStorage.removeItem(PENDING_CREATE_TASK_KEY)
    } catch {
      window.localStorage.removeItem(PENDING_CREATE_TASK_KEY)
    }
  }

  async function pollGenerateTask(taskId: string, taskLabel: string) {
    taskPollingControllerRef.current?.abort()
    const controller = new AbortController()
    taskPollingControllerRef.current = controller
    pollingTaskIdRef.current = taskId
    let transientFailures = 0

    try {
      while (!controller.signal.aborted) {
      let status
      try {
        status = await getGenerateTaskStatus(taskId, controller.signal)
        transientFailures = 0
      } catch (error) {
        if (isAbortError(error)) throw error
        if (isTerminalTaskLookupError(error)) throw error
        transientFailures += 1
        const retryDelay = [3000, 5000, 10000, 15000][Math.min(transientFailures - 1, 3)]
        await waitForNextPoll(retryDelay, controller.signal)
        continue
      }
      const taskError = getTaskErrorMessage(status.error)
      const queueAhead = status.queueAhead ?? status.queuePos ?? 0
      const maxConcurrency = status.maxConcurrency ?? status.concurrency
      const isQueued = status.status === 'queued'
      const displayStage = isQueued ? '等待生成' : formatGenerateStage(status.stage, taskLabel)
      setCreateTask({
        status: status.status === 'error' || status.status === 'failed' ? 'error' : isQueued ? 'queued' : 'running',
        stage: displayStage,
        description: isQueued
          ? queueAhead > 0
            ? `当前生成资源繁忙，前面还有 ${queueAhead} 个 AI 请求。`
            : '队列即将轮到你，正在分配生成资源。'
          : describeRunningStage(displayStage, taskLabel),
        progress: isQueued ? Math.min(status.progress ?? 10, 20) : status.progress ?? 40,
        canOpenSong: false,
        queueAhead,
        active: status.active,
        maxConcurrency,
      })
      if (status.status === 'done') {
        const taskSong = status.result?.song
        if (!taskSong) throw new Error(`${taskLabel}已经完成，但暂时无法读取生成结果。`)
        clearPendingTask(taskId)
        return taskSong
      }
      if (status.status === 'error' || status.status === 'failed') {
        clearPendingTask(taskId)
        throw new Error(taskError || `${taskLabel}生成失败。`)
      }

        const pollDelay = document.hidden ? 15000 : activeViewRef.current === 'task' ? 2500 : 8000
        await waitForNextPoll(pollDelay, controller.signal)
      }

      throw new DOMException('Polling aborted', 'AbortError')
    } finally {
      if (pollingTaskIdRef.current === taskId) pollingTaskIdRef.current = null
      if (taskPollingControllerRef.current === controller) taskPollingControllerRef.current = null
    }
  }

  async function pollAlbumTask(taskId: string) {
    taskPollingControllerRef.current?.abort()
    const controller = new AbortController()
    taskPollingControllerRef.current = controller
    pollingTaskIdRef.current = taskId
    let transientFailures = 0

    try {
      while (!controller.signal.aborted) {
        let status
        try {
          status = await getGenerateTaskStatus(taskId, controller.signal)
          transientFailures = 0
        } catch (error) {
          if (isAbortError(error)) throw error
          if (isTerminalTaskLookupError(error)) throw error
          transientFailures += 1
          const retryDelay = [3000, 5000, 10000, 15000][Math.min(transientFailures - 1, 3)]
          await waitForNextPoll(retryDelay, controller.signal)
          continue
        }

        const taskError = getTaskErrorMessage(status.error)
        const queueAhead = status.queueAhead ?? status.queuePos ?? 0
        const maxConcurrency = status.maxConcurrency ?? status.concurrency
        const isQueued = status.status === 'queued'
        const displayStage = isQueued ? '等待生成' : formatGenerateStage(status.stage, '概念 EP')
        const album = status.result?.album ?? status.album ?? undefined
        const tracks = status.result?.tracks ?? status.result?.songs ?? []
        setCreateTask({
          status: status.status === 'error' || status.status === 'failed' ? 'error' : isQueued ? 'queued' : 'running',
          stage: displayStage,
          description: isQueued
            ? queueAhead > 0
              ? `当前生成资源繁忙，前面还有 ${queueAhead} 个 AI 请求。`
              : '队列即将轮到你，正在分配专辑制作资源。'
            : describeRunningStage(displayStage, '概念 EP'),
          progress: isQueued ? Math.min(status.progress ?? 10, 20) : status.progress ?? 40,
          canOpenSong: false,
          queueAhead,
          active: status.active,
          maxConcurrency,
          albumResult: album ? { album, tracks } : undefined,
        })

        if (status.status === 'done') {
          if (!album) throw new Error('专辑已经完成，但暂时无法读取专辑信息。')
          clearPendingTask(taskId)
          return { album, tracks }
        }
        if (status.status === 'error' || status.status === 'failed') {
          clearPendingTask(taskId)
          throw new Error(taskError || '概念 EP 制作失败。')
        }

        const pollDelay = document.hidden ? 15000 : activeViewRef.current === 'task' ? 2500 : 8000
        await waitForNextPoll(pollDelay, controller.signal)
      }

      throw new DOMException('Polling aborted', 'AbortError')
    } finally {
      if (pollingTaskIdRef.current === taskId) pollingTaskIdRef.current = null
      if (taskPollingControllerRef.current === controller) taskPollingControllerRef.current = null
    }
  }

  async function handleCreateSubmit(payload: CreateSubmission) {
    setCreateSubmitting(true)
    setCreateTask({
      status: 'running',
      stage: '正在生成中',
      description: '正在生成歌曲、封面和相关内容，请稍候。',
      progress: 24,
      canOpenSong: false,
    })
    setActiveView('task')

    try {
      if (payload.mode === 'album') {
        const task = await submitAlbumTask({
          theme: payload.prompt,
          trackCount: payload.albumTrackCount ?? 4,
        })
        if (!task.taskId) throw new Error('专辑任务提交失败，请稍后重试。')
        rememberPendingTask(task.taskId, '概念 EP', undefined, 'album')
        showSubmittedTask(task, '概念 EP')
        const albumResult = await pollAlbumTask(task.taskId)
        albumResult.tracks.forEach((track) => syncSong(track))
        if (albumResult.tracks[0]) syncSong(albumResult.tracks[0], { makeCurrent: true })
        setCreateTask({
          status: 'done',
          stage: '专辑制作完成',
          description: `${albumResult.album.title} 已完成，共 ${albumResult.tracks.length} 首歌曲。`,
          progress: 100,
          canOpenSong: albumResult.tracks.length > 0,
          albumResult,
        })
        return
      }

      let createdSong: Song
      if (payload.mode === 'remix' && payload.originId) {
        const task = await submitRemixTask(payload.originId, {
          title: payload.title,
          style: payload.style,
          lyrics: payload.lyrics,
          prompt: payload.prompt || `翻唱二创《${payload.title}》`,
        })
        if (!task.taskId) throw new Error('二创任务提交失败，请稍后重试。')
        rememberPendingTask(task.taskId, '翻唱二创')
        showSubmittedTask(task, '翻唱二创')
        createdSong = await pollGenerateTask(task.taskId, '翻唱二创')
      } else if (payload.mode === 'radio' || payload.challengeId) {
        const task = await submitGenerateTask(payload)
        if (!task.taskId) throw new Error('歌曲生成任务提交失败，请稍后重试。')
        const taskLabel = payload.challengeId ? '话题挑战歌曲' : '电台音乐'
        rememberPendingTask(
          task.taskId,
          taskLabel,
          payload.challengeId ? { id: payload.challengeId, title: createChallenge?.title } : undefined,
        )
        showSubmittedTask(task, taskLabel)
        createdSong = await pollGenerateTask(task.taskId, taskLabel)
        if (payload.challengeId) createdSong = { ...createdSong, challengeId: payload.challengeId }
      } else {
        const task = await submitGenerateTask(payload)
        if (!task.taskId) throw new Error('歌曲生成任务提交失败，请稍后重试。')
        rememberPendingTask(task.taskId, '歌曲')
        showSubmittedTask(task, '歌曲')
        createdSong = await pollGenerateTask(task.taskId, '歌曲')
      }
      syncSong(createdSong, { makeCurrent: true })
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
        syncSong(createdSong, { makeCurrent: true })
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
      if (isAbortError(error)) return
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

  async function handlePlaySong(
    songId: string,
    queueSongs?: Song[],
    options: { openPlayer?: boolean } = {},
  ) {
    setCurrentSongId(songId)
    if (options.openPlayer ?? true) {
      openPlayerView()
    }
    void startPlayback(songId, queueSongs)
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

      djFollowSongIdRef.current = song.id
      setCurrentSongId(song.id)
      audio.src = resolveAssetUrl(djUrl)
      audio.load()
      await audio.play()

      const audioContext = getAudioContext()
      if (audioContext?.state === 'suspended') {
        await audioContext.resume()
      }

    } catch (error) {
      djFollowSongIdRef.current = null
      console.error(error)
      window.alert(error instanceof Error ? error.message : 'AI DJ 播报生成失败，请稍后重试')
    }
  }

  async function handlePublishSong(published: boolean) {
    const targetSong = detailSong ?? currentSong
    if (!targetSong) return

    setPublishSubmitting(true)

    try {
      const nextSong = await publishSong(targetSong.id, {
        published,
        copyrightConfirmed: published ? true : undefined,
      })
      const preservedSong = { ...nextSong, challengeId: nextSong.challengeId ?? targetSong.challengeId }

      setMySongs((currentSongs) => replaceSongInList(currentSongs, preservedSong))
      setFeedSongs((currentSongs) => {
        const nextSongs = currentSongs.filter((song) => song.id !== preservedSong.id)
        return preservedSong.published ? [preservedSong, ...nextSongs] : nextSongs
      })
      setDetailSongId(preservedSong.id)

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

  async function handleDeleteSong(songId: string) {
    await deleteSong(songId)
    setMySongs((currentSongs) => currentSongs.filter((song) => song.id !== songId))
    setFeedSongs((currentSongs) => currentSongs.filter((song) => song.id !== songId))

    if (currentSongId === songId) {
      pausePlayback()
      setCurrentSongId(undefined)
    }
    if (detailSongId === songId) {
      setDetailSongId(undefined)
      setActiveView('me')
    }

    setPlaybackSongs((currentSongs) => currentSongs.filter((song) => song.id !== songId))
    setPlaybackQueue((currentQueue) => {
      const nextQueue = currentQueue.filter((queuedSongId) => queuedSongId !== songId)
      setPlaybackQueueIndex((currentIndex) => Math.min(currentIndex, Math.max(0, nextQueue.length - 1)))
      return nextQueue
    })

    window.alert('作品已删除。')
  }

  useEffect(() => {
    activeViewRef.current = activeView
  }, [activeView])

  useEffect(() => {
    if (!user || pollingTaskIdRef.current) return
    const saved = window.localStorage.getItem(PENDING_CREATE_TASK_KEY)
    if (!saved) return

    let pending: PendingCreateTask
    try {
      pending = JSON.parse(saved) as PendingCreateTask
    } catch {
      window.localStorage.removeItem(PENDING_CREATE_TASK_KEY)
      return
    }
    if (!pending.taskId || pending.userId !== user.id) return

    setCreateSubmitting(true)
    setCreateTask({
      status: 'queued',
      stage: '正在恢复生成任务',
      description: '已找到未完成的任务，正在同步最新生成进度。',
      progress: 10,
      canOpenSong: false,
    })
    setActiveView('task')

    if (pending.taskType === 'album') {
      void pollAlbumTask(pending.taskId)
        .then((albumResult) => {
          albumResult.tracks.forEach((track) => syncSong(track))
          if (albumResult.tracks[0]) syncSong(albumResult.tracks[0], { makeCurrent: true })
          setCreateTask({
            status: 'done',
            stage: '专辑制作完成',
            description: `${albumResult.album.title} 已完成，共 ${albumResult.tracks.length} 首歌曲。`,
            progress: 100,
            canOpenSong: albumResult.tracks.length > 0,
            albumResult,
          })
        })
        .catch((error) => {
          if (isAbortError(error)) return
          setCreateTask({
            status: 'error',
            stage: '专辑制作失败',
            description: error instanceof Error ? error.message : '恢复专辑任务失败，请稍后重试。',
            progress: 100,
            canOpenSong: false,
          })
        })
        .finally(() => setCreateSubmitting(false))
      return
    }

    void pollGenerateTask(pending.taskId, pending.taskLabel || '歌曲')
      .then(async (createdSong) => {
        let completedSong = createdSong
        let description = '歌曲、封面和乐评都已经准备好了，现在可以查看详情或继续发布。'
        if (pending.challengeId) {
          const publishedSong = await publishSong(createdSong.id, {
            published: true,
            copyrightConfirmed: true,
          })
          completedSong = {
            ...createdSong,
            ...publishedSong,
            challengeId: pending.challengeId,
          }
          description = `歌曲已经发布，并成功加入话题「${pending.challengeTitle ?? '话题挑战'}」。`
        }
        syncSong(completedSong, { makeCurrent: true })
        setCreateTask({
          status: 'done',
          stage: '生成完成',
          description,
          progress: 100,
          canOpenSong: true,
        })
      })
      .catch((error) => {
        if (isAbortError(error)) return
        setCreateTask({
          status: 'error',
          stage: '生成失败',
          description: error instanceof Error ? error.message : '恢复生成任务失败，请稍后重试。',
          progress: 100,
          canOpenSong: false,
        })
      })
      .finally(() => setCreateSubmitting(false))
  }, [user])

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
          if (sharedSongIdRef.current) {
            openSharedSong(sharedSongIdRef.current)
          }
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
  }, [])

  useEffect(() => {
    return () => {
      taskPollingControllerRef.current?.abort()
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
    const handlePlaying = () => {
      setIsPlaying(true)
      setIsBuffering(false)
    }
    const handlePause = () => {
      setIsPlaying(false)
      setIsBuffering(false)
    }
    const handleBuffering = () => setIsBuffering(true)
    const handleCanPlay = () => setIsBuffering(false)
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleLoadedMetadata = () => setPlaybackDuration(audio.duration || currentSong?.duration || 0)
    const handleEnded = () => {
      if (djFollowSongIdRef.current) {
        const followSongId = djFollowSongIdRef.current
        djFollowSongIdRef.current = null
        void startPlayback(followSongId, undefined, true)
        return
      }
      if (repeatMode === 'one') {
        audio.currentTime = 0
        void audio.play().catch((error) => {
          console.error(error)
        })
        return
      }
      setIsPlaying(false)
      playAdjacentSong('next', true)
    }

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('playing', handlePlaying)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('loadstart', handleBuffering)
    audio.addEventListener('waiting', handleBuffering)
    audio.addEventListener('stalled', handleBuffering)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('error', handleCanPlay)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('playing', handlePlaying)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('loadstart', handleBuffering)
      audio.removeEventListener('waiting', handleBuffering)
      audio.removeEventListener('stalled', handleBuffering)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('error', handleCanPlay)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentSong?.duration, repeatMode, playbackQueue, currentSongId, playbackQueueIndex, allSongs])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (djFollowSongIdRef.current === currentSong?.id) return

    if (!currentSong?.audioUrl) {
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
      setIsPlaying(false)
      setIsBuffering(false)
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
      setCurrentSongId(undefined)
      setDetailSongId(undefined)
      if (sharedSongIdRef.current) {
        openSharedSong(sharedSongIdRef.current)
      }
      void loadHostContent()
    } catch (error) {
      console.error(error)
      window.alert(error instanceof Error ? error.message : '璁よ瘉澶辫触锛岃绋嶅悗閲嶈瘯')
    } finally {
      setAuthLoading(false)
    }
  }

  function handleLogout() {
    taskPollingControllerRef.current?.abort()
    taskPollingControllerRef.current = null
    pollingTaskIdRef.current = null
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
          <PageLoadingState />
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
    activeView === 'player' || activeView === 'songDetail' || activeView === 'comments'
      ? 'feed'
      : activeView === 'host'
        ? 'discover'
      : activeView === 'search'
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
          isBuffering={isBuffering}
          repeatMode={repeatMode}
          shuffleEnabled={shuffleEnabled}
          currentTime={currentTime}
          duration={playbackDuration || currentSong?.duration || 0}
          queueSongs={currentQueueSongs}
          currentSongId={currentSongId}
          visualizerCanvasRef={playerVisualizerCanvasRef}
          onTogglePlay={togglePlayback}
          onPlayPrev={() => playAdjacentSong('prev')}
          onPlayNext={() => playAdjacentSong('next')}
          onCycleRepeat={cycleRepeatMode}
          onPlayQueueSong={(songId) => playQueuedSong(songId, currentQueueSongs)}
          onRemoveQueueSong={removeQueuedSong}
          onSeek={seekPlayback}
          onClose={() => setActiveView(playerReturnView)}
          onBackHome={() => setActiveView(playerReturnView)}
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
        queueSongs={currentQueueSongs}
        currentSongId={currentSongId}
        isPlaying={isPlaying}
        isBuffering={isBuffering}
        repeatMode={repeatMode}
        shuffleEnabled={shuffleEnabled}
        progress={playbackProgress}
        user={user}
        task={createTask}
        onOpenTask={() => setActiveView('task')}
        onNavigate={navigate}
        onOpenPlayer={openPlayerView}
        onTogglePlay={togglePlayback}
        onPlayPrev={() => playAdjacentSong('prev')}
        onPlayNext={() => playAdjacentSong('next')}
        onCycleRepeat={cycleRepeatMode}
        onPlayQueueSong={(songId) => playQueuedSong(songId, currentQueueSongs)}
        onRemoveQueueSong={removeQueuedSong}
        onLogout={handleLogout}
        searchValue={searchInput}
        onSearchValueChange={setSearchInput}
        onSearch={() => void handleSearch()}
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
            onPlaySong={(songId) => void handlePlaySong(songId, feedSongs, { openPlayer: false })}
            searchValue={searchInput}
            onSearchValueChange={setSearchInput}
            onSearch={() => void handleSearch()}
          />
        ) : null}
        {activeView === 'host' ? (
          <HostProfilePage
            hostPage={hostPage}
            curation={curation}
            onBack={() => {
              window.history.pushState({}, '', '/discover')
              setActiveView('discover')
            }}
            onCreate={() => setActiveView('create')}
            onOpenSong={openSong}
          />
        ) : null}
        {activeView === 'search' ? (
          <SearchPage
            query={searchQuery}
            songs={searchResults}
            loading={searchLoading}
            error={searchError}
            onBack={() => {
              setActiveView(searchReturnView)
              window.history.back()
            }}
            onOpenSong={openSong}
            onPlaySong={(songId) => void handlePlaySong(songId, searchResults, { openPlayer: false })}
          />
        ) : null}
        {activeView === 'discover' ? (
          <DiscoverPage
            user={user}
            songs={mySongs}
            battleSongs={feedSongs}
            onOpenSong={openSong}
            onPlaySong={(songId) => void handlePlaySong(songId)}
            onSongGenerated={syncSong}
            onJoinChallenge={openChallengeCreate}
            onOpenHost={() => setActiveView('host')}
          />
        ) : null}
        {activeView === 'create' ? <CreatePage onOpenForm={openCreateForm} /> : null}
        {activeView === 'createForm' ? (
          <>
            <div className="page-back-row">
              <BackButton label="返回上一页" onClick={() => {
                if (createChallenge) {
                  window.history.pushState({}, '', `/challenges/${createChallenge.id}`)
                  setActiveView('discover')
                  return
                }
                if (createMode === 'remix' && radioPreset.originId) {
                  setActiveView('songDetail')
                  return
                }
                setActiveView(createMode === 'radio' ? 'radio' : 'create')
              }} />
            </div>
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
          </>
        ) : null}
        {activeView === 'radio' ? (
          <RadioPage
            songs={mySongs}
            onOpenSong={openSong}
            onPlaySong={(songId) => void handlePlaySong(songId)}
            onPlayDj={(songId) => {
              const song = mySongs.find((item) => item.id === songId)
              if (song) void handlePlayDjBroadcast(song)
            }}
            onGenerate={(preset) => {
              setRadioPreset(preset)
              openCreateForm('radio')
            }}
          />
        ) : null}
        {activeView === 'me' ? (
          <MePage
            user={user}
            songs={mySongs}
            onOpenSong={openSong}
            onPlaySong={(songId, queueSongs) => void handlePlaySong(songId, queueSongs, { openPlayer: false })}
          />
        ) : null}
        {activeView === 'task' && createTask ? (
          <>
            <div className="page-back-row">
              <BackButton label="返回上一页" onClick={() => setActiveView('createForm')} />
            </div>
            <TaskPage
              task={createTask}
              onOpenSong={() => detailSong ? openSong(detailSong.id) : currentSong && openSong(currentSong.id)}
              onOpenAlbumSong={openSong}
              challengeTitle={createChallenge?.title}
              onReturnToChallenge={createChallenge ? () => {
                window.history.pushState({}, '', `/challenges/${createChallenge.id}`)
                setActiveView('discover')
              } : undefined}
            />
          </>
        ) : null}
        {activeView === 'songDetail' && detailSong ? (
          <>
            <div className="page-back-row">
              <BackButton label="返回上一页" onClick={() => setActiveView(songReturnView)} />
            </div>
            <SongDetailPage
              song={detailSong}
              canManage={detailSong.author.id === user.id}
              publishing={publishSubmitting}
              onPlay={() => void handlePlaySong(detailSong.id)}
              onRemix={() => handleRemixSong(detailSong)}
              onPlayDj={() => handlePlayDjBroadcast(detailSong)}
              onOpenPoster={() => setPosterOpen(true)}
              onPublish={() => void handlePublishSong(true)}
              onSetPrivate={() => void handlePublishSong(false)}
              onDelete={() => handleDeleteSong(detailSong.id)}
              onOpenSong={openSong}
              onOpenAllComments={() => setActiveView('comments')}
              onSongUpdate={syncSong}
            />
          </>
        ) : null}
        {activeView === 'comments' && detailSong ? (
          <>
            <div className="page-back-row">
              <BackButton label="返回歌曲详情" onClick={() => setActiveView('songDetail')} />
            </div>
            <CommentsPage song={detailSong} />
          </>
        ) : null}
        {posterOpen && (detailSong ?? currentSong) ? (
          <PosterModal song={(detailSong ?? currentSong)!} onClose={() => setPosterOpen(false)} />
        ) : null}
      </AppLayout>
    </>
  )
}

function App() {
  if (window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/')) {
    return (
      <Suspense fallback={<LoadingState title="正在加载管理后台" description="请稍候…" />}>
        <AdminPage />
      </Suspense>
    )
  }
  return (
    <Suspense fallback={<PageLoadingState />}>
      <UserApp />
    </Suspense>
  )
}

export default App
