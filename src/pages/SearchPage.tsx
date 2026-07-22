import { EmptyState } from '../components/EmptyState'
import { LoadingState } from '../components/LoadingState'
import { SongCard } from '../components/SongCard'
import type { Song } from '../types/song'

type SearchPageProps = {
  query: string
  songs: Song[]
  loading: boolean
  error: string
  onOpenSong: (songId: string) => void
  onPlaySong: (songId: string) => void
}

export function SearchPage({ query, songs, loading, error, onOpenSong, onPlaySong }: SearchPageProps) {
  return (
    <section className="page-stack search-page">
      <header className="search-page__heading">
        <span>Search</span>
        <h1>搜索结果</h1>
        <p>{query ? `关于“${query}”的公开音乐` : '输入歌名、作者或风格开始搜索。'}</p>
      </header>

      {loading ? <LoadingState title="正在搜索" description="正在从社区公开作品中查找" /> : null}
      {!loading && error ? <EmptyState title="搜索失败" description={error} /> : null}
      {!loading && !error && songs.length ? (
        <>
          <div className="search-page__summary">找到 {songs.length} 首作品</div>
          <div className="card-list">
            {songs.map((song) => <SongCard key={song.id} song={song} onOpen={onOpenSong} onPlay={onPlaySong} />)}
          </div>
        </>
      ) : null}
      {!loading && !error && query && !songs.length ? (
        <EmptyState title="没有找到匹配作品" description="可以换一个歌名、作者或风格关键词试试。" />
      ) : null}
    </section>
  )
}
