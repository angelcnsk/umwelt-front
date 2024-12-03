/* eslint-env serviceworker */

/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.config.js > pwa > workboxMode is set to "injectManifest"
 */

import { clientsClaim } from 'workbox-core'
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'
import {NetworkFirst, StaleWhileRevalidate, CacheFirst} from 'workbox-strategies'
import { CacheableResponse } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'

self.skipWaiting()
clientsClaim()


registerRoute(
    new RegExp('https://api.umwelt.apeironws.com/api/'), 
    new NetworkFirst({
        cacheName: 'api',
        plugins:[
            new CacheableResponse({ statuses:[200]})
        ]
    })
);

registerRoute(
  new RegExp(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.VITE_apiKey}`), 
  new NetworkFirst({
      cacheName: 'google-api',
      plugins:[
          new CacheableResponse({ statuses:[200]})
      ]
  })
);

registerRoute(
  new RegExp("\\.(js|css|json)$"),
  new StaleWhileRevalidate({
      cacheName: 'statics',
      plugins:[
          new CacheableResponse({ statuses:[200]})
      ]
  })
);

registerRoute(
  new RegExp("\\.(png|jpg|gif|svg)$"),
  new CacheFirst({
      cacheName: 'images-cache',
      plugins: [
          new ExpirationPlugin({
            maxEntries: 50,
            maxAgeSeconds: 7 * 24 * 60 * 60
          })
      ]
  })
);

precacheAndRoute([
  { url: '/index.html', revision: null },
]);

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST)

cleanupOutdatedCaches()

// Non-SSR fallback to index.html
// Production SSR fallback to offline.html (except for dev)
registerRoute(
  new NavigationRoute(
    createHandlerBoundToURL('/index.html'), // Cambiar por '/offline.html' si usas un archivo dedicado
    { denylist: [/sw\.js$/, /workbox-(.)*\.js$/] }
  )
);
