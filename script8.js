/*! COSMOSIS script8.js - launch kit: HTTPS, cookie consent + Google Analytics, alt-text safety net, form spam protection, reviews and contact form.
 * Add <script src="script8.js" defer></script> to a page. Settings go in window.COSMOSIS_CONFIG BEFORE this file loads:
 *   window.COSMOSIS_CONFIG = { gaId: 'G-XXXXXXXXXX', turnstileKey: '0x4AAAA...' }   (both optional; nothing loads until they are set) */
(function () {
  'use strict';
  if (window.CosmosConsent) return;
  var CFG = window.COSMOSIS_CONFIG || {}, GA = CFG.gaId || '', TS = CFG.turnstileKey || '', KEY = 'cosmosis_consent';
  var $ = function (id) { return document.getElementById(id); };
  function jget(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function say(m, t) { if (typeof showToast === 'function') showToast(m, t || 'info'); }

  /* 9. HTTPS everywhere (local networks stay on http so development keeps working) */
  try { if (location.protocol === 'http:' && !/^(localhost|127\.|192\.168\.|10\.|\[::1\])/.test(location.hostname)) location.replace('https://' + location.host + location.pathname + location.search + location.hash); } catch (e) { }

  /* 12 + 13. Google Analytics only after the visitor says yes */
  function loadGA() {
    if (window.__gaOn || !/^G-[A-Z0-9]{6,}$/.test(GA) || GA === 'G-XXXXXXXXXX') return; window.__gaOn = 1;
    var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA; document.head.appendChild(s);
    window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); }; gtag('js', new Date()); gtag('config', GA, { anonymize_ip: true });
  }
  function state() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function choose(v) { try { localStorage.setItem(KEY, v); } catch (e) { } if (v === 'granted') loadGA(); else if (GA) window['ga-disable-' + GA] = true; var b = $('cx-consent'); if (b) b.remove(); }
  function banner() {
    if ($('cx-consent') || !document.body) return;
    if (!$('cx-consent-css')) { var st = document.createElement('style'); st.id = 'cx-consent-css'; st.textContent = '#cx-consent{position:fixed;left:50%;bottom:calc(16px + env(safe-area-inset-bottom,0px));translate:-50% 0;z-index:2147482000;width:min(560px,calc(100vw - 24px));padding:16px 18px;border-radius:16px;color:#eef2fb;font:13px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:linear-gradient(145deg,rgba(255,255,255,.14),rgba(255,255,255,.05));border:1px solid rgba(255,255,255,.2);-webkit-backdrop-filter:blur(20px) saturate(160%);backdrop-filter:blur(20px) saturate(160%);box-shadow:0 18px 50px rgba(0,0,0,.55)}#cx-consent p{margin:0 0 12px}#cx-consent a{color:#7dd3fc}#cx-consent .r{display:flex;gap:10px;flex-wrap:wrap}#cx-consent button{cursor:pointer;border-radius:10px;padding:8px 16px;font:600 13px system-ui;border:1px solid rgba(255,255,255,.25);background:transparent;color:#eef2fb}#cx-consent button.y{background:#7c3aed;border-color:#7c3aed}#cx-consent button:focus-visible{outline:2px solid #7dd3fc;outline-offset:2px}'; document.head.appendChild(st); }
    var d = document.createElement('div'); d.id = 'cx-consent'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', 'Cookie choices');
    d.innerHTML = '<p>We use Google Analytics to count visits and improve COSMOSIS. It only starts if you accept. Your lessons, scores and login stay in this browser either way. <a href="index20.html">Privacy policy</a></p><div class="r"><button type="button" class="y" data-v="granted">Accept analytics</button><button type="button" data-v="denied">No thanks</button></div>';
    d.addEventListener('click', function (e) { var v = e.target.getAttribute && e.target.getAttribute('data-v'); if (v) choose(v); });
    document.body.appendChild(d);
  }
  window.CosmosConsent = { open: banner, state: state };
  if (state() === 'granted') loadGA();

  /* 5. alt text safety net for any image that arrives without it */
  function fixAlt(img) {
    if (img.hasAttribute('alt')) return;
    var t = img.getAttribute('aria-label') || img.title || (img.closest('figure') ? img.closest('figure').textContent.trim().slice(0, 90) : '') || (img.currentSrc || img.src || '').split('/').pop().split('?')[0].replace(/\.\w+$/, '').replace(/[-_%0-9]+/g, ' ').trim();
    img.setAttribute('alt', t || 'COSMOSIS image');
  }

  /* 10. spam protection: hidden trap field, human-speed check, optional Cloudflare Turnstile */
  function turnstile(slot) {
    var go = function () { try { window.turnstile.render(slot, { sitekey: TS, theme: 'dark' }); } catch (e) { } };
    if (window.turnstile) return go();
    var s = document.createElement('script'); s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; s.async = true; s.onload = go; document.head.appendChild(s);
  }
  function token(form) { var t = form.querySelector('[name="cf-turnstile-response"]'); return t ? t.value : ''; }
  function guard(form) {
    if (form._g) return; form._g = 1;
    var hp = document.createElement('input'); hp.type = 'text'; hp.name = 'website'; hp.tabIndex = -1; hp.autocomplete = 'off'; hp.setAttribute('aria-hidden', 'true'); hp.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0'; form.appendChild(hp);
    var t0 = Date.now(); form.addEventListener('focusin', function () { if (!form._t) form._t = Date.now(); }, true);
    form.addEventListener('submit', function (e) {
      var bad = hp.value || Date.now() - (form._t || t0) < 2500 || (TS && !token(form));
      if (bad) { e.preventDefault(); e.stopImmediatePropagation(); say(TS && !token(form) ? 'Please tick "Verify you are human" first.' : 'Please take a moment and try again.'); }
    }, true);
    var slot = form.querySelector('[data-turnstile]'); if (slot && TS) turnstile(slot);
  }

  /* 15. six review boxes on the home page - text comes from script9.js, so only reviews you wrote are shown */
  function renderReviews() {
    var g = $('reviewGrid'); if (!g) return; var list = Array.isArray(CFG.reviews) ? CFG.reviews : [], h = '';
    for (var i = 0; i < 6; i++) {
      var r = list[i] || {}, text = String(r.text || '').trim(), n = Math.max(1, Math.min(5, Math.round(+r.rating) || 5));
      h += text ? '<article class="rv-box"><div class="rv-st" role="img" aria-label="' + n + ' out of 5 stars">' + '&#9733;'.repeat(n) + '&#9734;'.repeat(5 - n) + '</div><p class="rv-tx">&ldquo;' + esc(text.slice(0, 400)) + '&rdquo;</p><footer><b>' + esc(r.name || 'COSMOSIS learner') + '</b>' + (r.role ? '<span>' + esc(r.role) + '</span>' : '') + '</footer></article>'
        : '<article class="rv-box rv-empty" aria-label="Review placeholder"><div class="rv-st" aria-hidden="true">&#9734;&#9734;&#9734;&#9734;&#9734;</div><p class="rv-tx">Your review goes here.</p></article>';
    }
    g.innerHTML = h;
  }
  function wireForms() { document.querySelectorAll('form[onsubmit*="handlePostDispatch"]').forEach(guard); }

  function reviewCss() {
    if ($('rv-css')) return; var st = document.createElement('style'); st.id = 'rv-css';
    st.textContent = '#reviewGrid .rv-box{border-radius:20px;padding:22px;min-height:190px;display:flex;flex-direction:column;justify-content:space-between;gap:12px;background:linear-gradient(145deg,rgba(255,255,255,.12),rgba(255,255,255,.04));border:1px solid rgba(255,255,255,.18);-webkit-backdrop-filter:blur(18px) saturate(160%);backdrop-filter:blur(18px) saturate(160%);box-shadow:inset 0 1px 0 rgba(255,255,255,.22),0 16px 36px -16px rgba(0,0,0,.6);transition:transform .25s,border-color .25s}#reviewGrid .rv-box:hover{transform:translateY(-3px);border-color:rgba(125,211,252,.45)}#reviewGrid .rv-st{color:#f5b942;letter-spacing:3px;font-size:18px}#reviewGrid .rv-tx{margin:0;font-size:15px;line-height:1.6;opacity:.92}#reviewGrid .rv-box footer{display:flex;flex-direction:column;gap:2px;font-size:13px}#reviewGrid .rv-box footer span{opacity:.65}#reviewGrid .rv-empty{border-style:dashed;opacity:.7;justify-content:center;align-items:center;text-align:center}#reviewGrid .rv-empty .rv-st{color:rgba(245,185,66,.5)}';
    document.head.appendChild(st);
  }
  function boot() {
    reviewCss();
    document.querySelectorAll('img').forEach(fixAlt);
    new MutationObserver(function (ms) { ms.forEach(function (m) { m.addedNodes.forEach(function (x) { if (x.nodeType !== 1) return; if (x.tagName === 'IMG') fixAlt(x); else if (x.querySelectorAll) x.querySelectorAll('img').forEach(fixAlt); }); }); }).observe(document.body, { childList: true, subtree: true });
    wireForms(); renderReviews();
    if (state() === null) setTimeout(banner, 900);
    document.addEventListener('click', function (e) { var t = e.target.closest && e.target.closest('[data-cookie-settings]'); if (t) { e.preventDefault(); banner(); } });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
