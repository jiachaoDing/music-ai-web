# music-ai-web

Vite + React + TypeScript 前端，用于 AI 音乐生成项目实训。

| 页面能力 | 接口 |
| --- | --- |
| 后端健康检查 | `GET /health` |
| 歌曲列表展示 | `GET /api/songs` |
| Mock 生成 | `POST /api/generate/mock` |

本地运行：

```bash
cp .env.example .env
npm install
npm run dev
```

`.env`：

| 变量 | 示例 |
| --- | --- |
| `VITE_API_BASE_URL` | `http://localhost:3000` |

生产构建：

```bash
npm run build
```

GitHub Actions 会在 `main` 分支提交后构建静态文件，并上传到服务器的 `WEB_DEPLOY_PATH/current`，由 Nginx 作为静态站点访问。
