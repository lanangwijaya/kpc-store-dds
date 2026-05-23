const CACHE = 'kpc-store-v1';
const ASSETS = [
  '/kpc-store-dds/',
  '/kpc-store-dds/index.html',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Hanya cache GET request
  if (e.request.method !== 'GET') return;
  // Jangan cache Firebase/API calls
  const url = e.request.url;
  if (url.includes('firebase') || url.includes('roblox') || url.includes('vercel') || url.includes('ipapi')) return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
