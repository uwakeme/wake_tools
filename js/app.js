/* Wake Tools · app entry
 * Router, navigation, home view rendering, theme toggle.
 * Depends on: WT.ICONS, WT.utils, WT.TOOLS, WT.Tools.
 */
(function () {
  const { ICONS, utils, TOOLS, Tools } = window.WT;
  const { escapeHtml } = utils;

  const state = { toolId: null };

  /* Group descriptions — keep in sync with the group field on each tool.
     Falls back to empty string if a new group is added without description. */
  const GROUP_DESC = {
    '编码转换': '字符串与 Base64 / URL / Hex / Unicode / HTML 实体互转',
    '时间日期': 'Unix 时间戳、时长、日期相关计算',
    '格式化': 'JSON / SQL / XML / Markdown / YAML 美化与转换',
    '文本处理': '命名风格、Diff、正则、字符串工具',
    '生成器': 'UUID、密码、Hash、占位文本、假数据',
    '颜色工具': 'HEX / RGB / HSL 颜色值互转与色板预览',
    '数字工具': '进制互转、字节单位换算',
    '网络调试': 'JWT、URL、HTTP 头解析',
    '其他': 'Cron 表达式、ASCII / Unicode 字符表',
  };

  // Anchor id from a group name — only used in home view for in-page jumps
  function slug(s) {
    return s.replace(/[^\w一-龥]+/g, '-');
  }

  /* ============================================================
     Home view — grouped by category, with quick-jump nav
     ============================================================ */
  function homeView() {
    const groups = {};
    TOOLS.forEach((t) => {
      (groups[t.group] = groups[t.group] || []).push(t);
    });
    const groupEntries = Object.entries(groups);
    const groupCount = groupEntries.length;

    // Recent / featured picks (first 4) for the hero strip
    const featured = TOOLS.slice(0, 4);

    return `
      <section class="hero">
        <div class="hero-prompt" aria-hidden="true">
          <span class="prompt-sigil">~/</span><span class="prompt-cmd">wake-tools</span><span class="prompt-arrow">›</span><span class="prompt-action">list --all</span>
        </div>
        <h1 class="hero-title">
          为开发者准备的<span class="hero-accent">随取随用</span>工具箱
        </h1>
        <p class="hero-desc">
          ${TOOLS.length} 个开发者工具，覆盖编码、格式、生成与网络调试。打开即用，无需登录。
        </p>
        <div class="hero-meta">
          <span><b>${groupCount}</b> 个分类</span>
          <span class="dot"></span>
          <span>左侧搜索快速定位</span>
          <span class="dot"></span>
          <span>支持明暗切换</span>
        </div>
        <div class="hero-strip">
          <span class="hero-strip-label">Quick start</span>
          ${featured
            .map(
              (t) =>
                `<a class="hero-chip" href="#/${t.id}">${ICONS[t.icon] || ''}<span>${escapeHtml(
                  t.name
                )}</span></a>`
            )
            .join('')}
        </div>
      </section>

      <section class="home-overview">
        <header class="section-head">
          <div class="section-head-text">
            <h2 class="section-title">按分类浏览</h2>
            <p class="section-sub">${groupCount} 个分类 · ${TOOLS.length} 个工具 · 点分类跳转，或在左侧搜索</p>
          </div>
          <span class="section-count">总览</span>
        </header>
        <nav class="home-toc" aria-label="分类快速跳转">
          ${groupEntries
            .map(
              ([g, list]) => `
            <a class="home-toc-chip" href="#cat-${slug(g)}">
              <span class="home-toc-name">${escapeHtml(g)}</span>
              <span class="home-toc-count">${list.length}</span>
            </a>`
            )
            .join('')}
        </nav>
      </section>

      ${groupEntries
        .map(
          ([g, list]) => `
        <section class="home-category" id="cat-${slug(g)}">
          <header class="section-head">
            <div class="section-head-text">
              <h2 class="section-title">${escapeHtml(g)}</h2>
              <p class="section-sub">${escapeHtml(GROUP_DESC[g] || '')}</p>
            </div>
            <span class="section-count">${list.length} 个工具</span>
          </header>
          <div class="home-grid">
            ${list.map((t) => cardHtml(t)).join('')}
          </div>
        </section>`
        )
        .join('')}
    `;
  }

  function cardHtml(t) {
    return `
      <a class="card" href="#/${t.id}">
        <div class="card-head">
          <span class="card-icon">${ICONS[t.icon] || ''}</span>
          <span class="card-arrow">${ICONS.arrowRight || ''}</span>
        </div>
        <div class="card-body">
          <h3 class="card-title">${escapeHtml(t.name)}</h3>
          <p class="card-desc">${escapeHtml(t.desc)}</p>
        </div>
        <div class="card-foot">
          <span class="card-group">${escapeHtml(t.group)}</span>
        </div>
      </a>
    `;
  }

  /* ============================================================
     Sidebar nav
     ============================================================ */
  function renderNav(filter = '') {
    const f = filter.trim().toLowerCase();
    const groups = {};
    TOOLS.forEach((t) => {
      if (f && !t.name.toLowerCase().includes(f) && !t.desc.toLowerCase().includes(f)) return;
      (groups[t.group] = groups[t.group] || []).push(t);
    });
    const html = Object.entries(groups)
      .map(
        ([g, list]) => `
        <div class="nav-group">
          <div class="nav-group-title">
            <span>${escapeHtml(g)}</span>
            <span class="nav-group-count">${list.length}</span>
          </div>
          ${list
            .map(
              (t) => `
            <a class="nav-item ${t.id === state.toolId ? 'active' : ''}" data-id="${t.id}" href="#/${t.id}">
              <span class="nav-item-icon">${ICONS[t.icon] || ''}</span>
              <span class="nav-item-label">${escapeHtml(t.name)}</span>
            </a>`
            )
            .join('')}
        </div>`
      )
      .join('');
    if (!html) {
      const term = escapeHtml(filter.trim());
      document.getElementById('navList').innerHTML =
        `<div class="nav-empty">` +
          `没找到匹配 <strong>“${term}”</strong> 的工具。<br>` +
          `试试换个关键词，或者` +
          `<button type="button" data-clear-search>清空搜索</button>` +
        `</div>`;
    } else {
      document.getElementById('navList').innerHTML = html;
    }
  }

  /* ============================================================
     Tool page rendering
     ============================================================ */
  function render() {
    const hash = location.hash.replace(/^#\/?/, '');
    const tool = TOOLS.find((t) => t.id === hash);
    const panel = document.getElementById('panel');
    const breadcrumb = document.getElementById('breadcrumb');

    if (!tool) {
      state.toolId = null;
      breadcrumb.textContent = '首页';
      panel.innerHTML = homeView();
    } else {
      state.toolId = tool.id;
      breadcrumb.innerHTML = `<span class="crumb-tag">${escapeHtml(tool.group)}</span> <strong>${escapeHtml(tool.name)}</strong>`;
      const factory = Tools[tool.id]();
      panel.innerHTML = factory.view();
      factory.bind(panel);

      // Inject eyebrow row + icon into tool title
      const titleEl = panel.querySelector('.tool-title');
      if (titleEl) {
        const idx = TOOLS.findIndex((t) => t.id === tool.id) + 1;
        const eyebrow = document.createElement('div');
        eyebrow.className = 'tool-eyebrow';
        eyebrow.innerHTML =
          `<span class="tool-eyebrow-tag">${escapeHtml(tool.group)}</span>` +
          `<span class="tool-eyebrow-line"></span>` +
          `<span class="tool-eyebrow-idx">No. ${String(idx).padStart(2, '0')} / ${String(
            TOOLS.length
          ).padStart(2, '0')}</span>`;
        titleEl.parentNode.insertBefore(eyebrow, titleEl);
        if (ICONS[tool.icon]) {
          titleEl.innerHTML =
            `<span class="tool-title-icon">${ICONS[tool.icon]}</span>` +
            '<span>' +
            titleEl.innerHTML +
            '</span>';
        }
      }
    }

    renderNav(document.getElementById('search').value);
    if (window.innerWidth <= 768) {
      document.getElementById('sidebar').classList.remove('open');
    }
  }

  /* ============================================================
     Theme toggle
     ============================================================ */
  function setThemeIcon() {
    const cur = document.documentElement.getAttribute('data-theme');
    const el = document.getElementById('themeIcon');
    el.innerHTML = cur === 'dark' ? ICONS.sun : ICONS.moon;
  }

  function initTheme() {
    const stored = localStorage.getItem('wt-theme');
    if (stored) document.documentElement.setAttribute('data-theme', stored);
    setThemeIcon();
    document.getElementById('themeBtn').addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('wt-theme', next);
      setThemeIcon();
    });
  }

  /* ============================================================
     Wire-up
     ============================================================ */
  function init() {
    const search = document.getElementById('search');
    search.addEventListener('input', (e) => renderNav(e.target.value));
    search.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        search.value = '';
        renderNav('');
        search.blur();
      }
    });

    document.getElementById('menuBtn').addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open');
    });

    // Cmd/Ctrl+K (or /) → focus search
    window.addEventListener('keydown', (e) => {
      const isMac = navigator.platform.toLowerCase().includes('mac');
      const meta = isMac ? e.metaKey : e.ctrlKey;
      if (meta && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        search.focus();
        search.select();
      } else if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        search.focus();
      }
    });

    // Delegate click for "clear search" button inside nav-empty state
    document.getElementById('navList').addEventListener('click', (e) => {
      if (e.target.matches('[data-clear-search]')) {
        search.value = '';
        renderNav('');
        search.focus();
      }
    });

    initTheme();
    window.addEventListener('hashchange', render);
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();