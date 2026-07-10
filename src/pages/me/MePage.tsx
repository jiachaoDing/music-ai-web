import { EmptyState } from '../../components/EmptyState'
import { SongCard } from '../../components/SongCard'
import { mockInviteCodes } from '../../mock/users'
import type { Song } from '../../types/song'
import type { User } from '../../types/user'
import {
  MeAccountPanel,
  MeHero,
  MeStatsPanel,
  MeStudioPanel,
} from './MeShared'
import { meStyles } from './meStyles'

type MePageProps = {
  user: User
  songs: Song[]
  onOpenSong: (songId: string) => void
}

export function MePage({ user, songs, onOpenSong }: MePageProps) {
  const inviteCode = mockInviteCodes.find(
    (code) => code.createdBy === user.id && code.status === 'unused',
  )?.code

  const stats = [
    { label: '累计作品', value: user.stats?.songCount ?? songs.length },
    { label: '总播放', value: user.stats?.playCount ?? 0 },
    { label: '收到喜欢', value: user.stats?.likedCount ?? 0 },
    { label: '连续打卡', value: `${user.streak} 天` },
  ]

  return (
    <section className="page-stack me-page">
      <style>{meStyles}</style>

      <MeHero user={user} />

      <div className="me-overview">
        <MeStatsPanel stats={stats} />
        <MeAccountPanel user={user} inviteCode={inviteCode} />
      </div>

      <MeStudioPanel />

      <section className="me-panel">
        <div className="me-panel__heading">
          <div>
            <span>Works</span>
            <h2>我的作品</h2>
          </div>
          <p>{songs.length ? `当前已展示 ${songs.length} 个作品` : '你的作品发布后会出现在这里'}</p>
        </div>
        {songs.length ? (
          <div className="card-list">
            {songs.map((song) => (
              <SongCard key={song.id} song={song} onOpen={onOpenSong} />
            ))}
          </div>
        ) : (
          <EmptyState title="还没有作品" description="完成第一次 AI 创作之后，这里就会慢慢长起来。" />
        )}
      </section>
    </section>
  )
}
