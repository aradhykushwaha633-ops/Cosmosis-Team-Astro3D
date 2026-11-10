/*! COSMOSIS script7.js - click sounds for every page (Web Audio, no sound files needed)
 * Put it in the SAME folder as index.html and add  <script src="script7.js" defer></script>  to a page.
 * - A soft "tick" plays when a button, link, chip, tab, switch or drop-down is clicked.
 * - Back / close buttons get a lower "back" tone, switches get a "blip", picking a planet or part gets a "select" chime.
 * - On/off is remembered (localStorage) and shared by all pages. Any element with  data-sfx-toggle  works as the on/off switch;
 *   if a page has none, a small speaker button is added in the top-right corner.
 * - Pages can call  CosmosSound.play('select' | 'click' | 'back' | 'toggle' | 'chime')  for their own events (for example a 3D pick).
 * - Respects the browser rule that sound may only start after a tap or click. */
(function () {
    'use strict';
    if (window.CosmosSound) return;
    var KEY = 'cosmosis_sfx', ctx = null, master = null, lastAt = 0, on = true;
    try { on = localStorage.getItem(KEY) !== '0'; } catch (e) { }

    function ensure() {
        if (!ctx) {
            var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
            try { ctx = new AC(); master = ctx.createGain(); master.gain.value = .7; master.connect(ctx.destination); } catch (e) { ctx = null; return null; }
        }
        return ctx;
    }
    /* one note: type, start Hz, end Hz, length (s), peak gain, delay (s) */
    function note(type, f0, f1, len, vol, at) {
        var t = ctx.currentTime + (at || 0), o = ctx.createOscillator(), g = ctx.createGain();
        o.type = type; o.frequency.setValueAtTime(f0, t); if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + len);
        g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .008); g.gain.exponentialRampToValueAtTime(.0001, t + len);
        o.connect(g); g.connect(master); o.start(t); o.stop(t + len + .02);
    }
    var SOUNDS = {
        click: function () { note('sine', 1250, 760, .07, .09); note('triangle', 2500, 1500, .03, .02); },
        back: function () { note('sine', 760, 430, .09, .09); },
        toggle: function () { note('sine', 700, 700, .05, .07); note('sine', 1050, 1050, .07, .07, .05); },
        select: function () { note('sine', 660, 660, .1, .08); note('sine', 990, 990, .12, .08, .07); note('triangle', 1980, 1980, .1, .02, .07); },
        chime: function () { note('sine', 880, 880, .25, .06); note('sine', 1320, 1320, .3, .05, .09); note('sine', 1760, 1760, .35, .04, .18); }
    };
    function play(name) {
        if (!on) return; var c = ensure(); if (!c) return;
        var now = Date.now(); if (now - lastAt < 35) return; lastAt = now; /* one sound per click, even when elements are nested */
        var fn = SOUNDS[name] || SOUNDS.click, go = function () { try { fn(); } catch (e) { } };
        if (c.state === 'suspended') { var p = c.resume(); if (p && p.then) p.then(go, function () { }); else go(); } else go();
    }
    function setOn(v) {
        on = !!v; try { localStorage.setItem(KEY, on ? '1' : '0'); } catch (e) { }
        sync(); try { document.dispatchEvent(new CustomEvent('cosmosis-sfx', { detail: { on: on } })); } catch (e) { }
    }
    function sync() {
        var t = document.querySelectorAll('[data-sfx-toggle]');
        for (var i = 0; i < t.length; i++) {
            var b = t[i]; b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.classList.toggle('on', on);
            if (b.hasAttribute('data-sfx-label')) b.textContent = (on ? '🔊' : '🔇') + ' ' + b.getAttribute('data-sfx-label');
            else if (b.classList.contains('cx-sfx')) b.textContent = on ? '🔊' : '🔇';
            b.title = on ? 'Click sounds on (tap to mute)' : 'Click sounds off (tap to turn on)';
        }
    }
    var HIT = 'button,a[href],select,summary,[role=button],[role=tab],[onclick],input[type=checkbox],input[type=radio],input[type=range],input[type=submit],label[for],.cursor-pointer,.b,.vk-chip';
    function kind(el) {
        var s = (el.className && el.className.baseVal === undefined ? el.className : '') + ' ' + (el.getAttribute('aria-label') || '') + ' ' + (el.getAttribute('title') || '') + ' ' + (el.textContent || '').slice(0, 24);
        if (/(^|\s)(back|go back|close|cancel)(\s|$)|back-btn|vk-x|fx-x|[×✕]/i.test(s) || el.id === 'x') return 'back';
        if (el.type === 'checkbox' || el.type === 'radio' || /switch|toggle/i.test(el.className || '') || el.getAttribute('aria-pressed') !== null) return 'toggle';
        return 'click';
    }
    document.addEventListener('click', function (e) {
        var t = e.target; if (!t || !t.closest) return;
        var tog = t.closest('[data-sfx-toggle]'); if (tog) { setOn(!on); if (on) play('toggle'); return; }
        var el = t.closest(HIT); if (!el || el.disabled || el.getAttribute('aria-disabled') === 'true') return;
        play(kind(el));
    }, true);
    function mount() {
        sync(); if (document.querySelector('[data-sfx-toggle]') || !document.body) return;
        var b = document.createElement('button'); b.type = 'button'; b.className = 'cx-sfx'; b.setAttribute('data-sfx-toggle', ''); b.setAttribute('aria-label', 'Turn click sounds on or off');
        var st = document.createElement('style');
        st.textContent = '.cx-sfx{position:fixed;top:calc(env(safe-area-inset-top,0px) + 12px);right:max(14px,env(safe-area-inset-right,0px));z-index:1000;width:36px;height:36px;display:grid;place-items:center;border-radius:50%;border:1px solid rgba(255,255,255,.18);background:rgba(8,14,26,.55);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);color:#eef2fb;font-size:16px;line-height:1;cursor:pointer;padding:0;box-shadow:0 4px 18px rgba(0,0,0,.4)}.cx-sfx:hover{border-color:#e3b84a}.cx-sfx:focus-visible{outline:2px solid #e3b84a;outline-offset:2px}';
        document.head.appendChild(st); document.body.appendChild(b); sync();
    }
    window.CosmosSound = { play: play, setOn: setOn, toggle: function () { setOn(!on); }, get on() { return on; } };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();