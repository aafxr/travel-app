/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.


import {precacheAndRoute, createHandlerBoundToURL, cleanupOutdatedCaches,} from 'workbox-precaching';
import {StaleWhileRevalidate, NetworkFirst, CacheFirst} from 'workbox-strategies';
import {ExpirationPlugin} from 'workbox-expiration';
import {registerRoute} from 'workbox-routing';
import {clientsClaim, setCacheNameDetails} from 'workbox-core';

import {CACHE_VERSION} from "./static/constants";


const CACHE_NAME = 'TravelerCache_v' + CACHE_VERSION;
const PRECACHE_NAME = 'Precache';

setCacheNameDetails({
    prefix: PRECACHE_NAME,
    suffix: 'v' + CACHE_VERSION,
})


// const prefetch = [
//     process.env.REACT_APP_SERVER_URL + '/expenses/getSections/',
//     process.env.REACT_APP_SERVER_URL + '/main/currency/getList/',
// ]

clientsClaim();
// eslint-disable-next-line no-restricted-globals
const ignored = self.__WB_MANIFEST;

// const WB_MANIFEST = self.__WB_MANIFEST

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
precacheAndRoute(self.__WB_MANIFEST);
// cleanupOutdatedCaches()


// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
    // Return false to exempt requests from being fulfilled by index.html.
    ({request, url}) => {
        // If this isn't a navigation, skip.
        if (request.mode !== 'navigate') {
            return false;
        } // If this is a URL that starts with /_, skip.

        if (url.pathname.startsWith('/_')) {
            return false;
        } // If this looks like a URL for a resource, because it contains // a file extension, skip.

        // if (url.pathname.includes('api.')){
        //     return false //fetch(request)
        // }// If request to api we ignore cache strategy

        if (url.pathname.match(fileExtensionRegexp)) {
            return false;
        } // Return true to signal that we want to use the handler.

        return true;
    },
    createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin .png requests like those from in public/
registerRoute(
    // Add in any other file extensions or routing criteria as needed.
    ({url}) => url.origin === self.location.origin && /\.(png|jpg|jpeg|svg|ttf|woff|woff2|otf)$/i.test(url.pathname), // Customize this strategy as needed, e.g., by changing to CacheFirst.
    new StaleWhileRevalidate({
        cacheName: 'assets',
        plugins: [
            // Ensure that once this runtime cache reaches a maximum size the
            // least-recently used images are removed.
            new ExpirationPlugin({maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60}),
        ],
    })
);

registerRoute(
    ({url}) => url.origin === self.location.origin && /\.(html|css|js)$/i.test(url.pathname),
    new StaleWhileRevalidate({
        cacheName: 'src',
        plugins: [
            new ExpirationPlugin({ maxAgeSeconds: 30 * 24 * 60 * 60}),
        ],
    })
);

registerRoute(
    ({url}) => url.origin === self.location.origin && /\/main\/currency\/getList\/$/i.test(url.pathname),
    new CacheFirst({
        cacheName: 'api',
        plugins: [
            new ExpirationPlugin({maxAgeSeconds: 24 * 60 * 60}),
        ],
    })
);

registerRoute(
    ({url}) => {
        if (url.origin.includes('api')) {
            return (
                url.pathname.includes('getSections')
                || url.pathname.includes('currency/getList/')
            )
        }
        return false
    },
    new NetworkFirst({
        cacheName: CACHE_NAME,
        plugins:[
            new ExpirationPlugin({maxAgeSeconds:  24 * 60 * 60})
        ]
    })
)


// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Any other custom service worker logic can go here.


// Establish a cache name

self.addEventListener('fetch', (event) => {
    // Check if this is a navigation request
    if (event.request.mode === 'navigate') {
        // Open the cache
        event.respondWith(caches.open(CACHE_NAME).then((cache) => {
            // Go to the network first
            return fetch(event.request.url).then((fetchedResponse) => {
                cache.put(event.request, fetchedResponse.clone());

                return fetchedResponse;
            }).catch(() => {
                // If the network is unavailable, get
                return cache.match(event.request.url);
            });
        }));
    }

});

// self.addEventListener('install', (e) => {
//     console.log(prefetch)
//     e.waitUntil(
//         caches
//             .open(CACHE_NAME)
//             .then(async (cache) => {
//                 return await cache
//                     .addAll(
//                         prefetch.map((urlToPrefetch) => {
//                             return new Request(urlToPrefetch, {mode: "no-cors"});
//                         }),
//                     )
//                     .then(() => {
//                         console.log("All resources have been fetched and cached.");
//                     });
//             })
//             .catch((error) => {
//                 console.error("Pre-fetching failed:", error);
//             }),
//     );
// })
