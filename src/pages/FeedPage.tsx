import { EmptyState } from '../components/EmptyState'
import { SongCard } from '../components/SongCard'
import type { FeedTab } from '../api/song'
import type { Song } from '../types/song'

type FeedPageProps = {
  activeTab: FeedTab
  songs: Song[]
  onChangeTab: (tab: FeedTab) => void
  onOpenSong: (songId: string) => void
  onCreate: () => void
}

const feedTabs: Array<{ key: FeedTab; label: string }> = [
  { key: 'resonance', label: '同频' },
  { key: 'recommend', label: '推荐' },
  { key: 'hot', label: '热榜' },
]

export function FeedPage({ activeTab, songs, onChangeTab, onOpenSong, onCreate }: FeedPageProps) {
  return (
    <section className="page-stack feed-page">
      <section className="create-hero">
        <div className="create-hero__copy">
          <span>Echo AI Music Community</span>
          <h1>把灵感变成 AI 音乐作品</h1>
          <p>输入一句灵感，生成旋律、歌词和封面；也可以先逛逛社区里的新作品。</p>
        </div>
        <div className="prompt-box">
          <input placeholder="写下你的音乐灵感，例如：夏天、校园、毕业季，温暖流行" />
          <div className="prompt-box__footer">
            <button type="button" onClick={onCreate}>
              开始创作
            </button>
          </div>
        </div>
      </section>

      <div className="feed-toolbar">
        <div>
          <span>Discover</span>
          <h2>社区作品</h2>
        </div>
        <section className="host-inline">
          <strong>AI 主理人</strong>
          <span>今日主题：把夏天唱成一封信</span>
        </section>
      </div>

      <section className="feed-controls">
        <button className="filter-button" type="button">精选</button>
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
        <button className="filter-button" type="button">筛选</button>
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
