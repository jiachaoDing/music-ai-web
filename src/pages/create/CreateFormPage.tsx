import { useState } from 'react'
import { generateLyrics } from '../../api/ai'
import type { SongMode } from '../../types/song'
import { createStyles } from './createStyles'

const modeCopy: Record<SongMode, { title: string; description: string; placeholder: string }> = {
  song: {
    title: '常规创作',
    description: '输入一句灵感和风格标签，生成完整歌曲。',
    placeholder: '例如：夏天、校园、毕业季，温暖流行',
  },
  meme: {
    title: '梗歌制造机',
    description: '把热梗、吐槽或流行语改造成歌曲。',
    placeholder: '例如：关于早八和咖啡续命的搞笑歌',
  },
  emotion: {
    title: '情绪炼歌',
    description: '把心情、日记或经历整理成旋律。',
    placeholder: '例如：今天有点累，但还是想往前走',
  },
  photo: {
    title: '看图写歌',
    description: '上传图片并补充文字要求，生成画面感歌曲。',
    placeholder: '例如：一张雨天街角照片，想要电子民谣风',
  },
  foryou: {
    title: '为 TA 写歌',
    description: '写给一个具体的人，保留故事和称呼。',
    placeholder: '例如：写给朋友小林，感谢一起熬过考试周',
  },
  radio: {
    title: '电台纯音乐',
    description: '选择场景并生成适合此刻的纯音乐。',
    placeholder: '例如：深夜自习，安静但不困',
  },
  remix: {
    title: '翻唱 / 二创',
    description: '基于已有作品生成新版本。',
    placeholder: '例如：把原曲改成 City Pop 风格',
  },
  fortune: {
    title: '时运曲',
    description: '根据今日时运生成专属歌曲。',
    placeholder: '例如：今日关键词是回声，想要治愈感',
  },
  album: {
    title: 'AI 音乐制作人',
    description: '围绕专辑主题生成概念 EP 草稿。',
    placeholder: '例如：关于夏夜、操场和告别的概念 EP',
  },
}

const styleTags = ['流行', '治愈', '电子', '民谣', 'Lo-Fi', 'City Pop']

type CreateFormPageProps = {
  mode: SongMode
  onSubmit: () => void
}

export function CreateFormPage({ mode, onSubmit }: CreateFormPageProps) {
  const current = modeCopy[mode]
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('')
  const [lyrics, setLyrics] = useState('')
  const [generatedTitle, setGeneratedTitle] = useState('')
  const [loadingLyrics, setLoadingLyrics] = useState(false)
  const [error, setError] = useState('')

  function pickStyle(tag: string) {
    setStyle((currentStyle) => {
      if (!currentStyle) return tag
      if (currentStyle.includes(tag)) return currentStyle
      return `${currentStyle} / ${tag}`
    })
  }

  async function handleGenerateLyrics() {
    const nextPrompt = [prompt, style ? `风格：${style}` : ''].filter(Boolean).join('，')

    if (nextPrompt.trim().length < 2) {
      setError('请先输入至少 2 个字的灵感内容。')
      return
    }

    try {
      setError('')
      setLoadingLyrics(true)
      const result = await generateLyrics(nextPrompt)
      setGeneratedTitle(result.title)
      setStyle(result.style)
      setLyrics(result.lyrics)
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'AI 写词失败，请检查后端服务。')
    } finally {
      setLoadingLyrics(false)
    }
  }

  return (
    <section className="page-stack create-suite create-form-page">
      <style>{createStyles}</style>

      <header className="create-page-hero create-page-hero--compact">
        <span>AI 创作表单</span>
        <h1>{current.title}</h1>
        <p>{current.description}</p>
      </header>

      <form className="create-form-layout">
        <section className="create-form-panel">
          <div className="create-panel-heading">
            <span>输入信息</span>
            <h2>先写下创作材料</h2>
          </div>

          <label className="create-field">
            灵感输入
            <textarea
              placeholder={current.placeholder}
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
            />
          </label>

          <label className="create-field">
            风格标签
            <input
              placeholder="流行 / 治愈 / 电子 / 民谣"
              value={style}
              onChange={(event) => setStyle(event.target.value)}
            />
          </label>

          <div className="create-tag-row" aria-label="推荐风格">
            {styleTags.map((tag) => (
              <button type="button" key={tag} onClick={() => pickStyle(tag)}>
                {tag}
              </button>
            ))}
          </div>

          {mode === 'foryou' ? (
            <label className="create-field">
              写给谁
              <input placeholder="请输入对象昵称" />
            </label>
          ) : null}

          {mode === 'photo' ? (
            <label className="create-field">
              图片说明
              <input placeholder="先保留上传入口，后续接文件上传" />
            </label>
          ) : null}
        </section>

        <section className="create-form-panel create-result-panel">
          <div className="create-panel-heading">
            <span>歌词编辑</span>
            <h2>生成后可以继续修改</h2>
          </div>

          <label className="create-field">
            歌名
            <input
              placeholder="AI 写词后会回填歌名，也可以手动输入"
              value={generatedTitle}
              onChange={(event) => setGeneratedTitle(event.target.value)}
            />
          </label>

          <label className="create-field create-lyrics-field">
            歌词
            {lyrics ? (
              <textarea
                aria-label="生成歌词"
                value={lyrics}
                onChange={(event) => setLyrics(event.target.value)}
              />
            ) : (
              <div className={loadingLyrics ? 'create-lyrics-empty is-loading' : 'create-lyrics-empty'}>
                {loadingLyrics ? 'AI 正在写词...' : '点击 AI 写词后，生成的歌词会显示在这里。'}
              </div>
            )}
          </label>

          {error ? <p className="create-form-error">{error}</p> : null}

          <div className="create-form-actions">
            <button type="button" disabled={loadingLyrics} onClick={handleGenerateLyrics}>
              {loadingLyrics ? '生成中...' : 'AI 写词'}
            </button>
            <button type="button" onClick={onSubmit}>
              提交生成
            </button>
          </div>
        </section>
      </form>
    </section>
  )
}
