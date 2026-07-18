import {ADMIN_MOCK_KEY,initialAdminData} from './mockData'
export {ADMIN_MOCK_KEY} from './mockData'
import type {AdminChallenge,AdminData,AdminStats} from './types'
const STORE='echo-admin-mock-v2';const clone=<T,>(v:T):T=>JSON.parse(JSON.stringify(v)) as T;const wait=<T,>(v:T)=>new Promise<T>(r=>setTimeout(()=>r(v),120))
function read():AdminData{const v=localStorage.getItem(STORE);return v?JSON.parse(v) as AdminData:clone(initialAdminData)}
function save(v:AdminData){localStorage.setItem(STORE,JSON.stringify(v))}function change(fn:(v:AdminData)=>void){const v=read();fn(v);save(v)}
function inviteCode(){return `ECHO-${crypto.getRandomValues(new Uint8Array(3)).reduce((a,n)=>a+n.toString(16).padStart(2,'0'),'').toUpperCase()}`}
export async function login(key:string){if(key!==ADMIN_MOCK_KEY)throw new Error('管理员密钥错误');return wait({ok:true})}
export async function all(){return wait(read())}
export function stats(v:AdminData):AdminStats{const today=new Date().toISOString().slice(0,10);return{users:v.users.length,newUsersToday:v.users.filter(u=>new Date(u.createdAt).toISOString().slice(0,10)===today).length,checkinsToday:v.users.filter(u=>u.lastCheckin===today).length,songs:v.songs.length,totalPoints:v.users.reduce((a,u)=>a+u.points,0),totalPlays:v.songs.reduce((a,s)=>a+s.plays,0),totalLikes:v.songs.reduce((a,s)=>a+s.likes,0),invitesTotal:v.invites.length,invitesUsed:v.invites.filter(i=>i.usedBy).length,invitesFree:v.invites.filter(i=>!i.usedBy).length,commentsTotal:v.comments.length}}
export async function points(id:string,delta:number,reason:string){let balance=0;change(v=>{const u=v.users.find(x=>x.id===id);if(!u)throw new Error('用户不存在');u.points+=delta;balance=u.points;u.ledger.unshift({t:Date.now(),delta,reason,balance})});return wait({points:balance})}
export async function password(id:string,next?:string){if(!read().users.some(u=>u.id===id))throw new Error('用户不存在');return wait({ok:true,password:next?.trim()||Math.random().toString(36).slice(2,8)})}
export async function removeUser(id:string){change(v=>v.users=v.users.filter(u=>u.id!==id));return wait({ok:true})}
export async function invites(count:number){const codes=Array.from({length:Math.min(50,Math.max(1,count||5))},inviteCode);change(v=>codes.forEach(code=>v.invites.unshift({code,createdBy:'管理员',usedBy:null,createdAt:Date.now()})));return wait({codes})}
export async function removeInvite(code:string){change(v=>{const x=v.invites.find(i=>i.code===code);if(x?.usedBy)throw new Error('已使用的邀请码不能删除');v.invites=v.invites.filter(i=>i.code!==code)});return wait({ok:true})}
export async function removeSong(id:string){change(v=>v.songs=v.songs.filter(s=>s.id!==id&&s.originId!==id));return wait({ok:true})}
export async function removeComment(songId:string,id:string){change(v=>v.comments=v.comments.filter(c=>!(c.songId===songId&&c.id===id)));return wait({ok:true})}
export async function createChallenge(x:Pick<AdminChallenge,'title'|'emoji'|'desc'>){change(v=>v.challenges.unshift({id:`ch_${Date.now().toString(36)}`,title:x.title.trim().slice(0,30),emoji:(x.emoji||'🏷').slice(0,4),desc:x.desc.slice(0,80),color:'linear-gradient(135deg,#ea4c89,#ff9fc4)',createdBy:'admin',active:true,createdAt:Date.now(),count:0,source:'管理员'}));return wait({ok:true})}
export async function updateChallenge(id:string,x:Partial<AdminChallenge>){change(v=>{const c=v.challenges.find(y=>y.id===id);if(!c)throw new Error('话题不存在');Object.assign(c,x)});return wait({ok:true})}
export async function removeChallenge(id:string){change(v=>v.challenges=v.challenges.filter(c=>c.id!==id));return wait({ok:true})}
