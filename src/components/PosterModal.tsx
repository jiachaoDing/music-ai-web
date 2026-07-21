import { useEffect, useMemo, useRef, useState } from 'react'
import type { Song } from '../types/song'
import { buildApiUrl } from '../api/request'
import { resolveAssetUrl } from '../utils/asset'

type PosterModalProps = {
  song: Song
  onClose: () => void
}

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

function pickHook(lyrics?: string, fallback?: string) {
  const lines = (lyrics ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('['))

  if (!lines.length) return fallback || '让你的声音被听见'
  return [...lines].sort((a, b) => Math.abs(a.length - 16) - Math.abs(b.length - 16))[0]
}

export function PosterModal({ song, onClose }: PosterModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [drawing, setDrawing] = useState(true)
  const [error, setError] = useState('')
  const coverUrl = resolveAssetUrl(song.coverUrl)
  const shareUrl = useMemo(() => `${window.location.origin}/?s=${encodeURIComponent(song.id)}`, [song.id])

  useEffect(() => {
    let cancelled = false

    async function drawPoster() {
      const canvas = canvasRef.current
      const context = canvas?.getContext('2d')
      if (!canvas || !context) return

      setDrawing(true)
      setError('')

      const qrUrl = buildApiUrl(`/api/qr?text=${encodeURIComponent(shareUrl)}`)
      const [cover, qr] = await Promise.all([loadImage(coverUrl), loadImage(qrUrl)])
      if (cancelled) return

      try {
        const width = canvas.width
        const height = canvas.height
        const pad = 48
        context.clearRect(0, 0, width, height)
        context.fillStyle = '#0a0813'
        context.fillRect(0, 0, width, height)

        const glow = context.createRadialGradient(520, 80, 20, 520, 80, 460)
        glow.addColorStop(0, 'rgba(234,76,137,0.36)')
        glow.addColorStop(1, 'rgba(234,76,137,0)')
        context.fillStyle = glow
        context.fillRect(0, 0, width, height)

        const coverTop = 40
        const coverHeight = 430
        context.save()
        roundRect(context, 40, coverTop, width - 80, coverHeight, 32)
        context.clip()
        if (cover) {
          const scale = Math.max((width - 80) / cover.width, coverHeight / cover.height)
          const drawWidth = cover.width * scale
          const drawHeight = cover.height * scale
          context.drawImage(cover, 40 + (width - 80 - drawWidth) / 2, coverTop + (coverHeight - drawHeight) / 2, drawWidth, drawHeight)
          const overlay = context.createLinearGradient(0, coverTop, 0, coverTop + coverHeight)
          overlay.addColorStop(0, 'rgba(0,0,0,0.12)')
          overlay.addColorStop(0.58, 'rgba(0,0,0,0.04)')
          overlay.addColorStop(1, 'rgba(0,0,0,0.8)')
          context.fillStyle = overlay
          context.fillRect(40, coverTop, width - 80, coverHeight)
        } else {
          const fallback = context.createLinearGradient(40, coverTop, width - 40, coverTop + coverHeight)
          fallback.addColorStop(0, '#ea4c89')
          fallback.addColorStop(1, '#23c9a9')
          context.fillStyle = fallback
          context.fillRect(40, coverTop, width - 80, coverHeight)
        }
        context.restore()

        context.fillStyle = 'rgba(255,255,255,0.92)'
        context.font = '600 24px Microsoft YaHei, sans-serif'
        context.fillText('AI生成 · Echo', pad + 16, coverTop + 52)

        context.font = '900 48px Microsoft YaHei, sans-serif'
        context.fillStyle = '#ffffff'
        const titleLines = wrapLines(context, song.title, width - pad * 2 - 20, 2)
        const authorY = coverTop + coverHeight - 34
        const titleStartY = authorY - 26 - (titleLines.length - 1) * 56
        titleLines.forEach((line, index) => context.fillText(line, pad + 16, titleStartY + index * 56))
        context.font = '500 24px Microsoft YaHei, sans-serif'
        context.fillStyle = 'rgba(255,255,255,0.86)'
        context.fillText(`@${song.author.nickname}`, pad + 16, authorY)

        context.fillStyle = 'rgba(255,255,255,0.18)'
        context.font = '900 60px Georgia, serif'
        context.fillText('"', pad - 6, coverTop + coverHeight + 95)
        context.fillStyle = '#e8e4f5'
        context.font = '600 30px Microsoft YaHei, sans-serif'
        const hookLines = wrapLines(context, pickHook(song.lyrics, song.aiReview ?? song.description), width - pad * 2 - 20, 2)
        const hookY = coverTop + coverHeight + 110
        hookLines.forEach((line, index) => context.fillText(line, pad + 14, hookY + index * 44))

        const tagsY = hookY + hookLines.length * 44 + 24
        let tagX = pad
        const tagMaxX = width - 200
        context.font = '500 22px Microsoft YaHei, sans-serif'
        ;(song.tags.length ? song.tags : [song.style]).slice(0, 4).forEach((tag) => {
          const tagWidth = context.measureText(tag).width + 36
          if (tagX + tagWidth > tagMaxX) return
          context.fillStyle = 'rgba(234,76,137,0.2)'
          roundRect(context, tagX, tagsY, tagWidth, 40, 20)
          context.fill()
          context.fillStyle = '#ffc1da'
          context.fillText(tag, tagX + 18, tagsY + 27)
          tagX += tagWidth + 12
        })

        const qrSize = 128
        const qrX = width - pad - qrSize
        const qrY = height - pad - qrSize
        context.fillStyle = '#ffffff'
        roundRect(context, qrX - 12, qrY - 12, qrSize + 24, qrSize + 24, 16)
        context.fill()
        if (qr) context.drawImage(qr, qrX, qrY, qrSize, qrSize)

        const captionY = qrY + qrSize / 2
        context.fillStyle = '#efeaff'
        context.font = '600 24px Microsoft YaHei, sans-serif'
        context.fillText('扫码即可来听这首歌', pad, captionY - 6)
        context.fillStyle = '#8a83a5'
        context.font = '500 18px Microsoft YaHei, sans-serif'
        context.fillText('AI 生成内容 · 请理性使用与分享', pad, captionY + 28)
      } catch (nextError) {
        console.error(nextError)
        setError('海报生成失败，请稍后重试')
      } finally {
        setDrawing(false)
      }
    }

    void drawPoster()

    return () => {
      cancelled = true
    }
  }, [coverUrl, shareUrl, song])

  function downloadPoster() {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      const link = document.createElement('a')
      link.download = `echo-poster-${song.id}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (nextError) {
      console.error(nextError)
      setError('下载失败，请检查封面图片是否允许跨域访问')
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="poster-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${song.title} 分享海报`}
        onClick={(event) => event.stopPropagation()}
      >
        <canvas ref={canvasRef} className="poster-canvas" width={640} height={900} />
        <p className="poster-tip">{drawing ? '正在生成海报...' : error || '长按图片保存 · 分享给朋友，扫码即可来听'}</p>
        <div className="poster-actions">
          <button type="button" onClick={downloadPoster} disabled={drawing}>
            下载 PNG
          </button>
          <button type="button" onClick={onClose}>
            关闭
          </button>
        </div>
      </section>
    </div>
  )
}
