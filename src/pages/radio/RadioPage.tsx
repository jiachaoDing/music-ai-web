import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { generateDjBroadcast, getRadioData, type DjBroadcast, type RadioThemeDto } from '../../api/radio'
import type { Song } from '../../types/song'
import { ECHO_COSTS, formatEchoCost } from '../../utils/echoCost'
import { radioStyles } from './radioStyles'

type RadioTheme = {
  id: string
  name: string
  station: string
  note: string
  description: string
  emoji: string
  color: string
  prompt: string
}

const fallbackThemes: RadioTheme[] = [
  { id: 'radio_morning', name: '清晨通勤', station: 'MORNING GO', note: '轻盈 · 清醒', description: '晨光、轻快木吉他与不慌不忙的节拍', emoji: '☀', color: '#f59e0b', prompt: 'morning commute, light guitar, bright, easy rhythm' },
  { id: 'radio_study', name: '深夜自习', station: 'NIGHT STUDY', note: '安静 · 专注', description: '克制钢琴、低饱和氛围与稳定循环', emoji: '☾', color: '#6366f1', prompt: 'quiet piano, late night study, focus, steady loop' },
  { id: 'radio_walk', name: '雨天散步', station: 'RAIN WALK', note: '松弛 · 细雨', description: '雨滴质感、柔软和弦与缓慢脚步', emoji: '◌', color: '#38bdf8', prompt: 'rain walk, soft chords, slow, relaxing' },
  { id: 'radio_move', name: '运动燃脂', station: 'MOVE UP', note: '有氧 · 节拍', description: '清晰鼓组、渐进律动与明亮合成器', emoji: '↗', color: '#fb7185', prompt: 'workout, energetic, bright synth, driving beat' },
  { id: 'radio_sleep', name: '睡前放空', station: 'SLOW DOWN', note: '舒缓 · 漂浮', description: '轻柔铺底、低频呼吸与无压旋律', emoji: '≈', color: '#a78bfa', prompt: 'sleep ambient, soft drone, gentle, dreamy, slow' },
  { id: 'radio_work', name: '代码专注', station: 'DEEP CODE', note: '稳定 · 循环', description: '稳定拍点、极简电子与持续心流', emoji: '</>', color: '#14b8a6', prompt: 'ambient, focus, minimal, steady, concentration' },
  { id: 'radio_city', name: '城市夜景', station: 'CITY NIGHT', note: '霓虹 · Lo-fi', description: 'Lo-fi、霓虹微光与柔和鼓点', emoji: '✦', color: '#8b5cf6', prompt: 'synthwave, city night, neon, retro, cruising' },
  { id: 'radio_coffee', name: '咖啡小憩', station: 'CAFE BREAK', note: '温暖 · 慵懒', description: '爵士和弦、午后暖光与咖啡香气', emoji: '♨', color: '#d97706', prompt: 'warm jazz, morning coffee, relaxing, soft piano' },
  { id: 'radio_road', name: '公路远行', station: 'OPEN ROAD', note: '开阔 · 自由', description: '开阔吉他、风声与向前的节奏', emoji: '→', color: '#0ea5e9', prompt: 'open road, guitar, wind, forward rhythm' },
  { id: 'radio_sunset', name: '海边日落', station: 'SUNSET FM', note: '浪漫 · 晚风', description: '海浪、晚霞与温柔的复古合成器', emoji: '◒', color: '#f97316', prompt: 'tropical chill, sunset, beach, soft guitar, breezy' },
  { id: 'radio_inner', name: '独处时刻', station: 'INNER ROOM', note: '克制 · 内省', description: '留白钢琴、安静低音与内省情绪', emoji: '·', color: '#64748b', prompt: 'minimal piano, quiet bass, introspective' },
  { id: 'radio_clean', name: '周末打扫', station: 'CLEAN DAY', note: '轻快 · 明亮', description: '明亮贝斯、轻快拍手与周末阳光', emoji: '✺', color: '#eab308', prompt: 'weekend, bright bass, handclaps, sunny' },
  { id: 'radio_dream', name: '灵感漫游', station: 'DREAM WAVE', note: '梦幻 · 无界', description: '漂浮音色、梦幻空间与自由联想', emoji: '∞', color: '#ec4899', prompt: 'dreamy ambient, floating, spacious, creative' },
  { id: 'radio_reading', name: '午后阅读', station: 'READING PM', note: '柔和 · 木质', description: '木质音色、细腻弦乐与纸页翻动', emoji: '⌁', color: '#65a30d', prompt: 'reading, soft strings, warm wood, afternoon' },
]

const colors = fallbackThemes.map((theme) => theme.color)

function findPresentation(theme: RadioThemeDto) {
  return fallbackThemes.find((item) => item.id === theme.id || item.name === theme.name)
}

function mapTheme(theme: RadioThemeDto, index: number): RadioTheme {
  const presentation = findPresentation(theme)
  const promptParts = theme.prompt.split(',').map((part) => part.trim()).filter(Boolean)
  return {
    id: theme.id,
    name: theme.name,
    emoji: theme.emoji,
    prompt: theme.prompt,
    station: presentation?.station ?? theme.id.replace(/^radio_/, '').replaceAll('_', ' ').toUpperCase(),
    note: presentation?.note ?? promptParts.slice(0, 2).join(' · '),
    description: presentation?.description ?? theme.prompt,
    color: presentation?.color ?? colors[index % colors.length] ?? '#8b5cf6',
  }
}

type RadioPageProps = {
  onGenerate?: (preset: { prompt: string; style: string }) => void
  songs: Song[]
  onOpenSong: (songId: string) => void
  onPlaySong: (songId: string) => void
  onPlayDj: (songId: string) => void
}

export function RadioPage({ onGenerate, songs, onOpenSong, onPlaySong, onPlayDj }: RadioPageProps) {
  const [themes, setThemes] = useState<RadioTheme[]>(fallbackThemes)
  const [activeIndex, setActiveIndex] = useState(6)
  const [greeting, setGreeting] = useState('下午好，来点灵感吗？')
  const [live, setLive] = useState(true)
  const [loadError, setLoadError] = useState('')
  const radioSongs = useMemo(() => songs.filter((song) => song.mode === 'radio'), [songs])
  const [djSongId, setDjSongId] = useState('')
  const [djBroadcast, setDjBroadcast] = useState<DjBroadcast | null>(null)
  const [djLoading, setDjLoading] = useState(false)
  const [djError, setDjError] = useState('')
  const activeTheme = themes[activeIndex]
  const frequencies = useMemo(
    () => themes.map((_, index) => (88 + (20 / Math.max(1, themes.length - 1)) * index).toFixed(1)),
    [themes],
  )
  const frequency = frequencies[activeIndex]
  const tunerPosition = `${(activeIndex / Math.max(1, themes.length - 1)) * 100}%`
  const knobRotation = -125 + (activeIndex / Math.max(1, themes.length - 1)) * 250

  useEffect(() => {
    let cancelled = false
    getRadioData()
      .then((data) => {
        if (cancelled || !data.themes?.length) return
        const nextThemes = data.themes.map(mapTheme)
        const recommendedIndex = nextThemes.findIndex((theme) => theme.id === data.current?.id)
        setThemes(nextThemes)
        setActiveIndex(recommendedIndex >= 0 ? recommendedIndex : 0)
        setGreeting(data.greeting || '来点灵感吗？')
        setLive(data.live)
        setLoadError('')
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setLoadError(error instanceof Error ? error.message : '电台数据暂时加载失败')
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!radioSongs.some((song) => song.id === djSongId)) setDjSongId(radioSongs[0]?.id ?? '')
  }, [djSongId, radioSongs])

  async function createDjBroadcast() {
    if (!djSongId) return
    setDjLoading(true)
    setDjError('')
    try {
      setDjBroadcast(await generateDjBroadcast(djSongId))
    } catch (error) {
      setDjError(error instanceof Error ? error.message : 'AI DJ 播报生成失败')
    } finally {
      setDjLoading(false)
    }
  }

  function tuneTo(index: number) {
    setActiveIndex((index + themes.length) % themes.length)
  }

  function tuneNext() {
    tuneTo(activeIndex + 1)
  }

  function tunePrevious() {
    tuneTo(activeIndex - 1)
  }

  return (
    <section className="page-stack radio-page" style={{ '--active-radio-color': activeTheme.color } as CSSProperties}>
      <style>{radioStyles}</style>

      <header className="radio-hero">
        <div className="radio-hero__copy">
          <div className="radio-live-line">
            <span className="radio-live"><i /> {live ? 'LIVE' : 'OFFLINE'}</span>
            <span className="radio-time">ECHO RADIO · NOW PLAYING</span>
          </div>
          <p className="radio-greeting">{greeting}</p>
          {loadError ? <small className="radio-load-error">暂时无法获取最新频道，已为你准备推荐频道。</small> : null}
          <h1>给当下，调个频道</h1>
          <p className="radio-intro">这里的“电台”是一组纯音乐场景，不是直播频道。选择当下的心情或场景，Echo 会生成一首不含歌词和人声的音乐。</p>
          <div className="radio-now-meta">
            <span>此刻推荐</span>
            <strong>{activeTheme.name}</strong>
            <small>{activeTheme.description}</small>
          </div>
        </div>

        <div className="radio-console" aria-label={`当前电台：${activeTheme.name}，频率 ${frequency} MHz`}>
          <div className="radio-console__topline">
            <span>ECHO R-01</span>
            <div className="radio-console__lights" aria-hidden="true"><i /><i /><i /></div>
          </div>
          <div className="radio-display">
            <div className="radio-display__status"><i /> LIVE SIGNAL</div>
            <div className="radio-display__frequency"><strong>{frequency}</strong><span>MHz</span></div>
            <div className="radio-display__station">{activeTheme.station} · {activeTheme.name}</div>
            <div className="radio-equalizer" aria-hidden="true">
              {Array.from({ length: 22 }, (_, index) => <i key={index} />)}
            </div>
          </div>
          <div className="radio-console__hardware">
            <div className="radio-speaker" aria-hidden="true"><span /></div>
            <div className="radio-controls">
              <button className="radio-knob" type="button" onClick={tuneNext} aria-label="旋转调台旋钮，切换到下一个频道">
                <i style={{ transform: `rotate(${knobRotation}deg)` }} />
              </button>
              <span>TUNING</span>
              <div className="radio-toggle-row">
                <button type="button" onClick={tunePrevious} aria-label="上一个频道">‹</button>
                <button type="button" onClick={tuneNext} aria-label="自动搜台">SCAN</button>
                <button type="button" onClick={tuneNext} aria-label="下一个频道">›</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="radio-themes" aria-labelledby="radio-themes-title">
        <div className="radio-section-heading">
          <div><span>MOOD FREQUENCIES</span><h2 id="radio-themes-title">调到与你同频的频道</h2></div>
          <button className="radio-refresh" type="button" onClick={tuneNext}><span aria-hidden="true">↻</span> 换一个</button>
        </div>

        <div className="radio-tuner">
          <div className="radio-tuner__screen">
            <div className="radio-tuner__numbers" aria-hidden="true"><span>88</span><span>90</span><span>92</span><span>94</span><span>96</span><span>98</span><span>100</span><span>102</span><span>104</span><span>106</span><span>108</span></div>
            <div className="radio-tuner__rail" aria-hidden="true"><i style={{ left: tunerPosition }} /></div>
            <div className="radio-tuner__caption"><span>FM</span><strong>{frequency} MHz · {activeTheme.name}</strong><small>SELECTED CHANNEL</small></div>
          </div>
          <button className="radio-tuner__knob" type="button" onClick={tuneNext} aria-label="转动调频旋钮">
            <i style={{ transform: `rotate(${knobRotation}deg)` }} />
          </button>
        </div>

        <div className="radio-theme-cloud" aria-label="14 个电台预设频道">
          {themes.map((theme, index) => (
            <button className={`radio-theme ${index === activeIndex ? 'is-current' : ''}`} style={{ '--radio-accent': theme.color } as CSSProperties} type="button" key={theme.name} onClick={() => tuneTo(index)} aria-pressed={index === activeIndex}>
              <span className="radio-theme__icon">{theme.emoji}</span>
              <span className="radio-theme__copy"><strong>{theme.name}</strong><small>{theme.note}</small></span>
              {index === activeIndex ? <i className="radio-theme__progress" /> : null}
            </button>
          ))}
        </div>
      </section>

      <section className="radio-create-stage">
        <div className="radio-create-visual" aria-hidden="true"><div className="radio-rec-light"><i /></div><div className="radio-meter"><span /><span /><span /><span /><span /></div><small>READY</small></div>
        <div className="radio-create-copy">
          <span>INSTRUMENTAL GENERATOR</span>
          <h2>把“{activeTheme.name}”变成一段旋律</h2>
          <p>将根据当前频道生成一首纯音乐。</p>
          <div className="radio-create-tags"><i>{activeTheme.note}</i><i>纯音乐</i><i>约 2–3 分钟</i></div>
        </div>
        <button className="radio-generate" type="button" onClick={() => onGenerate?.({ prompt: `${activeTheme.name}：${activeTheme.prompt}`, style: activeTheme.note.replace(' · ', ' / ') })}>
          <span className="radio-generate__wave" aria-hidden="true"><i /><i /><i /><i /></span>
          <span>
            <strong>RECORD · 生成音乐 <span className="cost-tag">· {formatEchoCost(ECHO_COSTS.radio)}</span></strong>
            <small>以“{activeTheme.name}”频道开始创作</small>
          </span>
          <b aria-hidden="true">→</b>
        </button>
      </section>

      <section className="radio-dj-stage">
        <div className="radio-section-heading">
          <div><span>AI DJ</span><h2>为电台作品生成一段播报</h2></div>
        </div>
        {radioSongs.length ? (
          <div className="radio-dj-controls">
            <select value={djSongId} onChange={(event) => { setDjSongId(event.target.value); setDjBroadcast(null) }}>
              {radioSongs.map((song) => <option key={song.id} value={song.id}>{song.title}</option>)}
            </select>
            <button type="button" disabled={djLoading} onClick={() => void createDjBroadcast()}>
              {djLoading ? '正在生成播报…' : '生成 AI DJ 播报'}
            </button>
            <button type="button" onClick={() => djSongId && onPlaySong(djSongId)}>播放歌曲</button>
            <button type="button" onClick={() => djSongId && onOpenSong(djSongId)}>查看作品</button>
          </div>
        ) : <p className="radio-dj-empty">生成一首电台纯音乐后，就可以在这里制作 AI DJ 播报。</p>}
        {djBroadcast ? (
          <div className="radio-dj-result">
            <p>{djBroadcast.text}</p>
            {djBroadcast.audioUrl ? (
              <button type="button" onClick={() => djSongId && onPlayDj(djSongId)}>
                播放完整播报
              </button>
            ) : null}
          </div>
        ) : null}
        {djError ? <p className="radio-dj-error">{djError}</p> : null}
      </section>
    </section>
  )
}
