import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import {
  createPlaylist,
  getMeProfile,
  getPlaylistDetail,
  removeSongFromPlaylist,
} from '../../api/me'
import { EmptyState } from '../../components/EmptyState'
import { SongCard } from '../../components/SongCard'
import type { Playlist } from '../../types/playlist'
import type { Song } from '../../types/song'
import type { InviteCode, User } from '../../types/user'
import { resolveAssetUrl } from '../../utils/asset'
import { MeAccountPanel, MeHero, MeStatsPanel } from './MeShared'
import { meStyles } from './meStyles'

type MePageProps = {
  user: User
  songs: Song[]
  onOpenSong: (songId: string) => void
}

type MeTabKey = 'profile' | 'drafts' | 'works' | 'playlists'

const PLAYLIST_COLORS = ['#9ed9cc', '#a8c7f0', '#f5cfae', '#c9b8f2', '#f4b7c6']

function formatDuration(duration?: number) {
  if (!duration) return '--:--'
  return `${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')}`
}

function formatPlaylistType(playlist: Playlist) {
  return playlist.type === 'liked' ? '喜欢列表' : playlist.isSystem ? '系统歌单' : '自建歌单'
}

function getPlaylistCoverColor(playlist: Playlist) {
  if (playlist.type === 'liked' || playlist.name.includes('喜欢')) {
    return '#f4b7c6'
  }

  return playlist.color ?? '#9ed9cc'
}

export function MePage({ user, songs, onOpenSong }: MePageProps) {
  const [activeTab, setActiveTab] = useState<MeTabKey>('profile')
  const [profileUser, setProfileUser] = useState<User>(user)
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [profileLoading, setProfileLoading] = useState(false)
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false)
  const [playlistName, setPlaylistName] = useState('')
  const [playlistSubmitting, setPlaylistSubmitting] = useState(false)
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null)
  const [selectedPlaylistSongs, setSelectedPlaylistSongs] = useState<Song[]>([])
  const [playlistDetailLoading, setPlaylistDetailLoading] = useState(false)
  const [playlistActionLoading, setPlaylistActionLoading] = useState(false)

  useEffect(() => {
    setProfileUser(user)
  }, [user])

  useEffect(() => {
    async function hydrateMePage() {
      setProfileLoading(true)
      try {
        const profile = await getMeProfile()
        setProfileUser(profile.user)
        setInviteCodes(profile.inviteCodes)
        setPlaylists(profile.playlists)
      } catch (error) {
        console.error(error)
      } finally {
        setProfileLoading(false)
      }
    }

    void hydrateMePage()
  }, [])

  const totalPlayCount = songs.reduce((sum, song) => sum + song.playCount, 0)
  const totalLikeCount = songs.reduce((sum, song) => sum + song.likeCount, 0)
  const styleCounts = songs.reduce<Record<string, number>>((currentMap, song) => {
    song.style
      .split(/[\/、,，]/)
      .map((item) => item.trim())
      .filter(Boolean)
      .forEach((item) => {
        currentMap[item] = (currentMap[item] ?? 0) + 1
      })
    return currentMap
  }, {})

  const topStyles = Object.entries(styleCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([style]) => style)

  const inviteCode = inviteCodes.find((code) => code.status === 'unused')?.code

  const stats = [
    { label: '累计作品', value: songs.length },
    { label: '总播放', value: totalPlayCount },
    { label: '收到喜欢', value: totalLikeCount },
    { label: '连续打卡', value: `${profileUser.streak} 天` },
  ]

  const draftSongs = songs.filter((song) => !song.published || song.status === 'draft')
  const publishedSongs = songs.filter(
    (song) => song.published || song.status === 'published',
  )
  const latestSong = songs[0]
  const latestSongCoverUrl = latestSong?.coverUrl ? resolveAssetUrl(latestSong.coverUrl) : undefined

  const profileSummary = useMemo(
    () => ({
      songCount: songs.length,
      likeCount: totalLikeCount,
      playCount: totalPlayCount,
      topStyles,
    }),
    [songs, totalLikeCount, totalPlayCount, topStyles],
  )

  async function handleCreatePlaylist() {
    const nextName = playlistName.trim()
    if (!nextName) {
      window.alert('请先输入歌单名称')
      return
    }

    setPlaylistSubmitting(true)

    try {
      const nextPlaylist = await createPlaylist(
        nextName,
        PLAYLIST_COLORS[playlists.length % PLAYLIST_COLORS.length],
      )
      setPlaylists((current) => [nextPlaylist, ...current])
      setPlaylistName('')
      setPlaylistModalOpen(false)
    } catch (error) {
      console.error(error)
      window.alert(error instanceof Error ? error.message : '新建歌单失败，请稍后重试')
    } finally {
      setPlaylistSubmitting(false)
    }
  }

  async function openPlaylistDetail(playlist: Playlist) {
    setSelectedPlaylist(playlist)
    setSelectedPlaylistSongs([])
    setPlaylistDetailLoading(true)

    try {
      const detail = await getPlaylistDetail(playlist.id)
      setSelectedPlaylist(detail.playlist)
      setSelectedPlaylistSongs(detail.songs)
      setPlaylists((current) =>
        current.map((item) => (item.id === detail.playlist.id ? detail.playlist : item)),
      )
    } catch (error) {
      console.error(error)
      window.alert(error instanceof Error ? error.message : '获取歌单详情失败，请稍后重试')
      setSelectedPlaylist(null)
    } finally {
      setPlaylistDetailLoading(false)
    }
  }

  async function handleRemoveSongFromPlaylist(songId: string) {
    if (!selectedPlaylist) return

    setPlaylistActionLoading(true)

    try {
      await removeSongFromPlaylist(selectedPlaylist.id, songId)
      const detail = await getPlaylistDetail(selectedPlaylist.id)
      setSelectedPlaylist(detail.playlist)
      setSelectedPlaylistSongs(detail.songs)
      setPlaylists((current) =>
        current.map((item) => (item.id === detail.playlist.id ? detail.playlist : item)),
      )
    } catch (error) {
      console.error(error)
      window.alert(error instanceof Error ? error.message : '移出歌单失败，请稍后重试')
    } finally {
      setPlaylistActionLoading(false)
    }
  }

  return (
    <section className="page-stack me-page">
      <style>{meStyles}</style>

      <MeHero user={profileUser} summary={profileSummary} />

      <div className="me-tabs" role="tablist" aria-label="个人页面内容切换">
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
            <MeAccountPanel user={profileUser} inviteCode={inviteCode} loading={profileLoading} />
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
                    {latestSongCoverUrl ? (
                      <img
                        className="me-highlight__cover"
                        src={latestSongCoverUrl}
                        alt={`${latestSong.title} 封面`}
                      />
                    ) : (
                      <div
                        className="me-highlight__disc"
                        style={{ '--cover-color': latestSong.author.color ?? '#ea4c89' } as CSSProperties}
                      >
                        <b />
                      </div>
                    )}
                    <div className="me-highlight__title">
                      <span>{latestSong.mode}</span>
                      <strong>{latestSong.title}</strong>
                    </div>
                  </div>

                  <div className="me-highlight__details">
                    <p>
                      {latestSong.description ??
                        '这首作品已经进入你的个人作品库，可以继续查看详情、歌词和播放表现。'}
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
                        <strong>{formatDuration(latestSong.duration)}</strong>
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
                description="目前作品库还是空的，完成一次创作后这里会优先展示最近生成的作品。"
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
                <SongCard key={song.id} song={song} onOpen={onOpenSong} coverAspect="portrait" />
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
            <p>
              {publishedSongs.length
                ? `当前已展示 ${publishedSongs.length} 个已发布作品。`
                : '你的作品正式发布后会出现在这里。'}
            </p>
          </div>
          {publishedSongs.length ? (
            <div className="card-list">
              {publishedSongs.map((song) => (
                <SongCard key={song.id} song={song} onOpen={onOpenSong} coverAspect="portrait" />
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
                当前共整理了 {playlists.length} 个歌单，已经切换为真实数据展示，新建歌单也会直接写入后端。
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
              <article
                key={playlist.id}
                className="me-playlist-card"
                role="button"
                tabIndex={0}
                onClick={() => void openPlaylistDetail(playlist)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    void openPlaylistDetail(playlist)
                  }
                }}
              >
                <div
                  className="me-playlist-cover"
                  style={{ '--playlist-color': getPlaylistCoverColor(playlist) } as CSSProperties}
                >
                  <span>{playlist.type === 'liked' ? 'liked' : 'playlist'}</span>
                </div>
                <div className="me-playlist-body">
                  <strong>{playlist.name}</strong>
                  <p>
                    {playlist.songCount} 首歌曲 · {formatPlaylistType(playlist)}
                  </p>
                  <div className="me-playlist-meta">
                    <span>{playlist.isSystem ? '默认整理常用内容' : '可继续添加作品'}</span>
                    <span>{new Date(playlist.createdAt).toLocaleDateString('zh-CN')}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {selectedPlaylist ? (
        <div className="me-modal-backdrop" onClick={() => setSelectedPlaylist(null)}>
          <div className="me-modal me-modal--wide" onClick={(event) => event.stopPropagation()}>
            <div className="me-modal__heading">
              <div>
                <span>Playlist Detail</span>
                <h3>{selectedPlaylist.name}</h3>
              </div>
              <button
                type="button"
                className="me-modal__close"
                onClick={() => setSelectedPlaylist(null)}
              >
                关闭
              </button>
            </div>

            <div className="me-playlist-detail-head">
              <div
                className="me-playlist-detail-cover"
                style={{ '--playlist-color': getPlaylistCoverColor(selectedPlaylist) } as CSSProperties}
              >
                <span>{selectedPlaylist.type === 'liked' ? 'liked' : 'playlist'}</span>
              </div>
              <div>
                <p>
                  {selectedPlaylist.songCount} 首歌曲 · {formatPlaylistType(selectedPlaylist)}
                </p>
                <p>
                  创建于 {new Date(selectedPlaylist.createdAt).toLocaleDateString('zh-CN')}
                </p>
              </div>
            </div>

            {playlistDetailLoading ? (
              <div className="me-playlist-empty">正在加载歌单歌曲...</div>
            ) : selectedPlaylistSongs.length ? (
              <div className="me-playlist-song-list">
                {selectedPlaylistSongs.map((song) => (
                  <div key={song.id} className="me-playlist-song-row">
                    <button type="button" onClick={() => onOpenSong(song.id)}>
                      <strong>{song.title}</strong>
                      <span>{song.style} · {formatDuration(song.duration)}</span>
                    </button>
                    <button
                      type="button"
                      className="me-playlist-song-row__remove"
                      disabled={playlistActionLoading}
                      onClick={() => void handleRemoveSongFromPlaylist(song.id)}
                    >
                      移出
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="me-playlist-empty">这个歌单还没有歌曲，可以从“我的作品”里加入。</div>
            )}
          </div>
        </div>
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
              <button
                type="button"
                className="me-modal__ghost"
                disabled={playlistSubmitting}
                onClick={() => setPlaylistModalOpen(false)}
              >
                取消
              </button>
              <button type="button" disabled={playlistSubmitting} onClick={() => void handleCreatePlaylist()}>
                {playlistSubmitting ? '创建中...' : '创建歌单'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
