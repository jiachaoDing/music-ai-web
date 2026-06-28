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

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

function App() {
  const [health, setHealth] = useState<Health | null>(null)
  const [songs, setSongs] = useState<Song[]>([])
  const [prompt, setPrompt] = useState('校园毕业季，温暖流行')
  const [style, setStyle] = useState('pop')
  const [generated, setGenerated] = useState<GeneratedSong | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
