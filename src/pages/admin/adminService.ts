import { request } from '../../api/request'
import type { AdminBattle, AdminChallenge, AdminComment, AdminData, AdminInvite, AdminSong, AdminStats, AdminUser } from './types'

type LoginResponse={token:string;user:{role:string}}
type ListResponse<T>={list:T[];total?:number;page?:number;pageSize?:number}
type BackendStats={totalUsers:number;newUsersToday:number;checkinsToday:number;totalSongs:number;totalPlays:number;totalLikes:number;totalEchoPoints:number;totalInvites:number;usedInvites:number;availableInvites:number;totalComments:number}
type BackendUser={id:string;nickname:string;echoPoints:number;streak:number;createdAt:string;lastCheckin:string|null;invitedBy:string|null;invitedByName:string|null;songCount:number;recentLedger:Array<{delta:number;reason:string;balance:number|null;createdAt:string}>}
type BackendInvite={code:string;createdBy:string;usedBy:string|null;usedByName:string|null;createdAt:string}
type BackendSong={id:string;title:string;authorId:string|null;authorName:string;mode:string;status:string;likes:number;plays:number;coverCount:number;duration:number;audioUrl:string|null;coverUrl:string|null;createdAt:string}
type BackendComment={id:string;songId:string;songTitle:string;userId:string|null;userName:string;anon:boolean;text:string;createdAt:string;status:string;moderationReason?:string|null}
type BackendChallenge={id:string;title:string;emoji:string;desc:string;color:string;createdBy:string;active:boolean;songCount:number;createdAt:string}
type BackendBattle={id:string;topic:string;songATitle:string;songBTitle:string;creatorName:string;votesA:number;votesB:number;status:string;createdAt:string}

const ADMIN_SESSION_KEY='echo_admin_authenticated'
const toTime=(value:string)=>Date.parse(value)||Date.now()

export function hasAdminSession(){return sessionStorage.getItem(ADMIN_SESSION_KEY)==='true'&&Boolean(localStorage.getItem('echo_token'))}
export async function login(nickname:string,password:string){
 const result=await request<LoginResponse>('/api/auth/login',{method:'POST',body:JSON.stringify({nickname:nickname.trim(),password})})
 if(result.user.role!=='admin')throw new Error('该账号没有管理员权限')
 localStorage.setItem('echo_token',result.token);sessionStorage.setItem(ADMIN_SESSION_KEY,'true');return{ok:true}
}
export function logout(){sessionStorage.removeItem(ADMIN_SESSION_KEY);localStorage.removeItem('echo_token')}
const mapStats=(x:BackendStats):AdminStats=>({users:x.totalUsers,newUsersToday:x.newUsersToday,checkinsToday:x.checkinsToday,songs:x.totalSongs,totalPoints:x.totalEchoPoints,totalPlays:x.totalPlays,totalLikes:x.totalLikes,invitesTotal:x.totalInvites,invitesUsed:x.usedInvites,invitesFree:x.availableInvites,commentsTotal:x.totalComments})
const mapUser=(u:BackendUser):AdminUser=>({id:u.id,name:u.nickname,points:u.echoPoints,streak:u.streak,createdAt:toTime(u.createdAt),lastCheckin:u.lastCheckin,invitedBy:u.invitedByName??u.invitedBy,stats:{songs:u.songCount},ledger:(u.recentLedger||[]).map(x=>({t:toTime(x.createdAt),delta:x.delta,reason:x.reason,balance:x.balance??0}))})
const mapInvite=(i:BackendInvite):AdminInvite=>({code:i.code,createdBy:i.createdBy,usedBy:i.usedByName??i.usedBy,createdAt:toTime(i.createdAt)})
const mapSong=(s:BackendSong):AdminSong=>({id:s.id,title:s.title,author:s.authorName,authorId:s.authorId,mode:s.mode,status:s.status,likes:s.likes,plays:s.plays,coverCount:s.coverCount,duration:s.duration,createdAt:toTime(s.createdAt),audioUrl:s.audioUrl,coverUrl:s.coverUrl})
const mapComment=(c:BackendComment):AdminComment=>({id:c.id,songId:c.songId,songTitle:c.songTitle,userId:c.userId,name:c.userName,anon:c.anon,text:c.text,t:toTime(c.createdAt),status:c.status,moderationReason:c.moderationReason})
const mapChallenge=(c:BackendChallenge):AdminChallenge=>({id:c.id,title:c.title,emoji:c.emoji,desc:c.desc,color:c.color,active:c.active,createdAt:toTime(c.createdAt),count:c.songCount,source:c.createdBy})
const mapBattle=(b:BackendBattle):AdminBattle=>({...b,createdAt:toTime(b.createdAt)})
export async function all():Promise<AdminData>{
 const [summary,users,invites,songs,comments,challenges,battles]=await Promise.all([request<BackendStats>('/api/admin/stats'),request<ListResponse<BackendUser>>('/api/admin/users?pageSize=1000'),request<ListResponse<BackendInvite>>('/api/admin/invites'),request<ListResponse<BackendSong>>('/api/admin/songs?pageSize=1000'),request<ListResponse<BackendComment>>('/api/admin/comments?pageSize=1000'),request<ListResponse<BackendChallenge>>('/api/admin/challenges'),request<ListResponse<BackendBattle>>('/api/admin/battles')])
 return{summary:mapStats(summary),users:users.list.map(mapUser),invites:invites.list.map(mapInvite),songs:songs.list.map(mapSong),comments:comments.list.map(mapComment),challenges:challenges.list.map(mapChallenge),battles:battles.list.map(mapBattle)}
}
export function stats(v:AdminData):AdminStats{return v.summary??{users:v.users.length,newUsersToday:0,checkinsToday:0,songs:v.songs.length,totalPoints:v.users.reduce((n,u)=>n+u.points,0),totalPlays:v.songs.reduce((n,s)=>n+s.plays,0),totalLikes:v.songs.reduce((n,s)=>n+s.likes,0),invitesTotal:v.invites.length,invitesUsed:v.invites.filter(i=>i.usedBy).length,invitesFree:v.invites.filter(i=>!i.usedBy).length,commentsTotal:v.comments.length}}
export async function points(id:string,delta:number,reason:string){const r=await request<{newBalance:number}>(`/api/admin/users/${id}/points`,{method:'POST',body:JSON.stringify({delta,reason})});return{points:r.newBalance}}
export async function password(id:string,next?:string){const r=await request<{newPassword?:string}>(`/api/admin/users/${id}/password`,{method:'POST',body:JSON.stringify({password:next??''})});return{ok:true,password:next?.trim()||r.newPassword||''}}
export async function removeUser(id:string){return request(`/api/admin/users/${id}`,{method:'DELETE'})}
export async function invites(count:number){return request<{codes:string[]}>(`/api/admin/invites`,{method:'POST',body:JSON.stringify({count})})}
export async function removeInvite(code:string){return request(`/api/admin/invites/${encodeURIComponent(code)}`,{method:'DELETE'})}
export async function removeSong(id:string){return request(`/api/admin/songs/${id}`,{method:'DELETE'})}
export async function removeComment(songId:string,id:string){return request(`/api/admin/comments/${songId}/${id}`,{method:'DELETE'})}
export async function approveComment(id:string){return request(`/api/admin/comments/${id}/approve`,{method:'PATCH'})}
export async function createChallenge(x:Pick<AdminChallenge,'title'|'emoji'|'desc'>){return request('/api/admin/challenges',{method:'POST',body:JSON.stringify(x)})}
export async function updateChallenge(id:string,x:Partial<AdminChallenge>){return request(`/api/admin/challenges/${id}`,{method:'PATCH',body:JSON.stringify({title:x.title,emoji:x.emoji,desc:x.desc,active:x.active})})}
export async function removeChallenge(id:string){return request(`/api/admin/challenges/${id}`,{method:'DELETE'})}
export async function removeBattle(id:string){return request(`/api/admin/battles/${id}`,{method:'DELETE'})}
