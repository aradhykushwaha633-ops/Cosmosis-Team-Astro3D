/*!
 * COSMOSIS Learn Engine v2 (script3.js) - Top-Left Quiz Button Edition
 * - Hidden left-middle dock with three arrow tabs: AI, Learn and More
 * - Arrow icons positioned on the far right inside the tabs
 * - Animated slide-in drawers (AI quick panel / Learn dashboard)
 * - XP + levels + daily streak, per-mission quizzes, badges, confetti
 * - Premium certificate: live preview, editable name, PNG + PDF download
 * Works on every page. Add before </body> on EVERY page:  <script src="script3.js"></script>
 */
(function () {
  'use strict';
  if (window.__cosLearn) return; window.__cosLearn = 1;
  var KEY = 'cosmosis_learn_v1';
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
  var TAU = Math.PI * 2;

  /* ---------- question bank: [question, [options], correctIndex, explanation] ---------- */
  var M = {
    chandrayaan: {
      t: 'Chandrayaan-3', i: '🌕', b: 'Lunar Pioneer', q: [
        ['Which part of Chandrayaan-3 landed on the Moon?', ['Pragyan orbiter', 'Vikram lander', 'LVM3 booster', 'Aditya probe'], 1, 'Vikram is the lander; it carried the rover Pragyan.'],
        ['When did Chandrayaan-3 touch down?', ['23 Aug 2023', '5 Nov 2013', '19 Apr 1975', '2 Sep 2023'], 0, 'Touchdown was on 23 August 2023.'],
        ['What was the name of the rover?', ['Vikram', 'Pragyan', 'Drishti', 'Aryabhata'], 1, 'Pragyan means "wisdom" in Sanskrit.'],
        ['Which rocket launched Chandrayaan-3?', ['PSLV', 'GSLV Mk I', 'LVM3', 'SSLV'], 2, 'LVM3 carried it to orbit on 14 July 2023.'],
        ['Chandrayaan-3 landed near the Moon\'s…', ['Equator', 'North pole', 'South polar region', 'Far side centre'], 2, 'It landed near the lunar south pole, a first for any nation.']]
    },
    mars: {
      t: 'Mangalyaan', i: '🔴', b: 'Mars Voyager', q: [
        ['What does Mangalyaan study?', ['Jupiter', 'Mars', 'The Sun', 'Venus'], 1, 'Mangalyaan is the Mars Orbiter Mission (MOM).'],
        ['When did it enter Mars orbit?', ['24 Sep 2014', '5 Nov 2013', '23 Aug 2023', '3 May 2026'], 0, 'It reached Mars orbit on 24 September 2014.'],
        ['India became the first nation to reach Mars orbit…', ['After 10 tries', 'On its first attempt', 'Using a US rocket', 'With a crew'], 1, 'India succeeded on the very first attempt.'],
        ['Which rocket launched MOM?', ['PSLV', 'LVM3', 'GSLV Mk III', 'Saturn V'], 0, 'PSLV-C25 launched it on 5 Nov 2013.']]
    },
    aditya: {
      t: 'Aditya-L1', i: '☀️', b: 'Sun Watcher', q: [
        ['What is Aditya-L1\'s target?', ['Moon', 'Mars', 'The Sun', 'Saturn'], 2, 'It is India\'s first space-based solar observatory.'],
        ['What does "L1" mean?', ['Launch 1', 'Lagrange point 1', 'Level 1', 'Lunar orbit 1'], 1, 'L1 is a gravity-balanced point between Earth and the Sun.'],
        ['Roughly how far is L1 from Earth?', ['400 km', '36,000 km', '1.5 million km', '150 million km'], 2, 'About 1.5 million km, about 1% of the Earth–Sun distance.'],
        ['Why observe the Sun from L1?', ['It is hotter there', 'Uninterrupted view, no eclipses', 'It is closer to Mars', 'Cheaper fuel only'], 1, 'From L1 the Sun is always in view.']]
    },
    aryabhata: {
      t: 'Aryabhata', i: '🛰️', b: 'First Satellite', q: [
        ['Aryabhata was India\'s…', ['First satellite', 'First Moon mission', 'First rover', 'First crewed flight'], 0, 'Launched 19 April 1975.'],
        ['Who was it named after?', ['A rocket scientist', 'An ancient mathematician-astronomer', 'A king', 'An astronaut'], 1, 'Aryabhata was a 5th-century Indian mathematician and astronomer.'],
        ['In which year was it launched?', ['1963', '1975', '1984', '2008'], 1, 'Aryabhata went up in 1975.'],
        ['It orbited…', ['The Moon', 'Mars', 'The Earth', 'The Sun'], 2, 'It was an Earth-orbiting satellite for X-ray astronomy and aeronomy.']]
    },
    navic: {
      t: 'NavIC', i: '📡', b: 'Navigator', q: [
        ['NavIC stands for…', ['National Voyage in Cosmos', 'Navigation with Indian Constellation', 'New Aerial Vehicle for India', 'Network of Indian Clouds'], 1, 'NavIC = Navigation with Indian Constellation.'],
        ['NavIC is a…', ['Weather satellite', 'Regional navigation system', 'Moon rover', 'Space telescope'], 1, 'It provides positioning over India and the surrounding region.'],
        ['Who runs NavIC?', ['NASA', 'ESA', 'ISRO', 'JAXA'], 2, 'It is built and operated by ISRO.'],
        ['Its first satellite launched in…', ['July 2013', 'March 1999', 'Aug 2023', 'May 2026'], 0, 'IRNSS-1A launched on 1 July 2013.']]
    },
    drishti: {
      t: 'Drishti', i: '👁️', b: 'Eye in the Sky', q: [
        ['Drishti combines which two sensors?', ['Radio + GPS', 'SAR + Electro-Optical', 'Laser + Sonar', 'Infrared + Magnetometer'], 1, 'Radar (SAR) sees through clouds; optical gives colour images.'],
        ['Drishti orbits at about…', ['500 km', '36,000 km', '1.5 million km', '50 km'], 0, 'It is in a ~500 km sun-synchronous orbit.'],
        ['Why is SAR useful?', ['Works day, night and through clouds', 'Only works in daylight', 'Makes the satellite lighter', 'Reduces cost to zero'], 0, 'Radar supplies its own signal, so weather and darkness don\'t block it.']]
    },
    game: {
      t: 'Spacewalk Physics', i: '🚀', b: 'Spacewalker', q: [
        ['In space, a drifting tool keeps moving unless…', ['It gets tired', 'A force acts on it', 'Time passes', 'It is dark'], 1, 'Newton\'s first law: motion changes only when a force acts.'],
        ['Why is there almost no air resistance in orbit?', ['Gravity is zero', 'It is nearly a vacuum', 'Tools are light', 'Magnets'], 1, 'Orbit is nearly a vacuum, so little drag slows objects.'],
        ['Why do astronauts use tethers?', ['To breathe', 'To avoid drifting away', 'For communication only', 'For heat'], 1, 'Nothing stops a drifting astronaut without a tether or thrust.']]
    }
  };
  var FILES = { index3: 'chandrayaan', index4: 'mars', index5: 'aditya', index6: 'aryabhata', index8: 'navic', index9: 'drishti', index7: 'game' };
  var ids = Object.keys(M);
  var here = FILES[(location.pathname.split('/').pop() || '').replace(/\.html?$/, '')] || null;

  /* Suggested prompts for the AI panel */
  var PROMPTS = [
    'Explain Chandrayaan-3 like I am 10',
    'Why was Mangalyaan so low-cost?',
    'What is Aditya-L1 studying?',
    'Quiz me on Indian space missions'
  ];

  /* ---------- state (saved separately for every signed-in user) ---------- */
  function fresh() { return { xp: 0, best: {}, seen: {}, perfect: {}, streak: 0, lastDay: '', log: [], days: {}, ach: {} }; }
  function uid() {
    try {
      var u = JSON.parse(localStorage.getItem('cosmosis_current_user')); if (!u) return 'anon';
      var e = String(u.email || '').trim().toLowerCase();
      if (!e || e === 'guest@cosmosis.space') return 'guest';
      return e.replace(/[^a-z0-9@._-]/g, '_');
    } catch (e) { return 'anon'; }
  }
  var UID = uid();
  function skey(u) { return KEY + ':' + (u || UID); }
  function load(u) {
    var s = fresh();
    try {
      var raw = localStorage.getItem(skey(u));
      if (raw) s = Object.assign(s, JSON.parse(raw));
      else if (u !== 'guest' && u !== 'anon' && !localStorage.getItem(KEY + ':legacy-claimed')) {
        /* progress saved by the old shared version goes to the first real account that signs in, once */
        var old = localStorage.getItem(KEY);
        if (old) { s = Object.assign(s, JSON.parse(old)); localStorage.setItem(KEY + ':legacy-claimed', u); localStorage.setItem(skey(u), JSON.stringify(s)); }
      }
    } catch (e) { }
    s.best = s.best || {}; s.seen = s.seen || {}; s.perfect = s.perfect || {}; s.log = s.log || []; s.days = s.days || {}; s.ach = s.ach || {};
    s.xp = Math.max(0, +s.xp || 0);
    return s;
  }
  var S = load();
  function save() { try { localStorage.setItem(skey(), JSON.stringify(S)); } catch (e) { } }
  /* follow the signed-in user: if someone else signs in (or out), switch to their own progress */
  function syncUser() {
    var u = uid(); if (u === UID) return false;
    UID = u; S = load(); refresh();
    if (curP === 'learn' || curP === 'more') openPanel(curP);
    return true;
  }
  setInterval(syncUser, 1500);
  window.addEventListener('storage', function (e) { if (!e.key || e.key === 'cosmosis_current_user' || e.key === skey()) { if (!syncUser() && e.key === skey()) { S = load(); refresh(); } } });
  document.addEventListener('visibilitychange', function () { if (!document.hidden) syncUser(); });

  /* levels get harder: 100 XP for Level 2, then 25 XP more for each next level */
  var MAXLV = 30;
  function need(l) { return 100 + (l - 1) * 25; }
  function lvInfo(xp) {
    var l = 1, left = Math.max(0, xp);
    while (l < MAXLV && left >= need(l)) { left -= need(l); l++; }
    return { lv: l, into: l >= MAXLV ? need(l) : left, need: need(l), max: l >= MAXLV };
  }
  function lvl() { return lvInfo(S.xp).lv; }
  var RANKS = [[1, 'Space Cadet'], [3, 'Orbital Navigator'], [5, 'Flight Director'], [8, 'Mission Commander'], [12, 'Deep Space Pioneer'], [18, 'Galactic Legend']];
  function rank() { var l = lvl(), r = RANKS[0][1]; RANKS.forEach(function (x) { if (l >= x[0]) r = x[1]; }); return r; }
  function nextRank() { var l = lvl(), n = null; RANKS.forEach(function (x) { if (!n && x[0] > l) n = x; }); return n; }

  /* the one place XP is added: keeps the log, the weekly chart, level-ups and achievements in step */
  function gainXP(n, why, quiet) {
    n = Math.round(+n || 0); if (n <= 0) return 0;
    var pl = lvl(), d = dayKey();
    S.xp += n; S.days[d] = (S.days[d] || 0) + n;
    S.log.unshift({ t: Date.now(), n: n, w: why || 'XP' }); if (S.log.length > 30) S.log.length = 30;
    var ks = Object.keys(S.days).sort(); while (ks.length > 30) delete S.days[ks.shift()];
    checkAch(true); save(); refresh();
    if (!quiet && lvl() > pl) { toast('⬆️ Level up! Level ' + lvl() + ' · ' + rank()); confetti(); }
    return n;
  }
  var ACH = [
    ['first', '🛰️', 'First Contact', 'Explore your first mission page', function () { return Object.keys(S.seen).length >= 1; }],
    ['explorer', '🧭', 'Explorer', 'Visit 5 different mission pages', function () { return Object.keys(S.seen).length >= 5; }],
    ['clear1', '🏅', 'Mission Ready', 'Clear your first mission quiz', function () { return nDone() >= 1; }],
    ['perfect', '⭐', 'Flawless', 'Get a perfect score on a quiz', function () { return nPerfect() >= 1; }],
    ['streak3', '🔥', 'On Fire', 'Reach a 3-day streak', function () { return (S.streak || 0) >= 3; }],
    ['streak7', '🌋', 'Week Warrior', 'Reach a 7-day streak', function () { return (S.streak || 0) >= 7; }],
    ['daily', '🎲', 'Daily Driver', 'Complete 3 daily challenges', function () { return (S.dcount || 0) >= 3; }],
    ['focus', '⏱️', 'Deep Focus', 'Finish 3 focus sessions', function () { return (S.focus || 0) >= 3; }],
    ['skill', '🎯', 'Skill Builder', 'Reach the Skilled tier in any skill', function () { return SK.some(function (s) { return skillPct(s[2]) >= 50; }); }],
    ['lab', '🧪', 'Lab Tech', 'Clear 3 Skill Lab challenges', function () { return (S.lab || 0) >= 3; }],
    ['lv5', '🚀', 'Level 5', 'Reach Level 5', function () { return lvl() >= 5; }],
    ['all', '🏆', 'Grand Slam', 'Clear every mission quiz', function () { return nDone() === ids.length; }],
    ['lv10', '🌌', 'Level 10', 'Reach Level 10', function () { return lvl() >= 10; }]
  ];
  function checkAch(inner) {
    var got = 0;
    ACH.forEach(function (a) {
      if (S.ach[a[0]]) return;
      var ok = false; try { ok = a[4](); } catch (e) { }
      if (ok) { S.ach[a[0]] = Date.now(); got++; toast('🏆 Achievement: ' + a[2] + '  +10 XP'); S.xp += 10; S.log.unshift({ t: Date.now(), n: 10, w: 'Achievement: ' + a[2] }); }
    });
    if (got && !inner) { save(); refresh(); }
    return got;
  }
  function ago(t) { var s = Math.max(0, (Date.now() - t) / 1000); return s < 60 ? 'just now' : s < 3600 ? Math.floor(s / 60) + 'm ago' : s < 86400 ? Math.floor(s / 3600) + 'h ago' : Math.floor(s / 86400) + 'd ago'; }
  function nPerfect() { return ids.filter(function (k) { return S.perfect[k]; }).length; }
  function done(id) { return (S.best[id] || 0) >= Math.ceil(M[id].q.length * .6); }
  function nDone() { return ids.filter(done).length; }
  function user() { try { return (JSON.parse(localStorage.getItem('cosmosis_current_user')) || {}).name || 'Cadet'; } catch (e) { return 'Cadet'; } }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function dayKey(d) { d = d || new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  var DAILY_BONUS = 5;
  function dailyCheck() {
    var t = dayKey(); if (S.lastDay === t) return 0;
    var y = new Date(); y.setDate(y.getDate() - 1);
    S.streak = S.lastDay === dayKey(y) ? (S.streak || 0) + 1 : 1; S.lastDay = t; S.best = S.best || {}; DAILY_BONUS = 5 + Math.min(S.streak - 1, 6) * 2; gainXP(DAILY_BONUS, 'Day ' + S.streak + ' streak', true); return S.streak;
  }

  /* ---------- styles (Left Dock + Top-Left Quiz Button) ---------- */
  var st = document.createElement('style');
  st.textContent = [
    /* ===== dock: two tabs tucked in the left-middle ===== */
    '#cq-dock{position:fixed;left:0;top:50%;transform:translateY(-50%);z-index:99994;display:flex;flex-direction:column;gap:14px;align-items:flex-start;pointer-events:none;transition:opacity .4s,visibility .4s}',
    '#cq-dock.off{opacity:0;visibility:hidden}',
    '.cq-tab{pointer-events:auto;position:relative;display:flex;align-items:center;gap:9px;height:52px;padding:0 10px 0 14px;border:1px solid rgba(168,120,255,.55);border-left:0;border-radius:0 18px 18px 0;background:linear-gradient(135deg,rgba(34,26,80,.94),rgba(14,10,38,.94));-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);color:#fff;font:700 13px/1 Inter,system-ui,sans-serif;cursor:pointer;white-space:nowrap;box-shadow:6px 0 26px rgba(124,58,237,.35);transform:translateX(calc(-100% + 32px));transition:transform .55s cubic-bezier(.16,1,.3,1),box-shadow .3s,border-color .3s}',
    '#cq-dock:not(.off) .cq-tab{animation:cqDockIn 1.1s cubic-bezier(.16,1,.3,1) backwards}',
    '#cq-dock:not(.off) .cq-tab[data-p=ai]{animation-delay:.9s}#cq-dock:not(.off) .cq-tab[data-p=learn]{animation-delay:1.1s}',
    '.cq-tab::before{content:"";position:absolute;right:-12px;top:-7px;bottom:-7px;width:12px}',
    '.cq-tab:hover,.cq-tab:focus-visible{transform:translateX(0);box-shadow:8px 0 36px rgba(34,211,238,.5);border-color:rgba(103,232,249,.8);outline:none}',
    '.cq-tab.on,.cq-tab.on:hover{transform:translateX(calc(-100% + 32px));border-color:rgba(103,232,249,.9);box-shadow:8px 0 30px rgba(34,211,238,.55)}',
    '.cq-tab[data-p=ai]{border-color:rgba(34,211,238,.55)}',
    '.cq-arr{display:grid;place-items:center;width:22px;height:22px;flex:none;margin-left:auto;border-radius:50%;background:rgba(255,255,255,.14);transition:transform .55s cubic-bezier(.16,1,.3,1),background .3s;animation:cqNudge 2.2s ease-in-out 3s infinite}',
    '.cq-tab:hover .cq-arr,.cq-tab:focus-visible .cq-arr,.cq-tab.on .cq-arr{animation:none}',
    '.cq-tab.on .cq-arr{transform:rotate(180deg);background:rgba(34,211,238,.4)}',
    '.cq-ic{font-size:18px;position:relative}.cq-tab small{opacity:.7;font-weight:600;font-size:11px}',
    '.cq-dot{position:absolute;right:-3px;top:-3px;width:8px;height:8px;border-radius:50%;background:#facc15;box-shadow:0 0 8px #facc15;transition:background .3s}.cq-dot.ok{background:#34d399;box-shadow:0 0 8px #34d399}',
    '@keyframes cqDockIn{from{transform:translateX(-100%)}}@keyframes cqNudge{0%,100%{transform:translateX(0)}50%{transform:translateX(4px)}}',

    /* ===== drawer (left-aligned) ===== */
    '#cq-scrim{position:fixed;inset:0;z-index:99990;background:radial-gradient(circle at 0% 50%,rgba(124,58,237,.32),rgba(3,2,12,.62) 62%);opacity:0;pointer-events:none;transition:opacity .5s}#cq-scrim.on{opacity:1;pointer-events:auto}',
    '#cq-drawer{position:fixed;left:14px;top:50%;z-index:99993;width:min(410px,calc(100vw - 28px));height:min(690px,calc(100vh - 28px));display:flex;flex-direction:column;overflow:hidden;color:#e9e5ff;font:14px/1.5 Inter,system-ui,sans-serif;border:1px solid transparent;border-radius:26px;',
    'background:linear-gradient(165deg,#1b1544,#0a0720) padding-box,linear-gradient(120deg,#8b5cf6,#22d3ee,#f472b6,#8b5cf6) border-box;background-size:100% 100%,300% 300%;',
    'box-shadow:0 30px 90px rgba(0,0,0,.65),0 0 70px rgba(124,58,237,.4);transform-origin:0% 50%;transform:perspective(1400px) translate(-118%,-50%) rotateY(26deg) scale(.9);opacity:0;visibility:hidden;transition:transform .85s cubic-bezier(.16,1,.3,1),opacity .45s,visibility 0s .85s}',
    '#cq-drawer.on{transform:perspective(1400px) translate(0,-50%) rotateY(0) scale(1);opacity:1;visibility:visible;transition:transform .85s cubic-bezier(.16,1,.3,1),opacity .4s,visibility 0s;animation:cqBorder 7s linear infinite}',
    '@keyframes cqBorder{from{background-position:0 0,0% 50%}to{background-position:0 0,150% 50%}}',
    '.cq-dh{display:flex;align-items:center;gap:12px;padding:18px 18px 12px;flex:none}',
    '.cq-di{width:46px;height:46px;border-radius:15px;display:grid;place-items:center;font-size:23px;background:linear-gradient(135deg,#7c3aed,#06b6d4);box-shadow:0 0 26px rgba(124,58,237,.65);animation:cqBreath 3s ease-in-out infinite}',
    '.cq-dh h3{margin:0;font:800 16px Orbitron,Inter,sans-serif;letter-spacing:.04em}.cq-dh p{margin:0;font-size:11.5px;opacity:.65}',
    '.cq-dx{margin-left:auto;width:34px;height:34px;border-radius:50%;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:#fff;font-size:20px;line-height:1;cursor:pointer;transition:.3s}.cq-dx:hover{background:rgba(244,63,94,.35);transform:rotate(90deg)}',
    '.cq-db{flex:1;overflow-y:auto;overflow-x:hidden;padding:4px 18px 20px;scrollbar-width:thin;scrollbar-color:rgba(139,92,246,.5) transparent}',
    '.cq-st{animation:cqUp .75s cubic-bezier(.16,1,.3,1) backwards;animation-delay:calc(var(--i,0) * 70ms + 300ms)}',
    '@keyframes cqUp{from{opacity:0;transform:translateX(-38px) scale(.95)}}',

    /* hero + rows (learn) */
    '.cq-hero{display:flex;align-items:center;gap:16px;padding:14px;border-radius:20px;background:linear-gradient(135deg,rgba(124,58,237,.28),rgba(6,182,212,.14));border:1px solid rgba(168,120,255,.35)}',
    '.cq-rank{font:700 10.5px Inter,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#67e8f9}.cq-lvl{font:800 26px Orbitron,sans-serif;background:linear-gradient(90deg,#c4b5fd,#67e8f9);-webkit-background-clip:text;background-clip:text;color:transparent;line-height:1.2}',
    '.cq-chips{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.cq-chips span{padding:6px 11px;border-radius:999px;font-size:11.5px;font-weight:700;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14)}',
    '.cq-h4{margin:14px 2px 8px;font:700 11px Inter,sans-serif;letter-spacing:.16em;text-transform:uppercase;opacity:.6}',
    '.cq-row{display:flex;align-items:center;gap:12px;padding:9px 11px;margin-bottom:8px;border-radius:15px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);transition:.3s}.cq-row:hover{background:rgba(139,92,246,.2);border-color:rgba(168,120,255,.5);transform:translateX(4px)}',
    '.cq-row.ok{border-color:rgba(250,204,21,.5);background:rgba(250,204,21,.08)}',
    '.cq-ri{width:38px;height:38px;flex:none;display:grid;place-items:center;font-size:20px;border-radius:12px;background:rgba(255,255,255,.08)}',
    '.cq-rm{flex:1;min-width:0}.cq-rm b{display:block;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cq-rm small{opacity:.65;font-size:11px}',
    '.cq-go{flex:none;padding:7px 13px;border:0;border-radius:10px;color:#fff;font:700 11.5px Inter,sans-serif;cursor:pointer;background:linear-gradient(135deg,#7c3aed,#06b6d4);transition:.25s}.cq-go:hover{transform:scale(1.07);box-shadow:0 0 16px rgba(34,211,238,.5)}',
    '.cq-certcard{margin-top:14px;padding:16px;border-radius:20px;text-align:center;border:1px dashed rgba(255,255,255,.25);background:rgba(255,255,255,.04)}',
    '.cq-certcard.ready{border:1px solid rgba(250,204,21,.7);background:linear-gradient(135deg,rgba(250,204,21,.16),rgba(244,114,182,.1));box-shadow:0 0 34px rgba(250,204,21,.25);animation:cqGold 2.6s ease-in-out infinite}',
    '@keyframes cqGold{50%{box-shadow:0 0 54px rgba(250,204,21,.5)}}',
    '.cq-link{background:none;border:0;color:#a5b4fc;opacity:.7;font-size:11.5px;cursor:pointer;margin-top:10px;text-decoration:underline}.cq-link:hover{opacity:1}',

    /* AI panel */
    '.cq-orb{position:relative;width:140px;height:140px;margin:4px auto 16px}',
    '.cq-orb i{position:absolute;border-radius:50%}',
    '.cq-orb .c{inset:30px;background:radial-gradient(circle at 33% 28%,#fff,#a5f3fc 20%,#8b5cf6 62%,#1e1b4b);box-shadow:0 0 44px #22d3ee,0 0 100px rgba(124,58,237,.7);animation:cqBreath 3s ease-in-out infinite}',
    '.cq-orb .r1{inset:14px;border:2px solid transparent;border-top-color:#22d3ee;border-bottom-color:#f472b6;animation:cqSpin 3.2s linear infinite}',
    '.cq-orb .r2{inset:2px;border:2px solid transparent;border-left-color:#a78bfa;border-right-color:#67e8f9;animation:cqSpin 5.4s linear infinite reverse}',
    '.cq-orb .r3{inset:-10px;border:1px dashed rgba(196,181,253,.45);animation:cqSpin 16s linear infinite}',
    '@keyframes cqSpin{to{transform:rotate(360deg)}}@keyframes cqBreath{50%{transform:scale(1.1);filter:brightness(1.25)}}',
    '.cq-stat{display:inline-flex;align-items:center;gap:8px;padding:6px 13px;border-radius:999px;font-size:11.5px;font-weight:700;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.15)}',
    '.cq-stat i{width:8px;height:8px;border-radius:50%;background:#facc15;box-shadow:0 0 8px #facc15}.cq-stat.ok i{background:#34d399;box-shadow:0 0 8px #34d399}',
    '.cq-pc{display:block;width:100%;text-align:left;margin:7px 0;padding:11px 14px;border-radius:14px;color:inherit;font:600 12.5px Inter,sans-serif;background:rgba(139,92,246,.12);border:1px solid rgba(139,92,246,.38);cursor:pointer;transition:.3s}.cq-pc:hover{background:rgba(139,92,246,.35);transform:translateX(5px);border-color:#a78bfa}',
    '.cq-pc::before{content:"✦  ";color:#67e8f9}',

    /* ===== top-left quiz button (aligned with back-btn) ===== */
    '#cq-quiz{position:fixed;top:calc(env(safe-area-inset-top, 0px) + 12px);left:calc(env(safe-area-inset-left, 0px) + 132px);z-index:1000;display:inline-flex;align-items:center;height:36px;padding:0 14px;font:700 12px Inter,system-ui,sans-serif;color:#fff;background:linear-gradient(135deg,#7c3aed,#06b6d4);border:0;border-radius:999px;cursor:pointer;box-shadow:0 4px 18px rgba(0,0,0,.4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:calc(100vw - 155px);animation:cqIn .8s cubic-bezier(.16,1,.3,1) 1.2s backwards,cqPulse 2.4s ease-in-out 3s infinite}',
    '@media(max-width:560px){#cq-quiz{left:calc(env(safe-area-inset-left, 0px) + 124px);max-width:calc(100vw - 140px);font-size:11px;padding:0 10px}}',
    '#cq-veil{position:fixed;inset:0;z-index:99995;display:none;align-items:center;justify-content:center;background:rgba(5,3,18,.8);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);padding:14px}#cq-veil.on{display:flex;animation:cqFade .3s}',
    '#cq-box{width:min(560px,100%);max-height:92vh;overflow-x:hidden;overflow-y:auto;color:#e9e5ff;font:14px/1.5 Inter,system-ui,sans-serif;background:linear-gradient(160deg,#17123a,#0b0820);border:1px solid rgba(168,120,255,.45);border-radius:22px;padding:22px;box-shadow:0 0 60px rgba(124,58,237,.5);animation:cqPop .5s cubic-bezier(.16,1,.3,1)}',
    '#cq-box.wide{width:min(1000px,100%)}',
    '#cq-box h2{margin:0 0 4px;font:800 18px Orbitron,Inter,sans-serif;letter-spacing:.04em}#cq-box .cq-s,.cq-s{opacity:.65;font-size:12px;margin-bottom:12px}',
    '.cq-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.cq-x{background:none;border:0;color:#fff;font-size:22px;cursor:pointer;opacity:.7}',
    '.cq-bar{height:6px;border-radius:9px;background:rgba(255,255,255,.12);overflow:hidden;margin:6px 0 8px}.cq-bar i{display:block;height:100%;background:linear-gradient(90deg,#8b5cf6,#22d3ee);transition:width .8s cubic-bezier(.16,1,.3,1)}',
    '#cq-box .cq-bar{margin:6px 0 14px}',
    '.cq-wk{display:flex;align-items:flex-end;gap:7px;height:64px;margin:6px 2px 4px}.cq-wk div{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;gap:3px;font-size:9.5px;opacity:.85}.cq-wk i{display:block;width:100%;min-height:3px;border-radius:5px 5px 2px 2px;background:linear-gradient(180deg,#22d3ee,#7c3aed);transition:height .9s cubic-bezier(.16,1,.3,1)}.cq-wk .z i{background:rgba(255,255,255,.14)}.cq-wk .td span{color:#67e8f9;font-weight:800}',
    '.cq-ag{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:8px}.cq-ach{padding:9px 6px;border-radius:14px;text-align:center;font-size:10.5px;line-height:1.3;background:rgba(255,255,255,.04);border:1px dashed rgba(255,255,255,.18);opacity:.5;filter:grayscale(.8)}.cq-ach b{display:block;font-size:20px}.cq-ach.on{opacity:1;filter:none;border:1px solid rgba(250,204,21,.55);background:rgba(250,204,21,.09)}.cq-ach small{display:block;opacity:.7;font-size:9.5px;margin-top:2px}',
    '.cq-lg{display:flex;justify-content:space-between;gap:8px;padding:7px 11px;margin-bottom:5px;border-radius:11px;font-size:11.5px;background:rgba(255,255,255,.04)}.cq-lg b{color:#67e8f9;white-space:nowrap}.cq-lg small{opacity:.55;white-space:nowrap}',
    '.mo-skb{position:relative}.mo-skb .t{position:absolute;top:0;bottom:0;width:2px;background:rgba(255,255,255,.35)}.mo-skn{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:4px;font-size:10.5px;opacity:.75}.mo-skn .cq-go{padding:3px 10px;font-size:10.5px}',
    '.cq-o{display:block;width:100%;text-align:left;margin:7px 0;padding:11px 14px;border-radius:12px;color:inherit;font:inherit;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);cursor:pointer;transition:.2s}.cq-o:hover:not(:disabled){background:rgba(139,92,246,.28);transform:translateX(4px)}',
    '.cq-o.ok{background:rgba(34,197,94,.28);border-color:#22c55e;animation:cqPop .4s}.cq-o.no{background:rgba(239,68,68,.25);border-color:#ef4444;animation:cqShake .4s}',
    '.cq-ex{margin:10px 0;padding:10px 12px;border-left:3px solid #22d3ee;background:rgba(34,211,238,.08);border-radius:8px;font-size:13px;animation:cqFade .3s}',
    '.cq-btn{margin-top:8px;padding:10px 18px;border:0;border-radius:12px;color:#fff;font:700 13px Inter,sans-serif;cursor:pointer;background:linear-gradient(135deg,#7c3aed,#06b6d4);transition:.25s}.cq-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 22px rgba(124,58,237,.5)}.cq-btn.g{background:rgba(255,255,255,.1)}.cq-btn.gold{background:linear-gradient(135deg,#f59e0b,#fde68a);color:#3b2200}',
    '.cq-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px;margin:12px 0}.cq-card{padding:12px 8px;text-align:center;border-radius:14px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);font-size:12px}.cq-card.on{border-color:#facc15;background:rgba(250,204,21,.12);animation:cqPop .6s backwards}.cq-card.off{opacity:.4;filter:grayscale(1)}.cq-card b{display:block;font-size:26px;margin-bottom:4px}',
    '.cq-big{font:800 40px Orbitron,sans-serif;text-align:center;margin:6px 0;background:linear-gradient(90deg,#c4b5fd,#67e8f9);-webkit-background-clip:text;background-clip:text;color:transparent}',

    /* certificate preview */
    '.cq-nmrow{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:2px 0 14px;font-size:12px}.cq-nmrow label{opacity:.7;font-weight:600}',
    '.cq-nmrow input{flex:1;min-width:180px;padding:9px 13px;border-radius:11px;color:#fff;font:600 13px Inter,sans-serif;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.22);outline:none}.cq-nmrow input:focus{border-color:#22d3ee;box-shadow:0 0 0 3px rgba(34,211,238,.2)}',
    '.cq-cwrap{position:relative;min-height:220px;display:grid;place-items:center;perspective:1300px}',
    '.cq-tilt{position:relative;overflow:hidden;border-radius:10px;width:fit-content;max-width:100%;line-height:0;box-shadow:0 22px 60px rgba(0,0,0,.65),0 0 46px rgba(250,204,21,.2);transition:transform .25s ease-out;animation:cqReveal 1.1s cubic-bezier(.16,1,.3,1) backwards}',
    '.cq-tilt img{width:auto;height:auto;max-width:100%;max-height:calc(92vh - 245px);display:block}',
    '.cq-shine{position:absolute;inset:0;pointer-events:none;background:linear-gradient(115deg,transparent 38%,rgba(255,255,255,.38) 50%,transparent 62%);transform:translateX(-130%);animation:cqShine 2.4s 1.1s ease-in-out 2}.cq-tilt:hover .cq-shine{animation:cqShine 1.3s ease-in-out}',
    '.cq-sp{position:absolute;color:#fde68a;text-shadow:0 0 10px #facc15;pointer-events:none;line-height:1;animation:cqTw 2.2s ease-in-out infinite}',
    '.cq-act{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px}.cq-act .cq-btn{margin-top:0}',
    '.cq-load{display:flex;align-items:center;gap:12px;font-weight:600;opacity:.8}.cq-load i{width:22px;height:22px;border-radius:50%;border:3px solid rgba(255,255,255,.2);border-top-color:#22d3ee;animation:cqSpin .8s linear infinite}',
    '@keyframes cqReveal{from{opacity:0;transform:perspective(1300px) rotateX(26deg) translateY(50px) scale(.8)}}@keyframes cqShine{to{transform:translateX(130%)}}@keyframes cqTw{0%,100%{opacity:0;transform:scale(.3) rotate(0)}50%{opacity:1;transform:scale(1) rotate(45deg)}}',

    '.cq-toast{position:fixed;left:50%;top:18px;z-index:99999;transform:translateX(-50%);padding:12px 20px;border-radius:14px;color:#fff;font:700 13px Inter,sans-serif;background:linear-gradient(135deg,#7c3aed,#0891b2);box-shadow:0 0 30px rgba(124,58,237,.7);animation:cqDrop .6s cubic-bezier(.16,1,.3,1)}',
    '#cq-cv{position:fixed;inset:0;z-index:99998;pointer-events:none}',
    '@keyframes cqIn{from{opacity:0;transform:translateY(30px) scale(.9)}}@keyframes cqFade{from{opacity:0}}@keyframes cqPop{from{opacity:0;transform:scale(.88)}}',
    '@keyframes cqShake{25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}@keyframes cqDrop{from{opacity:0;transform:translate(-50%,-30px)}}',
    '@keyframes cqPulse{50%{box-shadow:0 0 0 10px rgba(124,58,237,0)}0%{box-shadow:0 0 0 0 rgba(124,58,237,.6)}}',
    '@media(max-width:520px){#cq-drawer{left:8px;width:calc(100vw - 16px);height:min(690px,calc(100vh - 16px))}.cq-db{padding-left:34px}.cq-tab{height:48px}}',
    '@media(prefers-reduced-motion:reduce){#cq-dock .cq-tab,#cq-quiz,#cq-box,.cq-o,.cq-card,.cq-toast,.cq-st,.cq-arr,.cq-di,.cq-orb i,.cq-tilt,.cq-shine,.cq-sp,.cq-certcard,#cq-drawer.on{animation:none!important}#cq-drawer{transition:opacity .2s,visibility 0s .2s;transform:translate(0,-50%)}#cq-drawer.on{transition:opacity .2s}}'
  ].join('\n');
  document.head.appendChild(st);

  /* ---------- helpers: toast (queued) + confetti ---------- */
  var tq = [], tbusy = false;
  function toast(msg) { tq.push(msg); if (!tbusy) nextToast(); }
  function nextToast() {
    var m = tq.shift(); if (!m) { tbusy = false; return; } tbusy = true;
    var t = document.createElement('div'); t.className = 'cq-toast fixed'; t.textContent = m; document.body.appendChild(t);
    setTimeout(function () { t.style.transition = 'opacity .45s'; t.style.opacity = 0; setTimeout(function () { t.remove(); nextToast(); }, 450); }, 2400);
  }
  function confetti(gold) {
    if (RM) return;
    var c = document.createElement('canvas'); c.id = 'cq-cv'; c.width = innerWidth; c.height = innerHeight; document.body.appendChild(c);
    var x = c.getContext('2d'), P = [], col = gold ? ['#facc15', '#fde68a', '#f59e0b', '#fff', '#22d3ee', '#f472b6'] : ['#8b5cf6', '#22d3ee', '#facc15', '#f472b6', '#4ade80'];
    for (var i = 0; i < (gold ? 190 : 130); i++) P.push({ x: innerWidth / 2, y: innerHeight * .6, vx: (Math.random() - .5) * 18, vy: -Math.random() * 16 - 4, s: 4 + Math.random() * 5, c: col[i % col.length], r: Math.random() * 6 });
    var f = 0;
    (function tick() {
      x.clearRect(0, 0, c.width, c.height);
      P.forEach(function (p) { p.vy += .35; p.x += p.vx; p.y += p.vy; p.r += .2; x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c; x.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .6); x.restore(); });
      if (++f < 130) requestAnimationFrame(tick); else c.remove();
    })();
  }

  /* ---------- UI shell ---------- */
  var veil, box, dock, drawer, scrim, dBody, dTitle, dSub, dIcon, curP = null, lastTab = null;
  var ARROW = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';

  function aiReady() { return !!(window.botpress || window.botpressWebChat); }
  function onAIPage() { return !!document.getElementById('section-ai'); }

  function mount() {
    /* dock with arrow inside tab placed on the right */
    dock = document.createElement('div'); dock.id = 'cq-dock'; dock.className = 'fixed off'; dock.setAttribute('role', 'toolbar'); dock.setAttribute('aria-label', 'Quick panels');
    dock.innerHTML =
      '<button type="button" class="cq-tab" data-p="ai" aria-expanded="false" aria-label="Open Cosmosis AI panel" title="Cosmosis AI">' +
      '<span>AI</span><span class="cq-ic">✨<span class="cq-dot" id="cq-dot"></span></span><span class="cq-arr">' + ARROW + '</span></button>' +
      '<button type="button" class="cq-tab" data-p="learn" aria-expanded="false" aria-label="Open Learn and progress panel" title="Learn &amp; progress">' +
      '<span class="cq-ic">🎓</span><span>Learn</span><small id="cq-lv"></small><span class="cq-arr">' + ARROW + '</span></button>' +
      '<button type="button" class="cq-tab" data-p="more" aria-expanded="false" aria-label="Open More options panel" title="More options">' +
      '<span class="cq-ic">⚙️</span><span>More</span><span class="cq-arr">' + ARROW + '</span></button>';
    document.body.appendChild(dock);
    dock.addEventListener('click', function (e) { var b = e.target.closest('.cq-tab'); if (b) { lastTab = b; togglePanel(b.dataset.p); } });

    /* scrim + drawer */
    scrim = document.createElement('div'); scrim.id = 'cq-scrim'; scrim.className = 'fixed'; scrim.onclick = closePanel; document.body.appendChild(scrim);
    drawer = document.createElement('aside'); drawer.id = 'cq-drawer'; drawer.className = 'fixed'; drawer.setAttribute('role', 'dialog'); drawer.setAttribute('aria-modal', 'false'); drawer.setAttribute('aria-label', 'Side panel');
    drawer.innerHTML = '<div class="cq-dh"><div class="cq-di" id="cq-di"></div><div><h3 id="cq-dt"></h3><p id="cq-ds"></p></div><button type="button" class="cq-dx" aria-label="Close panel">×</button></div><div class="cq-db" id="cq-db"></div>';
    document.body.appendChild(drawer);
    dBody = drawer.querySelector('#cq-db'); dTitle = drawer.querySelector('#cq-dt'); dSub = drawer.querySelector('#cq-ds'); dIcon = drawer.querySelector('#cq-di');
    drawer.querySelector('.cq-dx').onclick = closePanel;
    dBody.addEventListener('click', onDrawerClick);
    dBody.addEventListener('input', moreInput); dBody.addEventListener('change', moreInput);

    /* modal (quiz / certificate) */
    if (here) { var q = document.createElement('button'); q.id = 'cq-quiz'; q.className = 'fixed'; q.textContent = '🎯 Take the ' + M[here].t + ' quiz'; q.onclick = function () { quiz(here); }; document.body.appendChild(q); }
    veil = document.createElement('div'); veil.id = 'cq-veil'; veil.className = 'fixed'; veil.setAttribute('role', 'dialog'); veil.setAttribute('aria-modal', 'true');
    veil.innerHTML = '<div id="cq-box"></div>'; box = veil.firstChild; document.body.appendChild(veil);
    veil.onclick = function (e) { if (e.target === veil) close(); };
    addEventListener('keydown', function (e) { if (e.key === 'Escape') { if (veil.classList.contains('on')) close(); else if (curP) closePanel(); } });

    /* hide the dock while the sign-in overlay is up */
    var am = document.getElementById('authModal');
    function syncDock() { var blocked = !!am && !am.classList.contains('hidden'); dock.classList.toggle('off', blocked); if (blocked && curP) closePanel(); }
    if (am && window.MutationObserver) new MutationObserver(syncDock).observe(am, { attributes: true, attributeFilter: ['class'] });
    syncDock();

    /* AI status dot: yellow while connecting, green when the chat is ready (only on the page that hosts the AI) */
    (function pollAI(n) {
      var d = document.getElementById('cq-dot'); if (!d) return;
      if (!onAIPage()) { d.style.display = 'none'; return; }
      d.classList.toggle('ok', aiReady());
      if (!aiReady() && n < 30) setTimeout(function () { pollAI(n + 1); }, 600);
    })(0);

    refresh();

    /* first-visit XP + daily streak */
    var delay = 0;
    if (here && !S.seen[here]) { S.seen[here] = 1; gainXP(10, 'Explored a mission page', true); toast('🛰️ New mission explored  +10 XP'); delay = 1; }
    var sk = dailyCheck();
    if (sk) { refresh(); toast('🔥 Day ' + sk + ' streak  +' + DAILY_BONUS + ' XP'); }
  }

  function refresh() {
    var lv = document.getElementById('cq-lv'); if (lv) lv.textContent = 'Lv ' + lvl() + ' · ' + nDone() + '/' + ids.length;
  }
  function open(html, wide) { box.classList.toggle('wide', !!wide); box.innerHTML = html; veil.classList.add('on'); box.scrollTop = 0; }
  function close() { veil.classList.remove('on'); }
  function bind(sel, fn) { var n = box.querySelector(sel); if (n) n.onclick = fn; }

  /* ---------- drawer: open / close / render ---------- */
  var HEAD = {
    ai: { i: '✨', t: 'Cosmosis AI', s: 'Your space-science copilot' },
    learn: { i: '🎓', t: 'Mission Control', s: 'Progress · quizzes · certificate' },
    more: { i: '⚙️', t: 'More options', s: 'Listen · skills · study · tools' }
  };
  function togglePanel(p) { if (curP === p) closePanel(); else openPanel(p); }
  function openPanel(p) {
    if (veil.classList.contains('on')) close();
    syncUser(); curP = p;
    var h = HEAD[p]; dIcon.textContent = h.i; dTitle.textContent = h.t; dSub.textContent = h.s;
    dBody.innerHTML = p === 'ai' ? renderAI() : p === 'more' ? renderMore() : renderLearn(); dBody.scrollTop = 0;
    drawer.classList.add('on'); scrim.classList.add('on');
    dock.querySelectorAll('.cq-tab').forEach(function (b) { var on = b.dataset.p === p; b.classList.toggle('on', on); b.setAttribute('aria-expanded', on ? 'true' : 'false'); });
    if (p === 'more') moreInit();
    if (p === 'learn') setTimeout(function () { var r = document.getElementById('cq-ring'); if (r) r.style.strokeDashoffset = r.getAttribute('data-to'); drawer.querySelectorAll('.cq-bar i[data-to]').forEach(function (b) { b.style.width = b.getAttribute('data-to'); }); }, 120);
    setTimeout(function () { var x = drawer.querySelector('.cq-dx'); if (x && curP) x.focus({ preventScroll: true }); }, 350);
  }
  function closePanel() {
    curP = null; drawer.classList.remove('on'); scrim.classList.remove('on');
    dock.querySelectorAll('.cq-tab').forEach(function (b) { b.classList.remove('on'); b.setAttribute('aria-expanded', 'false'); });
    if (lastTab && document.activeElement && drawer.contains(document.activeElement)) { try { lastTab.focus({ preventScroll: true }); } catch (e) { } }
  }

  function weekTotal() { var s = 0, i, d; for (i = 0; i < 7; i++) { d = new Date(); d.setDate(d.getDate() - i); s += S.days[dayKey(d)] || 0; } return s; }
  function weekBars() {
    var vals = [], mx = 1, i, d, h = '', L = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    for (i = 6; i >= 0; i--) { d = new Date(); d.setDate(d.getDate() - i); var v = S.days[dayKey(d)] || 0; vals.push([v, L[d.getDay()], i === 0]); mx = Math.max(mx, v); }
    vals.forEach(function (x) { h += '<div class="' + (x[0] ? '' : 'z') + (x[2] ? ' td' : '') + '" title="' + x[0] + ' XP"><i style="height:' + (x[0] ? Math.max(8, Math.round(x[0] / mx * 100)) * .56 : 0) + 'px"></i><span>' + x[1] + '</span></div>'; });
    return h;
  }
  function renderLearn() {
    var pc = Math.round(nDone() / ids.length * 100), all = nDone() === ids.length, R = 40, C = 2 * Math.PI * R, inf = lvInfo(S.xp), lv = inf.lv, into = inf.into, pl = inf.max ? 100 : Math.max(0, Math.min(100, Math.round(into / inf.need * 100))), nr = nextRank();
    var h = '<div class="cq-st cq-hero" style="--i:0"><svg width="96" height="96" viewBox="0 0 110 110" style="flex:none"><circle cx="55" cy="55" r="' + R + '" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="9"/><circle id="cq-ring" data-to="' + (C * (1 - pc / 100)) + '" cx="55" cy="55" r="' + R + '" fill="none" stroke="#22d3ee" stroke-width="9" stroke-linecap="round" stroke-dasharray="' + C + '" stroke-dashoffset="' + C + '" transform="rotate(-90 55 55)" style="transition:stroke-dashoffset 1.5s cubic-bezier(.16,1,.3,1)"/><text x="55" y="61" text-anchor="middle" fill="#fff" font-size="22" font-weight="800">' + pc + '%</text></svg>' +
      '<div style="flex:1;min-width:0"><div class="cq-rank">' + rank() + '</div><div class="cq-lvl">Level ' + lv + '</div><div class="cq-bar" role="progressbar" aria-label="XP towards next level" aria-valuemin="0" aria-valuemax="' + inf.need + '" aria-valuenow="' + into + '"><i style="width:0" data-to="' + pl + '%"></i></div><div class="cq-s" style="margin:0">' + (inf.max ? 'MAX LEVEL · ' + S.xp + ' XP' : into + ' / ' + inf.need + ' XP · ' + (inf.need - into) + ' to Level ' + (lv + 1)) + '</div>' + (nr ? '<div class="cq-s" style="margin:2px 0 0;font-size:10.5px">Next rank: ' + nr[1] + ' at Level ' + nr[0] + '</div>' : '') + '</div></div>' +
      '<div class="cq-chips cq-st" style="--i:1"><span>🔥 ' + Math.max(1, S.streak || 0) + '-day streak</span><span>🏅 ' + nDone() + '/' + ids.length + ' cleared</span><span>⭐ ' + nPerfect() + ' perfect</span></div>' +
      '<div class="cq-h4 cq-st" style="--i:2">This week · ' + weekTotal() + ' XP</div><div class="cq-st cq-wk" style="--i:2" role="img" aria-label="XP earned per day this week">' + weekBars() + '</div>' +
      '<div class="cq-h4 cq-st" style="--i:2">Achievements · ' + Object.keys(S.ach).length + '/' + ACH.length + '</div><div class="cq-st cq-ag" style="--i:2">' + ACH.map(function (a) { var on = !!S.ach[a[0]]; return '<div class="cq-ach ' + (on ? 'on' : '') + '" title="' + esc(a[3]) + '"><b>' + (on ? a[1] : '🔒') + '</b>' + esc(a[2]) + '<small>' + esc(on ? 'Unlocked' : a[3]) + '</small></div>'; }).join('') + '</div>' +
      (S.log.length ? '<div class="cq-h4 cq-st" style="--i:2">Recent XP</div><div class="cq-st" style="--i:2">' + S.log.slice(0, 5).map(function (e) { return '<div class="cq-lg"><span>' + esc(e.w) + '</span><span><b>+' + e.n + '</b> <small>' + ago(e.t) + '</small></span></div>'; }).join('') + '</div>' : '') +
      '<div class="cq-h4 cq-st" style="--i:3">Missions</div>' +
      ids.map(function (id, n) {
        var m = M[id], d = done(id);
        return '<div class="cq-row cq-st ' + (d ? 'ok' : '') + '" style="--i:' + (n + 3) + '"><span class="cq-ri">' + m.i + '</span><div class="cq-rm"><b>' + esc(m.t) + '</b><small>' + (d ? '🏅 ' : '') + esc(m.b) + ' · ' + (S.best[id] || 0) + '/' + m.q.length + '</small></div><button type="button" class="cq-go" data-q="' + id + '">' + (d ? 'Replay' : 'Quiz') + '</button></div>';
      }).join('') +
      '<div class="cq-certcard cq-st ' + (all ? 'ready' : '') + '" style="--i:' + (ids.length + 3) + '">' +
      (all ? '<div style="font-size:30px">🏆</div><b>All missions cleared!</b><div class="cq-s" style="margin:4px 0 6px">Your certificate is ready.</div><button type="button" class="cq-btn gold" id="cq-cert">🎓 Claim certificate</button>'
        : '<div style="font-size:26px">🔒</div><b>Certificate locked</b><div class="cq-s" style="margin:4px 0 0">Clear ' + (ids.length - nDone()) + ' more mission' + (ids.length - nDone() === 1 ? '' : 's') + ' (60%+ on each quiz) to unlock it.</div>') +
      '</div><div style="text-align:center"><button type="button" class="cq-link" id="cq-rs">Reset my progress</button></div>';
    return h;
  }

  function renderAI() {
    var ok = aiReady();
    return '<div class="cq-st" style="--i:0;text-align:center"><div class="cq-orb" aria-hidden="true"><i class="r3"></i><i class="r2"></i><i class="r1"></i><i class="c"></i></div>' +
      '<div class="cq-stat ' + (ok ? 'ok' : '') + '"><i></i>' + (ok ? 'AI core online' : (onAIPage() ? 'Connecting…' : 'Opens on the AI page')) + '</div>' +
      '<p class="cq-s" style="margin:12px 6px 14px;font-size:12.5px;opacity:.75">Ask about missions, rockets and space science. Pick a question below or open the chat.</p></div>' +
      '<div class="cq-st" style="--i:1"><button type="button" class="cq-btn" id="cq-ai-go" style="width:100%;font-size:14px;padding:13px">💬 Start chatting</button></div>' +
      '<div class="cq-h4 cq-st" style="--i:2">Try asking</div>' +
      PROMPTS.map(function (p, n) { return '<button type="button" class="cq-pc cq-st" style="--i:' + (n + 3) + '" data-ask="' + n + '">' + esc(p) + '</button>'; }).join('') +
      '<div class="cq-st" style="--i:' + (PROMPTS.length + 3) + '"><button type="button" class="cq-btn g" id="cq-ai-page" style="width:100%;margin-top:12px">Open the full AI page →</button></div>';
  }

  function onDrawerClick(e) {
    var t = e.target.closest('button'); if (!t) return;
    if (t.dataset.mo) { moreClick(t); return; }
    if (t.dataset.q) { closePanel(); setTimeout(function () { quiz(t.dataset.q); }, 250); }
    else if (t.id === 'cq-cert') { closePanel(); setTimeout(function () { certPreview(); }, 250); }
    else if (t.id === 'cq-rs') { if (confirm('Reset ' + user() + "'s progress? This cannot be undone.")) { S = fresh(); save(); refresh(); openPanel('learn'); } }
    else if (t.id === 'cq-ai-go') askAI();
    else if (t.id === 'cq-ai-page') goAIPage();
    else if (t.dataset.ask != null) askAI(PROMPTS[+t.dataset.ask]);
  }

  /* ---------- AI hooks ---------- */
  function goAIPage() {
    if (onAIPage() && typeof window.switchTab === 'function') { closePanel(); window.switchTab('ai'); }
    else location.href = 'index.html#ai';
  }
  function askAI(text) {
    var bp = window.botpress;
    if (!bp && !window.botpressWebChat) {
      if (!onAIPage()) { location.href = 'index.html#ai'; return; }
      toast('🤖 AI is still connecting… try again in a moment'); return;
    }
    closePanel();
    try { if (bp && typeof bp.open === 'function') bp.open(); else if (window.botpressWebChat) window.botpressWebChat.sendEvent({ type: 'show' }); } catch (e) { }
    if (!text) return;
    setTimeout(function () {
      try {
        if (bp && typeof bp.sendMessage === 'function') { bp.sendMessage(text); return; }
        if (window.botpressWebChat && window.botpressWebChat.sendPayload) { window.botpressWebChat.sendPayload({ type: 'text', text: text }); return; }
      } catch (e) { }
      try { navigator.clipboard.writeText(text); toast('📋 Question copied: paste it into the chat'); } catch (e) { }
    }, 600);
  }

  /* ---------- quiz ---------- */
  function quiz(id) {
    var m = M[id], i = 0, ok = 0, lock = false;
    function step() {
      var q = m.q[i], p = Math.round(i / m.q.length * 100);
      open('<div class="cq-top"><h2>' + m.i + ' ' + esc(m.t) + '</h2><button class="cq-x" aria-label="Close">×</button></div><div class="cq-s">Question ' + (i + 1) + ' of ' + m.q.length + '</div><div class="cq-bar"><i style="width:' + p + '%"></i></div><p><b>' + esc(q[0]) + '</b></p>' +
        q[1].map(function (o, k) { return '<button class="cq-o" data-k="' + k + '">' + esc(o) + '</button>'; }).join('') + '<div id="cq-fb"></div>');
      bind('.cq-x', close); lock = false;
      box.querySelectorAll('.cq-o').forEach(function (b) {
        b.onclick = function () {
          if (lock) return; lock = true;
          var k = +b.dataset.k, right = k === q[2];
          if (right) ok++;
          box.querySelectorAll('.cq-o').forEach(function (x, n) { x.disabled = true; if (n === q[2]) x.classList.add('ok'); });
          if (!right) b.classList.add('no');
          document.getElementById('cq-fb').innerHTML = '<div class="cq-ex">' + (right ? '✅ Correct! ' : '❌ Not quite. ') + esc(q[3]) + '</div><button class="cq-btn" id="cq-nx">' + (i + 1 < m.q.length ? 'Next →' : 'See result') + '</button>';
          document.getElementById('cq-nx').onclick = function () { i++; i < m.q.length ? step() : result(); };
        };
      });
    }
    function result() {
      var n = m.q.length, old = S.best[id] || 0, gain = Math.max(0, ok - old) * 10, perfect = ok === n && !S.perfect[id];
      if (perfect) { S.perfect[id] = 1; gain += 20; }
      var wasDone = done(id), pl = lvl(); S.best[id] = Math.max(old, ok); gainXP(gain, 'Quiz: ' + m.t, true);
      var earned = !wasDone && done(id), allDone = nDone() === ids.length;
      open('<div class="cq-top"><h2>Mission report</h2><button class="cq-x" aria-label="Close">×</button></div><div class="cq-big">' + ok + ' / ' + n + '</div><div class="cq-s" style="text-align:center">' +
        (ok === n ? 'Perfect run! 🚀' : done(id) ? 'Mission cleared 🎉' : 'Almost there. Review and retry!') + '</div>' +
        '<div class="cq-grid"><div class="cq-card ' + (done(id) ? 'on' : 'off') + '"><b>🏅</b>' + esc(m.b) + '</div><div class="cq-card on"><b>+' + gain + '</b>XP earned</div></div>' +
        (lvl() > pl ? '<div class="cq-ex">⬆️ Level up! You are now Level ' + lvl() + ' · ' + rank() + '.</div>' : '') +
        (allDone ? '<div class="cq-ex">🏆 All missions cleared! Your certificate is ready.</div>' : '') +
        '<button class="cq-btn" id="cq-r">Retry</button> <button class="cq-btn g" id="cq-d">Mission Control</button>' + (allDone ? ' <button class="cq-btn gold" id="cq-c">🎓 Claim certificate</button>' : ''));
      bind('.cq-x', close); bind('#cq-r', function () { quiz(id); }); bind('#cq-d', function () { close(); openPanel('learn'); }); bind('#cq-c', function () { certPreview(); });
      if (earned || perfect) { confetti(); if (earned) toast('🏅 Badge unlocked: ' + m.b); }
    }
    step();
  }

  /* =====================================================================
   *  CERTIFICATE
   * ===================================================================== */
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { var s = seed >>> 0; return function () { s = (s + 0x6D2B79F5) >>> 0; var t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  /* ---------- leader signatures (transparent PNGs, drawn on the certificate) ---------- */
  var SIGS = {
    aradhy: 'data:image/png;base64,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',
    akshat: 'data:image/png;base64,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',
    lavish: 'data:image/png;base64,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'
  };
  var SIGIMG = {};
  function loadSigs() {
    return Promise.all(Object.keys(SIGS).map(function (k) {
      return new Promise(function (res) {
        if (SIGIMG[k] && SIGIMG[k].complete) return res();
        var im = new Image(); im.onload = im.onerror = function () { res(); }; im.src = SIGS[k]; SIGIMG[k] = im;
      });
    }));
  }

  function drawCert(c, name) {
    var W = c.width = 1600, H = c.height = 1131, x = c.getContext('2d');
    var distinction = nPerfect() === ids.length;
    var R = rng(hash(name + '|' + S.xp + '|' + ids.length));
    var FH = 'Orbitron,"Segoe UI",Arial,sans-serif', FS = 'Georgia,"Times New Roman",serif', FB = 'Inter,"Segoe UI",Arial,sans-serif';
    var FE = '"Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
    var gold = x.createLinearGradient(0, 0, W, H);
    [[0, '#fff1b8'], [.25, '#f5b73a'], [.5, '#fff7d6'], [.75, '#c98a12'], [1, '#ffe08a']].forEach(function (s) { gold.addColorStop(s[0], s[1]); });
    var dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    var certId = 'CSM-' + new Date().getFullYear() + '-' + ('000000' + hash(name + S.xp + dayKey()).toString(36).toUpperCase()).slice(-6);

    function glow(cx, cy, r, col) { var g = x.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(cx - r, cy - r, 2 * r, 2 * r); }
    function sparkle(cx, cy, r) { x.beginPath(); x.moveTo(cx, cy - r); x.quadraticCurveTo(cx, cy, cx + r, cy); x.quadraticCurveTo(cx, cy, cx, cy + r); x.quadraticCurveTo(cx, cy, cx - r, cy); x.quadraticCurveTo(cx, cy, cx, cy - r); x.fill(); }
    function rr(x0, y0, w, h, r) { x.beginPath(); x.moveTo(x0 + r, y0); x.arcTo(x0 + w, y0, x0 + w, y0 + h, r); x.arcTo(x0 + w, y0 + h, x0, y0 + h, r); x.arcTo(x0, y0 + h, x0, y0, r); x.arcTo(x0, y0, x0 + w, y0, r); x.closePath(); }
    function sw(t, sp) { var w = 0; for (var i = 0; i < t.length; i++) w += x.measureText(t[i]).width + (i < t.length - 1 ? sp : 0); return w; }
    function spaced(t, cx, y, sp) { var px = cx - sw(t, sp) / 2, a = x.textAlign; x.textAlign = 'left'; for (var i = 0; i < t.length; i++) { x.fillText(t[i], px, y); px += x.measureText(t[i]).width + sp; } x.textAlign = a; }
    function diamond(cx, cy, r, fill) { x.fillStyle = fill; x.beginPath(); x.moveTo(cx, cy - r); x.lineTo(cx + r, cy); x.lineTo(cx, cy + r); x.lineTo(cx - r, cy); x.closePath(); x.fill(); }
    function fade(x0, x1, y, col) { var g = x.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, 'rgba(250,204,21,0)'); g.addColorStop(.5, col || '#facc15'); g.addColorStop(1, 'rgba(250,204,21,0)'); x.strokeStyle = g; x.lineWidth = 2; x.beginPath(); x.moveTo(x0, y); x.lineTo(x1, y); x.stroke(); }

    /* --- background: deep space, nebulae, stars, rosette --- */
    var bg = x.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#070515'); bg.addColorStop(.5, '#150f3d'); bg.addColorStop(1, '#091230'); x.fillStyle = bg; x.fillRect(0, 0, W, H);
    glow(240, 180, 600, 'rgba(124,58,237,.42)'); glow(1400, 930, 650, 'rgba(6,182,212,.3)'); glow(1320, 150, 400, 'rgba(244,114,182,.2)'); glow(W / 2, H / 2, 560, 'rgba(250,204,21,.07)');
    var i;
    for (i = 0; i < 360; i++) { var sx = R() * W, sy = R() * H, sr = R() * 1.5 + .3; x.globalAlpha = .25 + R() * .75; x.fillStyle = '#fff'; if (sr > 1.55 && (sx < 230 || sx > W - 230 || sy < 140)) sparkle(sx, sy, sr * 4); else { x.beginPath(); x.arc(sx, sy, sr, 0, TAU); x.fill(); } }
    x.globalAlpha = 1;
    x.save(); x.translate(W / 2, H / 2 + 10); x.lineWidth = 1.2;
    x.strokeStyle = 'rgba(250,204,21,.075)'; for (i = 0; i < 48; i++) { x.beginPath(); x.ellipse(0, 0, 540, 200, i * Math.PI / 48, 0, TAU); x.stroke(); }
    x.strokeStyle = 'rgba(167,139,250,.07)'; for (i = 0; i < 36; i++) { x.beginPath(); x.ellipse(0, 0, 330, 120, i * Math.PI / 36 + .05, 0, TAU); x.stroke(); }
    x.restore();

    /* --- frame --- */
    x.lineJoin = 'round'; x.strokeStyle = gold; x.lineWidth = 8; x.strokeRect(34, 34, W - 68, H - 68);
    x.lineWidth = 2; x.strokeRect(58, 58, W - 116, H - 116);
    x.strokeStyle = 'rgba(250,204,21,.35)'; x.lineWidth = 1; x.strokeRect(70, 70, W - 140, H - 140);
    [[58, 58, 1, 1], [W - 58, 58, -1, 1], [58, H - 58, 1, -1], [W - 58, H - 58, -1, -1]].forEach(function (k) {
      x.save(); x.translate(k[0], k[1]); x.scale(k[2], k[3]); x.strokeStyle = gold; x.lineWidth = 3;
      x.beginPath(); x.moveTo(0, 118); x.lineTo(0, 0); x.lineTo(118, 0); x.stroke();
      x.beginPath(); x.arc(0, 0, 76, 0, Math.PI / 2); x.stroke(); x.lineWidth = 1.5; x.beginPath(); x.arc(0, 0, 52, 0, Math.PI / 2); x.stroke();
      diamond(30, 30, 10, '#facc15'); diamond(104, 12, 5, '#fde68a'); diamond(12, 104, 5, '#fde68a'); x.restore();
    });

    /* --- emblem: ringed planet --- */
    (function (cx, cy) {
      x.save(); x.translate(cx, cy); x.rotate(-.35); x.strokeStyle = gold; x.lineWidth = 5; x.beginPath(); x.ellipse(0, 0, 58, 15, 0, Math.PI, TAU); x.stroke(); x.restore();
      var pg = x.createRadialGradient(cx - 9, cy - 11, 2, cx, cy, 32); pg.addColorStop(0, '#e9d5ff'); pg.addColorStop(.55, '#7c3aed'); pg.addColorStop(1, '#2e1065');
      x.save(); x.shadowColor = '#8b5cf6'; x.shadowBlur = 28; x.fillStyle = pg; x.beginPath(); x.arc(cx, cy, 30, 0, TAU); x.fill(); x.restore();
      x.save(); x.translate(cx, cy); x.rotate(-.35); x.strokeStyle = gold; x.lineWidth = 5; x.beginPath(); x.ellipse(0, 0, 58, 15, 0, 0, Math.PI); x.stroke(); x.restore();
      x.fillStyle = '#fff'; sparkle(cx + 62, cy - 30, 9); sparkle(cx - 66, cy + 24, 6);
    })(W / 2, 112);

    x.textAlign = 'center'; x.textBaseline = 'alphabetic';
    x.fillStyle = '#c4b5fd'; x.font = '700 27px ' + FH; spaced('COSMOSIS  ·  ISRO EXPLORER ACADEMY', W / 2, 192, 7);

    /* --- title --- */
    var ts = 120, tw = 1100; do { x.font = '900 ' + ts + 'px ' + FH; ts -= 4; } while (sw('CERTIFICATE', 6) > tw && ts > 60);
    var tg = x.createLinearGradient(W / 2 - 520, 0, W / 2 + 520, 0); tg.addColorStop(0, '#fcd34d'); tg.addColorStop(.5, '#fff7d6'); tg.addColorStop(1, '#f59e0b');
    x.save(); x.shadowColor = 'rgba(250,204,21,.55)'; x.shadowBlur = 34; x.fillStyle = tg; spaced('CERTIFICATE', W / 2, 308, 6); x.restore();
    x.font = '600 27px ' + FH; x.fillStyle = '#e5e7eb'; var ocw = sw('OF COMPLETION', 16); spaced('OF COMPLETION', W / 2, 362, 16);
    fade(W / 2 - ocw / 2 - 230, W / 2 - ocw / 2 - 34, 352); fade(W / 2 + ocw / 2 + 34, W / 2 + ocw / 2 + 230, 352);

    /* --- recipient --- */
    x.font = 'italic 30px ' + FS; x.fillStyle = '#b8b5d9'; x.fillText('This certificate is proudly presented to', W / 2, 432);
    var ns = 112; x.font = 'italic 700 ' + ns + 'px ' + FS; while (x.measureText(name).width > 1150 && ns > 40) { ns -= 4; x.font = 'italic 700 ' + ns + 'px ' + FS; }
    var nw = x.measureText(name).width, ng = x.createLinearGradient(W / 2 - nw / 2, 0, W / 2 + nw / 2, 0); ng.addColorStop(0, '#67e8f9'); ng.addColorStop(.5, '#c4b5fd'); ng.addColorStop(1, '#f9a8d4');
    x.save(); x.shadowColor = 'rgba(103,232,249,.4)'; x.shadowBlur = 26; x.fillStyle = ng; x.fillText(name, W / 2, 548); x.restore();
    fade(W / 2 - 470, W / 2 + 470, 580); diamond(W / 2, 580, 9, '#facc15'); diamond(W / 2 - 40, 580, 4, '#fde68a'); diamond(W / 2 + 40, 580, 4, '#fde68a');

    x.font = '400 30px ' + FB; x.fillStyle = '#e5e7eb';
    x.fillText('for successfully clearing all ' + ids.length + ' missions of India\u2019s space journey,', W / 2, 640);
    x.fillText('reaching Level ' + lvl() + ' with ' + S.xp + ' XP.', W / 2, 678);

    /* --- rank pill --- */
    var rt = 'RANK  ·  ' + rank().toUpperCase() + (distinction ? '  ·  WITH DISTINCTION' : ''); x.font = '700 21px ' + FH;
    var rw = sw(rt, 4) + 70; rr(W / 2 - rw / 2, 708, rw, 46, 23); x.fillStyle = 'rgba(250,204,21,.1)'; x.fill(); x.strokeStyle = gold; x.lineWidth = 2; x.stroke();
    x.fillStyle = '#fde68a'; spaced(rt, W / 2, 739, 4);

    /* --- mission badges --- */
    var n = ids.length, gap = 14, cw = Math.min(190, (1300 - (n - 1) * gap) / n), tot = n * cw + (n - 1) * gap, bx = (W - tot) / 2, by = 774;
    ids.forEach(function (id, k) {
      var m = M[id], px = bx + k * (cw + gap);
      rr(px, by, cw, 78, 14); x.fillStyle = 'rgba(255,255,255,.06)'; x.fill(); x.strokeStyle = 'rgba(196,181,253,.5)'; x.lineWidth = 1.5; x.stroke();
      x.textAlign = 'center'; x.font = '30px ' + FE; x.fillStyle = '#fff'; x.fillText(m.i, px + cw / 2, by + 38);
      var fs = 15; x.font = '600 ' + fs + 'px ' + FB; while (x.measureText(m.t).width > cw - 16 && fs > 10) { fs--; x.font = '600 ' + fs + 'px ' + FB; }
      x.fillStyle = '#e5e7eb'; x.fillText(m.t, px + cw / 2, by + 64);
      x.beginPath(); x.arc(px + cw - 12, by + 12, 9, 0, TAU); x.fillStyle = '#facc15'; x.fill();
      x.strokeStyle = '#3b2200'; x.lineWidth = 2.4; x.beginPath(); x.moveTo(px + cw - 16, by + 12); x.lineTo(px + cw - 12.5, by + 15.5); x.lineTo(px + cw - 7, by + 8.5); x.stroke();
    });

    /* --- seal (compact stamp, right of the citation) --- */
    x.save(); x.translate(W - 250, 668); x.scale(.72, .72); x.translate(-W / 2, -948);
    (function (cx, cy) {
      function tail(s) { x.beginPath(); x.moveTo(cx + s * 46, cy + 40); x.lineTo(cx + s * 6, cy + 54); x.lineTo(cx + s * 26, cy + 106); x.lineTo(cx + s * 42, cy + 88); x.lineTo(cx + s * 68, cy + 96); x.closePath(); var g = x.createLinearGradient(0, cy + 40, 0, cy + 106); g.addColorStop(0, '#8b5cf6'); g.addColorStop(1, '#3b1d8f'); x.fillStyle = g; x.fill(); x.strokeStyle = '#facc15'; x.lineWidth = 2; x.stroke(); }
      tail(-1); tail(1);
      var np = 34, ro = 82, ri = 72; x.beginPath();
      for (var j = 0; j < np * 2; j++) { var a = j * Math.PI / np, r = j % 2 ? ri : ro; x.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); }
      x.closePath(); var sg = x.createRadialGradient(cx - 24, cy - 28, 6, cx, cy, ro); sg.addColorStop(0, '#fff7d6'); sg.addColorStop(.45, '#f5b73a'); sg.addColorStop(1, '#a96b06');
      x.save(); x.shadowColor = 'rgba(250,204,21,.6)'; x.shadowBlur = 30; x.fillStyle = sg; x.fill(); x.restore();
      x.strokeStyle = '#8a5300'; x.lineWidth = 2; x.beginPath(); x.arc(cx, cy, 62, 0, TAU); x.stroke(); x.lineWidth = 1; x.beginPath(); x.arc(cx, cy, 55, 0, TAU); x.stroke();
      x.beginPath(); for (j = 0; j < 10; j++) { var b = -Math.PI / 2 + j * Math.PI / 5, rb = j % 2 ? 14 : 34; x.lineTo(cx + Math.cos(b) * rb, cy + Math.sin(b) * rb); } x.closePath(); x.fillStyle = '#4c1d95'; x.fill();
      x.fillStyle = '#fff'; sparkle(cx - 38, cy - 40, 8);
    })(W / 2, 948);
    x.restore();

    /* --- signatures + meta --- */
    function sig(cx, key, who, role, line) {
      var im = SIGIMG[key];
      if (im && im.complete && im.naturalWidth) {
        var mh = 106, mw = 300, k = Math.min(mh / im.naturalHeight, mw / im.naturalWidth), dw = im.naturalWidth * k, dh = im.naturalHeight * k;
        x.save(); x.shadowColor = 'rgba(250,204,21,.35)'; x.shadowBlur = 8; x.drawImage(im, cx - dw / 2, 960 - dh, dw, dh); x.drawImage(im, cx - dw / 2, 960 - dh, dw, dh); x.restore();
      }
      x.strokeStyle = 'rgba(250,204,21,.75)'; x.lineWidth = 2; x.beginPath(); x.moveTo(cx - 150, 966); x.lineTo(cx + 150, 966); x.stroke();
      x.textAlign = 'center'; x.font = 'italic 700 27px ' + FS; x.fillStyle = '#fde68a'; x.fillText(who, cx, 998);
      x.font = '600 14px ' + FH; x.fillStyle = '#a5b4fc'; spaced(role, cx, 1021, 3);
      if (line) { x.font = '400 17px ' + FB; x.fillStyle = '#9ca3af'; x.fillText(line, cx, 1044); }
    }
    sig(300, 'aradhy', 'Aradhy Kushwaha', 'LEAD SYSTEMS ARCHITECT', 'Issued on ' + dateStr);
    sig(W / 2, 'akshat', 'Akshat Singh Sengar', 'LEAD AI ARCHITECT', '');
    sig(W - 300, 'lavish', 'Lavish', 'CONTENT WRITER', 'Certificate ID  ' + certId);
    return { id: certId };
  }

  function buildCert(name) {
    var f = (document.fonts && document.fonts.load)
      ? Promise.race([Promise.all([document.fonts.load('900 80px Orbitron'), document.fonts.load('700 20px Orbitron'), document.fonts.load('600 15px Inter')]), new Promise(function (r) { setTimeout(r, 1500); })]).catch(function () { })
      : Promise.resolve();
    return f.then(loadSigs).then(function () { var c = document.createElement('canvas'); var meta = drawCert(c, name); c.__id = meta.id; return c; });
  }

  function dl(href, file) { var a = document.createElement('a'); a.href = href; a.download = file; document.body.appendChild(a); a.click(); a.remove(); }
  function slug(s) { return (String(s).replace(/[^\w]+/g, '-').replace(/^-+|-+$/g, '') || 'cadet'); }

  /* minimal PDF writer: one page that holds the JPEG certificate */
  function makePDF(jpegDataUrl, iw, ih) {
    var bin = atob(jpegDataUrl.split(',')[1]), n = bin.length, jpg = new Uint8Array(n), k;
    for (k = 0; k < n; k++) jpg[k] = bin.charCodeAt(k);
    var pw = 842, ph = Math.round(842 * ih / iw), enc = new TextEncoder(), parts = [], off = [], len = 0;
    function add(d) { if (typeof d === 'string') d = enc.encode(d); parts.push(d); len += d.length; }
    function obj(i, body) { off[i] = len; add(i + ' 0 obj\n' + body + '\nendobj\n'); }
    add('%PDF-1.4\n');
    obj(1, '<</Type/Catalog/Pages 2 0 R>>');
    obj(2, '<</Type/Pages/Kids[3 0 R]/Count 1>>');
    obj(3, '<</Type/Page/Parent 2 0 R/MediaBox[0 0 ' + pw + ' ' + ph + ']/Resources<</XObject<</Im0 4 0 R>>>>/Contents 5 0 R>>');
    off[4] = len; add('4 0 obj\n<</Type/XObject/Subtype/Image/Width ' + iw + '/Height ' + ih + '/ColorSpace/DeviceRGB/BitsPerComponent 8/Filter/DCTDecode/Length ' + n + '>>\nstream\n'); add(jpg); add('\nendstream\nendobj\n');
    var content = 'q ' + pw + ' 0 0 ' + ph + ' 0 0 cm /Im0 Do Q';
    obj(5, '<</Length ' + content.length + '>>\nstream\n' + content + '\nendstream');
    var xref = len, s = 'xref\n0 6\n0000000000 65535 f \n';
    for (k = 1; k <= 5; k++) s += ('0000000000' + off[k]).slice(-10) + ' 00000 n \n';
    add(s + 'trailer\n<</Size 6/Root 1 0 R>>\nstartxref\n' + xref + '\n%%EOF');
    return new Blob(parts, { type: 'application/pdf' });
  }

  function certPreview(nameIn) {
    var name = (nameIn || user()).slice(0, 28), cur = null, token = 0, timer = 0, firstShow = true;
    open('<div class="cq-top"><h2>🎓 Certificate of Completion</h2><button class="cq-x" aria-label="Close">×</button></div>' +
      '<div class="cq-nmrow"><label for="cq-nm">Name on certificate</label><input id="cq-nm" maxlength="28" value="' + esc(name) + '" autocomplete="off" spellcheck="false"></div>' +
      '<div class="cq-cwrap" id="cq-cw"><div class="cq-load"><i></i>Forging your certificate…</div></div>' +
      '<div class="cq-act"><button class="cq-btn gold" id="cq-png">⬇ PNG image</button><button class="cq-btn" id="cq-pdf">⬇ PDF</button><button class="cq-btn g" id="cq-bk">Mission Control</button></div>', true);
    bind('.cq-x', close); bind('#cq-bk', function () { close(); openPanel('learn'); });
    var inp = box.querySelector('#cq-nm'), cw = box.querySelector('#cq-cw');
    function val() { return (inp.value.trim() || 'Cadet').slice(0, 28); }
    function show(c) {
      var wrap = document.createElement('div'); wrap.className = 'cq-tilt';
      var img = new Image(); img.alt = 'Certificate of completion for ' + val(); img.src = c.toDataURL('image/png'); wrap.appendChild(img);
      var sh = document.createElement('span'); sh.className = 'cq-shine'; wrap.appendChild(sh);
      if (!RM) for (var s = 0; s < 9; s++) { var sp = document.createElement('span'); sp.className = 'cq-sp'; sp.textContent = '✦'; sp.style.cssText = 'left:' + (6 + Math.random() * 88) + '%;top:' + (6 + Math.random() * 88) + '%;font-size:' + (10 + Math.random() * 14) + 'px;animation-delay:' + (Math.random() * 2.2).toFixed(2) + 's'; wrap.appendChild(sp); }
      if (!RM) {
        wrap.addEventListener('pointermove', function (e) { var r = wrap.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5; wrap.style.transform = 'perspective(1300px) rotateY(' + (px * 9).toFixed(2) + 'deg) rotateX(' + (-py * 9).toFixed(2) + 'deg)'; });
        wrap.addEventListener('pointerleave', function () { wrap.style.transform = ''; });
      }
      cw.innerHTML = ''; cw.appendChild(wrap);
      if (firstShow) { firstShow = false; setTimeout(function () { confetti(true); }, 350); }
    }
    function gen() { var my = ++token; buildCert(val()).then(function (c) { if (my !== token) return; cur = c; show(c); }); }
    inp.oninput = function () { clearTimeout(timer); timer = setTimeout(gen, 380); };
    bind('#cq-png', function () { if (!cur) return; dl(cur.toDataURL('image/png'), 'COSMOSIS-certificate-' + slug(val()) + '.png'); confetti(true); toast('🎓 Certificate downloaded!'); });
    bind('#cq-pdf', function () {
      if (!cur) return;
      try { var b = makePDF(cur.toDataURL('image/jpeg', .95), cur.width, cur.height), u = URL.createObjectURL(b); dl(u, 'COSMOSIS-certificate-' + slug(val()) + '.pdf'); setTimeout(function () { URL.revokeObjectURL(u); }, 4000); toast('📄 PDF downloaded!'); }
      catch (e) { toast('Could not build the PDF. Use the PNG instead.'); }
    });
    gen();
  }

  /* =====================================================================
   *  MORE OPTIONS drawer (v2)  -  Education & Skill Development
   *  Tabs:  Listen | Skills | Study | Tools
   *  - Double-click / double-tap any text to hear it (Web Speech API)
   *  - Skill profile, adaptive "next mission", daily challenge, space
   *    careers explorer, focus timer
   *  - Space dictionary, printable worksheets (works with no device in
   *    class), fact of the day, study notes
   *  - Offline pack (service worker), CSV progress report for teachers
   * ===================================================================== */
  var MKEY = 'cosmosis_more_v1';
  var MS = { dbl: true, dys: false, sp: false, calm: false, ruler: false, rate: 0.95, pitch: 1, voice: '', notes: '', tip: 0, tEnd: 0, tMin: 0 };
  try { MS = Object.assign(MS, JSON.parse(localStorage.getItem(MKEY) || '{}')); } catch (e) { }
  function saveMS() { try { localStorage.setItem(MKEY, JSON.stringify(MS)); } catch (e) { } }
  var HAS_TTS = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  var moTab = 'listen';

  var FACTS = [
    'Aryabhata, India\'s first satellite, was launched on 19 April 1975. It was named after the 5th-century Indian mathematician and astronomer.',
    'Mangalyaan reached Mars orbit on 24 September 2014. India became the first nation to do it on its very first attempt.',
    'Chandrayaan-3 touched down near the lunar south pole on 23 August 2023. The lander was named Vikram, and the rover was named Pragyan, which means wisdom.',
    'Aditya-L1 sits near the first Lagrange point, about 1.5 million kilometres from Earth, where it can watch the Sun without eclipses.',
    'NavIC stands for Navigation with Indian Constellation. Its first satellite, IRNSS-1A, was launched on 1 July 2013.',
    'In February 2017, a single PSLV rocket launched 104 satellites in one mission, a world record at that time.',
    'Chandrayaan-1, launched in 2008, carried an instrument that helped detect water molecules on the surface of the Moon.',
    'Radar satellites like Drishti can see through clouds and in the dark, because they send out their own signal.'
  ];
  var factIdx = Math.floor(Date.now() / 864e5) % FACTS.length;

  var TRAVEL = [
    ['index.html', '🏠', 'Home'], ['index3.html', '🌕', 'Chandrayaan-3'], ['index4.html', '🔴', 'Mangalyaan'],
    ['index5.html', '☀️', 'Aditya-L1'], ['index6.html', '🛰️', 'Aryabhata'], ['index8.html', '📡', 'NavIC'],
    ['index9.html', '👁️', 'Drishti'], ['index7.html', '🚀', 'Spacewalk'], ['index10.html', '📜', 'ISRO Journey']
  ];

  /* skills are built from quiz results, so they grow as the learner learns */
  var SK = [
    ['Physics & Motion', '⚛️', ['game', 'chandrayaan']],
    ['Orbits & Mathematics', '🧮', ['mars', 'aryabhata']],
    ['Solar & Planetary Science', '☀️', ['aditya', 'chandrayaan', 'mars']],
    ['Navigation & Geo-data', '🧭', ['navic', 'drishti']],
    ['Space History', '📜', ['aryabhata', 'mars', 'navic']]
  ];
  var CAREERS = {
    rocket: { i: '🚀', t: 'Launch-vehicle engineer', subj: 'Physics · Chemistry · Maths', skills: ['Mechanics and thermodynamics', 'Propulsion basics', 'CAD and simulation', 'Python or MATLAB'], path: ['Class 11-12: choose Physics, Chemistry and Maths.', 'B.Tech / B.E. in Aerospace, Mechanical or Chemical Engineering.', 'Space-focused option: IIST, Thiruvananthapuram (admission through JEE Advanced).', 'ISRO hires engineers through the ISRO Centralised Recruitment Board (ICRB).'], go: 'index7.html', goT: 'Practise spacewalk physics' },
    sat: { i: '🛰️', t: 'Satellite and payload engineer', subj: 'Physics · Maths · Computer Science', skills: ['Electronics and circuits', 'Signals and communication', 'Embedded programming', 'Systems thinking'], path: ['Class 11-12: Physics and Maths, plus Computer Science if possible.', 'B.Tech / B.E. in Electronics, Electrical or Computer Science.', 'Build small projects with Arduino or Raspberry Pi.', 'Apply to ISRO through ICRB or to space start-ups.'], go: 'index6.html', goT: 'Explore Aryabhata' },
    data: { i: '🌍', t: 'Earth-observation data analyst', subj: 'Maths · Computer Science · Geography', skills: ['Python and data handling', 'Statistics', 'GIS and satellite images', 'Machine learning basics'], path: ['Learn Python and basic statistics early.', 'Degree in Computer Science, Geoinformatics, Environmental Science or similar.', 'Practise with satellite maps on ISRO\'s Bhuvan geo-portal.', 'Work on farming, flood or city-planning projects.'], go: 'index9.html', goT: 'Explore Drishti' },
    astro: { i: '🔭', t: 'Astronomer / astrophysicist', subj: 'Physics · Maths', skills: ['Classical and modern physics', 'Calculus', 'Data analysis', 'Scientific writing'], path: ['Class 11-12: Physics and Maths.', 'B.Sc. Physics, then M.Sc. and a PhD.', 'Research institutes include IUCAA, IISc and TIFR.', 'Join a school or city astronomy club to start observing.'], go: 'index5.html', goT: 'Explore Aditya-L1' },
    orbit: { i: '🧮', t: 'Mission designer / orbit analyst', subj: 'Maths · Physics · Computer Science', skills: ['Calculus and algebra', 'Orbital mechanics', 'Numerical methods', 'Programming'], path: ['Get strong at maths and problem solving.', 'B.Tech in Aerospace, Engineering Physics or Computer Science.', 'Simulate orbits yourself with a small Python program.', 'Study real missions such as Mangalyaan to see trade-offs.'], go: 'index4.html', goT: 'Explore Mangalyaan' },
    edu: { i: '🎤', t: 'Space educator & science communicator', subj: 'Any science stream · Languages', skills: ['Explaining ideas simply', 'Storytelling', 'Making models and demos', 'Social media and video'], path: ['Start a space club or teach younger students.', 'Degree in science or education (B.Sc., B.Ed.).', 'Volunteer at a planetarium or science centre.', 'Share short explainers in your own language.'], go: 'index.html', goT: 'Go to Home' }
  };
  var DICT = [
    ['Orbit', 'The curved path an object follows around a planet, moon or star because of gravity.'],
    ['Satellite', 'An object that orbits a bigger body. The Moon is a natural satellite; Aryabhata was a man-made one.'],
    ['Orbiter', 'A spacecraft that circles a planet or moon instead of landing on it.'],
    ['Lander', 'A spacecraft built to touch down gently on another world, like Vikram on the Moon.'],
    ['Rover', 'A vehicle that drives across the surface of another world to explore it, like Pragyan.'],
    ['Payload', 'The instruments or cargo a rocket or spacecraft carries to do its job.'],
    ['Launch vehicle', 'The rocket that lifts a spacecraft into space.'],
    ['Thrust', 'The force that pushes a rocket forward.'],
    ['Lagrange point', 'A spot near two large bodies where their gravity and the orbital motion balance, so a spacecraft can stay there with little fuel.'],
    ['Geostationary orbit', 'An orbit about 36,000 km above the equator where a satellite takes 24 hours to go around, so it seems to stay still in the sky.'],
    ['Sun-synchronous orbit', 'A near-polar orbit in which a satellite passes over any place at the same local sun time every day.'],
    ['SAR', 'Synthetic Aperture Radar. It makes images using its own radio signal, so it works at night and through clouds.'],
    ['Remote sensing', 'Collecting information about the Earth from far away, usually with satellites.'],
    ['Telemetry', 'Data a spacecraft sends back about its health and what it measures.'],
    ['Escape velocity', 'The speed needed to break free from a planet\'s gravity. For Earth it is about 11.2 kilometres per second.'],
    ['Gravity assist', 'Using a planet\'s gravity to change a spacecraft\'s speed and direction and save fuel.'],
    ['Apogee and perigee', 'The farthest and the closest points of an orbit around the Earth.'],
    ['Solar flare', 'A sudden burst of energy from the surface of the Sun.'],
    ['Coronal mass ejection', 'A huge cloud of charged gas thrown out by the Sun.'],
    ['Constellation', 'A group of satellites that work together, like the NavIC satellites.'],
    ['Microgravity', 'The feeling of floating in orbit. The astronaut and the spacecraft are both falling around the Earth together.']
  ];

  /* ---------- styles ---------- */
  var mst = document.createElement('style');
  mst.id = 'cq-more-css';
  mst.textContent = [
    '#cq-dock:not(.off) .cq-tab[data-p=more]{animation-delay:1.3s}',
    '.cq-tab[data-p=more]{border-color:rgba(244,114,182,.55)}',
    '.mo-tabs{display:flex;gap:6px;margin:0 -4px 12px;padding:4px;position:sticky;top:0;z-index:3;border-radius:14px;background:rgba(14,10,40,.92);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}',
    '.mo-tab{flex:1;min-width:0;padding:8px 2px;border-radius:10px;border:1px solid transparent;background:transparent;color:#cfc8ff;font:700 11.5px Inter,sans-serif;cursor:pointer;transition:.25s;white-space:nowrap}',
    '.mo-tab:hover{background:rgba(255,255,255,.08)}.mo-tab.on{color:#fff;background:linear-gradient(135deg,#7c3aed,#06b6d4);box-shadow:0 0 14px rgba(34,211,238,.35)}',
    '.mo-row{display:flex;align-items:center;gap:12px;padding:10px 12px;margin-bottom:8px;border-radius:15px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1)}',
    '.mo-row .cq-ri{width:36px;height:36px}.mo-row .mo-t{flex:1;min-width:0}.mo-row .mo-t b{display:block;font-size:13px}.mo-row .mo-t small{opacity:.65;font-size:11px;line-height:1.35;display:block}',
    '.mo-sw{flex:none;position:relative;width:44px;height:24px;border-radius:999px;border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.1);cursor:pointer;padding:0;transition:.3s}',
    '.mo-sw i{position:absolute;left:2px;top:2px;width:18px;height:18px;border-radius:50%;background:#fff;transition:transform .3s cubic-bezier(.16,1,.3,1)}',
    '.mo-sw.on{background:linear-gradient(135deg,#7c3aed,#06b6d4);border-color:rgba(103,232,249,.8);box-shadow:0 0 14px rgba(34,211,238,.45)}.mo-sw.on i{transform:translateX(20px)}',
    '.mo-sw:focus-visible,.mo-b:focus-visible,.mo-tr:focus-visible,.mo-tab:focus-visible{outline:2px solid #67e8f9;outline-offset:2px}',
    '.mo-hero{padding:14px;border-radius:20px;background:linear-gradient(135deg,rgba(244,114,182,.2),rgba(6,182,212,.14));border:1px solid rgba(244,114,182,.38)}',
    '.mo-hero p{margin:6px 0 10px;font-size:12.5px;opacity:.8}',
    '.mo-bs{display:flex;flex-wrap:wrap;gap:8px}',
    '.mo-b{padding:8px 12px;border-radius:11px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.08);color:#fff;font:700 12px Inter,sans-serif;cursor:pointer;transition:.25s}.mo-b:hover{background:rgba(139,92,246,.35)}',
    '.mo-b.p{border:0;background:linear-gradient(135deg,#7c3aed,#06b6d4)}',
    '.mo-sl{margin:6px 2px 12px;font-size:12px}.mo-sl label{display:flex;justify-content:space-between;font-weight:700;opacity:.85;margin-bottom:4px}',
    '.mo-sl input[type=range]{width:100%;accent-color:#22d3ee;cursor:pointer}',
    '.mo-sel,.mo-ta,.mo-in{width:100%;box-sizing:border-box;padding:9px 11px;border-radius:12px;border:1px solid rgba(255,255,255,.2);background:#120d33;color:#fff;font:500 12.5px Inter,sans-serif}',
    '.mo-ta{min-height:92px;resize:vertical}',
    '.mo-fact{padding:14px;border-radius:16px;font-size:13px;line-height:1.55;background:rgba(250,204,21,.07);border:1px solid rgba(250,204,21,.35)}',
    '.mo-tg{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}',
    '.mo-tr{display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 4px;border-radius:13px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.05);color:#fff;font:700 10.5px Inter,sans-serif;text-align:center;cursor:pointer;transition:.25s}.mo-tr span{font-size:20px}.mo-tr:hover{background:rgba(139,92,246,.25);border-color:rgba(168,120,255,.6)}',
    '.mo-sk{margin:0 0 10px}.mo-skh{display:flex;justify-content:space-between;gap:8px;font-size:12px;font-weight:700;margin-bottom:4px}.mo-skh span:last-child{opacity:.7;font-weight:600}',
    '.mo-skb{height:8px;border-radius:99px;background:rgba(255,255,255,.1);overflow:hidden}.mo-skb i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#7c3aed,#22d3ee);transition:width 1.2s cubic-bezier(.16,1,.3,1)}',
    '.mo-card{padding:13px;border-radius:16px;font-size:12.5px;line-height:1.5;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);margin-top:8px}',
    '.mo-card h5{margin:0 0 4px;font:800 14px Inter,sans-serif}.mo-card ul,.mo-card ol{margin:4px 0 8px;padding-left:18px}.mo-card li{margin:2px 0}.mo-card .lb{font:700 10.5px Inter,sans-serif;letter-spacing:.14em;text-transform:uppercase;opacity:.6;margin-top:8px}',
    '.mo-def{padding:9px 11px;margin-bottom:6px;border-radius:12px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);font-size:12.5px;line-height:1.45}.mo-def b{display:block;color:#67e8f9;font-size:12.5px}',
    '.mo-tm{font:800 30px Orbitron,Inter,sans-serif;text-align:center;margin:4px 0 8px;letter-spacing:.06em}',
    '#mo-pill{position:fixed;left:14px;bottom:calc(14px + env(safe-area-inset-bottom,0px));z-index:99981;display:none;align-items:center;padding:8px 14px;border-radius:999px;border:1px solid rgba(103,232,249,.6);background:rgba(20,14,56,.9);color:#fff;font:800 13px Orbitron,Inter,sans-serif;cursor:pointer;box-shadow:0 6px 24px rgba(0,0,0,.5),0 0 18px rgba(34,211,238,.35)}',
    '#mo-ruler{position:fixed;left:0;right:0;height:48px;top:-200px;z-index:99980;pointer-events:none;display:none;border-top:2px solid rgba(103,232,249,.75);border-bottom:2px solid rgba(103,232,249,.75);box-shadow:0 0 0 100vmax rgba(2,3,12,.5)}',
    '.mo-speaking{outline:2px solid rgba(103,232,249,.8)!important;outline-offset:5px;border-radius:6px;box-shadow:0 0 24px rgba(34,211,238,.35)}',
    'html.mo-on-dys body *:not(canvas):not(svg):not(svg *):not(.bx):not([class*="bx-"]):not([class*="fa-"]):not(i){font-family:Verdana,"Trebuchet MS",Tahoma,sans-serif!important;letter-spacing:.03em}',
    'html.mo-on-spacing :is(p,li,dd,dt,blockquote,figcaption,td,th){line-height:1.85!important;letter-spacing:.02em!important;word-spacing:.1em!important}',
    'html.mo-on-calm{scroll-behavior:auto!important}'
  ].join('\n');
  document.head.appendChild(mst);

  /* ---------- comfort settings ---------- */
  var calmList = [], calmTimer = 0;
  function calmSweep() {
    if (!document.getAnimations) return;
    try {
      document.getAnimations().forEach(function (a) {
        var t = a.effect && a.effect.target;
        if (!t || !t.closest || t.closest('#cq-dock,#cq-drawer,#cq-veil,#cq-scrim,#mo-ruler,#mo-pill')) return;
        var ct = a.effect.getComputedTiming && a.effect.getComputedTiming();
        if (ct && ct.iterations === Infinity && a.playState !== 'idle') { a.cancel(); calmList.push(a); }
      });
    } catch (e) { }
  }
  function applyCalm() {
    clearInterval(calmTimer); calmTimer = 0;
    if (MS.calm) { calmSweep(); calmTimer = setInterval(calmSweep, 1500); }
    else { calmList.forEach(function (a) { try { a.play(); } catch (e) { } }); calmList = []; }
  }
  var ruler = null;
  function rulerMove(e) {
    if (!ruler) return;
    var y = e.touches && e.touches[0] ? e.touches[0].clientY : e.clientY;
    if (typeof y === 'number') ruler.style.top = Math.max(0, y - 24) + 'px';
  }
  function applyRuler() {
    if (MS.ruler && !ruler) {
      ruler = document.createElement('div'); ruler.id = 'mo-ruler'; ruler.setAttribute('aria-hidden', 'true'); document.body.appendChild(ruler);
      addEventListener('pointermove', rulerMove, { passive: true }); addEventListener('touchmove', rulerMove, { passive: true });
      ruler.style.top = Math.round(innerHeight * .4) + 'px';
    }
    if (ruler) ruler.style.display = MS.ruler ? 'block' : 'none';
  }
  function applyMS() {
    var c = document.documentElement.classList;
    c.toggle('mo-on-dys', !!MS.dys); c.toggle('mo-on-spacing', !!MS.sp); c.toggle('mo-on-calm', !!MS.calm);
    applyCalm();
    if (document.body) applyRuler();
  }
  applyMS();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyRuler);

  /* ---------- speech engine ---------- */
  var spk = { q: [], cur: null, el: null, tok: 0 }, lastSpoke = 0;
  function speechLang() {
    var c = '';
    try { c = (window.CosmosLang && window.CosmosLang.get && window.CosmosLang.get()) || ''; } catch (e) { }
    c = String(c || document.documentElement.lang || 'en').toLowerCase().replace('_', '-');
    var map = { en: 'en-IN', hi: 'hi-IN' };
    return map[c.split('-')[0]] || c;
  }
  function pickVoice() {
    if (!HAS_TTS) return null;
    var vs = speechSynthesis.getVoices() || [], i;
    if (!vs.length) return null;
    if (MS.voice) { for (i = 0; i < vs.length; i++) if (vs[i].name === MS.voice) return vs[i]; }
    var L = speechLang().toLowerCase(), p = L.split('-')[0], best = null;
    for (i = 0; i < vs.length; i++) {
      var vl = String(vs[i].lang).toLowerCase().replace('_', '-');
      if (vl === L) return vs[i];
      if (!best && vl.indexOf(p) === 0) best = vs[i];
    }
    return best;
  }
  function clean(s) { return String(s || '').replace(/\s+/g, ' ').trim(); }
  function chunk(t) {
    t = clean(t);
    var parts = t.match(/[^.!?\u0964\u2026]+[.!?\u0964\u2026]*\s*/g) || [t], out = [], b = '';
    parts.forEach(function (p) {
      while (p.length > 220) {
        var cut = p.lastIndexOf(' ', 220); if (cut < 60) cut = 220;
        if (b) { out.push(b); b = ''; }
        out.push(p.slice(0, cut)); p = p.slice(cut);
      }
      if (b && (b + p).length > 200) { out.push(b); b = p; } else b += p;
    });
    if (b) out.push(b);
    return out.filter(function (s) { return clean(s).length; });
  }
  function setStatus() {
    var s = document.getElementById('mo-st'); if (!s) return;
    var on = !!spk.cur || (HAS_TTS && speechSynthesis.speaking);
    s.className = 'cq-stat ' + (on ? 'ok' : ''); s.lastChild.textContent = on ? 'Speaking…' : (HAS_TTS ? 'Ready to listen' : 'Speech not supported here');
  }
  function endSpeak() {
    spk.cur = null; spk.q = [];
    if (spk.el) { spk.el.classList.remove('mo-speaking'); spk.el = null; }
    setStatus();
  }
  function stopSpeak() {
    spk.tok++; spk.q = []; spk.cur = null;
    try { if (HAS_TTS) { speechSynthesis.cancel(); speechSynthesis.resume(); } } catch (e) { }
    if (spk.el) { spk.el.classList.remove('mo-speaking'); spk.el = null; }
    setStatus();
  }
  function nextChunk() {
    var s = spk.q.shift();
    if (!s) { endSpeak(); return; }
    var u = new SpeechSynthesisUtterance(s), v = pickVoice();
    u.lang = speechLang(); u.rate = MS.rate; u.pitch = MS.pitch;
    if (v) { u.voice = v; u.lang = v.lang; }
    u.onend = function () { if (spk.cur === u) nextChunk(); };
    u.onerror = function () { if (spk.cur === u) endSpeak(); };
    spk.cur = u; speechSynthesis.speak(u); setStatus();
  }
  function speakText(text, el) {
    if (!HAS_TTS) { toast('🔇 This browser has no speech support'); return false; }
    var parts = chunk(text); if (!parts.length) return false;
    stopSpeak();
    spk.q = parts; spk.el = el || null; lastSpoke = Date.now();
    if (el) el.classList.add('mo-speaking');
    if (!S.heard) { S.heard = 1; gainXP(5, 'Listened aloud', true); toast('🎧 Listener badge  +5 XP'); }
    var tok = ++spk.tok;
    setTimeout(function () { if (tok === spk.tok) nextChunk(); }, 60);
    return true;
  }
  function pageText() {
    var out = [], seen = 0;
    var nodes = document.querySelectorAll('h1,h2,h3,p,li');
    for (var i = 0; i < nodes.length && seen < 6000; i++) {
      var n = nodes[i];
      if (n.closest('#cq-dock,#cq-drawer,#cq-veil,#cq-scrim,nav,script,style,[hidden],.hidden')) continue;
      if (!n.getClientRects().length) continue;
      var t = clean(n.innerText); if (t.length < 3) continue;
      out.push(t); seen += t.length;
    }
    return out.join('. ');
  }

  /* ---------- double-click / double-tap → speak ---------- */
  var BLOCKED = 'input,textarea,select,option,canvas,video,audio,iframe,button,a,summary,[role=button],[contenteditable=""],[contenteditable="true"],[data-nospeak],#cq-dock,.cq-o,.mo-sw,.mo-b,.mo-tr,.mo-tab';
  function isBlock(el) { try { return !/^inline/.test(getComputedStyle(el).display); } catch (e) { return true; } }
  function targetText(e) {
    var node = null, off = 0, r, p;
    if (document.caretRangeFromPoint) { r = document.caretRangeFromPoint(e.clientX, e.clientY); if (r) { node = r.startContainer; off = r.startOffset; } }
    else if (document.caretPositionFromPoint) { p = document.caretPositionFromPoint(e.clientX, e.clientY); if (p) { node = p.offsetNode; off = p.offset; } }
    var el = node && node.nodeType === 3 ? node.parentElement : e.target;
    if (!el || el.closest(BLOCKED)) return null;
    var blk = el;
    while (blk && blk !== document.body && blk !== document.documentElement && (!isBlock(blk) || clean(blk.innerText).length < 2)) blk = blk.parentElement;
    if (!blk || blk === document.body || blk === document.documentElement) { blk = el; }
    var txt = clean(blk.innerText || blk.textContent);
    if (txt.length < 2) return null;
    if (txt.length > 400 && node && node.nodeType === 3) {
      var nt = node.textContent, start = 0, m, re = /[.!?\u0964]\s+/g;
      while ((m = re.exec(nt)) && m.index + m[0].length <= off) start = m.index + m[0].length;
      var part = clean(nt.slice(start));
      if (part.length >= 15) { txt = part; blk = node.parentElement || blk; }
    }
    if (txt.length > 1500) txt = txt.slice(0, 1500);
    return { text: txt, el: blk };
  }
  var lc = { t: 0, x: -99, y: -99 };
  document.addEventListener('click', function (e) {
    if (!MS.dbl || !HAS_TTS || e.button > 0) return;
    var now = Date.now(), near = Math.abs(e.clientX - lc.x) < 24 && Math.abs(e.clientY - lc.y) < 24;
    if (now - lc.t < 450 && near) {
      lc.t = 0;
      var tt = targetText(e); if (!tt) return;
      if (spk.el === tt.el) { stopSpeak(); toast('⏹ Stopped'); }
      else speakText(tt.text, tt.el);
      try { var sel = window.getSelection(); if (sel) sel.removeAllRanges(); } catch (x) { }
    } else { lc.t = now; lc.x = e.clientX; lc.y = e.clientY; }
  }, true);
  document.addEventListener('dblclick', function () {
    if (Date.now() - lastSpoke < 900) { try { window.getSelection().removeAllRanges(); } catch (x) { } }
  }, true);
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && (spk.cur || (HAS_TTS && speechSynthesis.speaking))) stopSpeak(); });
  addEventListener('pagehide', function () { try { if (HAS_TTS) speechSynthesis.cancel(); } catch (e) { } });
  if (HAS_TTS) {
    try { speechSynthesis.onvoiceschanged = function () { if (curP === 'more') fillVoices(); }; } catch (e) { }
    if (MS.dbl) setTimeout(function () {
      if (!MS.tip) { MS.tip = 1; saveMS(); toast('🔊 Tip: double-click any text to hear it read aloud'); }
    }, 5000);
  }
  try { if (window.CosmosLang && window.CosmosLang.onChange) window.CosmosLang.onChange(function () { if (curP === 'more') fillVoices(); }); } catch (e) { }

  /* ---------- skills ---------- */
  function skillPct(list) { var t = 0; list.forEach(function (id) { t += Math.min(1, (S.best[id] || 0) / M[id].q.length); }); return Math.round(t / list.length * 100); }
  function skillLvl(p) { return p >= 80 ? 'Expert' : p >= 50 ? 'Skilled' : p >= 20 ? 'Explorer' : 'Beginner'; }
  var TIERS = [[20, 'Explorer'], [50, 'Skilled'], [80, 'Expert']];
  function skillRow(s) {
    var p = skillPct(s[2]), nt = null, low = null, lw = 2;
    TIERS.forEach(function (x) { if (!nt && p < x[0]) nt = x; });
    s[2].forEach(function (id) { var r = (S.best[id] || 0) / M[id].q.length; if (!done(id) && r < lw) { lw = r; low = id; } });
    return '<div class="mo-sk"><div class="mo-skh"><span>' + s[1] + ' ' + esc(s[0]) + '</span><span>' + p + '% · ' + skillLvl(p) + '</span></div>' +
      '<div class="mo-skb" role="progressbar" aria-label="' + esc(s[0]) + '" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + p + '"><i style="width:' + p + '%"></i><b class="t" style="left:20%"></b><b class="t" style="left:50%"></b><b class="t" style="left:80%"></b></div>' +
      '<div class="mo-skn"><span>' + (nt ? '▲ ' + (nt[0] - p) + '% to ' + nt[1] : '🏆 Top tier reached') + ' · built from ' + s[2].map(function (id) { return M[id].t; }).join(', ') + '</span>' + (low ? '<button type="button" class="cq-go" data-mo="rec:' + low + '">Boost</button>' : '') + '</div></div>';
  }
  function labRow(wrap) {
    var L = window.CosmosSkills && CosmosSkills.summary && CosmosSkills.summary(); if (!L) return '';
    return wrap('<div class="mo-row"><span class="cq-ri">🧪</span><div class="mo-t"><b>Skill Lab · ' + L.cleared + '/' + L.total + ' challenges</b><small>' + esc(L.rank) + ' · average ' + L.avg + '%. Hands-on challenges give extra XP.</small></div><button type="button" class="cq-go" data-mo="lab">Open</button></div>');
  }
  function weakest() {
    var pick = null, low = 2;
    ids.forEach(function (id) { var r = (S.best[id] || 0) / M[id].q.length; if (!done(id) && r < low) { low = r; pick = id; } });
    return pick;
  }

  /* daily challenge: 5 mixed questions, same set for everyone on a given day */
  function dailyChallenge() {
    var r = rng(hash('daily|' + dayKey())), pool = [], i, j, t;
    ids.forEach(function (id) { M[id].q.forEach(function (q) { pool.push({ id: id, q: q }); }); });
    for (i = pool.length - 1; i > 0; i--) { j = Math.floor(r() * (i + 1)); t = pool[i]; pool[i] = pool[j]; pool[j] = t; }
    var set = pool.slice(0, 5), n = 0, ok = 0, lock = false;
    function step() {
      var o = set[n], q = o.q, p = Math.round(n / set.length * 100);
      open('<div class="cq-top"><h2>🎲 Daily challenge</h2><button class="cq-x" aria-label="Close">×</button></div><div class="cq-s">Question ' + (n + 1) + ' of ' + set.length + ' · ' + esc(M[o.id].t) + '</div><div class="cq-bar"><i style="width:' + p + '%"></i></div><p><b>' + esc(q[0]) + '</b></p>' +
        q[1].map(function (x, k) { return '<button class="cq-o" data-k="' + k + '">' + esc(x) + '</button>'; }).join('') + '<div id="cq-fb"></div>');
      bind('.cq-x', close); lock = false;
      box.querySelectorAll('.cq-o').forEach(function (b) {
        b.onclick = function () {
          if (lock) return; lock = true;
          var k = +b.dataset.k, right = k === q[2];
          if (right) ok++;
          box.querySelectorAll('.cq-o').forEach(function (x, m) { x.disabled = true; if (m === q[2]) x.classList.add('ok'); });
          if (!right) b.classList.add('no');
          document.getElementById('cq-fb').innerHTML = '<div class="cq-ex">' + (right ? '✅ Correct! ' : '❌ Not quite. ') + esc(q[3]) + '</div><button class="cq-btn" id="cq-nx">' + (n + 1 < set.length ? 'Next →' : 'See result') + '</button>';
          document.getElementById('cq-nx').onclick = function () { n++; n < set.length ? step() : result(); };
        };
      });
    }
    function result() {
      var first = S.daily !== dayKey(), gain = first ? ok * 4 + (ok === set.length ? 10 : 0) : 0, pl = lvl();
      if (first) { S.daily = dayKey(); S.dcount = (S.dcount || 0) + 1; gainXP(gain, 'Daily challenge', true); }
      open('<div class="cq-top"><h2>Daily challenge</h2><button class="cq-x" aria-label="Close">×</button></div><div class="cq-big">' + ok + ' / ' + set.length + '</div><div class="cq-s" style="text-align:center">' +
        (ok === set.length ? 'Perfect! 🚀' : ok >= 3 ? 'Great work! 🎉' : 'Keep practising. Try the missions and come back tomorrow!') + '</div>' +
        '<div class="cq-grid"><div class="cq-card on"><b>+' + gain + '</b>XP earned' + (first ? '' : ' (already claimed today)') + '</div></div>' +
        (lvl() > pl ? '<div class="cq-ex">⬆️ Level up! You are now Level ' + lvl() + ' · ' + rank() + '.</div>' : '') +
        '<button class="cq-btn" id="cq-d">Mission Control</button>');
      bind('.cq-x', close); bind('#cq-d', function () { close(); openPanel('learn'); });
      if (first && ok === set.length) confetti();
    }
    step();
  }

  /* printable worksheet (works in classrooms with no devices) */
  function worksheet(sel) {
    var qs = [], title, r, i, j, t;
    if (sel === 'mix') {
      var pool = [];
      ids.forEach(function (id) { M[id].q.forEach(function (q) { pool.push({ id: id, q: q }); }); });
      r = rng(hash('ws|' + dayKey()));
      for (i = pool.length - 1; i > 0; i--) { j = Math.floor(r() * (i + 1)); t = pool[i]; pool[i] = pool[j]; pool[j] = t; }
      qs = pool.slice(0, 10); title = 'Mixed space missions';
    } else if (M[sel]) {
      qs = M[sel].q.map(function (q) { return { id: sel, q: q }; }); title = M[sel].t;
    } else return;
    var w = window.open('', '_blank');
    if (!w) { toast('Please allow pop-ups to print the worksheet'); return; }
    var L = 'ABCD';
    var body = qs.map(function (o) { return '<li><p>' + esc(o.q[0]) + '</p><ol type="A">' + o.q[1].map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol></li>'; }).join('');
    var key = qs.map(function (o) { return '<li><b>' + L[o.q[2]] + '.</b> ' + esc(o.q[1][o.q[2]]) + ' &mdash; ' + esc(o.q[3]) + '</li>'; }).join('');
    w.document.write('<!doctype html><html><head><meta charset="utf-8"><title>COSMOSIS worksheet: ' + esc(title) + '</title><style>' +
      'body{font:15px/1.5 Georgia,serif;color:#111;max-width:760px;margin:24px auto;padding:0 20px}h1{font:800 22px Arial,sans-serif;margin:0}h2{font:700 16px Arial,sans-serif;margin:22px 0 8px}' +
      '.m{color:#555;font:13px Arial,sans-serif;margin:4px 0 14px}.f{display:flex;gap:24px;font:14px Arial,sans-serif;margin:14px 0 18px}.f span{flex:1;border-bottom:1px solid #333;padding-bottom:2px}' +
      'ol.q>li{margin-bottom:14px;break-inside:avoid}ol.q p{margin:0 0 4px;font-weight:700}ol[type=A]{margin:0;padding-left:22px}.k{page-break-before:always}@media print{body{margin:0}}' +
      '</style></head><body><h1>🚀 COSMOSIS · Space worksheet</h1><div class="m">' + esc(title) + ' · ' + qs.length + ' questions · Circle the correct answer</div>' +
      '<div class="f"><span>Name:</span><span>Class:</span><span>Date:</span></div><ol class="q">' + body + '</ol>' +
      '<div class="k"><h1>Answer key (teacher copy)</h1><div class="m">' + esc(title) + '</div><ol class="q">' + key + '</ol></div></body></html>');
    w.document.close();
    setTimeout(function () { try { w.focus(); w.print(); } catch (e) { } }, 450);
  }

  /* ---------- focus timer ---------- */
  var tmI = 0;
  function fmt(ms) { var s = Math.ceil(ms / 1000); return ('0' + Math.floor(s / 60)).slice(-2) + ':' + ('0' + (s % 60)).slice(-2); }
  function ensurePill() {
    var p = document.getElementById('mo-pill'); if (p || !document.body) return p;
    p = document.createElement('button'); p.id = 'mo-pill'; p.type = 'button'; p.setAttribute('aria-label', 'Focus timer. Open skills panel');
    p.onclick = function () { moTab = 'skills'; openPanel('more'); };
    document.body.appendChild(p); return p;
  }
  function tmTick() {
    var left = Math.max(0, (MS.tEnd || 0) - Date.now()), pill = document.getElementById('mo-pill'), d = document.getElementById('mo-tm');
    if (!MS.tEnd) { clearInterval(tmI); tmI = 0; if (pill) pill.style.display = 'none'; if (d) d.textContent = 'Ready'; return; }
    if (left <= 0) { finishTimer(); return; }
    pill = ensurePill(); if (pill) { pill.style.display = 'flex'; pill.textContent = '⏱ ' + fmt(left); }
    if (d) d.textContent = fmt(left);
  }
  function startTimer(min) {
    MS.tEnd = Date.now() + min * 60000; MS.tMin = min; saveMS();
    clearInterval(tmI); tmI = setInterval(tmTick, 1000); tmTick();
    toast('⏱ Focus session started: ' + min + ' min. Put distractions away!');
  }
  function cancelTimer() { MS.tEnd = 0; saveMS(); tmTick(); }
  function finishTimer() {
    var min = MS.tMin || 10, xp = min >= 25 ? 20 : min >= 15 ? 15 : 10;
    MS.tEnd = 0; saveMS(); tmTick();
    S.focus = (S.focus || 0) + 1; gainXP(xp, 'Focus session', true);
    toast('🎉 Focus session complete  +' + xp + ' XP');
    if (HAS_TTS && MS.dbl) speakText('Focus session complete. Great work!', null);
  }
  function timerBoot() { if (MS.tEnd) { clearInterval(tmI); tmI = setInterval(tmTick, 1000); tmTick(); } }

  /* ---------- offline pack ---------- */
  var CACHE = 'cosmosis-v1';
  function swOK() { return 'serviceWorker' in navigator && 'caches' in window && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1'); }
  function offStatus() {
    var el = document.getElementById('mo-off'); if (!el) return;
    if (!swOK()) { el.textContent = 'Needs the website to be hosted on https'; return; }
    navigator.serviceWorker.getRegistration().then(function (reg) {
      if (!reg) { el.textContent = 'Off'; return; }
      return caches.open(CACHE).then(function (c) { return c.keys(); }).then(function (k) { el.textContent = 'On · ' + k.length + ' files saved'; });
    }).catch(function () { el.textContent = 'Unavailable'; });
  }
  function offEnable() {
    if (!swOK()) { toast('📶 Offline mode needs the site hosted on https'); return; }
    toast('📶 Saving for offline use…');
    var urls = [location.href].concat(TRAVEL.map(function (t) { return t[0]; }), ['script1.js', 'script2.js', 'script3.js', 'script4.js']);
    [].forEach.call(document.querySelectorAll('script[src],link[rel="stylesheet"]'), function (e) { urls.push(e.src || e.href); });
    navigator.serviceWorker.register('script4.js').then(function () { return navigator.serviceWorker.ready; }).then(function () { return caches.open(CACHE); }).then(function (c) {
      return Promise.all(urls.map(function (u) {
        var same = false; try { same = new URL(u, location.href).origin === location.origin; } catch (e) { }
        return fetch(u, { mode: same ? 'same-origin' : 'no-cors' }).then(function (r) { return (r.ok || r.type === 'opaque') ? c.put(u, r).then(function () { return 1; }) : 0; }).catch(function () { return 0; });
      }));
    }).then(function (r) { toast('✅ ' + r.reduce(function (a, b) { return a + b; }, 0) + ' files ready offline. Visit each mission once to save it too.'); offStatus(); })
      .catch(function () { toast('Could not enable offline mode'); });
  }
  function offClear() {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.getRegistrations().then(function (rs) { return Promise.all(rs.map(function (r) { return r.unregister(); })); })
      .then(function () { return window.caches ? caches.delete(CACHE) : 0; }).then(function () { toast('🗑 Offline copy removed'); offStatus(); }).catch(function () { });
  }

  /* ---------- progress report ---------- */
  function csvc(v) { v = String(v == null ? '' : v); if (/^[=+\-@]/.test(v)) v = "'" + v; return '"' + v.replace(/"/g, '""') + '"'; }
  function exportCSV() {
    var rows = [['COSMOSIS progress report'], ['Learner', user()], ['Date', dayKey()], ['Level', lvl()], ['Rank', rank()], ['XP', S.xp], ['Day streak', Math.max(1, S.streak || 0)], ['Focus sessions', S.focus || 0], ['Daily challenges', S.dcount || 0], ['Achievements', Object.keys(S.ach).length + '/' + ACH.length], ['XP this week', weekTotal()], [], ['Mission', 'Best score', 'Questions', 'Cleared']];
    ids.forEach(function (id) { rows.push([M[id].t, S.best[id] || 0, M[id].q.length, done(id) ? 'Yes' : 'No']); });
    rows.push([]); rows.push(['Skill', 'Percent', 'Level']);
    SK.forEach(function (s) { var p = skillPct(s[2]); rows.push([s[0], p, skillLvl(p)]); });
    var csv = rows.map(function (r) { return r.map(csvc).join(','); }).join('\r\n');
    try {
      var b = new Blob(['\ufeff' + csv], { type: 'text/csv' }), a = document.createElement('a');
      a.href = URL.createObjectURL(b); a.download = 'cosmosis-progress.csv'; document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 4000); toast('📄 Progress report downloaded');
    } catch (e) { toast('Could not create the report'); }
  }
  function summaryText() {
    return user() + ' is Level ' + lvl() + ' (' + rank() + ') on COSMOSIS with ' + S.xp + ' XP, ' + nDone() + ' of ' + ids.length + ' space missions cleared and a ' + Math.max(1, S.streak || 0) + '-day streak. Learn about India\'s space missions: ' + location.href;
  }

  /* ---------- drawer content ---------- */
  var TABS = [['listen', '🔊 Listen'], ['skills', '🎯 Skills'], ['study', '📚 Study'], ['tools', '🧰 Tools']];
  function renderMore() {
    var n = 0;
    function sw(k, ic, t, sub) {
      return '<div class="mo-row cq-st" style="--i:' + (n++) + '"><span class="cq-ri">' + ic + '</span><div class="mo-t"><b>' + t + '</b><small>' + sub + '</small></div>' +
        '<button type="button" class="mo-sw' + (MS[k] ? ' on' : '') + '" role="switch" aria-checked="' + (MS[k] ? 'true' : 'false') + '" aria-label="' + t + '" data-mo="tg:' + k + '"><i></i></button></div>';
    }
    function h4(t) { return '<div class="cq-h4 cq-st" style="--i:' + (n++) + '">' + t + '</div>'; }
    function wrap(x, cls) { return '<div class="cq-st ' + (cls || '') + '" style="--i:' + (n++) + '">' + x + '</div>'; }
    var h = '<div class="mo-tabs" role="tablist">' + TABS.map(function (t) { return '<button type="button" role="tab" aria-selected="' + (moTab === t[0]) + '" class="mo-tab' + (moTab === t[0] ? ' on' : '') + '" data-mo="tab:' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div>';

    if (moTab === 'listen') {
      h += wrap('<div id="mo-st" class="cq-stat"><i></i><span></span></div><p>Double-click (or double-tap) any text on the page and it starts speaking. Double-click it again to stop.</p>' +
        '<div class="mo-bs"><button type="button" class="mo-b p" data-mo="page">📖 Read this page</button><button type="button" class="mo-b" data-mo="pause" id="mo-pause">⏸ Pause</button><button type="button" class="mo-b" data-mo="stop">⏹ Stop</button></div>', 'mo-hero') +
        h4('Listening') + sw('dbl', '🔊', 'Double-click to listen', 'Speak any text you double-click') +
        wrap('<label for="mo-rate"><span>Speed</span><span id="mo-rate-v">' + MS.rate.toFixed(2) + '×</span></label><input type="range" id="mo-rate" min="0.6" max="1.5" step="0.05" value="' + MS.rate + '">', 'mo-sl') +
        wrap('<label for="mo-pitch"><span>Pitch</span><span id="mo-pitch-v">' + Number(MS.pitch).toFixed(2) + '</span></label><input type="range" id="mo-pitch" min="0.7" max="1.4" step="0.05" value="' + MS.pitch + '">', 'mo-sl') +
        wrap('<label for="mo-voice"><span>Voice</span></label><select id="mo-voice" class="mo-sel"><option value="">Auto</option></select><div class="mo-bs" style="margin-top:8px"><button type="button" class="mo-b" data-mo="test">▶ Test voice</button></div>', 'mo-sl') +
        h4('Reading comfort') +
        sw('dys', '🔤', 'Easy-read font', 'Clear, wide letters on every page') +
        sw('sp', '↕️', 'Comfortable spacing', 'More space between lines and words') +
        sw('ruler', '📏', 'Reading ruler', 'Highlights one line and dims the rest') +
        sw('calm', '🌙', 'Calm mode', 'Stops endless looping animations');
    }
    else if (moTab === 'skills') {
      var wk = weakest();
      h += h4('My skill profile') +
        wrap(SK.map(skillRow).join('')) + labRow(wrap) +
        (wk ? wrap('<div class="mo-row"><span class="cq-ri">' + M[wk].i + '</span><div class="mo-t"><b>Recommended next: ' + esc(M[wk].t) + '</b><small>Your lowest skill area. A short quiz will lift it.</small></div><button type="button" class="cq-go" data-mo="rec:' + wk + '">Start</button></div>')
          : wrap('<div class="mo-fact">🏆 Every mission is cleared. Try the daily challenge to keep your skills sharp.</div>')) +
        h4('Daily challenge') +
        wrap('<div class="mo-row"><span class="cq-ri">🎲</span><div class="mo-t"><b>' + (S.daily === dayKey() ? 'Done for today ✓' : '5 mixed questions') + '</b><small>' + (S.daily === dayKey() ? 'Replay for practice. XP is given once a day.' : 'A new set every day · up to +30 XP') + '</small></div><button type="button" class="cq-go" data-mo="daily">' + (S.daily === dayKey() ? 'Replay' : 'Play') + '</button></div>') +
        h4('Space careers explorer') +
        wrap('<label for="mo-career" class="cq-s" style="display:block;margin-bottom:6px">Pick a career to see the skills and path</label><select id="mo-career" class="mo-sel"><option value="">Choose a career…</option>' + Object.keys(CAREERS).map(function (k) { return '<option value="' + k + '">' + CAREERS[k].i + ' ' + esc(CAREERS[k].t) + '</option>'; }).join('') + '</select><div id="mo-career-card"></div>') +
        h4('Focus timer') +
        wrap('<div class="mo-tm" id="mo-tm" aria-live="off">Ready</div><div class="mo-bs" style="justify-content:center"><button type="button" class="mo-b p" data-mo="tm:10">10 min</button><button type="button" class="mo-b p" data-mo="tm:15">15 min</button><button type="button" class="mo-b p" data-mo="tm:25">25 min</button><button type="button" class="mo-b" data-mo="tm:0">Cancel</button></div><p class="cq-s" style="text-align:center;margin:8px 0 0">Study without distractions and earn XP when you finish.</p>', 'mo-card');
    }
    else if (moTab === 'study') {
      h += h4('Space dictionary') +
        wrap('<input type="search" id="mo-dict-q" class="mo-in" placeholder="Search a word… e.g. orbit" aria-label="Search the space dictionary" autocomplete="off"><div id="mo-dict-list" style="margin-top:8px;max-height:260px;overflow:auto">' + dictHTML('') + '</div><p class="cq-s" style="margin:4px 0 0">Tip: double-click any meaning to hear it.</p>') +
        h4('Did you know?') +
        wrap('<div id="mo-fact">' + esc(FACTS[factIdx]) + '</div>', 'mo-fact') +
        wrap('<div class="mo-bs" style="margin-top:8px"><button type="button" class="mo-b p" data-mo="fact-say">🔊 Listen</button><button type="button" class="mo-b" data-mo="fact-next">Next fact →</button></div>') +
        h4('Printable worksheet') +
        wrap('<p class="cq-s" style="margin:0 0 8px">Print a quiz with an answer key for classrooms with no devices.</p><select id="mo-ws" class="mo-sel"><option value="mix">Mixed: 10 questions</option>' + ids.map(function (id) { return '<option value="' + id + '">' + M[id].i + ' ' + esc(M[id].t) + '</option>'; }).join('') + '</select><div class="mo-bs" style="margin-top:8px"><button type="button" class="mo-b p" data-mo="ws">🖨 Print worksheet</button></div>') +
        h4('My study notes') +
        wrap('<textarea id="mo-notes" class="mo-ta" maxlength="4000" placeholder="Write what you learned… saved on this device." aria-label="Study notes">' + esc(MS.notes) + '</textarea><div class="mo-bs" style="margin-top:8px"><button type="button" class="mo-b" data-mo="notes-say">🔊 Read my notes</button><button type="button" class="mo-b" data-mo="notes-copy">📋 Copy</button><button type="button" class="mo-b" data-mo="notes-clear">🗑 Clear</button></div>');
    }
    else {
      h += h4('Quick travel') +
        wrap('<div class="mo-tg">' + TRAVEL.map(function (t) { return '<button type="button" class="mo-tr" data-mo="go:' + t[0] + '"><span>' + t[1] + '</span>' + t[2] + '</button>'; }).join('') + '</div>') +
        h4('Works with low internet') +
        '<div class="mo-row cq-st" style="--i:' + (n++) + '"><span class="cq-ri">📶</span><div class="mo-t"><b>Offline pack</b><small id="mo-off">Checking…</small></div></div>' +
        wrap('<div class="mo-bs"><button type="button" class="mo-b p" data-mo="off-on">⬇ Save for offline</button><button type="button" class="mo-b" data-mo="off-clear">Remove</button></div>') +
        h4('Share your learning') +
        wrap('<div class="mo-bs"><button type="button" class="mo-b p" data-mo="csv">📄 Download progress (CSV)</button><button type="button" class="mo-b" data-mo="sum">📋 Copy summary</button></div><p class="cq-s" style="margin:8px 0 0">Teachers and parents can open the CSV in Excel or Google Sheets.</p>') +
        h4('Tools') +
        wrap('<div class="mo-bs"><button type="button" class="mo-b" data-mo="fs">⛶ Fullscreen</button><button type="button" class="mo-b" data-mo="share">🔗 Share page</button><button type="button" class="mo-b" data-mo="top">⬆ Back to top</button></div>') +
        '<div style="text-align:center"><button type="button" class="cq-link" data-mo="reset">Reset these settings</button></div>';
    }
    return h;
  }
  function dictHTML(q) {
    q = clean(q).toLowerCase();
    var list = DICT.filter(function (d) { return !q || d[0].toLowerCase().indexOf(q) >= 0 || d[1].toLowerCase().indexOf(q) >= 0; });
    return list.length ? list.map(function (d) { return '<div class="mo-def"><b>' + esc(d[0]) + '</b>' + esc(d[1]) + '</div>'; }).join('') : '<div class="mo-def">No match. Try another word.</div>';
  }
  function careerHTML(k) {
    var c = CAREERS[k]; if (!c) return '';
    return '<div class="mo-card"><h5>' + c.i + ' ' + esc(c.t) + '</h5><div class="lb">School subjects</div><div>' + esc(c.subj) + '</div>' +
      '<div class="lb">Skills to build</div><ul>' + c.skills.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>' +
      '<div class="lb">Your path</div><ol>' + c.path.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>' +
      '<div class="cq-s" style="margin:0 0 8px">Always confirm admission and hiring rules on the official websites.</div>' +
      '<div class="mo-bs"><button type="button" class="mo-b p" data-mo="car-say:' + k + '">🔊 Listen</button><button type="button" class="mo-b" data-mo="go:' + c.go + '">▶ ' + esc(c.goT) + '</button></div></div>';
  }
  function fillVoices() {
    var sel = document.getElementById('mo-voice'); if (!sel || !HAS_TTS) return;
    var vs = speechSynthesis.getVoices() || [], p = speechLang().toLowerCase().split('-')[0];
    function opt(v) { return '<option value="' + esc(v.name) + '">' + esc(v.name) + ' (' + esc(v.lang) + ')</option>'; }
    var mine = vs.filter(function (v) { return String(v.lang).toLowerCase().indexOf(p) === 0; });
    var rest = vs.filter(function (v) { return mine.indexOf(v) < 0; });
    var h = '<option value="">Auto (best for this language)</option>';
    if (mine.length) h += '<optgroup label="This language">' + mine.map(opt).join('') + '</optgroup>';
    if (rest.length) h += '<optgroup label="Other voices">' + rest.map(opt).join('') + '</optgroup>';
    sel.innerHTML = h; sel.value = MS.voice || '';
    if (sel.value !== (MS.voice || '')) sel.value = '';
  }
  function moreInit() {
    if (moTab === 'listen') { fillVoices(); setStatus(); }
    if (moTab === 'skills') { tmTick(); }
    if (moTab === 'tools') { offStatus(); }
  }
  function setSw(btn, on) { btn.classList.toggle('on', on); btn.setAttribute('aria-checked', on ? 'true' : 'false'); }
  function moreClick(t) {
    var a = t.dataset.mo, k;
    if (a.indexOf('tab:') === 0) { moTab = a.slice(4); dBody.innerHTML = renderMore(); dBody.scrollTop = 0; moreInit(); }
    else if (a.indexOf('tg:') === 0) {
      k = a.slice(3); MS[k] = !MS[k]; saveMS(); setSw(t, MS[k]); applyMS();
      if (k === 'dbl') { if (!MS[k]) stopSpeak(); toast(MS[k] ? '🔊 Double-click to listen: ON' : '🔇 Double-click to listen: OFF'); }
    }
    else if (a.indexOf('go:') === 0) { var h = a.slice(3); location.href = (window.CosmosLang && window.CosmosLang.url) ? window.CosmosLang.url(h) : h; }
    else if (a.indexOf('rec:') === 0) { var id = a.slice(4); closePanel(); setTimeout(function () { quiz(id); }, 250); }
    else if (a.indexOf('tm:') === 0) { var m = +a.slice(3); if (m) startTimer(m); else cancelTimer(); }
    else if (a.indexOf('car-say:') === 0) {
      var c = CAREERS[a.slice(8)];
      if (c) speakText(c.t + '. School subjects: ' + c.subj + '. Skills to build: ' + c.skills.join(', ') + '. Your path: ' + c.path.join(' '), document.getElementById('mo-career-card'));
    }
    else if (a === 'daily') { closePanel(); setTimeout(dailyChallenge, 250); }
    else if (a === 'lab') { closePanel(); try { switchTab('skills'); } catch (e) { } }
    else if (a === 'ws') { var sel = document.getElementById('mo-ws'); worksheet(sel ? sel.value : 'mix'); }
    else if (a === 'off-on') offEnable();
    else if (a === 'off-clear') offClear();
    else if (a === 'csv') exportCSV();
    else if (a === 'sum') { try { navigator.clipboard.writeText(summaryText()); toast('📋 Summary copied. Paste it anywhere!'); } catch (e) { toast('Could not copy'); } }
    else if (a === 'stop') stopSpeak();
    else if (a === 'pause') {
      if (!HAS_TTS) return;
      if (speechSynthesis.paused) { speechSynthesis.resume(); t.textContent = '⏸ Pause'; }
      else if (speechSynthesis.speaking) { speechSynthesis.pause(); t.textContent = '▶ Resume'; }
    }
    else if (a === 'page') { var pt = pageText(); if (!pt) toast('Nothing to read on this page'); else { speakText(pt, null); toast('📖 Reading the page…'); } }
    else if (a === 'test') speakText('Hello! I am your COSMOSIS reading buddy. Double-click any text and I will read it to you.', null);
    else if (a === 'fact-say') speakText(FACTS[factIdx], document.getElementById('mo-fact'));
    else if (a === 'fact-next') { stopSpeak(); factIdx = (factIdx + 1) % FACTS.length; var f = document.getElementById('mo-fact'); if (f) f.textContent = FACTS[factIdx]; }
    else if (a === 'notes-say') { if (clean(MS.notes)) speakText(MS.notes, document.getElementById('mo-notes')); else toast('📝 Write something first'); }
    else if (a === 'notes-copy') { try { navigator.clipboard.writeText(MS.notes || ''); toast('📋 Notes copied'); } catch (e) { toast('Could not copy'); } }
    else if (a === 'notes-clear') { if (!MS.notes || confirm('Clear your notes?')) { MS.notes = ''; saveMS(); var ta = document.getElementById('mo-notes'); if (ta) ta.value = ''; } }
    else if (a === 'fs') {
      try {
        if (document.fullscreenElement) document.exitFullscreen();
        else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
        else toast('Fullscreen is not supported here');
      } catch (e) { toast('Fullscreen is not supported here'); }
    }
    else if (a === 'share') {
      var d = { title: document.title, text: 'Explore India\'s space missions on COSMOSIS', url: location.href };
      if (navigator.share) { navigator.share(d).catch(function () { }); }
      else { try { navigator.clipboard.writeText(location.href); toast('🔗 Link copied'); } catch (e) { toast('Could not copy the link'); } }
    }
    else if (a === 'top') { closePanel(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    else if (a === 'reset') {
      if (confirm('Reset listening and comfort settings?')) {
        stopSpeak(); var keep = MS.notes, te = MS.tEnd, tm = MS.tMin;
        MS = { dbl: true, dys: false, sp: false, calm: false, ruler: false, rate: 0.95, pitch: 1, voice: '', notes: keep, tip: 1, tEnd: te, tMin: tm };
        saveMS(); applyMS(); openPanel('more');
      }
    }
  }
  function moreInput(e) {
    var t = e.target; if (!t || curP !== 'more') return;
    if (t.id === 'mo-rate') { MS.rate = +t.value; var r = document.getElementById('mo-rate-v'); if (r) r.textContent = MS.rate.toFixed(2) + '×'; saveMS(); }
    else if (t.id === 'mo-pitch') { MS.pitch = +t.value; var p = document.getElementById('mo-pitch-v'); if (p) p.textContent = MS.pitch.toFixed(2); saveMS(); }
    else if (t.id === 'mo-voice') { MS.voice = t.value; saveMS(); }
    else if (t.id === 'mo-notes') { MS.notes = t.value; saveMS(); }
    else if (t.id === 'mo-dict-q') { var l = document.getElementById('mo-dict-list'); if (l) l.innerHTML = dictHTML(t.value); }
    else if (t.id === 'mo-career') { var cc = document.getElementById('mo-career-card'); if (cc) cc.innerHTML = careerHTML(t.value); }
  }
  timerBoot();

  window.CosmosLearn = {
    open: function () { openPanel('learn'); },
    ai: function () { openPanel('ai'); },
    more: function (tab) { if (tab) moTab = tab; openPanel('more'); },
    speak: function (t) { return speakText(String(t || ''), null); },
    stopSpeak: stopSpeak,
    dailyChallenge: dailyChallenge,
    askAI: askAI,
    quiz: quiz,
    cert: function () { if (nDone() === ids.length) certPreview(); else toast('🔒 Clear all missions first'); },
    close: closePanel,
    state: function () { return S; },
    addXP: function (n, why) { return gainXP(n, why, false); },
    labCleared: function (n) { if ((S.lab || 0) !== n) { S.lab = n; checkAch(); save(); } },
    user: function () { return UID; }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();