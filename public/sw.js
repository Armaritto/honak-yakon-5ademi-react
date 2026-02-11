// Minimal Service Worker for PWA installability
// No aggressive caching - only caches on-demand for offline support

const CACHE_NAME = 'honak-yakon-v1';

// Install event - minimal setup for PWA installability
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Fetch event - network-first strategy
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses for offline use
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Return cached version if offline
        return caches.match(event.request);
      })
  );
});
