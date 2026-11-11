const CACHE_NAME = 'radio-power-909-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // No cachear streams de audio en vivo
  if (event.request.url.includes('listen2myradio') || event.request.url.includes('/api/radio')) {
    return;
  }
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
