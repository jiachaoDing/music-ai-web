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

function getUniqueSongs(songs: Song[]) {
  const songMap = new Map<string, Song>()
  songs.forEach((song) => songMap.set(song.id, song))
  return Array.from(songMap.values())
}

function HostSongItem({
  song,
  featured,
  onOpenSong,
}: {
  song: Song
  featured?: boolean
  onOpenSong: (songId: string) => void
}) {
  const coverUrl = getSongCover(song)
  const authorName = song.author?.nickname ?? 'Echo 用户'

  return (
    <button
      type="button"
      className={featured ? 'host-song host-song--featured' : 'host-song'}
      onClick={() => onOpenSong(song.id)}
    >
      <span className="host-song__cover">
        {coverUrl ? (
          <img src={coverUrl} alt={`${song.title} 封面`} />
        ) : (
          <i aria-hidden="true">E</i>
        )}
        <b aria-hidden="true">▶</b>
      </span>
      <span className="host-song__body">
        <strong>{song.title}</strong>
        <small>
          @{authorName} · {formatDuration(song.duration)} · {formatCount(song.playCount)} 播放
        </small>
        <span className="host-song__tags">
          <em>{song.style || song.mode}</em>
          <em>{song.published ? '已发布' : '草稿'}</em>
        </span>
      </span>
      <span className="host-song__action" aria-hidden="true">
        打开
      </span>
    </button>
  )
}

export function HostPage({
  hostPage,
  curation,
  onBack,
  onCreate,
  onOpenSong,
}: HostPageProps) {
  const todayPick = curation?.featuredSong ?? hostPage?.todayPick ?? null
  const todayQuote =
    curation?.hostNote ||
    hostPage?.greeting ||
    '今天想把这首歌轻轻放到你耳边，它值得被更多人听见。'
  const featuredSongs = getUniqueSongs([
    ...(hostPage?.featuredSongs ?? []),
    ...(curation?.recommendations ?? []),
  ])
  const avatarUrl = resolveAssetUrl(hostPage?.avatarUrl ?? undefined)
  const topics = hostPage?.topics ?? []

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
            返回首页
          </button>
          <span>On Air</span>
        </div>

        <div className="host-hero__main">
          <div className="host-avatar">
            {avatarUrl ? (
              <img src={avatarUrl} alt={`${hostPage?.name ?? 'Echo 主理人'} 头像`} />
            ) : (
              <span>AI</span>
            )}
          </div>

          <div className="host-identity">
            <span>AI Curator</span>
            <h1>{hostPage?.name ?? 'Echo 主理人'}</h1>
            <p>
              {hostPage?.bio ??
                '社区常驻主理人，负责推荐灵感、策展作品和整理今日声音。'}
            </p>
            <div className="host-stats">
              <strong>
                {formatCount(hostPage?.stats?.featuredCount ?? featuredSongs.length)}
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

        {todayPick ? (
          <div className="host-pick">
            <div>
              <span>今日翻牌</span>
              <h2>{todayPick.title}</h2>
              <p>{todayQuote}</p>
            </div>
            <HostSongItem song={todayPick} featured onOpenSong={onOpenSong} />
          </div>
        ) : (
          <div className="host-pick host-pick--empty">
            <div>
              <span>今日翻牌</span>
              <h2>等待第一首主打歌</h2>
              <p>发布作品后，AI 主理人会逐步把社区里的好作品整理出来。</p>
            </div>
            <button type="button" onClick={onCreate}>
              去创作
            </button>
          </div>
        )}
      </section>

      {topics.length ? (
        <section className="host-section">
          <div className="host-section__title">
            <div>
              <span>Topics</span>
              <h2>主理人在抛的话题</h2>
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
            <span>Featured</span>
            <h2>主理人的主打歌</h2>
          </div>
        </div>
        {featuredSongs.length ? (
          <div className="host-song-list">
            {featuredSongs.map((song) => (
              <HostSongItem key={song.id} song={song} onOpenSong={onOpenSong} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="还没有主理人精选"
            description="等后端配置主理人推荐后，这里会展示 AI 主理人的推荐作品。"
            actionLabel="开始创作"
            onAction={onCreate}
          />
        )}
      </section>
    </section>
  )
}
