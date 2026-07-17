import type { CSSProperties } from 'react'
import type { Song } from '../../types/song'
import { songStyle } from './DiscoverShared'
import type { ChallengeRecord, ChallengeSongRef } from './types'

type ChallengeDetailPageProps = {
  challenges: ChallengeRecord[]
  selectedChallenge: ChallengeRecord
  selectedChallengeSongs: ChallengeSongRef[]
  publishedSongs: Song[]
  selectedSongId: string
  creationTitle: string
  onOpenChallenge: (challengeId: string) => void
  onOpenSong: (songId: string) => void
  onPlaySong: (songId: string) => void
  onChangeSelectedSongId: (songId: string) => void
  onChangeCreationTitle: (title: string) => void
  onSubmit: () => void
}

export function ChallengeDetailPage({
  challenges,
  selectedChallenge,
  selectedChallengeSongs,
  publishedSongs,
  selectedSongId,
  creationTitle,
  onOpenChallenge,
  onOpenSong,
  onPlaySong,
  onChangeSelectedSongId,
  onChangeCreationTitle,
  onSubmit,
}: ChallengeDetailPageProps) {
  function songById(songId: string) {
    return publishedSongs.find((song) => song.id === songId) ?? publishedSongs[0]
  }

  return (
    <section className="challenge-lab">
      <aside className="playground-rail challenge-rail rail-scroll" aria-label="挑战主题列表">
        <div className="rail-title">Topic</div>
        {challenges.map((challenge) => (
          <button
            className={challenge.id === selectedChallenge.id ? 'rail-card is-active' : 'rail-card'}
            key={challenge.id}
            type="button"
            onClick={() => onOpenChallenge(challenge.id)}
          >
            <span className="rail-cover" style={{ '--cover-color': challenge.color } as CSSProperties}>
              {challenge.emoji ?? '音'}
            </span>
            <strong>{challenge.title}</strong>
            <small>{challenge.desc}</small>
          </button>
        ))}
      </aside>

      <main className="challenge-main-stage">
        <article className="challenge-banner" style={{ '--feature-color': selectedChallenge.color } as CSSProperties}>
          <div>
            <span>Topic Challenge</span>
            <h2>{selectedChallenge.title}</h2>
            <p>{selectedChallenge.desc ?? '围绕这个主题创作一首属于你的歌。'}</p>
          </div>
          <div className="challenge-badge" aria-hidden="true">{selectedChallenge.emoji ?? '音'}</div>
        </article>

        <section className="challenge-flow">
          <div className="challenge-prompt-card">
            <span>创作提示</span>
            <strong>先选一首已有作品，再给它一个适合本话题的投稿标题。</strong>
            <p>提交后作品会进入右侧列表，后续接入后端后可以按热度、时间和作者筛选。</p>
          </div>

          <section className="dashed-box dashed-box--pink challenge-form-panel">
            <span>Join</span>
            <h3>参与创作</h3>
            <label>
              作品标题
              <input value={creationTitle} onChange={(event) => onChangeCreationTitle(event.target.value)} />
            </label>
            <label>
              选择投稿作品
              <select value={selectedSongId} onChange={(event) => onChangeSelectedSongId(event.target.value)}>
                {publishedSongs.map((song) => (
                  <option key={song.id} value={song.id}>{song.title} · {song.style}</option>
                ))}
              </select>
            </label>
            <button type="button" onClick={onSubmit}>提交到挑战</button>
          </section>
        </section>

        <section className="challenge-work-panel">
          <div className="section-title">
            <div>
              <span>Works</span>
              <h2>参与作品</h2>
            </div>
            <strong>{selectedChallengeSongs.length} 首</strong>
          </div>
          <div className="work-list work-list--masonry">
            {selectedChallengeSongs.map((ref) => {
              const song = songById(ref.songId)
              return (
                <article className="compact-song" key={ref.id}>
                  <button className="mini-cover" style={songStyle(song)} type="button" aria-label={`试听 ${song.title}`} onClick={() => onPlaySong(song.id)}>
                    <span>#{ref.rank}</span>
                  </button>
                  <div>
                    <button className="compact-song__title" type="button" onClick={() => onOpenSong(song.id)}>{song.title}</button>
                    <span>{song.author.nickname} · {song.style}</span>
                    <p>{ref.note}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </main>
    </section>
  )
}
