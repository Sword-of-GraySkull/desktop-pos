var cacheName = 'pogo_cache';

self.addEventListener("install", function(event) {
    self.skipWaiting();
  var urlsToPrefetch = [
    "./css",
    "./js",
    "./static",
    "./images",
    "./asset-manifest.json"
  ];

  event.waitUntil(
    caches
      .open(cacheName)
      .then(function(cache) {
        return cache
          .addAll(
            urlsToPrefetch.map(function(urlToPrefetch) {
              return new Request(urlToPrefetch, { mode: "no-cors" });
            })
          )
          .then(function() {
            console.log("All resources have been fetched and cached.");
          });
      })
      .catch(function(error) {
        console.error("Pre-fetching failed:", error);
      })
  );
});



self.addEventListener('fetch', function(event) {

    // console.log('Handling fetch event for', event.request.url);
    // if (event.request.method != 'GET') return;
    // event.respondWith(
      
    //   // Opens Cache objects that start with 'font'.
    //   caches.open(cacheName).then(function(cache) {
    //     return cache.match(event.request).then(function(response) {
    //       if (response && response.ok) {
    //         // console.log('Found response in cache:', response);
    //         event.waitUntil(cache.add(event.request));
    //         return response;
    //       }
  
    //       return fetch(event.request).then(function(networkResponse) {
    //         cache.put(event.request, networkResponse.clone());
  
    //         return networkResponse;
    //       });
    //     }).catch(function(error) {
          
    //       // Handles exceptions that arise from match() or fetch().
    //       console.error('Error in fetch handler:', error);
  
    //       throw error;
    //     });
    //   })
    // );
    // event.respondWith(
    //   caches.match(event.request).then(function(response) {
    //     return response || fetch(event.request);
    //   })
    // );
    event.respondWith(
      // Try the network
      fetch(event.request)
        .then(function(res) {
          return caches.open(cacheName)
            .then(function(cache) {
              // Put in cache if succeeds
              cache.put(event.request.url, res.clone());
              return res;
            })
        })
        .catch(function(err) {
            // Fallback to cache
            return caches.match(event.request);
        })
    );
  });

  self.addEventListener('activate', function(event) {
    // var expectedCacheNames = Object.values(CURRENT_CACHES);
    var cacheKeeplist = [cacheName];
    // Active worker won't be treated as activated until promise
    // resolves successfully.
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheKeeplist.indexOf(cacheName) === -1) {
              // console.log('Deleting out of date cache:', cacheName);
              
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });


// self.addEventListener("fetch", event => {
//   // Let the browser do its default thing
//   // for non-GET requests.

//   // Prevent the default, and handle the request ourselves.
//   event.respondWith(
//     (async function() {
//       // Try to get the response from a cache.
//       const cache = await caches.open("prefetch-cache-v");
//       const cachedResponse = await cache.match(event.request);

//       if (cachedResponse) {
//         // If we found a match in the cache, return it, but also
//         // update the entry in the cache in the background.
//         event.waitUntil(cache.add(event.request));
//         return cachedResponse;
//       }

//       // If we didn't find a match in the cache, use the network.
//       return fetch(event.request);
//     })()
//   );
// });
