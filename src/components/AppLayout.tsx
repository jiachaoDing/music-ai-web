import { BottomNav } from './BottomNav'
import { MiniPlayer } from './MiniPlayer'
import { Topbar } from './Topbar'
import type { Song } from '../types/song'
import type { User } from '../types/user'
import type { NavKey } from '../utils/constants'

type AppLayoutProps = {
  active: NavKey
  user: User
  currentSong?: Song
  isPlaying?: boolean
  progress?: number
  children: React.ReactNode
  onNavigate: (key: NavKey) => void
  onOpenPlayer: () => void
  onTogglePlay?: () => void
  onPlayPrev?: () => void
  onPlayNext?: () => void
  onLogout: () => void
}

export function AppLayout({
  active,
  user,
  currentSong,
  isPlaying = false,
  progress = 0,
  children,
  onNavigate,
  onOpenPlayer,
  onTogglePlay,
  onPlayPrev,
  onPlayNext,
  onLogout,
}: AppLayoutProps) {
  return (
    <div className="app-shell">
      <Topbar active={active} user={user} onNavigate={onNavigate} onLogout={onLogout} />
      <main className="page-shell">{children}</main>
      <MiniPlayer
        song={currentSong}
        isPlaying={isPlaying}
        progress={progress}
        onOpenPlayer={onOpenPlayer}
        onTogglePlay={onTogglePlay}
        onPlayPrev={onPlayPrev}
        onPlayNext={onPlayNext}
      />
      <BottomNav active={active} onNavigate={onNavigate} />
    </div>
  )
}
