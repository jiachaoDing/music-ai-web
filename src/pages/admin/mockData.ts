import type { AdminData } from './types'
export const ADMIN_MOCK_KEY='echo-admin'
export const initialAdminData:AdminData={
 users:[
  {id:'u_mq3wkop2vywgk',name:'echo',points:999998,streak:0,createdAt:1780844062247,lastCheckin:null,invitedBy:null,stats:{songs:2,likesGot:0,coversGot:0},ledger:[{t:1780857362973,delta:-1,reason:'生成歌曲',balance:999998}]},
  {id:'u_mqx90ipvhhikd',name:'djc',points:14,streak:1,createdAt:1782618475553,lastCheckin:'2026-06-28',invitedBy:'admin',stats:{songs:1,likesGot:0,coversGot:0},ledger:[{t:1782619031007,delta:-1,reason:'生成歌曲',balance:14}]},
  {id:'u_nightcat',name:'夜行猫',points:36,streak:4,createdAt:1782259200000,lastCheckin:'2026-07-17',invitedBy:'echo',stats:{songs:3,likesGot:18,coversGot:2},ledger:[]}
 ],
 invites:[
  {code:'ECHO-B9E989',createdBy:'系统',usedBy:'echo',createdAt:1780843914999},{code:'ECHO-F727D5',createdBy:'系统',usedBy:null,createdAt:1780843914999},{code:'ECHO-C35FB1',createdBy:'管理员',usedBy:null,createdAt:1780845006076},{code:'ECHO-0EF2D4',createdBy:'管理员',usedBy:'djc',createdAt:1780845006076}
 ],
 songs:[
  {id:'mpxwxowo87h25',title:'测试夜归',author:'测试员',authorId:'u_tester',mode:'song',likes:12,plays:19,coverCount:2,duration:173,createdAt:1780481876223},
  {id:'mpy5suvte656y',title:'专注工作 · 电台',author:'匿名旅人',authorId:null,mode:'radio',likes:5,plays:26,coverCount:0,duration:180,createdAt:1780496764324},
  {id:'mpzkhnai5cbav',title:'那六个勾',author:'匿名旅人',authorId:null,mode:'photo',likes:8,plays:13,coverCount:1,duration:80,createdAt:1780581901035},
  {id:'mpum622fkexa4',title:'深夜便利店',author:'夜行猫',authorId:'u_nightcat',mode:'song',likes:17,plays:47,coverCount:3,duration:157,createdAt:1780282388469}
 ],
 comments:[
  {id:'c_001',songId:'mpum622fkexa4',songTitle:'深夜便利店',userId:'u_mqx90ipvhhikd',name:'djc',anon:false,text:'凌晨听到这一首，像有人替我留了一盏灯。',t:1784263200000},
  {id:'c_002',songId:'mpxwxowo87h25',songTitle:'测试夜归',userId:'u_nightcat',name:'夜行猫',anon:true,text:'回家的路很长，但这首歌刚好陪我走完。',t:1784176800000}
 ],
 challenges:[
  {id:'monday',title:'用一首歌形容你的周一',emoji:'😮‍💨',desc:'工位、闹钟、咖啡、堵车…把你的周一写成歌',color:'linear-gradient(135deg,#fa709a,#fee140)',active:true,count:3,source:'内置'},
  {id:'meme',title:'把热梗写成神曲',emoji:'🔥',desc:'哪个梗最洗脑？交给 AI 谱曲',color:'linear-gradient(135deg,#f093fb,#f5576c)',active:true,count:1,source:'内置'},
  {id:'night',title:'深夜 emo 限定',emoji:'🌙',desc:'那些只有深夜才敢说的话，唱出来',color:'linear-gradient(135deg,#30cfd0,#330867)',active:false,count:2,source:'内置'}
 ]
}

