import type { CSSProperties } from 'react'
import type { Song } from '../../types/song'
import { songStyle } from './DiscoverShared'
import type { ChallengeParticipant, ChallengeRecord, ChallengeSongRef } from './types'

type ChallengeDetailPageProps = {
  challenges: ChallengeRecord[]
  selectedChallenge: ChallengeRecord
  selectedChallengeSongs: ChallengeSongRef[]
  participants: ChallengeParticipant[]
  publishedSongs: Song[]
  onOpenChallenge: (challengeId: string) => void
  onOpenSong: (songId: string) => void
  onPlaySong: (songId: string) => void
  onJoin: () => void
  hasParticipated: boolean
}

export function ChallengeDetailPage({
  challenges,
  selectedChallenge,
  selectedChallengeSongs,
  participants,
  publishedSongs,
  onOpenChallenge,
  onOpenSong,
  onPlaySong,
  onJoin,
  hasParticipated,
}: ChallengeDetailPageProps) {
  function songById(songId: string) {
    return publishedSongs.find((song) => song.id === songId)
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
            <strong>围绕这个话题创作一首新歌，生成后自动加入挑战。</strong>
            <p>作品生成时会携带话题 ID；发布后，其他用户可以在下方看到歌曲和作者。</p>
          </div>

          <section className="dashed-box dashed-box--pink challenge-form-panel">
            <span>Join</span>
            <h3>{hasParticipated ? '已参与这个话题' : '参与创作'}</h3>
            <p>进入创作页后填写灵感、生成歌词和歌曲。生成请求会自动关联当前话题。</p>
            <button type="button" onClick={onJoin}>{hasParticipated ? '继续围绕话题创作' : '围绕话题创作'}</button>
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
          {participants.length ? (
            <div className="challenge-participants" aria-label="话题参与者">
              <span>参与创作者</span>
              <div>
                {participants.map((participant) => (
                  <span className="challenge-participant" key={participant.id}>
                    <strong>{participant.nickname}</strong>
                    <small>{participant.songCount} 首</small>
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          <div className="work-list work-list--masonry">
            {selectedChallengeSongs.length ? selectedChallengeSongs.map((ref) => {
              const song = songById(ref.songId)
              if (!song) return null
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
            }) : <div className="challenge-empty-work">还没有参与作品，来创作第一首吧。</div>}
          </div>
        </section>
      </main>
    </section>
  )
}
