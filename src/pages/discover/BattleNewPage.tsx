import { useMemo } from 'react'
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
  onOpenSong: (songId: string) => void
  onPlaySong: (songId: string) => void
}

const topicSeeds = [
  '哪首歌更适合深夜循环？',
  '哪首歌更像夏天快结束时的心情？',
  '哪首歌更适合送给很久没见的朋友？',
  '哪首歌更适合雨后一个人散步？',
  '哪首歌更适合放在毕业短片结尾？',
  '哪首歌更适合通勤路上的第一首？',
  '哪首歌更能把坏心情唱轻一点？',
]

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
  onOpenSong,
  onPlaySong,
}: BattleNewPageProps) {
  const randomTopic = useMemo(() => topicSeeds[Math.floor(Math.random() * topicSeeds.length)], [])
  const canCreate = songs.length >= 2 && Boolean(aId) && Boolean(bId) && aId !== bId

  function songById(songId: string) {
    return songs.find((song) => song.id === songId) ?? songs[0]
  }

  function rollTopic() {
    const nextTopic = topicSeeds[(topicSeeds.findIndex((item) => item === topic) + 1 + Math.floor(Math.random() * (topicSeeds.length - 1))) % topicSeeds.length]
    onChangeTopic(nextTopic || randomTopic)
  }

  if (songs.length < 2) {
    return (
      <section className="playground-stage battle-new-stage">
        <div className="stage-heading">
          <div>
            <span>New Battle</span>
            <h2>创建一场歌曲对决</h2>
          </div>
          <button type="button" onClick={onBack}>返回擂台</button>
        </div>

        <section className="content-panel empty-panel">
          <h2>{songs.length === 0 ? '暂无可用于对决的作品' : '还需要一首作品'}</h2>
          <p>
            {songs.length === 0
              ? '请先创作并发布至少两首歌曲，再回来发起 PK 擂台。'
              : `当前只有《${songs[0]?.title ?? '未命名作品'}》，创建擂台需要两首不同的歌曲。`}
          </p>
          <button type="button" onClick={onBack}>返回擂台列表</button>
        </section>
      </section>
    )
  }

  const songA = songById(aId)
  const songB = songById(bId)

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
            <div className="topic-input-row">
              <input value={topic} onChange={(event) => onChangeTopic(event.target.value)} />
              <button type="button" aria-label="随机生成对决主题" title="随机生成对决主题" onClick={rollTopic}>
                <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22">
                  <rect x="3" y="3" width="18" height="18" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                  <circle cx="16" cy="8" r="1.5" fill="currentColor" />
                  <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                  <circle cx="8" cy="16" r="1.5" fill="currentColor" />
                  <circle cx="16" cy="16" r="1.5" fill="currentColor" />
                </svg>
              </button>
            </div>
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
            <BattlePreviewSong song={songA} label="A" onOpen={() => onOpenSong(songA.id)} onPlay={() => onPlaySong(songA.id)} />
            <div className="versus">VS</div>
            <BattlePreviewSong song={songB} label="B" onOpen={() => onOpenSong(songB.id)} onPlay={() => onPlaySong(songB.id)} />
          </div>
        </section>
      </div>

      <div className="battle-new-actions">
        <button type="button" disabled={!canCreate} onClick={onCreate}>创建对决</button>
      </div>
    </section>
  )
}
