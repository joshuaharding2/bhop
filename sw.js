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
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});
