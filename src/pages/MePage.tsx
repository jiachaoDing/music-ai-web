import { EmptyState } from '../components/EmptyState'
import { SongCard } from '../components/SongCard'
import type { Song } from '../types/song'
import type { User } from '../types/user'

type MePageProps = {
  user: User
  songs: Song[]
  onOpenSong: (songId: string) => void
}

export function MePage({ user, songs, onOpenSong }: MePageProps) {
  return (
    <section className="page-stack">
      <div className="profile-panel">
        <div className="avatar">{user.nickname.slice(0, 1)}</div>
        <div>
          <h1>{user.nickname}</h1>
          <p>回声积分 {user.echoPoints} · 邀请码 {user.inviteCodes?.[0] ?? '暂无'}</p>
        </div>
      </div>
      <div className="segment-tabs">
        <button type="button" className="is-active">
          我的作品
        </button>
        <button type="button">草稿箱</button>
        <button type="button">歌单</button>
      </div>
      {songs.length ? (
        <div className="card-list">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} onOpen={onOpenSong} />
          ))}
        </div>
      ) : (
        <EmptyState title="暂无作品" description="创作或发布歌曲后会出现在这里。" />
      )}
    </section>
  )
}
