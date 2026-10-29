/* Haier A01 Suite - Glassy theme (light + dark). Add ONE line before </head>:
   <script src="glass-theme.js"></script>      (no layout / content changes) */
(function () {
  'use strict';
  var KEY = 'haier-theme', root = document.documentElement, cur;

  /* ---------- 1. generated colour rules (dark mode tints) ---------- */
  var T = {
    blue: ['59,130,246', '#8ec5ff'], emerald: ['16,185,129', '#5fe0a1'], green: ['34,197,94', '#6fe8a0'],
    teal: ['20,184,166', '#5eead4'], cyan: ['6,182,212', '#6fe3f5'], rose: ['244,63,94', '#ff9aae'],
    red: ['239,68,68', '#ff9d9d'], orange: ['249,115,22', '#ffb066'], amber: ['245,158,11', '#ffc46b'],
    yellow: ['234,179,8', '#fde047'], purple: ['139,92,246', '#c9b6ff'], indigo: ['99,102,241', '#aeb4ff'],
    fuchsia: ['217,70,239', '#f1a8ff']
  };
  var gen = '';
  Object.keys(T).forEach(function (c) {
    var rgb = T[c][0], ink = T[c][1], bg = [];
    ['50', '100', '50/30', '50/40', '50/50', '50/60'].forEach(function (n) { bg.push('@D [class~="bg-' + c + '-' + n + '"]'); });
    gen += bg.join(',') + '{background-color:rgba(' + rgb + ',.16)}';
    gen += [300, 400, 500, 600, 700, 800, 900].map(function (n) { return '@D [class~="text-' + c + '-' + n + '"]'; }).join(',') + '{color:' + ink + '}';
    gen += [100, 200, 300].map(function (n) { return '@D [class~="border-' + c + '-' + n + '"]'; }).join(',') + '{border-color:rgba(' + rgb + ',.32)}';
    gen += '@D [class*="hover:bg-' + c + '-50"]:hover{background-color:rgba(' + rgb + ',.2)}';
  });
  var HEX = { ea580c: '#ffb066', '0369a1': '#7cc7ff', '2563eb': '#8ec5ff', '1e3a8a': '#9cc2ff', '581c87': '#d2b4ff',
    '064e3b': '#6fe3b0', '14532d': '#7ee8a6', '881337': '#ff9db4', '92400e': '#ffc46b' };
  Object.keys(HEX).forEach(function (h) { gen += '@D [class~="text-[#' + h + ']"]{color:' + HEX[h] + '}'; });

  /* ---------- 2. stylesheet ---------- */
  var CSS = `
@L{--g-bg:#e8ddd0;--g-card:rgba(255,255,255,.55);--g-nav:rgba(255,255,255,.5);--g-filter:rgba(255,255,255,.42);
--g-seg:rgba(20,32,48,.07);--g-pill:rgba(255,255,255,.75);--g-edge:rgba(255,255,255,.75);--g-hi:rgba(255,255,255,.85);
--g-line:rgba(20,32,48,.12);--g-ink:#17202c;--g-ink-2:#435061;--g-ink-3:#5d6b7b;--g-accent:#0a64ad;--g-on-accent:#fff;
--g-shadow:0 10px 32px rgba(60,40,20,.12);--g-blur:blur(22px) saturate(160%);
--g-page:radial-gradient(60% 55% at 12% 8%,rgba(255,214,170,.95),transparent 70%),radial-gradient(55% 60% at 90% 12%,rgba(190,215,240,.9),transparent 70%),radial-gradient(60% 60% at 80% 95%,rgba(236,190,160,.85),transparent 70%),radial-gradient(55% 55% at 8% 92%,rgba(200,185,160,.85),transparent 70%),linear-gradient(135deg,#efe6da,#dcd0c1)}
@D{color-scheme:dark;--g-bg:#080d16;--g-card:rgba(255,255,255,.07);--g-nav:rgba(12,19,30,.6);--g-filter:rgba(255,255,255,.06);
--g-seg:rgba(255,255,255,.07);--g-pill:rgba(255,255,255,.16);--g-edge:rgba(255,255,255,.14);--g-hi:rgba(255,255,255,.18);
--g-line:rgba(255,255,255,.14);--g-ink:#eef3f9;--g-ink-2:#b6c3d1;--g-ink-3:#8798ab;--g-accent:#7cc7ff;--g-on-accent:#04202f;
--g-shadow:0 12px 40px rgba(0,0,0,.4);--g-blur:blur(24px) saturate(160%);
--g-page:radial-gradient(55% 55% at 10% 6%,rgba(70,110,200,.55),transparent 70%),radial-gradient(50% 55% at 92% 14%,rgba(120,70,190,.45),transparent 70%),radial-gradient(60% 60% at 82% 96%,rgba(20,130,140,.42),transparent 70%),radial-gradient(50% 50% at 6% 94%,rgba(190,100,70,.3),transparent 70%),linear-gradient(135deg,#0a1120,#0d1626)}

/* page background */
@T body{background-color:var(--g-bg);background-image:var(--g-page);background-attachment:fixed;background-size:cover;color:var(--g-ink)}
@T #digital-background{background:var(--g-page)}
@T #digital-globe{opacity:.5}
@D #digital-background::after{opacity:.06}

/* glass surfaces */
@T [class~="bg-white"]{background-color:var(--g-card)}
@T [class~="bg-[#f8fafc]"]{background-color:var(--g-card)}
@L [class~="bg-slate-50"],@L [class~="bg-slate-50/50"],@L [class~="bg-slate-50/30"],@L [class~="bg-slate-50/70"]{background-color:rgba(255,255,255,.38)}
@L [class~="bg-slate-100"]{background-color:var(--g-seg)}
@L [class~="bg-slate-200/50"]{background-color:rgba(20,32,48,.08)}
@L .fixed [class~="bg-white"]{background-color:rgba(255,255,255,.84)}
@L [class*="rounded-[2"].bg-white,@L [class*="rounded-3xl"].bg-white,@L [class*="rounded-2xl"].bg-white{border-color:var(--g-edge)}
@supports selector(:has(a)){
 @T .bg-white[class*="rounded-[2"]:not(#dashboard-capture-area):not(:has(.fixed)),
 @T .bg-white[class*="rounded-3xl"]:not(:has(.fixed)),@T .bg-white[class*="rounded-2xl"]:not(:has(.fixed)){-webkit-backdrop-filter:var(--g-blur);backdrop-filter:var(--g-blur)}
 @T #dashboard-capture-area:not(:has(.fixed)){-webkit-backdrop-filter:var(--g-blur);backdrop-filter:var(--g-blur)}
}
@T #root main table thead,@T #root main table thead.sticky{background:rgba(243,246,250,.92)}
@D #root main table thead,@D #root main table thead.sticky{background:rgba(24,34,48,.94)}
@T #root main table th{color:var(--g-ink-2)}

/* top bar */
@T #root .suite-nav{background:var(--g-nav);border:0;border-bottom:1px solid var(--g-edge);box-shadow:var(--g-shadow);-webkit-backdrop-filter:var(--g-blur);backdrop-filter:var(--g-blur)}
@T .suite-brand h1{color:var(--g-ink)}
@T .suite-brand p{color:var(--g-ink-3)}
@T .suite-tabs button{color:var(--g-ink-2);background:transparent;border-color:transparent}
@T .suite-tabs button:hover{background:rgba(127,127,127,.14);color:var(--g-ink)}
@T .suite-tabs button[aria-current="page"]{background:var(--g-pill);color:var(--g-accent);border-color:var(--g-edge);box-shadow:0 2px 8px rgba(0,0,0,.12),inset 0 1px 0 var(--g-hi)}
@T #root .suite-filters{background:var(--g-filter);border-bottom:0;border-top:1px solid var(--g-line)}
@T .suite-filters > div{background:var(--g-seg)}
@T .suite-filters button{color:var(--g-ink-2)}
@T .suite-filters button[aria-pressed="true"]{background:var(--g-pill);color:var(--g-accent);box-shadow:0 2px 8px rgba(0,0,0,.12),inset 0 1px 0 var(--g-hi)}
@T .suite-language button{color:var(--g-ink-2);border-color:var(--g-line)}
@T .suite-language button:hover{border-color:var(--g-accent)}
@T .suite-language button[aria-pressed="true"]{background:var(--g-accent);border-color:var(--g-accent);color:var(--g-on-accent)}
@T #root .suite-kpi{background:var(--g-card);border-color:var(--g-edge);box-shadow:var(--g-shadow)}
@T #root .suite-kpi:last-child{background:rgba(16,185,129,.16);border-color:rgba(16,185,129,.35)}
@T .suite-kpi > i{background:rgba(59,130,246,.15)}
@T .suite-kpi:last-child > i{background:rgba(16,185,129,.2)}
@T .suite-kpi > div > p:first-child{color:var(--g-ink)}
@T .suite-kpi > div > p:last-child{color:var(--g-ink-3)}
@T #root > div > footer{background:var(--g-nav);border-color:var(--g-line);-webkit-backdrop-filter:var(--g-blur);backdrop-filter:var(--g-blur)}
@T #root > div > footer > div{color:var(--g-ink-3)}

/* dark mode: neutral colours */
@D .text-slate-900,@D .text-slate-800{color:#f1f5fa}
@D .text-slate-700{color:#e2e8f0}
@D .text-slate-600{color:#cbd5e1}
@D .text-slate-500{color:#aab8c8}
@D .text-slate-400{color:#8fa0b4}
@D .text-slate-300{color:#73859a}
@D [class~="bg-slate-50"],@D [class~="bg-slate-100"],@D [class~="bg-slate-50/30"],@D [class~="bg-slate-50/50"],@D [class~="bg-slate-50/70"]{background-color:rgba(255,255,255,.06)}
@D [class~="bg-slate-200"],@D [class~="bg-slate-200/50"]{background-color:rgba(255,255,255,.14)}
@D .fixed [class~="bg-white"]{background-color:rgba(20,30,44,.92)}
@D .border-slate-50,@D .border-slate-100{border-color:rgba(255,255,255,.09)}
@D .border-slate-200,@D .border-slate-300{border-color:rgba(255,255,255,.17)}
@D [class*="border-[#"]{border-color:rgba(255,255,255,.18)}
@D .divide-slate-100>:not([hidden])~:not([hidden]){border-color:rgba(255,255,255,.09)}
@D [class*="hover:bg-slate-"]:hover,@D [class*="hover:bg-white"]:hover{background-color:rgba(255,255,255,.1)}
@D .haier-companion button{background:rgba(30,42,58,.88);color:#dbe7f3;border-color:rgba(255,255,255,.15)}
@D svg text[fill="#64748b"]{fill:#9fb0c3}
@D svg text[fill="#0f172a"]{fill:#eef3f9}
@D svg line[stroke="#cbd5e1"]{stroke:rgba(255,255,255,.2)}
@D svg line[stroke="#94a3b8"]{stroke:rgba(255,255,255,.35)}
@D svg circle[fill="#ffffff"]{fill:#16212f}
@D .f3d-wrap{background:linear-gradient(160deg,#0f1b2b,#16263b);border-color:rgba(255,255,255,.12)}
@D .f3d-tag{background:rgba(20,30,44,.9);border-color:rgba(255,255,255,.15)}
@D .f3d-tag b{color:#eef3f9}
@D .f3d-tag small,@D .f3d-hint{color:#9fb0c3}
@D .f3d-bar button{background:rgba(30,42,58,.9);color:#dbe7f3;border-color:rgba(255,255,255,.15)}
@D .f3d-bar button[aria-pressed=true]{background:#2563eb;color:#fff;border-color:#2563eb}
@D input::placeholder{color:#7b8da1}
` + gen + `
/* theme toggle button */
.g-theme-btn{position:fixed;left:16px;bottom:16px;z-index:45;width:46px;height:46px;border-radius:50%;border:1px solid var(--g-edge);
background:var(--g-pill);color:var(--g-ink);display:grid;place-items:center;cursor:pointer;box-shadow:var(--g-shadow);
-webkit-backdrop-filter:var(--g-blur);backdrop-filter:var(--g-blur);transition:transform .15s}
.g-theme-btn:hover{transform:scale(1.08)}
.g-theme-btn:focus-visible{outline:3px solid #60a5fa;outline-offset:3px}
.g-theme-btn .g-sun{display:none}
@D .g-theme-btn .g-sun{display:block}
@D .g-theme-btn .g-moon{display:none}

/* browsers without backdrop-filter: more opaque panels */
@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){
 @L{--g-card:rgba(255,255,255,.88);--g-nav:rgba(255,255,255,.92)}
 @D{--g-card:rgba(24,34,48,.92);--g-nav:rgba(14,22,34,.94)}
}
@media print{
 @T body,@T #digital-background{background:#fff!important}
 @T [class~="bg-white"]{background:#fff!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important}
 .g-theme-btn{display:none!important}
}
`;
  CSS = CSS.replace(/@D/g, 'html[data-theme="dark"]').replace(/@L/g, 'html[data-theme="light"]').replace(/@T/g, 'html[data-theme]');

  /* ---------- 3. theme state ---------- */
  function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function apply(t, persist) {
    cur = t; root.setAttribute('data-theme', t);
    if (persist) { try { localStorage.setItem(KEY, t); } catch (e) {} }
    var b = document.getElementById('g-theme-btn');
    if (b) {
      var next = t === 'dark' ? 'โหมดสว่าง / Light mode' : 'โหมดมืด / Dark mode';
      b.setAttribute('aria-label', next); b.title = next;
    }
  }
  var s = saved();
  apply(s === 'dark' || s === 'light' ? s : (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

  var st = document.createElement('style');
  st.id = 'glass-theme-style'; st.textContent = CSS;
  document.head.appendChild(st);

  /* ---------- 4. toggle button ---------- */
  function addButton() {
    if (document.getElementById('g-theme-btn')) return;
    var b = document.createElement('button');
    b.type = 'button'; b.id = 'g-theme-btn'; b.className = 'g-theme-btn print-hidden';
    b.setAttribute('data-html2canvas-ignore', 'true');
    b.innerHTML = '<svg class="g-moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' +
      '<svg class="g-sun" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
    b.addEventListener('click', function () { apply(cur === 'dark' ? 'light' : 'dark', true); });
    document.body.appendChild(b);
    apply(cur);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addButton); else addButton();

  /* ---------- 5. screenshots (WeChat) and printing always use the light theme ---------- */
  function wrapCapture() {
    var orig = window.html2canvas;
    if (!orig || orig.__glass) return;
    var w = function () {
      var args = arguments, was = cur;
      if (was === 'dark') root.setAttribute('data-theme', 'light');
      var back = function () { if (was === 'dark') root.setAttribute('data-theme', 'dark'); };
      return new Promise(function (r) { setTimeout(r, 80); })
        .then(function () { return orig.apply(window, args); })
        .then(function (c) { back(); return c; }, function (e) { back(); throw e; });
    };
    w.__glass = true; window.html2canvas = w;
  }
  window.addEventListener('load', wrapCapture);
  window.addEventListener('beforeprint', function () { if (cur === 'dark') root.setAttribute('data-theme', 'light'); });
  window.addEventListener('afterprint', function () { root.setAttribute('data-theme', cur); });
})();
