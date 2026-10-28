/* Wake Tools · Service Worker
 * 目标:跨洋弱网(大陆访问海外 Cloudflare 节点,TLS 握手可达十几秒)下,
 * 回访秒开、断网可用;首次访问不受影响也无法加速。
 *
 * 策略:
 * - 页面导航:网络优先(3s 超时),成功则更新缓存并返回;超时/失败回退缓存页
 * - 同源静态资源:缓存优先,URL 精确匹配(?v=N 变了就是新资源);
 *   缓存未命中且网络失败时,放宽 query 兜底旧版本 —— 宁可旧版也不白屏
 * - 预缓存:install 时抓首页 HTML,解析出其中带 ?v= 的 js/css 逐个缓存。
 *   版本号不写死在这里,资源更新不需要改本文件;改缓存策略时 bump CACHE_NAME
 * - 仅拦截同源 GET;Google Fonts 等跨域请求直接放行(不可达时走系统字体回退)
 */
const CACHE_NAME = 'wt-shell-v1';
const NAV_TIMEOUT_MS = 3000;

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(precache());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) {
      if (name !== CACHE_NAME) await caches.delete(name);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  if (req.headers.has('range')) return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith(htmlHandler(req));
  } else {
    event.respondWith(assetHandler(req));
  }
});

async function precache() {
  const cache = await caches.open(CACHE_NAME);
  try {
    await cache.add('/');
  } catch (e) {
    return; // 安装时正好断网:放弃预缓存,运行时缓存会在下次访问兜底
  }
  const html = await cache.match('/');
  if (!html) return;
  const urls = [...new Set((await html.text()).match(/(?:\/js\/|\/css\/)[^\s"'<>]+?\?v=\d+/g) || [])];
  await Promise.all(urls.map((u) => cache.add(new URL(u, self.location.origin)).catch(() => {})));
}

async function htmlHandler(req) {
  const cache = await caches.open(CACHE_NAME);
  let fresh = null;
  try {
    fresh = await withTimeout(fetch(req), NAV_TIMEOUT_MS);
  } catch (e) {
    fresh = null;
  }
  if (fresh && fresh.ok) {
    cache.put(req, fresh.clone());
    return fresh;
  }
  const cached = await cache.match(req);
  if (cached) return cached;
  if (fresh) return fresh; // 网络通但状态码异常且无缓存,原样返回
  throw new Error('offline and uncached');
}

async function assetHandler(req) {
  const cache = await caches.open(CACHE_NAME);
  const exact = await cache.match(req);
  if (exact) return exact;
  try {
    const fresh = await fetch(req);
    if (fresh.ok) cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    // 新版本资源拉不动(弱网):退回旧版本,避免白屏卡死
    const stale = await cache.match(req, { ignoreSearch: true });
    if (stale) return stale;
    throw e;
  }
}

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then(
      (v) => { clearTimeout(timer); resolve(v); },
      (e) => { clearTimeout(timer); reject(e); }
    );
  });
}
