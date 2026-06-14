self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('bhop-cache').then(cache => {
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
        caches.open('bhop-cache').then(cache => cache.put(event.request, responseClone));
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) return cachedResponse;
          return new Response('Offline and asset not cached.', {
            status: 404,
            statusText: 'Not Found'
          });
        });
      })
  );
});
