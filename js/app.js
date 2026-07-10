/* Wake Tools · app entry
 * Router, navigation, home view rendering, theme toggle.
 * Depends on: WT.ICONS, WT.utils, WT.TOOLS, WT.Tools.
 */
(function () {
  const { ICONS, utils, TOOLS, Tools } = window.WT;
  const { escapeHtml } = utils;

  const state = { toolId: null };

  /* ============================================================
     Home view — minimal / tech aesthetic
     ============================================================ */
  function homeView() {
    const groups = {};
    TOOLS.forEach((t) => {
      (groups[t.group] = groups[t.group] || []).push(t);
    });
    const groupCount = Object.keys(groups).length;

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

      <section class="home-section">
        <header class="section-head">
          <h2 class="section-title">全部工具</h2>
          <span class="section-count">${TOOLS.length} 个 · 按分组浏览</span>
        </header>
        <div class="home-grid">
          ${TOOLS.map((t, i) => cardHtml(t, i)).join('')}
        </div>
      </section>
    `;
  }

  function cardHtml(t, i) {
    return `
      <a class="card" href="#/${t.id}">
        <div class="card-head">
          <span class="card-idx">${String(i + 1).padStart(2, '0')}</span>
          <span class="card-icon">${ICONS[t.icon] || ''}</span>
        </div>
        <div class="card-body">
          <h3 class="card-title">${escapeHtml(t.name)}</h3>
          <p class="card-desc">${escapeHtml(t.desc)}</p>
        </div>
        <div class="card-foot">
          <span class="card-group">${escapeHtml(t.group)}</span>
          <span class="card-arrow">${ICONS.arrowRight || ''}</span>
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
          <div class="nav-group-title">${escapeHtml(g)}</div>
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
    document.getElementById('navList').innerHTML =
      html || '<div class="nav-empty">没有匹配的工具</div>';
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
    document.getElementById('search').addEventListener('input', (e) =>
      renderNav(e.target.value)
    );
    document.getElementById('menuBtn').addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open');
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