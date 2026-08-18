# 恒大文旅城邻里拼车 (uni-app + Vue3 + UnoCSS)

这是一个完全独立的微信小程序前端工程。

## 目录结构
```
├── App.vue             # 应用根组件与全局生命周期
├── main.ts             # 应用入口、UnoCSS 与 Pinia
├── pages.json          # 页面路由与 TabBar 导航
├── vite.config.ts      # Vite 构建配置
├── uno.config.ts       # UnoCSS 样式原子化配置
├── tsconfig.json       # TypeScript 配置
├── package.json        # 纯净小程序依赖
├── project.config.json # 微信开发者工具配置文件
├── pages/              # 业务页面 (大厅/发布/行程/个人中心/详情)
├── types/              # TS 类型声明
└── cloudfunctions/     # 微信云开发云函数 (发布/获取/预约/取消/统计)
```

## 运行步骤

1. **安装依赖**：
   ```bash
   pnpm install
   ```

2. **启动微信小程序编译**：
   ```bash
   pnpm dev:mp-weixin
   ```

3. **微信开发者工具预览**：
   - 打开微信开发者工具，选择 **导入项目**；
   - 目录选择当前目录生成的 `dist/dev/mp-weixin`；
   - AppID 填您自己的小程序 AppID 即可。
