/* Wake Tools · small utilities
 * Exposed as window.WT.utils: { pad, formatDate, escapeHtml, escapeAttr, copyText, toast }
 */
(function () {
  const NS = (window.WT = window.WT || {});

  const pad = (n, w = 2) => String(n).padStart(w, '0');

  const formatDate = (d, fmt) => {
    const map = {
      YYYY: d.getFullYear(),
      MM: pad(d.getMonth() + 1),
      DD: pad(d.getDate()),
      HH: pad(d.getHours()),
      mm: pad(d.getMinutes()),
      ss: pad(d.getSeconds()),
      dddd: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][d.getDay()],
    };
    return fmt.replace(/YYYY|MM|DD|HH|mm|ss|dddd/g, (k) => map[k]);
  };

  const escapeHtml = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
    );

  const escapeAttr = (s) => escapeHtml(s);

  const toast = (msg) => {
    const t = document.getElementById('toast');
    if (!t) return;
    t.innerHTML = NS.ICONS.check + '<span>' + escapeHtml(msg) + '</span>';
    t.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove('show'), 1500);
  };

  // copyText 永远不抛异常;返回 Promise<boolean> 表示是否真的写入了剪贴板
  // 同步路径(fallback / 同步成功)用 Promise.resolve 包装,保持调用方一致
  const copyText = (t) => {
    if (!t) {
      toast('内容为空');
      return Promise.resolve(false);
    }
    const fallback = () => {
      try {
        const ta = document.createElement('textarea');
        ta.value = t;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        ta.style.pointerEvents = 'none';
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        ta.remove();
        toast(ok ? '已复制' : '复制失败,请手动复制');
        return ok;
      } catch (e) {
        toast('复制失败,请手动复制');
        return false;
      }
    };
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(t).then(
        () => { toast('已复制'); return true; },
        () => fallback()
      );
    }
    return Promise.resolve(fallback());
  };

  // copyTextWithBtn: 跟 copyText 一样复制,但在按钮上闪 '✓ 已复制' / '✗ 复制失败' 1.2s,
  // 避免 toast 在屏幕底部 1.5s 消失被错过。btn 可以是按钮元素或事件 target (会用 closest 找按钮)
  const copyTextWithBtn = (text, btnOrTarget) => {
    const btn = (btnOrTarget && btnOrTarget.closest)
      ? btnOrTarget.closest('[data-act="copy"]') || btnOrTarget
      : btnOrTarget;
    if (!btn) return copyText(text);
    return copyText(text).then(ok => {
      const orig = btn.dataset._origText || btn.textContent;
      btn.dataset._origText = orig;
      btn.textContent = ok ? '✓ 已复制' : '✗ 复制失败';
      clearTimeout(btn._copyFlashTimer);
      btn._copyFlashTimer = setTimeout(() => { btn.textContent = orig; }, 1200);
      return ok;
    });
  };

  NS.utils = { pad, formatDate, escapeHtml, escapeAttr, copyText, copyTextWithBtn, toast };
})();