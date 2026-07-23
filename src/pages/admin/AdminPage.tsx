import {useEffect,useMemo,useRef,useState} from 'react'
import './admin.css'
import * as api from './adminService'
import {resolveAssetUrl} from '../../utils/asset'
import type {AdminChallenge,AdminData} from './types'
type Tab='users'|'invites'|'songs'|'comments'|'challenges'|'battles'
type Field={key:string;label:string;value?:string;type?:string;placeholder?:string}
type Modal={title:string;message?:string;fields?:Field[];danger?:boolean;okText?:string}
const tabs:[Tab,string][]=[['users','用户'],['invites','邀请码'],['songs','歌曲'],['comments','树洞'],['challenges','话题'],['battles','擂台']]
const fmt=(t:number)=>new Intl.DateTimeFormat('zh-CN',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).format(t)
const mode:Record<string,string>={song:'歌曲',radio:'电台',photo:'看图写歌',album:'专辑',meme:'热梗神曲',emotion:'情绪成歌',foryou:'为你写歌',remix:'翻唱',fortune:'运势曲'}

export function AdminPage(){
 const [logged,setLogged]=useState(api.hasAdminSession),[nickname,setNickname]=useState(''),[password,setPassword]=useState(''),[loginError,setLoginError]=useState(''),[data,setData]=useState<AdminData|null>(null),[tab,setTab]=useState<Tab>('users'),[query,setQuery]=useState(''),[loading,setLoading]=useState(false),[newCodes,setNewCodes]=useState<string[]>([]),[modal,setModal]=useState<Modal|null>(null)
 const resolver=useRef<((v:Record<string,string>|boolean|null)=>void)|null>(null)
 const audioRef=useRef<HTMLAudioElement|null>(null)
 const [playingSongId,setPlayingSongId]=useState<string|null>(null)
 const refresh=async()=>{setLoading(true);try{setData(await api.all())}catch(e){api.logout();setLogged(false);setData(null);setLoginError(e instanceof Error?e.message:'管理员登录已失效')}finally{setLoading(false)}}
 useEffect(()=>{if(logged)void refresh()},[logged])
 useEffect(()=>()=>{audioRef.current?.pause();audioRef.current=null},[])
 useEffect(()=>{if(tab!=='songs')stopPreview()},[tab])
 const summary=useMemo(()=>data?api.stats(data):null,[data])
 function ask(m:Modal){setModal(m);return new Promise<Record<string,string>|boolean|null>(r=>resolver.current=r)}
 function close(v:Record<string,string>|boolean|null){resolver.current?.(v);resolver.current=null;setModal(null)}
 async function run(job:()=>Promise<unknown>){try{await job();await refresh()}catch(e){await ask({title:'操作失败',message:e instanceof Error?e.message:'请稍后重试',okText:'知道了'})}}
 async function login(e:React.FormEvent){e.preventDefault();setLoginError('');try{await api.login(nickname,password);setLogged(true)}catch(e){setLoginError(e instanceof Error?e.message:'管理员登录失败')}}
 function logout(){api.logout();setLogged(false);setData(null);setPassword('')}
 function stopPreview(){
  const audio=audioRef.current
  if(audio){audio.pause();audio.currentTime=0;audio.src='';audioRef.current=null}
  setPlayingSongId(null)
 }
 async function togglePreview(songId:string,audioUrl:string){
  if(playingSongId===songId&&audioRef.current&&!audioRef.current.paused){
   audioRef.current.pause()
   setPlayingSongId(null)
   return
  }
  stopPreview()
  const audio=new Audio(resolveAssetUrl(audioUrl))
  audio.preload='metadata'
  audioRef.current=audio
  audio.onended=()=>{if(audioRef.current===audio){audioRef.current=null;setPlayingSongId(null)}}
  audio.onerror=()=>{if(audioRef.current===audio){audioRef.current=null;setPlayingSongId(null)}}
  try{
   await audio.play()
   setPlayingSongId(songId)
  }catch(e){
   if(audioRef.current===audio)audioRef.current=null
   setPlayingSongId(null)
   await ask({title:'试听失败',message:e instanceof Error?e.message:'音频暂时无法播放，请检查音频地址。',okText:'知道了'})
  }
 }
 const q=query.toLowerCase().trim();const users=data?.users.filter(u=>!q||u.name.toLowerCase().includes(q))||[];const songs=data?.songs.filter(s=>!q||`${s.title}${s.author}`.toLowerCase().includes(q))||[];const comments=data?.comments.filter(c=>!q||`${c.text}${c.songTitle}${c.name}`.toLowerCase().includes(q))||[];const battles=data?.battles.filter(b=>!q||`${b.topic}${b.songATitle}${b.songBTitle}${b.creatorName}`.toLowerCase().includes(q))||[]
 if(!logged)return <main className="admin-login"><form className="admin-login__card" onSubmit={login}><span className="admin-brand">Echo AI</span><span>管理员工作台</span><h1>欢迎回来</h1><p>使用具有管理员权限的账号登录，管理用户、内容与社区活动。</p><label>管理员昵称<input autoFocus value={nickname} onChange={e=>setNickname(e.target.value)} placeholder="请输入管理员昵称"/></label><label>密码<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="请输入密码"/></label>{loginError&&<div className="admin-error">{loginError}</div>}<button disabled={!nickname.trim()||!password}>进入后台</button></form></main>
 if(!data||!summary)return <main className="admin-loading">正在加载管理数据…</main>
 async function adjust(id:string,name:string){const v=await ask({title:`调整「${name}」的回声`,fields:[{key:'delta',label:'数量（正数增加 / 负数扣减）',type:'number',value:'10'},{key:'reason',label:'备注（流水显示）',value:'管理员调整'}],okText:'确定调整'});if(!v||typeof v==='boolean')return;const d=parseInt(v.delta,10);if(!d)return void ask({title:'提示',message:'请输入非零整数'});await run(async()=>{const r=await api.points(id,d,v.reason||'管理员调整');await ask({title:'调整完成',message:`当前余额 ${r.points} 🔊`})})}
 async function reset(id:string,name:string){const v=await ask({title:`重置「${name}」的密码`,fields:[{key:'password',label:'新密码（留空＝随机生成）',placeholder:'留空则随机生成'}],okText:'重置密码'});if(!v||typeof v==='boolean')return;await run(async()=>{const r=await api.password(id,v.password);await ask({title:'密码已重置',message:`新密码：${r.password}。该用户需使用新密码重新登录。`})})}
 async function confirmRun(title:string,message:string,job:()=>Promise<unknown>){if(await ask({title,message,danger:true,okText:'确定'}))await run(job)}
 return <div className="admin-shell"><header className="admin-topbar"><span className="admin-brand">Echo AI</span><span className="admin-topbar__tag">管理后台</span><div/><button className="admin-ghost" disabled={loading} onClick={()=>void refresh()}>{loading?'刷新中…':'刷新数据'}</button><button className="admin-ghost" onClick={logout}>退出</button></header><main className="admin-main">
  <section className="admin-heading"><div><span>ADMIN CONSOLE</span><h1>内容与社区管理</h1><p>{summary.users} 位用户 · {summary.songs} 首歌曲 · {summary.totalPoints.toLocaleString()} 回声流通中</p></div></section>
  <section className="admin-stats">{[['用户',summary.users,`今日新增 ${summary.newUsersToday}`],['今日打卡',summary.checkinsToday,'当前活跃'],['歌曲',summary.songs,`播放 ${summary.totalPlays} · 喜欢 ${summary.totalLikes}`],['流通回声',summary.totalPoints,'所有用户余额'],['邀请码',summary.invitesTotal,`已用 ${summary.invitesUsed} · 可用 ${summary.invitesFree}`],['树洞留言',summary.commentsTotal,'全站留言']].map(x=><article key={x[0] as string}><span>{x[0]}</span><strong>{Number(x[1]).toLocaleString()}</strong><small>{x[2]}</small></article>)}</section>
  <nav className="admin-tabs">{tabs.map(([k,l])=><button key={k} className={tab===k?'is-active':''} onClick={()=>{setTab(k);setQuery('')}}>{l}</button>)}</nav>
  <section className="admin-panel">{!['invites','challenges'].includes(tab)&&<Toolbar value={query} set={setQuery} label={tab==='users'?'搜索昵称':tab==='songs'?'搜索歌名或作者':tab==='battles'?'搜索主题、歌曲或创建者':'搜索留言、歌曲或留言者'} count={tab==='users'?users.length:tab==='songs'?songs.length:tab==='battles'?battles.length:comments.length}/>} 
   {tab==='users'&&<Table heads={['昵称','回声','连签','作品','被邀请','注册','操作']}>{users.map(u=><tr key={u.id}><td><b>{u.name}</b></td><td>{u.points.toLocaleString()} 🔊</td><td>{u.streak}</td><td>{u.stats.songs||0}</td><td>{u.invitedBy||'—'}</td><td>{fmt(u.createdAt)}</td><td><Actions><button onClick={()=>void adjust(u.id,u.name)}>± 回声</button><button onClick={()=>void reset(u.id,u.name)}>重置密码</button><Danger onClick={()=>void confirmRun('删除用户',`确定删除「${u.name}」？此操作不可恢复。`,()=>api.removeUser(u.id))}>删除</Danger></Actions></td></tr>)}</Table>}
   {tab==='invites'&&<Invites data={data} codes={newCodes} generate={async n=>{const r=await api.invites(n);setNewCodes(r.codes);await refresh()}} remove={c=>void confirmRun('作废邀请码',`确定作废 ${c}？`,()=>api.removeInvite(c))}/>} 
   {tab==='songs'&&<Table heads={['歌名','作者','类型','喜欢','播放','翻唱','操作']}>{songs.map(s=><tr key={s.id}><td><b>{s.title}</b></td><td>{s.author}</td><td><Badge>{mode[s.mode]||s.mode||'歌曲'}</Badge></td><td>{s.likes}</td><td>{s.plays}</td><td>{s.coverCount}</td><td><Actions>{s.audioUrl?<button className={playingSongId===s.id?'admin-preview is-playing':'admin-preview'} type="button" onClick={()=>void togglePreview(s.id,s.audioUrl!)}>{playingSongId===s.id?'暂停':'试听'}</button>:<span>暂无音频</span>}<Danger onClick={()=>void confirmRun('删除歌曲',`确定删除「${s.title}」？其翻唱衍生也会一并删除。`,()=>api.removeSong(s.id))}>删除</Danger></Actions></td></tr>)}</Table>}
   {tab==='comments'&&<Table heads={['留言内容','所属歌曲','留言者','审核状态','时间','操作']}>{comments.map(c=><tr key={c.id}><td className="admin-wrap">{c.text}{c.moderationReason&&<small className="admin-comment-reason">{c.moderationReason}</small>}</td><td>{c.songTitle}</td><td>{c.name} {c.anon&&<Badge>匿名</Badge>}</td><td><Badge>{c.status==='pending'?'待审核':c.status==='approved'?'已通过':'已拒绝'}</Badge></td><td>{fmt(c.t)}</td><td><Actions>{c.status==='pending'&&<button onClick={()=>void run(()=>api.approveComment(c.id))}>通过</button>}<Danger onClick={()=>void confirmRun('删除留言','确定删除这条留言？此操作不可恢复。',()=>api.removeComment(c.songId,c.id))}>删除</Danger></Actions></td></tr>)}</Table>}
   {tab==='challenges'&&<Challenges data={data.challenges} ask={ask} run={run} confirmRun={confirmRun}/>} 
   {tab==='battles'&&<Table heads={['擂台主题','A 方歌曲','B 方歌曲','创建者','票数','创建时间','操作']}>{battles.map(b=><tr key={b.id}><td><b>{b.topic}</b></td><td>{b.songATitle}</td><td>{b.songBTitle}</td><td>{b.creatorName}</td><td>{b.votesA} : {b.votesB}</td><td>{fmt(b.createdAt)}</td><td><Danger onClick={()=>void confirmRun('删除擂台',`确定删除“${b.topic}”？投票记录会同时删除，两首歌曲会保留。`,()=>api.removeBattle(b.id))}>删除</Danger></td></tr>)}</Table>}
  </section></main>{modal&&<AdminModal modal={modal} close={close}/>}</div>
}
function Toolbar({value,set,label,count}:{value:string;set:(v:string)=>void;label:string;count:number}){return <div className="admin-toolbar"><input value={value} onChange={e=>set(e.target.value)} placeholder={label}/><span>{count} 条结果</span></div>}
function Badge({children}:{children:React.ReactNode}){return <span className="admin-badge">{children}</span>};function Actions({children}:{children:React.ReactNode}){return <div className="admin-actions">{children}</div>};function Danger({children,onClick}:{children:React.ReactNode;onClick:()=>void}){return <button className="admin-danger" onClick={onClick}>{children}</button>}
function Table({heads,children}:{heads:string[];children:React.ReactNode}){return <div className="admin-table"><table><thead><tr>{heads.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{children}</tbody></table></div>}
function Invites({data,codes,generate,remove}:{data:AdminData;codes:string[];generate:(n:number)=>Promise<void>;remove:(c:string)=>void}){const[n,setN]=useState(5);return <><div className="admin-toolbar"><input className="admin-count" type="number" min="1" max="50" value={n} onChange={e=>setN(Number(e.target.value))}/><button onClick={()=>void generate(n)}>＋ 生成邀请码</button><span>{data.invites.length} 个</span></div>{codes.length>0&&<div className="admin-codes"><b>新生成的邀请码</b>{codes.map(c=><code key={c}>{c}</code>)}</div>}<Table heads={['邀请码','状态','创建者','使用者','操作']}>{data.invites.map(i=><tr key={i.code}><td><code>{i.code}</code></td><td><Badge>{i.usedBy?'已使用':'可用'}</Badge></td><td>{i.createdBy}</td><td>{i.usedBy||'—'}</td><td>{!i.usedBy&&<Danger onClick={()=>remove(i.code)}>作废</Danger>}</td></tr>)}</Table></>}
function Challenges({data,ask,run,confirmRun}:{data:AdminChallenge[];ask:(m:Modal)=>Promise<Record<string,string>|boolean|null>;run:(j:()=>Promise<unknown>)=>Promise<void>;confirmRun:(t:string,m:string,j:()=>Promise<unknown>)=>Promise<void>}){async function edit(c?:AdminChallenge){const v=await ask({title:c?'编辑话题':'发起新话题',fields:[{key:'emoji',label:'Emoji 图标',value:c?.emoji||'🏷'},{key:'title',label:'话题标题',value:c?.title||'',placeholder:'例如：用一首歌形容你的周一'},{key:'desc',label:'引导文案',value:c?.desc||'',placeholder:'一句话说明这个话题'}],okText:c?'保存':'创建'});if(!v||typeof v==='boolean'||!v.title.trim())return;await run(()=>c?api.updateChallenge(c.id,{emoji:v.emoji,title:v.title,desc:v.desc}):api.createChallenge({emoji:v.emoji,title:v.title,desc:v.desc}))}return <><div className="admin-toolbar"><button onClick={()=>void edit()}>＋ 发起话题</button><span>{data.length} 个话题</span></div><Table heads={['话题','引导文案','来源','参与','状态','操作']}>{data.map(c=><tr key={c.id} className={c.active?'':'is-muted'}><td><b>{c.emoji} {c.title}</b></td><td className="admin-wrap">{c.desc}</td><td><Badge>{c.source}</Badge></td><td>{c.count} 首</td><td><Badge>{c.active?'上架中':'已下架'}</Badge></td><td><Actions><button onClick={()=>void edit(c)}>编辑</button><button onClick={()=>void run(()=>api.updateChallenge(c.id,{active:!c.active}))}>{c.active?'下架':'上架'}</button><Danger onClick={()=>void confirmRun('删除话题',`确定删除话题「${c.title}」？已参与作品不会被删除。`,()=>api.removeChallenge(c.id))}>删除</Danger></Actions></td></tr>)}</Table></>}
function AdminModal({modal,close}:{modal:Modal;close:(v:Record<string,string>|boolean|null)=>void}){const[values,setValues]=useState(()=>Object.fromEntries((modal.fields||[]).map(f=>[f.key,f.value||''])));return <div className="admin-modal-mask" onMouseDown={()=>close(null)}><form className="admin-modal" onSubmit={e=>{e.preventDefault();close(modal.fields?values:true)}} onMouseDown={e=>e.stopPropagation()}><h2>{modal.title}</h2>{modal.message&&<p>{modal.message}</p>}{modal.fields?.map(f=><label key={f.key}>{f.label}<input autoFocus={f===modal.fields?.[0]} type={f.type||'text'} value={values[f.key]} placeholder={f.placeholder} onChange={e=>setValues({...values,[f.key]:e.target.value})}/></label>)}<div className="admin-modal__actions">{(modal.fields||modal.danger)&&<button type="button" className="admin-ghost" onClick={()=>close(null)}>取消</button>}<button className={modal.danger?'admin-danger':''}>{modal.okText||'知道了'}</button></div></form></div>}
