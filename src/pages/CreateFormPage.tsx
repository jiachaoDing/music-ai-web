import { useState } from 'react'
import { generateLyrics } from '../api/ai'
import type { SongMode } from '../types/song'

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
    title: '专辑曲目',
    description: '围绕专辑主题生成一首曲目。',
    placeholder: '例如：关于夏夜、操场和告别的概念 EP',
  },
}

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

  async function handleGenerateLyrics() {
    const nextPrompt = [prompt, style ? `风格：${style}` : ''].filter(Boolean).join('；')

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
    <section className="page-stack">
      <div className="page-heading">
        <span>AI 创作表单</span>
        <h1>{current.title}</h1>
        <p>{current.description}</p>
      </div>
      <form className="panel-form">
        <label>
          灵感输入
          <textarea
            placeholder={current.placeholder}
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
          />
        </label>
        <label>
          风格标签
          <input
            placeholder="流行 / 治愈 / 电子 / 民谣"
            value={style}
            onChange={(event) => setStyle(event.target.value)}
          />
        </label>
        {mode === 'foryou' ? (
          <label>
            写给谁
            <input placeholder="请输入对象昵称" />
          </label>
        ) : null}
        {mode === 'photo' ? (
          <label>
            图片说明
            <input placeholder="先保留上传入口，后续接文件上传" />
          </label>
        ) : null}
        <section className="content-panel">
          <h2>歌词编辑区</h2>
          {generatedTitle ? <strong>{generatedTitle}</strong> : null}
          {lyrics ? (
            <textarea
              aria-label="生成歌词"
              value={lyrics}
              onChange={(event) => setLyrics(event.target.value)}
            />
          ) : (
            <p>点击 AI 写词后，后端生成的标题、风格和歌词会出现在这里。</p>
          )}
        </section>
        {error ? <p className="form-error">{error}</p> : null}
        <div className="action-grid">
          <button type="button" disabled={loadingLyrics} onClick={handleGenerateLyrics}>
            {loadingLyrics ? '生成中...' : 'AI 写词'}
          </button>
          <button type="button" onClick={onSubmit}>
            提交生成
          </button>
        </div>
      </form>
    </section>
  )
}
