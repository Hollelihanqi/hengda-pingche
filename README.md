# 恒大文旅城邻里拼车 · uni-app (Vue 3 + TypeScript + UnoCSS) 微信小程序工程

本项目完全按照 **pnpm + TypeScript + Vue 3 (Composition API `<script setup lang="ts">`) + UnoCSS + uni-app (Vite 5)** 现代前端技术栈架构设计。

---

## 🛠️ 前端技术栈

- **跨端框架**：`uni-app` (v3 Vue 3)
- **开发语言**：`TypeScript 5.x`（严格类型约束与接口建模）
- **原子化 CSS**：`UnoCSS`（零运行时极速原子类与快捷样式）
- **构建工具**：`Vite 5.x` (`@dcloudio/vite-plugin-uni` + `unocss/vite`)
- **包管理工具**：`pnpm`（严格依赖隔离与高效安装）
- **目标运行端**：微信小程序（`mp-weixin`）、H5 / Web

---

## 📂 核心代码架构说明 (uni-app 标准结构)

```text
├── uniapp-src/                     # 🚀 uni-app Vue 3 + TypeScript + UnoCSS 源码目录
│   ├── App.vue                     # 小程序全局生命周期与初始存储 (Vue 3 TS Setup)
│   ├── main.ts                     # Vue 3 入口文件 (引入 uno.css 与 SSR App 实例)
│   ├── pages.json                  # 全局页面路由与微信小程序原生 TabBar 配置
│   ├── vite.config.ts              # Vite 配置文件 (集成 uni-app 与 UnoCSS 插件)
│   ├── types/                      # TypeScript 类型中心
│   │   └── carpool.ts              # 拼车行程、业主认证、预约凭证等全部类型定义
│   └── pages/                      # 页面模块 (纯 Vue 3 + TS setup + UnoCSS)
│       ├── index/index.vue         # 拼车大厅（车找人/人找车信息流、搜索、预约）
│       ├── publish/publish.vue     # 发布发车/求拼向导表单
│       ├── my-trips/my-trips.vue   # 我的行程管理与 6 位乘车核验凭证码
│       ├── profile/profile.vue     # 恒大文旅城业主中心与加群复制微信号
│       └── detail/detail.vue       # 行程详情展示与一键转发微信群卡片
├── uno.config.ts                   # UnoCSS 原子化与主题配置文件 (预设 Uno、Attributify)
├── project.config.json             # 微信开发者工具配置文件 (指定 AppID 与源码路径)
├── tsconfig.uni.json               # uni-app TypeScript 专用编译配置
├── package.json                    # pnpm 依赖管理与编译脚本指令
└── README.md                       # 本项目完整技术说明
```

> **📌 提示**：根目录下的 `app/` 和 `components/` 为 AI Studio 云端沙箱的 Web 实时预览容器服务，您在 GitHub 仓库 `hengda-pingche` 或本地开发调试时，**核心微信小程序代码全部位于 `uniapp-src/` 目录中**。

---

## 🚀 本地开发与微信开发者工具调试流程

### 第一步：使用 pnpm 安装依赖

在项目根目录下执行：

```bash
# 全局安装 pnpm (如未安装)
npm install -g pnpm

# 使用 pnpm 安装全部依赖
pnpm install
```

---

### 第二步：编译为微信小程序平台

使用 uni-app Vite 指令将 Vue 3 + TypeScript + UnoCSS 编译为微信小程序标准代码：

```bash
# 启动微信小程序端开发监听模式 (带热更新)
pnpm uni:dev:mp-weixin

# 或者生成生产打包输出
pnpm uni:build:mp-weixin
```

编译产物将自动输出至 `dist/dev/mp-weixin/` 目录。

---

### 第三步：在「微信开发者工具」中导入并调试

1. 打开 **微信开发者工具**（WeChat DevTools）。
2. 点击 **「导入项目」**。
3. **项目目录**：选择编译生成的 **`dist/dev/mp-weixin`** 目录（或直接选择项目根目录）。
4. **AppID**：填入您的小程序 AppID，或者选择 **「测试号」**。
5. 点击 **「导入」** 即可在微信开发者工具中：
   - 实时预览 **拼车大厅、一键0元预约、发车求拼、乘车6位核验码、业主认证** 等全部业务。
   - 支持 TypeScript 源码断点调试、Console 日志输出与微信扫码真机预览！
