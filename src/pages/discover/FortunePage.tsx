import { useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { Song } from '../../types/song'
import type { FortuneRecord, FortuneSongDraft } from './types'

type FortuneMode = 'vocal' | 'instrumental'

type FortunePageProps = {
  fortunes: FortuneRecord[]
  selectedDate: string
  generatedSongs: FortuneSongDraft[]
  onSelectDate: (date: string) => void
  onGenerateSong: (draft: FortuneSongDraft) => void
  onCheckin: (message: string) => void
}

const scale = [261.63, 293.66, 329.63, 392, 440, 493.88, 523.25, 587.33]

export function FortunePage({
  fortunes,
  selectedDate,
  generatedSongs,
  onSelectDate,
  onGenerateSong,
  onCheckin,
}: FortunePageProps) {
  const selectedFortune = fortunes.find((fortune) => fortune.date === selectedDate) ?? fortunes[6]
  const selectedSongs = generatedSongs.filter((draft) => draft.fortuneDate === selectedFortune.date)
  const latestSong = selectedSongs[0]?.song
  const audioContextRef = useRef<AudioContext | null>(null)
  const timersRef = useRef<number[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [showShareCard, setShowShareCard] = useState(false)

  function buildFortuneSong(mode: FortuneMode) {
    const isInstrumental = mode === 'instrumental'
    const now = new Date().toISOString()
    const lyrics = isInstrumental
      ? ''
      : `[Verse]\n今天的电量是 ${selectedFortune.battery} 分\n把心事折成节拍慢慢听\n\n[Chorus]\n让${selectedFortune.keyword}落在旋律里\n晚一点也没关系`

    const song: Song = {
      id: `song_fortune_${selectedFortune.date.replaceAll('-', '')}_${Date.now()}`,
      title: isInstrumental ? `${selectedFortune.keyword}纯音乐日签` : `${selectedFortune.keyword}时运曲`,
      description: `来自 ${selectedFortune.date} 的时运记录，关键词是 ${selectedFortune.keyword}，基调是 ${selectedFortune.mood.name}。`,
      mode: 'fortune',
      style: isInstrumental ? 'Lo-fi / 纯音乐 / 治愈' : '治愈流行 / Lo-fi',
      tags: ['时运曲', selectedFortune.keyword, selectedFortune.mood.name],
      lyrics,
      audioUrl: '',
      coverUrl: '',
      duration: isInstrumental ? 24 : 32,
      status: 'draft',
      published: false,
      isInstrumental,
      originId: null,
      aiReview: `这首歌根据今日关键词生成，适合在 ${selectedFortune.peak ?? '夜晚'} 听。`,
      author: {
        id: selectedFortune.userId,
        nickname: 'Echo Creator',
        color: selectedFortune.luckyColor.hex,
      },
      likeCount: 0,
      collectCount: 0,
      commentCount: 0,
      playCount: 0,
      remixCount: 0,
      createdAt: now,
      publishedAt: null,
    }

    onGenerateSong({ song, fortuneDate: selectedFortune.date })
  }

  function stopMelody() {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
    timersRef.current = []
    audioContextRef.current?.close()
    audioContextRef.current = null
    setIsPlaying(false)
  }

  function playMelody() {
    if (isPlaying) {
      stopMelody()
      return
    }

    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) {
      onCheckin('当前浏览器不支持 Web Audio 播放。')
      return
    }

    const audioContext = new AudioContextClass()
    audioContextRef.current = audioContext
    const seed = selectedFortune.keyword.charCodeAt(0) + selectedFortune.battery
    const melody = Array.from({ length: 16 }, (_, index) => scale[(seed + index * 2 + (index % 3)) % scale.length])
    const noteLength = 0.28

    melody.forEach((frequency, index) => {
      const startAt = audioContext.currentTime + index * noteLength
      const oscillator = audioContext.createOscillator()
      const gain = audioContext.createGain()
      oscillator.type = index % 4 === 0 ? 'triangle' : 'sine'
      oscillator.frequency.setValueAtTime(frequency, startAt)
      gain.gain.setValueAtTime(0.0001, startAt)
      gain.gain.exponentialRampToValueAtTime(0.18, startAt + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + noteLength)
      oscillator.connect(gain).connect(audioContext.destination)
      oscillator.start(startAt)
      oscillator.stop(startAt + noteLength + 0.04)
    })

    const endTimer = window.setTimeout(stopMelody, melody.length * noteLength * 1000 + 400)
    timersRef.current = [endTimer]
    setIsPlaying(true)
  }

  return (
    <section className="fortune-dashboard">
      <div className="fortune-top-grid">
        <article className="dashed-box dashed-box--yellow fortune-daily" style={{ '--feature-color': selectedFortune.luckyColor.hex } as CSSProperties}>
          <span>{selectedFortune.date}</span>
          <h2>{selectedFortune.keyword}日卡</h2>
          <p>{selectedFortune.encourage}</p>
          <div className="metric-row">
            <strong>电量 {selectedFortune.battery}%</strong>
            <strong>连续 {selectedFortune.streak} 天</strong>
            <strong>{selectedFortune.luckyColor.name}</strong>
          </div>
          <div className="fortune-actions">
            <button type="button" onClick={() => onCheckin('今日已打卡，连续签到已更新。')}>今日打卡</button>
            <button type="button" onClick={() => buildFortuneSong('vocal')}>生成演唱版</button>
            <button type="button" onClick={() => buildFortuneSong('instrumental')}>生成纯音乐版</button>
          </div>
        </article>

        <section className="dashed-box dashed-box--green calendar-panel">
          <div className="section-title">
            <div>
              <span>Calendar</span>
              <h2>7 月时运日历</h2>
            </div>
          </div>
          <div className="calendar-grid">
            {fortunes.map((fortune) => (
              <button
                className={fortune.date === selectedDate ? 'is-active' : fortune.streak > 0 ? 'is-checked' : ''}
                key={fortune.id}
                style={{ '--day-color': fortune.luckyColor.hex } as CSSProperties}
                type="button"
                onClick={() => onSelectDate(fortune.date)}
              >
                <strong>{Number(fortune.date.slice(-2))}</strong>
                <span>{fortune.keyword}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <section className="fortune-draft-card">
        <div>
          <span>{latestSong?.isInstrumental ? '旋律提示' : '时运曲草稿'}</span>
          <h2>{latestSong ? latestSong.title : '今日旋律提示'}</h2>
          <pre>
            {latestSong
              ? latestSong.lyrics || `${latestSong.title}\n风格：${latestSong.style}\n提示词：${selectedFortune.keyword}、${selectedFortune.mood.name}、${selectedFortune.recharge}、柔和合成器`
              : '点击“生成演唱版”或“生成纯音乐版”，这里会出现今天的歌词和旋律草稿。'}
          </pre>
        </div>
        <aside className="fortune-poster">
          <span>今日提示</span>
          <strong>{selectedFortune.mood.name} · 幸运数字 {selectedFortune.luckyNumber}</strong>
          <p>宜：{selectedFortune.dos?.join('、')}。忌：{selectedFortune.donts?.join('、')}。</p>
          <button type="button" onClick={() => setShowShareCard(true)}>生成分享卡</button>
        </aside>
      </section>

      {showShareCard ? (
        <section className="share-card-panel">
          <article className="share-card-preview" style={{ '--feature-color': selectedFortune.luckyColor.hex } as CSSProperties}>
            <span>Echo Fortune</span>
            <h2>{selectedFortune.keyword}日签</h2>
            <p>{selectedFortune.encourage}</p>
            <div>
              <strong>{selectedFortune.mood.name}</strong>
              <strong>幸运数字 {selectedFortune.luckyNumber}</strong>
              <strong>{selectedFortune.luckyColor.name}</strong>
            </div>
          </article>
          <div className="share-card-actions">
            <button type="button" onClick={() => onCheckin('分享卡已生成，可以截图保存。')}>提示保存</button>
            <button type="button" onClick={() => setShowShareCard(false)}>收起分享卡</button>
          </div>
        </section>
      ) : null}

      {latestSong ? (
        <article className="generated-song" style={{ '--feature-color': latestSong.author.color } as CSSProperties}>
          <span>Generated Fortune Song</span>
          <h2>{latestSong.title}</h2>
          <p>{latestSong.description}</p>
          <div className="metric-row">
            <strong>{latestSong.style}</strong>
            <strong>{latestSong.status === 'draft' ? '草稿' : latestSong.status}</strong>
            <strong>{latestSong.isInstrumental ? '纯音乐' : '演唱版'}</strong>
          </div>
          <div className="generated-actions">
            <button type="button" onClick={playMelody}>{isPlaying ? '停止旋律' : '播放旋律'}</button>
            <button type="button" onClick={() => onCheckin(`${latestSong.title} 已保存到时运草稿。`)}>保存草稿</button>
          </div>
        </article>
      ) : null}
    </section>
  )
}
