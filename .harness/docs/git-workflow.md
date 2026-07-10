# Git 工作流

## 分支

- 主分支:`main`,**禁止直接 push**
- 特性分支:`wt/<短描述或 id>`
  - 例:`wt/json-decomment`、`wt/90547cbb`(看历史 merge 提交)
  - 全小写、连字符分隔、保持简短
- 修复分支:`fix/<bug 简述>`,可与特性分支共存

## Commit Message

使用 **conventional commits 中文风格**:

| 前缀 | 用途 |
|---|---|
| `feat:` | 新功能、新工具 |
| `fix:` | bug 修复 |
| `style(ui):` | UI/UX 调整(无功能变化) |
| `refactor:` | 重构(无功能变化) |
| `chore:` | 杂项(清理、配置、依赖) |
| `docs:` | 文档 |
| `test:` | 测试(目前项目无测试,极少用) |

**格式**:
```
<前缀>: <中文描述>, <工具总数变更或其他量化指标(可选)>
```

**示例**(从历史):
- `feat: 新增 JSON 去注释工具,工具总数 29 → 30`
- `style(ui): 重做首页视觉为 Precision Console 风格 + 拆分单文件为 css/js 模块`
- `fix(ui): 修复 home-card-arrow SVG 尺寸失控问题`
- `chore: 移除 browser-use 测试残留的临时 json 文件`

## 一次提交一个关注点

- 不要把 UI 调整和 bug 修复混在一个 commit 里
- 重构和新功能分开 commit
- `git log --oneline -10` 应该是清晰的故事线

## PR 工作流

1. 从 `main` 拉新分支:`git checkout -b wt/<name> main`
2. 提交改动(多次小 commit)
3. push 到 origin:`git push -u origin wt/<name>`
4. 用 `gh pr create` 开 PR:
   - 标题与首个 commit message 一致
   - 描述里写:改动目的、手动验证清单、相关截图
5. 等 CI / review 通过(目前项目无 CI,直接等人 review)
6. 合并:**用 merge commit**(看历史 `f756a05`),不 squash
7. 合并后删除远程分支

## 提交前自查

- [ ] 没有引入调试用的 `console.log`、`debugger`
- [ ] 没有提交 `.dev.vars` / `.env` / 任何密钥
- [ ] 没有提交 `node_modules`(虽然项目目前没有,但别破例)
- [ ] commit message 符合上述格式
- [ ] 单个 commit 不超过 ~300 行(超大改动考虑拆分)

## 紧急修复

- 主分支出 bug:从 `main` 拉 `fix/<bug>` → 改 → 直接 PR 回 `main`,不走特性分支流程