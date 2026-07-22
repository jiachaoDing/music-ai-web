import type { User } from '../types/user'
import { NAV_ITEMS, type NavKey } from '../utils/constants'

type TopbarProps = {
  active: NavKey
  user: User
  onNavigate: (key: NavKey) => void
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

export function Topbar({ active, user, onNavigate, onLogout, task, onOpenTask, searchValue, onSearchValueChange, onSearch }: TopbarProps) {
  const taskLabel = task?.status === 'done'
    ? '查看生成结果'
    : task?.status === 'error'
      ? '生成失败'
      : task?.status === 'queued'
        ? '等待生成'
        : `生成中 ${task?.progress ?? 0}%`

  return (
    <header className="topbar">
      <div className="brand-lockup">
        <strong>Echo AI</strong>
      </div>
      <form className="topbar-search" role="search" onSubmit={(event) => { event.preventDefault(); onSearch() }}>
        <input
          aria-label="搜索"
          placeholder="搜索歌曲、作者、风格"
          value={searchValue}
          onChange={(event) => onSearchValueChange(event.target.value)}
        />
        <button type="submit" aria-label="提交搜索" title="搜索">搜索</button>
      </form>
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
      {task && onOpenTask ? (
        <button
          className={`topbar-task topbar-task--${task.status}`}
          type="button"
          onClick={onOpenTask}
          aria-label={`${taskLabel}，返回生成任务页面`}
        >
          <span aria-hidden="true" />
          <strong>{taskLabel}</strong>
        </button>
      ) : null}
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
