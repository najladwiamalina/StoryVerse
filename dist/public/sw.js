const CACHE_NAME = "StoryApp-V1",
  STATIC_ASSETS = ["/", "/index.html", "/manifest.json", "/images/logo.png", "/images/favicon.png"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((e) => e.addAll(STATIC_ASSETS)));
}),
  self.addEventListener("activate", (e) => {
    e.waitUntil(caches.keys().then((e) => Promise.all(e.filter((e) => e !== CACHE_NAME).map((e) => caches.delete(e))))), self.clients.claim();
  }),
  self.addEventListener("fetch", (e) => {
    "GET" === e.request.method && e.respondWith(caches.match(e.request).then((t) => t || fetch(e.request).catch(() => caches.match("/index.html"))));
  }),
  self.addEventListener("push", (e) => {
    if ((console.log("Push diterima:", e), e.data)) {
      const t = e.data.json(),
        { title: s, options: i } = t;
      e.waitUntil(self.registration.showNotification(s, { body: i.body, icon: "/images/logo.png" }));
    }
  });
