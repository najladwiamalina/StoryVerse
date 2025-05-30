const CACHE_NAME = "StoryApp-V1";
const STATIC_ASSETS = ["/", "/index.html", "/manifest.json", "/images/logo.png", "/images/favicon.png"];

// ✅ Caching static assets saat install
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
});

// ✅ Membersihkan cache lama saat activate
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))));
  self.clients.claim();
});

// ✅ Menangani permintaan offline dengan cache fallback
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(
          () => caches.match("/index.html") // fallback ke shell
        )
      );
    })
  );
});

// ✅ Menangani push notification
self.addEventListener("push", (event) => {
  const data = event.data?.json() || {
    title: "Notifikasi Baru",
    body: "Ada pembaruan cerita!",
  };

  const options = {
    body: data.body,
    icon: "/images/logo.png",
    badge: "/images/favicon.png",
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});
