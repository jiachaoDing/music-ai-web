import type { HostCuration, HostPage } from '../api/host'
import type { FeedTab } from '../api/song'
import { EmptyState } from '../components/EmptyState'
import { SongCard } from '../components/SongCard'
import type { Song } from '../types/song'
import { formatCount } from '../utils/format'

type FeedPageProps = {
  activeTab: FeedTab
  songs: Song[]
  hostPage?: HostPage | null
  curation?: HostCuration | null
  onChangeTab: (tab: FeedTab) => void
  onOpenSong: (songId: string) => void
  onCreate: () => void
  onOpenHost?: () => void
}

const feedTabs: Array<{ key: FeedTab; label: string }> = [
  { key: 'resonance', label: '同频' },
  { key: 'recommend', label: '推荐' },
  { key: 'hot', label: '热榜' },
]

export function FeedPage({
  activeTab,
  songs,
  hostPage,
  curation,
  onChangeTab,
  onOpenSong,
  onCreate,
  onOpenHost,
}: FeedPageProps) {
  const hostName = hostPage?.name ?? 'AI 主理人'
  const hostPick = curation?.featuredSong ?? hostPage?.todayPick ?? null
  const hostPickQuote: string | undefined =
    hostPick && 'quote' in hostPick && typeof hostPick.quote === 'string'
      ? hostPick.quote
      : undefined
  const hostNote: string =
    curation?.hostNote ||
    hostPage?.greeting ||
    hostPickQuote ||
    '今天也有新的声音在发生，AI 主理人会从社区里挑出值得一听的新作品。'
  const topics = hostPage?.topics?.slice(0, 3) ?? []
  const recommendations = curation?.recommendations ?? hostPage?.featuredSongs ?? []

  return (
    <section className="page-stack feed-page">
      <section className="create-hero">
        <div className="create-hero__copy">
          <span>Echo AI Music Community</span>
          <h1>把灵感变成 AI 音乐作品</h1>
          <p>输入一句灵感，生成旋律、歌词和封面；也可以先逛逛社区里的新作品。</p>
        </div>
        <div className="prompt-box">
          <input placeholder="写下你的音乐灵感，例如：夏天、校园、毕业季、温暖流行" />
          <div className="prompt-box__footer">
            <button type="button" onClick={onCreate}>
              开始创作
            </button>
          </div>
        </div>
      </section>

      <section className="host-panel">
        <div className="host-panel__copy">
          <span>AI Curator</span>
          <h3>{hostName}</h3>
          <p>{hostNote}</p>
          <div className="host-panel__meta">
            <strong>{formatCount(hostPage?.stats?.featuredCount ?? recommendations.length)}</strong>
            <small>精选作品</small>
            <strong>{formatCount(hostPage?.stats?.totalPlays ?? 0)}</strong>
            <small>累计播放</small>
          </div>
        </div>

        {onOpenHost ? (
          <button type="button" className="filter-button" onClick={onOpenHost}>
            进入主理人主页
          </button>
        ) : null}

        {hostPick ? (
          <button
            type="button"
            className="host-panel__pick"
            onClick={() => onOpenSong(hostPick.id)}
          >
            <span>今日精选</span>
            <strong>{hostPick.title}</strong>
            <small>{hostPickQuote ?? hostPick.description ?? '点击查看 AI 主理人推荐的作品'}</small>
          </button>
        ) : (
          <button type="button" className="host-panel__pick is-empty" onClick={onCreate}>
            <span>等待推荐</span>
            <strong>先创作一首歌</strong>
            <small>让 AI 主理人听听你的新灵感</small>
          </button>
        )}

        {topics.length ? (
          <div className="host-panel__topics" aria-label="AI 主理人话题">
            {topics.map((topic) => (
              <span key={topic.id}>{topic.title}</span>
            ))}
          </div>
        ) : null}
      </section>

      <div className="feed-toolbar">
        <div>
          <span>Discover</span>
          <h2>社区作品</h2>
        </div>
      </div>

      <section className="feed-controls">
        <button className="filter-button" type="button">
          精选
        </button>
        <div className="segment-tabs">
          {feedTabs.map((tab) => (
            <button
              type="button"
              className={activeTab === tab.key ? 'is-active' : ''}
              key={tab.key}
              onClick={() => onChangeTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button className="filter-button" type="button">
          筛选
        </button>
      </section>

      {songs.length ? (
        <div className="card-list">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} onOpen={onOpenSong} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="还没有作品"
          description="先创建一首歌，让首页有第一段回声。"
          actionLabel="开始创作"
          onAction={onCreate}
        />
      )}
    </section>
  )
}
