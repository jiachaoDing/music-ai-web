import type { User } from '../types/user'
import { NAV_ITEMS, type NavKey } from '../utils/constants'

type TopbarProps = {
  active: NavKey
  user: User
  onNavigate: (key: NavKey) => void
}

export function Topbar({ active, user, onNavigate }: TopbarProps) {
  return (
    <header className="topbar">
      <div className="brand-lockup">
        <strong>Echo AI</strong>
      </div>
      <label className="topbar-search">
        <span>搜索</span>
        <input placeholder="搜索歌曲、作者、风格" />
      </label>
      <nav className="topbar-nav" aria-label="主导航">
        {NAV_ITEMS.map((item) => (
          <button
            className={active === item.key ? 'is-active' : ''}
            key={item.key}
            type="button"
            onClick={() => onNavigate(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="user-pill">
        <span>{user.echoPoints} 分</span>
        <strong>{user.nickname}</strong>
      </div>
    </header>
  )
}
