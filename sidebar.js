/* ==========================================================================
   Haier A01 Suite — Modern Interactive Icon Dock Sidebar (sidebar.js)
   Works across:
     1. dashboard.html.html (แดชบอร์ด & OT)
     2. faresult.html       (Production Plan VS Result)
     3. FA Stock Management.html (FA-Stock Management)
     4. 6S Management       (Seamless in-app view so sidebar never disappears)
   ========================================================================== */
(function () {
  'use strict';
  if (document.getElementById('haier-modern-sidebar')) return;

  var STORAGE_EXPANDED = 'haier-dock-expanded';
  var SIX_S_URL = 'https://naiice.github.io/6SFA/';

  /* ---------- Detect current host page ---------- */
  function detectHostPage() {
    var p = decodeURIComponent(location.pathname || '').toLowerCase();
    var t = (document.title || '').toLowerCase();
    if (p.indexOf('faresult') !== -1 || t.indexOf('plan vs result') !== -1) return 'faresult';
    if (p.indexOf('stock') !== -1 || t.indexOf('stock') !== -1) return 'fastock';
    if (p.indexOf('dashboard') !== -1 || t.indexOf('wor map') !== -1 || t.indexOf('haier a01') !== -1) return 'dashboard';
    return 'dashboard';
  }

  var hostPage = detectHostPage();
  var activeId = location.hash === '#6s' ? '6s' : hostPage;
  var isLocalFile = location.protocol === 'file:';

  /* ---------- Menu definitions with custom animated SVGs ---------- */
  var ITEMS = [
    {
      id: 'dashboard',
      title: 'แดชบอร์ด & OT',
      desc: 'ดูข้อมูลภาพรวมสรุปผล',
      badge: 'WOR & OT',
      href: isLocalFile ? './dashboard.html.html' : './dashboard.html',
      accent: '#f59e0b',
      accent2: '#f97316',
      glow: 'rgba(245, 158, 11, 0.42)',
      tint: 'linear-gradient(135deg, rgba(245,158,11,0.24), rgba(249,115,22,0.12))',
      svg:
        '<svg class="hmd-svg hmd-svg-dash" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<rect class="bar-1" x="3.5" y="12" width="4" height="8" rx="1.2" fill="currentColor" fill-opacity="0.25"/>' +
          '<rect class="bar-2" x="10" y="7" width="4" height="13" rx="1.2" fill="currentColor" fill-opacity="0.25"/>' +
          '<rect class="bar-3" x="16.5" y="10" width="4" height="10" rx="1.2" fill="currentColor" fill-opacity="0.25"/>' +
          '<circle class="ot-ring" cx="18" cy="5.5" r="3" stroke-width="1.8"/>' +
          '<path d="M18 4.3v1.4l1 .7" stroke-width="1.5"/>' +
        '</svg>'
    },
    {
      id: 'faresult',
      title: 'Production Plan VS Result',
      desc: 'แผนการผลิตและผลลัพธ์การทำงาน',
      badge: 'PLAN / ACTUAL',
      href: './faresult.html',
      accent: '#ec4899',
      accent2: '#f43f5e',
      glow: 'rgba(236, 72, 153, 0.42)',
      tint: 'linear-gradient(135deg, rgba(236,72,153,0.24), rgba(244,63,94,0.12))',
      svg:
        '<svg class="hmd-svg hmd-svg-trend" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M3 3v16a2 2 0 0 0 2 2h16" stroke-opacity="0.55"/>' +
          '<path class="trend-line" d="M6.5 15.5l4.2-4.5 3.3 3 5.5-6.5" stroke-width="2.3"/>' +
          '<polyline class="trend-head" points="16 7.5 19.5 7.5 19.5 11"/>' +
          '<circle class="trend-dot" cx="19.5" cy="7.5" r="1.8" fill="currentColor"/>' +
        '</svg>'
    },
    {
      id: '6s',
      title: '6S Management',
      desc: 'ระบบจัดการและติดตามผลกิจกรรม 6S',
      badge: '6S AUDIT',
      href: SIX_S_URL,
      is6S: true,
      accent: '#10b981',
      accent2: '#22c55e',
      glow: 'rgba(16, 185, 129, 0.42)',
      tint: 'linear-gradient(135deg, rgba(16,185,129,0.24), rgba(34,197,94,0.12))',
      svg:
        '<svg class="hmd-svg hmd-svg-6s" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M12 2.8l7 3.1v5.6c0 4.8-3 8.9-7 10.2-4-1.3-7-5.4-7-10.2V5.9l7-3.1z" fill="currentColor" fill-opacity="0.18"/>' +
          '<path class="check-mark" d="M8.8 12.2l2.2 2.3 4.5-4.6" stroke-width="2.2"/>' +
          '<path class="sparkle-1" d="M19.5 2.5v2.4M18.3 3.7h2.4" stroke-width="1.6"/>' +
        '</svg>'
    },
    {
      id: 'fastock',
      title: 'FA-Stock Management',
      desc: 'จัดการคลังสินค้าและวัตถุดิบ',
      badge: 'INVENTORY',
      href: isLocalFile ? './FA%20Stock%20Management.html' : './FA%20Stock%20Management',
      accent: '#06b6d4',
      accent2: '#14b8a6',
      glow: 'rgba(6, 182, 212, 0.42)',
      tint: 'linear-gradient(135deg, rgba(6,182,212,0.24), rgba(20,184,166,0.12))',
      svg:
        '<svg class="hmd-svg hmd-svg-box" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<path class="box-body" d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" fill="currentColor" fill-opacity="0.16"/>' +
          '<path d="m3.3 7 8.7 5 8.7-5"/>' +
          '<path d="M12 22V12"/>' +
          '<path class="box-tape" d="m7.5 4.6 8.7 5" stroke-opacity="0.75"/>' +
        '</svg>'
    }
  ];

  /* ---------- Inject Styles ---------- */
  var style = document.createElement('style');
  style.id = 'haier-modern-sidebar-style';
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;600;700&display=swap');

    :root {
      --hmd-offset: 84px;
      --hmd-accent: #38bdf8;
      --hmd-glow: rgba(56, 189, 248, 0.38);
    }
    body.hmd-expanded-body {
      --hmd-offset: 316px;
    }

    @media (min-width: 769px) {
      body {
        padding-left: var(--hmd-offset) !important;
        transition: padding-left 0.34s cubic-bezier(0.22, 1, 0.36, 1);
      }
    }

    /* Floating Glass Dock Container */
    .hmd-dock {
      position: fixed;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 62px;
      z-index: 80;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px 8px;
      gap: 10px;
      border-radius: 24px;
      background: linear-gradient(165deg, rgba(15, 23, 42, 0.88) 0%, rgba(10, 15, 30, 0.94) 100%);
      border: 1px solid rgba(255, 255, 255, 0.14);
      box-shadow:
        0 20px 50px rgba(2, 6, 23, 0.45),
        0 0 28px -6px var(--hmd-glow),
        inset 0 1px 0 rgba(255, 255, 255, 0.22);
      -webkit-backdrop-filter: blur(24px) saturate(180%);
      backdrop-filter: blur(24px) saturate(180%);
      font-family: 'Sarabun', system-ui, -apple-system, sans-serif;
      transition:
        width 0.34s cubic-bezier(0.22, 1, 0.36, 1),
        border-radius 0.34s ease,
        box-shadow 0.35s ease;
      user-select: none;
    }

    /* Ambient top-to-bottom neon shimmer line on the dock edge */
    .hmd-dock::before {
      content: '';
      position: absolute;
      inset: -1px;
      border-radius: inherit;
      padding: 1px;
      background: linear-gradient(180deg, rgba(255,255,255,0.28), transparent 40%, var(--hmd-accent) 100%);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
      opacity: 0.65;
      transition: opacity 0.3s;
    }
    .hmd-dock:hover::before {
      opacity: 1;
    }

    /* Expanded Mode */
    .hmd-dock.is-expanded {
      width: 294px;
      align-items: stretch;
      padding: 14px 12px;
      border-radius: 26px;
    }

    /* Top Header (Home + Expand Toggle) */
    .hmd-head {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.10);
    }
    .hmd-dock.is-expanded .hmd-head {
      flex-direction: row;
      justify-content: space-between;
      padding: 0 2px 10px;
    }

    .hmd-brand {
      position: relative;
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: #f8fafc;
      padding: 4px;
      border-radius: 14px;
      transition: transform 0.22s ease, background 0.22s ease;
    }
    .hmd-brand:hover {
      background: rgba(255, 255, 255, 0.08);
      transform: scale(1.05);
    }
    .hmd-brand-orb {
      width: 38px;
      height: 38px;
      border-radius: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #6366f1 0%, #3b82f6 50%, #06b6d4 100%);
      box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4);
      color: #fff;
      flex-shrink: 0;
      transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .hmd-brand:hover .hmd-brand-orb {
      transform: rotate(-10deg) scale(1.08);
    }
    .hmd-brand-orb svg {
      width: 20px;
      height: 20px;
    }
    .hmd-brand-meta {
      display: none;
      flex-direction: column;
      min-width: 0;
    }
    .hmd-dock.is-expanded .hmd-brand-meta {
      display: flex;
    }
    .hmd-brand-title {
      font-size: 13.5px;
      font-weight: 700;
      letter-spacing: 0.2px;
      color: #f8fafc;
      white-space: nowrap;
      line-height: 1.2;
    }
    .hmd-brand-sub {
      font-size: 10.5px;
      color: #94a3b8;
      white-space: nowrap;
      letter-spacing: 0.4px;
    }

    /* Expand / Collapse Button */
    .hmd-expand-btn {
      width: 30px;
      height: 24px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(255, 255, 255, 0.06);
      color: #94a3b8;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      padding: 0;
    }
    .hmd-dock.is-expanded .hmd-expand-btn {
      width: 32px;
      height: 32px;
      border-radius: 10px;
    }
    .hmd-expand-btn:hover {
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      border-color: rgba(255, 255, 255, 0.28);
    }
    .hmd-expand-btn svg {
      width: 15px;
      height: 15px;
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .hmd-dock.is-expanded .hmd-expand-btn svg {
      transform: rotate(180deg);
    }

    /* Navigation Stack */
    .hmd-nav {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    /* Sliding Neon Active Indicator Bar */
    .hmd-active-bar {
      position: absolute;
      left: -8px;
      top: 0;
      width: 4px;
      height: 32px;
      border-radius: 0 6px 6px 0;
      background: var(--hmd-accent);
      box-shadow: 0 0 14px var(--hmd-accent), 0 0 28px var(--hmd-accent);
      transition:
        transform 0.38s cubic-bezier(0.34, 1.56, 0.64, 1),
        background-color 0.3s ease,
        box-shadow 0.3s ease,
        opacity 0.25s ease;
      pointer-events: none;
      z-index: 2;
    }
    .hmd-dock.is-expanded .hmd-active-bar {
      left: -12px;
    }

    /* Menu Item */
    .hmd-item {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3px;
      border-radius: 16px;
      text-decoration: none;
      color: #e2e8f0;
      background: transparent;
      border: 1px solid transparent;
      cursor: pointer;
      transition:
        transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1),
        background 0.25s ease,
        border-color 0.25s ease,
        box-shadow 0.25s ease;
    }
    .hmd-dock.is-expanded .hmd-item {
      justify-content: flex-start;
      padding: 9px 11px;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.04);
      border-color: rgba(255, 255, 255, 0.08);
    }

    /* Dock Magnification & Hover Effects */
    .hmd-dock:not(.is-expanded) .hmd-item:hover {
      transform: scale(1.16) translateX(4px);
      z-index: 10;
    }
    .hmd-dock:not(.is-expanded) .hmd-item.is-neighbor {
      transform: scale(1.06) translateX(1.5px);
    }
    .hmd-dock.is-expanded .hmd-item:hover {
      transform: translateX(4px);
      background: rgba(255, 255, 255, 0.10);
      border-color: rgba(255, 255, 255, 0.22);
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.28);
    }

    /* Active State */
    .hmd-item[aria-current="page"] .hmd-icon-box {
      border-color: var(--item-accent);
      box-shadow:
        0 8px 22px -4px var(--item-glow),
        inset 0 1px 0 rgba(255, 255, 255, 0.35);
    }
    .hmd-dock.is-expanded .hmd-item[aria-current="page"] {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.05));
      border-color: rgba(255, 255, 255, 0.26);
      box-shadow: 0 10px 26px rgba(0, 0, 0, 0.25);
    }

    /* Icon Squircle Box */
    .hmd-icon-box {
      position: relative;
      width: 44px;
      height: 44px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--item-tint);
      color: var(--item-accent);
      border: 1px solid rgba(255, 255, 255, 0.12);
      flex-shrink: 0;
      overflow: hidden;
      transition:
        transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1),
        border-color 0.25s ease,
        box-shadow 0.25s ease,
        color 0.25s ease;
    }
    /* Specular glass sweep on hover */
    .hmd-icon-box::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -60%;
      width: 45%;
      height: 200%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent);
      transform: rotate(25deg);
      transition: left 0.55s ease;
      pointer-events: none;
    }
    .hmd-item:hover .hmd-icon-box::after {
      left: 130%;
    }
    .hmd-item:hover .hmd-icon-box {
      border-color: var(--item-accent);
      box-shadow: 0 8px 22px -3px var(--item-glow);
    }

    /* SVG Micro-animations on Hover */
    .hmd-svg {
      width: 22px;
      height: 22px;
      transition: transform 0.25s ease;
    }
    .hmd-item:hover .hmd-svg-dash .bar-1 { animation: hmdBarPulse 0.6s ease infinite alternate; }
    .hmd-item:hover .hmd-svg-dash .bar-2 { animation: hmdBarPulse 0.6s 0.15s ease infinite alternate; }
    .hmd-item:hover .hmd-svg-dash .bar-3 { animation: hmdBarPulse 0.6s 0.3s ease infinite alternate; }
    .hmd-item:hover .hmd-svg-trend .trend-dot { animation: hmdPing 0.9s ease infinite; }
    .hmd-item:hover .hmd-svg-6s .sparkle-1 { transform-origin: 19.5px 3.7px; animation: hmdSpin 1.4s linear infinite; }
    .hmd-item:hover .hmd-svg-box { animation: hmdFloat 0.8s ease-in-out infinite alternate; }

    @keyframes hmdBarPulse {
      from { transform: translateY(0); }
      to   { transform: translateY(-2px); }
    }
    @keyframes hmdPing {
      0%, 100% { r: 1.8; opacity: 1; }
      50%      { r: 2.8; opacity: 0.7; }
    }
    @keyframes hmdSpin {
      to { transform: rotate(180deg); }
    }
    @keyframes hmdFloat {
      from { transform: translateY(0); }
      to   { transform: translateY(-2.5px); }
    }

    /* Active Dot Badge on Icon Corner */
    .hmd-live-dot {
      position: absolute;
      top: 5px;
      right: 5px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--item-accent);
      box-shadow: 0 0 8px var(--item-accent);
      opacity: 0;
      transform: scale(0.4);
      transition: all 0.25s ease;
    }
    .hmd-item[aria-current="page"] .hmd-live-dot {
      opacity: 1;
      transform: scale(1);
    }

    /* Inline Text (for Expanded Mode) */
    .hmd-label-wrap {
      display: none;
      flex-direction: column;
      min-width: 0;
      flex: 1;
      margin-left: 12px;
    }
    .hmd-dock.is-expanded .hmd-label-wrap {
      display: flex;
    }
    .hmd-title {
      font-size: 13.5px;
      font-weight: 700;
      color: #f8fafc;
      line-height: 1.25;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .hmd-desc {
      font-size: 11px;
      color: #94a3b8;
      line-height: 1.3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 2px;
    }
    .hmd-chev {
      display: none;
      font-size: 18px;
      color: #64748b;
      margin-left: 8px;
      transition: transform 0.2s ease, color 0.2s ease;
    }
    .hmd-dock.is-expanded .hmd-chev {
      display: block;
    }
    .hmd-dock.is-expanded .hmd-item:hover .hmd-chev {
      transform: translateX(3px);
      color: var(--item-accent);
    }

    /* Floating Interactive Tooltip Card (Collapsed Mode) */
    .hmd-tooltip {
      position: absolute;
      left: calc(100% + 16px);
      top: 50%;
      transform: translateY(-50%) translateX(-8px) scale(0.95);
      opacity: 0;
      pointer-events: none;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      border-radius: 16px;
      background: linear-gradient(145deg, rgba(15, 23, 42, 0.96), rgba(23, 33, 58, 0.96));
      border: 1px solid rgba(255, 255, 255, 0.16);
      box-shadow:
        0 14px 34px rgba(0, 0, 0, 0.45),
        0 0 20px -4px var(--item-glow);
      -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);
      white-space: nowrap;
      z-index: 100;
      transition:
        opacity 0.22s ease,
        transform 0.26s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .hmd-tooltip::before {
      content: '';
      position: absolute;
      left: -5px;
      top: 50%;
      transform: translateY(-50%) rotate(45deg);
      width: 9px;
      height: 9px;
      background: rgba(17, 25, 45, 0.96);
      border-left: 1px solid rgba(255, 255, 255, 0.16);
      border-bottom: 1px solid rgba(255, 255, 255, 0.16);
    }
    .hmd-dock:not(.is-expanded) .hmd-item:hover .hmd-tooltip,
    .hmd-dock:not(.is-expanded) .hmd-brand:hover .hmd-tooltip {
      opacity: 1;
      transform: translateY(-50%) translateX(0) scale(1);
    }
    .hmd-tip-bar {
      width: 4px;
      height: 28px;
      border-radius: 4px;
      background: var(--item-accent, #6366f1);
      box-shadow: 0 0 10px var(--item-accent, #6366f1);
      flex-shrink: 0;
    }
    .hmd-tip-content {
      display: flex;
      flex-direction: column;
    }
    .hmd-tip-top {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .hmd-tip-title {
      font-size: 13.5px;
      font-weight: 700;
      color: #f8fafc;
    }
    .hmd-tip-badge {
      font-size: 9.5px;
      font-weight: 700;
      letter-spacing: 0.6px;
      padding: 2px 6px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.10);
      color: var(--item-accent, #818cf8);
      border: 1px solid rgba(255, 255, 255, 0.12);
    }
    .hmd-tip-desc {
      font-size: 11.5px;
      color: #94a3b8;
      margin-top: 2px;
    }

    /* Click Ripple Effect */
    .hmd-ripple {
      position: absolute;
      border-radius: 50%;
      background: var(--item-accent, #38bdf8);
      opacity: 0.45;
      transform: scale(0);
      animation: hmdRippleAnim 0.55s ease-out forwards;
      pointer-events: none;
    }
    @keyframes hmdRippleAnim {
      to {
        transform: scale(2.6);
        opacity: 0;
      }
    }

    /* Seamless 6S Embedded View (keeps sidebar visible!) */
    .hmd-6s-view {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: var(--hmd-offset, 84px);
      z-index: 55;
      background: #0f172a;
      display: none;
      flex-direction: column;
      transition: left 0.34s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .hmd-6s-view.is-active {
      display: flex;
      animation: hmdFadeIn 0.25s ease-out;
    }
    @keyframes hmdFadeIn {
      from { opacity: 0; transform: scale(0.992); }
      to   { opacity: 1; transform: scale(1); }
    }
    .hmd-6s-bar {
      height: 44px;
      padding: 0 16px;
      background: rgba(15, 23, 42, 0.95);
      border-bottom: 1px solid rgba(255, 255, 255, 0.10);
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #e2e8f0;
      font-family: 'Sarabun', sans-serif;
      font-size: 13px;
      flex-shrink: 0;
    }
    .hmd-6s-bar-left {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 700;
    }
    .hmd-6s-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 10px #10b981;
    }
    .hmd-6s-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .hmd-6s-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.14);
      background: rgba(255, 255, 255, 0.06);
      color: #e2e8f0;
      font: 600 12px 'Sarabun', sans-serif;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s;
    }
    .hmd-6s-btn:hover {
      background: rgba(255, 255, 255, 0.14);
      color: #fff;
    }
    .hmd-6s-frame {
      flex: 1;
      width: 100%;
      height: 100%;
      border: 0;
      background: #fff;
    }

    /* Keep theme toggle button aligned nicely at bottom-left */
    .g-theme-btn {
      left: 20px !important;
      bottom: 16px !important;
      z-index: 85 !important;
    }

    /* Mobile Drawer & Trigger */
    .hmd-mobile-fab {
      display: none;
      position: fixed;
      left: 14px;
      bottom: 72px;
      z-index: 85;
      width: 46px;
      height: 46px;
      border-radius: 16px;
      background: linear-gradient(135deg, #0f172a, #1e293b);
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.35);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.38), 0 0 16px rgba(56, 189, 248, 0.25);
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .hmd-backdrop {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 79;
      background: rgba(2, 6, 23, 0.6);
      -webkit-backdrop-filter: blur(4px);
      backdrop-filter: blur(4px);
    }

    @media (max-width: 768px) {
      .hmd-mobile-fab {
        display: flex;
      }
      .hmd-dock {
        left: 12px;
        top: 50%;
        width: 288px;
        align-items: stretch;
        padding: 14px 12px;
        transform: translateY(-50%) translateX(-115%);
      }
      .hmd-dock.is-mobile-open {
        transform: translateY(-50%) translateX(0);
      }
      .hmd-dock .hmd-head {
        flex-direction: row;
        justify-content: space-between;
      }
      .hmd-dock .hmd-brand-meta,
      .hmd-dock .hmd-label-wrap {
        display: flex;
      }
      .hmd-dock .hmd-chev {
        display: block;
      }
      .hmd-dock .hmd-item {
        justify-content: flex-start;
        padding: 9px 11px;
        background: rgba(255, 255, 255, 0.04);
        border-color: rgba(255, 255, 255, 0.08);
      }
      .hmd-dock .hmd-tooltip {
        display: none !important;
      }
      .hmd-backdrop.is-open {
        display: block;
      }
      .hmd-6s-view {
        left: 0 !important;
      }
    }

    @media print {
      .hmd-dock, .hmd-mobile-fab, .hmd-backdrop, .hmd-6s-view {
        display: none !important;
      }
      body {
        padding-left: 0 !important;
      }
    }
  `;
  document.head.appendChild(style);

  /* ---------- Build DOM ---------- */
  function mountSidebar() {
    if (document.getElementById('haier-modern-sidebar')) return;

    var fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'hmd-mobile-fab print-hidden';
    fab.setAttribute('aria-label', 'เปิดเมนูนำทาง');
    fab.setAttribute('data-html2canvas-ignore', 'true');
    fab.innerHTML =
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">' +
        '<path d="M4 7h16M4 12h12M4 17h16"/>' +
      '</svg>';

    var backdrop = document.createElement('div');
    backdrop.className = 'hmd-backdrop print-hidden';
    backdrop.setAttribute('data-html2canvas-ignore', 'true');

    var dock = document.createElement('aside');
    dock.id = 'haier-modern-sidebar';
    dock.className = 'hmd-dock print-hidden';
    dock.setAttribute('aria-label', 'แถบเมนูหลัก');
    dock.setAttribute('data-html2canvas-ignore', 'true');

    var itemsHtml = ITEMS.map(function (it, idx) {
      var isCurrent = it.id === activeId;
      return (
        '<a href="' + it.href + '" class="hmd-item" data-id="' + it.id + '" data-idx="' + idx + '"' +
          (isCurrent ? ' aria-current="page"' : '') +
          ' style="--item-accent:' + it.accent + ';--item-glow:' + it.glow + ';--item-tint:' + it.tint + '">' +
          '<div class="hmd-icon-box">' +
            it.svg +
            '<span class="hmd-live-dot"></span>' +
          '</div>' +
          '<div class="hmd-label-wrap">' +
            '<span class="hmd-title">' + it.title + '</span>' +
            '<span class="hmd-desc">' + it.desc + '</span>' +
          '</div>' +
          '<span class="hmd-chev">›</span>' +
          '<div class="hmd-tooltip" role="tooltip">' +
            '<span class="hmd-tip-bar"></span>' +
            '<div class="hmd-tip-content">' +
              '<div class="hmd-tip-top">' +
                '<span class="hmd-tip-title">' + it.title + '</span>' +
                '<span class="hmd-tip-badge">' + it.badge + '</span>' +
              '</div>' +
              '<span class="hmd-tip-desc">' + it.desc + '</span>' +
            '</div>' +
          '</div>' +
        '</a>'
      );
    }).join('');

    dock.innerHTML =
      '<div class="hmd-head">' +
        '<a href="./index.html" class="hmd-brand" style="--item-accent:#818cf8;--item-glow:rgba(99,102,241,0.45)">' +
          '<div class="hmd-brand-orb">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
              '<rect x="3" y="3" width="7" height="7" rx="2"/>' +
              '<rect x="14" y="3" width="7" height="7" rx="2"/>' +
              '<rect x="14" y="14" width="7" height="7" rx="2"/>' +
              '<rect x="3" y="14" width="7" height="7" rx="2"/>' +
            '</svg>' +
          '</div>' +
          '<div class="hmd-brand-meta">' +
            '<span class="hmd-brand-title">Haier Smart Hub</span>' +
            '<span class="hmd-brand-sub">กลับหน้าเมนูหลัก</span>' +
          '</div>' +
          '<div class="hmd-tooltip" role="tooltip">' +
            '<span class="hmd-tip-bar"></span>' +
            '<div class="hmd-tip-content">' +
              '<div class="hmd-tip-top">' +
                '<span class="hmd-tip-title">หน้าเมนูหลัก</span>' +
                '<span class="hmd-tip-badge">HOME</span>' +
              '</div>' +
              '<span class="hmd-tip-desc">กลับไปยังหน้ารวมระบบทั้งหมด</span>' +
            '</div>' +
          '</div>' +
        '</a>' +
        '<button type="button" class="hmd-expand-btn" id="hmdExpandBtn" title="ขยาย / ย่อแถบเมนู" aria-label="ขยายหรือย่อแถบเมนู">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' +
            '<polyline points="9 18 15 12 9 6"/>' +
          '</svg>' +
        '</button>' +
      '</div>' +
      '<nav class="hmd-nav" id="hmdNav">' +
        '<div class="hmd-active-bar" id="hmdActiveBar"></div>' +
        itemsHtml +
      '</nav>';

    /* Embedded 6S Workspace so sidebar never disappears when opening 6S */
    var view6s = document.createElement('section');
    view6s.id = 'hmd-6s-view';
    view6s.className = 'hmd-6s-view print-hidden';
    view6s.setAttribute('aria-label', '6S Management Workspace');
    view6s.setAttribute('data-html2canvas-ignore', 'true');
    view6s.innerHTML =
      '<header class="hmd-6s-bar">' +
        '<div class="hmd-6s-bar-left">' +
          '<span class="hmd-6s-dot"></span>' +
          '<span>6S Management — ระบบจัดการและติดตามผลกิจกรรม 6S</span>' +
        '</div>' +
        '<div class="hmd-6s-actions">' +
          '<a href="' + SIX_S_URL + '" target="_blank" rel="noopener noreferrer" class="hmd-6s-btn">เปิดในแท็บใหม่ ↗</a>' +
          '<button type="button" class="hmd-6s-btn" id="hmdClose6SBtn">✕ กลับหน้าเดิม</button>' +
        '</div>' +
      '</header>' +
      '<iframe class="hmd-6s-frame" id="hmd6SFrame" title="6S Management" allow="camera; geolocation; clipboard-write"></iframe>';

    document.body.appendChild(fab);
    document.body.appendChild(backdrop);
    document.body.appendChild(dock);
    document.body.appendChild(view6s);

    var nav = document.getElementById('hmdNav');
    var activeBar = document.getElementById('hmdActiveBar');
    var expandBtn = document.getElementById('hmdExpandBtn');
    var close6SBtn = document.getElementById('hmdClose6SBtn');
    var frame6S = document.getElementById('hmd6SFrame');
    var linkEls = Array.prototype.slice.call(nav.querySelectorAll('.hmd-item'));

    /* Position sliding neon indicator bar */
    function moveIndicatorTo(targetId) {
      var itemObj = ITEMS.find(function (x) { return x.id === targetId; }) || ITEMS[0];
      var el = nav.querySelector('.hmd-item[data-id="' + itemObj.id + '"]');
      if (!el || !activeBar) return;
      var top = el.offsetTop + (el.offsetHeight - 32) / 2;
      activeBar.style.transform = 'translateY(' + Math.round(top) + 'px)';
      document.documentElement.style.setProperty('--hmd-accent', itemObj.accent);
      document.documentElement.style.setProperty('--hmd-glow', itemObj.glow);
    }

    /* Update active menu state */
    function setActiveMenu(newId) {
      activeId = newId;
      linkEls.forEach(function (el) {
        if (el.getAttribute('data-id') === newId) {
          el.setAttribute('aria-current', 'page');
        } else {
          el.removeAttribute('aria-current');
        }
      });
      moveIndicatorTo(newId);
    }

    /* Open / Close in-app 6S view */
    function open6SView() {
      if (!frame6S.getAttribute('src')) {
        frame6S.setAttribute('src', SIX_S_URL);
      }
      view6s.classList.add('is-active');
      setActiveMenu('6s');
      try { history.replaceState(null, '', '#6s'); } catch (_) {}
    }

    function close6SView() {
      view6s.classList.remove('is-active');
      setActiveMenu(hostPage);
      try {
        if (location.hash === '#6s') {
          history.replaceState(null, '', location.pathname + location.search);
        }
      } catch (_) {}
    }

    if (close6SBtn) {
      close6SBtn.addEventListener('click', close6SView);
    }

    /* Hover magnification & sliding preview */
    linkEls.forEach(function (el, idx) {
      el.addEventListener('mouseenter', function () {
        var id = el.getAttribute('data-id');
        moveIndicatorTo(id);
        linkEls.forEach(function (other, oIdx) {
          other.classList.toggle('is-neighbor', Math.abs(oIdx - idx) === 1);
        });
      });

      el.addEventListener('mouseleave', function () {
        linkEls.forEach(function (other) { other.classList.remove('is-neighbor'); });
        moveIndicatorTo(activeId);
      });

      el.addEventListener('click', function (ev) {
        var id = el.getAttribute('data-id');

        /* Ripple animation inside icon box */
        var box = el.querySelector('.hmd-icon-box');
        if (box) {
          var rip = document.createElement('span');
          rip.className = 'hmd-ripple';
          rip.style.width = rip.style.height = '44px';
          rip.style.left = '0px';
          rip.style.top = '0px';
          box.appendChild(rip);
          setTimeout(function () { rip.remove(); }, 600);
        }

        /* Close mobile drawer if open */
        dock.classList.remove('is-mobile-open');
        backdrop.classList.remove('is-open');

        /* Handle 6S Management in-page so sidebar never disappears */
        if (id === '6s') {
          ev.preventDefault();
          open6SView();
          return;
        }

        /* If clicking the current host page while 6S is open (or already on host page), just close 6S */
        if (id === hostPage) {
          ev.preventDefault();
          close6SView();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });

    /* Expand / Collapse State */
    function setExpanded(exp, persist) {
      dock.classList.toggle('is-expanded', exp);
      document.body.classList.toggle('hmd-expanded-body', exp);
      setTimeout(function () { moveIndicatorTo(activeId); }, 60);
      if (persist) {
        try { localStorage.setItem(STORAGE_EXPANDED, exp ? '1' : '0'); } catch (_) {}
      }
    }

    try {
      if (localStorage.getItem(STORAGE_EXPANDED) === '1') {
        setExpanded(true, false);
      }
    } catch (_) {}

    expandBtn.addEventListener('click', function () {
      if (window.innerWidth <= 768) {
        dock.classList.remove('is-mobile-open');
        backdrop.classList.remove('is-open');
      } else {
        setExpanded(!dock.classList.contains('is-expanded'), true);
      }
    });

    /* Mobile FAB & Backdrop */
    fab.addEventListener('click', function () {
      var open = !dock.classList.contains('is-mobile-open');
      dock.classList.toggle('is-mobile-open', open);
      backdrop.classList.toggle('is-open', open);
      setTimeout(function () { moveIndicatorTo(activeId); }, 60);
    });
    backdrop.addEventListener('click', function () {
      dock.classList.remove('is-mobile-open');
      backdrop.classList.remove('is-open');
    });

    /* Initial indicator alignment & #6s check */
    requestAnimationFrame(function () {
      if (location.hash === '#6s') {
        open6SView();
      } else {
        moveIndicatorTo(activeId);
      }
    });
    window.addEventListener('resize', function () { moveIndicatorTo(activeId); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountSidebar);
  } else {
    mountSidebar();
  }
})();
