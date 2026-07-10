import type { User } from '../../types/user'

type MeHeroProps = {
  user: User
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

export function MeHero({ user }: MeHeroProps) {
  return (
    <div className="me-hero">
      <div className="me-hero__identity">
        <div className="avatar me-hero__avatar">{user.nickname.slice(0, 1)}</div>
        <div className="me-hero__copy">
          <span>Profile</span>
          <h1>{user.nickname}</h1>
          <p>
            这里会沉淀你的 AI 音乐作品、创作状态和邀请码信息，后面也会继续接入收藏、
            草稿和播放记录。
          </p>
        </div>
      </div>
      <div className="me-hero__aside">
        <strong>{user.echoPoints}</strong>
        <span>Echo Points</span>
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

export function MeStudioPanel() {
  return (
    <section className="me-panel">
      <div className="me-panel__heading">
        <div>
          <span>Studio</span>
          <h2>创作工作台</h2>
        </div>
        <p>先把个人中心骨架搭起来，后面可以继续接入真实统计、草稿和收藏数据。</p>
      </div>
      <div className="me-quick-grid">
        <article className="me-quick-card">
          <strong>我的作品</strong>
          <p>查看已发布和已生成的作品，后续接入筛选和状态管理。</p>
        </article>
        <article className="me-quick-card">
          <strong>草稿箱</strong>
          <p>存放未完成创作和待补充信息的内容，现在先保留展示位。</p>
        </article>
        <article className="me-quick-card">
          <strong>收藏与喜欢</strong>
          <p>后续可串联社区作品、个人偏好和推荐逻辑。</p>
        </article>
      </div>
    </section>
  )
}
