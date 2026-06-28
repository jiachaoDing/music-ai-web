import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type Health = {
  status: string
  service: string
  timestamp: string
}

type Song = {
  id: string
  title: string
  style: string
  prompt: string
  status: string
  lyric?: string | null
}

type GeneratedSong = Song & {
  audioUrl: string | null
  createdAt: string
}

type AiLyrics = {
  title: string
  style: string
  lyrics: string
  rawText: string
}

type AiMusic = {
  status: string
  title: string
  style: string
  audioUrl: string | null
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

function App() {
  const [health, setHealth] = useState<Health | null>(null)
  const [songs, setSongs] = useState<Song[]>([])
  const [prompt, setPrompt] = useState('校园毕业季，温暖流行')
  const [style, setStyle] = useState('pop')
  const [generated, setGenerated] = useState<GeneratedSong | null>(null)
  const [idea, setIdea] = useState('夏天、校园、毕业季，温暖流行')
  const [aiLyrics, setAiLyrics] = useState<AiLyrics | null>(null)
  const [aiMusic, setAiMusic] = useState<AiMusic | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [lyricsLoading, setLyricsLoading] = useState(false)
  const [musicLoading, setMusicLoading] = useState(false)

  const healthLabel = useMemo(() => {
    if (!health) return '未连接'
    return health.status === 'ok' ? '运行正常' : health.status
  }, [health])

  async function loadData() {
    setError('')
    try {
      const [healthRes, songsRes] = await Promise.all([
        fetch(`${apiBaseUrl}/health`),
        fetch(`${apiBaseUrl}/api/songs`),
      ])
      if (!healthRes.ok || !songsRes.ok) {
        throw new Error('API 请求失败')
      }
      setHealth(await healthRes.json())
      setSongs(await songsRes.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误')
    }
  }

  async function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${apiBaseUrl}/api/generate/mock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style }),
      })
      if (!response.ok) {
        throw new Error('mock 生成失败')
      }
      const result = await response.json()
      setGenerated(result)
      setSongs((current) => [result, ...current])
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误')
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerateLyrics() {
    setLyricsLoading(true)
    setError('')
    setAiMusic(null)
    try {
      const response = await fetch(`${apiBaseUrl}/api/ai/lyrics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: idea }),
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.message ?? '歌词生成失败')
      }
      setAiLyrics(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误')
    } finally {
      setLyricsLoading(false)
    }
  }

  async function handleGenerateMusic() {
    if (!aiLyrics) return
    setMusicLoading(true)
    setError('')
    try {
      const response = await fetch(`${apiBaseUrl}/api/ai/music`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: aiLyrics.title,
          style: aiLyrics.style,
          lyrics: aiLyrics.lyrics,
        }),
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.message ?? '音乐生成失败')
      }
      setAiMusic(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误')
    } finally {
      setMusicLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  return (
    <main className="app-shell">
      <section className="workspace">
        <div className="toolbar">
          <div>
            <p className="eyebrow">Music AI Lab</p>
            <h1>AI 音乐生成实训台</h1>
          </div>
          <button type="button" onClick={loadData}>
            刷新
          </button>
        </div>

        <div className="status-grid">
          <div className="metric">
            <span>后端状态</span>
            <strong>{healthLabel}</strong>
          </div>
          <div className="metric">
            <span>API 地址</span>
            <strong>{apiBaseUrl}</strong>
          </div>
          <div className="metric">
            <span>歌曲数量</span>
            <strong>{songs.length}</strong>
          </div>
        </div>

        {error ? <p className="error">{error}</p> : null}

        <section className="ai-panel">
          <div className="section-title">
            <h2>真实 AI 体验</h2>
            <span>POST /api/ai/lyrics · POST /api/ai/music</span>
          </div>
          <div className="ai-grid">
            <div className="ai-form">
              <label>
                音乐灵感
                <textarea value={idea} onChange={(event) => setIdea(event.target.value)} />
              </label>
              <div className="button-row">
                <button type="button" onClick={handleGenerateLyrics} disabled={lyricsLoading}>
                  {lyricsLoading ? '生成歌词中' : '生成歌词'}
                </button>
                <button
                  type="button"
                  onClick={handleGenerateMusic}
                  disabled={!aiLyrics || musicLoading}
                >
                  {musicLoading ? '生成音乐中' : '生成音乐'}
                </button>
              </div>
            </div>

            <div className="ai-result">
              <span>标题</span>
              <strong>{aiLyrics?.title ?? '暂无'}</strong>
              <span>风格</span>
              <p>{aiLyrics?.style ?? '生成歌词后展示风格。'}</p>
              <span>歌词</span>
              <pre>{aiLyrics?.lyrics ?? '输入一句音乐灵感后点击生成歌词。'}</pre>
              <span>音乐结果</span>
              <p>{aiMusic ? `状态：${aiMusic.status}` : '生成歌词后可继续生成音乐。'}</p>
              {aiMusic?.audioUrl ? (
                <a href={aiMusic.audioUrl} target="_blank" rel="noreferrer">
                  {aiMusic.audioUrl}
                </a>
              ) : null}
            </div>
          </div>
        </section>

        <section className="generator">
          <form onSubmit={handleGenerate}>
            <label>
              生成提示词
              <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} />
            </label>
            <label>
              风格
              <select value={style} onChange={(event) => setStyle(event.target.value)}>
                <option value="pop">Pop</option>
                <option value="electronic">Electronic</option>
                <option value="rock">Rock</option>
                <option value="lofi">Lo-fi</option>
              </select>
            </label>
            <button type="submit" disabled={loading}>
              {loading ? '生成中' : 'Mock 生成'}
            </button>
          </form>

          <div className="result">
            <span>最近生成</span>
            <strong>{generated?.title ?? '暂无'}</strong>
            <p>{generated?.lyric ?? '提交提示词后展示 mock 结果。'}</p>
          </div>
        </section>

        <section className="song-list">
          <div className="section-title">
            <h2>歌曲列表</h2>
            <span>GET /api/songs</span>
          </div>
          <div className="table">
            {songs.map((song) => (
              <div className="table-row" key={song.id}>
                <strong>{song.title}</strong>
                <span>{song.style}</span>
                <span>{song.status}</span>
                <p>{song.prompt}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}

export default App
