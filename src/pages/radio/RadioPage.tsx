import { useState } from 'react'
import type { CSSProperties } from 'react'
import { radioStyles } from './radioStyles'

type RadioTheme = {
  name: string
  station: string
  note: string
  description: string
  emoji: string
  color: string
}

const themes: RadioTheme[] = [
  { name: '清晨通勤', station: 'MORNING GO', note: '轻盈 · 清醒', description: '晨光、轻快木吉他与不慌不忙的节拍', emoji: '☀', color: '#f59e0b' },
  { name: '深夜自习', station: 'NIGHT STUDY', note: '安静 · 专注', description: '克制钢琴、低饱和氛围与稳定循环', emoji: '☾', color: '#6366f1' },
  { name: '雨天散步', station: 'RAIN WALK', note: '松弛 · 细雨', description: '雨滴质感、柔软和弦与缓慢脚步', emoji: '◌', color: '#38bdf8' },
  { name: '运动燃脂', station: 'MOVE UP', note: '有氧 · 节拍', description: '清晰鼓组、渐进律动与明亮合成器', emoji: '↗', color: '#fb7185' },
  { name: '睡前放空', station: 'SLOW DOWN', note: '舒缓 · 漂浮', description: '轻柔铺底、低频呼吸与无压旋律', emoji: '≈', color: '#a78bfa' },
  { name: '代码专注', station: 'DEEP CODE', note: '稳定 · 循环', description: '稳定拍点、极简电子与持续心流', emoji: '</>', color: '#14b8a6' },
  { name: '城市夜景', station: 'CITY NIGHT', note: '霓虹 · Lo-fi', description: 'Lo-fi、霓虹微光与柔和鼓点', emoji: '✦', color: '#8b5cf6' },
  { name: '咖啡小憩', station: 'CAFE BREAK', note: '温暖 · 慵懒', description: '爵士和弦、午后暖光与咖啡香气', emoji: '♨', color: '#d97706' },
  { name: '公路远行', station: 'OPEN ROAD', note: '开阔 · 自由', description: '开阔吉他、风声与向前的节奏', emoji: '→', color: '#0ea5e9' },
  { name: '海边日落', station: 'SUNSET FM', note: '浪漫 · 晚风', description: '海浪、晚霞与温柔的复古合成器', emoji: '◒', color: '#f97316' },
  { name: '独处时刻', station: 'INNER ROOM', note: '克制 · 内省', description: '留白钢琴、安静低音与内省情绪', emoji: '·', color: '#64748b' },
  { name: '周末打扫', station: 'CLEAN DAY', note: '轻快 · 明亮', description: '明亮贝斯、轻快拍手与周末阳光', emoji: '✺', color: '#eab308' },
  { name: '灵感漫游', station: 'DREAM WAVE', note: '梦幻 · 无界', description: '漂浮音色、梦幻空间与自由联想', emoji: '∞', color: '#ec4899' },
  { name: '午后阅读', station: 'READING PM', note: '柔和 · 木质', description: '木质音色、细腻弦乐与纸页翻动', emoji: '⌁', color: '#65a30d' },
]

const frequencies = themes.map((_, index) => (88 + (20 / (themes.length - 1)) * index).toFixed(1))

type RadioPageProps = {
  onGenerate?: (preset: { prompt: string; style: string }) => void
}

export function RadioPage({ onGenerate }: RadioPageProps) {
  const [activeIndex, setActiveIndex] = useState(6)
  const activeTheme = themes[activeIndex]
  const frequency = frequencies[activeIndex]
  const tunerPosition = `${(activeIndex / (themes.length - 1)) * 100}%`
  const knobRotation = -125 + (activeIndex / (themes.length - 1)) * 250

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
            <span className="radio-live"><i /> LIVE</span>
            <span className="radio-time">ECHO RADIO · NOW PLAYING</span>
          </div>
          <p className="radio-greeting">下午好，来点灵感吗？</p>
          <h1>给当下，调个频道</h1>
          <p className="radio-intro">从当下的心情出发，挑选一个场景。Echo 会为你编织一段不打扰思绪的纯音乐。</p>
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
          <p>{activeTheme.description}。无需歌词，生成后会进入统一的任务进度页。</p>
          <div className="radio-create-tags"><i>{activeTheme.note}</i><i>纯音乐</i><i>约 2–3 分钟</i></div>
        </div>
        <button className="radio-generate" type="button" onClick={() => onGenerate?.({ prompt: `${activeTheme.name}：${activeTheme.description}`, style: activeTheme.note.replace(' · ', ' / ') })}>
          <span className="radio-generate__wave" aria-hidden="true"><i /><i /><i /><i /></span>
          <span><strong>RECORD · 生成音乐</strong><small>以“{activeTheme.name}”频道开始创作</small></span>
          <b aria-hidden="true">→</b>
        </button>
      </section>
    </section>
  )
}
