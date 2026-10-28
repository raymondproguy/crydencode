/* CrydenCode service worker.
   - Precaches every page and asset listed in assets/js/files.js when installed.
   - Network first (with a short timeout) so updates appear when online; cache fallback when offline.
   - To release an update: change `version` in assets/js/files.js. Old caches are deleted on activate. */
importScripts('assets/js/files.js');

const FILES = self.CP_FILES;
const CACHE_PREFIX = 'crydencode-';
const CACHE_NAME = CACHE_PREFIX + FILES.version;
const NETWORK_TIMEOUT_MS = 3500;
const PRECACHE = ['./'].concat(FILES.pages, FILES.assets);

function scoped(path) { return new URL(path, self.registration.scope).href; }

/* Same file regardless of ?query (lesson.html?id=… is one file). */
function cacheKey(url) {
  const u = new URL(url);
  return u.origin + u.pathname;
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // If any file fails, install fails and the browser retries later. We never claim "ready" with missing files.
    await Promise.all(PRECACHE.map(async (path) => {
      const response = await fetch(new Request(scoped(path), { cache: 'reload' }));
      if (!response.ok) throw new Error('Could not cache ' + path + ' (' + response.status + ')');
      await cache.put(cacheKey(scoped(path)), response);
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((n) => n.startsWith(CACHE_PREFIX) && n !== CACHE_NAME).map((n) => caches.delete(n)));
    await self.clients.claim();
  })());
});

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then((v) => { clearTimeout(timer); resolve(v); }, (e) => { clearTimeout(timer); reject(e); });
  });
}

async function handle(request) {
  const cache = await caches.open(CACHE_NAME);
  const key = cacheKey(request.url);
  try {
    const response = await withTimeout(fetch(request), NETWORK_TIMEOUT_MS);
    if (response && response.ok && response.type === 'basic') cache.put(key, response.clone());
    return response;
  } catch (error) {
    const cached = await cache.match(key);
    if (cached) return cached;
    if (request.mode === 'navigate') {
      const fallback = await cache.match(cacheKey(scoped('offline.html')));
      if (fallback) return fallback;
    }
    return new Response('Offline and this file is not saved yet.', { status: 503, headers: { 'Content-Type': 'text/plain' } });
  }
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // never touch API or other sites
  event.respondWith(handle(request));
});

self.addEventListener('message', async (event) => {
  const data = event.data || {};
  const port = event.ports && event.ports[0];
  if (data.type === 'STATUS' && port) {
    const cache = await caches.open(CACHE_NAME);
    let cached = 0;
    for (const path of PRECACHE) { if (await cache.match(cacheKey(scoped(path)))) cached++; }
    port.postMessage({ version: FILES.version, cached: cached, total: PRECACHE.length });
  }
});
