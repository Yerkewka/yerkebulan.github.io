const cacheName = "v2";

// Call install event
self.addEventListener("install", event => {
  console.log("Service worker: installed");
});
// Call activate event
self.addEventListener("activate", event => {
  console.log("Service worker: activated");
  // Remove unwanted caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            console.log("Service Worker: Clearing old Cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
// Call fetch event
self.addEventListener("fetch", event => {
  console.log("Service Worker: Fetching");
  event.respondWith(
    fetch(event.request)
      .then(res => {
        // Make clone of response
        const resClone = res.clone();
        // Open cache
        caches.open(cacheName).then(cache => {
          // Add the response to the cache
          cache.put(event.request, resClone);
        });
        return res;
      })
      .catch(err => caches.match(e.request).then(res => res))
  );
});