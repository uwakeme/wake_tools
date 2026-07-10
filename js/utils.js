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

  const copyText = (t) => {
    if (!t) {
      toast('内容为空');
      return;
    }
    navigator.clipboard
      .writeText(t)
      .then(() => toast('已复制'))
      .catch(() => {
        const ta = document.createElement('textarea');
        ta.value = t;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        toast('已复制');
      });
  };

  NS.utils = { pad, formatDate, escapeHtml, escapeAttr, copyText, toast };
})();