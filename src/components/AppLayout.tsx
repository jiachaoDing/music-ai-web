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
  children: React.ReactNode
  onNavigate: (key: NavKey) => void
  onOpenPlayer: () => void
  onLogout: () => void
}

export function AppLayout({
  active,
  user,
  currentSong,
  children,
  onNavigate,
  onOpenPlayer,
  onLogout,
}: AppLayoutProps) {
  return (
    <div className="app-shell">
      <Topbar active={active} user={user} onNavigate={onNavigate} onLogout={onLogout} />
      <main className="page-shell">{children}</main>
      <MiniPlayer song={currentSong} onOpenPlayer={onOpenPlayer} />
      <BottomNav active={active} onNavigate={onNavigate} />
    </div>
  )
}
