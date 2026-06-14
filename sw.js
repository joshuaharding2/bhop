self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('my-game-cache').then(cache => {
            return cache.addAll([
                'index.html',
                'bhop.html',
                'standalone.html',
                'editor.html',
                'login.html',
                'home.html',
                'campaigns.html',
                'play.html',
                'custom.html',
                'settings.html',
                'updates.html',
                'user.html',
                'style.css',
                'common.js',
                'favicon/favicon-96x96.png',
                'favicon/favicon.svg',
                'favicon/favicon.ico',
                'favicon/apple-touch-icon.png'
            ]);
        })
    );
});
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        let responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
