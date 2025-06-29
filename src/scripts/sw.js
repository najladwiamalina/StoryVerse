import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, NetworkFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'html-pages-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200], //  cache response yang OK
      }),
    ],
  })
);

// 🖼️ Caching gambar dari API story
registerRoute(
  ({ url }) =>
    url.origin === 'https://story-api.dicoding.dev' &&
    url.pathname.startsWith('/images/stories/'),
  new StaleWhileRevalidate({
    cacheName: 'story-api-images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

registerRoute(
  ({ url }) =>
    url.origin === 'https://fonts.googleapis.com' ||
    url.origin === 'https://fonts.gstatic.com' ||
    url.origin.includes('cloudflare'),
  new StaleWhileRevalidate({
    cacheName: 'cdn-fonts-cache',
  })
);

self.addEventListener('push', (event) => {
  const data = event.data?.text() || 'Push message with no payload';
  event.waitUntil(
    self.registration.showNotification('Notifikasi', {
      body: data,
      icon: '/icons/icon-192x192.png',
    })
  );
});
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match('/index.html') // fallback ke index.html
      )
    );
  }
});

