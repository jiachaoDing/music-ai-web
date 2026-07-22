import type { InviteCode, User } from '../../types/user'
import type { PointsLedgerItem } from '../../api/me'

type MeHeroProps = {
  user: User
  summary: {
    songCount: number
    likeCount: number
    playCount: number
    topStyles: string[]
  }
  stats: MeStatsProps['stats']
}

type MeStatsProps = {
  stats: Array<{
    label: string
    value: string | number
  }>
}

type MeAccountProps = {
  user: User
  inviteCodes?: InviteCode[]
  invitedCount?: number
  copiedInviteCode?: string
  ledger?: PointsLedgerItem[]
  ledgerTotal?: number
  loading?: boolean
  onOpenLedger?: () => void
  onCopyInvite?: (code: string) => void
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

function formatLedgerTime(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function MeHero({ user, summary, stats }: MeHeroProps) {
  const creatorStyles = summary.topStyles.length ? summary.topStyles : ['探索中', 'AI Music']

  return (
    <div className="me-hero">
      <div className="me-hero__glow" aria-hidden="true" />
      <div className="me-hero__identity">
        <div className="me-hero__copy">
          <span>Profile</span>
          <div className="me-hero__headline">
            <div className="avatar me-hero__avatar">{user.nickname.slice(0, 1)}</div>
            <div className="me-hero__name">
              <div>
                <h1>{user.nickname}</h1>
                <small>✦ Creator</small>
              </div>
              <p>用 AI 捕捉每一个值得留下的声音。</p>
            </div>
          </div>
          <div className="me-hero__tags">
            {creatorStyles.map((style) => <i key={style}>#{style}</i>)}
          </div>
          <div className="me-hero__stats" aria-label="个人概览">
            {stats.map((item) => (
              <article className="me-hero__stat" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>
          <div className="me-hero__facts" aria-label="账号资料">
            <span><small>身份</small><strong>{user.role === 'admin' ? '管理员' : '社区创作者'}</strong></span>
            <span><small>注册</small><strong>{formatDate(user.createdAt)}</strong></span>
            <span><small>打卡</small><strong>{formatDate(user.lastCheckin)}</strong></span>
          </div>
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

export function MeAccountPanel({
  user,
  inviteCodes = [],
  invitedCount = 0,
  copiedInviteCode,
  ledger = [],
  ledgerTotal = 0,
  loading = false,
  onOpenLedger,
  onCopyInvite,
}: MeAccountProps) {
  return (
    <section className="me-panel me-panel--account">
      <div className="me-panel__heading">
        <div>
          <span>Wallet</span>
          <h2>回声钱包</h2>
        </div>
      </div>
      <div className="me-wallet-card">
        <div>
          <span>当前回声</span>
          <strong>{user.echoPoints}</strong>
        </div>
        <p>用回声生成歌曲；作品被喜欢、翻唱或收藏时，也会继续回赚回声。</p>
      </div>
      <div className="me-ledger-card">
        <div className="me-ledger-head">
          <span>最近流水</span>
          <button type="button" className="me-ledger-more" onClick={onOpenLedger}>
            {loading ? '正在同步...' : ledgerTotal ? `查看全部 ${ledgerTotal} 条 ›` : '暂无记录'}
          </button>
        </div>
        {ledger.length ? (
          <div className="me-ledger-list">
            {ledger.map((item) => (
              <div className="me-ledger-row" key={item.id}>
                <div>
                  <strong>{item.reason}</strong>
                  <span>{formatLedgerTime(item.createdAt)}{typeof item.balance === 'number' ? ` · 余额 ${item.balance}` : ''}</span>
                </div>
                <b className={item.delta >= 0 ? 'is-positive' : 'is-negative'}>
                  {item.delta >= 0 ? '+' : ''}{item.delta}
                </b>
              </div>
            ))}
          </div>
        ) : (
          <p className="me-ledger-empty">还没有回声流水。完成创作、打卡或作品获得互动后，这里会留下记录。</p>
        )}
      </div>
      <div className="me-invites-card">
        <div className="me-invites-head">
          <div>
            <span>我的邀请码</span>
            <strong>已邀请 {invitedCount} 人</strong>
          </div>
          <small>邀请好友加入 Echo</small>
        </div>
        <div className="me-invite-list">
          {loading ? (
            <p className="me-invite-empty">正在同步邀请码...</p>
          ) : inviteCodes.length ? (
            inviteCodes.map((item) => {
              const available = item.status === 'unused'
              return (
                <div className={`me-invite-row${available ? '' : ' is-used'}`} key={item.id}>
                  <code>{item.code}</code>
                  {available ? (
                    <button type="button" onClick={() => onCopyInvite?.(item.code)}>
                      {copiedInviteCode === item.code ? '已复制' : '复制'}
                    </button>
                  ) : (
                    <span>已使用</span>
                  )}
                </div>
              )
            })
          ) : (
            <p className="me-invite-empty">暂无邀请码</p>
          )}
        </div>
      </div>
    </section>
  )
}

export function MeLedgerPanel({ ledger = [], loading = false }: Pick<MeAccountProps, 'ledger' | 'loading'>) {
  return (
    <section className="me-panel me-ledger-page">
      <div className="me-panel__heading"><div><span>Wallet History</span><h2>回声流水</h2></div></div>
      {ledger.length ? (
        <div className="me-ledger-list">
          {ledger.map((item) => (
            <div className="me-ledger-row" key={item.id}>
              <div><strong>{item.reason}</strong><span>{formatLedgerTime(item.createdAt)}{typeof item.balance === 'number' ? ` · 余额 ${item.balance}` : ''}</span></div>
              <b className={item.delta >= 0 ? 'is-positive' : 'is-negative'}>{item.delta >= 0 ? '+' : ''}{item.delta}</b>
            </div>
          ))}
        </div>
      ) : <p className="me-ledger-empty">{loading ? '正在同步流水…' : '暂时没有回声流水。'}</p>}
    </section>
  )
}
