/* COSMOSIS Skills Engine (script5.js) - add <script src="script5.js" defer></script> to index.html
 * Adds a "Skills" tab: 7 hands-on challenges, live Skill Profile radar, skill badges, careers.
 * Shares XP with script3.js (cosmosis_learn_v1). Own progress: cosmosis_skills_v1. */
(function () {
    'use strict';
    if (window.__cosSkills) return; window.__cosSkills = 1;
    var KEY = 'cosmosis_skills_v1', XPK = 'cosmosis_learn_v1';
    var SK = { code: ['Coding', '💻'], math: ['Maths', '🧮'], solve: ['Problem Solving', '🧩'], design: ['Design', '🛰️'], data: ['Data', '📊'], comm: ['Communication', '🎤'], team: ['Teamwork', '🤝'] };
    function uid() {
        try {
            var u = JSON.parse(localStorage.getItem('cosmosis_current_user')); if (!u) return 'anon';
            var e = String(u.email || '').trim().toLowerCase();
            if (!e || e === 'guest@cosmosis.space') return 'guest';
            return e.replace(/[^a-z0-9@._-]/g, '_');
        } catch (e) { return 'anon'; }
    }
    var UID = uid();
    function dayKey(d) { d = d || new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
    function load(u) {
        var p = { done: {}, att: {}, paid: {} };
        try {
            var raw = localStorage.getItem(KEY + ':' + u);
            if (raw) p = Object.assign(p, JSON.parse(raw));
            else if (u !== 'guest' && u !== 'anon' && !localStorage.getItem(KEY + ':legacy-claimed')) {
                var old = localStorage.getItem(KEY);   /* progress saved by the old shared version goes to the first real account, once */
                if (old) { p = Object.assign(p, JSON.parse(old)); localStorage.setItem(KEY + ':legacy-claimed', u); }
            }
        } catch (e) { }
        p.done = p.done || {}; p.att = p.att || {}; p.paid = p.paid || {};
        Object.keys(p.done).forEach(function (k) { var d = p.paid[k] = p.paid[k] || {}; if (p.done[k] >= 60) d.clear = 1; if (p.done[k] >= 100) d.master = 1; });  /* XP for these was already given before */
        return p;
    }
    var P = load(UID);
    function save() { try { localStorage.setItem(KEY + ':' + UID, JSON.stringify(P)); } catch (e) { } }
    function syncUser() { var u = uid(); if (u === UID) return; UID = u; P = load(UID); labSync(); paint(); }
    setInterval(syncUser, 1500);
    window.addEventListener('storage', function (e) { if (!e.key || e.key === 'cosmosis_current_user') syncUser(); });
    function $(s, r) { return (r || document).querySelector(s); }
    function award(xp, why) {
        try {
            if (window.CosmosLearn && CosmosLearn.addXP) { CosmosLearn.addXP(xp, 'Skill Lab: ' + why); return; }
            var S = JSON.parse(localStorage.getItem(XPK + ':' + UID) || '{"xp":0}');   /* fallback if script3.js is missing */
            S.xp = (S.xp || 0) + xp; localStorage.setItem(XPK + ':' + UID, JSON.stringify(S));
        } catch (e) { }
    }
    function toast(m) {
        var t = document.createElement('div'); t.className = 'sk-toast'; t.textContent = m; document.body.appendChild(t);
        setTimeout(function () { t.classList.add('x'); }, 2600); setTimeout(function () { t.remove(); }, 3200);
    }
    var TIER = [[100, 'Master'], [80, 'Expert'], [60, 'Specialist'], [40, 'Crew'], [1, 'Rookie'], [0, 'Untested']];
    function tier(v) { for (var i = 0; i < TIER.length; i++) if (v >= TIER[i][0]) return TIER[i][1]; return 'Untested'; }
    function nextTier(v) { var n = null; TIER.forEach(function (x) { if (x[0] > v) n = x; }); return n; }   /* TIER is high to low, so the last hit is the nearest one above */
    function featured() { return C[Math.floor(Date.now() / 864e5) % C.length]; }
    function nCleared() { return C.filter(function (c) { return (P.done[c.id] || 0) >= 60; }).length; }
    function labSync() { try { if (window.CosmosLearn && CosmosLearn.labCleared) CosmosLearn.labCleared(nCleared()); } catch (e) { } }
    function finish(c, pts) { // pts 0-100
        var old = P.done[c.id] || 0, pd = P.paid[c.id] = P.paid[c.id] || {}, gain = 0, note = [];
        P.att[c.id] = (P.att[c.id] || 0) + 1;
        if (pts > old) P.done[c.id] = pts;
        var best = P.done[c.id] || 0;
        if (best >= 60 && !pd.clear) { pd.clear = 1; gain += c.xp; note.push('cleared'); }
        if (best >= 100 && !pd.master) { pd.master = 1; gain += Math.round(c.xp / 2); note.push('mastered'); }
        if (pts >= 60 && c.id === featured().id && P.feat !== dayKey()) { P.feat = dayKey(); gain += 10; note.push("today's pick"); }
        save();
        if (gain) { award(gain, c.title); toast('✅ ' + c.title + ' ' + note.join(' + ') + '  +' + gain + ' XP'); }
        else toast(pts >= 60 ? '🏅 Score ' + pts + '/100 · ' + tier(best) + (pts > old ? ' (new best)' : '') : 'Score ' + pts + '/100 - try again to improve');
        labSync(); paint();
    }

    /* ---------------- challenges ---------------- */
    var C = [
        {
            id: 'code', skill: 'code', title: 'Landing Sequence', xp: 30, desc: 'Put Vikram\'s landing program in the right order.',
            run: function (el, c) {
                var steps = ['rough_braking();', 'hold_attitude();', 'fine_braking();', 'avoid_hazards();', 'vertical_descent();', 'touch_down();'];
                var order = steps.slice().sort(function () { return Math.random() - .5; }), pick = [], bad = 0;
                function draw() {
                    el.innerHTML = '<p>Tap the lines in the order the lander must run them.</p><div class="sk-code">' + order.map(function (s) {
                        var i = pick.indexOf(s); return '<button class="sk-line' + (i > -1 ? ' on' : '') + '" data-s="' + s + '">' + (i > -1 ? (i + 1) + '. ' : '') + s + '</button>';
                    }).join('') + '</div><p class="sk-m">Mistakes: ' + bad + '</p>';
                    el.querySelectorAll('.sk-line').forEach(function (b) {
                        b.onclick = function () {
                            var s = b.dataset.s; if (pick.indexOf(s) > -1) return;
                            if (s === steps[pick.length]) { pick.push(s); if (pick.length === steps.length) { draw(); finish(c, Math.max(40, 100 - bad * 15)); return; } } else bad++;
                            draw();
                        };
                    });
                }
                draw();
            }
        },
        {
            id: 'math', skill: 'math', title: 'Orbit Calculator', xp: 30, desc: 'Compute orbital speed and period, then find the NavIC-style geostationary height.',
            run: function (el, c) {
                el.innerHTML = '<p>Altitude above Earth (km): <input id="skA" type="number" value="400" min="160" max="400000"></p><p id="skO"></p><p class="sk-m">Task: enter the altitude where the period is about 24 h (geostationary).</p><button class="sk-btn" id="skG">Check my altitude</button>';
                function calc() {
                    var h = +$('#skA', el).value, r = 6371 + h, v = Math.sqrt(398600.4418 / r), T = 2 * Math.PI * r / v / 3600;
                    $('#skO', el).innerHTML = 'Speed <b>' + v.toFixed(2) + ' km/s</b> &nbsp; Period <b>' + T.toFixed(2) + ' h</b> &nbsp; Moon (384,400 km) at this speed: <b>' + (384400 / v / 3600).toFixed(1) + ' h</b>';
                    return Math.abs(T - 23.93);
                }
                $('#skA', el).oninput = calc; calc();
                $('#skG', el).onclick = function () { var d = calc(); finish(c, d < .05 ? 100 : d < .3 ? 80 : d < 1 ? 60 : 30); };
            }
        },
        {
            id: 'solve', skill: 'solve', title: 'Rescue Logic', xp: 30, desc: 'Three quick reasoning puzzles from the Spacewalk Rescue world.',
            run: function (el, c) {
                var Q = [['Oxygen lasts 60 min. Return trip takes 25 min. Repair takes 20 min. How many minutes of spare air?', ['5', '15', '25'], 1],
                ['Tool drifts at 2 m/s. You move at 3 m/s toward it from 12 m away. Seconds to reach it?', ['4', '5', '2.4'], 0],
                ['Two airlocks: one blocked, one 40 m away, speed 0.5 m/s. Time to reach it?', ['20 s', '80 s', '8 s'], 1]];
                var score = 0, i = 0;
                (function ask() {
                    if (i === Q.length) return finish(c, Math.round(score / Q.length * 100));
                    el.innerHTML = '<p><b>Q' + (i + 1) + '.</b> ' + Q[i][0] + '</p>' + Q[i][1].map(function (o, k) { return '<button class="sk-btn" data-k="' + k + '">' + o + '</button>'; }).join(' ');
                    el.querySelectorAll('.sk-btn').forEach(function (b) { b.onclick = function () { if (+b.dataset.k === Q[i][2]) score++; i++; ask(); }; });
                })();
            }
        },
        {
            id: 'design', skill: 'design', title: 'Design a Satellite', xp: 40, desc: 'Choose orbit, payload and power for a mission goal within a mass budget.',
            run: function (el, c) {
                var G = { nav: ['Navigation (like NavIC)', 'GEO', 'clock'], eo: ['Earth observation', 'SSO', 'cam'], sun: ['Study the Sun (like Aditya-L1)', 'L1', 'corona'], wx: ['Weather watching', 'GEO', 'wx'] };
                var PL = { clock: ['Atomic clock + L-band', 30], cam: ['Multispectral camera', 40], corona: ['Coronagraph telescope', 45], wx: ['Weather imager', 40] };
                var OR = { LEO: 'LEO 500 km', SSO: 'Sun-sync 700 km', GEO: 'GEO 36,000 km', L1: 'Sun-Earth L1' };
                var keys = Object.keys(G), g = keys[Math.floor(Math.random() * 4)];
                function sel(id, o) { return '<select id="' + id + '">' + Object.keys(o).map(function (k) { return '<option value="' + k + '">' + (Array.isArray(o[k]) ? o[k][0] : o[k]) + '</option>'; }).join('') + '</select>'; }
                el.innerHTML = '<p>Mission goal: <b>' + G[g][0] + '</b> &nbsp; Mass budget: <b>105 kg</b> (bus = 30 kg)</p><p>Orbit ' + sel('skOr', OR) + '</p><p>Payload ' + sel('skPl', PL) + '</p><p>Solar panels <select id="skPw"><option value="s">Small (15 kg)</option><option value="l">Large (30 kg)</option></select></p><p id="skM" class="sk-m"></p><button class="sk-btn" id="skD">Launch review</button>';
                function mass() { var m = 30 + PL[$('#skPl', el).value][1] + ($('#skPw', el).value === 's' ? 15 : 30); $('#skM', el).textContent = 'Total mass: ' + m + ' kg'; return m; }
                el.onchange = mass; mass();
                $('#skD', el).onclick = function () {
                    var o = $('#skOr', el).value, p = $('#skPl', el).value, w = $('#skPw', el).value, m = mass(), s = 0, fb = [];
                    if (o === G[g][1]) s += 35; else fb.push('orbit does not suit this goal');
                    if (p === G[g][2]) s += 35; else fb.push('payload does not do this job');
                    if ((o === 'GEO' || o === 'L1') === (w === 'l')) s += 20; else fb.push('panel size is not right for this distance');
                    if (m <= 105) s += 10; else fb.push('over the mass budget');
                    $('#skM', el).innerHTML = fb.length ? 'Review: ' + fb.join('; ') + '.' : 'Perfect design!';
                    finish(c, s);
                };
            }
        },
        {
            id: 'data', skill: 'data', title: 'Read the Data', xp: 30, desc: 'Study a Moon temperature-vs-depth chart (sample values) and draw conclusions.',
            run: function (el, c) {
                var d = [0, 20, 40, 60, 80], t = [55, 35, 12, -3, -10], pts = d.map(function (x, i) { return (30 + x * 3.2) + ',' + (120 - t[i] * 1.6); }).join(' ');
                el.innerHTML = '<svg viewBox="0 0 320 180" class="sk-chart"><polyline fill="none" stroke="#a855f7" stroke-width="3" points="' + pts + '"/>' + d.map(function (x, i) { return '<circle cx="' + (30 + x * 3.2) + '" cy="' + (120 - t[i] * 1.6) + '" r="4" fill="#22d3ee"/><text x="' + (22 + x * 3.2) + '" y="150" font-size="10" fill="currentColor">' + x + '</text><text x="' + (24 + x * 3.2) + '" y="' + (112 - t[i] * 1.6) + '" font-size="10" fill="currentColor">' + t[i] + '°</text>'; }).join('') + '<text x="95" y="172" font-size="10" fill="currentColor">depth below surface (mm)</text></svg><p class="sk-m">Illustrative values inspired by Chandrayaan-3 ChaSTE results.</p><p>1. Temperature drop from surface to 80 mm: <select id="q1"><option>?</option><option>45 °C</option><option>65 °C</option><option>10 °C</option></select></p><p>2. Where does it cool fastest? <select id="q2"><option>?</option><option value="a">Near the surface</option><option value="b">Deep down</option></select></p><button class="sk-btn" id="skC">Submit</button>';
                $('#skC', el).onclick = function () { finish(c, ($('#q1', el).value === '65 °C' ? 50 : 0) + ($('#q2', el).value === 'a' ? 50 : 0)); };
            }
        },
        {
            id: 'comm', skill: 'comm', title: 'Mission Briefing', xp: 30, desc: 'Explain a mission in 40-120 words. Scored on clarity checkpoints.',
            run: function (el, c) {
                el.innerHTML = '<p>Write a briefing about any ISRO mission for a Class 6 student. Include the mission name, a year, its goal, and why it matters.</p><textarea id="skT" rows="5" placeholder="Chandrayaan-3 landed near the Moon\'s south pole in 2023..."></textarea><p class="sk-m" id="skW"></p><button class="sk-btn" id="skB">Score my briefing</button> <button class="sk-btn" id="skL">🔊 Listen</button>';
                var T = $('#skT', el);
                T.oninput = function () { $('#skW', el).textContent = (T.value.trim() ? T.value.trim().split(/\s+/).length : 0) + ' words'; };
                $('#skL', el).onclick = function () { if (window.CosmosLearn) CosmosLearn.speak(T.value || 'Write something first'); };
                $('#skB', el).onclick = function () {
                    var s = T.value, n = s.trim() ? s.trim().split(/\s+/).length : 0, r = [/chandrayaan|mangalyaan|aditya|aryabhata|navic|drishti|gaganyaan|isro/i, /\b(19|20)\d\d\b/, /\b(goal|aim|to study|to explore|to land|to measure|purpose|mission was)\b/i, /\b(because|helps|important|matters|useful|benefit)\b/i, null];
                    var ok = r.slice(0, 4).filter(function (x) { return x.test(s); }).length + (n >= 40 && n <= 120 ? 1 : 0);
                    toast(ok + '/5 checkpoints hit'); finish(c, ok * 20);
                };
            }
        },
        {
            id: 'team', skill: 'team', title: 'Crew Roles', xp: 30, desc: 'Match each job to the right crew member, like a real mission team.',
            run: function (el, c) {
                var J = [['Decide go / no-go for burn', 'Commander'], ['Fix a jammed solar panel', 'Engineer'], ['Choose where to collect samples', 'Scientist'], ['Relay status to Mission Control', 'Comms']];
                var R = ['Commander', 'Engineer', 'Scientist', 'Comms'];
                el.innerHTML = J.map(function (j, i) { return '<p>' + j[0] + ' <select data-i="' + i + '"><option>?</option>' + R.map(function (r) { return '<option>' + r + '</option>'; }).join('') + '</select></p>'; }).join('') + '<button class="sk-btn" id="skR">Check crew plan</button>';
                $('#skR', el).onclick = function () { var n = 0; el.querySelectorAll('select').forEach(function (s) { if (s.value === J[+s.dataset.i][1]) n++; }); finish(c, n * 25); };
            }
        }
    ];
    var CAREERS = [['Rocket Engineer', 'math,design'], ['Mission Software Dev', 'code,solve'], ['Planetary Scientist', 'data,math'], ['Satellite Designer', 'design,team'], ['Science Communicator', 'comm,data'], ['Flight Director', 'team,solve']];

    /* ---------------- UI ---------------- */
    var css = document.createElement('style');
    css.textContent = '#section-skills .sk-grid{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}#section-skills .sk-card{padding:18px;border-radius:16px;cursor:pointer;transition:transform .2s}#section-skills .sk-card:hover{transform:translateY(-3px)}#section-skills .sk-bar{height:6px;border-radius:9px;background:rgba(148,163,184,.25);overflow:hidden;margin-top:10px}#section-skills .sk-bar i{display:block;height:100%;background:linear-gradient(90deg,#8b5cf6,#22d3ee)}#section-skills .sk-btn{padding:8px 16px;border-radius:10px;background:#7c3aed;color:#fff;font-weight:600;font-size:13px;margin:4px 4px 4px 0}#section-skills .sk-line{display:block;width:100%;text-align:left;font-family:monospace;padding:8px 12px;margin:5px 0;border-radius:8px;border:1px solid rgba(139,92,246,.4)}#section-skills .sk-line.on{background:rgba(34,197,94,.25)}#section-skills input,#section-skills select,#section-skills textarea{background:rgba(148,163,184,.15);border:1px solid rgba(148,163,184,.4);border-radius:8px;padding:6px 10px;color:inherit;max-width:100%}#section-skills textarea{width:100%}#section-skills select{background-color:#1e1b4b;color:#fff;border-color:rgba(168,120,255,.6)}#section-skills select option,#section-skills select optgroup{background:#1e1b4b;color:#fff}#section-skills .sk-m{font-size:12px;opacity:.7}#section-skills .sk-chart{width:100%;max-width:420px}#section-skills .sk-tag{display:inline-block;font-size:11px;padding:2px 8px;border-radius:99px;background:rgba(139,92,246,.2);margin:2px}.sk-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1e1b4b;color:#fff;padding:10px 18px;border-radius:12px;z-index:9999;transition:opacity .5s;font-size:14px}.sk-toast.x{opacity:0}#section-skills .sk-pill{display:inline-block;font-size:10.5px;font-weight:700;padding:2px 9px;border-radius:99px;background:rgba(34,211,238,.18);border:1px solid rgba(34,211,238,.45);margin-right:6px}#section-skills .sk-pill.m{background:rgba(250,204,21,.2);border-color:rgba(250,204,21,.6)}#section-skills .sk-card.pick{box-shadow:0 0 0 1px rgba(250,204,21,.6),0 0 22px rgba(250,204,21,.18)}#section-skills .sk-rd{height:5px;border-radius:9px;background:rgba(148,163,184,.25);overflow:hidden;margin:3px 0 6px}#section-skills .sk-rd i{display:block;height:100%;background:linear-gradient(90deg,#8b5cf6,#22d3ee)}#section-skills .sk-link{background:none;border:0;text-decoration:underline;opacity:.6;font-size:12px;cursor:pointer;color:inherit}';
    document.head.appendChild(css);

    function radar() {
        var ks = Object.keys(SK), n = ks.length, cx = 170, cy = 130, R = 88, g = '', poly = [], lab = '';
        [.33, .66, 1].forEach(function (f) { g += '<polygon fill="none" stroke="rgba(148,163,184,.35)" points="' + ks.map(function (k, i) { var a = i / n * 6.283 - 1.571; return (cx + Math.cos(a) * R * f) + ',' + (cy + Math.sin(a) * R * f); }).join(' ') + '"/>'; });
        ks.forEach(function (k, i) {
            var a = i / n * 6.283 - 1.571, v = (P.done[k] || 0) / 100, f = Math.max(v, .04);
            poly.push((cx + Math.cos(a) * R * f) + ',' + (cy + Math.sin(a) * R * f));
            var cs = Math.cos(a), an = cs > .25 ? 'start' : cs < -.25 ? 'end' : 'middle'; lab += '<circle cx="' + (cx + cs * R * f) + '" cy="' + (cy + Math.sin(a) * R * f) + '" r="3" fill="#22d3ee"/><text x="' + (cx + cs * (R + 12)) + '" y="' + (cy + Math.sin(a) * (R + 14) + 4) + '" font-size="11" font-weight="600" text-anchor="' + an + '" fill="currentColor">' + SK[k][1] + ' ' + SK[k][0].split(' ')[0] + ' ' + Math.round(v * 100) + '%</text>';
        });
        return '<svg viewBox="-50 0 440 270" style="width:100%;max-width:440px;overflow:visible" role="img" aria-label="Skill profile radar chart">' + g + '<polygon points="' + poly.join(' ') + '" fill="rgba(139,92,246,.45)" stroke="#a855f7" stroke-width="2"/>' + lab + '</svg>';
    }
    function paint() {
        var host = $('#skRoot'); if (!host) return;
        var open = host.dataset.open, nd = C.filter(function (c) { return (P.done[c.id] || 0) >= 60; }).length;
        var avg = Math.round(C.reduce(function (a, c) { return a + (P.done[c.id] || 0); }, 0) / C.length);
        var rank = avg >= 85 ? 'Skill Commander' : avg >= 60 ? 'Mission Specialist' : avg >= 30 ? 'Crew Member' : 'Rookie';
        var weak = C.slice().sort(function (a, b) { return (P.done[a.id] || 0) - (P.done[b.id] || 0); })[0];
        host.innerHTML = '<div class="sk-grid" style="margin-bottom:22px"><div class="glass-panel sk-card" style="cursor:default;text-align:center"><h3 class="font-orbitron" style="font-size:18px">Skill Profile</h3>' + radar() + '<p><b>' + rank + '</b> · ' + nd + '/7 cleared · avg ' + avg + '%</p><div class="sk-bar" role="progressbar" aria-label="Overall skill level" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + avg + '"><i style="width:' + avg + '%"></i></div><p class="sk-m">' + (avg >= 85 ? 'Top rank reached' : '▲ ' + ((avg >= 60 ? 85 : avg >= 30 ? 60 : 30) - avg) + ' pts to ' + (avg >= 60 ? 'Skill Commander' : avg >= 30 ? 'Mission Specialist' : 'Crew Member')) + '</p>' + (nd < 7 ? '<p class="sk-m">Next boost: <b>' + SK[weak.skill][0] + '</b> → ' + weak.title + '</p>' : '<p>🏆 <b>All-Rounder badge unlocked!</b></p>') + '</div><div class="glass-panel sk-card" style="cursor:default"><h3 class="font-orbitron" style="font-size:18px;margin-bottom:8px">Skill Badges</h3>' + C.map(function (c) { var d = (P.done[c.id] || 0) >= 60; return '<span class="sk-tag" style="opacity:' + (d ? 1 : .4) + '">' + SK[c.skill][1] + ' ' + (d ? '' : '🔒 ') + c.title + '</span>'; }).join('') + '<h3 class="font-orbitron" style="font-size:18px;margin:16px 0 8px">Careers</h3>' + CAREERS.map(function (r) { var ks = r[1].split(','), rd = Math.round(ks.reduce(function (a, k) { return a + (P.done[k] || 0); }, 0) / ks.length); return '<div style="font-size:13px;margin:6px 0"><b>' + r[0] + '</b> <span class="sk-m">' + (rd >= 60 ? '✅ ready' : rd + '% ready') + '</span><div class="sk-rd"><i style="width:' + rd + '%"></i></div>' + ks.map(function (k) { return '<span class="sk-tag">' + SK[k][0] + '</span>'; }).join('') + '</div>'; }).join('') + '</div></div><div class="sk-grid">' + C.map(function (c) {
            var v = P.done[c.id] || 0, nt = nextTier(v), pick = c.id === featured().id, at = P.att[c.id] || 0; return '<div class="glass-panel sk-card' + (pick ? ' pick' : '') + '" data-id="' + c.id + '"><div style="font-size:26px">' + SK[c.skill][1] + (pick ? ' <span class="sk-pill m">⭐ Today\'s pick +10 XP</span>' : '') + '</div><h4 class="font-orbitron" style="font-size:15px;margin:6px 0">' + c.title + '</h4><p class="sk-m">' + c.desc + '</p><div class="sk-bar" role="progressbar" aria-label="' + c.title + ' best score" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + v + '"><i style="width:' + v + '%"></i></div><p class="sk-m" style="margin-top:4px"><span class="sk-pill' + (v >= 100 ? ' m' : '') + '">' + tier(v) + '</span>' + SK[c.skill][0] + ' · best ' + v + '% · ' + at + (at === 1 ? ' try' : ' tries') + '</p><p class="sk-m">' + (nt ? '▲ ' + (nt[0] - v) + ((nt[0] - v) === 1 ? ' pt' : ' pts') + ' to ' + nt[1] : '🏆 Mastered') + ' · +' + c.xp + ' XP to clear, +' + Math.round(c.xp / 2) + ' for 100%</p></div>';
        }).join('') + '</div><div id="skStage" class="glass-panel" style="display:none;margin-top:18px;padding:20px;border-radius:16px"></div><p style="text-align:center;margin-top:14px"><button class="sk-link" id="skReset">Reset my Skill Lab progress</button></p>';
        var rs = $('#skReset', host); if (rs) rs.onclick = function () { if (confirm('Reset Skill Lab progress for this account? Your XP is kept.')) { P = { done: {}, att: {}, paid: {} }; save(); labSync(); paint(); } };
        host.querySelectorAll('.sk-card[data-id]').forEach(function (el) {
            el.onclick = function () {
                var c = C.filter(function (x) { return x.id === el.dataset.id; })[0], st = $('#skStage', host);
                host.dataset.open = c.id; st.style.display = 'block'; st.innerHTML = '<h3 class="font-orbitron" style="font-size:18px;margin-bottom:10px">' + SK[c.skill][1] + ' ' + c.title + '</h3><div id="skBody"></div>';
                c.run($('#skBody', st), c); st.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            };
        });
        if (open) { /* keep stage closed after repaint so scores refresh cleanly */ host.dataset.open = ''; }
    }
    function mount() {
        var t = document.getElementById('section-teacher'); if (!t || document.getElementById('section-skills')) return;
        var s = document.createElement('section'); s.id = 'section-skills'; s.className = 'tab-section hidden py-10';
        s.innerHTML = '<h2 class="font-orbitron text-3xl sm:text-4xl font-bold mb-2">Skill Lab</h2><p class="mb-6" style="opacity:.75">Learn it, then build it. Clear challenges to grow your Skill Profile and earn XP.</p><a href="index12.html" class="glass-panel" style="display:flex;gap:14px;align-items:center;padding:16px 18px;border-radius:16px;margin-bottom:18px;text-decoration:none;color:inherit"><span style="font-size:34px">🌍</span><span><b class="font-orbitron">Customise your own Earth</b><br><span style="opacity:.75;font-size:13px">Set oxygen, CO₂, water, distance from the Sun, air pressure, gravity and magnetic field, then see if life survives. Take the Mars, Venus and Snowball challenges for XP.</span></span></a><div id="skRoot"></div>';
        t.parentNode.insertBefore(s, t.nextSibling);
        var nt = document.getElementById('nav-teacher');
        if (nt) { var b = nt.cloneNode(true); b.id = 'nav-skills'; b.textContent = 'Skills'; b.setAttribute('onclick', "switchTab('skills')"); nt.parentNode.insertBefore(b, nt.nextSibling); }
        var home = document.getElementById('section-home');
        if (home) { var h = document.createElement('div'); h.className = 'glass-panel mt-10 p-6 rounded-2xl max-w-3xl w-full'; h.innerHTML = '<h3 class="font-orbitron text-xl mb-1">Learn it. Then build it.</h3><p class="text-sm mb-3" style="opacity:.75">Explore missions, then prove your skills in 7 hands-on challenges.</p><button class="sk-btn" style="padding:10px 20px;border-radius:10px;background:#7c3aed;color:#fff;font-weight:700" onclick="switchTab(\'skills\')">Open Skill Lab →</button>'; home.appendChild(h); }
        paint();
    }
    window.CosmosSkills = { summary: function () { var avg = Math.round(C.reduce(function (a, c) { return a + (P.done[c.id] || 0); }, 0) / C.length); return { cleared: nCleared(), total: C.length, avg: avg, rank: avg >= 85 ? 'Skill Commander' : avg >= 60 ? 'Mission Specialist' : avg >= 30 ? 'Crew Member' : 'Rookie' }; } };
    function boot() { mount(); labSync(); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();