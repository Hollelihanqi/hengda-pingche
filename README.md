# 恒大文旅城邻里拼车项目 (多端独立 Monorepo)

本项目采用 **双端完全独立解耦** 的目录架构：

```text
├── uni-app/                        # 📱【小程序端】独立完整工程（Vue3 + TS + UnoCSS + 微信云函数）
│   ├── package.json                # 小程序专属依赖
│   ├── eslint.config.mjs           # 小程序代码规范
│   ├── tsconfig.json               # 小程序 TS 编译规则
│   ├── vite.config.ts              # 小程序 Vite 配置文件
│   ├── uno.config.ts               # UnoCSS 样式原子化配置
│   ├── project.config.json         # 微信开发者工具配置文件
│   ├── pages.json                  # 小程序页面与 TabBar 路由
│   ├── pages/                      # 小程序所有业务页面
│   └── cloudfunctions/             # 微信云开发云函数
│
├── web/                            # 💻【Web 演示端】独立完整工程（Next.js 15 + React 19 + Tailwind）
│   ├── package.json                # Web 端专属依赖
│   ├── eslint.config.mjs           # Web 端代码规范
│   ├── tsconfig.json               # Web 端 TS 编译规则
│   ├── next.config.ts              # Next.js 配置文件
│   ├── app/                        # Web 端 App Router 页面与路由
│   ├── components/                 # Web 端交互组件
│   └── lib/                        # Web 端工具函数
│
└── package.json                    # 🌐【根工作区】云端容器统一调度入口（仅用于驱动在线实时预览）
```

---

## 📌 为什么根目录会有 `package.json`？
因为当前在线开发环境运行在一个基于 Node.js 的云端容器中，云端启动服务时必须在最外层执行 `npm run dev` 来唤起 Web 实时预览。

**重要提示**：
- **小程序开发**：直接把 `uni-app/` 单独拷贝出来，导入 HBuilderX 或微信开发者工具即可，**无需依赖外层任何文件**。
- **Web 端开发**：直接进入 `web/` 执行 `npm run dev` 即可独立运行。


然后在 **微信开发者工具** 中导入 `uni-app/dist/dev/mp-weixin` 目录即可真机预览与调试！
