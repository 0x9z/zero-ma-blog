// Zero — Service Worker
const CACHE_NAME = 'zero-cache-v1';
const urlsToCache = [
    '/',
    '/styles.css',
    '/script.js',
    '/favicon.svg',
    '/manifest.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
