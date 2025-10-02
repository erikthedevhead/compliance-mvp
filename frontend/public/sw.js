// Basic service worker: cache-first for static assets, network-first for others
const STATIC_CACHE = 'static-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll([
      '/', '/manifest.json'
    ]))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method === 'GET' && (url.pathname.startsWith('/_next/') || req.destination === 'image' || url.pathname === '/')) {
    event.respondWith((async () => {
      const cache = await caches.open(STATIC_CACHE);
      const match = await cache.match(req);
      if (match) return match;
      try {
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
      } catch (e) {
        return match || Response.error();
      }
    })());
  }
});
