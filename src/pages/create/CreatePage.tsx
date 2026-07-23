import { Fragment, type CSSProperties } from 'react'
import type { SongMode } from '../../types/song'
import { ECHO_COSTS, formatEchoCost } from '../../utils/echoCost'
import { createStyles } from './createStyles'

type CreateModeCard = {
  key: Extract<SongMode, 'song' | 'meme' | 'emotion' | 'photo' | 'foryou'>
  title: string
  description: string
  inputHint: string
  marker: string
  accent: string
}

const modes: CreateModeCard[] = [
  {
    key: 'song',
    title: '常规创作',
    description: '从一句灵感开始，补充风格标签后生成完整歌曲。',
    inputHint: '一句话灵感 / 风格标签',
    marker: 'AI',
    accent: '#ea4c89',
  },
  {
    key: 'meme',
    title: '梗歌制造机',
    description: '把热梗、吐槽或流行语整理成更有记忆点的歌曲。',
    inputHint: '热梗 / 吐槽 / 流行语',
    marker: '梗',
    accent: '#fb923c',
  },
  {
    key: 'emotion',
    title: '情绪炼歌',
    description: '用心情、日记或经历描述，生成贴合当下情绪的旋律。',
    inputHint: '心情 / 日记 / 经历',
    marker: '心',
    accent: '#34d399',
  },
  {
    key: 'photo',
    title: '看图写歌',
    description: '围绕图片内容和补充文字，生成更有画面感的作品。',
    inputHint: '图片上传 / 补充文字',
    marker: '图',
    accent: '#38bdf8',
  },
  {
    key: 'foryou',
    title: '为 TA 写歌',
    description: '填写对象昵称和想表达的故事，生成一首更私人化的歌。',
    inputHint: '对象昵称 / 故事内容',
    marker: 'TA',
    accent: '#ec4899',
  },
]

const titleChars = Array.from('Where Ideas Become Sound')

type CreatePageProps = {
  onOpenForm: (mode: SongMode) => void
}

export function CreatePage({ onOpenForm }: CreatePageProps) {
  return (
    <section className="page-stack create-suite create-page">
      <style>{createStyles}</style>

      <header className="create-page-hero">
        <h1 className="create-wave-title" aria-label="Where Ideas Become Sound">
          {titleChars.map((char, index) => (
            <Fragment key={`${char}-${index}`}>
              {index === 12 && <span className="create-title-mobile-break" aria-hidden="true" />}
              <span
                className={char === ' ' ? 'create-title-space' : undefined}
                style={{ '--wave-index': index } as CSSProperties}
                aria-hidden="true"
              >
                {char}
              </span>
            </Fragment>
          ))}
        </h1>
      </header>

      <section className="create-producer-card">
        <div>
          <span className="create-producer-label">Producer Suite</span>
          <strong>AI 专辑制作人</strong>
          <p>输入一个主题，一次生成 2～6 首相关歌曲，并自动整理为一张专辑（EP）。</p>
        </div>
        <button type="button" onClick={() => onOpenForm('album')}>
          开始制作
          <span className="cost-tag">· {formatEchoCost(ECHO_COSTS.album)}</span>
        </button>
      </section>

      <section className="create-mode-section">
        <div className="create-section-heading">
          <div>
            <span>5 种创作模式</span>
            <h2>从最合适的输入方式开始</h2>
          </div>
        </div>

        <div className="create-mode-stage">
          <div className="create-turntable" aria-hidden="true">
            <span className="create-mode-orb" />
            <div>
              <strong>Echo Studio</strong>
              <small>AI music deck</small>
            </div>
          </div>
          <div className="create-mode-orbit">
            <span className="create-orbit-core">Create</span>
            {modes.map((mode, index) => (
              <button
                className={`create-mode-star create-mode-star--${index + 1}`}
                style={{ '--create-accent': mode.accent } as CSSProperties}
                type="button"
                key={mode.key}
                onClick={() => onOpenForm(mode.key)}
              >
                <span className="create-mode-index">{mode.marker}</span>
                <div>
                  <strong>{mode.title}</strong>
                  <p>{mode.inputHint}</p>
                  <small className="create-mode-cost">消耗 {formatEchoCost(ECHO_COSTS[mode.key])}</small>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </section>
  )
}
