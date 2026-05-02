import { useState, useRef } from "react";

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const G = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300..900;1,9..40,300..900&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

:root{
  --bg:       #0A0A0A;
  --surface:  #111111;
  --surface2: #1A1A1A;
  --border:   rgba(196,160,80,0.12);
  --border2:  rgba(196,160,80,0.20);
  --accent:   #C4A050;
  --accent2:  #D4B060;
  --acc-dim:  rgba(196,160,80,0.10);
  --text:     #F5F0E8;
  --text2:    #9A8E78;
  --text3:    #5A5040;
  --err:      #FF4D4D;
  --green:    #C4A050;
  --green-dim:rgba(196,160,80,0.10);
  --blue:     #C4A050;
  --blue-dim: rgba(196,160,80,0.10);
  --purple:   #C4A050;
  --pur-dim:  rgba(196,160,80,0.10);
  --amber:    #C4A050;
  --amb-dim:  rgba(196,160,80,0.10);
  --pink:     #C4A050;
  --pink-dim: rgba(196,160,80,0.10);
  --teal:     #C4A050;
  --teal-dim: rgba(196,160,80,0.10);

  --font:'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif;

  --r-xs:6px; --r-sm:10px; --r-md:14px; --r-lg:18px; --r-xl:22px; --r-pill:100px;

  --sh-sm:0 2px 12px rgba(0,0,0,0.40);
  --sh-md:0 4px 20px rgba(0,0,0,0.55);
  --sh-lg:0 8px 40px rgba(0,0,0,0.70);
}

body{
  background:var(--bg);color:var(--text);
  font-family:var(--font);-webkit-font-smoothing:antialiased;
}

/* ── PHONE SHELL ── */
.wrap{
  min-height:100vh;display:flex;align-items:flex-start;justify-content:center;
  padding:36px 16px 80px;
  background:
    radial-gradient(ellipse 60% 40% at 50% 0%,rgba(196,160,80,0.04) 0%,transparent 60%),
    linear-gradient(180deg,#050505 0%,#080808 100%);
}
.phone{
  width:393px;min-height:852px;background:var(--bg);border-radius:48px;
  overflow:hidden;position:relative;
  border:1px solid rgba(196,160,80,0.10);
  box-shadow:
    0 0 0 1px rgba(0,0,0,0.95),
    0 40px 100px rgba(0,0,0,0.85),
    0 80px 160px rgba(0,0,0,0.50),
    inset 0 0.5px 0 rgba(196,160,80,0.08);
}
@media(max-width:430px){
  .wrap{padding:0;background:var(--bg);}
  .phone{width:100vw;min-height:100vh;border-radius:0;border:none;box-shadow:none;}
}
.screen{padding-bottom:96px;min-height:800px;}

/* ── LAYOUT ── */
.px{padding-left:20px;padding-right:20px;}
.row{display:flex;align-items:center;} .col{display:flex;flex-direction:column;}
.between{justify-content:space-between;} .cx{justify-content:center;} .flex1{flex:1;}
.g1{gap:6px} .g2{gap:12px} .g3{gap:18px} .g4{gap:24px}
.mb1{margin-bottom:6px} .mb2{margin-bottom:12px} .mb3{margin-bottom:20px} .mb4{margin-bottom:28px}
.mt1{margin-top:6px}    .mt2{margin-top:12px}    .mt3{margin-top:20px}
.pt2{padding-top:16px}  .pt3{padding-top:24px}

/* ── TYPOGRAPHY ── */
.t-display{font-size:36px;font-weight:700;letter-spacing:-0.8px;line-height:1.1;}
.t-title  {font-size:26px;font-weight:700;letter-spacing:-0.5px;line-height:1.2;}
.t-h2     {font-size:20px;font-weight:600;letter-spacing:-0.3px;}
.t-h3     {font-size:17px;font-weight:600;}
.t-body   {font-size:15px;font-weight:400;line-height:1.5;}
.t-sub    {font-size:14px;font-weight:400;color:var(--text2);}
.t-foot   {font-size:12px;font-weight:400;color:var(--text2);}
.t-label  {font-size:11px;font-weight:500;letter-spacing:0.6px;text-transform:uppercase;color:var(--text3);}
.accent{color:var(--accent);} .muted{color:var(--text2);} .soft{color:var(--text3);}

/* ── INPUTS ── */
.inp{
  width:100%;background:var(--surface);border:1.5px solid var(--border2);
  border-radius:var(--r-md);padding:14px 16px;color:var(--text);
  font-family:var(--font);font-size:15px;font-weight:400;outline:none;
  transition:border-color .18s,box-shadow .18s;
  -webkit-appearance:none;appearance:none;color-scheme:dark;
}
.inp:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(196,160,80,0.12);}
.inp::placeholder{color:var(--text3);}
.lbl{font-size:11px;font-weight:500;letter-spacing:0.6px;text-transform:uppercase;
     color:var(--text3);margin-bottom:7px;display:block;}
.iw{margin-bottom:16px;}

/* ── BUTTONS ── */
.btn{
  width:100%;padding:15px;border-radius:var(--r-md);font-family:var(--font);
  font-size:15px;font-weight:600;cursor:pointer;border:none;outline:none;
  transition:all .18s cubic-bezier(.4,0,.2,1);letter-spacing:0.1px;
  -webkit-tap-highlight-color:transparent;
}
.btn-p{background:var(--accent);color:#fff;}
.btn-p:hover{background:#D4B060;filter:brightness(1.08);}
.btn-p:active{transform:scale(.97);opacity:.9;}
.btn-p:disabled{opacity:.25;cursor:not-allowed;transform:none;}
.btn-o{background:transparent;color:var(--text);border:1.5px solid var(--border2);}
.btn-o:hover{border-color:rgba(245,247,250,0.18);background:rgba(245,247,250,0.03);}
.btn-o:active{transform:scale(.97);}
.btn-g{background:rgba(196,160,80,0.10);color:#C4A050;border:1px solid rgba(196,160,80,0.20);}
.btn-g:hover{background:rgba(196,160,80,0.16);}
.btn-g:active{transform:scale(.97);}

/* ── CARDS ── */
.card{
  background:var(--surface);border:1px solid var(--border);
  border-radius:var(--r-lg);padding:16px;
}
.tap{cursor:pointer;transition:transform .15s,opacity .15s;}
.tap:active{transform:scale(.97);opacity:.8;}

/* ── TAGS ── */
.tag{
  display:inline-flex;align-items:center;gap:4px;
  border-radius:var(--r-pill);padding:4px 11px;
  font-size:11px;font-weight:600;letter-spacing:0.2px;
}
.tag-a {background:var(--acc-dim);color:var(--accent);}
.tag-g {background:rgba(196,160,80,0.10);color:#C4A050;}
.tag-b {background:var(--blue-dim);color:var(--blue);}
.tag-am{background:var(--amb-dim);color:var(--amber);}
.tag-s {background:rgba(245,247,250,0.06);color:var(--text2);}
.tag-p {background:var(--pur-dim);color:var(--purple);}

/* ── AVATAR ── */
.av{
  border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-weight:700;flex-shrink:0;color:#fff;font-family:var(--font);
  background:linear-gradient(135deg,#C4A050,#8A6A28);
  letter-spacing:-0.3px;
}
.av-s {width:32px;height:32px;font-size:13px;}
.av-m {width:44px;height:44px;font-size:17px;}
.av-l {width:60px;height:60px;font-size:22px;}
.av-xl{width:80px;height:80px;font-size:30px;}

/* ── BACK BUTTON ── */
.back{
  width:36px;height:36px;background:var(--surface);border:1px solid var(--border);
  border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;
  flex-shrink:0;transition:all .15s;padding:0;
}
.back:hover{background:var(--surface2);border-color:var(--border2);}
.back:active{transform:scale(.9);}

/* ── DIVIDER ── */
.hr{height:1px;background:var(--border);margin:14px 0;}

/* ── SLIDER ── */
.sldr{
  width:100%;height:4px;-webkit-appearance:none;outline:none;cursor:pointer;
  border-radius:2px;
  background:linear-gradient(to right,var(--accent) var(--p,50%),rgba(245,247,250,0.08) var(--p,50%));
}
.sldr::-webkit-slider-thumb{
  -webkit-appearance:none;width:22px;height:22px;background:#C4A050;border-radius:50%;
  box-shadow:0 2px 8px rgba(0,0,0,0.50),0 0 0 1px rgba(0,0,0,0.3);
}

/* ── BOTTOM NAV ── */
.bnav{
  position:absolute;bottom:0;left:0;right:0;height:88px;
  background:rgba(10,12,17,0.96);
  backdrop-filter:blur(20px) saturate(180%);
  -webkit-backdrop-filter:blur(20px) saturate(180%);
  border-top:1px solid var(--border);
  display:flex;align-items:flex-start;padding-top:10px;justify-content:space-around;
}
.ni{
  display:flex;flex-direction:column;align-items:center;gap:4px;
  cursor:pointer;padding:6px 14px;border-radius:var(--r-sm);transition:all .15s;min-width:58px;
}
.ni-icon{display:flex;align-items:center;justify-content:center;height:24px;}
.ni-lbl{font-size:10px;font-weight:500;letter-spacing:0.2px;}

/* ── STEP DOTS ── */
.sdots{display:flex;gap:5px;align-items:center;}
.sdot{width:6px;height:6px;border-radius:3px;background:var(--surface2);transition:all .3s;}
.sdot.on{background:var(--accent);width:20px;}

/* ── CATEGORY GRID ── */
.cgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 20px;}
.ccard{
  background:var(--surface);border:1px solid var(--border);
  border-radius:var(--r-lg);padding:18px 16px;cursor:pointer;
  transition:all .18s cubic-bezier(.4,0,.2,1);position:relative;overflow:hidden;
}
.ccard:hover{border-color:var(--border2);background:var(--surface2);}
.ccard:active{transform:scale(.96);}
.ci{
  width:40px;height:40px;border-radius:var(--r-sm);
  display:flex;align-items:center;justify-content:center;margin-bottom:12px;
}

/* ── USER CARD ── */
.ucard{
  background:var(--surface);border:1px solid var(--border);
  border-radius:var(--r-md);padding:14px 16px;
  display:flex;align-items:center;gap:12px;margin-bottom:8px;cursor:pointer;
  transition:all .15s;
}
.ucard:hover{border-color:var(--border2);}
.ucard:active{transform:scale(.98);}
.ucard.busy{opacity:.25;pointer-events:none;}

/* ── COMM GRID ── */
.cgrd{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;}
.cbtn{
  background:var(--surface);border:1px solid var(--border);border-radius:var(--r-md);
  padding:14px 8px;display:flex;flex-direction:column;align-items:center;gap:6px;
  cursor:pointer;transition:all .15s;
}
.cbtn:hover{border-color:var(--border2);background:var(--surface2);}
.cbtn:active{transform:scale(.95);}

/* ── TOGGLE ── */
.tog{
  width:48px;height:28px;border-radius:14px;position:relative;cursor:pointer;
  transition:background .25s;flex-shrink:0;border:none;
}
.tog.on {background:var(--accent);}
.tog.off{background:rgba(245,247,250,0.12);}
.tok{
  position:absolute;top:3px;width:22px;height:22px;background:#F5F7FA;border-radius:50%;
  transition:left .25s cubic-bezier(.34,1.56,.64,1);
  box-shadow:0 1px 4px rgba(0,0,0,0.4);
}
.tog.on  .tok{left:23px;}
.tog.off .tok{left:3px;}

/* ── CHAT BUBBLES ── */
.bbl{max-width:72%;padding:10px 14px;border-radius:18px;font-size:14px;line-height:1.45;margin-bottom:6px;}
.bme{background:var(--accent);color:#fff;border-bottom-right-radius:4px;align-self:flex-end;}
.bth{background:var(--surface);color:var(--text);border-bottom-left-radius:4px;align-self:flex-start;border:1px solid var(--border);}

/* ── TOAST ── */
.toast{
  position:absolute;top:58px;left:16px;right:16px;
  background:var(--surface2);border:1px solid var(--border2);border-radius:var(--r-md);
  padding:12px 16px;display:flex;align-items:center;gap:10px;
  font-size:13px;font-weight:500;color:var(--text);z-index:100;
  animation:tsd .25s cubic-bezier(.34,1.56,.64,1);
  box-shadow:var(--sh-md);
}
@keyframes tsd{from{opacity:0;transform:translateY(-8px)scale(.95)}to{opacity:1;transform:none}}

/* ── MAP MOCK ── */
.map-mock{
  height:180px;background:var(--surface);border:1px solid var(--border);
  border-radius:var(--r-lg);position:relative;overflow:hidden;margin-bottom:14px;
}
.mgrid{
  position:absolute;inset:0;
  background-image:
    linear-gradient(rgba(245,247,250,0.04) 1px,transparent 1px),
    linear-gradient(90deg,rgba(245,247,250,0.04) 1px,transparent 1px);
  background-size:30px 30px;
}
.mdot{
  position:absolute;width:14px;height:14px;border-radius:50%;background:var(--accent);
  box-shadow:0 0 0 5px rgba(196,160,80,0.18),0 0 0 10px rgba(196,160,80,0.07);
  animation:mpulse 2s infinite;
}
@keyframes mpulse{
  0%,100%{box-shadow:0 0 0 5px rgba(196,160,80,0.18),0 0 0 10px rgba(196,160,80,0.07)}
  50%{box-shadow:0 0 0 9px rgba(196,160,80,0.10),0 0 0 18px rgba(196,160,80,0.03)}
}

/* ── MODAL ── */
.modal-bg{
  position:absolute;inset:0;
  background:rgba(7,9,13,0.95);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
  z-index:200;display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:28px;animation:fin .22s ease;
}
@keyframes fin{from{opacity:0}to{opacity:1}}

/* ── NOTIF CARD ── */
.ncard{
  background:var(--surface);border:1px solid var(--border);
  border-radius:var(--r-md);padding:14px 16px;margin-bottom:8px;
  position:relative;overflow:hidden;cursor:pointer;transition:all .15s;
}
.ncard:hover{border-color:var(--border2);}
.ncard:active{transform:scale(.98);}
.ncard-bar{position:absolute;left:0;top:0;bottom:0;width:3px;}

/* ── TYPE CARD (role select) ── */
.tcard{
  background:var(--surface);border:1.5px solid var(--border);
  border-radius:var(--r-md);padding:18px 12px;cursor:pointer;
  transition:all .18s;text-align:center;flex:1;
}
.tcard.sel{border-color:var(--accent);background:var(--acc-dim);}
.tcard:active{transform:scale(.96);}

/* ── SKILL CARD ── */
.skcard{
  background:var(--surface);border:1.5px solid var(--border);
  border-radius:var(--r-md);padding:14px 16px;cursor:pointer;
  transition:all .15s;margin-bottom:8px;
}
.skcard.sel{border-color:var(--green);background:var(--green-dim);}
.sk-detail{background:rgba(34,197,94,0.06);border-radius:var(--r-sm);padding:10px 12px;margin-top:10px;}

/* ── STAT ── */
.stat{
  background:var(--surface);border:1px solid var(--border);
  border-radius:var(--r-md);padding:14px;flex:1;text-align:center;
}

/* ── WALLET HERO ── */
.w-hero{
  background:linear-gradient(135deg,#1A0F00 0%,#2D1900 50%,#1A0F00 100%);
  border:1px solid rgba(196,160,80,0.20);border-radius:var(--r-xl);padding:24px;
  position:relative;overflow:hidden;
}
.w-hero::before{
  content:'';position:absolute;top:-40px;right:-40px;
  width:160px;height:160px;border-radius:50%;
  background:radial-gradient(circle,rgba(196,160,80,0.12) 0%,transparent 70%);
}

/* ── WARNING BOX ── */
.plagio{
  background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.18);
  border-radius:var(--r-md);padding:13px 15px;margin-bottom:14px;
}

/* ── STARS ── */
.star{font-size:30px;cursor:pointer;transition:transform .12s;display:inline-block;}
.star:hover{transform:scale(1.20);}

/* ── PROV BANNER ── */
.prov{
  background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.15);
  border-radius:var(--r-md);padding:14px 16px;
}

/* ── OBJ CARD ── */
.obj-card{
  background:var(--surface);border:1px solid var(--border);border-radius:var(--r-md);
  padding:14px;display:flex;gap:12px;align-items:center;margin-bottom:8px;
  cursor:pointer;transition:all .15s;
}
.obj-card:hover{border-color:var(--border2);}
.obj-card:active{transform:scale(.98);}
.obj-img{
  width:46px;height:46px;border-radius:var(--r-sm);background:var(--surface2);
  display:flex;align-items:center;justify-content:center;flex-shrink:0;
  border:1px solid var(--border);
}
`;

// ─── SVG ICON SYSTEM ──────────────────────────────────────────────────────────
// All icons are line-only, rounded strokes, 24×24 viewBox.
// Each carries a subtle "connection core" — a small negative-space circle
// at the focal point of the geometry, echoing the brand mark.

const sw = 1.6; // standard stroke width
const SL = "round"; // strokeLinecap
const SJ = "round"; // strokeLinejoin
const BG = "#07090D"; // bg fill for core cuts

function Ico({ size = 22, color = "currentColor", children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={sw} strokeLinecap={SL} strokeLinejoin={SJ}>
      {children}
    </svg>
  );
}
// connection core helper — small ring at focal point
function Core({ cx, cy, r = 2, color = "currentColor" }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill={BG} stroke={color} strokeWidth={1.3} />
    </>
  );
}

const IcoHome = ({ size = 22, color = "currentColor" }) => (
  <Ico size={size} color={color}>
    <path d="M3 9.5L12 3l9 6.5V21a1 1 0 01-1 1h-5v-5.5H9V22H4a1 1 0 01-1-1V9.5z" />
    <Core cx={12} cy={3} r={1.8} color={color} />
  </Ico>
);

const IcoSearch = ({ size = 22, color = "currentColor" }) => (
  <Ico size={size} color={color}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <line x1="15.5" y1="15.5" x2="21" y2="21" />
    <Core cx={10.5} cy={10.5} r={2} color={color} />
  </Ico>
);

const IcoWallet = ({ size = 22, color = "currentColor" }) => (
  <Ico size={size} color={color}>
    <rect x="2" y="6" width="20" height="14" rx="3" />
    <path d="M2 10h20" />
    <Core cx={17} cy={15} r={1.8} color={color} />
  </Ico>
);

const IcoBell = ({ size = 22, color = "currentColor" }) => (
  <Ico size={size} color={color}>
    <path d="M6 10c0-3.31 2.69-6 6-6s6 2.69 6 6v6l2 2H4l2-2v-6z" />
    <path d="M9.5 18c0 1.38.67 2.5 2.5 2.5s2.5-1.12 2.5-2.5" />
    <Core cx={12} cy={4} r={1.7} color={color} />
  </Ico>
);

const IcoUser = ({ size = 22, color = "currentColor" }) => (
  <Ico size={size} color={color}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-3.31 3.58-6 8-6s8 2.69 8 6" />
    <Core cx={12} cy={8} r={1.7} color={color} />
  </Ico>
);

const IcoBook = ({ size = 22, color = "currentColor" }) => (
  <Ico size={size} color={color}>
    <path d="M4 4h7a1 1 0 011 1v14a1 1 0 00-1-1H4V4z" />
    <path d="M20 4h-7a1 1 0 00-1 1v14a1 1 0 011-1h7V4z" />
    <Core cx={12} cy={11} r={1.7} color={color} />
  </Ico>
);

const IcoPen = ({ size = 22, color = "currentColor" }) => (
  <Ico size={size} color={color}>
    <path d="M12 19l7-7-4-4-7 7v4h4z" />
    <path d="M15 6l3 3" />
    <path d="M6 17l-2 4 4-2" />
    <Core cx={12} cy={12} r={1.6} color={color} />
  </Ico>
);

const IcoCode = ({ size = 22, color = "currentColor" }) => (
  <Ico size={size} color={color}>
    <polyline points="8 6 2 12 8 18" />
    <polyline points="16 6 22 12 16 18" />
    <Core cx={12} cy={12} r={1.7} color={color} />
  </Ico>
);

const IcoRoute = ({ size = 22, color = "currentColor" }) => (
  <Ico size={size} color={color}>
    <circle cx="5" cy="6" r="3" />
    <circle cx="19" cy="18" r="3" />
    <path d="M5 9v3a6 6 0 006 6h3" />
    <Core cx={12} cy={15} r={1.7} color={color} />
  </Ico>
);

const IcoBolt = ({ size = 22, color = "currentColor" }) => (
  <Ico size={size} color={color}>
    <path d="M13 2L4.5 13.5H12L11 22l8.5-11.5H13L13 2z" />
    <Core cx={12} cy={12} r={1.6} color={color} />
  </Ico>
);

const IcoBox = ({ size = 22, color = "currentColor" }) => (
  <Ico size={size} color={color}>
    <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
    <path d="M12 3v18M3 8l9 5 9-5" />
    <Core cx={12} cy={12} r={1.7} color={color} />
  </Ico>
);

const IcoBack = ({ size = 20, color = "currentColor" }) => (
  <Ico size={size} color={color}>
    <polyline points="15 18 9 12 15 6" />
  </Ico>
);

const IcoPin = ({ size = 20, color = "currentColor" }) => (
  <Ico size={size} color={color}>
    <path d="M12 2a6 6 0 016 6c0 4-6 14-6 14S6 12 6 8a6 6 0 016-6z" />
    <Core cx={12} cy={8} r={2} color={color} />
  </Ico>
);

const IcoChat = ({ size = 20, color = "currentColor" }) => (
  <Ico size={size} color={color}>
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
    <Core cx={12} cy={10} r={1.7} color={color} />
  </Ico>
);

const IcoPhone = ({ size = 20, color = "currentColor" }) => (
  <Ico size={size} color={color}>
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
  </Ico>
);

const IcoCheck = ({ size = 20, color = "currentColor" }) => (
  <Ico size={size} color={color}>
    <polyline points="20 6 9 17 4 12" />
  </Ico>
);

const IcoStar = ({ size = 22, color = "currentColor" }) => (
  <Ico size={size} color={color}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </Ico>
);

const IcoSend = ({ size = 20, color = "currentColor" }) => (
  <Ico size={size} color={color}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </Ico>
);

// ─── LOGO MARK ────────────────────────────────────────────────────────────────
// Two nodes connected through a central connection core ring.
// Represents person ↔ exchange ↔ person — the essence of Favo.
function LogoMark({ size = 48, color = "#C4A050" }) {
  return (
    <svg width={size} height={Math.round(size * 0.48)} viewBox="0 0 52 25" fill="none">
      {/* Node A */}
      <circle cx="5.5" cy="12.5" r="4.5" stroke={color} strokeWidth="1.7" />
      {/* Node B */}
      <circle cx="46.5" cy="12.5" r="4.5" stroke={color} strokeWidth="1.7" />
      {/* Connector lines */}
      <line x1="10" y1="12.5" x2="18" y2="12.5" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
      <line x1="34" y1="12.5" x2="42" y2="12.5" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
      {/* Connection core — slightly larger ring with inner void */}
      <circle cx="26" cy="12.5" r="8" stroke={color} strokeWidth="1.7" />
      <circle cx="26" cy="12.5" r="3" fill={BG} stroke={color} strokeWidth="1.3" />
    </svg>
  );
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const CATS = [
  { id:"academico",   icon:<IcoBook  size={20}/>, name:"Académico",          range:[10000,50000],  color:"#3B82F6", bg:"rgba(59,130,246,0.08)",  ap:true  },
  { id:"diseno",      icon:<IcoPen   size={20}/>, name:"Diseño",              range:[15000,80000],  color:"#A855F7", bg:"rgba(168,85,247,0.08)",  ap:true  },
  { id:"tech",        icon:<IcoCode  size={20}/>, name:"Tech",                range:[15000,100000], color:"#22C55E", bg:"rgba(34,197,94,0.08)",   ap:false },
  { id:"mandados",    icon:<IcoRoute size={20}/>, name:"Mandados",            range:[3000,25000],   color:"#F59E0B", bg:"rgba(245,158,11,0.08)",  ap:false },
  { id:"habilidades", icon:<IcoBolt  size={20}/>, name:"Habilidades",         range:[10000,50000],  color:"#EC4899", bg:"rgba(236,72,153,0.08)",  ap:false },
  { id:"prestamo",    icon:<IcoBox   size={20}/>, name:"Préstamos",           range:[5000,40000],   color:"#14B8A6", bg:"rgba(20,184,166,0.08)",  ap:false },
];

const SKILL_CATS = [
  { id:"idiomas",   name:"Idiomas",     ex:["Inglés","Francés","Mandarín"] },
  { id:"musica",    name:"Música",      ex:["Guitarra","Piano","Canto"]    },
  { id:"deporte",   name:"Deporte",     ex:["Fútbol","Yoga","CrossFit"]    },
  { id:"arte",      name:"Arte y Foto", ex:["Ilustración","Fotografía"]    },
  { id:"cocina",    name:"Cocina",      ex:["Repostería","Cocina fusión"]  },
  { id:"bienestar", name:"Bienestar",   ex:["Meditación","Coaching"]       },
];

const CARRERAS = [
  "Administración de Empresas","Antropología","Arquitectura","Arte","Biología",
  "Ciencia Política","Comunicación Social","Contaduría Pública","Derecho",
  "Diseño Gráfico","Diseño Industrial","Economía","Educación","Filosofía","Física",
  "Geociencias","Historia","Ingeniería Ambiental","Ingeniería Biomédica",
  "Ingeniería Civil","Ingeniería de Sistemas y Computación",
  "Ingeniería Eléctrica y Electrónica","Ingeniería Industrial",
  "Ingeniería Mecánica","Ingeniería Química","Lenguas y Cultura","Literatura",
  "Matemáticas","Medicina","Microbiología","Música","Psicología","Química",
  "Sociología","Posgrado",
];
const SEMESTRES = ["1°","2°","3°","4°","5°","6°","7°","8°","9°","10°"];

const USERS = [
  { id:1, name:"Valentina R.", career:"Ing. de Sistemas", rating:4.9, distance:"50m",  av:"V", available:true,  favors:34 },
  { id:2, name:"Sebastián M.", career:"Matemáticas",       rating:4.7, distance:"120m", av:"S", available:true,  favors:21 },
  { id:3, name:"Camila T.",    career:"Ing. Civil",         rating:4.8, distance:"200m", av:"C", available:false, favors:15 },
  { id:4, name:"Diego F.",     career:"Economía",           rating:4.6, distance:"300m", av:"D", available:true,  favors:9  },
];
const OBJECTS = [
  { id:1, name:"Calculadora graficadora", price:8000,  deposit:20000, owner:"Sebastián M." },
  { id:2, name:"Bata de laboratorio",     price:5000,  deposit:15000, owner:"Camila T."    },
  { id:3, name:"Micrófono USB",           price:12000, deposit:30000, owner:"Diego F."     },
];
const INCOMING = {
  user:"Laura M.", career:"Diseño Gráfico", cat:"Académico",
  desc:"Necesito que me expliquen regresión lineal para mi parcial de mañana. Tengo dudas en los intervalos de confianza.",
  price:25000, distance:"80m", time:"Hoy 3:00 PM — 4:30 PM",
};

const fmt = n => `$${Number(n).toLocaleString("es-CO")}`;

// ─── STATUS BAR ───────────────────────────────────────────────────────────────
function SB() {
  return (
    <div style={{
      height:52, display:"flex", alignItems:"flex-end", justifyContent:"space-between",
      padding:"0 26px 8px", position:"relative",
    }}>
      <div style={{
        position:"absolute", top:10, left:"50%", transform:"translateX(-50%)",
        width:120, height:32, background:"#000", borderRadius:"18px", zIndex:10,
      }} />
      <span style={{ fontSize:14, fontWeight:600, color:"var(--text)", fontFamily:"var(--font)" }}>9:41</span>
      <span style={{ width:120 }} />
      <span style={{ fontSize:11, fontWeight:600, color:"var(--text2)", fontFamily:"var(--font)" }}>
        ●●● ▮
      </span>
    </div>
  );
}

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────────
function BNav({ active, onChange }) {
  const tabs = [
    { id:"home",    Icon:IcoHome,   lbl:"Inicio"   },
    { id:"explore", Icon:IcoSearch, lbl:"Explorar" },
    { id:"wallet",  Icon:IcoWallet, lbl:"Pagos"    },
    { id:"notifs",  Icon:IcoBell,   lbl:"Alertas"  },
    { id:"profile", Icon:IcoUser,   lbl:"Perfil"   },
  ];
  return (
    <div className="bnav">
      {tabs.map(({ id, Icon, lbl }) => {
        const on = active === id;
        return (
          <div key={id} className="ni" onClick={() => onChange(id)}>
            <div className="ni-icon">
              <Icon size={22} color={on ? "var(--accent)" : "var(--text3)"} />
            </div>
            <span className="ni-lbl" style={{ color: on ? "var(--accent)" : "var(--text3)" }}>
              {lbl}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── SPLASH ───────────────────────────────────────────────────────────────────
function Splash({ onNext }) {
  return (
    <div className="screen col" style={{
      minHeight:800, background:"var(--bg)", position:"relative", overflow:"hidden",
    }}>
      {/* subtle ambient */}
      <div style={{
        position:"absolute", top:-80, left:"50%", transform:"translateX(-50%)",
        width:400, height:300, borderRadius:"50%",
        background:"radial-gradient(ellipse,rgba(196,160,80,0.06) 0%,transparent 70%)",
        pointerEvents:"none",
      }} />

      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"0 32px" }}>
        {/* Logo mark */}
        <div style={{ marginBottom:32 }}>
          <img src="/logo.png" alt="Favo" style={{ width:110, height:"auto", display:"block" }} />
        </div>

        {/* Wordmark + tagline */}
        <div style={{ marginBottom:52 }}>
          <div style={{
            fontSize:64, fontWeight:700, letterSpacing:"-2px", color:"var(--text)",
            lineHeight:.92, marginBottom:12,
          }}>
            Favo
          </div>
          <div style={{ fontSize:15, fontWeight:400, color:"var(--text2)", letterSpacing:0.2 }}>
            Siempre hay alguien.
          </div>
        </div>

        {/* Feature list */}
        <div style={{ marginBottom:52 }}>
          {[
            { Icon:IcoBook,  label:"Tutorías y apoyo académico"  },
            { Icon:IcoCode,  label:"Tech, diseño y desarrollo"   },
            { Icon:IcoRoute, label:"Mandados y trámites"         },
          ].map(({ Icon, label }) => (
            <div key={label} style={{
              display:"flex", alignItems:"center", gap:14, marginBottom:18,
            }}>
              <div style={{
                width:38, height:38, borderRadius:"var(--r-sm)",
                background:"var(--surface)", border:"1px solid var(--border)",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <Icon size={18} color="var(--text2)" />
              </div>
              <span style={{ fontSize:14, fontWeight:400, color:"var(--text2)" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:"0 32px 52px" }}>
        <button className="btn btn-p" onClick={onNext}
          style={{ fontSize:15, fontWeight:600, letterSpacing:0.2 }}>
          Comenzar
        </button>
        <div style={{ fontSize:12, color:"var(--text3)", marginTop:10, textAlign:"center", letterSpacing:0.2 }}>
          Exclusivo para correos @uniandes.edu.co
        </div>
      </div>
    </div>
  );
}

// ─── REG EMAIL ────────────────────────────────────────────────────────────────
function RegEmail({ onNext }) {
  const [email, setEmail] = useState("");
  const valid = email.endsWith("@uniandes.edu.co") && email.length > 16;
  return (
    <div className="screen px" style={{ paddingTop:28 }}>
      <div className="sdots mb3"><div className="sdot on"/><div className="sdot"/><div className="sdot"/><div className="sdot"/><div className="sdot"/></div>
      <div className="t-display mb1">Correo<br /><span className="accent">universitario</span></div>
      <div className="t-sub mb4" style={{ marginTop:8 }}>Solo cuentas @uniandes.edu.co</div>
      <div className="iw">
        <label className="lbl">Correo institucional</label>
        <input className="inp" placeholder="nombre@uniandes.edu.co" value={email}
          onChange={e => setEmail(e.target.value)} type="email" autoCapitalize="none" />
      </div>
      {email.length > 5 && !valid && (
        <div style={{ background:"rgba(255,77,77,0.07)", border:"1px solid rgba(255,77,77,0.18)", borderRadius:"var(--r-sm)", padding:"11px 14px", marginBottom:14 }}>
          <div style={{ fontSize:13, color:"var(--err)", fontWeight:500 }}>Solo correos @uniandes.edu.co</div>
        </div>
      )}
      {valid && (
        <div style={{ background:"var(--green-dim)", border:"1px solid rgba(34,197,94,0.18)", borderRadius:"var(--r-sm)", padding:"11px 14px", marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
          <IcoCheck size={15} color="var(--green)" />
          <div style={{ fontSize:13, color:"var(--green)", fontWeight:500 }}>Correo válido</div>
        </div>
      )}
      <button className="btn btn-p mt2" disabled={!valid} onClick={() => onNext(email)}>Continuar</button>
    </div>
  );
}

// ─── REG CODE ─────────────────────────────────────────────────────────────────
function RegCode({ email, onNext }) {
  const [code, setCode] = useState("");
  const valid = code.length >= 7 && /^\d+$/.test(code);
  return (
    <div className="screen px" style={{ paddingTop:28 }}>
      <div className="sdots mb3"><div className="sdot on"/><div className="sdot on"/><div className="sdot"/><div className="sdot"/><div className="sdot"/></div>
      <div className="t-display mb1">Código<br /><span className="accent">estudiantil</span></div>
      <div className="t-sub mb4" style={{ marginTop:8 }}>Tu código único Uniandes</div>
      <div className="iw">
        <label className="lbl">Código estudiantil</label>
        <input className="inp" placeholder="202312345" value={code}
          onChange={e => setCode(e.target.value.replace(/\D/g, ""))} type="tel" maxLength={10} />
      </div>
      <div className="card mb3">
        <div style={{ fontSize:11, color:"var(--text3)", marginBottom:4, letterSpacing:0.3 }}>REGISTRANDO CON</div>
        <div style={{ fontSize:14, fontWeight:500, color:"var(--text)" }}>{email}</div>
      </div>
      <div style={{ fontSize:13, color:"var(--text2)", marginBottom:24, lineHeight:1.6 }}>
        Un correo y código solo pueden usarse en <span style={{ color:"var(--text)", fontWeight:600 }}>una cuenta</span>.
      </div>
      <button className="btn btn-p" disabled={!valid} onClick={() => onNext(code)}>Continuar</button>
    </div>
  );
}

// ─── REG VERIFY ───────────────────────────────────────────────────────────────
function RegVerify({ email, onNext }) {
  const [digits, setDigits] = useState(["","","","",""]);
  const refs = useRef([]);
  const filled = digits.every(d => d !== "");
  const hc = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const n = [...digits]; n[i] = v; setDigits(n);
    if (v && i < 4) refs.current[i + 1]?.focus();
  };
  const hk = (i, e) => { if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus(); };
  return (
    <div className="screen px" style={{ paddingTop:28 }}>
      <div className="sdots mb3"><div className="sdot on"/><div className="sdot on"/><div className="sdot on"/><div className="sdot"/><div className="sdot"/></div>
      <div className="t-display mb1">Verificación<br /><span className="accent">de correo</span></div>
      <div style={{ fontSize:14, color:"var(--text2)", marginTop:8, marginBottom:32 }}>
        Código enviado a <span style={{ color:"var(--text)", fontWeight:600 }}>{email}</span>
      </div>
      <div style={{ display:"flex", gap:9, justifyContent:"center", marginBottom:24 }}>
        {digits.map((d, i) => (
          <input key={i} ref={el => refs.current[i] = el} value={d}
            onChange={e => hc(i, e.target.value)} onKeyDown={e => hk(i, e)}
            maxLength={1} type="tel"
            style={{
              width:52, height:62, background:d ? "var(--acc-dim)" : "var(--surface)",
              border:`1.5px solid ${d ? "var(--accent)" : "var(--border2)"}`,
              borderRadius:"var(--r-md)", color:d ? "var(--accent)" : "var(--text)",
              fontSize:24, fontWeight:700, textAlign:"center", outline:"none",
              caretColor:"var(--accent)", fontFamily:"var(--font)", transition:"all .18s",
            }} />
        ))}
      </div>
      <div style={{ fontSize:12, color:"var(--text3)", marginBottom:24, textAlign:"center" }}>
        Demo: escribe cualquier 5 dígitos
      </div>
      <button className="btn btn-p mb2" disabled={!filled} onClick={onNext}>Continuar</button>
      <div style={{ fontSize:13, color:"var(--text2)", textAlign:"center" }}>
        ¿No recibiste?{" "}
        <span style={{ color:"var(--accent)", fontWeight:600, cursor:"pointer" }}>Reenviar</span>
      </div>
    </div>
  );
}

// ─── REG USER TYPE ────────────────────────────────────────────────────────────
function RegUserType({ onNext }) {
  const [tipo, setTipo]       = useState(null);
  const [nombre, setNombre]   = useState("");
  const [telefono, setTel]    = useState("");
  const [carrera, setCarrera] = useState("");
  const [semestre, setSem]    = useState("");
  const [posgrado, setPg]     = useState("");
  const esPg = carrera === "Posgrado";
  const valid = tipo && nombre.trim().length > 3 && telefono.length >= 10 && carrera &&
    (esPg ? posgrado.trim().length > 3 : semestre);

  const roles = [
    { id:"cliente",   label:"Cliente",   desc:"Solo pido favores"     },
    { id:"prestador", label:"Prestador", desc:"Solo ofrezco servicios" },
    { id:"ambos",     label:"Los dos",   desc:"Pido y ofrezco"        },
  ];

  return (
    <div className="screen px" style={{ paddingTop:28, paddingBottom:36 }}>
      <div className="sdots mb3">
        <div className="sdot on"/><div className="sdot on"/><div className="sdot on"/><div className="sdot on"/><div className="sdot"/>
      </div>
      <div className="t-display mb1">Tu rol en<br /><span className="accent">Favo</span></div>
      <div className="t-sub mb3" style={{ marginTop:8 }}>Puedes cambiarlo desde tu perfil</div>

      <div className="row g2 mb4">
        {roles.map(r => (
          <div key={r.id} className={`tcard ${tipo === r.id ? "sel" : ""}`} onClick={() => setTipo(r.id)}>
            <div style={{ fontSize:13, fontWeight:700, color: tipo === r.id ? "var(--accent)" : "var(--text)", marginBottom:4 }}>{r.label}</div>
            <div style={{ fontSize:11, color:"var(--text2)" }}>{r.desc}</div>
            {tipo === r.id && (
              <div style={{
                marginTop:8, width:18, height:18, borderRadius:"50%",
                background:"var(--accent)", display:"flex", alignItems:"center",
                justifyContent:"center", marginLeft:"auto", marginRight:"auto",
              }}>
                <IcoCheck size={11} color="#fff" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="hr mb3" />
      <div className="t-label mb3">Tu información</div>

      <div className="iw">
        <label className="lbl">Nombre completo</label>
        <input className="inp" placeholder="Alejandro García" value={nombre} onChange={e => setNombre(e.target.value)} />
      </div>
      <div className="iw">
        <label className="lbl">Teléfono</label>
        <input className="inp" placeholder="3101234567" value={telefono} type="tel"
          onChange={e => setTel(e.target.value.replace(/\D/g, ""))} maxLength={10} />
      </div>
      <div className="iw">
        <label className="lbl">Programa académico</label>
        <select className="inp" value={carrera}
          onChange={e => { setCarrera(e.target.value); setPg(""); setSem(""); }}
          style={{ cursor:"pointer", colorScheme:"dark" }}>
          <option value="">Selecciona tu programa</option>
          <optgroup label="── Pregrados ──">
            {CARRERAS.filter(c => c !== "Posgrado").map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </optgroup>
          <optgroup label="── Posgrado ──">
            <option value="Posgrado">Posgrado</option>
          </optgroup>
        </select>
      </div>

      {esPg && (
        <div className="iw" style={{
          background:"var(--acc-dim)", borderRadius:"var(--r-md)",
          padding:"14px 16px", border:"1px solid rgba(196,160,80,0.18)",
        }}>
          <label className="lbl" style={{ color:"var(--accent)" }}>Nombre del posgrado</label>
          <input className="inp" placeholder="Ej: Maestría en Ing. de Sistemas…"
            value={posgrado} onChange={e => setPg(e.target.value)}
            style={{ marginTop:2, background:"var(--surface)" }} />
        </div>
      )}

      {!esPg && carrera && (
        <div className="iw mb3">
          <label className="lbl">Semestre</label>
          <select className="inp" value={semestre} onChange={e => setSem(e.target.value)}
            style={{ cursor:"pointer", colorScheme:"dark" }}>
            <option value="">Selecciona tu semestre</option>
            {SEMESTRES.map(s => <option key={s} value={s}>{s} semestre</option>)}
          </select>
        </div>
      )}

      <button className="btn btn-p" style={{ marginTop:8 }} disabled={!valid}
        onClick={() => onNext({ tipo, nombre, telefono, carrera, semestre, posgrado })}>
        {(tipo === "prestador" || tipo === "ambos") ? "Configurar habilidades" : "Entrar a Favo"}
      </button>
    </div>
  );
}

// ─── REG HABILIDADES ──────────────────────────────────────────────────────────
function RegHabilidades({ userInfo, onNext }) {
  const [usa, setUsa]   = useState(null);
  const [sels, setSels] = useState({});
  const [otras, setOtras] = useState("");
  const toggle = id => setSels(p => { const n={...p}; if(n[id]!==undefined)delete n[id]; else n[id]=""; return n; });
  const setD   = (id, v) => setSels(p => ({ ...p, [id]:v }));
  const ok = usa === false || (usa === true && Object.keys(sels).length > 0);

  return (
    <div className="screen px" style={{ paddingTop:28, paddingBottom:36 }}>
      <div className="sdots mb3">
        <div className="sdot on"/><div className="sdot on"/><div className="sdot on"/><div className="sdot on"/><div className="sdot on"/>
      </div>
      <div className="t-display mb1">¿Ofreces<br /><span className="accent">habilidades</span>?</div>
      <div className="t-sub mb4" style={{ marginTop:8 }}>Música, idiomas, arte y más</div>

      <div className="row g2 mb4">
        {[{v:true,label:"Sí, tengo"},{v:false,label:"No por ahora"}].map(o => (
          <div key={String(o.v)} className={`tcard ${usa === o.v ? "sel" : ""}`} onClick={() => setUsa(o.v)}>
            <div style={{ fontSize:13, fontWeight:600, color: usa === o.v ? "var(--accent)" : "var(--text)" }}>
              {o.label}
            </div>
          </div>
        ))}
      </div>

      {usa === true && (
        <>
          <div className="t-label mb3">Selecciona categorías</div>
          {SKILL_CATS.map(sc => (
            <div key={sc.id} className={`skcard ${sels[sc.id] !== undefined ? "sel" : ""}`} onClick={() => toggle(sc.id)}>
              <div className="row between">
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:"var(--text)" }}>{sc.name}</div>
                  <div style={{ fontSize:12, color:"var(--text2)", marginTop:2 }}>{sc.ex.join(", ")}</div>
                </div>
                <div style={{
                  width:22, height:22, borderRadius:"50%",
                  background: sels[sc.id] !== undefined ? "var(--green)" : "var(--surface2)",
                  border:`1px solid ${sels[sc.id] !== undefined ? "var(--green)" : "var(--border2)"}`,
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
                  transition:"all .18s",
                }}>
                  {sels[sc.id] !== undefined && <IcoCheck size={12} color="#fff" />}
                </div>
              </div>
              {sels[sc.id] !== undefined && (
                <div className="sk-detail" onClick={e => e.stopPropagation()}>
                  <div style={{ fontSize:11, color:"var(--green)", fontWeight:600, marginBottom:6, letterSpacing:0.3, textTransform:"uppercase" }}>
                    Habilidad específica
                  </div>
                  <input className="inp" style={{ background:"var(--surface)", padding:"10px 13px", fontSize:13 }}
                    placeholder={`Ej: ${sc.ex[0]}, ${sc.ex[1]}…`}
                    value={sels[sc.id]} onChange={e => setD(sc.id, e.target.value)} />
                </div>
              )}
            </div>
          ))}
          <div className="iw mt1">
            <label className="lbl">Otras habilidades</label>
            <input className="inp" placeholder="Ej: Reparación de bicicletas…"
              value={otras} onChange={e => setOtras(e.target.value)} />
          </div>
        </>
      )}

      <button className="btn btn-p mt3" disabled={!ok}
        onClick={() => onNext({ ...userInfo, habilidades:sels, otrasHabilidades:otras })}>
        Entrar a Favo
      </button>
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function Home({ onCat, onProfile, prov, onTogProv, onIncoming, ui }) {
  const esPrest = ui?.tipo === "prestador" || ui?.tipo === "ambos";
  const nombre  = ui?.nombre?.split(" ")[0] || "Alejandro";
  const prog    = ui?.posgrado ? ui.posgrado : (ui?.carrera || "Uniandes");

  return (
    <div className="screen">
      {/* Header */}
      <div style={{
        padding:"14px 20px 16px", borderBottom:"1px solid var(--border)",
        background:"var(--bg)",
      }}>
        <div className="row between">
        <img src="/logo.png" alt="Favo" style={{ width:24, height:"auto", opacity:0.85 }} />
          <div>
            <div style={{ fontSize:12, color:"var(--text3)", fontWeight:500, marginBottom:3, letterSpacing:0.3 }}>
              BUENOS DÍAS
            </div>
            <div style={{ fontSize:22, fontWeight:700, letterSpacing:"-0.5px", color:"var(--text)" }}>
              {nombre}<span style={{ color:"var(--accent)" }}>.</span>
            </div>
            <div style={{ fontSize:12, color:"var(--text2)", marginTop:2 }}>{prog}</div>
          </div>
          <div className="av av-m" onClick={onProfile} style={{ cursor:"pointer" }}>
            {nombre[0].toUpperCase()}
          </div>
        </div>
      </div>

      {/* Provider toggle */}
      {esPrest && (
        <div className="px" style={{ paddingTop:14, paddingBottom:4 }}>
          <div className="prov row between">
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:"var(--green)", marginBottom:3 }}>Modo prestador</div>
              <div style={{ fontSize:12, color:"var(--text2)" }}>
                {prov ? "Visible para solicitudes" : "Activa para recibir favores"}
              </div>
            </div>
            <button className={`tog ${prov ? "on" : "off"}`} onClick={onTogProv}><div className="tok" /></button>
          </div>
          {prov && (
            <button className="btn btn-g mt2" style={{ padding:"11px", fontSize:13 }} onClick={onIncoming}>
              Simular solicitud entrante
            </button>
          )}
        </div>
      )}

      {/* Hero */}
      <div className="px" style={{ paddingTop:16, paddingBottom:4 }}>
        <div style={{
          background:"var(--acc-dim)", border:"1px solid rgba(196,160,80,0.15)",
          borderRadius:"var(--r-lg)", padding:"18px 20px",
          display:"flex", alignItems:"center", justifyContent:"space-between",
        }}>
          <div>
            <div style={{ fontSize:11, fontWeight:500, color:"var(--accent)", letterSpacing:0.8, textTransform:"uppercase", marginBottom:4 }}>
              Solicitudes activas
            </div>
            <div style={{ fontSize:24, fontWeight:700, letterSpacing:"-0.5px", color:"var(--text)" }}>
              3 cerca de ti
            </div>
          </div>
          <div style={{
            width:44, height:44, borderRadius:"var(--r-md)",
            background:"rgba(196,160,80,0.12)", border:"1px solid rgba(196,160,80,0.20)",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <IcoPin size={20} color="var(--accent)" />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px row between" style={{ paddingTop:20, paddingBottom:10 }}>
        <div style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>Categorías</div>
        <div className="tag tag-s">6 activas</div>
      </div>

      <div className="cgrid mb3">
        {CATS.map(c => (
          <div key={c.id} className="ccard" onClick={() => onCat(c)}>
            <div className="ci" style={{ background:c.bg }}>
              <span style={{ color:c.color }}>
                {c.icon}
              </span>
            </div>
            <div style={{ fontSize:13, fontWeight:600, color:"var(--text)", marginBottom:3 }}>{c.name}</div>
            <div style={{ fontSize:11, color:"var(--text2)" }}>{fmt(c.range[0])} — {fmt(c.range[1])}</div>
            {c.ap && <div className="tag tag-am" style={{ marginTop:8, fontSize:10 }}>Anti-plagio</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── INCOMING ─────────────────────────────────────────────────────────────────
function Incoming({ onAccept, onDecline, cat }) {
  const [step, setStep] = useState("view");
  const range   = cat?.range || [10000, 50000];
  const [counter, setCounter] = useState(INCOMING.price);
  const pct = ((counter - range[0]) / (range[1] - range[0]) * 100).toFixed(1) + "%";

  if (step === "counter") return (
    <div className="modal-bg">
      <div className="card" style={{ width:"100%", marginBottom:20, textAlign:"center", padding:24 }}>
        <div style={{ fontSize:11, fontWeight:500, color:"var(--text3)", letterSpacing:0.8, textTransform:"uppercase", marginBottom:8 }}>Tu contraoferta</div>
        <div style={{ fontSize:48, fontWeight:700, color:"var(--green)", lineHeight:1, marginBottom:4, letterSpacing:"-2px" }}>{fmt(counter)}</div>
        <div style={{ fontSize:12, color:"var(--text2)" }}>Cliente ofreció {fmt(INCOMING.price)}</div>
      </div>
      <div style={{ width:"100%", marginBottom:8 }}>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"var(--text3)", marginBottom:12, fontWeight:500 }}>
          <span>{fmt(range[0])}</span><span>{fmt(range[1])}</span>
        </div>
        <input type="range" min={range[0]} max={range[1]} step={1000} value={counter}
          className="sldr" style={{ "--p":pct }} onChange={e => setCounter(Number(e.target.value))} />
      </div>
      <div style={{ fontSize:12, color:"var(--text3)", marginBottom:24, textAlign:"center" }}>Arrastra para ajustar</div>
      <div style={{ display:"flex", gap:10, width:"100%" }}>
        <button className="btn btn-o flex1" style={{ padding:14, fontSize:13 }} onClick={() => setStep("view")}>Volver</button>
        <button className="btn btn-g flex1" style={{ padding:14, fontSize:13 }} onClick={() => onAccept(counter)}>Enviar</button>
      </div>
    </div>
  );

  return (
    <div className="modal-bg">
      <div style={{ fontSize:11, fontWeight:500, color:"var(--text3)", letterSpacing:0.8, textTransform:"uppercase", marginBottom:8 }}>
        {INCOMING.distance} de ti
      </div>
      <div style={{ fontSize:24, fontWeight:700, letterSpacing:"-0.5px", textAlign:"center", marginBottom:20, lineHeight:1.2 }}>
        Nueva solicitud<br /><span style={{ color:"var(--accent)" }}>cercana</span>
      </div>
      <div className="card" style={{ width:"100%", marginBottom:16, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:"var(--accent)" }} />
        <div style={{ paddingLeft:12 }}>
          <div className="row g2 mb2">
            <div className="av av-m">L</div>
            <div>
              <div style={{ fontSize:14, fontWeight:600, color:"var(--text)" }}>{INCOMING.user}</div>
              <div style={{ fontSize:12, color:"var(--text2)", marginTop:2 }}>{INCOMING.career}</div>
            </div>
          </div>
          <div className="tag tag-b" style={{ marginBottom:10 }}>{INCOMING.cat}</div>
          <div style={{ fontSize:13, color:"var(--text2)", lineHeight:1.6, marginBottom:12 }}>{INCOMING.desc}</div>
          <div className="hr" style={{ margin:"10px 0" }} />
          <div className="row between mb1">
            <div style={{ fontSize:12, color:"var(--text3)" }}>Oferta</div>
            <div style={{ fontSize:18, fontWeight:700, color:"var(--accent)", letterSpacing:"-0.5px" }}>{fmt(INCOMING.price)}</div>
          </div>
          <div className="row between">
            <div style={{ fontSize:12, color:"var(--text3)" }}>Horario</div>
            <div style={{ fontSize:12, fontWeight:500, color:"var(--text)" }}>{INCOMING.time}</div>
          </div>
        </div>
      </div>
      <div style={{ display:"flex", gap:10, width:"100%", marginBottom:10 }}>
        <button className="btn btn-o flex1" style={{ padding:14, fontSize:13 }} onClick={onDecline}>Rechazar</button>
        <button className="btn btn-p flex1" style={{ padding:14, fontSize:13 }} onClick={() => onAccept(INCOMING.price)}>Aceptar</button>
      </div>
      <button className="btn btn-g" style={{ padding:14, fontSize:13 }} onClick={() => setStep("counter")}>
        Hacer contraoferta
      </button>
    </div>
  );
}

// ─── FAVOR DESC ───────────────────────────────────────────────────────────────
function FavorDesc({ cat, onNext, onBack }) {
  const [desc, setDesc] = useState("");
  const [cf, setCf]     = useState("");
  const ml = 280; const ok = desc.trim().length > 10;
  return (
    <div className="screen">
      <div style={{ padding:"12px 20px 14px", borderBottom:"1px solid var(--border)" }}>
        <div className="row g2">
          <button className="back" onClick={onBack}><IcoBack size={18} color="var(--text2)" /></button>
          <div>
            <div style={{ fontSize:16, fontWeight:600, color:"var(--text)" }}>{cat.name}</div>
            <div style={{ fontSize:12, color:"var(--text2)" }}>Describe qué necesitas</div>
          </div>
        </div>
      </div>
      <div className="px" style={{ paddingTop:16 }}>
        {cat.ap && (
          <div className="plagio">
            <div style={{ fontSize:13, fontWeight:600, color:"var(--amber)", marginBottom:5 }}>Aviso anti-plagio</div>
            <div style={{ fontSize:12, color:"var(--text2)", lineHeight:1.6 }}>
              El prestador puede guiarte y dar feedback, pero el trabajo final debe ser tuyo. Ambos confirman este compromiso.
            </div>
          </div>
        )}
        <div className="iw">
          <label className="lbl">Descripción del favor</label>
          <textarea className="inp" value={desc}
            placeholder={
              cat.id==="academico" ? "Ej: Necesito ayuda con regresión lineal para mi parcial de mañana…" :
              cat.id==="diseno"    ? "Ej: Necesito diagramar mi presentación de grado, 15 slides…" :
              cat.id==="tech"      ? "Ej: Tengo un bug en Python que no puedo resolver…" :
              cat.id==="mandados"  ? "Ej: Necesito que recojan un paquete en la portería del ML…" :
              cat.id==="habilidades" ? "Ej: Busco clase de guitarra de 1 hora, soy principiante…" :
              "Ej: Necesito una calculadora TI-84 para mañana…"
            }
            onChange={e => { if (e.target.value.length <= ml) setDesc(e.target.value); }}
            style={{ resize:"none", minHeight:110, lineHeight:1.6 }} />
          <div style={{ fontSize:11, color:"var(--text3)", marginTop:4, textAlign:"right" }}>{desc.length}/{ml}</div>
        </div>
        <div className="iw mb3">
          <label className="lbl">Carrera preferida del prestador</label>
          <select className="inp" value={cf} onChange={e => setCf(e.target.value)}
            style={{ cursor:"pointer", colorScheme:"dark" }}>
            <option value="">Cualquier programa</option>
            {CARRERAS.filter(c => c !== "Posgrado").map(c => <option key={c} value={c}>{c}</option>)}
            <option value="Posgrado">Posgrado</option>
          </select>
        </div>
        {desc.length > 10 && (
          <div className="card mb3" style={{ borderColor:"rgba(59,130,246,0.18)" }}>
            <div style={{ fontSize:11, fontWeight:600, color:"var(--blue)", marginBottom:8, letterSpacing:0.3, textTransform:"uppercase" }}>Vista previa</div>
            <div className="tag tag-b mb2">{cat.name}</div>
            <div style={{ fontSize:13, color:"var(--text2)", lineHeight:1.6 }}>{desc.length>110 ? desc.slice(0,110)+"…" : desc}</div>
            {cf && <div className="tag tag-s mt2">{cf}</div>}
          </div>
        )}
        <button className="btn btn-p" disabled={!ok} onClick={() => onNext(desc, cf)}>Ver prestadores</button>
      </div>
    </div>
  );
}

// ─── CATEGORY ─────────────────────────────────────────────────────────────────
function Category({ cat, onUser, onBack, fd, cf }) {
  const [st, setSt] = useState("14:00");
  const [ld, setLd] = useState(new Date().toISOString().split("T")[0]);
  const [lt, setLt] = useState("18:00");
  const disp = cf ? USERS.filter(u => u.career.toLowerCase().includes(cf.split(" ")[0].toLowerCase())) : USERS;
  const show = disp.length > 0 ? disp : USERS;

  return (
    <div className="screen">
      <div style={{ padding:"12px 20px 14px", borderBottom:"1px solid var(--border)" }}>
        <div className="row g2">
          <button className="back" onClick={onBack}><IcoBack size={18} color="var(--text2)" /></button>
          <div>
            <div style={{ fontSize:16, fontWeight:600, color:"var(--text)" }}>{cat.name}</div>
            <div style={{ fontSize:12, color:"var(--text2)" }}>{fmt(cat.range[0])} — {fmt(cat.range[1])}</div>
          </div>
        </div>
      </div>
      {fd && (
        <div className="px" style={{ paddingTop:14 }}>
          <div className="card" style={{ borderColor:"rgba(59,130,246,0.14)", marginBottom:14 }}>
            <div style={{ fontSize:11, fontWeight:600, color:"var(--blue)", marginBottom:6, letterSpacing:0.3, textTransform:"uppercase" }}>Tu solicitud</div>
            <div style={{ fontSize:13, color:"var(--text2)", lineHeight:1.5 }}>{fd.length>110 ? fd.slice(0,110)+"…" : fd}</div>
            {cf && <div className="tag tag-s mt2">{cf}</div>}
          </div>
        </div>
      )}
      <div className="px" style={{ paddingTop:fd?0:14, paddingBottom:14 }}>
        <div className="t-label mb2">Define los tiempos</div>
        <div className="iw">
          <label className="lbl">Hora de inicio</label>
          <input className="inp" type="time" value={st} onChange={e => setSt(e.target.value)} style={{ colorScheme:"dark" }} />
        </div>
        <div className="row g2">
          <div className="iw flex1" style={{ marginBottom:0 }}>
            <label className="lbl">Fecha límite</label>
            <input className="inp" type="date" value={ld} onChange={e => setLd(e.target.value)} style={{ colorScheme:"dark" }} />
          </div>
          <div className="iw flex1" style={{ marginBottom:0 }}>
            <label className="lbl">Hora límite</label>
            <input className="inp" type="time" value={lt} onChange={e => setLt(e.target.value)} style={{ colorScheme:"dark" }} />
          </div>
        </div>
      </div>
      <div className="hr" />
      {cat.id === "prestamo" ? (
        <div className="px">
          <div className="t-label mb2">Objetos disponibles</div>
          {OBJECTS.map(o => (
            <div key={o.id} className="obj-card" onClick={() => onUser(USERS[0])}>
              <div className="obj-img"><IcoBox size={20} color="var(--text3)" /></div>
              <div className="flex1">
                <div style={{ fontSize:14, fontWeight:600, color:"var(--text)", marginBottom:3 }}>{o.name}</div>
                <div style={{ fontSize:12, color:"var(--text2)" }}>{o.owner}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:13, fontWeight:700, color:"var(--accent)" }}>{fmt(o.price)}/día</div>
                <div style={{ fontSize:11, color:"var(--text3)", marginTop:2 }}>Dep. {fmt(o.deposit)}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="px">
          <div className="row between mb2">
            <div className="t-label">Cerca de ti</div>
            <div className="tag tag-g">En vivo</div>
          </div>
          {show.map(u => (
            <div key={u.id} className={`ucard ${!u.available ? "busy" : ""}`}
              onClick={() => u.available && onUser(u)}>
              <div className="av av-m">{u.av}</div>
              <div className="flex1">
                <div style={{ fontSize:14, fontWeight:600, color:"var(--text)", marginBottom:3 }}>{u.name}</div>
                <div style={{ fontSize:12, color:"var(--text2)", marginBottom:4 }}>{u.career}</div>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <span style={{ fontSize:12, color:"var(--amber)", fontWeight:600 }}>★ {u.rating}</span>
                  <span style={{ fontSize:11, color:"var(--text3)" }}>{u.favors} favores</span>
                </div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:13, fontWeight:600, color:"var(--teal)" }}>{u.distance}</div>
                <div style={{ fontSize:11, marginTop:4, fontWeight:500, color: u.available ? "var(--green)" : "var(--text3)" }}>
                  {u.available ? "Disponible" : "Ocupado"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── NEGOTIATE ────────────────────────────────────────────────────────────────
function Negotiate({ cat, user, onConfirm, onBack, onChat, cp }) {
  const mid = cp || Math.floor((cat.range[0] + cat.range[1]) / 2);
  const [price, setPrice] = useState(mid);
  const pct = ((price - cat.range[0]) / (cat.range[1] - cat.range[0]) * 100).toFixed(1) + "%";

  return (
    <div className="screen">
      <div style={{ padding:"12px 20px 14px", borderBottom:"1px solid var(--border)" }}>
        <div className="row g2">
          <button className="back" onClick={onBack}><IcoBack size={18} color="var(--text2)" /></button>
          <div style={{ fontSize:16, fontWeight:600, color:"var(--text)" }}>Negociar precio</div>
        </div>
      </div>
      {cp && (
        <div className="px" style={{ paddingTop:14 }}>
          <div style={{ background:"var(--green-dim)", border:"1px solid rgba(34,197,94,0.18)", borderRadius:"var(--r-md)", padding:"11px 14px" }}>
            <div style={{ fontSize:13, color:"var(--green)", fontWeight:500 }}>Contraoferta del prestador: {fmt(cp)}</div>
          </div>
        </div>
      )}
      <div className="px" style={{ paddingTop:14, paddingBottom:14 }}>
        <div style={{ background:"var(--surface2)", borderRadius:"var(--r-md)", padding:14, display:"flex", gap:12, alignItems:"center" }}>
          <div className="av av-m">{user.av}</div>
          <div className="flex1">
            <div style={{ fontSize:14, fontWeight:600, color:"var(--text)" }}>{user.name}</div>
            <div style={{ fontSize:12, color:"var(--text2)" }}>{user.career}</div>
          </div>
          <div style={{ fontSize:13, fontWeight:600, color:"var(--amber)" }}>★ {user.rating}</div>
        </div>
      </div>
      <div className="px mb3" style={{ textAlign:"center" }}>
        <div style={{ fontSize:52, fontWeight:700, color:"var(--accent)", lineHeight:1, letterSpacing:"-2px" }}>{fmt(price)}</div>
        <div style={{ fontSize:12, color:"var(--text3)", marginTop:4 }}>Tu oferta</div>
      </div>
      <div className="px mb3">
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"var(--text3)", marginBottom:12, fontWeight:500 }}>
          <span>{fmt(cat.range[0])}</span><span>{fmt(cat.range[1])}</span>
        </div>
        <input type="range" className="sldr" min={cat.range[0]} max={cat.range[1]} step={1000}
          value={price} style={{ "--p":pct }} onChange={e => setPrice(Number(e.target.value))} />
      </div>
      <div className="hr" />
      <div className="px mb3">
        <div className="t-label mb2">Comunicación</div>
        <div className="cgrd">
          {[[<IcoChat size={20}/>, "Mensaje", onChat],[<IcoPhone size={20}/>, "Llamada", ()=>{}],[<IcoPin size={20}/>, "Ubicación", ()=>{}]].map(([ic, lb, fn]) => (
            <button key={lb} className="cbtn" onClick={fn}>
              <span style={{ color:"var(--text2)" }}>{ic}</span>
              <span style={{ fontSize:11, color:"var(--text3)", fontWeight:500 }}>{lb}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="px">
        <button className="btn btn-p" onClick={() => onConfirm(price)}>Confirmar · {fmt(price)}</button>
      </div>
    </div>
  );
}

// ─── CHAT ─────────────────────────────────────────────────────────────────────
function Chat({ user, onBack }) {
  const [msgs, setMsgs] = useState([
    { f:"th", t:"Hola, vi tu solicitud. ¿En qué te puedo ayudar?" },
    { f:"me", t:"Necesito ayuda con cálculo diferencial para mañana" },
    { f:"th", t:"Claro, puedo en 30 min en la biblioteca central" },
  ]);
  const [inp, setInp] = useState("");
  const bot = useRef();
  const send = () => { if (!inp.trim()) return; setMsgs(m => [...m, { f:"me", t:inp }]); setInp(""); };

  return (
    <div className="screen" style={{ display:"flex", flexDirection:"column", background:"var(--bg)" }}>
      <div style={{ padding:"12px 20px 14px", borderBottom:"1px solid var(--border)", background:"var(--bg)", flexShrink:0 }}>
        <div className="row g2">
          <button className="back" onClick={onBack}><IcoBack size={18} color="var(--text2)" /></button>
          <div className="av av-s">{user.av}</div>
          <div className="flex1">
            <div style={{ fontSize:14, fontWeight:600, color:"var(--text)" }}>{user.name}</div>
            <div style={{ fontSize:11, color:"var(--green)", fontWeight:500 }}>En línea</div>
          </div>
          <IcoPin size={20} color="var(--text3)" />
        </div>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"14px 20px", display:"flex", flexDirection:"column", gap:2 }}>
        {msgs.map((m, i) => (
          <div key={i} className={`bbl ${m.f === "me" ? "bme" : "bth"}`}>{m.t}</div>
        ))}
        <div ref={bot} />
      </div>
      <div style={{ borderTop:"1px solid var(--border)", padding:"10px 16px 14px", background:"var(--bg)", flexShrink:0, display:"flex", gap:10, alignItems:"center" }}>
        <input className="inp flex1" placeholder="Escribe un mensaje…" value={inp}
          onChange={e => setInp(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          style={{ marginBottom:0, borderRadius:"var(--r-pill)", padding:"11px 16px", fontSize:14 }} />
        <button onClick={send} style={{
          width:42, height:42, flexShrink:0, background:"var(--accent)", border:"none",
          borderRadius:"50%", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          <IcoSend size={16} color="#fff" />
        </button>
      </div>
    </div>
  );
}

// ─── TRACKING ─────────────────────────────────────────────────────────────────
function Tracking({ user, onBack }) {
  return (
    <div className="screen px" style={{ paddingTop:16 }}>
      <div className="row g2 mb3">
        <button className="back" onClick={onBack}><IcoBack size={18} color="var(--text2)" /></button>
        <div style={{ fontSize:16, fontWeight:600, color:"var(--text)" }}>Ubicación en vivo</div>
      </div>
      <div className="map-mock mb3">
        <div className="mgrid" />
        <div className="mdot" style={{ top:"45%", left:"48%" }} />
        <div style={{
          position:"absolute", width:10, height:10, borderRadius:"50%",
          background:"var(--blue)", top:"30%", left:"62%",
          boxShadow:"0 0 0 4px rgba(59,130,246,0.18)",
        }} />
        <div style={{
          position:"absolute", bottom:12, left:12,
          background:"rgba(10,12,17,0.80)", backdropFilter:"blur(8px)",
          borderRadius:"var(--r-sm)", padding:"6px 12px",
          display:"flex", gap:8, alignItems:"center",
        }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:"var(--accent)", display:"inline-block" }} />
          <span style={{ fontSize:12, fontWeight:600, color:"var(--text)" }}>{user.name}</span>
          <span style={{ fontSize:12, color:"var(--text2)" }}>50m</span>
        </div>
        <div style={{
          position:"absolute", top:12, right:12,
          background:"rgba(34,197,94,0.85)", backdropFilter:"blur(8px)",
          borderRadius:"var(--r-sm)", padding:"6px 12px",
        }}>
          <span style={{ fontSize:11, fontWeight:600, color:"#fff" }}>En camino</span>
        </div>
      </div>
      <div className="card mb3">
        <div className="row g2 mb3">
          <div className="av av-m">{user.av}</div>
          <div className="flex1">
            <div style={{ fontSize:14, fontWeight:600, color:"var(--text)" }}>{user.name}</div>
            <div style={{ fontSize:12, color:"var(--text2)" }}>{user.career}</div>
          </div>
          <div className="tag tag-g">~3 min</div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          {[[<IcoChat size={16}/>, "Chat"], [<IcoPhone size={16}/>, "Llamar"]].map(([ic, lb]) => (
            <button key={lb} className="btn btn-o flex1" style={{ padding:"11px", fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
              <span style={{ color:"var(--text2)" }}>{ic}</span> {lb}
            </button>
          ))}
        </div>
      </div>
      <button className="btn btn-p" onClick={onBack}>Marcar como completado</button>
    </div>
  );
}

// ─── SUCCESS ──────────────────────────────────────────────────────────────────
function Success({ price, user, onHome }) {
  const [rated, setRated] = useState(false);
  const [stars, setStars] = useState(0);
  return (
    <div className="screen col" style={{
      minHeight:800, padding:"0 24px", background:"var(--bg)",
      alignItems:"center", justifyContent:"center",
    }}>
      {!rated ? (
        <>
          <div style={{
            width:72, height:72, borderRadius:"50%", background:"var(--acc-dim)",
            border:"1px solid rgba(196,160,80,0.20)", display:"flex",
            alignItems:"center", justifyContent:"center", marginBottom:20,
          }}>
            <IcoCheck size={32} color="var(--accent)" />
          </div>
          <div style={{ fontSize:30, fontWeight:700, letterSpacing:"-1px", textAlign:"center", marginBottom:8 }}>
            Favor<br /><span style={{ color:"var(--accent)" }}>completado</span>
          </div>
          <div style={{ fontSize:14, color:"var(--text2)", textAlign:"center", marginBottom:28, lineHeight:1.6 }}>
            {fmt(price)} enviados a {user.name}.<br />Comisión Favo retenida automáticamente.
          </div>
          <div className="card mb4" style={{ width:"100%" }}>
            <div className="row g2 mb3">
              <div className="av av-m">{user.av}</div>
              <div>
                <div style={{ fontSize:14, fontWeight:600, color:"var(--text)" }}>{user.name}</div>
                <div style={{ fontSize:12, color:"var(--text2)" }}>{user.career}</div>
              </div>
            </div>
            <div className="hr" />
            <div style={{ fontSize:32, fontWeight:700, color:"var(--accent)", textAlign:"center", letterSpacing:"-1px", marginTop:8 }}>
              {fmt(price)}
            </div>
            <div style={{ fontSize:11, color:"var(--text3)", textAlign:"center", marginTop:2 }}>PAGADO</div>
          </div>
          <div style={{ width:"100%", textAlign:"center", marginBottom:24 }}>
            <div style={{ fontSize:14, fontWeight:500, color:"var(--text)", marginBottom:12 }}>¿Cómo estuvo el servicio?</div>
            <div style={{ display:"flex", justifyContent:"center", gap:6 }}>
              {[1,2,3,4,5].map(s => (
                <span key={s} className="star" onClick={() => setStars(s)}
                  style={{ color: s <= stars ? "var(--amber)" : "var(--surface2)" }}>★</span>
              ))}
            </div>
          </div>
          {stars > 0 && (
            <div className="iw" style={{ width:"100%" }}>
              <label className="lbl">Reseña (opcional)</label>
              <input className="inp" placeholder="Excelente servicio, muy puntual…" />
            </div>
          )}
          <button className="btn btn-p" disabled={stars === 0} onClick={() => setRated(true)} style={{ width:"100%" }}>
            {stars === 0 ? "Selecciona una calificación" : "Enviar calificación"}
          </button>
        </>
      ) : (
        <>
          <div style={{
            width:72, height:72, borderRadius:"50%",
            background:"rgba(245,158,11,0.10)", border:"1px solid rgba(245,158,11,0.20)",
            display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20,
          }}>
            <IcoStar size={32} color="var(--amber)" />
          </div>
          <div style={{ fontSize:30, fontWeight:700, letterSpacing:"-1px", textAlign:"center", marginBottom:28 }}>
            Gracias por<br /><span style={{ color:"var(--accent)" }}>calificar</span>
          </div>
          <button className="btn btn-p" style={{ width:"100%" }} onClick={onHome}>Volver al inicio</button>
        </>
      )}
    </div>
  );
}

// ─── WALLET ───────────────────────────────────────────────────────────────────
function Wallet() {
  return (
    <div className="screen">
      <div style={{ padding:"14px 20px 16px", borderBottom:"1px solid var(--border)" }}>
        <div style={{ fontSize:22, fontWeight:700, letterSpacing:"-0.5px" }}>
          Billetera<span style={{ color:"var(--accent)" }}>.</span>
        </div>
      </div>
      <div className="px" style={{ paddingTop:16 }}>
        <div className="w-hero mb3">
          <div style={{ fontSize:11, fontWeight:500, color:"rgba(245,158,11,0.70)", letterSpacing:0.8, textTransform:"uppercase", marginBottom:6 }}>
            Saldo disponible
          </div>
          <div style={{ fontSize:42, fontWeight:700, color:"var(--text)", lineHeight:1, marginBottom:20, letterSpacing:"-2px" }}>
            $127.500
          </div>
          <div style={{ display:"flex", gap:10 }}>
            {["Retirar","Recargar"].map(a => (
              <button key={a} style={{
                flex:1, padding:11, fontSize:13, borderRadius:"var(--r-sm)",
                background:"rgba(245,247,250,0.06)", border:"1px solid rgba(245,247,250,0.12)",
                color:"var(--text)", cursor:"pointer", fontFamily:"var(--font)", fontWeight:600,
                transition:"all .15s",
              }}>{a}</button>
            ))}
          </div>
        </div>
        <div className="t-label mb2">Método de pago</div>
        <div className="card mb3 row g2">
          <IcoPhone size={18} color="var(--text2)" />
          <div className="flex1">
            <div style={{ fontSize:14, fontWeight:600, color:"var(--text)" }}>Nequi</div>
            <div style={{ fontSize:12, color:"var(--text2)" }}>+57 310 *** 4521</div>
          </div>
          <div className="tag tag-g">Principal</div>
        </div>
        <div className="t-label mb2">Historial</div>
        {[
          { icon:<IcoBook size={16}/>,  desc:"Tutoría Cálculo", tipo:"Pagado",   a:-25000, c:"var(--err)"   },
          { icon:<IcoCode size={16}/>,  desc:"Ayuda Python",    tipo:"Pagado",   a:-40000, c:"var(--err)"   },
          { icon:<IcoBox size={16}/>,   desc:"Préstamo calc.",  tipo:"Recibido", a:+8000,  c:"var(--green)" },
          { icon:<IcoPen size={16}/>,   desc:"Diseño poster",   tipo:"Recibido", a:+35000, c:"var(--green)" },
        ].map((h, i) => (
          <div key={i} className="card mb1 row g2">
            <div style={{ width:38, height:38, borderRadius:"var(--r-sm)", background:"var(--surface2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:"var(--text2)" }}>
              {h.icon}
            </div>
            <div className="flex1">
              <div style={{ fontSize:14, fontWeight:600, color:"var(--text)", marginBottom:2 }}>{h.desc}</div>
              <div style={{ fontSize:11, color:"var(--text3)" }}>{h.tipo}</div>
            </div>
            <div style={{ fontSize:14, fontWeight:700, color:h.c }}>{h.a>0?"+":""}{fmt(Math.abs(h.a))}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── NOTIFS ───────────────────────────────────────────────────────────────────
function Notifs({ onIncoming }) {
  const items = [
    { icon:<IcoCheck size={16}/>, title:"Favor completado",  desc:"Sebastián marcó el favor como completado", time:"5 min",  c:"var(--green)", tap:null },
    { icon:<IcoWallet size={16}/>,title:"Pago recibido",     desc:"Recibiste $35.000 por diseño de poster",   time:"1h",    c:"var(--amber)", tap:null },
    { icon:<IcoBell size={16}/>,  title:"Nueva solicitud",   desc:"Laura M. busca ayuda en Académico · 80m",  time:"2h",    c:"var(--accent)",tap:onIncoming },
    { icon:<IcoChat size={16}/>,  title:"Contraoferta",      desc:"Valentina propone $30.000 por tu favor",   time:"3h",    c:"var(--blue)",  tap:null },
    { icon:<IcoStar size={16}/>,  title:"Nueva reseña",      desc:"Diego te dejó 5 estrellas",                time:"Ayer",  c:"var(--amber)", tap:null },
  ];
  return (
    <div className="screen">
      <div style={{ padding:"14px 20px 16px", borderBottom:"1px solid var(--border)" }}>
        <div style={{ fontSize:22, fontWeight:700, letterSpacing:"-0.5px" }}>
          Alertas<span style={{ color:"var(--accent)" }}>.</span>
        </div>
      </div>
      <div className="px" style={{ paddingTop:14 }}>
        {items.map((n, i) => (
          <div key={i} className="ncard" onClick={n.tap}>
            <div className="ncard-bar" style={{ background:n.c }} />
            <div style={{ display:"flex", gap:12, alignItems:"flex-start", paddingLeft:12 }}>
              <div style={{
                width:34, height:34, borderRadius:"var(--r-sm)", background:"var(--surface2)",
                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
                color:"var(--text2)",
              }}>{n.icon}</div>
              <div className="flex1">
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>{n.title}</div>
                  <div style={{ fontSize:11, color:"var(--text3)" }}>{n.time}</div>
                </div>
                <div style={{ fontSize:12, color:"var(--text2)", lineHeight:1.5 }}>{n.desc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
function Profile({ onBack, prov, onTogProv, ui }) {
  const [tab, setTab] = useState("info");
  const esPrest = ui?.tipo === "prestador" || ui?.tipo === "ambos";
  const esCli   = ui?.tipo === "cliente"   || ui?.tipo === "ambos";
  const nombre  = ui?.nombre || "Alejandro García";
  const ini     = nombre[0].toUpperCase();
  const prog    = ui?.posgrado ? `Posgrado · ${ui.posgrado}` : (ui?.carrera || "Ing. de Sistemas");

  const tabs = [
    { id:"info", lbl:"Info" },
    ...(esCli   ? [{ id:"pedidos",    lbl:"Pedidos"    }] : []),
    ...(esPrest ? [{ id:"prestador",  lbl:"Prestador"  },
                   { id:"habilidades",lbl:"Habilidades"}] : []),
  ];

  return (
    <div className="screen">
      {/* Header */}
      <div style={{
        borderBottom:"1px solid var(--border)", paddingBottom:20,
        background:"var(--bg)",
      }}>
        <div className="px row g2" style={{ paddingTop:14, marginBottom:20 }}>
          <button className="back" onClick={onBack}><IcoBack size={18} color="var(--text2)" /></button>
          <div style={{ fontSize:16, fontWeight:600, color:"var(--text)" }}>Mi perfil</div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", paddingBottom:4 }}>
          <div className="av av-xl" style={{ marginBottom:14 }}>{ini}</div>
          <div style={{ fontSize:20, fontWeight:700, letterSpacing:"-0.3px", color:"var(--text)", marginBottom:4 }}>{nombre}</div>
          <div style={{ fontSize:13, color:"var(--text2)", marginBottom:12 }}>{prog}</div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center" }}>
            <div className="tag tag-g">Verificado Uniandes</div>
            {esPrest && <div className="tag tag-a">Prestador</div>}
            {esCli   && <div className="tag tag-s">Cliente</div>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        background:"var(--bg)", borderBottom:"1px solid var(--border)",
        display:"flex", padding:"0 20px",
      }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding:"13px 14px", fontSize:13, fontWeight:600,
            borderBottom:`2px solid ${tab === t.id ? "var(--accent)" : "transparent"}`,
            background:"transparent", border:"none",
            borderBottomWidth:2, borderBottomStyle:"solid",
            borderBottomColor: tab === t.id ? "var(--accent)" : "transparent",
            cursor:"pointer", fontFamily:"var(--font)",
            color: tab === t.id ? "var(--accent)" : "var(--text3)", transition:"all .18s",
          }}>{t.lbl}</button>
        ))}
      </div>

      {tab === "info" && (
        <div className="px" style={{ paddingTop:16 }}>
          <div className="row g2 mb3">
            {[["★","4.8","Rating"],["✓","12","Favores"],["$","$187k","Total"]].map(([ic,v,l]) => (
              <div key={l} className="stat">
                <div style={{ fontSize:12, color:"var(--text3)", marginBottom:6 }}>{ic}</div>
                <div style={{ fontSize:18, fontWeight:700, color:"var(--accent)", letterSpacing:"-0.5px" }}>{v}</div>
                <div style={{ fontSize:11, color:"var(--text3)", marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="t-label mb3">Datos personales</div>
            {[
              ["Correo",    "a.garcia@uniandes.edu.co"],
              ["Código",    "202312345"],
              ["Teléfono",  ui?.telefono || "3101234567"],
              ["Programa",  ui?.posgrado ? `Posgrado: ${ui.posgrado}` : (ui?.carrera || "Ing. de Sistemas")],
              ...(!ui?.posgrado ? [["Semestre", (ui?.semestre || "5°") + " semestre"]] : []),
            ].map(([lb, val]) => (
              <div key={lb} style={{
                display:"flex", justifyContent:"space-between", alignItems:"center",
                paddingBottom:11, marginBottom:11, borderBottom:"1px solid var(--border)",
              }}>
                <span style={{ fontSize:13, color:"var(--text3)" }}>{lb}</span>
                <span style={{ fontSize:13, fontWeight:500, color:"var(--text)", maxWidth:"58%", textAlign:"right", wordBreak:"break-all" }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "pedidos" && (
        <div className="px" style={{ paddingTop:16 }}>
          {[
            { icon:<IcoBook size={16}/>,  title:"Tutoría Cálculo",     status:"Completado", price:25000, c:"var(--green)" },
            { icon:<IcoCode size={16}/>,  title:"Ayuda con Python",    status:"Completado", price:40000, c:"var(--green)" },
            { icon:<IcoBox size={16}/>,   title:"Préstamo calculadora",status:"Activo",     price:8000,  c:"var(--amber)" },
          ].map((h, i) => (
            <div key={i} className="card mb2">
              <div className="row g2">
                <div style={{ width:38, height:38, borderRadius:"var(--r-sm)", background:"var(--surface2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:"var(--text2)" }}>{h.icon}</div>
                <div className="flex1">
                  <div style={{ fontSize:14, fontWeight:600, color:"var(--text)", marginBottom:3 }}>{h.title}</div>
                  <div style={{ fontSize:12, color:h.c, fontWeight:500 }}>{h.status}</div>
                </div>
                <div style={{ fontSize:14, fontWeight:700, color:"var(--accent)", letterSpacing:"-0.3px" }}>{fmt(h.price)}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "prestador" && esPrest && (
        <div className="px" style={{ paddingTop:16 }}>
          <div className="prov row between mb3">
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:"var(--green)", marginBottom:3 }}>Disponible ahora</div>
              <div style={{ fontSize:12, color:"var(--text2)" }}>{prov ? "Recibiendo solicitudes" : "Desactivado"}</div>
            </div>
            <button className={`tog ${prov ? "on" : "off"}`} onClick={onTogProv}><div className="tok" /></button>
          </div>
          <div className="row g2 mb3">
            {[["★","4.9","Rating"],["✓","28","Favores"],["$","$342k","Ganado"]].map(([ic,v,l]) => (
              <div key={l} className="stat">
                <div style={{ fontSize:12, color:"var(--text3)", marginBottom:6 }}>{ic}</div>
                <div style={{ fontSize:18, fontWeight:700, color:"var(--green)", letterSpacing:"-0.5px" }}>{v}</div>
                <div style={{ fontSize:11, color:"var(--text3)", marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>
          <div className="t-label mb2">Categorías activas</div>
          {[{ icon:<IcoBook size={16}/>, name:"Académico", range:"$15k — $35k" },
            { icon:<IcoCode size={16}/>, name:"Tech",      range:"$20k — $70k" }].map((c, i) => (
            <div key={i} className="card mb2 row g2">
              <div style={{ width:36, height:36, borderRadius:"var(--r-sm)", background:"var(--surface2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:"var(--text2)" }}>{c.icon}</div>
              <div className="flex1">
                <div style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>{c.name}</div>
                <div style={{ fontSize:11, color:"var(--text2)" }}>{c.range}</div>
              </div>
              <div className="tag tag-g">Activo</div>
            </div>
          ))}
        </div>
      )}

      {tab === "habilidades" && esPrest && (
        <div className="px" style={{ paddingTop:16 }}>
          {ui?.habilidades && Object.keys(ui.habilidades).length > 0 ? (
            Object.entries(ui.habilidades).map(([id, det]) => {
              const sc = SKILL_CATS.find(s => s.id === id);
              return sc ? (
                <div key={id} className="card mb2">
                  <div className="row between mb1">
                    <div style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>{sc.name}</div>
                    <div className="tag tag-g">Activo</div>
                  </div>
                  {det && <div style={{ fontSize:12, color:"var(--text2)" }}>"{det}"</div>}
                </div>
              ) : null;
            })
          ) : (
            <div className="card" style={{ textAlign:"center", padding:28 }}>
              <div style={{ fontSize:15, fontWeight:600, color:"var(--text)", marginBottom:6 }}>Sin habilidades registradas</div>
              <div style={{ fontSize:13, color:"var(--text2)" }}>Puedes agregar habilidades editando tu perfil</div>
            </div>
          )}
          {ui?.otrasHabilidades && (
            <div className="card mt2">
              <div className="t-label mb2">Otras habilidades</div>
              <div style={{ fontSize:14, color:"var(--text)" }}>{ui.otrasHabilidades}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function FavoApp() {
  const [screen,  setScreen]  = useState("splash");
  const [email,   setEmail]   = useState("");
  const [ui,      setUi]      = useState(null);
  const [selCat,  setCat]     = useState(null);
  const [selUser, setUser]    = useState(null);
  const [cprice,  setCprice]  = useState(null);
  const [counter, setCounter] = useState(null);
  const [toast,   setToast]   = useState(null);
  const [nav,     setNav]     = useState("home");
  const [prov,    setProv]    = useState(false);
  const [fd,      setFd]      = useState("");
  const [cf,      setCf]      = useState("");
  const [showInc, setInc]     = useState(false);

  const toast_ = msg => { setToast(msg); setTimeout(() => setToast(null), 2800); };

  const handleNav = id => {
    setNav(id);
    if (id === "home")    { setScreen("home");    setCat(null); setUser(null); }
    if (id === "wallet")  setScreen("wallet");
    if (id === "notifs")  setScreen("notifs");
    if (id === "profile") setScreen("profile");
  };

  const noNav = ["splash","reg-email","reg-code","reg-verify","reg-type","reg-hab","success"];
  const showNav = !noNav.includes(screen);

  return (
    <>
      <style>{G}</style>
      <div className="wrap">
        <div className="phone">
          <SB />
          {toast && (
            <div className="toast">
              <IcoCheck size={14} color="var(--green)" />
              {toast}
            </div>
          )}
          {showInc && (
            <Incoming cat={selCat || CATS[0]}
              onAccept={p => {
                setInc(false);
                if (p !== INCOMING.price) { setCounter(p); toast_(`Contraoferta de ${fmt(p)} enviada`); }
                else toast_("Solicitud aceptada");
              }}
              onDecline={() => { setInc(false); toast_("Solicitud rechazada"); }}
            />
          )}

          {screen==="splash"    && <Splash onNext={() => setScreen("reg-email")} />}
          {screen==="reg-email" && <RegEmail onNext={e => { setEmail(e); setScreen("reg-code"); }} />}
          {screen==="reg-code"  && <RegCode email={email} onNext={() => setScreen("reg-verify")} />}
          {screen==="reg-verify"&& <RegVerify email={email} onNext={() => setScreen("reg-type")} />}
          {screen==="reg-type"  && <RegUserType onNext={info => {
            setUi(info);
            if (info.tipo === "prestador" || info.tipo === "ambos") setScreen("reg-hab");
            else { toast_("Bienvenido a Favo"); setScreen("home"); setNav("home"); }
          }} />}
          {screen==="reg-hab"   && <RegHabilidades userInfo={ui} onNext={info => {
            setUi(info); toast_("Bienvenido a Favo"); setScreen("home"); setNav("home");
          }} />}

          {screen==="home"       && <Home
            onCat={c => { setCat(c); setScreen("favor-desc"); }}
            onProfile={() => { setScreen("profile"); setNav("profile"); }}
            prov={prov}
            onTogProv={() => { setProv(p => !p); toast_(prov ? "Modo prestador desactivado" : "Modo prestador activado"); }}
            onIncoming={() => setInc(true)}
            ui={ui}
          />}
          {screen==="favor-desc" && selCat && <FavorDesc cat={selCat}
            onNext={(d,c) => { setFd(d); setCf(c); setScreen("category"); }}
            onBack={() => setScreen("home")} />}
          {screen==="category"   && selCat && <Category cat={selCat}
            onUser={u => { setUser(u); setScreen("negotiate"); }}
            onBack={() => setScreen("favor-desc")} fd={fd} cf={cf} />}
          {screen==="negotiate"  && selCat && selUser && <Negotiate cat={selCat} user={selUser}
            onConfirm={p => { setCprice(p); setScreen("tracking"); }}
            onBack={() => setScreen("category")} onChat={() => setScreen("chat")} cp={counter} />}
          {screen==="chat"       && selUser && <Chat user={selUser} onBack={() => setScreen("negotiate")} />}
          {screen==="tracking"   && selUser && <Tracking user={selUser}
            onBack={() => { toast_("Favor completado"); setScreen("success"); }} />}
          {screen==="success"    && selUser && <Success price={cprice} user={selUser}
            onHome={() => { setScreen("home"); setNav("home"); setCat(null); setUser(null); setCounter(null); }} />}
          {screen==="wallet"     && <Wallet />}
          {screen==="notifs"     && <Notifs onIncoming={() => setInc(true)} />}
          {screen==="profile"    && <Profile
            onBack={() => { setScreen("home"); setNav("home"); }}
            prov={prov} onTogProv={() => setProv(p => !p)} ui={ui} />}

          {showNav && <BNav active={nav} onChange={handleNav} />}
        </div>
      </div>
    </>
  );
}
