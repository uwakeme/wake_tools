/* Wake Tools · tool registry
 * WT.TOOLS  - list of tool metadata (id, name, group, icon, desc) shown in nav + home
 * WT.Tools  - factories: each id maps to () => ({ view: () => html, bind: (root) => ... })
 *
 * Tools use window.WT.utils for formatDate/copyText/toast/escapeHtml, and
 * window.WT.ICONS for inline icons via the IC factory.
 */
(function () {
  const NS = (window.WT = window.WT || {});

  // utils.js 是 IIFE,函数都挂在 NS.utils 上;下面 factory 里的 click handler
  // 直接调 bare 名(copyText/toast/...),不在 IIFE 顶部解构就会 ReferenceError。
  const { copyText, copyTextWithBtn, toast, escapeHtml, escapeAttr, formatDate, pad } = NS.utils;

  NS.TOOLS = [
  // 编码转换
  { id: 'base64', group: '编码转换', icon: 'base64', name: 'Base64 编解码',
    desc: '字符串与 Base64 互转,支持 UTF-8 中文。' },
  { id: 'url', group: '编码转换', icon: 'url', name: 'URL 编解码',
    desc: 'URL encode / decode,支持完整与组件两种模式。' },
  { id: 'hex', group: '编码转换', icon: 'hex', name: 'Hex 字符串编解码',
    desc: '文本与十六进制字符串互转。' },
  { id: 'unicode', group: '编码转换', icon: 'unicode', name: 'Unicode 编解码',
    desc: '中文字符与 \\uXXXX 转义互转。' },
  { id: 'html', group: '编码转换', icon: 'html', name: 'HTML 实体编解码',
    desc: 'HTML 实体(&lt; &gt; &amp; 等)转义/反转义。' },

  // 时间日期
  { id: 'timestamp', group: '时间日期', icon: 'timestamp', name: '时间戳转换',
    desc: 'Unix 时间戳与日期时间互转,支持秒/毫秒。' },
  { id: 'duration', group: '时间日期', icon: 'duration', name: '时间单位转换',
    desc: '秒 / 分 / 时 / 天 / 周换算,支持加减运算。' },

  // 格式化
  { id: 'json', group: '格式化', icon: 'json', name: 'JSON 格式化',
    desc: 'JSON 格式化、压缩、去注释、转义、校验。' },
  { id: 'sql', group: '格式化', icon: 'sql', name: 'SQL 格式化',
    desc: 'SQL 语句关键字大写、缩进美化。' },
  { id: 'xml', group: '格式化', icon: 'xml', name: 'XML 格式化',
    desc: 'XML 美化、压缩。' },
  { id: 'markdown', group: '格式化', icon: 'markdown', name: 'Markdown 预览',
    desc: '左侧写 Markdown,右侧实时渲染预览。' },
  { id: 'yaml', group: '格式化', icon: 'yaml', name: 'YAML ↔ JSON',
    desc: 'YAML 与 JSON 互转,支持基础语法。' },

  // 文本处理
  { id: 'case', group: '文本处理', icon: 'case', name: '命名风格转换',
    desc: '驼峰、下划线、烤串、帕斯卡等命名互转,JSON Key 批处理。' },
  { id: 'textutil', group: '文本处理', icon: 'textutil', name: '文本去重 / 排序',
    desc: '按行去重、排序,统计行数与字符数。' },
  { id: 'diff', group: '文本处理', icon: 'diff', name: '文本 Diff',
    desc: '逐行比较两段文本的差异。' },
  { id: 'regex', group: '文本处理', icon: 'regex', name: '正则测试',
    desc: '实时测试正则表达式,支持捕获组高亮。' },
  { id: 'string', group: '文本处理', icon: 'string', name: '字符串工具',
    desc: '长度统计、反转、重复、填充、替换、大小写等常用字符串操作。' },

  // 生成器
  { id: 'uuid', group: '生成器', icon: 'uuid', name: 'UUID 生成',
    desc: '批量生成 UUID v4。' },
  { id: 'password', group: '生成器', icon: 'password', name: '随机密码',
    desc: '生成高强度随机密码,可选字符集与长度。' },
  { id: 'lorem', group: '生成器', icon: 'lorem', name: 'Lorem Ipsum',
    desc: '生成占位文本。' },
  { id: 'hash', group: '生成器', icon: 'hash', name: 'Hash 生成',
    desc: '计算文本的 MD5 / SHA-1 / SHA-256 / SHA-512 哈希值。' },
  { id: 'fakedata', group: '生成器', icon: 'fakedata', name: '假数据生成',
    desc: '批量生成测试用姓名、邮箱、手机号、身份证、地址。' },

  // 颜色工具
  { id: 'color', group: '颜色工具', icon: 'color', name: '颜色值转换',
    desc: 'HEX / RGB / HSL 互转,附带色板预览。' },

  // 数字工具
  { id: 'radix', group: '数字工具', icon: 'radix', name: '进制转换',
    desc: '2~36 进制互转。' },
  { id: 'bytes', group: '数字工具', icon: 'bytes', name: '字节单位转换',
    desc: 'B / KB / MB / GB / TB,支持二进制(1024)和十进制(1000)。' },

  // 网络调试
  { id: 'jwt', group: '网络调试', icon: 'jwt', name: 'JWT 解码',
    desc: '解析 JWT 的 Header / Payload / Signature(不验签)。' },
  { id: 'urlparse', group: '网络调试', icon: 'urlparse', name: 'URL 解析',
    desc: '拆分 URL 的协议、域名、路径、参数等。' },
  { id: 'header', group: '网络调试', icon: 'header', name: 'HTTP Header 解析',
    desc: '解析 HTTP 头部为可读表格。' },

  // 其它
  { id: 'cron', group: '其它', icon: 'cron', name: 'Cron 表达式',
    desc: '解析 Cron 表达式,展示未来 5 次执行时间。' },
  { id: 'ascii', group: '其它', icon: 'ascii', name: 'ASCII 表',
    desc: '查询 ASCII / Unicode 字符。' },
];

/* ============================================================
   工具实现
   ============================================================ */;

  NS.Tools = {
  /* ---------- Base64 ---------- */
  base64() {
    return {
      view: () => `
        <div class="tool-header">
          <h1 class="tool-title">Base64 编解码</h1>
          <p class="tool-desc">字符串与 Base64 互转,自动处理 UTF-8 中文。</p>
        </div>
        <div class="row">
          <div class="panel">
            <div class="panel-title">原文(UTF-8)</div>
            <textarea class="textarea mono" id="b64in" placeholder="输入要编码的字符串...">Hello, 世界!</textarea>
            <div class="btn-row">
              <button class="btn btn-primary" data-act="enc">编码 →</button>
              <button class="btn" data-act="clear">清空</button>
            </div>
          </div>
          <div class="panel">
            <div class="panel-title">Base64 结果</div>
            <textarea class="textarea mono" id="b64out" placeholder="Base64 输出..."></textarea>
            <div class="btn-row">
              <button class="btn btn-primary" data-act="dec">← 解码</button>
              <button class="btn" data-act="copy">复制</button>
            </div>
          </div>
        </div>
      `,
      bind(root) {
        const $i = root.querySelector('#b64in');
        const $o = root.querySelector('#b64out');
        const enc = () => {
          try { $o.value = btoa(unescape(encodeURIComponent($i.value))); toast('已编码'); }
          catch (e) { toast('编码失败:' + e.message); }
        };
        const dec = () => {
          try { $i.value = decodeURIComponent(escape(atob($o.value.trim()))); toast('已解码'); }
          catch (e) { toast('解码失败:不是有效的 Base64'); }
        };
        root.addEventListener('click', e => {
          const a = e.target.dataset.act;
          if (a === 'enc') enc();
          else if (a === 'dec') dec();
          else if (a === 'clear') { $i.value = ''; $o.value = ''; }
          else if (a === 'copy') copyTextWithBtn($o.value, e.target);
        });
      }
    };
  },

  /* ---------- URL ---------- */
  url() {
    return {
      view: () => `
        <div class="tool-header">
          <h1 class="tool-title">URL 编解码</h1>
          <p class="tool-desc">支持 encodeURIComponent(推荐)和 encodeURI(整体 URL)两种模式。</p>
        </div>
        <div class="row">
          <div class="panel">
            <div class="panel-title">原文</div>
            <textarea class="textarea mono" id="urlin" placeholder="输入要编码的字符串...">https://example.com/search?q=你好&lang=中文</textarea>
            <div class="field" style="margin-top:12px;">
              <label class="switch">
                <input type="checkbox" id="urlmode" />
                <span class="switch-track"></span>
                <span class="switch-label">encodeURIComponent(更彻底)</span>
              </label>
            </div>
            <div class="btn-row">
              <button class="btn btn-primary" data-act="enc">编码 →</button>
              <button class="btn" data-act="clear">清空</button>
            </div>
          </div>
          <div class="panel">
            <div class="panel-title">编码后</div>
            <textarea class="textarea mono" id="urlout" placeholder="结果..."></textarea>
            <div class="btn-row">
              <button class="btn btn-primary" data-act="dec">← 解码</button>
              <button class="btn" data-act="copy">复制</button>
            </div>
          </div>
        </div>
      `,
      bind(root) {
        const $i = root.querySelector('#urlin');
        const $o = root.querySelector('#urlout');
        const $m = root.querySelector('#urlmode');
        const enc = () => {
          $o.value = $m.checked ? encodeURIComponent($i.value) : encodeURI($i.value);
          toast('已编码');
        };
        const dec = () => {
          try { $i.value = $m.checked ? decodeURIComponent($o.value) : decodeURI($o.value); toast('已解码'); }
          catch (e) { toast('解码失败:' + e.message); }
        };
        root.addEventListener('click', e => {
          const a = e.target.dataset.act;
          if (a === 'enc') enc();
          else if (a === 'dec') dec();
          else if (a === 'clear') { $i.value = ''; $o.value = ''; }
          else if (a === 'copy') copyTextWithBtn($o.value, e.target);
        });
      }
    };
  },

  /* ---------- Hex ---------- */
  hex() {
    return {
      view: () => `
        <div class="tool-header">
          <h1 class="tool-title">Hex 字符串编解码</h1>
          <p class="tool-desc">文本与十六进制字符串互转(UTF-8 字节级)。</p>
        </div>
        <div class="row">
          <div class="panel">
            <div class="panel-title">文本</div>
            <textarea class="textarea mono" id="hexin" placeholder="输入文本...">Hi, 早上好</textarea>
            <div class="btn-row">
              <button class="btn btn-primary" data-act="enc">转 Hex →</button>
              <button class="btn" data-act="clear">清空</button>
            </div>
          </div>
          <div class="panel">
            <div class="panel-title">Hex</div>
            <textarea class="textarea mono" id="hexout" placeholder="hex 输出..."></textarea>
            <div class="btn-row">
              <button class="btn btn-primary" data-act="dec">← 解码</button>
              <button class="btn" data-act="copy">复制</button>
            </div>
          </div>
        </div>
      `,
      bind(root) {
        const $i = root.querySelector('#hexin');
        const $o = root.querySelector('#hexout');
        const enc = () => {
          const bytes = new TextEncoder().encode($i.value);
          $o.value = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' ');
          toast('已转 Hex');
        };
        const dec = () => {
          try {
            const clean = $o.value.replace(/\s+/g, '');
            if (clean.length % 2) throw new Error('长度必须为偶数');
            if (!/^[0-9a-fA-F]+$/.test(clean)) throw new Error('不是有效的 hex');
            const bytes = new Uint8Array(clean.match(/.{1,2}/g).map(s => parseInt(s, 16)));
            $i.value = new TextDecoder().decode(bytes);
            toast('已解码');
          } catch (e) { toast('解码失败:' + e.message); }
        };
        root.addEventListener('click', e => {
          const a = e.target.dataset.act;
          if (a === 'enc') enc();
          else if (a === 'dec') dec();
          else if (a === 'clear') { $i.value = ''; $o.value = ''; }
          else if (a === 'copy') copyTextWithBtn($o.value, e.target);
        });
      }
    };
  },

  /* ---------- Unicode ---------- */
  unicode() {
    return {
      view: () => `
        <div class="tool-header">
          <h1 class="tool-title">Unicode 编解码</h1>
          <p class="tool-desc">中文与 <code>\\uXXXX</code> 转义互转。</p>
        </div>
        <div class="row">
          <div class="panel">
            <div class="panel-title">原文</div>
            <textarea class="textarea mono" id="uin" placeholder="输入中文...">你好,世界</textarea>
            <div class="btn-row">
              <button class="btn btn-primary" data-act="enc">转 \\uXXXX →</button>
              <button class="btn" data-act="clear">清空</button>
            </div>
          </div>
          <div class="panel">
            <div class="panel-title">转义</div>
            <textarea class="textarea mono" id="uout" placeholder="..."></textarea>
            <div class="btn-row">
              <button class="btn btn-primary" data-act="dec">← 解码</button>
              <button class="btn" data-act="copy">复制</button>
            </div>
          </div>
        </div>
      `,
      bind(root) {
        const $i = root.querySelector('#uin');
        const $o = root.querySelector('#uout');
        const enc = () => {
          $o.value = $i.value.split('').map(c => {
            const code = c.charCodeAt(0);
            return code > 127 ? '\\u' + code.toString(16).padStart(4, '0') : c;
          }).join('');
          toast('已转义');
        };
        const dec = () => {
          try {
            $i.value = $o.value.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
            toast('已解码');
          } catch (e) { toast('解码失败:' + e.message); }
        };
        root.addEventListener('click', e => {
          const a = e.target.dataset.act;
          if (a === 'enc') enc();
          else if (a === 'dec') dec();
          else if (a === 'clear') { $i.value = ''; $o.value = ''; }
          else if (a === 'copy') copyTextWithBtn($o.value, e.target);
        });
      }
    };
  },

  /* ---------- Timestamp ---------- */
  timestamp() {
    const nowSec = () => Math.floor(Date.now() / 1000);
    return {
      view: () => {
        const sec = nowSec();
        const ms = Date.now();
        return `
          <div class="tool-header">
            <h1 class="tool-title">时间戳转换</h1>
            <p class="tool-desc">Unix 时间戳 ↔ 日期时间。支持秒(10 位)和毫秒(13 位)。</p>
          </div>

          <div class="panel">
            <div class="panel-title">当前时间</div>
            <div class="stats">
              <div class="stat">
                <div class="stat-label">秒(10 位)</div>
                <div class="stat-value">${sec}</div>
              </div>
              <div class="stat">
                <div class="stat-label">毫秒(13 位)</div>
                <div class="stat-value">${ms}</div>
              </div>
              <div class="stat">
                <div class="stat-label">本地时间</div>
                <div class="stat-value" style="font-size:13px;">${formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')}</div>
              </div>
            </div>
            <div class="btn-row">
              <button class="btn" data-act="now-sec">复制秒时间戳</button>
              <button class="btn" data-act="now-ms">复制毫秒时间戳</button>
            </div>
          </div>

          <div class="row">
            <div class="panel">
              <div class="panel-title">时间戳 → 日期</div>
              <div class="field">
                <label class="field-label">输入时间戳</label>
                <input class="input mono" id="tsin" value="${sec}" />
              </div>
              <div class="field">
                <label class="switch">
                  <input type="checkbox" id="tsms" />
                  <span class="switch-track"></span>
                  <span class="switch-label">毫秒</span>
                </label>
              </div>
              <div class="btn-row">
                <button class="btn btn-primary" data-act="ts-conv">转换</button>
                <button class="btn" data-act="ts-fill">填入当前</button>
              </div>
              <div class="field" style="margin-top:12px;">
                <label class="field-label">本地时间</label>
                <div class="output" id="ts-local">-</div>
              </div>
              <div class="field">
                <label class="field-label">UTC 时间</label>
                <div class="output" id="ts-utc">-</div>
              </div>
              <div class="field">
                <label class="field-label">ISO 8601</label>
                <div class="output" id="ts-iso">-</div>
              </div>
            </div>

            <div class="panel">
              <div class="panel-title">日期 → 时间戳</div>
              <div class="field">
                <label class="field-label">日期时间</label>
                <input class="input" id="dtin" value="${formatDate(new Date(), 'YYYY-MM-DDTHH:mm:ss')}" />
              </div>
              <div class="btn-row">
                <button class="btn btn-primary" data-act="dt-conv">转换</button>
                <button class="btn" data-act="dt-now">填入当前</button>
              </div>
              <div class="field" style="margin-top:12px;">
                <label class="field-label">秒时间戳</label>
                <div class="output" id="dt-sec">-</div>
              </div>
              <div class="field">
                <label class="field-label">毫秒时间戳</label>
                <div class="output" id="dt-ms">-</div>
              </div>
            </div>
          </div>
        `;
      },
      bind(root) {
        const ts2date = () => {
          const raw = root.querySelector('#tsin').value.trim();
          if (!raw) return;
          const ms = root.querySelector('#tsms').checked ? +raw : +raw * 1000;
          const d = new Date(ms);
          if (isNaN(d.getTime())) { toast('无效的时间戳'); return; }
          root.querySelector('#ts-local').textContent = formatDate(d, 'YYYY-MM-DD HH:mm:ss (Z dddd)');
          root.querySelector('#ts-utc').textContent = d.toUTCString();
          root.querySelector('#ts-iso').textContent = d.toISOString();
        };
        const date2ts = () => {
          const d = new Date(root.querySelector('#dtin').value);
          if (isNaN(d.getTime())) { toast('无效的日期'); return; }
          const ms = d.getTime();
          root.querySelector('#dt-sec').textContent = Math.floor(ms / 1000);
          root.querySelector('#dt-ms').textContent = ms;
        };
        root.addEventListener('click', e => {
          const a = e.target.dataset.act;
          if (a === 'ts-conv') ts2date();
          else if (a === 'ts-fill') { root.querySelector('#tsin').value = nowSec(); ts2date(); }
          else if (a === 'dt-conv') date2ts();
          else if (a === 'dt-now') { root.querySelector('#dtin').value = formatDate(new Date(), 'YYYY-MM-DDTHH:mm:ss'); date2ts(); }
          else if (a === 'now-sec') { copyText(String(nowSec())); }
          else if (a === 'now-ms') { copyText(String(Date.now())); }
        });
        ts2date(); date2ts();
      }
    };
  },

  /* ---------- JSON ---------- */
  json() {
    // 状态机去注释：识别字符串、// 行注释、/* */ 块注释
    // 字符串内的 // 不当注释；转义符 \\ 后的引号不结束字符串
    const stripComments = (input) => {
      let out = '';
      let i = 0;
      let inString = false;
      let escape = false;
      while (i < input.length) {
        const c = input[i];
        const n = input[i + 1];
        if (inString) {
          out += c;
          if (escape) {
            escape = false;
          } else if (c === '\\') {
            escape = true;
          } else if (c === '"') {
            inString = false;
          }
          i++;
          continue;
        }
        if (c === '"') {
          inString = true;
          out += c;
          i++;
          continue;
        }
        if (c === '/' && n === '/') {
          i += 2;
          while (i < input.length && input[i] !== '\n') i++;
          continue;
        }
        if (c === '/' && n === '*') {
          i += 2;
          while (i < input.length && !(input[i] === '*' && input[i + 1] === '/')) {
            if (input[i] === '\n') out += '\n';
            i++;
          }
          i += 2;
          continue;
        }
        out += c;
        i++;
      }
      return out;
    };
    // 清理去注释后残留的多余空白
    const tidy = (s) => s
      .replace(/[ \t]+\n/g, '\n')
      .replace(/,(\s*\n\s*)+/g, ',\n')
      .replace(/[ \t]{2,}/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    // ---- 树形 DOM 构造 ----
    const el = (tag, cls, text) => {
      const n = document.createElement(tag);
      if (cls) n.className = cls;
      if (text !== undefined) n.textContent = text;
      return n;
    };
    const fmtVal = (v) => {
      if (v === null) return el('span', 'jtree-null', 'null');
      if (typeof v === 'string') return el('span', 'jtree-string', JSON.stringify(v));
      if (typeof v === 'number') return el('span', 'jtree-number', String(v));
      if (typeof v === 'boolean') return el('span', 'jtree-boolean', String(v));
      return el('span', 'jtree-null', String(v));
    };
    // 递归构建树节点 DOM
    // inArray=true 表示当前节点在数组里,keyName 不渲染
    const buildNode = (value, keyName, inArray) => {
      const isContainer = value !== null && typeof value === 'object';
      if (!isContainer) {
        const row = el('div', 'jtree-row jtree-leaf');
        if (keyName !== undefined) {
          row.appendChild(el('span', 'jtree-key', JSON.stringify(keyName)));
          row.appendChild(el('span', 'jtree-punct', ': '));
        }
        row.appendChild(fmtVal(value));
        return row;
      }
      const isArray = Array.isArray(value);
      const entries = isArray
        ? value.map((v, i) => [i, v])
        : Object.entries(value);
      const count = entries.length;
      const wrap = el('div', 'jtree-node jtree-expanded');
      const head = el('div', 'jtree-row jtree-head');
      const toggle = el('span', 'jtree-toggle', '▼');
      head.appendChild(toggle);
      if (keyName !== undefined) {
        head.appendChild(el('span', 'jtree-key', JSON.stringify(keyName)));
        head.appendChild(el('span', 'jtree-punct', ': '));
      }
      const openB = el('span', 'jtree-punct jtree-open', isArray ? '[' : '{');
      head.appendChild(openB);
      const label = isArray
        ? (count === 1 ? 'item' : 'items')
        : (count === 1 ? 'key' : 'keys');
      const summary = el('span', 'jtree-summary', ` ${count} ${label} `);
      summary.style.display = 'none';
      head.appendChild(summary);
      wrap.appendChild(head);
      const childWrap = el('div', 'jtree-children');
      for (const [k, v] of entries) {
        childWrap.appendChild(buildNode(v, isArray ? undefined : k, isArray));
      }
      wrap.appendChild(childWrap);
      if (count > 0) {
        const tail = el('div', 'jtree-row jtree-tail');
        tail.appendChild(el('span', 'jtree-punct', isArray ? ']' : '}'));
        wrap.appendChild(tail);
        wrap._tail = tail;
      } else {
        // 空容器:head 行直接显示 {}
        toggle.style.visibility = 'hidden';
        openB.style.display = 'none';
        head.appendChild(el('span', 'jtree-punct', isArray ? ']' : '}'));
      }
      // 折叠/展开相关引用 + 状态方法
      wrap._childWrap = childWrap;
      wrap._openB = openB;
      wrap._summary = summary;
      wrap._toggle = toggle;
      wrap._setFolded = (folded) => {
        if (folded) {
          wrap.classList.add('jtree-collapsed');
          wrap.classList.remove('jtree-expanded');
          wrap._childWrap.style.display = 'none';
          if (wrap._tail) wrap._tail.style.display = 'none';
          wrap._openB.style.display = 'none';
          wrap._summary.style.display = 'inline';
          wrap._toggle.textContent = '▶';
        } else {
          wrap.classList.remove('jtree-collapsed');
          wrap.classList.add('jtree-expanded');
          wrap._childWrap.style.display = '';
          if (wrap._tail) wrap._tail.style.display = '';
          wrap._openB.style.display = '';
          wrap._summary.style.display = 'none';
          wrap._toggle.textContent = '▼';
        }
      };
      if (count > 0) {
        head.addEventListener('click', (ev) => {
          if (ev.target === wrap._toggle) return;
          wrap._setFolded(wrap.classList.contains('jtree-expanded'));
        });
      }
      return wrap;
    };

    return {
      view: () => `
        <div class="tool-header">
          <h1 class="tool-title">JSON 格式化</h1>
          <p class="tool-desc">格式化、压缩、去注释、转义、去除转义、键排序、校验;支持树形预览实时折叠展开。</p>
          <div class="field" style="margin-top:12px; display:flex; gap:18px; flex-wrap:wrap;">
            <label style="display:inline-flex; align-items:center; gap:6px; cursor:pointer; user-select:none; font-size:13px;">
              <input type="checkbox" id="jlive" /> 实时预览
            </label>
            <label style="display:inline-flex; align-items:center; gap:6px; cursor:pointer; user-select:none; font-size:13px;">
              <input type="checkbox" id="jtree-mode" /> 🌳 树形视图
            </label>
          </div>
        </div>
        <div class="panel">
          <div class="panel-title">输入</div>
          <textarea class="textarea mono" id="jin" style="min-height:200px;" placeholder='{"name":"wake","tags":["tools","json"],"meta":{"v":1}}'>{"name":"wake","tags":["tools","json"],"meta":{"v":1}}</textarea>
          <div class="btn-row">
            <button class="btn btn-primary" data-act="fmt">格式化 (2 空格)</button>
            <button class="btn" data-act="fmt4">格式化 (4 空格)</button>
            <button class="btn" data-act="min">压缩</button>
            <button class="btn" data-act="strip">去注释</button>
            <button class="btn" data-act="stripfmt">去注释+格式化</button>
            <button class="btn" data-act="stripmin">去注释+压缩</button>
            <button class="btn" data-act="escape">转义</button>
            <button class="btn" data-act="unescape">去转义</button>
            <button class="btn" data-act="sort">键排序</button>
            <button class="btn" data-act="clear">清空</button>
          </div>
        </div>
        <div class="panel">
          <div class="panel-title">结果</div>
          <div data-result="text">
            <textarea class="textarea mono" id="jout" style="min-height:280px;" placeholder="结果…"></textarea>
          </div>
          <div data-result="tree" style="display:none;">
            <div id="jtree" class="jtree"></div>
          </div>
          <div class="field" style="margin-top:8px;">
            <span id="jstatus" class="tag" style="display:none;"></span>
          </div>
          <div data-result="text" class="btn-row">
            <button class="btn" data-act="copy">复制结果</button>
            <button class="btn" data-act="swap">↕ 替换输入</button>
          </div>
          <div data-result="tree" class="btn-row" style="display:none;">
            <button class="btn" data-act="expand">展开全部</button>
            <button class="btn" data-act="collapse">收起全部</button>
            <button class="btn" data-act="copy">复制结果</button>
          </div>
        </div>
      `,
      bind(root) {
        const $i = root.querySelector('#jin');
        const $o = root.querySelector('#jout');
        const $t = root.querySelector('#jtree');
        const $s = root.querySelector('#jstatus');
        const $live = root.querySelector('#jlive');
        const $treeMode = root.querySelector('#jtree-mode');
        const $rText = Array.from(root.querySelectorAll('[data-result="text"]'));
        const $rTree = Array.from(root.querySelectorAll('[data-result="tree"]'));

        let currentValue = undefined; // 最近一次成功 parse 的值,供树视图用
        let lastFn = 'fmt'; // 最近一次点击的转换函数,实时模式用

        const show = (ok, msg) => {
          $s.style.display = 'inline-block';
          $s.textContent = msg;
          $s.style.background = ok ? 'rgba(0,180,42,.12)' : 'rgba(245,63,63,.12)';
          $s.style.color = ok ? 'var(--success)' : 'var(--danger)';
        };

        const renderTree = () => {
          $t.innerHTML = '';
          if (currentValue === undefined) return;
          $t.appendChild(buildNode(currentValue, undefined, false));
        };

        const setTreeMode = (on) => {
          $rText.forEach(n => n.style.display = on ? 'none' : '');
          $rTree.forEach(n => n.style.display = on ? '' : 'none');
          if (on) renderTree();
        };

        // 展开/收起全部(遍历所有非空容器节点)
        const setAllFolded = (folded) => {
          $t.querySelectorAll('.jtree-node').forEach(n => {
            if (typeof n._setFolded === 'function') n._setFolded(folded);
          });
        };

        const fmt = (indent) => {
          try {
            const v = JSON.parse($i.value);
            currentValue = v;
            $o.value = JSON.stringify(v, null, indent);
            if ($treeMode.checked) renderTree();
            show(true, '✓ 有效 JSON');
          } catch (e) { show(false, '✗ ' + e.message); }
        };
        const min = () => {
          try {
            const v = JSON.parse($i.value);
            currentValue = v;
            $o.value = JSON.stringify(v);
            if ($treeMode.checked) renderTree();
            show(true, '✓ 已压缩');
          } catch (e) { show(false, '✗ ' + e.message); }
        };
        const strip = () => {
          if (!$i.value.trim()) {
            currentValue = undefined;
            $o.value = '';
            if ($treeMode.checked) renderTree();
            $s.style.display = 'none';
            return;
          }
          const cleaned = tidy(stripComments($i.value));
          $o.value = cleaned;
          try {
            currentValue = JSON.parse(cleaned);
            if ($treeMode.checked) renderTree();
            show(true, '✓ 已去注释');
          } catch (e) { show(false, '✗ ' + e.message); }
        };
        const stripFmt = () => {
          const cleaned = stripComments($i.value);
          try {
            const v = JSON.parse(cleaned);
            currentValue = v;
            $o.value = JSON.stringify(v, null, 2);
            if ($treeMode.checked) renderTree();
            show(true, '✓ 已去注释并美化');
          } catch (e) { show(false, '✗ ' + e.message); }
        };
        const stripMin = () => {
          const cleaned = stripComments($i.value);
          try {
            const v = JSON.parse(cleaned);
            currentValue = v;
            $o.value = JSON.stringify(v);
            if ($treeMode.checked) renderTree();
            show(true, '✓ 已去注释并压缩');
          } catch (e) { show(false, '✗ ' + e.message); }
        };
        const esc = () => { $o.value = JSON.stringify($i.value); show(true, '已转义'); };
        const unesc = () => {
          try {
            const v = JSON.parse($i.value);
            if (typeof v !== 'string') {
              show(false, '✗ 去转义只对 JSON 字符串有效，当前是 ' + (Array.isArray(v) ? '数组' : typeof v));
              return;
            }
            currentValue = v;
            $o.value = v;
            if ($treeMode.checked) renderTree();
            show(true, '✓ 已去转义');
          } catch (e) { show(false, '✗ ' + e.message); }
        };
        const sort = () => {
          const sortRec = v => {
            if (Array.isArray(v)) return v.map(sortRec);
            if (v && typeof v === 'object') {
              return Object.keys(v).sort().reduce((a, k) => { a[k] = sortRec(v[k]); return a; }, {});
            }
            return v;
          };
          try {
            const v = sortRec(JSON.parse($i.value));
            currentValue = v;
            $o.value = JSON.stringify(v, null, 2);
            if ($treeMode.checked) renderTree();
            show(true, '✓ 已排序');
          } catch (e) { show(false, '✗ ' + e.message); }
        };

        const runLastFn = () => {
          switch (lastFn) {
            case 'fmt': fmt(2); break;
            case 'fmt4': fmt(4); break;
            case 'min': min(); break;
            case 'strip': strip(); break;
            case 'stripfmt': stripFmt(); break;
            case 'stripmin': stripMin(); break;
            case 'escape': esc(); break;
            case 'unescape': unesc(); break;
            case 'sort': sort(); break;
            default: fmt(2);
          }
        };

        // 实时预览:输入 200ms 后重跑最近一次函数
        let liveTimer = null;
        $i.addEventListener('input', () => {
          if (!$live.checked) return;
          clearTimeout(liveTimer);
          liveTimer = setTimeout(runLastFn, 200);
        });

        // 树形模式切换
        $treeMode.addEventListener('change', () => setTreeMode($treeMode.checked));

        root.addEventListener('click', e => {
          const a = e.target.dataset.act;
          if (!a) return;
          if (a === 'clear') {
            $i.value = ''; $o.value = ''; currentValue = undefined;
            if ($treeMode.checked) renderTree();
            $s.style.display = 'none';
            lastFn = 'fmt'; // 清空后回到默认格式化
          } else if (a === 'copy') {
            copyTextWithBtn($o.value, e.target);
          } else if (a === 'swap') {
            $i.value = $o.value; $o.value = ''; currentValue = undefined;
            if ($treeMode.checked) renderTree();
          } else if (a === 'expand') {
            setAllFolded(false);
          } else if (a === 'collapse') {
            setAllFolded(true);
          } else {
            lastFn = a;
            runLastFn();
          }
        });
      }
    };
  },

  /* ---------- SQL ---------- */
  sql() {
    return {
      view: () => `
        <div class="tool-header">
          <h1 class="tool-title">SQL 格式化</h1>
          <p class="tool-desc">把 SQL 关键字大写、按主语句换行美化。</p>
        </div>
        <div class="panel">
          <div class="panel-title">SQL</div>
          <textarea class="textarea mono" id="sqlin" style="min-height:180px;">select id, name, email from users where status='active' and created_at > '2024-01-01' order by id desc limit 10</textarea>
          <div class="btn-row">
            <button class="btn btn-primary" data-act="fmt">格式化</button>
            <button class="btn" data-act="min">压缩</button>
            <button class="btn" data-act="clear">清空</button>
            <button class="btn" data-act="copy">复制</button>
          </div>
        </div>
        <div class="panel">
          <div class="panel-title">结果</div>
          <textarea class="textarea mono" id="sqlout" style="min-height:240px;"></textarea>
        </div>
      `,
      bind(root) {
        const KW = ['select','from','where','and','or','not','in','as','on','join','left','right','inner','outer','full','group','by','order','having','limit','offset','union','insert','into','values','update','set','delete','create','table','alter','drop','index','view','case','when','then','else','end','is','null','like','between','exists','distinct','count','sum','avg','min','max','with','returning','primary','key','foreign','references','default','check','unique','if','begin','commit','rollback','truncate','declare','cursor','fetch','open','close','true','false'];
        const fmt = (s) => {
          const upper = s.replace(/\b([a-zA-Z_]+)\b/g, m => KW.includes(m.toLowerCase()) ? m.toUpperCase() : m);
          const breaks = ['SELECT','FROM','WHERE','GROUP BY','ORDER BY','HAVING','LIMIT','OFFSET','UNION','INSERT INTO','VALUES','UPDATE','SET','DELETE FROM','JOIN','LEFT JOIN','RIGHT JOIN','INNER JOIN','OUTER JOIN','FULL JOIN','ON','WITH','RETURNING'];
          breaks.sort((a,b) => b.length - a.length);
          let out = ' ' + upper + ' ';
          breaks.forEach(kw => {
            out = out.replace(new RegExp('\\s' + kw + '\\s', 'g'), '\n' + kw);
          });
          out = out.replace(/,\s*/g, ',\n  ').replace(/\n\s*\n/g, '\n').trim();
          return out;
        };
        const min = (s) => s.replace(/\s+/g, ' ').replace(/\s*([(),;])\s*/g, '$1').trim();
        const $i = root.querySelector('#sqlin');
        const $o = root.querySelector('#sqlout');
        root.addEventListener('click', e => {
          const a = e.target.dataset.act;
          if (a === 'fmt') $o.value = fmt($i.value);
          else if (a === 'min') $o.value = min($i.value);
          else if (a === 'clear') { $i.value = ''; $o.value = ''; }
          else if (a === 'copy') copyTextWithBtn($o.value, e.target);
        });
      }
    };
  },

  /* ---------- XML ---------- */
  xml() {
    return {
      view: () => `
        <div class="tool-header">
          <h1 class="tool-title">XML 格式化</h1>
          <p class="tool-desc">XML 美化、压缩。轻量级实现(不支持注释嵌套修复等复杂场景)。</p>
        </div>
        <div class="panel">
          <div class="panel-title">XML</div>
          <textarea class="textarea mono" id="xmlin" style="min-height:180px;"><root><user name="wake" age="18"><tags><tag>tools</tag><tag>web</tag></tags></user><user name="tools" age="1"/></root></textarea>
          <div class="btn-row">
            <button class="btn btn-primary" data-act="fmt">格式化</button>
            <button class="btn" data-act="min">压缩</button>
            <button class="btn" data-act="clear">清空</button>
            <button class="btn" data-act="copy">复制</button>
          </div>
        </div>
        <div class="panel">
          <div class="panel-title">结果</div>
          <textarea class="textarea mono" id="xmlout" style="min-height:240px;"></textarea>
        </div>
      `,
      bind(root) {
        const $i = root.querySelector('#xmlin');
        const $o = root.querySelector('#xmlout');
        const fmt = (s) => {
          s = s.replace(/>\s*</g, '><').trim();
          let indent = 0;
          let first = true;
          return s.replace(/<(\/?)([^>]+?)(\/?)>/g, (_, close, body, self) => {
            // 第一个标签不要前导换行,避免首行空行
            const nl = first ? '' : '\n';
            first = false;
            if (self) {
              // 自闭合: <body/> 不改 indent
              return nl + '  '.repeat(indent) + '<' + body + '/>';
            }
            if (close) {
              indent = Math.max(0, indent - 1);
              return nl + '  '.repeat(indent) + '</' + body + '>';
            }
            // 开始标签
            const r = nl + '  '.repeat(indent) + '<' + body + '>';
            indent++;
            return r;
          });
        };
        const min = (s) => s.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();
        root.addEventListener('click', e => {
          const a = e.target.dataset.act;
          if (a === 'fmt') $o.value = fmt($i.value);
          else if (a === 'min') $o.value = min($i.value);
          else if (a === 'clear') { $i.value = ''; $o.value = ''; }
          else if (a === 'copy') copyTextWithBtn($o.value, e.target);
        });
      }
    };
  },

  /* ---------- Case (命名风格转换) ---------- */
  case() {
    return {
      view: () => `
        <div class="tool-header">
          <h1 class="tool-title">命名风格转换</h1>
          <p class="tool-desc">驼峰、下划线、烤串、帕斯卡、常量大小写互转;同时支持 JSON Key 批处理。</p>
        </div>
        <div class="panel">
          <div class="panel-title">单字符串转换</div>
          <div class="field">
            <input class="input mono" id="csin" value="user_profile_name" />
            <div class="btn-row">
              <button class="btn" data-act="to-camel">camelCase</button>
              <button class="btn" data-act="to-pascal">PascalCase</button>
              <button class="btn" data-act="to-snake">snake_case</button>
              <button class="btn" data-act="to-kebab">kebab-case</button>
              <button class="btn" data-act="to-const">CONST_CASE</button>
            </div>
          </div>
          <div class="field" style="margin-top:12px;">
            <label class="field-label">转换结果</label>
            <input class="input mono" id="csout" />
            <div class="btn-row">
              <button class="btn btn-primary" data-act="copy-str">复制</button>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-title">JSON Key 批处理</div>
          <div class="row">
            <div>
              <div class="field-label">输入 JSON</div>
              <textarea class="textarea mono" id="jcsin" style="min-height:200px;">{"userName":"wake","userProfile":{"ageRange":[1,2],"isActive":true,"createdAt":"2024-01-01"}}</textarea>
            </div>
            <div>
              <div class="field-label">目标风格</div>
              <div class="btn-row" style="margin-bottom:8px;">
                <button class="btn" data-act="jk-camel">camelCase</button>
                <button class="btn" data-act="jk-snake">snake_case</button>
                <button class="btn" data-act="jk-pascal">PascalCase</button>
                <button class="btn" data-act="jk-kebab">kebab-case</button>
              </div>
              <div class="field-label">结果</div>
              <textarea class="textarea mono" id="jcsout" style="min-height:200px;"></textarea>
            </div>
          </div>
        </div>
      `,
      bind(root) {
        const $csin = root.querySelector('#csin');
        const $csout = root.querySelector('#csout');
        const toWords = (s) => s
          .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
          .replace(/[_\-\s]+/g, ' ')
          .trim().toLowerCase().split(/\s+/).filter(Boolean);
        const join = (words, sep, capitalize) => words.map((w, i) => {
          const c = w[0].toUpperCase() + w.slice(1);
          return (capitalize || i > 0) ? c : w;
        });
        const map = {
          camel: w => join(w, '', false).join(''),
          pascal: w => join(w, '', true).join(''),
          snake: w => w.join('_'),
          kebab: w => w.join('-'),
          const: w => w.join('_').toUpperCase(),
        };
        const convert = (s, type) => (map[type] || (() => s))(toWords(s));
        const $jcsin = root.querySelector('#jcsin');
        const $jcsout = root.querySelector('#jcsout');
        const jkMap = (type) => {
          try {
            const obj = JSON.parse($jcsin.value);
            const walk = (v) => {
              if (Array.isArray(v)) return v.map(walk);
              if (v && typeof v === 'object') {
                const out = {};
                for (const k of Object.keys(v)) out[convert(k, type)] = walk(v[k]);
                return out;
              }
              return v;
            };
            $jcsout.value = JSON.stringify(walk(obj), null, 2);
            toast('已转换为 ' + type);
          } catch (e) { toast('JSON 解析失败:' + e.message); }
        };
        root.addEventListener('click', e => {
          const a = e.target.dataset.act;
          if (!a) return;
          if (a.startsWith('to-')) {
            const type = a.slice(3);
            $csout.value = convert($csin.value, type);
          } else if (a === 'copy-str') copyTextWithBtn($csout.value, e.target);
          else if (a.startsWith('jk-')) jkMap(a.slice(3));
        });
      }
    };
  },

  /* ---------- 文本去重 / 排序 ---------- */
  textutil() {
    return {
      view: () => `
        <div class="tool-header">
          <h1 class="tool-title">文本去重 / 排序</h1>
          <p class="tool-desc">按行处理。支持去重、排序、统计行数与字符数。</p>
        </div>
        <div class="row">
          <div class="panel">
            <div class="panel-title">输入</div>
            <textarea class="textarea mono" id="tuin" style="min-height:240px;">banana
apple
banana
cherry
apple
date</textarea>
            <div class="btn-row">
              <button class="btn btn-primary" data-act="dedup">去重</button>
              <button class="btn" data-act="sort-az">A→Z 排序</button>
              <button class="btn" data-act="sort-za">Z→A 排序</button>
              <button class="btn" data-act="shuffle">随机</button>
              <button class="btn" data-act="rev">反序</button>
              <button class="btn" data-act="clear">清空</button>
            </div>
          </div>
          <div class="panel">
            <div class="panel-title">结果</div>
            <textarea class="textarea mono" id="tuout" style="min-height:240px;"></textarea>
            <div class="stats" id="tustats"></div>
            <div class="btn-row">
              <button class="btn" data-act="copy">复制</button>
            </div>
          </div>
        </div>
      `,
      bind(root) {
        const $i = root.querySelector('#tuin');
        const $o = root.querySelector('#tuout');
        const $s = root.querySelector('#tustats');
        const render = (lines) => {
          $o.value = lines.join('\n');
          const dedup = new Set(lines).size;
          $s.innerHTML = `
            <div class="stat"><div class="stat-label">总行数</div><div class="stat-value">${lines.length}</div></div>
            <div class="stat"><div class="stat-label">去重行数</div><div class="stat-value">${dedup}</div></div>
            <div class="stat"><div class="stat-label">字符数</div><div class="stat-value">${$o.value.length}</div></div>
          `;
        };
        const lines = () => $i.value.split('\n');
        root.addEventListener('click', e => {
          const a = e.target.dataset.act;
          const ls = lines();
          if (a === 'dedup') render([...new Set(ls)]);
          else if (a === 'sort-az') render([...ls].sort());
          else if (a === 'sort-za') render([...ls].sort().reverse());
          else if (a === 'shuffle') {
            const arr = [...ls];
            for (let i = arr.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            render(arr);
          } else if (a === 'rev') render(ls.reverse());
          else if (a === 'clear') { $i.value = ''; $o.value = ''; $s.innerHTML = ''; }
          else if (a === 'copy') copyTextWithBtn($o.value, e.target);
        });
      }
    };
  },

  /* ---------- Diff ---------- */
  diff() {
    // 简易 LCS diff
    const compute = (a, b) => {
      const al = a.split('\n'), bl = b.split('\n');
      const m = al.length, n = bl.length;
      const dp = Array.from({ length: m + 1 }, () => new Uint32Array(n + 1));
      for (let i = 1; i <= m; i++)
        for (let j = 1; j <= n; j++)
          dp[i][j] = al[i-1] === bl[j-1] ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1]);
      const out = [];
      let i = m, j = n;
      while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && al[i-1] === bl[j-1]) { out.unshift({ t: 'same', v: al[i-1] }); i--; j--; }
        else if (j > 0 && (i === 0 || dp[i][j-1] >= dp[i-1][j])) { out.unshift({ t: 'add', v: bl[j-1] }); j--; }
        else { out.unshift({ t: 'del', v: al[i-1] }); i--; }
      }
      return out;
    };
    return {
      view: () => `
        <div class="tool-header">
          <h1 class="tool-title">文本 Diff</h1>
          <p class="tool-desc">逐行比较两段文本的差异(基于 LCS)。</p>
        </div>
        <div class="diff-container">
          <textarea class="textarea mono" id="da" style="min-height:240px;">function hello() {
  console.log("hello");
  return 1;
}</textarea>
          <textarea class="textarea mono" id="db" style="min-height:240px;">function hello(name) {
  console.log("hello, " + name);
  return 0;
}</textarea>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" data-act="diff">比较</button>
          <button class="btn" data-act="swap">↕ 交换</button>
          <button class="btn" data-act="clear">清空</button>
        </div>
        <div class="panel" style="margin-top:16px;">
          <div class="panel-title">差异</div>
          <div class="diff-pane" id="dout"></div>
        </div>
      `,
      bind(root) {
        const render = (res) => {
          const html = res.map(r => {
            const cls = r.t === 'add' ? 'add' : r.t === 'del' ? 'del' : 'same';
            const prefix = r.t === 'add' ? '+ ' : r.t === 'del' ? '- ' : '  ';
            return `<div class="diff-line ${cls}">${prefix}${escapeHtml(r.v) || ' '}</div>`;
          }).join('');
          root.querySelector('#dout').innerHTML = html || '<div class="diff-line same">没有差异</div>';
        };
        root.addEventListener('click', e => {
          const a = e.target.dataset.act;
          if (a === 'diff') render(compute(root.querySelector('#da').value, root.querySelector('#db').value));
          else if (a === 'swap') {
            const da = root.querySelector('#da'), db = root.querySelector('#db');
            [da.value, db.value] = [db.value, da.value];
          } else if (a === 'clear') { root.querySelector('#da').value = ''; root.querySelector('#db').value = ''; root.querySelector('#dout').innerHTML = ''; }
        });
      }
    };
  },

  /* ---------- 正则测试 ---------- */
  regex() {
    return {
      view: () => `
        <div class="tool-header">
          <h1 class="tool-title">正则测试</h1>
          <p class="tool-desc">实时高亮匹配项,支持捕获组。包含中文需要加 <code>/u</code> 标志。</p>
        </div>
        <div class="panel">
          <div class="field">
            <label class="field-label">正则表达式</label>
            <input class="input mono" id="rpat" value="(\\d{4})-(\\d{2})-(\\d{2})" />
          </div>
          <div class="row-3">
            <div class="field">
              <label class="field-label">标志</label>
              <input class="input mono" id="rflag" value="g" />
            </div>
            <div class="field">
              <label class="field-label">匹配数</label>
              <div class="output" id="rcount">0</div>
            </div>
            <div class="field" style="display:flex;align-items:flex-end;">
              <label class="switch">
                <input type="checkbox" id="rinsensitive" />
                <span class="switch-track"></span>
                <span class="switch-label">不区分大小写</span>
              </label>
            </div>
          </div>
        </div>
        <div class="panel">
          <div class="panel-title">测试文本</div>
          <textarea class="textarea mono" id="rtxt" style="min-height:160px;">记录:
2024-01-15 项目启动
2024-03-20 完成 MVP
2025-12-31 上线计划
时间:2026-06-05</textarea>
          <div class="btn-row">
            <button class="btn" data-act="clear">清空</button>
          </div>
        </div>
        <div class="panel">
          <div class="panel-title">高亮结果</div>
          <div class="output" id="rhil" style="min-height:80px;white-space:pre-wrap;"></div>
          <div class="panel-title" style="margin-top:16px;">捕获组</div>
          <div class="output" id="rgroups" style="min-height:60px;"></div>
        </div>
      `,
      bind(root) {
        const update = () => {
          const pat = root.querySelector('#rpat').value;
          const flag = root.querySelector('#rflag').value + (root.querySelector('#rinsensitive').checked ? 'i' : '');
          const txt = root.querySelector('#rtxt').value;
          try {
            const re = new RegExp(pat, flag);
            const matches = [...txt.matchAll(re)];
            root.querySelector('#rcount').textContent = matches.length;
            const hil = txt.replace(re, m => `[[${m}]]`);
            root.querySelector('#rhil').innerHTML = escapeHtml(hil).replace(/\[\[(.+?)\]\]/g, '<mark style="background:#ffe58f;color:#000;padding:0 2px;border-radius:2px;">$1</mark>');
            const groups = matches.map((m, idx) =>
              `#${idx+1}: ${escapeHtml(m[0])}\n` +
              m.slice(1).map((g, i) => `   group[${i+1}]: ${escapeHtml(g || '(空)')}`).join('\n')
            ).join('\n');
            root.querySelector('#rgroups').textContent = groups || '- 无匹配 -';
          } catch (e) {
            root.querySelector('#rcount').textContent = '×';
            root.querySelector('#rhil').innerHTML = `<span style="color:var(--danger)">正则错误:${escapeHtml(e.message)}</span>`;
            root.querySelector('#rgroups').textContent = '-';
          }
        };
        ['rpat','rflag','rtxt','rinsensitive'].forEach(id => {
          root.querySelector('#' + id).addEventListener('input', update);
        });
        root.addEventListener('click', e => {
          if (e.target.dataset.act === 'clear') { root.querySelector('#rtxt').value = ''; update(); }
        });
        update();
      }
    };
  },

  /* ---------- String (字符串工具合集) ---------- */
  string() {
    return {
      view: () => `
        <div class="tool-header">
          <h1 class="tool-title">字符串工具</h1>
          <p class="tool-desc">常用字符串操作集合:长度统计、反转、重复、填充、替换、大小写。所有结果实时计算。</p>
        </div>

        <div class="panel">
          <div class="panel-title">输入</div>
          <textarea class="textarea mono" id="stin" style="min-height:100px;">Hello, 世界!👋🌏</textarea>
        </div>

        <div class="panel">
          <div class="panel-title">长度统计</div>
          <div class="stats" id="st-stats"></div>
        </div>

        <div class="row">
          <div class="panel">
            <div class="panel-title">反转</div>
            <div class="field">
              <label class="switch">
                <input type="checkbox" id="st-rev-bytes" />
                <span class="switch-track"></span>
                <span class="switch-label">按字节反转(UTF-8,可能乱码)</span>
              </label>
            </div>
            <div class="output mono" id="st-rev">-</div>
            <div class="btn-row">
              <button class="btn" data-act="copy-rev">复制</button>
            </div>
          </div>

          <div class="panel">
            <div class="panel-title">重复</div>
            <div class="row-3">
              <div class="field">
                <label class="field-label">次数 N</label>
                <input class="input" type="number" id="st-rep-n" value="3" min="0" max="1000" />
              </div>
              <div class="field" style="display:flex;align-items:flex-end;">
                <label class="switch">
                  <input type="checkbox" id="st-rep-sep" />
                  <span class="switch-track"></span>
                  <span class="switch-label">换行分隔</span>
                </label>
              </div>
            </div>
            <div class="output mono" id="st-rep" style="min-height:60px;">-</div>
            <div class="btn-row">
              <button class="btn" data-act="copy-rep">复制</button>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="panel">
            <div class="panel-title">填充(padStart / padEnd)</div>
            <div class="row-3">
              <div class="field">
                <label class="field-label">目标长度</label>
                <input class="input" type="number" id="st-pad-len" value="20" min="0" max="100000" />
              </div>
              <div class="field">
                <label class="field-label">填充字符</label>
                <input class="input mono" id="st-pad-ch" value=" " maxlength="10" />
              </div>
              <div class="field">
                <label class="field-label">方向</label>
                <select class="select" id="st-pad-dir">
                  <option value="end" selected>右填充 padEnd</option>
                  <option value="start">左填充 padStart</option>
                </select>
              </div>
            </div>
            <div class="output mono" id="st-pad">-</div>
            <div class="btn-row">
              <button class="btn" data-act="copy-pad">复制</button>
            </div>
          </div>

          <div class="panel">
            <div class="panel-title">替换(replaceAll)</div>
            <div class="field">
              <label class="field-label">查找</label>
              <input class="input mono" id="st-rep-find" value="world" placeholder="要查找的子串..." />
            </div>
            <div class="field">
              <label class="field-label">替换为</label>
              <input class="input mono" id="st-rep-with" value="Wake" placeholder="替换成..." />
            </div>
            <div class="field">
              <label class="switch">
                <input type="checkbox" id="st-rep-regex" />
                <span class="switch-track"></span>
                <span class="switch-label">正则模式(含捕获组 <code>$1 $2</code>)</span>
              </label>
            </div>
            <div class="field">
              <label class="switch">
                <input type="checkbox" id="st-rep-icase" />
                <span class="switch-track"></span>
                <span class="switch-label">忽略大小写</span>
              </label>
            </div>
            <div class="output mono" id="st-replace">-</div>
            <div class="btn-row">
              <button class="btn" data-act="copy-replace">复制</button>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-title">大小写转换</div>
          <div class="row-3">
            <div class="field" style="grid-column:1 / -1;">
              <label class="field-label">UPPER · 全部大写</label>
              <input class="input mono" id="st-case-upper" readonly />
            </div>
            <div class="field" style="grid-column:1 / -1;">
              <label class="field-label">lower · 全部小写</label>
              <input class="input mono" id="st-case-lower" readonly />
            </div>
            <div class="field">
              <label class="field-label">Sentence · 句首大写</label>
              <input class="input mono" id="st-case-sent" readonly />
            </div>
            <div class="field">
              <label class="field-label">Capitalize · 首字母大写</label>
              <input class="input mono" id="st-case-cap" readonly />
            </div>
            <div class="field" style="grid-column:1 / -1;">
              <label class="field-label">Title Case · 每个单词首字母大写</label>
              <input class="input mono" id="st-case-title" readonly />
            </div>
          </div>
          <div class="btn-row">
            <button class="btn" data-act="copy-upper">复制 UPPER</button>
            <button class="btn" data-act="copy-lower">复制 lower</button>
            <button class="btn" data-act="copy-sent">复制 Sentence</button>
            <button class="btn" data-act="copy-cap">复制 Capitalize</button>
            <button class="btn" data-act="copy-title">复制 Title</button>
          </div>
        </div>
      `,
      bind(root) {
        const $i = root.querySelector('#stin');

        // 长度统计
        const $stats = root.querySelector('#st-stats');
        const updateStats = () => {
          const s = $i.value;
          const bytes = new TextEncoder().encode(s).length;
          const codePoints = [...s].length;
          const lines = s === '' ? 0 : s.split('\n').length;
          const words = (s.trim().match(/\S+/g) || []).length;
          const whites = (s.match(/\s/g) || []).length;
          $stats.innerHTML = `
            <div class="stat"><div class="stat-label">字符数(length)</div><div class="stat-value">${s.length}</div></div>
            <div class="stat"><div class="stat-label">码点数(Unicode)</div><div class="stat-value">${codePoints}</div></div>
            <div class="stat"><div class="stat-label">字节数(UTF-8)</div><div class="stat-value">${bytes}</div></div>
            <div class="stat"><div class="stat-label">行数</div><div class="stat-value">${lines}</div></div>
            <div class="stat"><div class="stat-label">单词数</div><div class="stat-value">${words}</div></div>
            <div class="stat"><div class="stat-label">空白字符</div><div class="stat-value">${whites}</div></div>
          `;
        };

        // 反转
        const $revBytes = root.querySelector('#st-rev-bytes');
        const $rev = root.querySelector('#st-rev');
        const updateRev = () => {
          const s = $i.value;
          if (s === '') { $rev.textContent = '-'; return; }
          if ($revBytes.checked) {
            // 按字节反转:拿到 UTF-8 字节数组,反转,再用 fatal:false 解码
            const bytes = new TextEncoder().encode(s);
            $rev.textContent = new TextDecoder('utf-8', { fatal: false }).decode(bytes.reverse());
          } else {
            // 按 Unicode 码点反转,正确处理 emoji / surrogate pair
            $rev.textContent = [...s].reverse().join('');
          }
        };

        // 重复
        const $repN = root.querySelector('#st-rep-n');
        const $repSep = root.querySelector('#st-rep-sep');
        const $rep = root.querySelector('#st-rep');
        const updateRep = () => {
          const n = Math.min(1000, Math.max(0, parseInt($repN.value, 10) || 0));
          const s = $i.value;
          if (s === '' || n === 0) { $rep.textContent = '-'; return; }
          $rep.textContent = $repSep.checked ? Array(n).fill(s).join('\n') : s.repeat(n);
        };

        // 填充
        const $padLen = root.querySelector('#st-pad-len');
        const $padCh = root.querySelector('#st-pad-ch');
        const $padDir = root.querySelector('#st-pad-dir');
        const $pad = root.querySelector('#st-pad');
        const updatePad = () => {
          const s = $i.value;
          const len = Math.min(100000, Math.max(0, parseInt($padLen.value, 10) || 0));
          const ch = $padCh.value || ' ';
          const dir = $padDir.value;
          $pad.textContent = s === '' ? '-' : (dir === 'start' ? s.padStart(len, ch) : s.padEnd(len, ch));
        };

        // 替换
        const $repFind = root.querySelector('#st-rep-find');
        const $repWith = root.querySelector('#st-rep-with');
        const $repRegex = root.querySelector('#st-rep-regex');
        const $repIcase = root.querySelector('#st-rep-icase');
        const $replace = root.querySelector('#st-rep');
        const updateReplace = () => {
          const s = $i.value;
          const find = $repFind.value;
          if (s === '') { $replace.textContent = '-'; return; }
          if (find === '') { $replace.textContent = s; return; }
          try {
            if ($repRegex.checked) {
              const flags = 'g' + ($repIcase.checked ? 'i' : '');
              const re = new RegExp(find, flags);
              $replace.textContent = s.replace(re, $repWith.value);
            } else if ($repIcase.checked) {
              // 大小写不敏感的非正则替换:手动实现
              const out = [];
              const lowerSrc = s.toLowerCase();
              const lowerFind = find.toLowerCase();
              let i = 0;
              while (i < s.length) {
                const idx = lowerSrc.indexOf(lowerFind, i);
                if (idx === -1) { out.push(s.slice(i)); break; }
                out.push(s.slice(i, idx));
                out.push($repWith.value);
                i = idx + find.length;
              }
              $replace.textContent = out.join('');
            } else {
              $replace.textContent = s.split(find).join($repWith.value);
            }
          } catch (e) {
            $replace.textContent = '正则错误:' + e.message;
          }
        };

        // 大小写
        const $upper = root.querySelector('#st-case-upper');
        const $lower = root.querySelector('#st-case-lower');
        const $sent = root.querySelector('#st-case-sent');
        const $cap = root.querySelector('#st-case-cap');
        const $title = root.querySelector('#st-case-title');
        const updateCase = () => {
          const s = $i.value;
          $upper.value = s.toUpperCase();
          $lower.value = s.toLowerCase();
          // 句首大写:首个字母字符大写,其余不变
          $sent.value = s.replace(/^(\s*)(\p{L})/u, (_, ws, ch) => ws + ch.toUpperCase());
          // 首字母大写:只第一个字符大写(不跳过空白)
          $cap.value = s.length ? s[0].toUpperCase() + s.slice(1) : '';
          // Title Case:每个单词的首字母大写(处理 Unicode 字母)
          $title.value = s.toLowerCase().replace(/(^|[\s\p{P}]+)(\p{L})/gu, (_, sep, ch) => sep + ch.toUpperCase());
        };

        // 统一调度:input 变化触发所有实时 panel 重算
        let timer;
        const onInput = () => {
          clearTimeout(timer);
          timer = setTimeout(() => {
            updateStats();
            updateRev();
            updateRep();
            updatePad();
            updateReplace();
            updateCase();
          }, 80);
        };
        $i.addEventListener('input', onInput);

        // 反向触发:填充/替换控件变化时只重算对应 panel
        $revBytes.addEventListener('change', updateRev);
        $repN.addEventListener('input', updateRep);
        $repSep.addEventListener('change', updateRep);
        $padLen.addEventListener('input', updatePad);
        $padCh.addEventListener('input', updatePad);
        $padDir.addEventListener('change', updatePad);
        $repFind.addEventListener('input', updateReplace);
        $repWith.addEventListener('input', updateReplace);
        $repRegex.addEventListener('change', updateReplace);
        $repIcase.addEventListener('change', updateReplace);

        // 复制按钮
        root.addEventListener('click', e => {
          const a = e.target.dataset.act;
          const map = {
            'copy-rev': $rev,
            'copy-rep': $rep,
            'copy-pad': $pad,
            'copy-replace': $replace,
            'copy-upper': $upper,
            'copy-lower': $lower,
            'copy-sent': $sent,
            'copy-cap': $cap,
            'copy-title': $title,
          };
          const target = map[a];
          if (target) copyTextWithBtn(target.value !== undefined ? target.value : target.textContent, e.target);
        });

        // 初始计算
        updateStats();
        updateRev();
        updateRep();
        updatePad();
        updateReplace();
        updateCase();
      }
    };
  },

  /* ---------- UUID ---------- */
  uuid() {
    const gen = () => {
      if (crypto.randomUUID) return crypto.randomUUID();
      const b = crypto.getRandomValues(new Uint8Array(16));
      b[6] = (b[6] & 0x0f) | 0x40;
      b[8] = (b[8] & 0x3f) | 0x80;
      const h = [...b].map(x => x.toString(16).padStart(2, '0'));
      return `${h.slice(0,4).join('')}-${h.slice(4,6).join('')}-${h.slice(6,8).join('')}-${h.slice(8,10).join('')}-${h.slice(10,16).join('')}`;
    };
    return {
      view: () => `
        <div class="tool-header">
          <h1 class="tool-title">UUID 生成</h1>
          <p class="tool-desc">基于 <code>crypto.randomUUID</code>,符合 RFC 4122 v4。</p>
        </div>
        <div class="panel">
          <div class="row-3">
            <div class="field">
              <label class="field-label">数量</label>
              <input class="input" type="number" id="unum" value="5" min="1" max="500" />
            </div>
            <div class="field">
              <label class="field-label">格式</label>
              <select class="select" id="uformat">
                <option value="std">标准 (含连字符)</option>
                <option value="plain">无连字符</option>
                <option value="upper">大写</option>
                <option value="brace">花括号包裹</option>
              </select>
            </div>
            <div class="field" style="display:flex;align-items:flex-end;">
              <button class="btn btn-primary" data-act="gen" style="width:100%;">生成</button>
            </div>
          </div>
        </div>
        <div class="panel">
          <div class="panel-title">结果</div>
          <textarea class="textarea mono" id="uout" style="min-height:280px;"></textarea>
          <div class="btn-row">
            <button class="btn" data-act="copy">复制全部</button>
            <button class="btn" data-act="clear">清空</button>
          </div>
        </div>
      `,
      bind(root) {
        const $o = root.querySelector('#uout');
        const render = () => {
          const n = Math.min(500, Math.max(1, +root.querySelector('#unum').value || 1));
          const fmt = root.querySelector('#uformat').value;
          const list = Array.from({ length: n }, () => {
            let u = gen();
            if (fmt === 'plain') u = u.replace(/-/g, '');
            else if (fmt === 'upper') u = u.toUpperCase();
            else if (fmt === 'brace') u = '{' + u + '}';
            return u;
          });
          $o.value = list.join('\n');
        };
        root.addEventListener('click', e => {
          const a = e.target.dataset.act;
          if (a === 'gen') render();
          else if (a === 'copy') copyTextWithBtn($o.value, e.target);
          else if (a === 'clear') $o.value = '';
        });
        render();
      }
    };
  },

  /* ---------- Password ---------- */
  password() {
    const SETS = {
      lower: { ch: 'abcdefghijklmnopqrstuvwxyz', label: '小写字母 a-z' },
      upper: { ch: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', label: '大写字母 A-Z' },
      digit: { ch: '0123456789', label: '数字 0-9' },
      sym:   { ch: '!@#$%^&*()-_=+[]{};:,.<>?/', label: '特殊符号' },
      noAmbiguous: { ch: 'Il1O0', label: '排除易混字符' },
    };
    return {
      view: () => `
        <div class="tool-header">
          <h1 class="tool-title">随机密码生成</h1>
          <p class="tool-desc">使用密码学安全随机数(crypto.getRandomValues)。</p>
        </div>
        <div class="row">
          <div class="panel">
            <div class="field">
              <label class="field-label">长度:<span id="pwl">16</span></label>
              <input class="input" type="range" id="pwlen" min="4" max="128" value="16" />
            </div>
            <div class="field">
              <label class="field-label">字符集</label>
              <div class="checkbox-list" id="pwcset">
                ${['lower','upper','digit','sym','noAmbiguous'].map(k => `
                  <label class="chip active" data-k="${k}">
                    <input type="checkbox" ${k === 'noAmbiguous' ? '' : 'checked'} />
                    ${SETS[k].label}
                  </label>
                `).join('')}
              </div>
            </div>
            <div class="field">
              <label class="switch">
                <input type="checkbox" id="pwrequire" checked />
                <span class="switch-track"></span>
                <span class="switch-label">每类至少 1 个</span>
              </label>
            </div>
            <div class="field">
              <label class="field-label">生成数量</label>
              <input class="input" type="number" id="pwnum" value="1" min="1" max="20" />
            </div>
            <div class="btn-row">
              <button class="btn btn-primary" data-act="gen">生成</button>
            </div>
          </div>
          <div class="panel">
            <div class="panel-title">结果</div>
            <textarea class="textarea mono" id="pwout" style="min-height:240px;"></textarea>
            <div class="field" style="margin-top:8px;">
              <span class="tag" id="pwstrength"></span>
            </div>
            <div class="btn-row">
              <button class="btn" data-act="copy">复制</button>
              <button class="btn" data-act="clear">清空</button>
            </div>
          </div>
        </div>
      `,
      bind(root) {
        const $l = root.querySelector('#pwl');
        const $len = root.querySelector('#pwlen');
        $len.addEventListener('input', () => $l.textContent = $len.value);
        const $o = root.querySelector('#pwout');
        const $strength = root.querySelector('#pwstrength');
        const getSets = () => {
          const chips = [...root.querySelectorAll('#pwcset .chip')];
          return chips.filter(c => {
            const checked = c.querySelector('input').checked;
            c.classList.toggle('active', checked);
            return checked;
          }).map(c => c.dataset.k);
        };
        const strength = (p) => {
          let s = 0;
          if (p.length >= 8) s++;
          if (p.length >= 12) s++;
          if (p.length >= 16) s++;
          if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++;
          if (/\d/.test(p)) s++;
          if (/[^a-zA-Z0-9]/.test(p)) s++;
          if (s <= 2) return ['弱', 'var(--danger)'];
          if (s <= 4) return ['中', 'var(--warning)'];
          return ['强', 'var(--success)'];
        };
        const genOne = (len, sets) => {
          const ambiguous = new Set(SETS.noAmbiguous.ch);
          const pools = sets.filter(s => s !== 'noAmbiguous').map(s => SETS[s].ch);
          const exclude = sets.includes('noAmbiguous');
          const all = pools.join('');
          const out = new Uint8Array(len);
          crypto.getRandomValues(out);
          let pw = '';
          for (let i = 0; i < len; i++) {
            let c;
            do { c = all[out[i] % all.length]; } while (exclude && ambiguous.has(c));
            pw += c;
          }
          // 保证每类至少一个
          if (root.querySelector('#pwrequire').checked) {
            const positions = new Uint8Array(pools.length);
            crypto.getRandomValues(positions);
            pools.forEach((pool, i) => {
              let c;
              do { c = pool[positions[i] % pool.length]; } while (exclude && ambiguous.has(c));
              const pos = positions[i] % len;
              pw = pw.slice(0, pos) + c + pw.slice(pos + 1);
            });
          }
          return pw;
        };
        const render = () => {
          const sets = getSets();
          if (sets.filter(s => s !== 'noAmbiguous').length === 0) { toast('至少选一个字符集'); return; }
          const n = Math.min(20, Math.max(1, +root.querySelector('#pwnum').value || 1));
          const len = +$len.value;
          const list = Array.from({ length: n }, () => genOne(len, sets));
          $o.value = list.join('\n');
          const [label, color] = strength(list[0] || '');
          $strength.textContent = '强度:' + label;
          $strength.style.background = color + '22';
          $strength.style.color = color;
        };
        root.addEventListener('click', e => {
          const a = e.target.dataset.act;
          if (a === 'gen') render();
          else if (a === 'copy') copyTextWithBtn($o.value, e.target);
          else if (a === 'clear') $o.value = '';
        });
        render();
      }
    };
  },

  /* ---------- Lorem ---------- */
  lorem() {
    const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure reprehenderit voluptate velit esse cillum dolore fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(' ');
    return {
      view: () => `
        <div class="tool-header">
          <h1 class="tool-title">Lorem Ipsum 生成</h1>
          <p class="tool-desc">生成占位文本,可指定段落数和每段句数。</p>
        </div>
        <div class="panel">
          <div class="row-3">
            <div class="field">
              <label class="field-label">段落数</label>
              <input class="input" type="number" id="lpar" value="3" min="1" max="20" />
            </div>
            <div class="field">
              <label class="field-label">每段句数</label>
              <input class="input" type="number" id="lsen" value="5" min="1" max="20" />
            </div>
            <div class="field" style="display:flex;align-items:flex-end;">
              <button class="btn btn-primary" data-act="gen" style="width:100%;">生成</button>
            </div>
          </div>
        </div>
        <div class="panel">
          <div class="panel-title">结果</div>
          <textarea class="textarea mono" id="lout" style="min-height:240px;"></textarea>
          <div class="btn-row">
            <button class="btn" data-act="copy">复制</button>
          </div>
        </div>
      `,
      bind(root) {
        const $o = root.querySelector('#lout');
        const sent = () => {
          const n = 6 + Math.floor(Math.random() * 10);
          const words = [];
          for (let i = 0; i < n; i++) words.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
          words[0] = words[0][0].toUpperCase() + words[0].slice(1);
          return words.join(' ') + '.';
        };
        const render = () => {
          const p = +root.querySelector('#lpar').value;
          const s = +root.querySelector('#lsen').value;
          const out = [];
          for (let i = 0; i < p; i++) {
            const para = [];
            for (let j = 0; j < s; j++) para.push(sent());
            out.push(para.join(' '));
          }
          $o.value = out.join('\n\n');
        };
        root.addEventListener('click', e => {
          const a = e.target.dataset.act;
          if (a === 'gen') render();
          else if (a === 'copy') copyTextWithBtn($o.value, e.target);
        });
        render();
      }
    };
  },

  /* ---------- Color ---------- */
  color() {
    const hex2rgb = (h) => {
      h = h.replace('#', '');
      if (h.length === 3) h = h.split('').map(c => c + c).join('');
      if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
      return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
    };
    const rgb2hex = ([r,g,b]) => '#' + [r,g,b].map(v => Math.round(v).toString(16).padStart(2,'0')).join('');
    const rgb2hsl = ([r,g,b]) => {
      r/=255; g/=255; b/=255;
      const max = Math.max(r,g,b), min = Math.min(r,g,b);
      let h, s, l = (max+min)/2;
      if (max === min) { h = s = 0; }
      else {
        const d = max - min;
        s = l > 0.5 ? d/(2-max-min) : d/(max+min);
        switch(max) {
          case r: h = (g-b)/d + (g<b?6:0); break;
          case g: h = (b-r)/d + 2; break;
          case b: h = (r-g)/d + 4; break;
        }
        h *= 60;
      }
      return [Math.round(h), Math.round(s*100), Math.round(l*100)];
    };
    const hsl2rgb = ([h,s,l]) => {
      s/=100; l/=100;
      const c = (1 - Math.abs(2*l - 1)) * s;
      const x = c * (1 - Math.abs((h/60) % 2 - 1));
      const m = l - c/2;
      let r=0,g=0,b=0;
      if (h < 60) [r,g,b] = [c,x,0];
      else if (h < 120) [r,g,b] = [x,c,0];
      else if (h < 180) [r,g,b] = [0,c,x];
      else if (h < 240) [r,g,b] = [0,x,c];
      else if (h < 300) [r,g,b] = [x,0,c];
      else [r,g,b] = [c,0,x];
      return [Math.round((r+m)*255), Math.round((g+m)*255), Math.round((b+m)*255)];
    };
    return {
      view: () => `
        <div class="tool-header">
          <h1 class="tool-title">颜色值转换</h1>
          <p class="tool-desc">HEX / RGB / HSL 互转,附带色板预览。</p>
        </div>
        <div class="panel">
          <div class="row-3">
            <div class="field">
              <label class="field-label">HEX</label>
              <div style="display:flex;gap:8px;">
                <input class="input mono" id="chex" value="#1677ff" style="flex:1;" />
                <div class="color-swatch" id="cswatch"></div>
              </div>
            </div>
            <div class="field">
              <label class="field-label">RGB</label>
              <input class="input mono" id="crgb" value="rgb(22, 119, 255)" />
            </div>
            <div class="field">
              <label class="field-label">HSL</label>
              <input class="input mono" id="chsl" value="hsl(217, 100%, 54%)" />
            </div>
          </div>
          <div class="btn-row">
            <button class="btn" data-act="random">随机颜色</button>
            <button class="btn" data-act="copy-hex">复制 HEX</button>
            <button class="btn" data-act="copy-rgb">复制 RGB</button>
            <button class="btn" data-act="copy-hsl">复制 HSL</button>
          </div>
        </div>
        <div class="panel">
          <div class="panel-title">色板</div>
          <div id="cpal" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:6px;"></div>
        </div>
      `,
      bind(root) {
        const $hex = root.querySelector('#chex');
        const $rgb = root.querySelector('#crgb');
        const $hsl = root.querySelector('#chsl');
        const $sw = root.querySelector('#cswatch');
        const PALETTE = [
          '#1677ff','#722ed1','#eb2f96','#f5222d','#fa8c16',
          '#faad14','#a0d911','#52c41a','#13c2c2','#1890ff',
          '#000000','#ffffff','#8c8c8c','#595959','#262626',
          '#ffc1cc','#b5ead7','#c7ceea','#ffdac1','#ff9aa2'
        ];
        const $pal = root.querySelector('#cpal');
        $pal.innerHTML = PALETTE.map(c => `<div class="ascii-cell" data-c="${c}" style="background:${c};color:${parseInt(c.slice(1),16) > 0xaaaaaa ? '#000' : '#fff'};">
          <div class="char" style="color:inherit;">${c.toUpperCase()}</div>
        </div>`).join('');
        const update = (rgb) => {
          if (!rgb || rgb.some(v => isNaN(v))) return;
          const hex = rgb2hex(rgb);
          const [h,s,l] = rgb2hsl(rgb);
          $hex.value = hex;
          $rgb.value = `rgb(${rgb.join(', ')})`;
          $hsl.value = `hsl(${h}, ${s}%, ${l}%)`;
          $sw.style.background = hex;
        };
        const fromHex = () => {
          const rgb = hex2rgb($hex.value);
          if (rgb) update(rgb); else toast('无效的 HEX');
        };
        const fromRgb = () => {
          const m = $rgb.value.match(/(\d+)\D+(\d+)\D+(\d+)/);
          if (m) update([+m[1], +m[2], +m[3]]); else toast('无效的 RGB');
        };
        const fromHsl = () => {
          const m = $hsl.value.match(/(\d+)\D+(\d+)%?\D+(\d+)%?/);
          if (m) update(hsl2rgb([+m[1], +m[2], +m[3]])); else toast('无效的 HSL');
        };
        $hex.addEventListener('change', fromHex);
        $rgb.addEventListener('change', fromRgb);
        $hsl.addEventListener('change', fromHsl);
        $pal.addEventListener('click', e => {
          const c = e.target.closest('[data-c]');
          if (c) { $hex.value = c.dataset.c; fromHex(); }
        });
        root.addEventListener('click', e => {
          const a = e.target.dataset.act;
          if (a === 'random') { $hex.value = '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6,'0'); fromHex(); }
          else if (a === 'copy-hex') copyTextWithBtn($hex.value, e.target);
          else if (a === 'copy-rgb') copyTextWithBtn($rgb.value, e.target);
          else if (a === 'copy-hsl') copyTextWithBtn($hsl.value, e.target);
        });
      }
    };
  },

  /* ---------- Radix ---------- */
  radix() {
    return {
      view: () => `
        <div class="tool-header">
          <h1 class="tool-title">进制转换</h1>
          <p class="tool-desc">2 ~ 36 进制互转,支持小数。</p>
        </div>
        <div class="panel">
          <div class="row-3">
            <div class="field" style="grid-column:1 / -1;">
              <label class="field-label">输入数字</label>
              <input class="input mono" id="rval" value="255" />
            </div>
            <div class="field">
              <label class="field-label">输入进制</label>
              <input class="input" type="number" id="rfrom" value="10" min="2" max="36" />
            </div>
            <div class="field">
              <label class="field-label">目标进制</label>
              <input class="input" type="number" id="rto" value="16" min="2" max="36" />
            </div>
            <div class="field" style="display:flex;align-items:flex-end;">
              <button class="btn btn-primary" data-act="conv" style="width:100%;">转换</button>
            </div>
          </div>
        </div>
        <div class="panel">
          <div class="panel-title">结果(自动展示 2/8/10/16)</div>
          <div class="output" id="rout"></div>
          <div class="btn-row">
            <button class="btn" data-act="copy">复制当前</button>
          </div>
        </div>
      `,
      bind(root) {
        const $v = root.querySelector('#rval');
        const $from = root.querySelector('#rfrom');
        const $to = root.querySelector('#rto');
        const $o = root.querySelector('#rout');
        const render = () => {
          const val = $v.value.trim();
          const f = +$from.value, t = +$to.value;
          if (!val) { $o.textContent = ''; return; }
          try {
            // 小数处理
            const [int, frac] = val.split('.');
            const decInt = parseInt(int || '0', f);
            if (isNaN(decInt)) throw new Error('无效输入');
            let decFrac = 0;
            if (frac) {
              decFrac = frac.split('').reduce((acc, c) => {
                const d = parseInt(c, f);
                if (isNaN(d)) throw new Error('无效字符');
                return acc * f + d;
              }, 0) / Math.pow(f, frac.length);
            }
            const dec = decInt + decFrac;
            const toBase = (n, b) => {
              if (n === 0) return '0';
              const digits = '0123456789abcdefghijklmnopqrstuvwxyz';
              let out = '';
              let v = Math.floor(n);
              while (v > 0) { out = digits[v % b] + out; v = Math.floor(v / b); }
              if (n !== Math.floor(n)) {
                let f = n - Math.floor(n);
                out += '.';
                for (let i = 0; i < 10 && f > 0; i++) {
                  f *= b;
                  out += digits[Math.floor(f)];
                  f -= Math.floor(f);
                }
              }
              return out;
            };
            const lines = [
              `BIN (2):  ${toBase(dec, 2)}`,
              `OCT (8):  ${toBase(dec, 8)}`,
              `DEC (10): ${toBase(dec, 10)}`,
              `HEX (16): ${toBase(dec, 16)}`,
              '',
              `目标 (${t}): ${toBase(dec, t)}`,
            ];
            $o.textContent = lines.join('\n');
          } catch (e) { $o.textContent = '错误:' + e.message; }
        };
        $v.addEventListener('input', render);
        $from.addEventListener('input', render);
        $to.addEventListener('input', render);
        root.addEventListener('click', e => {
          if (e.target.dataset.act === 'copy') copyTextWithBtn($o.textContent, e.target);
        });
        render();
      }
    };
  },

  /* ---------- Cron ---------- */
  cron() {
    // 计算下次执行
    const next = (expr, count = 5) => {
      const parts = expr.trim().split(/\s+/);
      if (parts.length !== 5 && parts.length !== 6) throw new Error('需要 5 或 6 段(分 时 日 月 周 [年])');
      const [m, h, d, mo, w] = parts;
      const results = [];
      let t = new Date();
      t.setSeconds(0, 0);
      t.setMinutes(t.getMinutes() + 1);
      let safety = 0;
      while (results.length < count && safety < 366 * 24 * 60 * 5) {
        safety++;
        const mm = t.getMinutes(), hh = t.getHours(), dd = t.getDate(), mmm = t.getMonth() + 1, ww = t.getDay();
        if (match(m, mm) && match(h, hh) && match(d, dd) && match(mo, mmm) && match(w, ww)) {
          results.push(new Date(t));
        }
        t.setMinutes(t.getMinutes() + 1);
      }
      return results;
    };
    const match = (field, v) => {
      if (field === '*') return true;
      for (const seg of field.split(',')) {
        const [_, step = 1] = seg.split('/');
        if (seg === '*') return true;
        if (seg.includes('-')) {
          const [a, b] = seg.split('-');
          if (v >= +a && v <= +b) return true;
        } else if (seg.includes('/')) {
          const base = seg.split('/')[0];
          if (base === '*') return v % step === 0;
          if (v >= +base && (v - +base) % step === 0) return true;
        } else if (+seg === v) return true;
      }
      return false;
    };
    return {
      view: () => `
        <div class="tool-header">
          <h1 class="tool-title">Cron 表达式解析</h1>
          <p class="tool-desc">展示未来 5 次执行时间。支持 5 段(标准)和 6 段(含年)。</p>
        </div>
        <div class="panel">
          <div class="field">
            <label class="field-label">Cron 表达式</label>
            <input class="input mono" id="cexp" value="*/5 * * * *" />
          </div>
          <div class="field">
            <label class="field-label">说明</label>
            <div id="cexpdesc" class="output">-</div>
          </div>
          <div class="btn-row">
            <button class="btn" data-act="preset1">每分钟</button>
            <button class="btn" data-act="preset2">每 5 分钟</button>
            <button class="btn" data-act="preset3">每小时</button>
            <button class="btn" data-act="preset4">每天 0 点</button>
            <button class="btn" data-act="preset5">每周一 9 点</button>
            <button class="btn" data-act="preset6">每月 1 号</button>
          </div>
        </div>
        <div class="panel">
          <div class="panel-title">未来 5 次执行</div>
          <div id="cnext" class="output" style="min-height:160px;">-</div>
        </div>
      `,
      bind(root) {
        const $e = root.querySelector('#cexp');
        const $d = root.querySelector('#cexpdesc');
        const $n = root.querySelector('#cnext');
        const DESCS = [
          { p: ['*/5 * * * *', '每 5 分钟'] },
        ];
        const descFor = (e) => {
          const presets = {
            '* * * * *': '每分钟',
            '*/5 * * * *': '每 5 分钟',
            '0 * * * *': '每小时',
            '0 0 * * *': '每天 0 点',
            '0 9 * * 1': '每周一 9 点',
            '0 0 1 * *': '每月 1 号 0 点',
          };
          return presets[e] || '自定义表达式';
        };
        const render = () => {
          $d.textContent = descFor($e.value.trim());
          try {
            const list = next($e.value, 5);
            $n.textContent = list.length
              ? list.map((d, i) => `#${i+1}  ${formatDate(d, 'YYYY-MM-DD HH:mm')}  (${['日','一','二','三','四','五','六'][d.getDay()]})`).join('\n')
              : '- 未匹配到执行时间 -';
          } catch (e) { $n.textContent = '错误:' + e.message; }
        };
        $e.addEventListener('input', render);
        root.addEventListener('click', e => {
          const a = e.target.dataset.act;
          const presets = {
            preset1: '* * * * *',
            preset2: '*/5 * * * *',
            preset3: '0 * * * *',
            preset4: '0 0 * * *',
            preset5: '0 9 * * 1',
            preset6: '0 0 1 * *',
          };
          if (presets[a]) { $e.value = presets[a]; render(); }
        });
        render();
      }
    };
  },

  /* ---------- ASCII ---------- */
  ascii() {
    return {
      view: () => `
        <div class="tool-header">
          <h1 class="tool-title">ASCII / Unicode 表</h1>
          <p class="tool-desc">点击单元格复制字符。</p>
        </div>
        <div class="panel">
          <div class="field">
            <label class="field-label">字符 → 编码</label>
            <input class="input" id="achar" placeholder="输入字符..." maxlength="10" />
          </div>
          <div class="output" id="ainfo">-</div>
        </div>
        <div class="panel">
          <div class="panel-title">ASCII (32-126)</div>
          <div class="ascii-grid" id="aascii"></div>
        </div>
        <div class="panel">
          <div class="panel-title">中文 Unicode 常用区 (0x4E00-0x4EFF)</div>
          <div class="ascii-grid" id="acjk" style="max-height:300px;"></div>
        </div>
      `,
      bind(root) {
        const render = () => {
          const ch = root.querySelector('#achar').value;
          if (!ch) { root.querySelector('#ainfo').textContent = '-'; return; }
          const list = [...ch].map(c => {
            const code = c.codePointAt(0);
            return `${escapeHtml(c)}  →  U+${code.toString(16).toUpperCase().padStart(4,'0')}  (${code})  UTF-8: ${[...new TextEncoder().encode(c)].map(b => b.toString(16).padStart(2,'0')).join(' ')}`;
          });
          root.querySelector('#ainfo').textContent = list.join('\n');
        };
        root.querySelector('#achar').addEventListener('input', render);
        const cell = (ch, code) => `<div class="ascii-cell" data-ch="${escapeAttr(ch)}">
          <div class="char">${escapeHtml(ch)}</div>
          <div class="code">${code > 0xFF ? 'U+' + code.toString(16).toUpperCase().padStart(4,'0') : code}</div>
        </div>`;
        const a = root.querySelector('#aascii');
        for (let i = 32; i <= 126; i++) a.insertAdjacentHTML('beforeend', cell(String.fromCharCode(i), i));
        const c = root.querySelector('#acjk');
        for (let i = 0x4E00; i <= 0x4EFF; i++) c.insertAdjacentHTML('beforeend', cell(String.fromCodePoint(i), i));
        document.addEventListener('click', e => {
          const t = e.target.closest('.ascii-cell');
          if (t) { copyText(t.dataset.ch); toast('已复制:' + t.dataset.ch); }
        });
        render();
      }
    };
  },

  /* ---------- JWT 解码 ---------- */
  jwt() {
    const b64urlDecode = (s) => {
      s = s.replace(/-/g, '+').replace(/_/g, '/');
      while (s.length % 4) s += '=';
      return decodeURIComponent(escape(atob(s)));
    };
    return {
      view: () => `
        <div class="tool-header">
          <h1 class="tool-title">JWT 解码</h1>
          <p class="tool-desc">解析 JWT 的 Header / Payload / Signature。本工具<strong>不验签</strong>,仅做结构展示。</p>
        </div>
        <div class="panel">
          <div class="panel-title">JWT Token</div>
          <textarea class="textarea mono" id="jwin" style="min-height:120px;">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkrDgWlod-S4reaWh-aVsCIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</textarea>
          <div class="btn-row">
            <button class="btn btn-primary" data-act="dec">解码</button>
            <button class="btn" data-act="sample">示例</button>
            <button class="btn" data-act="clear">清空</button>
          </div>
        </div>
        <div class="row-3">
          <div class="panel">
            <div class="panel-title">Header</div>
            <div class="output" id="jwh">-</div>
          </div>
          <div class="panel">
            <div class="panel-title">Payload</div>
            <div class="output" id="jwp">-</div>
          </div>
          <div class="panel">
            <div class="panel-title">Signature</div>
            <div class="output" id="jws">-</div>
          </div>
        </div>
      `,
      bind(root) {
        const $i = root.querySelector('#jwin');
        const dec = () => {
          const parts = $i.value.trim().split('.');
          if (parts.length !== 3) { toast('JWT 格式错误(需要 header.payload.signature 三段)'); return; }
          try {
            const h = JSON.parse(b64urlDecode(parts[0]));
            const p = JSON.parse(b64urlDecode(parts[1]));
            root.querySelector('#jwh').textContent = JSON.stringify(h, null, 2);
            root.querySelector('#jwp').textContent = JSON.stringify(p, null, 2);
            root.querySelector('#jws').textContent = parts[2];
            toast('已解码');
          } catch (e) { toast('解码失败:' + e.message); }
        };
        root.addEventListener('click', e => {
          const a = e.target.dataset.act;
          if (a === 'dec') dec();
          else if (a === 'clear') {
            $i.value = ''; root.querySelector('#jwh').textContent = '-';
            root.querySelector('#jwp').textContent = '-'; root.querySelector('#jws').textContent = '-';
          }
        });
        dec();
      }
    };
  },

  /* ---------- Hash 生成 ---------- */
  hash() {
    // MD5 (Joseph Myers, MIT) - 简化内嵌版
    const MD5 = (str) => {
      const enc = new TextEncoder();
      const bytes = enc.encode(str);
      const n = bytes.length;
      const x = new Uint32Array((((n + 8) >>> 6) + 1) << 4);
      for (let i = 0; i < n; i++) x[i >> 2] |= bytes[i] << ((i % 4) << 3);
      x[n >> 2] |= 0x80 << ((n % 4) << 3);
      x[x.length - 2] = n * 8;
      const addUnsigned = (x, y) => {
        const lsw = (x & 0xFFFF) + (y & 0xFFFF);
        const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
      };
      const F = (x, y, z) => (x & y) | (~x & z);
      const G = (x, y, z) => (x & z) | (y & ~z);
      const H = (x, y, z) => x ^ y ^ z;
      const I = (x, y, z) => y ^ (x | ~z);
      const FF = (a, b, c, d, x, s, t) => addUnsigned((a = addUnsigned(addUnsigned(a, F(b, c, d)), addUnsigned(x, t))) << s | a >>> (32 - s), b);
      const GG = (a, b, c, d, x, s, t) => addUnsigned((a = addUnsigned(addUnsigned(a, G(b, c, d)), addUnsigned(x, t))) << s | a >>> (32 - s), b);
      const HH = (a, b, c, d, x, s, t) => addUnsigned((a = addUnsigned(addUnsigned(a, H(b, c, d)), addUnsigned(x, t))) << s | a >>> (32 - s), b);
      const II = (a, b, c, d, x, s, t) => addUnsigned((a = addUnsigned(addUnsigned(a, I(b, c, d)), addUnsigned(x, t))) << s | a >>> (32 - s), b);
      let a = 0x67452301, b = 0xEFCDAB89, c = 0x98BADCFE, d = 0x10325476;
      for (let i = 0; i < x.length; i += 16) {
        const oa = a, ob = b, oc = c, od = d;
        a = FF(a, b, c, d, x[i], 7, -680876936);
        d = FF(d, a, b, c, x[i + 1], 12, -389564586);
        c = FF(c, d, a, b, x[i + 2], 17, 606105819);
        b = FF(b, c, d, a, x[i + 3], 22, -1044525330);
        a = FF(a, b, c, d, x[i + 4], 7, -176418897);
        d = FF(d, a, b, c, x[i + 5], 12, 1200080426);
        c = FF(c, d, a, b, x[i + 6], 17, -1473231341);
        b = FF(b, c, d, a, x[i + 7], 22, -45705983);
        a = FF(a, b, c, d, x[i + 8], 7, 1770035416);
        d = FF(d, a, b, c, x[i + 9], 12, -1958414417);
        c = FF(c, d, a, b, x[i + 10], 17, -42063);
        b = FF(b, c, d, a, x[i + 11], 22, -1990404162);
        a = FF(a, b, c, d, x[i + 12], 7, 1804603682);
        d = FF(d, a, b, c, x[i + 13], 12, -40341101);
        c = FF(c, d, a, b, x[i + 14], 17, -1502002290);
        b = FF(b, c, d, a, x[i + 15], 22, 1236535329);
        a = GG(a, b, c, d, x[i + 1], 5, -165796510);
        d = GG(d, a, b, c, x[i + 6], 9, -1069501632);
        c = GG(c, d, a, b, x[i + 11], 14, 643717713);
        b = GG(b, c, d, a, x[i], 20, -373897302);
        a = GG(a, b, c, d, x[i + 5], 5, -701558691);
        d = GG(d, a, b, c, x[i + 10], 9, 38016083);
        c = GG(c, d, a, b, x[i + 15], 14, -660478335);
        b = GG(b, c, d, a, x[i + 4], 20, -405537848);
        a = GG(a, b, c, d, x[i + 9], 5, 568446438);
        d = GG(d, a, b, c, x[i + 14], 9, -1019803690);
        c = GG(c, d, a, b, x[i + 3], 14, -187363961);
        b = GG(b, c, d, a, x[i + 8], 20, 1163531501);
        a = GG(a, b, c, d, x[i + 13], 5, -1444681467);
        d = GG(d, a, b, c, x[i + 2], 9, -51403784);
        c = GG(c, d, a, b, x[i + 7], 14, 1735328473);
        b = GG(b, c, d, a, x[i + 12], 20, -1926607734);
        a = HH(a, b, c, d, x[i + 5], 4, -378558);
        d = HH(d, a, b, c, x[i + 8], 11, -2022574463);
        c = HH(c, d, a, b, x[i + 11], 16, 1839030562);
        b = HH(b, c, d, a, x[i + 14], 23, -35309556);
        a = HH(a, b, c, d, x[i + 1], 4, -1530992060);
        d = HH(d, a, b, c, x[i + 4], 11, 1272893353);
        c = HH(c, d, a, b, x[i + 7], 16, -155497632);
        b = HH(b, c, d, a, x[i + 10], 23, -1094730640);
        a = HH(a, b, c, d, x[i + 13], 4, 681279174);
        d = HH(d, a, b, c, x[i], 11, -358537222);
        c = HH(c, d, a, b, x[i + 3], 16, -722521979);
        b = HH(b, c, d, a, x[i + 6], 23, 76029189);
        a = HH(a, b, c, d, x[i + 9], 4, -640364487);
        d = HH(d, a, b, c, x[i + 12], 11, -421815835);
        c = HH(c, d, a, b, x[i + 15], 16, 530742520);
        b = HH(b, c, d, a, x[i + 2], 23, -995338651);
        a = II(a, b, c, d, x[i], 6, -198630844);
        d = II(d, a, b, c, x[i + 7], 10, 1126891415);
        c = II(c, d, a, b, x[i + 14], 15, -1416354905);
        b = II(b, c, d, a, x[i + 5], 21, -57434055);
        a = II(a, b, c, d, x[i + 12], 6, 1700485571);
        d = II(d, a, b, c, x[i + 3], 10, -1894986606);
        c = II(c, d, a, b, x[i + 10], 15, -1051523);
        b = II(b, c, d, a, x[i + 1], 21, -2054922799);
        a = II(a, b, c, d, x[i + 8], 6, 1873313359);
        d = II(d, a, b, c, x[i + 15], 10, -30611744);
        c = II(c, d, a, b, x[i + 6], 15, -1560198380);
        b = II(b, c, d, a, x[i + 13], 21, 1309151649);
        a = II(a, b, c, d, x[i + 4], 6, -145523070);
        d = II(d, a, b, c, x[i + 11], 10, -1120210379);
        c = II(c, d, a, b, x[i + 2], 15, 718787259);
        b = II(b, c, d, a, x[i + 9], 21, -343485551);
        a = addUnsigned(a, oa); b = addUnsigned(b, ob); c = addUnsigned(c, oc); d = addUnsigned(d, od);
      }
      return [a, b, c, d].map(v => ('00000000' + (v >>> 0).toString(16)).slice(-8)).join('');
    };
    return {
      view: () => `
        <div class="tool-header">
          <h1 class="tool-title">Hash 生成</h1>
          <p class="tool-desc">计算文本的 MD5 / SHA-1 / SHA-256 / SHA-512 哈希值(实时计算)。</p>
        </div>
        <div class="panel">
          <div class="panel-title">输入文本</div>
          <textarea class="textarea mono" id="hin" style="min-height:120px;">Hello, 世界</textarea>
          <div class="btn-row">
            <button class="btn" data-act="clear">清空</button>
          </div>
        </div>
        <div class="panel">
          <div class="panel-title">MD5 <span style="color:var(--text-muted);font-weight:400;text-transform:none;letter-spacing:normal;">(128 bit)</span></div>
          <div class="output" id="h-md5">-</div>
        </div>
        <div class="row">
          <div class="panel">
            <div class="panel-title">SHA-1 <span style="color:var(--text-muted);font-weight:400;text-transform:none;letter-spacing:normal;">(160 bit)</span></div>
            <div class="output" id="h-sha1">-</div>
          </div>
          <div class="panel">
            <div class="panel-title">SHA-256 <span style="color:var(--text-muted);font-weight:400;text-transform:none;letter-spacing:normal;">(256 bit)</span></div>
            <div class="output" id="h-sha256">-</div>
          </div>
        </div>
        <div class="panel">
          <div class="panel-title">SHA-512 <span style="color:var(--text-muted);font-weight:400;text-transform:none;letter-spacing:normal;">(512 bit)</span></div>
          <div class="output" id="h-sha512">-</div>
        </div>
      `,
      bind(root) {
        const $i = root.querySelector('#hin');
        const compute = () => {
          const text = $i.value;
          try {
            root.querySelector('#h-md5').textContent = MD5(text);
            const enc = new TextEncoder();
            crypto.subtle.digest('SHA-1', enc.encode(text)).then(b => {
              root.querySelector('#h-sha1').textContent = [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
            });
            crypto.subtle.digest('SHA-256', enc.encode(text)).then(b => {
              root.querySelector('#h-sha256').textContent = [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
            });
            crypto.subtle.digest('SHA-512', enc.encode(text)).then(b => {
              root.querySelector('#h-sha512').textContent = [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
            });
          } catch (e) { toast('计算失败:' + e.message); }
        };
        let t;
        $i.addEventListener('input', () => { clearTimeout(t); t = setTimeout(compute, 100); });
        root.addEventListener('click', e => { if (e.target.dataset.act === 'clear') { $i.value = ''; compute(); } });
        compute();
      }
    };
  },

  /* ---------- HTML 实体编解码 ---------- */
  html() {
    const ENTITIES = {
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
      ' ': '&nbsp;', '©': '&copy;', '®': '&reg;', 'TM': '&trade;',
      '€': '&euro;', '£': '&pound;', '¥': '&yen;', '¢': '&cent;',
      '§': '&sect;', '¶': '&para;', '×': '&times;', '÷': '&divide;',
      '±': '&plusmn;', 'μ': '&micro;', '·': '&middot;', '°': '&deg;',
      '1⁄4': '&frac14;', '1⁄2': '&frac12;', '3⁄4': '&frac34;',
      '«': '&laquo;', '»': '&raquo;', '←': '&larr;', '→': '&rarr;',
      '↑': '&uarr;', '↓': '&darr;', '↔': '&harr;',
    };
    const REV = Object.fromEntries(Object.entries(ENTITIES).map(([k, v]) => [v, k]));
    return {
      view: () => `
        <div class="tool-header">
          <h1 class="tool-title">HTML 实体编解码</h1>
          <p class="tool-desc">转义/反转义常见 HTML 实体(&amp;lt; &amp;gt; &amp;amp; &amp;quot; 等)。</p>
        </div>
        <div class="row">
          <div class="panel">
            <div class="panel-title">原文</div>
            <textarea class="textarea mono" id="hein" style="min-height:160px;">&lt;div class="test"&gt;你好 "世界"&amp;你好&lt;/div&gt;</textarea>
            <div class="btn-row">
              <button class="btn btn-primary" data-act="enc">转义 →</button>
              <button class="btn" data-act="clear">清空</button>
            </div>
          </div>
          <div class="panel">
            <div class="panel-title">实体</div>
            <textarea class="textarea mono" id="heout" style="min-height:160px;"></textarea>
            <div class="btn-row">
              <button class="btn btn-primary" data-act="dec">← 解码</button>
              <button class="btn" data-act="copy">复制</button>
            </div>
          </div>
        </div>
      `,
      bind(root) {
        const $i = root.querySelector('#hein');
        const $o = root.querySelector('#heout');
        const enc = () => {
          $o.value = $i.value.replace(/[&<>"']|[\u00A0-\u00FF]/g, c => ENTITIES[c] || '&#' + c.codePointAt(0) + ';');
          toast('已转义');
        };
        const dec = () => {
          try {
            $o.value = $i.value
              .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
              .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCodePoint(parseInt(n, 16)))
              .replace(/&(amp|lt|gt|quot|nbsp|copy|reg|trade|euro|pound|yen|cent|sect|para|times|divide|plusmn|micro|middot|deg|frac14|frac12|frac34|laquo|raquo|larr|rarr|uarr|darr|harr);/g, (_, name) => ({ amp:'&',lt:'<',gt:'>',quot:'"',nbsp:'\u00A0',copy:'©',reg:'®',trade:'TM',euro:'€',pound:'£',yen:'¥',cent:'¢',sect:'§',para:'¶',times:'×',divide:'÷',plusmn:'±',micro:'μ',middot:'·',deg:'°',frac14:'1⁄4',frac12:'1⁄2',frac34:'3⁄4',laquo:'«',raquo:'»',larr:'←',rarr:'→',uarr:'↑',darr:'↓',harr:'↔' })[name] || '&' + name + ';');
            toast('已解码');
          } catch (e) { toast('解码失败:' + e.message); }
        };
        root.addEventListener('click', e => {
          const a = e.target.dataset.act;
          if (a === 'enc') enc();
          else if (a === 'dec') dec();
          else if (a === 'clear') { $i.value = ''; $o.value = ''; }
          else if (a === 'copy') copyTextWithBtn($o.value, e.target);
        });
      }
    };
  },

  /* ---------- URL 解析 ---------- */
  urlparse() {
    return {
      view: () => `
        <div class="tool-header">
          <h1 class="tool-title">URL 解析</h1>
          <p class="tool-desc">拆分 URL 的协议、域名、端口、路径、查询参数、片段等。</p>
        </div>
        <div class="panel">
          <div class="panel-title">URL</div>
          <input class="input mono" id="upin" value="https://www.example.com:8080/path/to/page?id=42&name=wake&lang=zh-CN#section-2" />
          <div class="btn-row">
            <button class="btn btn-primary" data-act="parse">解析</button>
            <button class="btn" data-act="clear">清空</button>
          </div>
        </div>
        <div class="panel">
          <div class="panel-title">结构</div>
          <div class="output" id="upstruct">-</div>
        </div>
        <div class="panel">
          <div class="panel-title">查询参数</div>
          <div class="output" id="upquery">-</div>
        </div>
      `,
      bind(root) {
        const $i = root.querySelector('#upin');
        const parse = () => {
          try {
            const u = new URL($i.value.trim());
            const struct = [
              `协议 (protocol):  ${u.protocol}`,
              `用户名 (username): ${u.username || '-'}`,
              `密码 (password):   ${u.password || '-'}`,
              `主机 (host):       ${u.host}`,
              `域名 (hostname):   ${u.hostname}`,
              `端口 (port):       ${u.port || '(默认)'}`,
              `源 (origin):       ${u.origin}`,
              `路径 (pathname):   ${u.pathname}`,
              `查询 (search):     ${u.search || '-'}`,
              `片段 (hash):       ${u.hash || '-'}`,
            ].join('\n');
            root.querySelector('#upstruct').textContent = struct;
            const params = [...u.searchParams.entries()];
            root.querySelector('#upquery').textContent = params.length
              ? params.map(([k, v]) => `${k}  =  ${v}`).join('\n')
              : '- 无查询参数 -';
            toast('已解析');
          } catch (e) { toast('URL 解析失败:' + e.message); }
        };
        root.addEventListener('click', e => {
          const a = e.target.dataset.act;
          if (a === 'parse') parse();
          else if (a === 'clear') { $i.value = ''; root.querySelector('#upstruct').textContent = '-'; root.querySelector('#upquery').textContent = '-'; }
        });
        $i.addEventListener('change', parse);
        parse();
      }
    };
  },

  /* ---------- HTTP Header 解析 ---------- */
  header() {
    return {
      view: () => `
        <div class="tool-header">
          <h1 class="tool-title">HTTP Header 解析</h1>
          <p class="tool-desc">把 HTTP 头部文本(<code>Name: Value</code> 形式)解析为可读表格。</p>
        </div>
        <div class="panel">
          <div class="panel-title">HTTP Headers</div>
          <textarea class="textarea mono" id="hdin" style="min-height:200px;">Content-Type: application/json; charset=utf-8
Content-Length: 1234
Cache-Control: no-cache, no-store, must-revalidate
Date: Mon, 08 Jun 2026 05:00:00 GMT
Server: nginx/1.24.0
Set-Cookie: session=abc123; Path=/; HttpOnly; Secure
Access-Control-Allow-Origin: *
X-Request-ID: 550e8400-e29b-41d4-a716-446655440000</textarea>
          <div class="btn-row">
            <button class="btn btn-primary" data-act="parse">解析</button>
            <button class="btn" data-act="clear">清空</button>
          </div>
        </div>
        <div class="panel">
          <div class="panel-title">解析结果(<span id="hdcount">0</span> 项)</div>
          <div class="output" id="hdout">-</div>
        </div>
      `,
      bind(root) {
        const $i = root.querySelector('#hdin');
        const parse = () => {
          const lines = $i.value.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
          const rows = [];
          for (const l of lines) {
            const idx = l.indexOf(':');
            if (idx === -1) continue;
            const k = l.slice(0, idx).trim();
            const v = l.slice(idx + 1).trim();
            if (k) rows.push([k, v]);
          }
          root.querySelector('#hdcount').textContent = rows.length;
          root.querySelector('#hdout').textContent = rows.length
            ? rows.map(([k, v]) => `${k.padEnd(28, ' ')}  ${v}`).join('\n')
            : '- 未解析到有效 header -';
          toast('已解析');
        };
        root.addEventListener('click', e => {
          const a = e.target.dataset.act;
          if (a === 'parse') parse();
          else if (a === 'clear') { $i.value = ''; root.querySelector('#hdout').textContent = '-'; root.querySelector('#hdcount').textContent = '0'; }
        });
        parse();
      }
    };
  },

  /* ---------- 时间单位转换 ---------- */
  duration() {
    const UNITS = { 毫秒: 1, ms: 1, 秒: 1000, s: 1000, 分: 60000, min: 60000, 时: 3600000, h: 3600000, 天: 86400000, d: 86400000, 周: 604800000, w: 604800000 };
    return {
      view: () => `
        <div class="tool-header">
          <h1 class="tool-title">时间单位转换</h1>
          <p class="tool-desc">秒 / 分 / 时 / 天 / 周之间的换算。</p>
        </div>
        <div class="panel">
          <div class="field">
            <label class="field-label">输入数值</label>
            <input class="input mono" id="duin" value="3600" />
          </div>
          <div class="row">
            <div class="field">
              <label class="field-label">从</label>
              <select class="select" id="dufrom">
                <option value="ms">毫秒 (ms)</option>
                <option value="s" selected>秒 (s)</option>
                <option value="min">分 (min)</option>
                <option value="h">时 (h)</option>
                <option value="d">天 (d)</option>
                <option value="w">周 (w)</option>
              </select>
            </div>
            <div class="field">
              <label class="field-label">到(输出所有单位)</label>
            </div>
          </div>
          <div class="btn-row">
            <button class="btn btn-primary" data-act="conv">转换</button>
          </div>
        </div>
        <div class="panel">
          <div class="panel-title">结果</div>
          <div class="output" id="duout">-</div>
        </div>
      `,
      bind(root) {
        const $i = root.querySelector('#duin');
        const $f = root.querySelector('#dufrom');
        const $o = root.querySelector('#duout');
        const conv = () => {
          const v = parseFloat($i.value);
          if (isNaN(v)) { toast('请输入有效数值'); return; }
          const ms = v * UNITS[$f.value];
          $o.value = [
            `${ms} 毫秒`,
            `${(ms / 1000).toFixed(6)} 秒`,
            `${(ms / 60000).toFixed(6)} 分`,
            `${(ms / 3600000).toFixed(6)} 时`,
            `${(ms / 86400000).toFixed(6)} 天`,
            `${(ms / 604800000).toFixed(6)} 周`,
          ].join('\n');
        };
        $i.addEventListener('input', conv);
        $f.addEventListener('change', conv);
        root.addEventListener('click', e => { if (e.target.dataset.act === 'conv') conv(); });
        conv();
      }
    };
  },

  /* ---------- 字节单位转换 ---------- */
  bytes() {
    const DEC = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const BIN = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'];
    return {
      view: () => `
        <div class="tool-header">
          <h1 class="tool-title">字节单位转换</h1>
          <p class="tool-desc">B / KB / MB / GB / TB,支持十进制(KB=1000)和二进制(KiB=1024)。</p>
        </div>
        <div class="panel">
          <div class="field">
            <label class="field-label">输入数值</label>
            <input class="input mono" id="bin" value="1024" />
          </div>
          <div class="row">
            <div class="field">
              <label class="field-label">从</label>
              <select class="select" id="bfrom">
                <option value="0" selected>B</option>
                <option value="1">KB</option>
                <option value="2">MB</option>
                <option value="3">GB</option>
                <option value="4">TB</option>
              </select>
            </div>
            <div class="field">
              <label class="field-label">进制</label>
              <select class="select" id="bsys">
                <option value="1024">二进制 (1024)</option>
                <option value="1000">十进制 (1000)</option>
              </select>
            </div>
          </div>
          <div class="btn-row">
            <button class="btn btn-primary" data-act="conv">转换</button>
          </div>
        </div>
        <div class="panel">
          <div class="panel-title">结果</div>
          <div class="output" id="bout">-</div>
        </div>
      `,
      bind(root) {
        const $i = root.querySelector('#bin');
        const $f = root.querySelector('#bfrom');
        const $s = root.querySelector('#bsys');
        const $o = root.querySelector('#bout');
        const conv = () => {
          const v = parseFloat($i.value);
          if (isNaN(v)) { toast('请输入有效数值'); return; }
          const base = parseFloat($s.value);
          const units = base === 1024 ? BIN : DEC;
          const bytes = v * Math.pow(base, parseInt($f.value));
          const lines = [];
          for (let i = 0; i < units.length; i++) {
            lines.push(`${(bytes / Math.pow(base, i)).toFixed(6).replace(/\.?0+$/, '')}  ${units[i]}`);
          }
          $o.value = lines.join('\n') + `\n\n原始字节: ${bytes.toLocaleString()} B`;
        };
        $i.addEventListener('input', conv);
        $f.addEventListener('change', conv);
        $s.addEventListener('change', conv);
        root.addEventListener('click', e => { if (e.target.dataset.act === 'conv') conv(); });
        conv();
      }
    };
  },

  /* ---------- Markdown 预览 ---------- */
  markdown() {
    // 极简 Markdown 渲染(仅支持常用语法)
    const escapeHtml = s => s.replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
    const render = (md) => {
      // 提取代码块
      const codeBlocks = [];
      md = md.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
        codeBlocks.push({ lang, code });
        return `\u0001CODE${codeBlocks.length - 1}\u0001`;
      });
      // 转义
      md = escapeHtml(md);
      // 标题
      md = md.replace(/^###### (.*$)/gm, '<h6>$1</h6>')
             .replace(/^##### (.*$)/gm, '<h5>$1</h5>')
             .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
             .replace(/^### (.*$)/gm, '<h3>$1</h3>')
             .replace(/^## (.*$)/gm, '<h2>$1</h2>')
             .replace(/^# (.*$)/gm, '<h1>$1</h1>');
      // 粗体 + 斜体
      md = md.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
             .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
             .replace(/\*(.+?)\*/g, '<em>$1</em>')
             .replace(/__(.+?)__/g, '<strong>$1</strong>')
             .replace(/_(.+?)_/g, '<em>$1</em>');
      // 行内代码
      md = md.replace(/`([^`]+)`/g, '<code>$1</code>');
      // 链接
      md = md.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
      // 列表
      md = md.replace(/^[\-\*] (.+)$/gm, '<li>$1</li>');
      md = md.replace(/(<li>.*<\/li>\n?)+/g, m => '<ul>' + m + '</ul>');
      md = md.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
      // 引用
      md = md.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');
      // 水平线
      md = md.replace(/^---+$/gm, '<hr>');
      // 段落
      md = md.split(/\n\n+/).map(p => {
        if (/^<(h\d|ul|ol|blockquote|hr|pre)/.test(p.trim())) return p;
        return '<p>' + p.replace(/\n/g, '<br>') + '</p>';
      }).join('\n');
      // 恢复代码块
      md = md.replace(/\u0001CODE(\d+)\u0001/g, (_, i) => {
        const cb = codeBlocks[+i];
        return `<pre><code class="lang-${cb.lang}">${escapeHtml(cb.code)}</code></pre>`;
      });
      return md;
    };
    return {
      view: () => `
        <div class="tool-header">
          <h1 class="tool-title">Markdown 预览</h1>
          <p class="tool-desc">左侧写 Markdown,右侧实时渲染预览。支持标题、粗体、斜体、代码、链接、列表、引用等。</p>
        </div>
        <div class="row">
          <div class="panel">
            <div class="panel-title">Markdown</div>
            <textarea class="textarea mono" id="mdin" style="min-height:400px;"># Hello Markdown

这是一段 **加粗** 和 *斜体* 文字,还有 \`inline code\`。

## 功能列表

- 支持 H1-H6 标题
- **粗体** 和 *斜体*
- \`行内代码\` 和代码块
- [链接](https://github.com)
- 引用和分割线

### 代码块

\`\`\`javascript
function hello(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

> 引用块:这是一段引用的内容。

---</textarea>
          </div>
          <div class="panel">
            <div class="panel-title">预览</div>
            <div class="md-preview mono" id="mdout" style="min-height:400px;"></div>
          </div>
        </div>
      `,
      bind(root) {
        const $i = root.querySelector('#mdin');
        const $o = root.querySelector('#mdout');
        const upd = () => { $o.innerHTML = render($i.value); };
        $i.addEventListener('input', upd);
        upd();
      }
    };
  },

  /* ---------- YAML ↔ JSON ---------- */
  yaml() {
    // 极简 YAML 解析(仅支持基本语法:对象、数组、字符串、数字、布尔、null)
    const parseYaml = (text) => {
      const lines = text.split(/\r?\n/).filter(l => !/^\s*#/.test(l) && l.trim());
      const root = {};
      const stack = [{ indent: -1, container: root, type: 'obj' }];
      for (const raw of lines) {
        const indent = raw.match(/^ */)[0].length;
        const line = raw.trim();
        // 弹栈
        while (stack.length > 1 && indent <= stack[stack.length - 1].indent) stack.pop();
        const top = stack[stack.length - 1];
        if (line.startsWith('- ')) {
          if (top.type !== 'arr') {
            // 转数组
            const k = top.lastKey;
            top.container[k] = [];
            top.type = 'arr';
            top.arrKey = k;
          }
          top.container.push(parseValue(line.slice(2)));
        } else {
          const idx = line.indexOf(':');
          if (idx === -1) continue;
          const k = line.slice(0, idx).trim();
          const v = line.slice(idx + 1).trim();
          if (v === '' || v === undefined) {
            // 子结构
            top.lastKey = k;
            top.container[k] = {};
            stack.push({ indent, container: top.container[k], type: 'obj', lastKey: null });
          } else {
            top.container[k] = parseValue(v);
            top.type = 'obj';
            top.lastKey = k;
          }
        }
      }
      return root;
    };
    const parseValue = (v) => {
      if (v === 'null' || v === '~' || v === '') return null;
      if (v === 'true') return true;
      if (v === 'false') return false;
      if (/^-?\d+$/.test(v)) return parseInt(v, 10);
      if (/^-?\d+\.\d+$/.test(v)) return parseFloat(v);
      if (v.startsWith('"') && v.endsWith('"')) return v.slice(1, -1).replace(/\\"/g, '"');
      if (v.startsWith("'") && v.endsWith("'")) return v.slice(1, -1);
      return v;
    };
    // 极简 YAML 序列化
    const stringifyYaml = (obj, indent = 0) => {
      const pad = ' '.repeat(indent);
      if (obj === null) return 'null';
      if (typeof obj !== 'object') return JSON.stringify(obj);
      if (Array.isArray(obj)) {
        return obj.map(v => `${pad}- ${typeof v === 'object' ? '\n' + stringifyYaml(v, indent + 2) : stringifyYaml(v)}`).join('\n');
      }
      return Object.entries(obj).map(([k, v]) => {
        if (v === null || typeof v !== 'object') return `${pad}${k}: ${stringifyYaml(v)}`;
        const sub = stringifyYaml(v, indent + 2);
        return `${pad}${k}:\n${sub}`;
      }).join('\n');
    };
    return {
      view: () => `
        <div class="tool-header">
          <h1 class="tool-title">YAML ↔ JSON</h1>
          <p class="tool-desc">YAML 与 JSON 互转,支持基础语法(对象、数组、字符串、数字、布尔、null)。</p>
        </div>
        <div class="row">
          <div class="panel">
            <div class="panel-title">YAML</div>
            <textarea class="textarea mono" id="ymin" style="min-height:300px;">name: wake
age: 18
active: true
tags:
  - tools
  - web
profile:
  email: wake@example.com
  address:
city: Beijing
country: CN</textarea>
            <div class="btn-row">
              <button class="btn btn-primary" data-act="to-json">转 JSON →</button>
              <button class="btn" data-act="clear">清空</button>
            </div>
          </div>
          <div class="panel">
            <div class="panel-title">JSON</div>
            <textarea class="textarea mono" id="ymout" style="min-height:300px;"></textarea>
            <div class="btn-row">
              <button class="btn btn-primary" data-act="to-yaml">← 转 YAML</button>
              <button class="btn" data-act="copy">复制</button>
            </div>
          </div>
        </div>
      `,
      bind(root) {
        const $i = root.querySelector('#ymin');
        const $o = root.querySelector('#ymout');
        const toJson = () => {
          try { $o.value = JSON.stringify(parseYaml($i.value), null, 2); toast('已转 JSON'); }
          catch (e) { toast('解析失败:' + e.message); }
        };
        const toYaml = () => {
          try { $o.value = stringifyYaml(JSON.parse($o.value)); toast('已转 YAML'); }
          catch (e) { toast('解析失败:' + e.message); }
        };
        root.addEventListener('click', e => {
          const a = e.target.dataset.act;
          if (a === 'to-json') toJson();
          else if (a === 'to-yaml') toYaml();
          else if (a === 'clear') { $i.value = ''; $o.value = ''; }
          else if (a === 'copy') copyTextWithBtn($o.value, e.target);
        });
      }
    };
  },

  /* ---------- 假数据生成 ---------- */
  fakedata() {
    const SURNAMES = ['张', '王', '李', '赵', '刘', '陈', '杨', '黄', '周', '吴', '徐', '孙', '马', '朱', '胡', '林', '郭', '何', '高', '罗', '郑', '梁', '谢', '宋', '唐', '许', '韩', '冯', '邓', '曹'];
    const GIVEN = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '娟', '涛', '明', '超', '秀兰', '霞', '平', '刚', '桂英', '文', '华', '建国', '建华', '志强', '小红', '丽娟'];
    const DOMAINS = ['gmail.com', 'outlook.com', '163.com', 'qq.com', 'hotmail.com', 'yahoo.com', 'example.com'];
    const CITIES = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '南京', '西安', '重庆', '苏州', '天津', '长沙', '青岛', '厦门'];
    const STREETS = ['人民路', '中山路', '解放路', '建设路', '和平路', '胜利路', '文化路', '新华路', '光明路', '民主路'];
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const pad = (n, w) => String(n).padStart(w, '0');
    const genName = () => pick(SURNAMES) + pick(GIVEN) + (Math.random() > 0.6 ? pick(GIVEN) : '');
    const genEmail = (name) => {
      const pinyin = { 张:'zhang',王:'wang',李:'li',赵:'zhao',刘:'liu',陈:'chen',杨:'yang',黄:'huang',周:'zhou',吴:'wu',徐:'xu',孙:'sun',马:'ma',朱:'zhu',胡:'hu',林:'lin',郭:'guo',何:'he',高:'gao',罗:'luo',郑:'zheng',梁:'liang',谢:'xie',宋:'song',唐:'tang',许:'xu',韩:'han',冯:'feng',邓:'deng',曹:'cao' };
      const first = pinyin[name[0]] || 'user';
      return `${first}${rnd(100, 9999)}@${pick(DOMAINS)}`;
    };
    const genPhone = () => `1${pick(['3','4','5','6','7','8','9'])}${rnd(1000000, 9999999)}`;
    const genIdCard = () => {
      const area = pad(rnd(100000, 659999), 6);
      const yyyy = rnd(1950, 2005);
      const mm = pad(rnd(1, 12), 2);
      const dd = pad(rnd(1, 28), 2);
      const seq = pad(rnd(1, 999), 3);
      const base = area + yyyy + mm + dd + seq;
      // 简单校验位
      const w = [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2];
      let s = 0;
      for (let i = 0; i < 17; i++) s += +base[i] * w[i];
      const m = ['1','0','X','9','8','7','6','5','4','3','2'][s % 11];
      return base + m;
    };
    const genAddress = () => `${pick(CITIES)}市${pick(['市辖区','高新区','经开区'])}${pick(STREETS)}${rnd(1, 999)}号`;
    const TYPES = {
      姓名: genName,
      邮箱: () => genEmail(genName()),
      手机号: genPhone,
      身份证: genIdCard,
      地址: genAddress,
    };
    return {
      view: () => `
        <div class="tool-header">
          <h1 class="tool-title">假数据生成</h1>
          <p class="tool-desc">批量生成测试用姓名、邮箱、手机号、身份证号、地址。数据完全随机,无业务意义。</p>
        </div>
        <div class="panel">
          <div class="row-3">
            <div class="field">
              <label class="field-label">类型</label>
              <select class="select" id="fdtype">
                <option value="姓名">姓名</option>
                <option value="邮箱">邮箱</option>
                <option value="手机号">手机号</option>
                <option value="身份证">身份证</option>
                <option value="地址">地址</option>
              </select>
            </div>
            <div class="field">
              <label class="field-label">数量</label>
              <input class="input" type="number" id="fdn" value="10" min="1" max="200" />
            </div>
            <div class="field" style="display:flex;align-items:flex-end;">
              <button class="btn btn-primary" data-act="gen" style="width:100%;">生成</button>
            </div>
          </div>
        </div>
        <div class="panel">
          <div class="panel-title">结果</div>
          <textarea class="textarea mono" id="fdout" style="min-height:300px;"></textarea>
          <div class="btn-row">
            <button class="btn" data-act="copy">复制</button>
            <button class="btn" data-act="clear">清空</button>
          </div>
        </div>
      `,
      bind(root) {
        const $t = root.querySelector('#fdtype');
        const $n = root.querySelector('#fdn');
        const $o = root.querySelector('#fdout');
        const gen = () => {
          const fn = TYPES[$t.value];
          const n = Math.min(200, Math.max(1, +$n.value || 1));
          $o.value = Array.from({ length: n }, fn).join('\n');
        };
        root.addEventListener('click', e => {
          const a = e.target.dataset.act;
          if (a === 'gen') gen();
          else if (a === 'copy') copyTextWithBtn($o.value, e.target);
          else if (a === 'clear') $o.value = '';
        });
        gen();
      }
    };
  },
};

/* ============================================================
   通用辅助
   ============================================================ */;

})();
