import { useState, type ChangeEvent } from 'react'
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
    description: '把热梗、吐槽和流行语写成一首能唱出来的歌。',
    placeholder: '例如：早八、DDL、咖啡续命、宿舍夜聊',
  },
  emotion: {
    title: '情绪炼歌',
    description: '把心情、日记和经历整理成旋律。',
    placeholder: '例如：今天有点累，但还是想继续往前走',
  },
  photo: {
    title: '看图写歌',
    description: '上传一张图片，再补充你想强调的氛围、故事或情绪，让 AI 根据画面写歌。',
    placeholder: '例如：这是毕业旅行合照，想写出夏天、友情和散场感',
  },
  foryou: {
    title: '为 TA 写歌',
    description: '写给一个具体的人，保留称呼、情绪和故事。',
    placeholder: '例如：写给朋友小林，感谢一起熬过考试周',
  },
  radio: {
    title: '电台纯音乐',
    description: '选择场景后生成适合此刻的纯音乐。',
    placeholder: '例如：深夜自习，安静但不困',
  },
  remix: {
    title: '翻唱 / 二创',
    description: '基于已有作品生成新的版本。',
    placeholder: '例如：把原曲改成 City Pop 风格',
  },
  fortune: {
    title: '时运歌',
    description: '根据今日关键词生成一首专属歌曲。',
    placeholder: '例如：今日关键词是回声，想要治愈感',
  },
  album: {
    title: 'AI 音乐制作人',
    description: '围绕一个主题生成概念 EP 草稿。',
    placeholder: '例如：关于夏天、操场和告别的概念 EP',
  },
}

const styleTags = ['流行', '治愈', '电子', '民谣', 'Lo-Fi', 'City Pop']

function parseStyleTags(style: string) {
  return style
    .split(/[\/,，]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(new Error('图片读取失败，请重新选择'))
    reader.readAsDataURL(file)
  })
}

export type CreateSubmission = {
  title: string
  style: string
  lyrics: string
  mode: SongMode
  prompt: string
  isInstrumental: boolean
  forWho?: string
  originId?: string
  challengeId?: string
}

export type CreateChallengeContext = {
  id: string
  title: string
  prompt?: string
}

type CreateFormPageProps = {
  mode: SongMode
  onSubmit: (payload: CreateSubmission) => Promise<void> | void
  submitting?: boolean
  initialPrompt?: string
  initialStyle?: string
  initialTitle?: string
  initialLyrics?: string
  initialOriginId?: string
  challenge?: CreateChallengeContext | null
}

export function CreateFormPage({
  mode,
  onSubmit,
  submitting = false,
  initialPrompt = '',
  initialStyle = '',
  initialTitle = '',
  initialLyrics = '',
  initialOriginId,
  challenge,
}: CreateFormPageProps) {
  const current = modeCopy[mode]
  const [prompt, setPrompt] = useState(initialPrompt)
  const [style, setStyle] = useState(initialStyle)
  const [lyrics, setLyrics] = useState(initialLyrics)
  const [generatedTitle, setGeneratedTitle] = useState(initialTitle)
  const [forWho, setForWho] = useState('')
  const [photoImage, setPhotoImage] = useState('')
  const [photoImageName, setPhotoImageName] = useState('')
  const [loadingLyrics, setLoadingLyrics] = useState(false)
  const [error, setError] = useState('')

  function pickStyle(tag: string) {
    setStyle((currentStyle) => {
      if (!currentStyle) return tag
      if (currentStyle.includes(tag)) return currentStyle
      return `${currentStyle} / ${tag}`
    })
  }

  async function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setError('')
      const imageDataUrl = await readFileAsDataUrl(file)
      setPhotoImage(imageDataUrl)
      setPhotoImageName(file.name)
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : '图片读取失败，请重试')
    }
  }

  async function handleGenerateLyrics() {
    const isPhotoMode = mode === 'photo'
    const isRadioMode = mode === 'radio'
    const nextPrompt = [prompt.trim(), style.trim() ? `风格：${style.trim()}` : ''].filter(Boolean).join('，')

    if (isPhotoMode && !photoImage) {
      setError('请先上传一张图片，再生成歌词。')
      return
    }

    if (!isPhotoMode && prompt.trim().length < 2) {
      setError('请先输入至少 2 个字的创作灵感。')
      return
    }

    try {
      setError('')
      setLoadingLyrics(true)
      const result = await generateLyrics({
        prompt: nextPrompt || '请根据图片内容写一首歌',
        mode,
        styles: parseStyleTags(style),
        forWho: mode === 'foryou' ? forWho.trim() : undefined,
        image: mode === 'photo' ? photoImage : undefined,
      })
      setGeneratedTitle(result.title)
      setStyle(result.style)
      setLyrics(isRadioMode ? '' : result.lyrics)
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'AI 写词失败，请检查后端服务。')
    } finally {
      setLoadingLyrics(false)
    }
  }

  async function handleSubmit() {
    const isPhotoMode = mode === 'photo'
    let nextTitle = generatedTitle.trim()
    const nextStyle = style.trim()
    const nextLyrics = mode === 'radio' ? '[Instrumental]' : lyrics.trim()
    const nextPrompt = prompt.trim()
    const nextForWho = forWho.trim()

    if (isPhotoMode && !photoImage) {
      setError('请先上传一张图片。')
      return
    }

    if (!isPhotoMode && !nextPrompt) {
      setError('请输入创作灵感。')
      return
    }

    if (!nextStyle) {
      setError('请补充风格标签。')
      return
    }

    if (!nextTitle && mode === 'radio') {
      try {
        setLoadingLyrics(true)
        const result = await generateLyrics({
          prompt: `${nextPrompt}。这是一首没有歌词的纯音乐，请只生成一个与场景和风格匹配的中文歌名。`,
          mode: 'radio',
          styles: parseStyleTags(nextStyle),
        })
        nextTitle = result.title.trim()
        if (result.style?.trim()) setStyle(result.style)
        setGeneratedTitle(nextTitle)
      } catch {
        nextTitle = `${nextPrompt.replace(/[，。！？,.!?]/g, ' ').trim().slice(0, 12) || '今日频率'} · 纯音乐`
        setGeneratedTitle(nextTitle)
      } finally {
        setLoadingLyrics(false)
      }
    }

    if (!nextTitle) {
      setError('请输入歌名，或先使用 AI 生成。')
      return
    }

    if (mode !== 'radio' && !nextLyrics) {
      setError('请先生成或输入歌词。')
      return
    }

    if (mode === 'foryou' && !nextForWho) {
      setError('请输入写给的对象。')
      return
    }

    setError('')

    await onSubmit({
      title: nextTitle,
      style: nextStyle,
      lyrics: nextLyrics,
      mode,
      prompt: nextPrompt || '请根据图片内容写一首歌',
      isInstrumental: mode === 'radio',
      forWho: mode === 'foryou' ? nextForWho : undefined,
      originId: initialOriginId,
      challengeId: challenge?.id,
    })
  }

  return (
    <section className="page-stack create-suite create-form-page">
      <style>{createStyles}</style>

      <header className="create-page-hero create-page-hero--compact">
        <span>AI 创作表单</span>
        <h1>{current.title}</h1>
        <p>{current.description}</p>
      </header>

      {challenge ? (
        <div className="create-challenge-context">
          <span>🏷 参加话题</span>
          <strong>{challenge.title}</strong>
          <p>{challenge.prompt ?? '围绕这个话题生成的新歌曲会自动加入挑战。'}</p>
        </div>
      ) : null}

      <form className="create-form-layout">
        <section className="create-form-panel">
          <div className="create-panel-heading">
            <span>输入信息</span>
            <h2>先写下创作素材</h2>
          </div>

          <label className="create-field">
            {mode === 'photo' ? '补充说明（可选）' : '灵感输入'}
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
              <input
                placeholder="请输入对象昵称"
                value={forWho}
                onChange={(event) => setForWho(event.target.value)}
              />
            </label>
          ) : null}

          {mode === 'photo' ? (
            <div className="create-field">
              <span>上传一张图片</span>
              <label className="create-upload-box">
                <input type="file" accept="image/*" onChange={handlePhotoChange} />
                <span>{photoImageName ? `已选择：${photoImageName}` : '上传图片后，AI 会先看图再为你写歌'}</span>
              </label>

              {photoImage ? (
                <div className="create-photo-preview">
                  <img src={photoImage} alt="上传预览" />
                </div>
              ) : null}
            </div>
          ) : null}
        </section>

        <section className="create-form-panel create-result-panel">
          <div className="create-panel-heading">
            <span>{mode === 'radio' ? '标题生成' : '歌词编辑'}</span>
            <h2>{mode === 'radio' ? '让 AI 为这段纯音乐命名' : '生成后可以继续修改'}</h2>
          </div>

          <label className="create-field">
            歌名
            <input
              placeholder="AI 写词后会自动回填，也可以手动输入"
              value={generatedTitle}
              onChange={(event) => setGeneratedTitle(event.target.value)}
            />
          </label>

          {mode !== 'radio' ? <label className="create-field create-lyrics-field">
            歌词
            {lyrics ? (
              <textarea aria-label="生成歌词" value={lyrics} onChange={(event) => setLyrics(event.target.value)} />
            ) : (
              <div className={loadingLyrics ? 'create-lyrics-empty is-loading' : 'create-lyrics-empty'}>
                {loadingLyrics ? 'AI 正在写词...' : '点击 AI 写词后，生成的歌词会显示在这里。'}
              </div>
            )}
          </label> : <div className="create-lyrics-empty">纯音乐模式不生成歌词，AI 会根据主题和风格生成匹配的标题。</div>}

          {error ? <p className="create-form-error">{error}</p> : null}

          <div className="create-form-actions">
            <button type="button" disabled={loadingLyrics || submitting} onClick={handleGenerateLyrics}>
              {loadingLyrics ? '生成中...' : mode === 'radio' ? 'AI 生成标题' : 'AI 写词'}
            </button>
            <button type="button" disabled={submitting} onClick={() => void handleSubmit()}>
              {submitting ? '生成中...' : '提交生成'}
            </button>
          </div>
        </section>
      </form>
    </section>
  )
}
