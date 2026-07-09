import { useEffect, useMemo, useState } from 'react'
import './App.css'
import type { FeedTab } from './api/song'
import { clearToken, getCurrentUser, signIn, signUp, TOKEN_STORAGE_KEY } from './api/auth'
import { getFeed, getMySongs } from './api/song'
import { AppLayout } from './components/AppLayout'
import { LoadingState } from './components/LoadingState'
import { PosterModal } from './components/PosterModal'
import { mockTask } from './mock/tasks'
import { AuthPage } from './pages/auth/AuthPage'
import { CreateFormPage } from './pages/create/CreateFormPage'
import { CreatePage } from './pages/create/CreatePage'
import { DiscoverPage } from './pages/DiscoverPage'
import { FeedPage } from './pages/FeedPage'
import { MePage } from './pages/MePage'
import { PlayerPage } from './pages/PlayerPage'
import { RadioPage } from './pages/RadioPage'
import { SongDetailPage } from './pages/SongDetailPage'
import { TaskPage } from './pages/TaskPage'
import type { Song } from './types/song'
import type { SongMode } from './types/song'
import type { User } from './types/user'
import type { NavKey } from './utils/constants'

type AppView = NavKey | 'auth' | 'createForm' | 'task' | 'songDetail' | 'player'

type AuthMode = 'login' | 'register'

type AuthValues = {
  identifier?: string
  password?: string
  nickname?: string
  inviteCode?: string
}

const AUTH_STORAGE_KEY = 'echo-auth-user'

function App() {
  const [activeView, setActiveView] = useState<AppView>('auth')
  const [user, setUser] = useState<User | null>(null)
  const [feedSongs, setFeedSongs] = useState<Song[]>([])
  const [mySongs, setMySongs] = useState<Song[]>([])
  const [feedTab, setFeedTab] = useState<FeedTab>('resonance')
  const [createMode, setCreateMode] = useState<SongMode>('song')
  const [currentSongId, setCurrentSongId] = useState<string>()
  const [posterOpen, setPosterOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)

  const allSongs = useMemo(() => {
    const songMap = new Map<string, Song>()
    ;[...feedSongs, ...mySongs].forEach((song) => songMap.set(song.id, song))
    return [...songMap.values()]
  }, [feedSongs, mySongs])

  const currentSong = allSongs.find((song) => song.id === currentSongId) ?? allSongs[0]

  function openSong(songId: string) {
    setCurrentSongId(songId)
    setActiveView('songDetail')
  }

  function navigate(key: NavKey) {
    setActiveView(key)
  }

  async function changeFeedTab(tab: FeedTab) {
    setFeedTab(tab)
    setFeedSongs(await getFeed(tab))
  }

  function openCreateForm(mode: SongMode) {
    setCreateMode(mode)
    setActiveView('createForm')
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
          setCurrentSongId(nextFeedSongs[0]?.id)
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
      window.alert(error instanceof Error ? error.message : '认证失败，请稍后重试')
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
  }

  if (loading) {
    return (
      <main className="standalone-shell">
        <LoadingState title="正在进入 Echo" description="准备用户、作品和页面骨架" />
      </main>
    )
  }

  if (!user) {
    return (
      <main className="standalone-shell">
        <AuthPage onAuthenticate={handleAuthenticate} loading={authLoading} />
      </main>
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

  return (
    <AppLayout
      active={activeNavKey as Exclude<NavKey, 'auth'>}
      currentSong={currentSong}
      user={user}
      onNavigate={navigate}
      onOpenPlayer={() => setActiveView('player')}
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
      {activeView === 'discover' ? <DiscoverPage /> : null}
      {activeView === 'create' ? <CreatePage onOpenForm={openCreateForm} /> : null}
      {activeView === 'createForm' ? (
        <CreateFormPage mode={createMode} onSubmit={() => setActiveView('task')} />
      ) : null}
      {activeView === 'radio' ? <RadioPage /> : null}
      {activeView === 'me' ? <MePage user={user} songs={mySongs} onOpenSong={openSong} /> : null}
      {activeView === 'task' ? (
        <TaskPage task={mockTask} onOpenSong={() => currentSong && openSong(currentSong.id)} />
      ) : null}
      {activeView === 'songDetail' && currentSong ? (
        <SongDetailPage song={currentSong} onOpenPoster={() => setPosterOpen(true)} />
      ) : null}
      {activeView === 'player' ? <PlayerPage song={currentSong} /> : null}
      {posterOpen && currentSong ? (
        <PosterModal song={currentSong} onClose={() => setPosterOpen(false)} />
      ) : null}
    </AppLayout>
  )
}

export default App
