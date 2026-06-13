self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('my-game-cache').then(cache => {
            return cache.addAll([
                'index.html',
                'bhop.html',
                'editor.html',
            ]);
        })
    );
});
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});
