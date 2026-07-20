import type { HostCuration, HostPage } from '../api/host'
import type { FeedTab, ResonanceFeedResponse } from '../api/song'
import { EmptyState } from '../components/EmptyState'
import { SongCard } from '../components/SongCard'
import type { Song } from '../types/song'
import { formatCount } from '../utils/format'

type FeedPageProps = {
  activeTab: FeedTab
  songs: Song[]
  hostPage?: HostPage | null
  curation?: HostCuration | null
  resonance?: ResonanceFeedResponse | null
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
  resonance,
  onChangeTab,
  onOpenSong,
  onCreate,
  onOpenHost,
}: FeedPageProps) {
  const hostName = hostPage?.name ?? 'AI 主理人'
  const officialSong = hostPage?.featuredSongs?.[0] ?? curation?.featuredSong ?? null
  const pickedSong = hostPage?.todayPick ?? null
  const pickQuote =
    pickedSong && 'quote' in pickedSong && typeof pickedSong.quote === 'string'
      ? pickedSong.quote
      : pickedSong?.description
  const hostNote =
    curation?.hostNote ||
    hostPage?.greeting ||
    '今天也有新的声音在发生，AI 主理人会从社区里挑出值得一听的新作品。'
  const topics = hostPage?.topics?.slice(0, 2) ?? []
  const featuredCount = hostPage?.stats?.featuredCount ?? hostPage?.featuredSongs?.length ?? 0
  const resonanceNote = resonance?.note ?? resonance?.intro
  const resonanceTags = resonance?.mood?.tags ?? resonance?.moodTags ?? []
  const resonanceLabel = resonance?.moodLabel ?? (resonance?.mood?.title ? `同「${resonance.mood.title}」频` : '今日同频')

  return (
    <section className="page-stack feed-page">
      <section className="create-hero">
        <div className="create-hero__copy">
          <span>Echo AI Music Community</span>
          <h1>把灵感变成 AI 音乐作品</h1>
          <p>输入一句灵感，生成旋律、歌词和封面；也可以先逛逛社区里的新作品。</p>
        </div>
      </section>

      <section className="host-panel">
        <div className="host-panel__header">
          <div className="host-panel__copy">
            <span>AI Curator</span>
            <h3>{hostName}</h3>
            <p>{hostNote}</p>
          </div>

          {onOpenHost ? (
            <button type="button" className="host-panel__entry" onClick={onOpenHost}>
              进入主页
            </button>
          ) : null}
        </div>

        <div className="host-panel__today">
          {officialSong ? (
            <button
              type="button"
              className="host-panel__feature"
              onClick={() => onOpenSong(officialSong.id)}
            >
              <span>今日主打歌</span>
              <strong>{officialSong.title}</strong>
              <small>{officialSong.style}</small>
            </button>
          ) : (
            <button type="button" className="host-panel__feature is-empty" onClick={onOpenHost ?? onCreate}>
              <span>今日主打歌</span>
              <strong>等待主理人发布</strong>
              <small>每日任务生成后会出现在这里</small>
            </button>
          )}

          {pickedSong ? (
            <button
              type="button"
              className="host-panel__feature host-panel__feature--pick"
              onClick={() => onOpenSong(pickedSong.id)}
            >
              <span>今日翻牌</span>
              <strong>{pickedSong.title}</strong>
              <small>{pickQuote ?? '主理人今天想把这首社区作品推荐给你。'}</small>
            </button>
          ) : (
            <button type="button" className="host-panel__feature is-empty" onClick={onCreate}>
              <span>今日翻牌</span>
              <strong>还没有翻牌</strong>
              <small>发布公开作品，让主理人听见你的新灵感</small>
            </button>
          )}
        </div>

        <div className="host-panel__footer">
          <div className="host-panel__meta">
            <strong>{formatCount(featuredCount)}</strong>
            <small>主理人作品</small>
            <strong>{formatCount(hostPage?.stats?.totalPlays ?? 0)}</strong>
            <small>累计播放</small>
          </div>

          {topics.length ? (
            <div className="host-panel__topics" aria-label="AI 主理人话题">
              {topics.map((topic) => (
                <span key={topic.id}>{topic.title}</span>
              ))}
            </div>
          ) : null}
        </div>
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

      {activeTab === 'resonance' && (resonanceNote || resonanceTags.length) ? (
        <section className="resonance-lead">
          <div>
            <span>{resonanceLabel}</span>
            {resonanceNote ? <p>{resonanceNote}</p> : null}
          </div>
          {resonanceTags.length ? (
            <div className="resonance-lead__tags">
              {resonanceTags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

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
