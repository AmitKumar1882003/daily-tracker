// Service Worker for Daily Tracker PWA
// Version 17.0

const CACHE_NAME = 'daily-tracker-cache-v17.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/firebase-app.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://r2cdn.perplexity.ai/fonts/FKGroteskNeue.woff2'
];

// Install event: Cache the core assets.
self.addEventListener('install', event => {
  console.log('[Service Worker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching all: app shell and content');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('[Service Worker] Caching failed', error);
      })
  );
});

// Activate event: Clean up old caches.
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activate');
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
    return self.clients.claim();
});


// Fetch event: Serve cached content when offline, with a cache-first strategy.
self.addEventListener('fetch', event => {
    // We only want to cache GET requests.
    if (event.request.method !== 'GET') {
        return;
    }

    // For API calls (like motivational quotes), use a network-first strategy.
    if (event.request.url.includes('type.fit/api/quotes')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // Cache the new response for future offline use.
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    return response;
                })
                .catch(() => {
                    // If network fails, try to get it from the cache.
                    return caches.match(event.request);
                })
        );
        return;
    }
    
    // For all other requests, use a cache-first strategy.
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                // If the resource is in the cache, serve it.
                if (cachedResponse) {
                    return cachedResponse;
                }

                // Otherwise, fetch it from the network.
                return fetch(event.request)
                    .then(networkResponse => {
                        // If we got a valid response, clone it and cache it.
                        if (networkResponse && networkResponse.status === 200) {
                            const responseToCache = networkResponse.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, responseToCache);
                                });
                        }
                        return networkResponse;
                    });
            })
            .catch(error => {
                console.error('[Service Worker] Fetch failed; returning offline page instead.', error);
                // You could return a fallback offline page here if you have one.
                // For this app, if the root files are cached, it should still load.
            })
    );
});
