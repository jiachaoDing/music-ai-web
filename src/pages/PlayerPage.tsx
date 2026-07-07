import type { Song } from '../types/song'

type PlayerPageProps = {
  song?: Song
}

export function PlayerPage({ song }: PlayerPageProps) {
  return (
    <section className="player-page">
      <div className="player-disc">{song?.title.slice(0, 1) ?? 'E'}</div>
      <h1>{song?.title ?? '暂无播放内容'}</h1>
      <p>{song ? `${song.author.nickname} · ${song.style}` : '从首页或详情页选择一首作品。'}</p>
      <div className="progress-bar">
        <span style={{ width: '36%' }} />
      </div>
      <div className="action-grid">
        <button type="button">上一首</button>
        <button type="button">播放/暂停</button>
        <button type="button">下一首</button>
      </div>
    </section>
  )
}
