import type { Song } from '../../types/song'
import { BattlePreviewSong } from './DiscoverShared'

type BattleNewPageProps = {
  songs: Song[]
  topic: string
  aId: string
  bId: string
  onChangeTopic: (topic: string) => void
  onChangeAId: (songId: string) => void
  onChangeBId: (songId: string) => void
  onCreate: () => void
  onBack: () => void
}

export function BattleNewPage({
  songs,
  topic,
  aId,
  bId,
  onChangeTopic,
  onChangeAId,
  onChangeBId,
  onCreate,
  onBack,
}: BattleNewPageProps) {
  function songById(songId: string) {
    return songs.find((song) => song.id === songId) ?? songs[0]
  }

  return (
    <section className="playground-stage battle-new-stage">
      <div className="stage-heading">
        <div>
          <span>New Battle</span>
          <h2>创建一场歌曲对决</h2>
        </div>
        <button type="button" onClick={onBack}>返回擂台</button>
      </div>

      <div className="battle-new-layout">
        <section className="dashed-box dashed-box--pink battle-new-form">
          <span>Setup</span>
          <h3>选择对决内容</h3>
          <label>
            对决主题
            <input value={topic} onChange={(event) => onChangeTopic(event.target.value)} />
          </label>
          <label>
            A 方歌曲
            <select value={aId} onChange={(event) => onChangeAId(event.target.value)}>
              {songs.map((song) => (
                <option key={song.id} value={song.id}>{song.title} · {song.author.nickname}</option>
              ))}
            </select>
          </label>
          <label>
            B 方歌曲
            <select value={bId} onChange={(event) => onChangeBId(event.target.value)}>
              {songs.map((song) => (
                <option key={song.id} value={song.id}>{song.title} · {song.author.nickname}</option>
              ))}
            </select>
          </label>
        </section>

        <div className="axis-node axis-node--link" aria-hidden="true">
          <span>↔</span>
        </div>

        <section className="dashed-box dashed-box--blue battle-preview-shell">
          <span>Preview</span>
          <h3>实时对决预览</h3>
          <div className="battle-preview">
            <BattlePreviewSong song={songById(aId)} label="A" />
            <div className="versus">VS</div>
            <BattlePreviewSong song={songById(bId)} label="B" />
          </div>
        </section>
      </div>

      <div className="battle-new-actions">
        <button type="button" onClick={onCreate}>创建对决</button>
      </div>
    </section>
  )
}
