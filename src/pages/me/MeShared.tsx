import type { User } from '../../types/user'

type MeHeroProps = {
  user: User
  summary: {
    songCount: number
    likeCount: number
    playCount: number
    topStyles: string[]
  }
}

type MeStatsProps = {
  stats: Array<{
    label: string
    value: string | number
  }>
}

type MeAccountProps = {
  user: User
  inviteCode?: string
}

function formatDate(value?: string) {
  if (!value) {
    return '今天还没打卡'
  }

  return new Intl.DateTimeFormat('zh-CN', {
    month: 'numeric',
    day: 'numeric',
  }).format(new Date(value))
}

export function MeHero({ user, summary }: MeHeroProps) {
  const topStylesText = summary.topStyles.length ? summary.topStyles.join('、') : '等待新的创作风格出现'

  return (
    <div className="me-hero">
      <div className="me-hero__glow" aria-hidden="true" />
      <div className="me-hero__identity">
        <div className="me-hero__copy">
          <span>Profile</span>
          <div className="me-hero__headline">
            <div className="avatar me-hero__avatar">{user.nickname.slice(0, 1)}</div>
            <h1>{user.nickname}</h1>
          </div>
          <p>
            目前共整理了 {summary.songCount} 首作品，累计获得 {summary.likeCount} 次喜欢和{' '}
            {summary.playCount} 次播放。最近常用风格是 {topStylesText}。
          </p>
          <div className="me-hero__tags">
            <i>创作中</i>
            <i>个人中心</i>
            <i>AI Music</i>
          </div>
        </div>
      </div>
      <div className="me-hero__spotlight">
        <div className="me-hero__badge">Echo Creator</div>
        <div className="me-hero__disc" aria-hidden="true">
          <b />
        </div>
        <div className="me-hero__score">
          <strong>{user.echoPoints}</strong>
          <span>Echo Points</span>
          <small>{summary.songCount ? '作品库正在持续扩充' : '完成第一首作品后这里会更新'}</small>
        </div>
      </div>
    </div>
  )
}

export function MeStatsPanel({ stats }: MeStatsProps) {
  return (
    <section className="me-panel me-panel--stats">
      <div className="me-panel__heading">
        <div>
          <span>Overview</span>
          <h2>个人概览</h2>
        </div>
      </div>
      <div className="me-stats-grid">
        {stats.map((item) => (
          <article key={item.label} className="me-stat-card">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </div>
    </section>
  )
}

export function MeAccountPanel({ user, inviteCode }: MeAccountProps) {
  return (
    <section className="me-panel me-panel--account">
      <div className="me-panel__heading">
        <div>
          <span>Account</span>
          <h2>账户信息</h2>
        </div>
      </div>
      <div className="me-detail-list">
        <div className="me-detail-row">
          <span>用户身份</span>
          <strong>{user.role === 'admin' ? '管理员' : '社区创作者'}</strong>
        </div>
        <div className="me-detail-row">
          <span>注册时间</span>
          <strong>{formatDate(user.createdAt)}</strong>
        </div>
        <div className="me-detail-row">
          <span>最近打卡</span>
          <strong>{formatDate(user.lastCheckin)}</strong>
        </div>
        <div className="me-detail-row">
          <span>可用邀请码</span>
          <strong>{inviteCode ?? '暂无可用邀请码'}</strong>
        </div>
      </div>
    </section>
  )
}
