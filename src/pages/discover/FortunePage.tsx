import { useEffect, useRef, useState } from 'react'
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
  checkingIn: boolean
  checkedInToday: boolean
  onSelectDate: (date: string) => void
  onGenerateSong: (mode: FortuneMode, fortune: FortuneRecord) => void
  onCheckin: (message: string) => void
  onCheckinToday: () => void
}

const scale = [261.63, 293.66, 329.63, 392, 440, 493.88, 523.25, 587.33]

function loadImage(src?: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    if (!src) {
      resolve(null)
      return
    }

    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = () => resolve(null)
    image.src = src
  })
}

function roundRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  context.beginPath()
  context.moveTo(x + radius, y)
  context.arcTo(x + width, y, x + width, y + height, radius)
  context.arcTo(x + width, y + height, x, y + height, radius)
  context.arcTo(x, y + height, x, y, radius)
  context.arcTo(x, y, x + width, y, radius)
  context.closePath()
}

function wrapLines(context: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number) {
  const chars = (text || '').split('')
  const lines: string[] = []
  let line = ''

  chars.forEach((char) => {
    if (context.measureText(line + char).width > maxWidth && line) {
      lines.push(line)
      line = char
      return
    }
    line += char
  })

  if (line) lines.push(line)
  if (lines.length <= maxLines) return lines

  const nextLines = lines.slice(0, maxLines)
  let lastLine = nextLines[maxLines - 1] ?? ''
  while (lastLine && context.measureText(`${lastLine}...`).width > maxWidth) {
    lastLine = lastLine.slice(0, -1)
  }
  nextLines[maxLines - 1] = `${lastLine}...`
  return nextLines
}

export function FortunePage({
  fortunes,
  month,
  selectedDate,
  generatedSongs,
  generating,
  checkingIn,
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
  const shareCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const timersRef = useRef<number[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [showShareCard, setShowShareCard] = useState(false)
  const [shareQrUrl, setShareQrUrl] = useState('')
  const [sharing, setSharing] = useState(false)
  const [shareError, setShareError] = useState('')
  const today = new Date().toLocaleDateString('en-CA')
  const isPlaceholder = selectedFortune.id.startsWith('placeholder_') || selectedFortune.keyword === '待打卡'
  const isPastMissed = isPlaceholder && selectedFortune.date < today
  const isFuture = selectedFortune.date > today
  const isTodayPending = isPlaceholder && selectedFortune.date === today
  const fortuneUnavailableMessage = isPastMissed
    ? '当日未打卡，暂无时运记录'
    : isFuture
      ? '时运尚未开启'
      : isTodayPending
        ? '今日尚未打卡'
        : ''
  const canUseFortune = !isPlaceholder && !isFuture
  const canGenerateFortune = canUseFortune && selectedFortune.date === today

  useEffect(() => {
    setShowShareCard(false)
    setShareQrUrl('')
    setShareError('')
  }, [selectedFortune.date])

  useEffect(() => {
    if (!showShareCard || !shareQrUrl) return

    let cancelled = false

    async function drawShareCard() {
      const canvas = shareCanvasRef.current
      const context = canvas?.getContext('2d')
      if (!canvas || !context) return

      setSharing(true)
      setShareError('')

      const [art, qr] = await Promise.all([
        loadImage(selectedFortune.img ? resolveAssetUrl(selectedFortune.img) : undefined),
        loadImage(shareQrUrl),
      ])
      if (cancelled) return

      try {
        const width = canvas.width
        const height = canvas.height
        const pad = 42
        const accent = selectedFortune.luckyColor.hex || '#ea4c89'

        context.clearRect(0, 0, width, height)
        const bg = context.createLinearGradient(0, 0, width, height)
        bg.addColorStop(0, '#0a0813')
        bg.addColorStop(1, '#15101f')
        context.fillStyle = bg
        context.fillRect(0, 0, width, height)

        const glow = context.createRadialGradient(110, 80, 20, 110, 80, 420)
        glow.addColorStop(0, `${accent}66`)
        glow.addColorStop(1, `${accent}00`)
        context.fillStyle = glow
        context.fillRect(0, 0, width, height)

        context.fillStyle = 'rgba(255,255,255,0.88)'
        context.font = '600 21px Microsoft YaHei, sans-serif'
        context.fillText(`Echo Fortune · ${selectedFortune.date}`, pad, 60)

        const artY = 88
        const artHeight = 280
        context.save()
        roundRect(context, pad, artY, width - pad * 2, artHeight, 28)
        context.clip()
        if (art) {
          const scaleSize = Math.max((width - pad * 2) / art.width, artHeight / art.height)
          const drawWidth = art.width * scaleSize
          const drawHeight = art.height * scaleSize
          context.drawImage(art, pad + (width - pad * 2 - drawWidth) / 2, artY + (artHeight - drawHeight) / 2, drawWidth, drawHeight)
          context.fillStyle = 'rgba(10,8,19,0.2)'
          context.fillRect(pad, artY, width - pad * 2, artHeight)
        } else {
          const fallback = context.createLinearGradient(pad, artY, width - pad, artY + artHeight)
          fallback.addColorStop(0, accent)
          fallback.addColorStop(1, '#ea4c89')
          context.fillStyle = fallback
          context.fillRect(pad, artY, width - pad * 2, artHeight)
          context.textAlign = 'center'
          context.font = '120px serif'
          context.fillStyle = 'rgba(255,255,255,0.86)'
          context.fillText(selectedFortune.mood.emoji || '✦', width / 2, artY + artHeight / 2 + 42)
          context.textAlign = 'left'
        }
        context.restore()

        context.fillStyle = '#ffffff'
        context.font = '900 42px Microsoft YaHei, sans-serif'
        context.fillText(`${selectedFortune.keyword}日签`, pad, artY + artHeight + 58)
        context.fillStyle = accent
        context.font = '600 24px Microsoft YaHei, sans-serif'
        context.fillText(`今日基调 · ${selectedFortune.mood.name}`, pad, artY + artHeight + 94)

        const batteryY = artY + artHeight + 134
        context.fillStyle = 'rgba(255,255,255,0.86)'
        context.font = '600 24px Microsoft YaHei, sans-serif'
        context.fillText('今日社交电量', pad, batteryY)
        context.fillStyle = '#ffffff'
        context.font = '800 24px Microsoft YaHei, sans-serif'
        context.fillText(`${selectedFortune.battery}%`, width - pad - 66, batteryY)
        context.fillStyle = 'rgba(255,255,255,0.13)'
        roundRect(context, pad, batteryY + 16, width - pad * 2, 18, 9)
        context.fill()
        context.fillStyle = accent
        roundRect(context, pad, batteryY + 16, (width - pad * 2) * selectedFortune.battery / 100, 18, 9)
        context.fill()

        context.fillStyle = '#e8e4f5'
        context.font = '600 25px Microsoft YaHei, sans-serif'
        wrapLines(context, `「${selectedFortune.encourage || '把今天慢慢过成自己的节奏。'}」`, width - pad * 2, 2)
          .forEach((line, index) => context.fillText(line, pad, batteryY + 82 + index * 34))

        context.fillStyle = 'rgba(255,255,255,0.72)'
        context.font = '500 20px Microsoft YaHei, sans-serif'
        const actionText = selectedFortune.action || selectedFortune.recharge || selectedFortune.dos?.[0] || '留一点时间给自己'
        wrapLines(context, `今日行动：${actionText}`, width - pad * 2 - 140, 2)
          .forEach((line, index) => context.fillText(line, pad, batteryY + 154 + index * 28))

        const qrSize = 100
        const qrX = width - pad - qrSize
        const qrY = height - pad - qrSize
        context.fillStyle = '#ffffff'
        roundRect(context, qrX - 12, qrY - 12, qrSize + 24, qrSize + 24, 16)
        context.fill()
        if (qr) context.drawImage(qr, qrX, qrY, qrSize, qrSize)

        context.fillStyle = '#efeaff'
        context.font = '600 21px Microsoft YaHei, sans-serif'
        context.fillText('扫码也来测测', pad, height - 56)
        context.fillStyle = '#8a83a5'
        context.font = '500 16px Microsoft YaHei, sans-serif'
        context.fillText('给 i 人的能量日历', pad, height - 30)
      } catch (error) {
        console.error(error)
        setShareError('分享卡生成失败，请稍后重试')
      } finally {
        setSharing(false)
      }
    }

    void drawShareCard()

    return () => {
      cancelled = true
    }
  }, [selectedFortune, shareQrUrl, showShareCard])

  function checkIn() {
    if (selectedFortune.date < today) {
      onCheckin('今天之前的日期不能补打卡，请选择今天。')
      return
    }
    if (selectedFortune.date > today) {
      onCheckin('未来日期暂时不能打卡，请到当天再来。')
      return
    }
    if (checkedInToday || checkingIn) {
      onCheckin('今天已经打卡，无需重复操作。')
      return
    }
    onCheckinToday()
  }

  async function openShareCard() {
    if (!canUseFortune) {
      onCheckin(fortuneUnavailableMessage || '当前日期暂无可分享的时运记录。')
      return
    }
    setShowShareCard(true)
    setShareError('')
    setSharing(true)
    try {
      const qrUrl = await getQrCode(`${selectedFortune.keyword}日签`, window.location.origin)
      setShareQrUrl(qrUrl)
    } catch (error) {
      setShareError(error instanceof Error ? error.message : '二维码生成失败')
      setSharing(false)
    }
  }

  function downloadShareCard() {
    const canvas = shareCanvasRef.current
    if (!canvas) return

    try {
      const link = document.createElement('a')
      link.download = `echo-fortune-${selectedFortune.date}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (error) {
      console.error(error)
      setShareError('下载失败，请检查图片是否允许跨域访问')
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
          <h2>{fortuneUnavailableMessage || `${selectedFortune.keyword}日卡`}</h2>
          <p>{fortuneUnavailableMessage ? (isPastMissed ? '过去未完成打卡的日期无法补签。' : isFuture ? '请在当天到来后查看时运。' : '点击下方按钮开启今天的时运。') : selectedFortune.encourage}</p>
          {canUseFortune ? (
            <div className="metric-row">
              <strong>电量 {selectedFortune.battery}%</strong>
              <strong>连续 {selectedFortune.streak} 天</strong>
              <strong>{selectedFortune.luckyColor.name}</strong>
            </div>
          ) : null}
          <div className="fortune-actions">
            <button type="button" disabled={selectedFortune.date !== today || checkingIn || checkedInToday} className={selectedFortune.date === today && checkedInToday ? 'is-checked' : ''} onClick={checkIn}>
              {selectedFortune.date < today ? '过往日期不可打卡' : selectedFortune.date > today ? '未来日期不可打卡' : checkingIn ? '正在打卡…' : checkedInToday ? '今日已打卡' : '今日打卡'}
            </button>
            <button type="button" disabled={generating || !canGenerateFortune} onClick={() => onGenerateSong('vocal', selectedFortune)}>
              {generating ? '正在生成…' : (
                <>
                  生成演唱版
                  <span className="cost-tag">· {formatEchoCost(ECHO_COSTS.fortune)}</span>
                </>
              )}
            </button>
            <button type="button" disabled={generating || !canGenerateFortune} onClick={() => onGenerateSong('instrumental', selectedFortune)}>
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
                <span>{fortune.id.startsWith('placeholder_') || fortune.keyword === '待打卡' ? (fortune.date < today ? '未打卡' : fortune.date > today ? '未开启' : '待打卡') : fortune.keyword}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {!canUseFortune ? (
        <section className="fortune-draft-card">
          <div>
            <span>时运状态</span>
            <h2>{fortuneUnavailableMessage}</h2>
            <p>{isPastMissed ? '该日期已经无法补打卡。' : isFuture ? '请在当天到来后查看时运。' : '完成今日打卡后即可生成歌曲和分享卡。'}</p>
          </div>
        </section>
      ) : (
      <section className="fortune-draft-card">
        <div>
          <span>{latestSong?.isInstrumental ? '旋律提示' : '时运曲草稿'}</span>
          <h2>{latestSong ? latestSong.title : '今日旋律提示'}</h2>
          <pre>
            {latestSong
              ? latestSong.lyrics || `${latestSong.title}\n风格：${latestSong.style}\n提示词：${selectedFortune.keyword}、${selectedFortune.mood.name}、${selectedFortune.recharge}、柔和合成器`
              : '点击“生成演唱版”或“生成纯音乐版”，这里会出现所选日期的歌词和旋律草稿。'}
          </pre>
        </div>
        <aside className="fortune-poster">
          <span>今日提示</span>
          <strong>{selectedFortune.mood.name} · 幸运数字 {selectedFortune.luckyNumber}</strong>
          <p>宜：{selectedFortune.dos?.join('、') || '暂无'}。忌：{selectedFortune.donts?.join('、') || '暂无'}。</p>
          <button type="button" onClick={() => void openShareCard()}>生成分享卡</button>
        </aside>
      </section>
      )}

      {showShareCard ? (
        <section className="share-card-panel">
          <div className="share-card-sheet" role="dialog" aria-modal="true" aria-label="分享卡">
            <button className="share-card-close" type="button" aria-label="关闭分享海报" onClick={() => setShowShareCard(false)}>×</button>
            <article className="share-card-preview" style={{ '--feature-color': selectedFortune.luckyColor.hex } as CSSProperties}>
              <canvas ref={shareCanvasRef} className="share-card-canvas" width={640} height={800} />
              <small>{sharing ? '正在生成分享卡...' : shareError || '长按图片保存 · 扫码也来测测'}</small>
            </article>
            <div className="share-card-actions">
              <button type="button" disabled={sharing} onClick={downloadShareCard}>下载 PNG</button>
              <button type="button" onClick={() => setShowShareCard(false)}>收起分享卡</button>
            </div>
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
