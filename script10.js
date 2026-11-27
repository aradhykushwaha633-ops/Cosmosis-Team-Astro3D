/*! COSMOSIS script10.js - shared interface kit: favicon safety net, Go Back button on every project page, and crisp SVG icons in place of emoji.
 * Add <script src="script10.js" defer></script> to a page. Emoji are swapped only inside COSMOSIS's own panels, menus and cards. */
(function () {
  'use strict';
  if (window.CosmosUI) return;
  var P = {
    rocket: '<path d="M5 15c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9-.8-.8-2.1-.8-2.9-.1z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.9A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22 22 0 0 1-4 2z"/><path d="M9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0"/><path d="M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5"/>',
    volume: '<path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/>',
    mute: '<path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="m22 9-6 6M16 9l6 6"/>',
    trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.7V17c0 .6-.5 1-1.2 1.2C7.8 18.5 7 20 7 22M14 14.7V17c0 .6.5 1 1.2 1.2 1 .3 1.8 1.8 1.8 2.8"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>',
    cap: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    satellite: '<rect x="9.5" y="9.5" width="5" height="5" rx="1" transform="rotate(45 12 12)"/><rect x="2.6" y="8.4" width="6.4" height="3.2" rx=".6" transform="rotate(-45 5.8 10)"/><rect x="15" y="12.4" width="6.4" height="3.2" rx=".6" transform="rotate(-45 18.2 14)"/><path d="M12 15.5v3M10 19h4"/>',
    medal: '<circle cx="12" cy="15" r="5"/><path d="M8.5 11 6 2h5l1 5M15.5 11 18 2h-5l-1 5"/>',
    clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 12h6M9 16h4"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    up: '<path d="M12 19V5M5 12l7-7 7 7"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.4 1-3 0 1.5 1.1 2.5 2.5 2.5z"/>',
    dice: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8.5 8.5h.01M15.5 8.5h.01M12 12h.01M8.5 15.5h.01M15.5 15.5h.01" stroke-width="2.6"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    check: '<circle cx="12" cy="12" r="10"/><path d="m8 12.5 2.8 2.8L16 9.5"/>',
    planet: '<circle cx="12" cy="12" r="5.2"/><ellipse cx="12" cy="12" rx="10.5" ry="3.4" transform="rotate(-25 12 12)"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    scale: '<path d="M12 3v18M5 21h14M6 7h12"/><path d="m6 7-3 7a3.5 3.5 0 0 0 6 0L6 7zM18 7l-3 7a3.5 3.5 0 0 0 6 0l-3-7z"/>',
    radio: '<circle cx="12" cy="12" r="2"/><path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4M19 5a10 10 0 0 1 0 14M5 19A10 10 0 0 1 5 5"/>',
    cake: '<path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8M4 16s1-1 4-1 5 2 8 2 4-1 4-1M2 21h20M7 8v3M12 8v3M17 8v3M7 4h.01M12 4h.01M17 4h.01"/>',
    compass: '<circle cx="12" cy="12" r="10"/><path d="m16 8-2 6-6 2 2-6 6-2z"/>',
    home: '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M10 20v-6h4v6"/>',
    scroll: '<path d="M8 21h10a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    atom: '<circle cx="12" cy="12" r="1.5"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>',
    calc: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h.01M12 19h4"/>',
    telescope: '<path d="m3 11 14-6 2 5L5 16z"/><path d="m9 14-3 7M13 12l3 9M12 17v4"/>',
    mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6"/>',
    star: '<path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" fill="currentColor"/>',
    code: '<path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 5l-4 14"/>',
    puzzle: '<path d="M12 3a2 2 0 0 1 2 2v1h4a1 1 0 0 1 1 1v4h-1a2 2 0 1 0 0 4h1v4a1 1 0 0 1-1 1h-4v-1a2 2 0 1 0-4 0v1H6a1 1 0 0 1-1-1v-4h1a2 2 0 1 0 0-4H5V7a1 1 0 0 1 1-1h4V5a2 2 0 0 1 2-2z"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    book: '<path d="M4 19.5V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2 2 2 0 0 0 2 2h13"/>',
    tools: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
    drop: '<path d="M12 2.5s6.5 6.6 6.5 11.3a6.5 6.5 0 0 1-13 0C5.5 9.1 12 2.5 12 2.5z"/>',
    wind: '<path d="M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h8a2.5 2.5 0 1 1-2.5 2.5"/>',
    thermo: '<path d="M14 14.8V4a2 2 0 0 0-4 0v10.8a4 4 0 1 0 4 0z"/>',
    magnet: '<path d="M5 4v8a7 7 0 0 0 14 0V4h-4v8a3 3 0 0 1-6 0V4zM5 8h4M15 8h4"/>',
    back: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    diamond: '<path d="M12 2 22 12 12 22 2 12z"/>'
  };
  var MAP = { '🚀': 'rocket', '🔊': 'volume', '🔇': 'mute', '🏆': 'trophy', '🎓': 'cap', '🛰': 'satellite', '🏅': 'medal', '📋': 'clipboard', '☀': 'sun', '⬆': 'up', '🔥': 'flame', '🎲': 'dice', '🎯': 'target', '🔒': 'lock', '✅': 'check', '🪐': 'planet', '🌍': 'globe', '🌐': 'globe', '🌙': 'moon', '🌕': 'moon', '⚖': 'scale', '📡': 'radio', '🎂': 'cake', '🧭': 'compass', '🏠': 'home', '📜': 'scroll', '👁': 'eye', '⚛': 'atom', '🧮': 'calc', '🔭': 'telescope', '🎤': 'mic', '🤝': 'users', '⭐': 'star', '💻': 'code', '🧩': 'puzzle', '📊': 'chart', '📚': 'book', '🧰': 'tools', '💧': 'drop', '🫁': 'wind', '🌡': 'thermo', '🧲': 'magnet', '🔷': 'diamond' };
  var DOT = { '🔵': '#3b82f6', '🔴': '#ef4444', '🟡': '#eab308', '🟠': '#f97316', '⚪': '#e5e7eb', '🟤': '#92400e' };
  function svg(name, color) {
    if (color) return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7" fill="' + color + '"/></svg>';
    var inner = P[name]; if (!inner) return '';
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
  }
  var keys = Object.keys(MAP).concat(Object.keys(DOT)).sort(function (a, b) { return b.length - a.length; });
  var alt = keys.join('|'), SPLIT = new RegExp('(' + '(?:' + alt + ')' + '\\uFE0F?)', 'g'), TEST = new RegExp('(?:' + alt + ')');
  var SCOPE = '[id^="mo-"],[class*="mo-"],[class*="cq-"],[class*="cx-"],#section-home,#section-discover,#section-missions,#section-skills,#section-teacher,#section-exam,#section-community,nav,footer,header,#toastContainer,.panel-title-group,.rk-title';
  var SKIP = /^(SCRIPT|STYLE|TEXTAREA|INPUT|OPTION|SELECT|TITLE|CANVAS|SVG)$/i, NOT = '[data-cx-keep],[contenteditable],svg';
  function make(ch) {
    var c = ch.replace(/\uFE0F/g, ''), s = document.createElement('span'); s.className = 'cxi'; s.setAttribute('aria-hidden', 'true');
    s.innerHTML = DOT[c] ? svg('', DOT[c]) : svg(MAP[c]); return s;
  }
  function swap(root) {
    if (!root || !document.body) return;
    var nodes = [], tw = document.createTreeWalker(root.nodeType === 3 ? root.parentNode : root, NodeFilter.SHOW_TEXT, null), n;
    while ((n = tw.nextNode())) {
      if (!TEST.test(n.nodeValue)) continue; var p = n.parentElement;
      if (!p || SKIP.test(p.tagName) || p.closest(NOT) || !p.closest(SCOPE)) continue; nodes.push(n);
    }
    nodes.forEach(function (t) {
      var parts = t.nodeValue.split(SPLIT), f = document.createDocumentFragment();
      parts.forEach(function (x, i) { if (!x) return; if (i % 2) f.appendChild(make(x)); else f.appendChild(document.createTextNode(x)); });
      if (t.parentNode) t.parentNode.replaceChild(f, t);
    });
  }
  function css() {
    if (document.getElementById('cxi-css')) return;
    var s = document.createElement('style'); s.id = 'cxi-css';
    s.textContent = '.cxi{display:inline-flex;width:1.15em;height:1.15em;vertical-align:-.2em;align-items:center;justify-content:center;line-height:1}.cxi svg{width:100%;height:100%;display:block}' +
      '.cx-back{position:fixed;top:calc(env(safe-area-inset-top,0px) + 12px);left:max(12px,env(safe-area-inset-left,0px));z-index:99985;display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 14px 0 11px;border-radius:999px;color:#eef2fb;text-decoration:none;font:600 13px/1 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:linear-gradient(145deg,rgba(255,255,255,.16),rgba(255,255,255,.05));border:1px solid rgba(255,255,255,.22);-webkit-backdrop-filter:blur(16px) saturate(160%);backdrop-filter:blur(16px) saturate(160%);box-shadow:0 8px 24px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.25);cursor:pointer;transition:transform .18s,border-color .18s}' +
      '.cx-back:hover{transform:translateX(-2px);border-color:#7dd3fc}.cx-back:focus-visible{outline:2px solid #7dd3fc;outline-offset:2px}.cx-back svg{width:18px;height:18px}@media (max-width:520px){.cx-back span{display:none}.cx-back{width:40px;padding:0;justify-content:center}}@media print{.cx-back{display:none}}';
    document.head.appendChild(s);
  }
  /* favicon safety net (pages also carry static links) */
  function icons() {
    if (!document.querySelector('link[rel~="icon"]')) { var l = document.createElement('link'); l.rel = 'icon'; l.type = 'image/svg+xml'; l.href = 'icon1.svg'; document.head.appendChild(l); }
  }
  /* pages that already ship their own Go Back control never get a second one */
  function ownBack() {
    if (document.querySelector('.back-btn,.cosmo-back,#gbBack,#goBack,a.back,[data-cx-back]')) return true;
    var a = document.querySelectorAll('a[href]');
    for (var i = 0; i < a.length; i++) { if (a[i].classList.contains('cx-back')) continue; if (/^\s*(\u2190|\u2B05|go back|back\b)/i.test(a[i].textContent || '')) return true; }
    return false;
  }
  /* Go Back button on every page except the home page */
  function back() {
    var f = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (f === '' || f === 'index.html' || f === 'index2.html' || document.querySelector('.cx-back') || !document.body || ownBack()) return;
    var a = document.createElement('a'); a.className = 'cx-back'; a.href = 'index.html'; a.setAttribute('data-cx-back', ''); a.setAttribute('aria-label', 'Go back');
    a.innerHTML = svg('back') + '<span>Back</span>';
    a.addEventListener('click', function (e) {
      var same = false; try { same = document.referrer && new URL(document.referrer).origin === location.origin && history.length > 1; } catch (x) { }
      if (same) { e.preventDefault(); history.back(); }
    });
    document.body.appendChild(a);
  }
  /* thin reading-progress bar for pages that scroll */
  function progress() {
    var el = document.createElement('div'); el.setAttribute('aria-hidden', 'true'); el.style.cssText = 'position:fixed;top:0;left:0;height:3px;width:0;z-index:99984;background:linear-gradient(90deg,#7dd3fc,#a78bfa);pointer-events:none;transition:width .1s'; document.body.appendChild(el);
    var t = 0; function up() { t = 0; var h = document.documentElement.scrollHeight - innerHeight; el.style.width = h > innerHeight * .2 ? Math.min(100, scrollY / h * 100) + '%' : '0'; }
    addEventListener('scroll', function () { if (!t) t = requestAnimationFrame(up); }, { passive: true }); up();
  }
  var queue = new Set(), raf = 0;
  function flush() { raf = 0; queue.forEach(swap); queue.clear(); }
  function boot() {
    icons(); css(); back(); progress(); swap(document.body);
    new MutationObserver(function (ms) {
      ms.forEach(function (m) {
        if (m.type === 'characterData') { if (TEST.test(m.target.nodeValue || '')) queue.add(m.target); return; }
        m.addedNodes.forEach(function (x) { if (x.nodeType === 1 || (x.nodeType === 3 && TEST.test(x.nodeValue || ''))) queue.add(x); });
      });
      if (queue.size && !raf) raf = requestAnimationFrame(flush);
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  window.CosmosUI = { icon: function (n) { return svg(n); }, swap: swap };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
