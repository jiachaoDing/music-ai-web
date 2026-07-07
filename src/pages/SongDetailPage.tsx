import type { Song } from '../types/song'
import { formatCount, formatDuration } from '../utils/format'

type SongDetailPageProps = {
  song: Song
  onOpenPoster: () => void
}

export function SongDetailPage({ song, onOpenPoster }: SongDetailPageProps) {
  return (
    <section className="page-stack">
      <div className="detail-hero">
        <div className="detail-cover">{song.title.slice(0, 1)}</div>
        <div>
          <span>{song.mode} · {song.status}</span>
          <h1>{song.title}</h1>
          <p>{song.description ?? '暂无作品简介'}</p>
          <div className="chip-row">
            <span>{song.style}</span>
            <span>{formatDuration(song.duration)}</span>
            <span>{song.author.nickname}</span>
          </div>
        </div>
      </div>
      <section className="action-grid">
        <button type="button">播放</button>
        <button type="button">点赞 {formatCount(song.likeCount)}</button>
        <button type="button">收藏</button>
        <button type="button" onClick={onOpenPoster}>海报</button>
      </section>
      <section className="content-panel">
        <h2>AI 乐评</h2>
        <p>{song.aiReview ?? '后续展示 AI 乐评、DJ 播报、进化树和树洞留言。'}</p>
      </section>
      <section className="content-panel">
        <h2>歌词</h2>
        <pre>{song.lyrics ?? '暂无歌词'}</pre>
      </section>
    </section>
  )
}
