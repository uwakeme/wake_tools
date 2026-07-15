# AGENTS.md

Wake Tools — 为开发者准备的小工具集合：时间戳转换、JSON 格式化、Base64、UUID、颜色转换等。中文 UI,Cloudflare Workers 静态部署。

## 项目形态

这是一个**纯静态前端站点**,没有构建步骤、没有依赖管理、没有测试框架。

- 无 `package.json` / `node_modules`
- 无 TypeScript / 无 ESLint / 无 Prettier
- 无 CI 配置 (`.github/workflows/` 不存在)
- 无单元测试

修改后直接 push,Cloudflare Workers 拉取根目录作为 assets 部署。

## Setup commands

| 用途 | 命令 |
|---|---|
| 本地预览 | `npx wrangler dev` (默认 `http://localhost:8787`) |
| 部署到生产 | `npx wrangler deploy` |
| 安装 wrangler | `npm install -g wrangler` (按需) |

没有 `install` / `build` / `lint` / `test` / `typecheck` 命令 —— 项目不需要。**不要尝试加构建步骤**。

## Project layout

```
wake_tools/
├── index.html         # 单页入口 (lang="zh-CN")
├── css/
│   └── style.css      # 全站样式 (Precision Console 风格,Inter + JetBrains Mono)
├── js/
│   ├── icons.js       # SVG 图标常量 (NS.IC / NS.SVG)
│   ├── utils.js       # 通用工具函数 (复制、toast、防抖等)
│   ├── tools.js       # 所有 30+ 工具的注册表与实现
│   └── app.js         # 路由、搜索、主题切换等入口逻辑
├── wrangler.jsonc     # Cloudflare Workers 配置 (assets 模式)
└── README.md          # 占位文件 (UTF-16 LE,只有一句标题)
```

**加载顺序硬编码在 `index.html`**:`icons.js` → `utils.js` → `tools.js` → `app.js`。新增脚本必须按这个顺序追加,且自检不破坏全局命名空间 (`window.WT`)。

## Code style

观察到的约定 (无强制工具,以代码 review 为准):

- 全局命名空间 `window.WT`,避免污染全局
- 模块化用 IIFE 或对象挂载,**不用 ES Modules** (无构建工具,`<script>` 标签加载)
- 字符串一律双引号,缩进 2 空格
- 中文 UI 文案,代码注释也可用中文
- 图标统一走 `NS.IC(svgPath)` 工厂函数,内联 SVG 不写死
- 工具注册走 `WT.tools.register({ id, name, icon, render })`,新工具先在 `icons.js` 加图标再注册
- 改 CSS 优先复用现有的 CSS 变量 (`--bg`, `--fg`, `--accent` 等),不新增 magic color

## Testing instructions

**项目没有自动化测试**。所有"测试"都是手动浏览器验证:

1. 启动 `npx wrangler dev`,打开 `http://localhost:8787`
2. 新增/修改的工具必须:
   - 在工具列表里能搜到 (⌘K)
   - 路由跳转正常 (URL hash 切换)
   - 输入边界用例:空串、超长串、特殊字符、Unicode
   - 复制按钮工作 (`navigator.clipboard`)
   - 主题切换 (深/浅色) 不破坏布局
3. 键盘可达性:`Tab` 顺序合理、可见 focus ring、`Esc` 关闭弹层 (如有)
4. 移动端:窗口缩到 375px 宽度不破版

Commit 信息里附**手动验证清单**(边界用例、浏览器测试等),重大改动也可以截图。

## Commit conventions

- 主分支:`main`。这是个人小项目,直接 commit + push 到 `main`,**不需要开分支、不要提 PR**
- 改动大、需要讨论的:可以临时开 `wt/<短描述或 id>` 分支走 PR(参考历史 `wt/90547cbb`),但日常小改动不必
- Commit message 用 **conventional commits 中文风格**:
  - `feat:` 新功能 / 新工具
  - `fix:` bug 修复
  - `style(ui):` UI/UX 调整
  - `refactor:` 重构 (无功能变化)
  - `chore:` 杂项 (清理、配置、依赖)
  - `docs:` 文档
- 例:`feat: 新增字符串拼接工具,工具总数 30 → 31`

## Security

- **绝不提交任何密钥**:`.dev.vars` / `.env` 在 `.gitignore` 里,新加的 secret 文件也请追加到 `.gitignore`
- `<a target="_blank">` 必须带 `rel="noopener"` (现有代码已遵循)
- 用户输入的工具 (Base64 解码、JSON parse 等) 全部本地运行,**不向外发请求** —— 不要改这点
- wrangler 配置变更注意 `compatibility_flags` 是否影响 runtime 行为

## 协作注意事项

- 这是个**用户公开访问**的小工具集,UI 一致性比"巧妙"更重要
- 新工具优先复用现有 `WT.utils.*` 工具函数,不要重新发明轮子
- 改动 `js/tools.js` 时注意文件已经 130KB,新增工具放在文件末尾的注册区,保持一致性
- 未提交改动 (`git status` 看到的 `js/icons.js`、`js/tools.js`) 通常是上一次会话遗留,开始工作前先确认是否要保留