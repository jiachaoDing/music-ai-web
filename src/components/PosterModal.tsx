import type { Song } from '../types/song'

type PosterModalProps = {
  song: Song
  onClose: () => void
}

export function PosterModal({ song, onClose }: PosterModalProps) {
  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="poster-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className="poster-preview">
          {song.coverUrl ? <img className="poster-preview__image" src={song.coverUrl} alt={`${song.title} 海报封面`} /> : null}
          <span>Echo AI</span>
          <strong>{song.title}</strong>
          <p>{song.aiReview ?? song.description ?? '把灵感唱成回声'}</p>
          <small>{song.author.nickname} · {song.style}</small>
        </div>
        <div className="poster-actions">
          <button type="button">下载 PNG</button>
          <button type="button" onClick={onClose}>
            关闭
          </button>
        </div>
      </section>
    </div>
  )
}
