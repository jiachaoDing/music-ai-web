import type { HostCuration, HostPage as HostPageData } from '../../api/host'
import { EmptyState } from '../../components/EmptyState'
import type { Song } from '../../types/song'
import { resolveAssetUrl } from '../../utils/asset'
import { formatCount, formatDuration } from '../../utils/format'
import { hostStyles } from './hostStyles'

type HostPageProps = {
  hostPage?: HostPageData | null
  curation?: HostCuration | null
  onBack: () => void
  onCreate: () => void
  onOpenSong: (songId: string) => void
}

function getSongCover(song?: Song | null) {
  return resolveAssetUrl(song?.coverUrl)
}

function getUniqueSongs(songs: Array<Song | null | undefined>) {
  const songMap = new Map<string, Song>()
  songs.forEach((song) => {
    if (song) songMap.set(song.id, song)
  })
  return Array.from(songMap.values())
}

function HostSongItem({
  song,
  badge,
  compact,
  onOpenSong,
}: {
  song: Song
  badge?: string
  compact?: boolean
  onOpenSong: (songId: string) => void
}) {
  const coverUrl = getSongCover(song)
  const authorName = song.author?.nickname ?? 'Echo 用户'

  return (
    <button
      type="button"
      className={`host-song ${compact ? 'host-song--compact' : ''}`}
      onClick={() => onOpenSong(song.id)}
    >
      <span className="host-song__cover">
        {coverUrl ? <img src={coverUrl} alt={`${song.title} 封面`} loading="lazy" decoding="async" /> : <i aria-hidden="true">E</i>}
        <b aria-hidden="true">▶</b>
      </span>
      <span className="host-song__body">
        {badge ? <em>{badge}</em> : null}
        <strong>{song.title}</strong>
        <small>
          @{authorName} · {formatDuration(song.duration)} · {formatCount(song.playCount)} 播放
        </small>
        <span className="host-song__tags">
          <i>{song.style || song.mode}</i>
          <i>{song.published ? '已发布' : '草稿'}</i>
        </span>
      </span>
    </button>
  )
}

export function HostPage({ hostPage, curation, onBack, onCreate, onOpenSong }: HostPageProps) {
  const hostName = hostPage?.name ?? 'Echo 主理人'
  const officialSongs = hostPage?.featuredSongs ?? []
  const officialToday = officialSongs[0] ?? curation?.featuredSong ?? null
  const todayPick = hostPage?.todayPick ?? null
  const todayPickQuote =
    todayPick && 'quote' in todayPick && typeof todayPick.quote === 'string'
      ? todayPick.quote
      : '主理人今天翻到这首社区作品，想把它放到更多人耳边。'
  const topics = hostPage?.topics ?? []
  const recommendations = getUniqueSongs(
    (curation?.recommendations ?? []).filter(
      (song) =>
        song.id !== officialToday?.id &&
        song.id !== todayPick?.id &&
        !officialSongs.some((officialSong) => officialSong.id === song.id),
    ),
  )

  if (!hostPage && !curation) {
    return (
      <section className="page-stack host-page">
        <style>{hostStyles}</style>
        <EmptyState
          title="AI 主理人暂时离线"
          description="主理人内容还没有加载成功，可以先去创作一首新歌。"
          actionLabel="开始创作"
          onAction={onCreate}
        />
      </section>
    )
  }

  return (
    <section className="page-stack host-page">
      <style>{hostStyles}</style>

      <section className="host-hero">
        <div className="host-hero__top">
          <button type="button" onClick={onBack}>
            返回发现页
          </button>
          <span>Daily Host</span>
        </div>

        <div className="host-hero__main">
          <div className="host-avatar" aria-hidden="true">
            <img src="/assets/echo-ai-curator.png" alt="" />
          </div>

          <div className="host-identity">
            <span>AI Curator</span>
            <h1>{hostName}</h1>
            <p>
              {hostPage?.bio ??
                '社区常驻主理人。每天写一首主打歌、抛一个话题，也会翻你们的作品。'}
            </p>
            <div className="host-stats">
              <strong>
                {formatCount(hostPage?.stats?.featuredCount ?? officialSongs.length)}
                <small>主打歌</small>
              </strong>
              <strong>
                {formatCount(hostPage?.stats?.totalLikes ?? 0)}
                <small>喜欢</small>
              </strong>
              <strong>
                {formatCount(hostPage?.stats?.totalPlays ?? 0)}
                <small>播放</small>
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section className="host-daily-grid">
        <article className="host-daily-card">
          <div className="host-section__title">
            <div>
              <span>Official Track</span>
              <h2>今日主打歌</h2>
            </div>
          </div>
          {officialToday ? (
            <>
              <p>{curation?.hostNote ?? hostPage?.greeting ?? '这是主理人今天写下的声音。'}</p>
              <HostSongItem song={officialToday} badge="Echo 主理人作品" onOpenSong={onOpenSong} />
            </>
          ) : (
            <div className="host-empty-inline">
              <strong>今日主打歌还在生成路上</strong>
              <p>今日主打歌正在准备中。</p>
            </div>
          )}
        </article>

        <article className="host-daily-card host-daily-card--pick">
          <div className="host-section__title">
            <div>
              <span>Today Pick</span>
              <h2>今日翻牌</h2>
            </div>
          </div>
          {todayPick ? (
            <>
              <p>{todayPickQuote}</p>
              <HostSongItem song={todayPick} badge="社区作品" onOpenSong={onOpenSong} />
            </>
          ) : (
            <div className="host-empty-inline">
              <strong>还没有翻牌作品</strong>
              <p>发布公开作品后，AI 主理人会从社区里挑一首认真点评。</p>
              <button type="button" onClick={onCreate}>
                去创作
              </button>
            </div>
          )}
        </article>
      </section>

      {topics.length ? (
        <section className="host-section">
          <div className="host-section__title">
            <div>
              <span>Topics</span>
              <h2>主理人正在抛的话题</h2>
            </div>
          </div>
          <div className="host-topic-grid">
            {topics.map((topic) => (
              <article className="host-topic" key={topic.id}>
                <strong>{topic.title}</strong>
                <p>{topic.prompt}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="host-section">
        <div className="host-section__title">
          <div>
            <span>Host Songs</span>
            <h2>主理人的官方作品</h2>
          </div>
        </div>
        {officialSongs.length ? (
          <div className="host-song-list">
            {officialSongs.map((song) => (
              <HostSongItem key={song.id} song={song} compact onOpenSong={onOpenSong} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="还没有主理人作品"
            description="主理人还没有发布作品。"
            actionLabel="开始创作"
            onAction={onCreate}
          />
        )}
      </section>

      {recommendations.length ? (
        <section className="host-section">
          <div className="host-section__title">
            <div>
              <span>Curation</span>
              <h2>主理人顺手整理的社区声音</h2>
            </div>
          </div>
          <div className="host-song-list">
            {recommendations.map((song) => (
              <HostSongItem key={song.id} song={song} compact onOpenSong={onOpenSong} />
            ))}
          </div>
        </section>
      ) : null}
    </section>
  )
}
