# 管理员端真实接口联调说明

## 当前状态

- 管理员端不再读取 Mock 数据或浏览器 `localStorage` 数据。
- 页面入口：`/admin`。
- 管理员通过 `POST /api/auth/login` 使用昵称和密码登录。
- 登录成功后必须满足 `user.role === "admin"`。
- JWT 保存在项目原有的 `localStorage.echo_token`，管理员页面登录标记保存在当前标签页的 `sessionStorage`。
- 所有管理数据来自 `http://localhost:3000/api/admin/*`（实际基础地址由 `VITE_API_BASE_URL` 决定）。

## 页面与真实接口

| 页面功能 | 真实接口 |
| --- | --- |
| 管理员登录 | `POST /api/auth/login` |
| 后台统计 | `GET /api/admin/stats` |
| 用户列表 | `GET /api/admin/users?pageSize=1000` |
| 调整回声 | `POST /api/admin/users/:id/points` |
| 重置密码 | `POST /api/admin/users/:id/password` |
| 删除用户 | `DELETE /api/admin/users/:id` |
| 邀请码列表 | `GET /api/admin/invites` |
| 批量生成邀请码 | `POST /api/admin/invites` |
| 作废邀请码 | `DELETE /api/admin/invites/:code` |
| 歌曲列表 | `GET /api/admin/songs?pageSize=1000` |
| 删除歌曲及翻唱 | `DELETE /api/admin/songs/:id` |
| 留言列表 | `GET /api/admin/comments?pageSize=1000` |
| 删除留言 | `DELETE /api/admin/comments/:songId/:commentId` |
| 话题列表 | `GET /api/admin/challenges` |
| 新增话题 | `POST /api/admin/challenges` |
| 编辑/上下架话题 | `PATCH /api/admin/challenges/:id` |
| 删除话题 | `DELETE /api/admin/challenges/:id` |

## 字段适配

后端使用统一响应 `{ code, message, data }`，项目公共 `request()` 会取出 `data`。列表接口的 `data` 仍为 `{ list, total, page, pageSize }`，管理员服务层再提取 `list`。

| 页面字段 | 后端字段 |
| --- | --- |
| `users` | `totalUsers` |
| `songs` | `totalSongs` |
| `totalPoints` | `totalEchoPoints` |
| `invitesTotal` | `totalInvites` |
| `commentsTotal` | `totalComments` |
| 用户 `name` | `nickname` |
| 用户 `points` | `echoPoints` |
| 用户作品数 `stats.songs` | `songCount` |
| 用户流水 `ledger` | `recentLedger` |
| 歌曲 `author` | `authorName` |
| 邀请码使用者 | `usedByName ?? usedBy` |
| 留言者 `name` | `userName` |
| 留言时间 `t` | `createdAt` |
| 话题参与数 `count` | `songCount` |
| 话题来源 `source` | `createdBy` |

后端的 ISO 时间字符串会在适配层转换成毫秒时间戳，现有页面组件无需感知后端字段差异。

## 与老师 example 的差异

- example 使用管理员密钥和 `x-admin-key`；当前项目使用管理员账号 JWT。功能未减少，只调整了登录方式。
- 后端另外支持管理员创建用户、修改角色、歌曲状态管理和分页查询，当前页面暂未展示这些 example 之外的扩展能力。
- 当前歌曲“试听”直接打开后端返回的真实 `audioUrl`。
