import { useState, type CSSProperties } from 'react'
import { EmptyState } from '../../components/EmptyState'
import { SongCard } from '../../components/SongCard'
import { mockInviteCodes } from '../../mock/users'
import type { Playlist } from '../../types/playlist'
import type { Song } from '../../types/song'
import type { User } from '../../types/user'
import { MeAccountPanel, MeHero, MeStatsPanel } from './MeShared'
import { meStyles } from './meStyles'

type MePageProps = {
  user: User
  songs: Song[]
  onOpenSong: (songId: string) => void
}

type MeTabKey = 'profile' | 'drafts' | 'works' | 'playlists'

const PLAYLIST_COLORS = ['#9ed9cc', '#a8c7f0', '#f5cfae', '#c9b8f2', '#f4b7c6']

function buildMockPlaylists(songs: Song[]): Playlist[] {
  return [
    {
      id: 'playlist_001',
      name: '毕业季循环播放',
      color: '#ea4c89',
      type: 'custom',
      isSystem: false,
      songCount: 4,
      songs: songs.slice(0, 4),
      createdAt: '2026-07-05T20:00:00.000Z',
    },
    {
      id: 'playlist_002',
      name: '深夜耳机模式',
      color: '#f58ab6',
      type: 'custom',
      isSystem: false,
      songCount: 3,
      songs: songs.slice(1, 4),
      createdAt: '2026-07-04T22:30:00.000Z',
    },
    {
      id: 'playlist_003',
      name: '我喜欢的回声',
      color: '#ffb1d0',
      type: 'liked',
      isSystem: true,
      songCount: 12,
      songs: songs.slice(0, 3),
      createdAt: '2026-07-03T18:40:00.000Z',
    },
  ]
}

export function MePage({ user, songs, onOpenSong }: MePageProps) {
  const [activeTab, setActiveTab] = useState<MeTabKey>('profile')
  const [playlists, setPlaylists] = useState<Playlist[]>(() => buildMockPlaylists(songs))
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false)
  const [playlistName, setPlaylistName] = useState('')

  const inviteCode = mockInviteCodes.find(
    (code) => code.createdBy === user.id && code.status === 'unused',
  )?.code

  const stats = [
    { label: '累计作品', value: user.stats?.songCount ?? songs.length },
    { label: '总播放', value: user.stats?.playCount ?? 0 },
    { label: '收到喜欢', value: user.stats?.likedCount ?? 0 },
    { label: '连续打卡', value: `${user.streak} 天` },
  ]

  const draftSongs = songs.filter((song) => song.status === 'draft' || !song.published)
  const latestSong = songs[0]

  function handleCreatePlaylist() {
    const nextName = playlistName.trim()
    if (!nextName) {
      window.alert('请先输入歌单名称')
      return
    }

    const nextPlaylist: Playlist = {
      id: `playlist_${Date.now()}`,
      name: nextName,
      color: PLAYLIST_COLORS[playlists.length % PLAYLIST_COLORS.length],
      type: 'custom',
      isSystem: false,
      songCount: 0,
      songs: [],
      createdAt: new Date().toISOString(),
    }

    setPlaylists((current) => [nextPlaylist, ...current])
    setPlaylistName('')
    setPlaylistModalOpen(false)
  }

  return (
    <section className="page-stack me-page">
      <style>{meStyles}</style>

      <MeHero user={user} />

      <div className="me-tabs" role="tablist" aria-label="个人页内容切换">
        <button
          type="button"
          className={activeTab === 'profile' ? 'is-active' : ''}
          onClick={() => setActiveTab('profile')}
        >
          个人信息
        </button>
        <button
          type="button"
          className={activeTab === 'drafts' ? 'is-active' : ''}
          onClick={() => setActiveTab('drafts')}
        >
          草稿箱
        </button>
        <button
          type="button"
          className={activeTab === 'works' ? 'is-active' : ''}
          onClick={() => setActiveTab('works')}
        >
          我的作品
        </button>
        <button
          type="button"
          className={activeTab === 'playlists' ? 'is-active' : ''}
          onClick={() => setActiveTab('playlists')}
        >
          我的歌单
        </button>
      </div>

      {activeTab === 'profile' ? (
        <div className="me-overview-board">
          <div className="me-overview">
            <MeStatsPanel stats={stats} />
            <MeAccountPanel user={user} inviteCode={inviteCode} />
          </div>

          <section className="me-panel me-highlight">
            <div className="me-panel__heading">
              <div>
                <span>Now Playing</span>
                <h2>最近创作</h2>
              </div>
            </div>
            {latestSong ? (
              <button
                type="button"
                className="me-highlight__card"
                onClick={() => onOpenSong(latestSong.id)}
              >
                <div className="me-highlight__hero">
                  <div className="me-highlight__art">
                    <div
                      className="me-highlight__disc"
                      style={{ '--cover-color': latestSong.author.color ?? '#ea4c89' } as CSSProperties}
                    >
                      <b />
                    </div>
                    <div className="me-highlight__title">
                      <span>{latestSong.mode}</span>
                      <strong>{latestSong.title}</strong>
                    </div>
                  </div>

                  <div className="me-highlight__details">
                    <p>
                      {latestSong.description ??
                        '这首作品已经进入个人作品库，可以继续查看详情、歌词和播放表现。'}
                    </p>
                    <div className="me-highlight__stats">
                      <span>{latestSong.playCount} 播放</span>
                      <span>{latestSong.likeCount} 喜欢</span>
                      <span>{latestSong.status === 'draft' ? '草稿' : '已发布'}</span>
                    </div>
                    <div className="me-highlight__summary">
                      <div>
                        <span>作者</span>
                        <strong>{latestSong.author.nickname}</strong>
                      </div>
                      <div>
                        <span>时长</span>
                        <strong>
                          {latestSong.duration
                            ? `${Math.floor(latestSong.duration / 60)}:${String(
                                latestSong.duration % 60,
                              ).padStart(2, '0')}`
                            : '--:--'}
                        </strong>
                      </div>
                      <div>
                        <span>风格</span>
                        <strong>{latestSong.style}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="me-highlight__footer">
                  <div className="me-highlight__wave" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                  <div className="me-highlight__cta">
                    <span>查看作品详情</span>
                  </div>
                </div>
              </button>
            ) : (
              <EmptyState
                title="还没有最近作品"
                description="目前作品库还是空的，完成一次创作后这里会优先展示最近发布的作品。"
              />
            )}
          </section>
        </div>
      ) : null}

      {activeTab === 'drafts' ? (
        <section className="me-panel">
          <div className="me-panel__heading">
            <div>
              <span>Drafts</span>
              <h2>草稿箱</h2>
            </div>
            <p>
              {draftSongs.length
                ? `当前共有 ${draftSongs.length} 首草稿作品，优先补齐封面、文案和发布信息。`
                : '当前草稿箱是空的，新的未发布作品会先进入这里。'}
            </p>
          </div>
          {draftSongs.length ? (
            <div className="card-list">
              {draftSongs.map((song) => (
                <SongCard key={song.id} song={song} onOpen={onOpenSong} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="草稿箱还是空的"
              description="开始新的创作后，未发布的作品会优先出现在这里。"
            />
          )}
        </section>
      ) : null}

      {activeTab === 'works' ? (
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
            <EmptyState
              title="还没有作品"
              description="当前账号下还没有可展示作品，可以先从创作页生成第一首歌。"
            />
          )}
        </section>
      ) : null}

      {activeTab === 'playlists' ? (
        <section className="me-panel">
          <div className="me-panel__heading">
            <div>
              <span>Playlists</span>
              <h2>我的歌单</h2>
            </div>
            <div className="me-playlist-actions">
              <p>
                当前共整理了 {playlists.length} 个歌单，包含自建歌单和喜欢的内容列表，
                方便按场景和情绪去管理作品。
              </p>
              <button
                type="button"
                className="me-create-playlist"
                onClick={() => setPlaylistModalOpen(true)}
              >
                新建歌单
              </button>
            </div>
          </div>
          <div className="me-playlist-grid">
            {playlists.map((playlist) => (
              <article key={playlist.id} className="me-playlist-card">
                <div
                  className="me-playlist-cover"
                  style={{ '--playlist-color': playlist.color ?? '#ea4c89' } as CSSProperties}
                >
                  <span>{playlist.type === 'liked' ? 'liked' : 'playlist'}</span>
                </div>
                <div className="me-playlist-body">
                  <strong>{playlist.name}</strong>
                  <p>
                    {playlist.songCount} 首歌曲
                    {playlist.isSystem ? ' · 系统歌单' : ' · 自建歌单'}
                  </p>
                  <div className="me-playlist-meta">
                    {playlist.songs?.length ? (
                      playlist.songs.slice(0, 3).map((song) => <span key={song.id}>{song.title}</span>)
                    ) : (
                      <span>等待加入歌曲</span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {playlistModalOpen ? (
        <div className="me-modal-backdrop" onClick={() => setPlaylistModalOpen(false)}>
          <div className="me-modal" onClick={(event) => event.stopPropagation()}>
            <div className="me-modal__heading">
              <div>
                <span>New Playlist</span>
                <h3>新建歌单</h3>
              </div>
              <button
                type="button"
                className="me-modal__close"
                onClick={() => setPlaylistModalOpen(false)}
              >
                关闭
              </button>
            </div>

            <label className="me-modal__field">
              <span>歌单名称</span>
              <input
                value={playlistName}
                onChange={(event) => setPlaylistName(event.target.value)}
                placeholder="比如：深夜循环、通勤耳机、夏天收藏"
              />
            </label>

            <div className="me-modal__actions">
              <button type="button" className="me-modal__ghost" onClick={() => setPlaylistModalOpen(false)}>
                取消
              </button>
              <button type="button" onClick={handleCreatePlaylist}>
                创建歌单
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
