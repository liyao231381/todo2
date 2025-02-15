// public/sw.js
const CACHE_NAME = 'todo-app-cache-v1';
const urlsToCache = [
    '/',
    '/manifest.json',
    '/favicon.ico',
     'todo.png',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
