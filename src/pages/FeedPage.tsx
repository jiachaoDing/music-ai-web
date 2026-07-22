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
  onPlaySong?: (songId: string) => void
  onCreate: () => void
  onOpenHost?: () => void
  searchValue: string
  onSearchValueChange: (value: string) => void
  onSearch: () => void
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
  onPlaySong,
  onCreate,
  onOpenHost,
  searchValue,
  onSearchValueChange,
  onSearch,
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
          <span className="feed-hero-kicker--desktop">Echo AI Music Community</span>
          <div className="feed-hero-kicker--mobile" aria-hidden="true" />
          <h1 className="feed-hero-title feed-hero-title--desktop">把灵感变成 AI 音乐作品</h1>
          <div className="feed-hero-artwork--mobile feed-hero-slice" aria-label="把灵感变成 AI 音乐作品">
            <div className="feed-hero-slice__index" aria-hidden="true">
              <span>01 — THOUGHT</span>
              <span>02 — SOUND</span>
            </div>
            <div className="feed-hero-slice__object" aria-hidden="true">
              <i /><i /><i /><i /><i /><i /><i />
            </div>
            <div className="feed-hero-slice__copy">
              <small>FROM PROMPT TO MUSIC</small>
              <strong>把灵感变成<br />AI 音乐作品</strong>
            </div>
            <div className="feed-hero-slice__foot" aria-hidden="true">
              <b>AI / 44.1</b><span />
            </div>
          </div>
          <p className="feed-hero-copy feed-hero-copy--desktop">输入一句灵感，Echo AI 会生成完整旋律、歌词与专属封面，也可以继续探索社区创作者的 AI 音乐作品。</p>
          <p className="feed-hero-copy feed-hero-copy--mobile"><b>AI /</b> 输入一句灵感，生成完整旋律、歌词与专属封面。</p>
        </div>
      </section>

      <section className="host-panel">
        <div className="host-panel__header">
          <div className="host-panel__copy">
            <span>Echo AI Curator</span>
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

      <form className="feed-mobile-search" role="search" onSubmit={(event) => { event.preventDefault(); onSearch() }}>
        <input
          aria-label="搜索社区作品"
          placeholder="搜索歌曲、作者、风格"
          value={searchValue}
          onChange={(event) => onSearchValueChange(event.target.value)}
        />
        <button type="submit">搜索</button>
      </form>

      <section className="feed-controls">
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
            <SongCard key={song.id} song={song} onOpen={onOpenSong} onPlay={onPlaySong} />
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
