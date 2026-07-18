# 管理员端 Mock 与后端接口契约

## 当前使用方式

- 页面入口：`/admin`
- Mock 管理密钥：`echo-admin`
- 登录状态：`sessionStorage.echo_admin_mock_key`
- Mock 数据：`localStorage.echo-admin-mock-v2`
- Mock 数据与用户端、真实后端完全隔离。

## 精确数据类型

所有时间均使用 JavaScript 毫秒时间戳 `number`；可空字段使用 `null`，不要用空字符串替代。

- `AdminStats`：`users`、`newUsersToday`、`checkinsToday`、`songs`、`totalPoints`、`totalPlays`、`totalLikes`、`invitesTotal`、`invitesUsed`、`invitesFree`、`commentsTotal`，均为 `number`。
- `AdminUser`：`id:string`、`name:string`、`points:number`、`streak:number`、`createdAt:number`、`lastCheckin:string|null`（格式 `YYYY-MM-DD`）、`invitedBy:string|null`、`stats:{songs?,likesGot?,coversGot?}`、`ledger:AdminLedger[]`。
- `AdminLedger`：`t:number`、`delta:number`（非零整数）、`reason:string`、`balance:number`。
- `AdminInvite`：`code:string`、`createdBy:string`、`usedBy:string|null`、`createdAt:number`。example 通过 `usedBy` 判断状态，没有独立 `status` 字段。
- `AdminSong`：`id:string`、`title:string`、`author:string`、`authorId:string|null`、`originId?:string|null`、`mode:string`、`likes:number`、`plays:number`、`coverCount:number`、`duration:number`、`createdAt:number`。
- `AdminComment`：`id:string`、`songId:string`、`songTitle:string`、`userId:string|null`、`name:string`、`anon:boolean`、`text:string`、`t:number`。
- `AdminChallenge`：`id:string`、`title:string`、`emoji:string`、`desc:string`、`color:string`、`createdBy?:'host'|'admin'`、`active:boolean`、`createdAt?:number`、`count:number`、`source:string`。

类型唯一来源为 `types.ts`。管理员接口不要直接复用用户端的 `User` 和 `Song`：example 使用 `name/points/likes/plays`，当前用户端使用 `nickname/echoPoints/likeCount/playCount`。

## 后端需要实现的接口（与 example 一致）

除登录外，管理员请求头为 `Content-Type: application/json` 与 `x-admin-key: <管理员密钥>`。

| 方法与路径 | 请求 | 响应 |
| --- | --- | --- |
| `POST /api/admin/login` | `{key:string}` | `{ok:true}` |
| `GET /api/admin/stats` | 无 | `AdminStats`；example 另含页面未使用的 `econ` |
| `GET /api/admin/users` | 可选 `?q=` | `AdminUser[]` |
| `POST /api/admin/users/:id/points` | `{delta:number,reason:string}` | `{points:number}` |
| `POST /api/admin/users/:id/password` | `{password:string}`，空值表示随机生成 | `{ok:true,password:string}` |
| `DELETE /api/admin/users/:id` | 无 | `{ok:true}` |
| `GET /api/admin/invites` | 无 | `AdminInvite[]` |
| `POST /api/admin/invites` | `{count:number}`，范围 1–50 | `{codes:string[]}` |
| `DELETE /api/admin/invites/:code` | 无 | `{ok:true}`；已使用邀请码应返回 400 |
| `GET /api/admin/songs` | 无 | `AdminSong[]` |
| `DELETE /api/admin/songs/:id` | 无 | `{ok:true}`；同时删除 `originId` 等于该 ID 的翻唱 |
| `GET /api/admin/comments` | 无 | `AdminComment[]`，按 `t` 倒序 |
| `DELETE /api/admin/comments/:songId/:commentId` | 无 | `{ok:true}`，并同步减少歌曲留言数 |
| `GET /api/admin/challenges` | 无 | `AdminChallenge[]` |
| `POST /api/admin/challenges` | `{title,emoji,desc,color?}` | 新话题对象 |
| `PATCH /api/admin/challenges/:id` | `{title?,emoji?,desc?,color?,active?}` | `{ok:true}` |
| `DELETE /api/admin/challenges/:id` | 无 | `{ok:true,removed:number}` |

## Mock 与真实后端的边界

- Mock 重置密码只生成测试明文，不计算哈希、不刷新 token。
- Mock 删除歌曲不删除真实音频、封面或 DJ 文件。
- Mock 删除留言不改变用户端歌曲留言数。
- Mock 统计由本地列表即时计算。
- 联调时建议保留页面和 `types.ts`，仅将 `mockService.ts` 替换为真实请求层。
