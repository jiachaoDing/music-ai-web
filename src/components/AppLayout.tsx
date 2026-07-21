import type { ReactNode } from 'react'
import type { Song } from '../types/song'
import type { User } from '../types/user'
import type { NavKey } from '../utils/constants'
import { BottomNav } from './BottomNav'
import { MiniPlayer } from './MiniPlayer'
import { Topbar } from './Topbar'

type AppLayoutProps = {
  active: NavKey
  user: User
  currentSong?: Song
  queueSongs?: Song[]
  currentSongId?: string
  isPlaying?: boolean
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
}

export function AppLayout({
  active,
  user,
  currentSong,
  queueSongs = [],
  currentSongId,
  isPlaying = false,
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
}: AppLayoutProps) {
  return (
    <div className="app-shell">
      <Topbar active={active} user={user} onNavigate={onNavigate} onLogout={onLogout} />
      <main className="page-shell">{children}</main>
      <MiniPlayer
        song={currentSong}
        queueSongs={queueSongs}
        currentSongId={currentSongId}
        isPlaying={isPlaying}
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
