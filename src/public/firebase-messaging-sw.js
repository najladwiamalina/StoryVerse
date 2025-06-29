
self.addEventListener('push', (event) => {
    const data = event.data.json();
    const title = data.title;
    const options = data.options;
  
    event.waitUntil(self.registration.showNotification(title, options));
  });
  