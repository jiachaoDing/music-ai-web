import { Suspense, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import type { Song } from '../types/song'
import type { User } from '../types/user'
import type { NavKey } from '../utils/constants'
import { BottomNav } from './BottomNav'
import { MiniPlayer } from './MiniPlayer'
import { PageLoadingState } from './LoadingState'
import { Topbar } from './Topbar'

type AppLayoutProps = {
  active: NavKey
  user: User
  currentSong?: Song
  queueSongs?: Song[]
  currentSongId?: string
  isPlaying?: boolean
  isBuffering?: boolean
  repeatMode?: 'off' | 'all' | 'one'
  shuffleEnabled?: boolean
  progress?: number
  children: ReactNode
  onNavigate: (key: NavKey) => void
  onOpenPlayer: () => void
  onTogglePlay?: () => void
  onPlayPrev?: () => void
  onPlayNext?: () => void
  onCycleRepeat?: () => void
  onPlayQueueSong?: (songId: string) => void
  onRemoveQueueSong?: (songId: string) => void
  onLogout: () => void
  task?: {
    status: 'queued' | 'running' | 'done' | 'error'
    progress: number
  } | null
  onOpenTask?: () => void
  searchValue: string
  onSearchValueChange: (value: string) => void
  onSearch: () => void
}

export function AppLayout({
  active,
  user,
  currentSong,
  queueSongs = [],
  currentSongId,
  isPlaying = false,
  isBuffering = false,
  repeatMode = 'off',
  shuffleEnabled = false,
  progress = 0,
  children,
  onNavigate,
  onOpenPlayer,
  onTogglePlay,
  onPlayPrev,
  onPlayNext,
  onCycleRepeat,
  onPlayQueueSong,
  onRemoveQueueSong,
  onLogout,
  task,
  onOpenTask,
  searchValue,
  onSearchValueChange,
  onSearch,
}: AppLayoutProps) {
  const pageShellRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const scrollPageToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      pageShellRef.current?.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }

    const resetAfterNavigation = () => {
      window.requestAnimationFrame(scrollPageToTop)
    }
    const originalPushState = window.history.pushState
    const originalReplaceState = window.history.replaceState

    window.history.pushState = function (...args) {
      originalPushState.apply(this, args)
      resetAfterNavigation()
    }
    window.history.replaceState = function (...args) {
      originalReplaceState.apply(this, args)
      resetAfterNavigation()
    }
    window.addEventListener('popstate', resetAfterNavigation)
    scrollPageToTop()

    return () => {
      window.history.pushState = originalPushState
      window.history.replaceState = originalReplaceState
      window.removeEventListener('popstate', resetAfterNavigation)
    }
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    pageShellRef.current?.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [active])

  return (
    <div className="app-shell">
      <Topbar
        active={active}
        user={user}
        task={task}
        onNavigate={onNavigate}
        onOpenTask={onOpenTask}
        onLogout={onLogout}
        searchValue={searchValue}
        onSearchValueChange={onSearchValueChange}
        onSearch={onSearch}
      />
      <main ref={pageShellRef} className="page-shell">
        <Suspense fallback={<PageLoadingState />}>{children}</Suspense>
      </main>
      <MiniPlayer
        song={currentSong}
        queueSongs={queueSongs}
        currentSongId={currentSongId}
        isPlaying={isPlaying}
        isBuffering={isBuffering}
        repeatMode={repeatMode}
        shuffleEnabled={shuffleEnabled}
        progress={progress}
        onOpenPlayer={onOpenPlayer}
        onTogglePlay={onTogglePlay}
        onPlayPrev={onPlayPrev}
        onPlayNext={onPlayNext}
        onCycleRepeat={onCycleRepeat}
        onPlayQueueSong={onPlayQueueSong}
        onRemoveQueueSong={onRemoveQueueSong}
      />
      <BottomNav active={active} onNavigate={onNavigate} />
    </div>
  )
}
