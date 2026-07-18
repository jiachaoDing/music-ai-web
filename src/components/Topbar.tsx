import type { User } from '../types/user'
import { NAV_ITEMS, type NavKey } from '../utils/constants'

type TopbarProps = {
  active: NavKey
  user: User
  onNavigate: (key: NavKey) => void
  onLogout: () => void
}

export function Topbar({ active, user, onNavigate, onLogout }: TopbarProps) {
  return (
    <header className="topbar">
      <div className="brand-lockup">
        <strong>Echo AI</strong>
      </div>
      <label className="topbar-search">
        <input aria-label="搜索" placeholder="搜索歌曲、作者、风格" />
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
        <button type="button" className="user-pill__trigger" aria-haspopup="menu">
          <strong>{user.nickname}</strong>
        </button>
        <div className="user-pill__menu" role="menu">
          <a className="user-pill__admin" href="/admin" role="menuitem">进入管理员端</a>
          <button type="button" className="user-pill__logout" onClick={onLogout}>
            退出登录
          </button>
        </div>
      </div>
    </header>
  )
}
