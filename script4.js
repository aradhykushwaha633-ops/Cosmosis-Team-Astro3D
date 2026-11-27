/* COSMOSIS offline pack (script4.js)
 * Put this file in the SAME folder as index.html. It is registered from the
 * "More -> Tools -> Save for offline" button in script3.js (needs https).
 * - Your own pages and scripts: network first, saved copy when offline
 * - Libraries and fonts from CDNs: saved copy first, refreshed in the background
 * - Live data (Google Sheets / Apps Script / chat bot) is never cached
 */
var CACHE = 'cosmosis-v2';
var LIVE = /(botpress|bpcontent|docs\.google\.com|script\.google\.com|script\.googleusercontent\.com|sheets\.googleapis\.com|firestore\.googleapis\.com|identitytoolkit\.googleapis\.com|securetoken\.googleapis\.com|firebaseio|firebaseapp|googletagmanager|google-analytics|analytics\.google|challenges\.cloudflare|supabase)/i;

self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE && k.indexOf('cosmosis-') === 0; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
  if (LIVE.test(url.href)) return;
  var keep = function (res, copy) { if (res && res.status === 200 && copy) e.waitUntil(caches.open(CACHE).then(function (c) { return c.put(req, copy); }).catch(function () { })); };
  if (url.origin === self.location.origin) {
    e.respondWith(fetch(req).then(function (res) { keep(res, res.clone()); return res; })
      .catch(function () {
        return caches.match(req).then(function (hit) { return hit || caches.match(req, { ignoreSearch: true }); })
          .then(function (hit) { return hit || (req.mode === 'navigate' ? caches.match('404.html') || caches.match('index.html') : null); })
          .then(function (hit) { return hit || Response.error(); });
      }));
    return;
  }
  e.respondWith(caches.match(req).then(function (hit) {
    var net = fetch(req).then(function (res) { if (res && (res.status === 200 || res.type === 'opaque')) keep(res, res.clone()); return res; }).catch(function () { return hit || Response.error(); });
    return hit || net;
  }));
});
