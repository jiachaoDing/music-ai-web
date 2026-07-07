import { useEffect, useMemo, useState } from 'react'
import './App.css'
import type { FeedTab } from './api/song'
import { getCurrentUser } from './api/auth'
import { getFeed, getMySongs } from './api/song'
import { AppLayout } from './components/AppLayout'
import { LoadingState } from './components/LoadingState'
import { PosterModal } from './components/PosterModal'
import { mockTask } from './mock/tasks'
import { AuthPage } from './pages/AuthPage'
import { CreateFormPage } from './pages/CreateFormPage'
import { CreatePage } from './pages/CreatePage'
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

function App() {
  const [activeView, setActiveView] = useState<AppView>('feed')
  const [user, setUser] = useState<User | null>(null)
  const [feedSongs, setFeedSongs] = useState<Song[]>([])
  const [mySongs, setMySongs] = useState<Song[]>([])
  const [feedTab, setFeedTab] = useState<FeedTab>('resonance')
  const [createMode, setCreateMode] = useState<SongMode>('song')
  const [currentSongId, setCurrentSongId] = useState<string>()
  const [posterOpen, setPosterOpen] = useState(false)
  const [loading, setLoading] = useState(true)

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
      const [nextUser, nextFeedSongs, nextMySongs] = await Promise.all([
        getCurrentUser(),
        getFeed(feedTab),
        getMySongs(),
      ])

      setUser(nextUser)
      setFeedSongs(nextFeedSongs)
      setMySongs(nextMySongs)
      setCurrentSongId(nextFeedSongs[0]?.id)
      setLoading(false)
    }

    void bootstrap()
  }, [feedTab])

  if (loading || !user) {
    return (
      <main className="standalone-shell">
        <LoadingState title="正在进入 Echo" description="准备用户、作品和页面骨架" />
      </main>
    )
  }

  if (activeView === 'auth') {
    return (
      <main className="standalone-shell">
        <AuthPage />
      </main>
    )
  }

  return (
    <AppLayout
      active={
        activeView === 'player' || activeView === 'songDetail'
          ? 'feed'
          : activeView === 'task' || activeView === 'createForm'
            ? 'create'
            : activeView
      }
      currentSong={currentSong}
      user={user}
      onNavigate={navigate}
      onOpenPlayer={() => setActiveView('player')}
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
