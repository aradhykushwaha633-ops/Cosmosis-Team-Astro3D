/* COSMOSIS offline pack (script4.js)
 * Put this file in the SAME folder as index.html. It is registered from the
 * "More -> Tools -> Save for offline" button in script3.js (needs https).
 * - Your own pages and scripts: network first, saved copy when offline
 * - Libraries and fonts from CDNs: saved copy first, refreshed in the background
 * - Live data (Google Sheets / Apps Script / chat bot) is never cached
 */
var CACHE = 'cosmosis-v1';
var LIVE = /(botpress|bpcontent|docs\.google\.com|script\.google\.com|script\.googleusercontent\.com|sheets\.googleapis\.com|firebase|supabase)/i;

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
  if (url.origin === self.location.origin) {
    e.respondWith(fetch(req).then(function (res) {
      if (res && res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
      return res;
    }).catch(function () { return caches.match(req).then(function (hit) { return hit || caches.match(req, { ignoreSearch: true }); }); }));
    return;
  }
  e.respondWith(caches.match(req).then(function (hit) {
    var net = fetch(req).then(function (res) {
      if (res && (res.ok || res.type === 'opaque')) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
      return res;
    }).catch(function () { return hit; });
    return hit || net;
  }));
});