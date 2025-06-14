const CACHE_NAME = "StoryApp-V1";
const STATIC_ASSETS = ["/", "/index.html", "/manifest.json", "/images/logo.png", "/images/favicon.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))));
  self.clients.claim();
});

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
  console.log("Push diterima:", event);

  if (event.data) {
    const data = event.data.json();
    const { title, options } = data;

    event.waitUntil(
      self.registration.showNotification(title, {
        body: options.body,
        icon: "/images/logo.png",
      })
    );
  }
});
