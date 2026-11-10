/*!
 * COSMOSIS shared language engine  (lang.js)
 * ---------------------------------------------------------------
 * One language choice for the whole site. Pick a language in
 * project.html > Settings and every page (project2, chandayaan, mars,
 * sun, navic, aryabhatta, game) opens in that language automatically.
 * Pages that are already open (other tabs, the 3D-viewer iframe) switch live.
 *
 * Translation is done by the Google Translate widget, which needs an
 * internet connection. Text drawn inside a WebGL canvas cannot be translated.
 *
 * Public API:  window.CosmosLang = { list, get, set(code), onChange(fn), url(href) }
 */
(function () {
  'use strict';
  if (window.CosmosLang) return;

  var LANGS = [
    { code: 'en', native: 'English', english: 'English' },
    { code: 'hi', native: 'हिन्दी', english: 'Hindi' },
    { code: 'bn', native: 'বাংলা', english: 'Bengali' },
    { code: 'te', native: 'తెలుగు', english: 'Telugu' },
    { code: 'mr', native: 'मराठी', english: 'Marathi' },
    { code: 'ta', native: 'தமிழ்', english: 'Tamil' },
    { code: 'ur', native: 'اردو', english: 'Urdu' },
    { code: 'gu', native: 'ગુજરાતી', english: 'Gujarati' },
    { code: 'kn', native: 'ಕನ್ನಡ', english: 'Kannada' },
    { code: 'ml', native: 'മലയാളം', english: 'Malayalam' },
    { code: 'or', native: 'ଓଡ଼ିଆ', english: 'Odia' },
    { code: 'pa', native: 'ਪੰਜਾਬੀ', english: 'Punjabi' },
    { code: 'as', native: 'অসমীয়া', english: 'Assamese' },
    { code: 'ne', native: 'नेपाली', english: 'Nepali' },
    { code: 'sd', native: 'سنڌي', english: 'Sindhi' }
  ];
  var KEY = 'cosmosis_lang';
  var root = document.documentElement;
  var listeners = [];

  function find(code) { for (var i = 0; i < LANGS.length; i++) if (LANGS[i].code === code) return LANGS[i]; return null; }
  function valid(code) { return find(code) ? code : null; }

  /* ---------- storage: localStorage + cookie + URL param (file:// safe) ---------- */
  function readParam() {
    try { var m = /[?&]lang=([a-z]{2,3})/i.exec(location.search); return m ? valid(m[1].toLowerCase()) : null; } catch (e) { return null; }
  }
  function readStore() { try { return valid(localStorage.getItem(KEY)); } catch (e) { return null; } }
  function readCookie() {
    try { var m = new RegExp('(?:^|; )' + KEY + '=([a-z]+)').exec(document.cookie); return m ? valid(m[1]) : null; } catch (e) { return null; }
  }
  function writeStore(code) {
    try { localStorage.setItem(KEY, code); } catch (e) { }
    try { document.cookie = KEY + '=' + code + ';path=/;max-age=31536000;SameSite=Lax'; } catch (e) { }
  }

  /* ---------- Google's own cookie, set on every domain variant so it always sticks ---------- */
  function gtCookie(code) {
    var host = location.hostname, parts = [';path=/'];
    var domains = [''];
    if (host && host !== 'localhost' && !/^[\d.]+$/.test(host) && host.indexOf(':') < 0) domains.push(';domain=' + host, ';domain=.' + host);
    domains.forEach(function (d) {
      try {
        document.cookie = 'googtrans=' + (code === 'en' ? ';expires=Thu, 01 Jan 1970 00:00:00 UTC' : '/en/' + code) + parts[0] + d;
      } catch (e) { }
    });
  }

  /* ---------- small UI: progress bar + status pill (works on every page) ---------- */
  var css = document.createElement('style');
  css.id = 'cl-css';
  css.textContent =
    'body{top:0!important}' +
    'body>.skiptranslate,iframe.skiptranslate,.goog-te-banner-frame,.goog-te-balloon-frame,#goog-gt-tt,.goog-tooltip,.goog-te-spinner-pos{display:none!important}' +
    '.goog-text-highlight,font{background:none!important;box-shadow:none!important}' +
    '#google_translate_element{position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none}' +
    '#cl-bar{position:fixed;left:0;right:0;top:0;height:3px;z-index:2147483000;pointer-events:none;opacity:0;transition:opacity .3s;overflow:hidden}' +
    '#cl-bar::after{content:"";position:absolute;top:0;bottom:0;width:40%;border-radius:3px;background:linear-gradient(90deg,transparent,#8b5cf6,#38bdf8,#f472b6,transparent);animation:clSlide 1s ease-in-out infinite}' +
    '@keyframes clSlide{from{left:-40%}to{left:100%}}' +
    '#cl-pill{position:fixed;left:50%;bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:2147483000;pointer-events:none;' +
    'padding:8px 16px;border-radius:999px;font:600 12px/1.2 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;letter-spacing:.02em;color:#e9e5ff;' +
    'background:rgba(15,23,42,.88);border:1px solid rgba(167,139,250,.5);box-shadow:0 8px 28px rgba(0,0,0,.45);backdrop-filter:blur(8px);' +
    'opacity:0;translate:-50% 14px;transition:opacity .35s,translate .45s cubic-bezier(.16,1,.3,1)}' +
    'html.cl-busy #cl-bar{opacity:1}' +
    '#cl-pill.on{opacity:1;translate:-50% 0}' +
    '#cl-veil{position:fixed;inset:0;z-index:2147482999;pointer-events:none;background:#02030a;opacity:0;transition:opacity .28s}' +
    '#cl-veil.on{opacity:1}';
  (document.head || root).appendChild(css);

  var bar, pill, veil, pillTimer;
  function ensureUI() {
    if (bar || !document.body) return;
    bar = document.createElement('div'); bar.id = 'cl-bar'; bar.setAttribute('translate', 'no'); bar.className = 'notranslate';
    pill = document.createElement('div'); pill.id = 'cl-pill'; pill.setAttribute('translate', 'no'); pill.className = 'notranslate'; pill.setAttribute('role', 'status');
    veil = document.createElement('div'); veil.id = 'cl-veil'; veil.setAttribute('translate', 'no'); veil.className = 'notranslate';
    document.body.appendChild(bar); document.body.appendChild(pill); document.body.appendChild(veil);
  }
  function say(text, ms) {
    ensureUI(); if (!pill) return;
    pill.textContent = text; pill.classList.add('on');
    clearTimeout(pillTimer); if (ms) pillTimer = setTimeout(function () { pill.classList.remove('on'); }, ms);
  }
  function busy(on) { root.classList.toggle('cl-busy', !!on); ensureUI(); }

  /* ---------- Google Translate loader ---------- */
  var gtPromise = null;
  function getHost() {
    var h = document.getElementById('google_translate_element');
    if (!h) { h = document.createElement('div'); h.id = 'google_translate_element'; h.setAttribute('aria-hidden', 'true'); (document.body || root).appendChild(h); }
    return h;
  }
  function loadGT() {
    if (gtPromise) return gtPromise;
    gtPromise = new Promise(function (resolve, reject) {
      var done = false;
      var t = setTimeout(function () { if (!done) { done = true; gtPromise = null; reject(new Error('timeout')); } }, 15000);
      window.__cosmosGTInit = function () {
        try {
          getHost();
          new google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: LANGS.map(function (l) { return l.code; }).join(','),
            autoDisplay: false
          }, 'google_translate_element');
          if (!done) { done = true; clearTimeout(t); resolve(); }
        } catch (e) { if (!done) { done = true; clearTimeout(t); gtPromise = null; reject(e); } }
      };
      var s = document.createElement('script');
      s.src = 'https://translate.google.com/translate_a/element.js?cb=__cosmosGTInit';
      s.async = true;
      s.onerror = function () { if (!done) { done = true; clearTimeout(t); gtPromise = null; reject(new Error('network')); } };
      (document.head || root).appendChild(s);
    });
    return gtPromise;
  }

  function wait(test, timeout, step) {
    return new Promise(function (resolve) {
      var t0 = Date.now();
      (function tick() {
        var v = test();
        if (v) return resolve(v);
        if (Date.now() - t0 > timeout) return resolve(null);
        setTimeout(tick, step || 80);
      })();
    });
  }
  function combo() { return document.querySelector('select.goog-te-combo'); }
  function isTranslated() { return root.classList.contains('translated-ltr') || root.classList.contains('translated-rtl'); }
  function fire(el) {
    var ev;
    try { ev = new Event('change', { bubbles: true }); } catch (e) { ev = document.createEvent('HTMLEvents'); ev.initEvent('change', true, true); }
    el.dispatchEvent(ev);
  }
  function hasOption(c, code) { for (var i = 0; i < c.options.length; i++) if (c.options[i].value === code) return true; return false; }

  /* ---------- core: apply a language to THIS page ---------- */
  var current = 'en', applied = 'en', token = 0, running = Promise.resolve();

  function reloadClean() {
    ensureUI(); if (veil) veil.classList.add('on');
    setTimeout(function () {
      var u = location.href.replace(/([?&])lang=[a-z]+&?/i, '$1').replace(/[?&]$/, '');
      location.href = u;       // GT cleared -> page comes back in English
    }, 300);
  }

  function apply(code, silent) {
    var my = ++token;
    var lang = find(code) || LANGS[0];
    return running = running.then(function () {
      if (my !== token) return;                         // a newer choice already replaced this one
      if (lang.code === applied && (lang.code === 'en' ? !isTranslated() : isTranslated())) { finish(); return; }

      busy(true);
      if (!silent) say(lang.code === 'en' ? 'Restoring English…' : 'Translating to ' + lang.native + ' (' + lang.english + ')…');
      gtCookie(lang.code);

      if (lang.code === 'en') {
        if (!isTranslated()) { applied = 'en'; finish(); return; }
        var c0 = combo();
        if (c0) {
          // try the in-place restore first
          if (hasOption(c0, 'en')) { c0.value = 'en'; fire(c0); } else { c0.selectedIndex = 0; fire(c0); }
          return wait(function () { return !isTranslated(); }, 1500).then(function (ok) {
            if (my !== token) return;
            if (ok) { applied = 'en'; finish(); } else { reloadClean(); }   // guaranteed fallback
          });
        }
        reloadClean(); return;
      }

      return loadGT().then(function () {
        return wait(combo, 9000);
      }).then(function (c) {
        if (my !== token) return;
        if (!c) throw new Error('combo');
        if (c.value !== lang.code) { c.value = lang.code; }
        fire(c);
        return wait(function () { return isTranslated() && combo() && combo().value === lang.code; }, 8000).then(function (ok) {
          if (my !== token) return;
          if (!ok) { c.value = lang.code; fire(c); }       // one gentle retry
          return wait(function () { return isTranslated(); }, 5000);
        });
      }).then(function (ok) {
        if (my !== token) return;
        if (!ok) throw new Error('noeffect');
        applied = lang.code;
        say(lang.native + ' ✓', 1600);
        finish();
      }).catch(function () {
        if (my !== token) return;
        busy(false);
        say('Could not translate. Check your internet connection and try again.', 4200);
      });
    });
  }
  function finish() { busy(false); if (pill && pill.textContent.indexOf('…') > -1) pill.classList.remove('on'); }

  /* ---------- public setters ---------- */
  function setLang(code, opts) {
    opts = opts || {};
    code = valid(code) || 'en';
    var changed = code !== current;
    current = code;
    if (!opts.quiet || opts.persist) writeStore(code);   // never echo a change that came from another tab (avoids stale write-backs)
    syncSelects();
    decorateLinks();
    if (!opts.quiet) broadcast(code);
    if (changed || opts.force) { apply(code, !!opts.silent); listeners.forEach(function (fn) { try { fn(code); } catch (e) { } }); }
    return code;
  }

  /* ---------- tell other tabs / iframes ---------- */
  var bc = null;
  try { if ('BroadcastChannel' in window) { bc = new BroadcastChannel('cosmosis-lang'); bc.onmessage = function (e) { if (e.data && e.data.lang) setLang(e.data.lang, { quiet: true }); }; } } catch (e) { }
  function broadcast(code) {
    try { if (bc) bc.postMessage({ lang: code }); } catch (e) { }
    // child iframes (e.g. the 3D viewer inside project.html)
    try { var fr = document.getElementsByTagName('iframe'); for (var i = 0; i < fr.length; i++) { try { fr[i].contentWindow.postMessage({ cosmosisLang: code }, '*'); } catch (e) { } } } catch (e) { }
  }
  window.addEventListener('storage', function (e) { if (e.key !== KEY) return; var v = readStore();   // always use the latest stored value, not a stale event
    if (v && v !== current) setLang(v, { quiet: true }); });
  window.addEventListener('message', function (e) {
    var d = e.data; if (!d || typeof d !== 'object') return;
    if (d.cosmosisLang && valid(d.cosmosisLang) && d.cosmosisLang !== current) setLang(d.cosmosisLang, { quiet: true, persist: true });
    if (d.cosmosisLangAsk && e.source) { try { e.source.postMessage({ cosmosisLang: current }, '*'); } catch (x) { } }
  });
  window.addEventListener('pageshow', function (e) { if (e.persisted) { var s = readStore(); if (s && s !== current) setLang(s, { quiet: true }); } });

  /* ---------- selects & links ---------- */
  function fillSelect(sel) {
    if (!sel.options.length) {
      sel.innerHTML = LANGS.map(function (l) { return '<option value="' + l.code + '">' + (l.native === l.english ? l.english : l.native + ' (' + l.english + ')') + '</option>'; }).join('');
    }
    sel.value = current;
  }
  function syncSelects() {
    var all = document.querySelectorAll('select[data-cosmos-lang],#languageSelect');
    for (var i = 0; i < all.length; i++) { fillSelect(all[i]); }
  }
  function withLang(href) {
    if (!href || /^(#|mailto:|tel:|javascript:|https?:|\/\/|data:|blob:)/i.test(href)) return href;
    if (!/\.html?(?:[?#]|$)/i.test(href)) return href;
    var hash = '', q = '', base = href, i = base.indexOf('#');
    if (i > -1) { hash = base.slice(i); base = base.slice(0, i); }
    i = base.indexOf('?'); if (i > -1) { q = base.slice(i + 1); base = base.slice(0, i); }
    q = q.split('&').filter(function (p) { return p && p.indexOf('lang=') !== 0; });
    if (current !== 'en') q.push('lang=' + current);
    return base + (q.length ? '?' + q.join('&') : '') + hash;
  }
  function decorateLinks() {
    var a = document.querySelectorAll('a[href]');
    for (var i = 0; i < a.length; i++) {
      var raw = a[i].getAttribute('href'), n = withLang(raw);
      if (n !== raw) a[i].setAttribute('href', n);
    }
  }
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return; var raw = a.getAttribute('href'), n = withLang(raw); if (n !== raw) a.setAttribute('href', n);
  }, true);

  /* ---------- boot ---------- */
  current = readParam() || readStore() || readCookie() || 'en';
  writeStore(current);
  if (current !== 'en') gtCookie(current);            // so Google translates the page the moment its script runs

  function boot() {
    ensureUI(); syncSelects(); decorateLinks();
    if (current !== 'en') apply(current, true);
    // inside an iframe? ask the parent page what language it is in right now
    if (window.parent && window.parent !== window) { try { window.parent.postMessage({ cosmosisLangAsk: 1 }, '*'); } catch (e) { } }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();

  window.CosmosLang = {
    list: LANGS,
    get: function () { return current; },
    set: function (c, o) { return setLang(c, o); },
    onChange: function (fn) { if (typeof fn === 'function') listeners.push(fn); },
    url: withLang,
    syncSelects: syncSelects
  };
})();