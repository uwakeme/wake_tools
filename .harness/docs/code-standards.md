# Wake Tools 代码风格标准

不强制 lint 工具,以 PR review 为准。但请遵循以下约定,保持代码一致性。

## 全局命名空间

- 所有代码挂 `window.WT` 下,绝不污染全局
- 子模块按职责分:
  - `WT.tools` — 工具注册表
  - `WT.utils` — 通用工具函数(复制、toast、防抖、格式化等)
  - `WT.app` — 入口逻辑(路由、搜索、主题)
  - `WT.icons` — 图标常量(实际定义在 `icons.js` 里通过 `NS` 命名空间)
- **不要用 ES Modules**(`import` / `export`),因为无构建步骤,`<script>` 标签按顺序加载

## 文件加载顺序

由 `index.html` 硬编码,严格遵守:

```
icons.js → utils.js → tools.js → app.js
```

新增脚本必须按依赖顺序追加在 `app.js` 之前。

## 命名规范

| 场景 | 约定 | 示例 |
|---|---|---|
| 工具 id | kebab-case,英文 | `json-format`、`base64-encode`、`timestamp` |
| 工具 name | 中文,简洁 | `JSON 格式化`、`Base64 编码`、`时间戳转换` |
| 图标 key | 与工具 id 一致 | `icons.timestamp`、`icons.base64` |
| 内部函数 | camelCase | `formatTimestamp(ts)` |
| 常量 | UPPER_SNAKE | `MAX_INPUT_LENGTH` |
| CSS 类 | kebab-case | `.tool-panel`、`.sidebar-header` |
| CSS 变量 | `--kebab-case` | `--bg-primary`、`--accent` |

## 字符串与缩进

- 字符串一律双引号 `"..."`(除非内容里需要嵌套双引号)
- 缩进 2 空格,无 tab
- 文件末尾留一个空行
- 中文文案直接写在代码里,不需要 i18n 抽象(项目本身就是中文 UI)

## UI / 样式约定

### 复用 CSS 变量

颜色、间距、字号优先复用 `css/style.css` 顶部 `:root` 定义的变量。新增 magic value 必须有充分理由,并在 PR 里说明。

### 不用 inline style

除非要 JS 动态计算的值,样式走 CSS 类。

### 不用 Tailwind / 任何 utility CSS

项目纯手写 CSS,保持轻量。

## 图标

```js
// js/icons.js
icons: {
  myTool: NS.IC('<path d="..."/>'),
  // ...
}
```

`NS.IC(svgPath)` 工厂返回完整 SVG 字符串,`svgPath` 是 SVG 的 inner content(去掉外层 `<svg>`)。保持 24x24 viewBox,stroke 风格与现有图标一致。

## 工具注册模式

```js
// js/tools.js 末尾的注册区
WT.tools.register({
  id: "my-tool",
  name: "我的工具",
  icon: "myTool",       // 对应 icons.js 里的 key
  render(el) {
    // el 是挂载点,内部用 el.innerHTML 写 UI
    el.innerHTML = `
      <div class="my-tool">
        <textarea class="input"></textarea>
        <button class="btn-primary">转换</button>
        <pre class="output"></pre>
      </div>
    `;
    // 绑定事件
    el.querySelector(".btn-primary").addEventListener("click", () => {
      const input = el.querySelector(".input").value;
      el.querySelector(".output").textContent = myTransform(input);
    });
  }
});
```

复杂逻辑提取成纯函数,放在 `tools.js` 上半部分(注册区之前),不要把全部逻辑塞进 `render` 里。

## 安全约定

- 用户输入**绝不**用 `innerHTML` 写入,用 `textContent`
- 如果必须解析 HTML,使用安全的解析器(如 `DOMParser`)
- 所有工具**本地运行**,不要发请求到外部服务
- 外部链接(`<a target="_blank">`)必须 `rel="noopener"`

## a11y

- input 必须有可见 label 或 `aria-label`
- 按钮(尤其是纯图标的)必须有 `aria-label` 和 `title`
- 焦点状态可见,不写 `outline: none` 不补
- 颜色对比度满足 WCAG AA