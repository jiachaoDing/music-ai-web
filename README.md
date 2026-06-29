# music-ai-web

Vite + React + TypeScript 前端，用于 AI 音乐生成项目实训。

脚手架总入口请先阅读：[../开发脚手架使用指南/00-README.md](../开发脚手架使用指南/00-README.md)

| 页面能力 | 后端接口 |
| --- | --- |
| 后端状态展示 | `GET /health` |
| 歌曲列表展示 | `GET /api/songs` |
| Mock 生成 | `POST /api/generate/mock` |
| AI 歌词和音乐生成 | `POST /api/ai/lyrics`、`POST /api/ai/music` |

## 快速启动

```bash
copy .env.example .env
npm install
npm run dev
```

| 脚本 | 用途 |
| --- | --- |
| `npm run dev` | 本地开发启动 |
| `npm run build` | 生产构建 |
| `npm run preview` | 本地预览构建结果 |
| `npm run lint` | 前端代码检查 |

| 本地 `.env` | 示例 | 说明 |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `http://localhost:3000` | 前端请求后端 API 的基础地址 |

前端不能保存 MiniMax Key，也不能直接连接数据库。页面需要数据时统一请求后端 API。
