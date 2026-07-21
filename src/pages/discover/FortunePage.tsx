import { useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { getQrCode } from '../../api/discovery'
import { resolveAssetUrl } from '../../utils/asset'
import { ECHO_COSTS, formatEchoCost } from '../../utils/echoCost'
import type { FortuneRecord, FortuneSongDraft } from './types'

type FortuneMode = 'vocal' | 'instrumental'

type FortunePageProps = {
  fortunes: FortuneRecord[]
  month: string
  selectedDate: string
  generatedSongs: FortuneSongDraft[]
  generating: boolean
  checkedInToday: boolean
  onSelectDate: (date: string) => void
  onGenerateSong: (mode: FortuneMode) => void
  onCheckin: (message: string) => void
  onCheckinToday: () => void
}

const scale = [261.63, 293.66, 329.63, 392, 440, 493.88, 523.25, 587.33]

export function FortunePage({
  fortunes,
  month,
  selectedDate,
  generatedSongs,
  generating,
  checkedInToday,
  onSelectDate,
  onGenerateSong,
  onCheckin,
  onCheckinToday,
}: FortunePageProps) {
  const selectedFortune = fortunes.find((fortune) => fortune.date === selectedDate) ?? fortunes[6]
  const selectedSongs = generatedSongs.filter((draft) => draft.fortuneDate === selectedFortune.date)
  const latestSong = selectedSongs[0]?.song
  const audioContextRef = useRef<AudioContext | null>(null)
  const generatedAudioRef = useRef<HTMLAudioElement | null>(null)
  const timersRef = useRef<number[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [showShareCard, setShowShareCard] = useState(false)
  const [shareQrUrl, setShareQrUrl] = useState('')
  const [sharing, setSharing] = useState(false)
  const [shareError, setShareError] = useState('')
  const today = new Date().toLocaleDateString('en-CA')

  function checkIn() {
    if (selectedFortune.date < today) {
      onCheckin('今天之前的日期不能补打卡，请选择今天。')
      return
    }
    if (selectedFortune.date > today) {
      onCheckin('未来日期暂时不能打卡，请到当天再来。')
      return
    }
    if (checkedInToday) {
      onCheckin('今天已经打卡，无需重复操作。')
      return
    }
    onCheckinToday()
  }

  async function openShareCard() {
    setShowShareCard(true)
    setShareError('')
    setSharing(true)
    try {
      const qrUrl = await getQrCode(`${selectedFortune.keyword}日签`, window.location.href)
      setShareQrUrl(qrUrl)
    } catch (error) {
      setShareError(error instanceof Error ? error.message : '二维码生成失败')
    } finally {
      setSharing(false)
    }
  }

  function stopMelody() {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
    timersRef.current = []
    audioContextRef.current?.close()
    audioContextRef.current = null
    generatedAudioRef.current?.pause()
    generatedAudioRef.current = null
    setIsPlaying(false)
  }

  async function playGeneratedSong() {
    if (!latestSong?.audioUrl) {
      playMelody()
      return
    }
    if (isPlaying) {
      stopMelody()
      return
    }
    const audio = new Audio(resolveAssetUrl(latestSong.audioUrl))
    generatedAudioRef.current = audio
    audio.addEventListener('ended', stopMelody, { once: true })
    audio.addEventListener('error', () => {
      stopMelody()
      onCheckin('演唱版音频加载失败，请稍后重新生成。')
    }, { once: true })
    try {
      await audio.play()
      setIsPlaying(true)
    } catch {
      stopMelody()
      onCheckin('浏览器未能开始播放，请再次点击播放按钮。')
    }
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
          {selectedFortune.img ? (
            <img className="fortune-daily__art" src={resolveAssetUrl(selectedFortune.img)} alt={`${selectedFortune.date} 每日治愈插画`} />
          ) : null}
          <span>{selectedFortune.date}</span>
          <h2>{selectedFortune.keyword}日卡</h2>
          <p>{selectedFortune.encourage}</p>
          <div className="metric-row">
            <strong>电量 {selectedFortune.battery}%</strong>
            <strong>连续 {selectedFortune.streak} 天</strong>
            <strong>{selectedFortune.luckyColor.name}</strong>
          </div>
          <div className="fortune-actions">
            <button type="button" className={selectedFortune.date === today && checkedInToday ? 'is-checked' : ''} onClick={checkIn}>
              {selectedFortune.date < today ? '过往日期不可打卡' : selectedFortune.date > today ? '未来日期不可打卡' : checkedInToday ? '今日已打卡' : '今日打卡'}
            </button>
            <button type="button" disabled={generating} onClick={() => onGenerateSong('vocal')}>
              {generating ? '正在生成…' : (
                <>
                  生成演唱版
                  <span className="cost-tag">· {formatEchoCost(ECHO_COSTS.fortune)}</span>
                </>
              )}
            </button>
            <button type="button" disabled={generating} onClick={() => onGenerateSong('instrumental')}>
              {generating ? '正在生成…' : (
                <>
                  生成纯音乐版
                  <span className="cost-tag">· {formatEchoCost(ECHO_COSTS.fortune)}</span>
                </>
              )}
            </button>
          </div>
        </article>

        <section className="dashed-box dashed-box--green calendar-panel">
          <div className="section-title">
            <div>
              <span>Calendar</span>
              <h2>{Number(month.slice(5, 7))} 月时运日历</h2>
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
          <button type="button" onClick={() => void openShareCard()}>生成分享卡</button>
        </aside>
      </section>

      {showShareCard ? (
        <section className="share-card-panel">
          <article className="share-card-preview" style={{ '--feature-color': selectedFortune.luckyColor.hex } as CSSProperties}>
            {selectedFortune.img ? (
              <img className="share-card-preview__art" src={resolveAssetUrl(selectedFortune.img)} alt="今日治愈插画" />
            ) : null}
            <span>Echo Fortune</span>
            <h2>{selectedFortune.keyword}日签</h2>
            <p>{selectedFortune.encourage}</p>
            <div>
              <strong>{selectedFortune.mood.name}</strong>
              <strong>幸运数字 {selectedFortune.luckyNumber}</strong>
              <strong>{selectedFortune.luckyColor.name}</strong>
            </div>
            {sharing ? <small>正在生成二维码…</small> : null}
            {shareQrUrl ? <img className="share-card-preview__qr" src={resolveAssetUrl(shareQrUrl)} alt="时运分享二维码" /> : null}
            {shareError ? <small>{shareError}</small> : null}
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
            <button type="button" onClick={() => void playGeneratedSong()}>{isPlaying ? '停止播放' : latestSong.audioUrl ? '播放生成歌曲' : '播放旋律'}</button>
            <button type="button" onClick={() => onCheckin(`${latestSong.title} 已保存到时运草稿。`)}>保存草稿</button>
          </div>
        </article>
      ) : null}
    </section>
  )
}
