import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import {
  createPlaylist,
  deletePlaylist,
  getAllPointsLedger,
  getMeProfile,
  getPointsLedger,
  getPlaylistDetail,
  removeSongFromPlaylist,
  renamePlaylist,
  type PointsLedgerItem,
} from '../../api/me'
import { EmptyState } from '../../components/EmptyState'
import { SongCard } from '../../components/SongCard'
import { getMyAlbums, type AlbumDetail } from '../../api/song'
import type { Playlist } from '../../types/playlist'
import type { Song } from '../../types/song'
import type { InviteCode, User } from '../../types/user'
import { resolveAssetUrl } from '../../utils/asset'
import { CoverImage } from '../../components/CoverImage'
import { MeAccountPanel, MeHero, MeLedgerPanel } from './MeShared'
import { meStyles } from './meStyles'

type MePageProps = {
  user: User
  songs: Song[]
  onOpenSong: (songId: string) => void
  onPlaySong?: (songId: string, queueSongs?: Song[]) => void
}

type MeTabKey = 'profile' | 'drafts' | 'works' | 'playlists'
type WorksViewKey = 'published' | 'private' | 'albums'

const PLAYLIST_COLORS = ['#9ed9cc', '#a8c7f0', '#f5cfae', '#c9b8f2', '#f4b7c6']
const ME_TAB_KEYS: MeTabKey[] = ['profile', 'drafts', 'works', 'playlists']
const WORKS_VIEW_KEYS: WorksViewKey[] = ['published', 'private', 'albums']

function readSavedView<T extends string>(key: string, allowedValues: T[], fallback: T) {
  const saved = window.sessionStorage.getItem(key) as T | null
  return saved && allowedValues.includes(saved) ? saved : fallback
}

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

function getPlaylistCoverUrl(playlist: Playlist) {
  return playlist.coverUrl ? resolveAssetUrl(playlist.coverUrl) : undefined
}

export function MePage({ user, songs, onOpenSong, onPlaySong }: MePageProps) {
  const tabStorageKey = `echo_me_tab_${user.id}`
  const worksViewStorageKey = `echo_me_works_view_${user.id}`
  const [activeTab, setActiveTab] = useState<MeTabKey>(() =>
    readSavedView(tabStorageKey, ME_TAB_KEYS, 'profile'),
  )
  const [accountView, setAccountView] = useState<'summary' | 'ledger'>('summary')
  const [worksView, setWorksView] = useState<WorksViewKey>(() =>
    readSavedView(worksViewStorageKey, WORKS_VIEW_KEYS, 'published'),
  )
  const [profileUser, setProfileUser] = useState<User>(user)
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([])
  const [invitedCount, setInvitedCount] = useState(0)
  const [copiedInviteCode, setCopiedInviteCode] = useState('')
  const [pointsLedger, setPointsLedger] = useState<PointsLedgerItem[]>([])
  const [allPointsLedger, setAllPointsLedger] = useState<PointsLedgerItem[]>([])
  const [pointsLedgerTotal, setPointsLedgerTotal] = useState(0)
  const [ledgerLoading, setLedgerLoading] = useState(false)
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [profileLoading, setProfileLoading] = useState(false)
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false)
  const [playlistName, setPlaylistName] = useState('')
  const [playlistSubmitting, setPlaylistSubmitting] = useState(false)
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null)
  const [selectedPlaylistSongs, setSelectedPlaylistSongs] = useState<Song[]>([])
  const [playlistDetailLoading, setPlaylistDetailLoading] = useState(false)
  const [playlistActionLoading, setPlaylistActionLoading] = useState(false)
  const [playlistRenameValue, setPlaylistRenameValue] = useState('')
  const [albums, setAlbums] = useState<AlbumDetail[]>([])
  const [albumsLoading, setAlbumsLoading] = useState(false)

  useEffect(() => {
    setProfileUser(user)
  }, [user])

  useEffect(() => {
    window.sessionStorage.setItem(tabStorageKey, activeTab)
  }, [activeTab, tabStorageKey])

  useEffect(() => {
    window.sessionStorage.setItem(worksViewStorageKey, worksView)
  }, [worksView, worksViewStorageKey])

  useEffect(() => {
    async function hydrateAlbums() {
      setAlbumsLoading(true)
      try {
        setAlbums(await getMyAlbums())
      } catch (error) {
        console.error(error)
        setAlbums([])
      } finally {
        setAlbumsLoading(false)
      }
    }

    void hydrateAlbums()
  }, [])

  useEffect(() => {
    async function hydrateMePage() {
      setProfileLoading(true)
      try {
        const [profile, ledger] = await Promise.all([
          getMeProfile(),
          getPointsLedger(1, 3),
        ])
        setProfileUser(profile.user)
        setInviteCodes(profile.inviteCodes)
        setInvitedCount(profile.invitedCount)
        setPlaylists(profile.playlists)
        setPointsLedger(ledger.list)
        setPointsLedgerTotal(ledger.total)
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

  async function copyInviteCode(code: string) {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      const input = document.createElement('textarea')
      input.value = code
      input.style.position = 'fixed'
      input.style.opacity = '0'
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      input.remove()
    }
    setCopiedInviteCode(code)
    window.setTimeout(() => setCopiedInviteCode(''), 1800)
  }

  async function openAllPointsLedger() {
    setAccountView('ledger')
    if (allPointsLedger.length === pointsLedgerTotal && pointsLedgerTotal > 0) return

    setLedgerLoading(true)
    try {
      const result = await getAllPointsLedger()
      setAllPointsLedger(result.list)
      setPointsLedgerTotal(result.total)
    } catch (error) {
      console.error(error)
    } finally {
      setLedgerLoading(false)
    }
  }

  const stats = [
    { label: '累计作品', value: songs.length },
    { label: '总播放', value: totalPlayCount },
    { label: '收到喜欢', value: totalLikeCount },
    { label: '连续打卡', value: `${profileUser.streak} 天` },
  ]

  const standaloneSongs = songs.filter((song) => !song.albumId)
  const draftSongs = standaloneSongs.filter(
    (song) => song.status === 'draft' || song.status === 'failed' || song.status === 'generating',
  )
  const privateSongs = standaloneSongs.filter((song) => song.status === 'private')
  const publishedSongs = standaloneSongs.filter(
    (song) => song.published && song.status === 'published',
  )
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
    setPlaylistRenameValue(playlist.name)
    setSelectedPlaylistSongs([])
    setPlaylistDetailLoading(true)

    try {
      const detail = await getPlaylistDetail(playlist.id)
      setSelectedPlaylist(detail.playlist)
      setPlaylistRenameValue(detail.playlist.name)
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

  async function handleRenamePlaylist() {
    if (!selectedPlaylist) return
    const nextName = playlistRenameValue.trim()
    if (!nextName) {
      window.alert('请先输入歌单名称')
      return
    }
    if (nextName === selectedPlaylist.name) return

    setPlaylistActionLoading(true)

    try {
      const updatedPlaylist = await renamePlaylist(selectedPlaylist.id, nextName)
      setSelectedPlaylist(updatedPlaylist)
      setPlaylistRenameValue(updatedPlaylist.name)
      setPlaylists((current) =>
        current.map((item) => (item.id === updatedPlaylist.id ? updatedPlaylist : item)),
      )
    } catch (error) {
      console.error(error)
      window.alert(error instanceof Error ? error.message : '重命名歌单失败，请稍后重试')
    } finally {
      setPlaylistActionLoading(false)
    }
  }

  async function handleDeletePlaylist() {
    if (!selectedPlaylist) return
    const confirmed = window.confirm(`确定删除歌单「${selectedPlaylist.name}」吗？歌单内的歌曲不会被删除。`)
    if (!confirmed) return

    setPlaylistActionLoading(true)

    try {
      await deletePlaylist(selectedPlaylist.id)
      setPlaylists((current) => current.filter((item) => item.id !== selectedPlaylist.id))
      setSelectedPlaylist(null)
      setSelectedPlaylistSongs([])
    } catch (error) {
      console.error(error)
      window.alert(error instanceof Error ? error.message : '删除歌单失败，请稍后重试')
    } finally {
      setPlaylistActionLoading(false)
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

  function handlePlayPlaylist(songId?: string) {
    const firstSongId = songId ?? selectedPlaylistSongs[0]?.id
    if (!firstSongId) return
    onPlaySong?.(firstSongId, selectedPlaylistSongs)
  }

  return (
    <section className="page-stack me-page">
      <style>{meStyles}</style>

      <MeHero user={profileUser} summary={profileSummary} stats={stats} />

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
            {accountView === 'ledger' ? (
              <>
                <button type="button" className="me-account-back" onClick={() => setAccountView('summary')}>← 返回钱包</button>
                <MeLedgerPanel ledger={allPointsLedger} loading={ledgerLoading} />
              </>
            ) : (
              <MeAccountPanel
                user={profileUser}
                inviteCodes={inviteCodes}
                invitedCount={invitedCount}
                copiedInviteCode={copiedInviteCode}
                ledger={pointsLedger}
                ledgerTotal={pointsLedgerTotal}
                loading={profileLoading}
                onOpenLedger={() => void openAllPointsLedger()}
                onCopyInvite={(code) => void copyInviteCode(code)}
              />
            )}
          </div>

        </div>
      ) : null}

      {activeTab === 'drafts' ? (
        <section className="me-panel">
          <div className="me-panel__heading">
            <div>
              <span>Drafts</span>
              <h2>草稿箱</h2>
            </div>
          </div>
          {draftSongs.length ? (
            <div className="card-list">
              {draftSongs.map((song) => (
                <SongCard
                  key={song.id}
                  song={song}
                  onOpen={onOpenSong}
                  onPlay={(songId) => onPlaySong?.(songId, draftSongs)}
                  coverAspect="portrait"
                />
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
            <div className="me-work-rules">
              <p>草稿、私密可删除；已发布需先转为私密。</p>
            </div>
          </div>

          <div className="me-subtabs" role="tablist" aria-label="我的作品分类">
            <button
              type="button"
              className={worksView === 'published' ? 'is-active' : ''}
              onClick={() => setWorksView('published')}
            >
              已发布
              <span>{publishedSongs.length}</span>
            </button>
            <button
              type="button"
              className={worksView === 'private' ? 'is-active' : ''}
              onClick={() => setWorksView('private')}
            >
              私密
              <span>{privateSongs.length}</span>
            </button>
            <button
              type="button"
              className={worksView === 'albums' ? 'is-active' : ''}
              onClick={() => setWorksView('albums')}
            >
              我的专辑
              <span>{albums.length}</span>
            </button>
          </div>

          {worksView === 'published' && publishedSongs.length ? (
            <div className="card-list">
              {publishedSongs.map((song) => (
                <SongCard
                  key={song.id}
                  song={song}
                  onOpen={onOpenSong}
                  onPlay={(songId) => onPlaySong?.(songId, publishedSongs)}
                  coverAspect="portrait"
                />
              ))}
            </div>
          ) : null}

          {worksView === 'private' && privateSongs.length ? (
            <div className="card-list">
              {privateSongs.map((song) => (
                <SongCard
                  key={song.id}
                  song={song}
                  onOpen={onOpenSong}
                  onPlay={(songId) => onPlaySong?.(songId, privateSongs)}
                  coverAspect="portrait"
                />
              ))}
            </div>
          ) : null}

          {worksView === 'albums' && albums.length ? (
            <div className="me-album-list">
              {albums.map(({ album, tracks }) => {
                const albumCoverUrl = album.coverUrl ? resolveAssetUrl(album.coverUrl) : undefined
                return (
                  <article className="me-album-card" key={album.id}>
                    <button
                      className="me-album-card__cover"
                      type="button"
                      disabled={!tracks.length}
                      onClick={() => tracks[0] && onOpenSong(tracks[0].id)}
                    >
                      {albumCoverUrl ? <img src={albumCoverUrl} alt={`${album.title} 专辑封面`} loading="lazy" decoding="async" /> : <span>EP</span>}
                    </button>
                    <div className="me-album-card__content">
                      <span>概念专辑 · {tracks.length} 首</span>
                      <h3>{album.title}</h3>
                      <p>{album.description || '围绕同一主题生成的音乐合集。'}</p>
                      <div className="me-album-card__tracks">
                        {tracks.map((track, index) => (
                          <button type="button" key={track.id} onClick={() => onOpenSong(track.id)}>
                            <span>{String(index + 1).padStart(2, '0')}</span>
                            <strong>{track.title}</strong>
                            <em>{formatDuration(track.duration)}</em>
                          </button>
                        ))}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : null}

          {worksView === 'published' && !publishedSongs.length ? (
            <EmptyState
              title="还没有作品"
              description="当前账号下还没有可展示作品，可以先从创作页生成第一首歌。"
            />
          ) : null}

          {worksView === 'private' && !privateSongs.length ? (
            <EmptyState
              title="还没有私密作品"
              description="你可以在歌曲详情页把已发布作品设为仅自己可见，之后会在这里管理。"
            />
          ) : null}

          {worksView === 'albums' && !albums.length ? (
            <EmptyState
              title={albumsLoading ? '正在读取专辑' : '还没有专辑'}
              description={albumsLoading ? '正在整理你的专辑和曲目。' : '使用 AI 音乐制作人后，生成的歌曲会作为一张完整专辑显示在这里。'}
            />
          ) : null}
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
                  className={`me-playlist-cover ${playlist.coverUrl ? 'has-image' : ''}`}
                  style={{ '--playlist-color': getPlaylistCoverColor(playlist) } as CSSProperties}
                >
                  {getPlaylistCoverUrl(playlist) ? (
                    <img src={getPlaylistCoverUrl(playlist)} alt={`${playlist.name} 封面`} loading="lazy" decoding="async" />
                  ) : null}
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
                className={`me-playlist-detail-cover ${selectedPlaylist.coverUrl ? 'has-image' : ''}`}
                style={{ '--playlist-color': getPlaylistCoverColor(selectedPlaylist) } as CSSProperties}
              >
                {getPlaylistCoverUrl(selectedPlaylist) ? (
                  <img src={getPlaylistCoverUrl(selectedPlaylist)} alt={`${selectedPlaylist.name} 封面`} />
                ) : null}
                <span>{selectedPlaylist.type === 'liked' ? 'liked' : 'playlist'}</span>
              </div>
              <div>
                <p>
                  {selectedPlaylist.songCount} 首歌曲 · {formatPlaylistType(selectedPlaylist)}
                </p>
                <p>
                  创建于 {new Date(selectedPlaylist.createdAt).toLocaleDateString('zh-CN')}
                </p>
                <div className="me-playlist-detail-actions">
                  <button
                    type="button"
                    className="me-playlist-play-all"
                    disabled={!selectedPlaylistSongs.length}
                    onClick={() => handlePlayPlaylist()}
                  >
                    播放全部
                  </button>
                  {!selectedPlaylist.isSystem ? (
                    <button
                      type="button"
                      className="me-playlist-danger"
                      disabled={playlistActionLoading}
                      onClick={() => void handleDeletePlaylist()}
                    >
                      删除歌单
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

            {!selectedPlaylist.isSystem ? (
              <div className="me-playlist-rename">
                <label>
                  <span>歌单名称</span>
                  <input
                    value={playlistRenameValue}
                    disabled={playlistActionLoading}
                    onChange={(event) => setPlaylistRenameValue(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        void handleRenamePlaylist()
                      }
                    }}
                  />
                </label>
                <button
                  type="button"
                  disabled={playlistActionLoading || playlistRenameValue.trim() === selectedPlaylist.name}
                  onClick={() => void handleRenamePlaylist()}
                >
                  保存名称
                </button>
              </div>
            ) : null}

            {playlistDetailLoading ? (
              <div className="me-playlist-empty">正在加载歌单歌曲...</div>
            ) : selectedPlaylistSongs.length ? (
              <div className="me-playlist-song-list">
                {selectedPlaylistSongs.map((song) => (
                  <div key={song.id} className="me-playlist-song-row">
                    <button type="button" onClick={() => handlePlayPlaylist(song.id)}>
                      <span className="me-playlist-song-row__cover">
                        {song.coverUrl ? <CoverImage src={song.coverUrl} thumbnail alt="" loading="lazy" decoding="async" /> : <i>{song.title.slice(0, 1)}</i>}
                        <b aria-hidden="true">▶</b>
                      </span>
                      <span className="me-playlist-song-row__copy">
                        <strong>{song.title}</strong>
                        <small>{song.author.nickname} · {song.style} · {formatDuration(song.duration)}</small>
                      </span>
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
