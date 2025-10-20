# AMingOS

一个基于 Next.js 的“桌面式”个人网站示例 —— 仿 Windows 11 桌面交互风格，默认暗色主题，支持桌面图标、毛玻璃任务栏、模态窗口与动画效果，适合把博客/作品以「桌面+窗口」的交互方式呈现。

## 主要特性

- 基于 Next.js App Router（app dir）
- 桌面级 UI 架构：桌面背景、桌面图标、可叠加的窗口/模态
- 底部毛玻璃任务栏（DockMenu），暗色系统模式默认启用
- 主题管理（ThemeProvider），支持系统主题切换
- 若干自定义组件：DesktopBackground、DockMenu、Magic UI 动画组件等
- 使用 Tailwind CSS + shadcn / 自定义样式实现视觉效果

## 快速开始（Linux）

安装依赖并启动开发服务器：

```bash
# 推荐 pnpm，如无可用 npm / yarn
pnpm install
pnpm dev
# 或
npm install
npm run dev
```

在浏览器打开 <http://localhost:3001>

打包与生产：

```bash
pnpm build
pnpm start
# 或
npm run build
npm run start
```

## 项目结构（概要）

- src/app — Next.js App 路由（布局、页面）
    - layout.tsx — 全局布局：ThemeProvider、DesktopBackground、DockMenu、Toaster
    - page.tsx — 站点首页（桌面）
- src/components 或 @/\_components — 可复用 UI 组件（桌面图标、任务栏、模态、magic 动画等）
- src/styles — 全局样式 / Tailwind 配置
- public — 静态资源（背景图、图标）

示例：你当前正在查看的布局文件

- src/app/layout.tsx — 管理暗色主题、桌面背景与底部任务栏

## 开发提示

- 组件交互（如点击图标导航）请使用 Next.js 的 client-side 导航（router.push）。注意在 Suspense / 异步组件中使用 await 或 setTimeout 可能造成渲染/导航阻塞，推荐将长耗时操作放到 effect 或微任务中异步执行以避免阻塞路由切换。
- 若在子组件中使用 await 的模拟延时（例如 setTimeout 包装的 Promise）并放在组件渲染路径中，会阻塞 Suspense 边界，导致路由切换出现卡顿。解决办法：
    - 不在渲染路径直接 await；改用 useEffect + state 处理延时逻辑，或将耗时逻辑迁移到客户端事件/回调中。
    - 在需要的地方使用 <Suspense fallback={...}> 提供即时占位 UI，避免主线程等待完整数据。
- Tailwind / CSS 未生效时，检查 tailwind.config.js 和 styles/index.css 是否被 layout.tsx 引入。

## 常见问题

- 路由跳转卡顿：如果路由目标页面包含同步 await（或阻塞渲染的大量同步计算），浏览器会在渲染新页面前等待这些同步任务完成。把延时 / 异步工作移出渲染路径或使用 Suspense fallback 可缓解。
- 样式冲突或 z-index 问题：组件使用模块化 CSS（layout.module.css）与 Tailwind，注意两个体系的层叠优先级与自定义变量（如 --z-index-dock-menu）。

## 贡献

欢迎提交 Issue / PR。开发分支请基于 main（或仓库指定分支）并遵循现有代码风格与组件结构。

## 许可证

请参考仓库根目录的 LICENSE 文件（如无则默认无许可，使用前请补充）。
