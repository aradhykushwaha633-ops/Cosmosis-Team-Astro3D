/*!
 * COSMOSIS fly-in animation  (fx.js)
 * ---------------------------------------------------------------
 * Panels, titles, buttons and HUD blocks glide in from all eight
 * compass directions (plus a zoom-out-of-depth entrance). Each element
 * picks the side that matches where it sits on the screen, so the left
 * side flies in from the left, the right from the right, the middle from
 * above, below or from depth. Respects "reduce motion".
 *
 * Add  <script src="fx.js"></script>  inside <head>.
 * Optional: <script src="fx.js" data-sel=".my-card,.my-title"></script>
 */
(function () {
  'use strict';
  var root = document.documentElement;
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
  if (RM || window.__cosmosFx) return;
  window.__cosmosFx = true;

  /* ---------- CSS (same classes as the inline engine in project/project2/chandayaan) ---------- */
  var css = document.createElement('style');
  css.id = 'fx-css';
  css.textContent =
    ':root{--fx-e:cubic-bezier(.16,1,.3,1)}' +
    '.fx-wait body{opacity:0}' +
    'html:not(.fx-wait) body{animation:fxFade .6s ease backwards}' +
    '@keyframes fxFade{from{opacity:0}}' +
    'body [data-fx]:not(.fx-in){opacity:0;translate:var(--fx-x,0) var(--fx-y,0);scale:var(--fx-s,1);rotate:var(--fx-r,0deg)}' +
    'body [data-fx].fx-fade:not(.fx-in){translate:0 0;scale:1;rotate:0deg}' +
    'body [data-fx].fx-run{transition:opacity var(--fx-t,.9s) var(--fx-e),translate var(--fx-t,.9s) var(--fx-e),scale var(--fx-t,.9s) var(--fx-e),rotate var(--fx-t,.9s) var(--fx-e);transition-delay:var(--fx-d,0s);will-change:opacity,translate,scale,rotate}' +
    '@media(prefers-reduced-motion:reduce){body [data-fx]{opacity:1!important;translate:none!important;scale:none!important;rotate:none!important;transition:none!important}html:not(.fx-wait) body{animation:none}}';
  document.head.appendChild(css);

  // keep the page invisible until the engine has placed everything (2.5 s failsafe)
  root.classList.add('fx-wait');
  setTimeout(function () { root.classList.remove('fx-wait'); }, 2500);

  /* ---------- what gets animated ---------- */
  var me = document.currentScript;
  var SEL = (me && me.getAttribute('data-sel')) || [
    '.vk-t,.vk-hud,.vk-ui',                     // sun, aryabhatta, chandayaan widgets
    '.mom-title,.mom-hint,.mom-bar',            // mars
    '#title,#infoBtn,#bot',                     // navic
    '.hud>*'                                    // game
  ].join(',');
  var SKIP = '[hidden],.panel,.card,#panel,#toast,#msg,#load,#err,#menu,#status,#info,#cl-bar,#cl-pill,#cl-veil';

  /* start offsets are unit vectors scaled by the viewport: [x, y, scale, rotate] */
  var D = {
    l: [-1, 0, 1, 0], r: [1, 0, 1, 0],
    u: [0, 1, 1, 0], d: [0, -1, 1, 0],               // 'u' rises up from below, 'd' drops in from above
    tl: [-1, -1, 1, -3], tr: [1, -1, 1, 3],
    bl: [-1, 1, 1, 3], br: [1, 1, 1, -3],
    z: [0, 0, .78, 0]                                  // zooms out of depth
  };
  var ORD = ['l', 'u', 'r', 'bl', 'z', 'br', 'tl', 'd', 'tr'];
  var all = new Set(), n = 0;

  function VX() { return Math.min(innerWidth * .22, 260); }
  function VY() { return Math.min(innerHeight * .16, 130); }
  // keep at least 24px of the box inside the viewport at the start pose (so it never starts fully off-screen)
  function clampX(el, x) {
    var r = el.getBoundingClientRect();
    if (x < 0) return Math.min(0, Math.max(x, 24 - r.right));
    if (x > 0) return Math.max(0, Math.min(x, innerWidth - 24 - r.left));
    return 0;
  }

  function pick(el) {
    var r = el.getBoundingClientRect(), k = n++;
    var cx = (r.left + r.width / 2) / Math.max(1, innerWidth);
    if (r.width > innerWidth * .7 || (cx > .34 && cx < .66)) return ['u', 'd', 'z', 'bl', 'tr', 'br', 'tl'][k % 7];
    return cx <= .34 ? ['l', 'tl', 'l', 'bl'][k % 4] : ['r', 'tr', 'r', 'br'][k % 4];
  }

  function run(el, st, d, t) {
    el.style.setProperty('--fx-d', d + 's'); el.style.setProperty('--fx-t', t + 's');
    el.classList.add('fx-run'); el.classList.toggle('fx-in', st === 'in'); el.classList.toggle('fx-fade', st === 'fade');
    clearTimeout(el._f); el._f = setTimeout(function () { el.classList.remove('fx-run'); }, (d + t) * 1e3 + 150);
  }
  function show(el, i) { if (!el.classList.contains('fx-in')) run(el, 'in', Math.min(i, 8) * .1, .95); }

  function prep(r) {
    r = r || document;
    var list = [];
    if (r.matches && r.matches(SEL)) list.push(r);
    var q = r.querySelectorAll ? r.querySelectorAll(SEL) : [];
    for (var i = 0; i < q.length; i++) list.push(q[i]);
    var f = innerWidth < 640 ? .55 : 1;
    list.forEach(function (el) {
      if (el.hasAttribute('data-fx') || (el.closest && el.closest(SKIP))) return;
      var par = el.parentElement, nest = par && par.closest('[data-fx]');
      var sib = par ? Array.prototype.filter.call(par.children, function (c) { return c.matches(SEL); }) : [el];
      var d = nest ? 'u' : sib.length > 2 ? ORD[sib.indexOf(el) % 9] : pick(el);
      var v = D[d], g = nest ? .35 : f;
      el.style.setProperty('--fx-x', Math.round(nest ? v[0] * VX() * g : clampX(el, v[0] * VX() * g)) + 'px');
      el.style.setProperty('--fx-y', Math.round(v[1] * VY() * g) + 'px');
      el.style.setProperty('--fx-s', nest ? .96 : v[2]);
      el.style.setProperty('--fx-r', (nest ? 0 : v[3]) + 'deg');
      el.setAttribute('data-fx', '');
      all.add(el);
    });
  }

  function settle() {
    var rows = [];
    all.forEach(function (el) {
      var r = el.getBoundingClientRect(), pending = !el.classList.contains('fx-in');
      var dx = pending ? parseFloat(el.style.getPropertyValue('--fx-x')) || 0 : 0, dy = pending ? parseFloat(el.style.getPropertyValue('--fx-y')) || 0 : 0;
      var top = r.top - dy, left = r.left - dx;                       // where it will end up, not where it starts
      if (r.width && r.height && top + r.height > 0 && top < innerHeight && left + r.width > 0 && left < innerWidth) rows.push([{ top: top, left: left }, el]);
    });
    rows.sort(function (a, b) { return a[0].top - b[0].top || a[0].left - b[0].left; });
    rows.forEach(function (x, i) { show(x[1], i); });
  }
  var st = 0;
  function settleSoon(ms) { clearTimeout(st); st = setTimeout(settle, ms || 120); }

  function start() {
    prep();
    // elements that exist now fly in together; ones built later by page scripts (e.g. mars) are picked up below
    requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.remove('fx-wait'); settle(); }); });
    setTimeout(settle, 700); setTimeout(settle, 2000);
    new MutationObserver(function (ms) {
      var added = false;
      ms.forEach(function (m) { m.addedNodes.forEach(function (x) { if (x.nodeType === 1) { prep(x); added = true; } }); });
      if (added) settleSoon(150);
    }).observe(document.body, { childList: true, subtree: true });
    addEventListener('resize', function () { settleSoon(250); });
    // replay when the tab comes back or the language changes (translated text changes sizes)
    if (window.CosmosLang) window.CosmosLang.onChange(function () { settleSoon(900); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();