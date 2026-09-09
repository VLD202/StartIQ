import { useState, useEffect, useRef } from 'react'

const MOCK = {
  overall_score: 78.7, rating: 'Seed Ready 🌱',
  idea: 94, market: 76, finance: 72, risk: 88, competitor: 70,
  problem_statement: 'Students lack affordable, personalized tutoring that adapts to their individual learning pace across different subjects.',
  solution_summary: 'An AI-powered tutoring platform with real-time feedback, adaptive lessons, and full vernacular language support.',
  target_users: 'Students aged 14-16 in Indian tier-2/3 cities',
  innovation_level: 7.5, feasibility_score: 8.2, clarity_score: 9.0,
  TAM: '$45B', SAM: '$8B', SOM: '$500M', yoy_growth: '28',
  market_trends: ['AI personalization', 'Post-COVID surge', 'Vernacular content', 'Smartphones'],
  key_insight: 'India EdTech growing at 28% YoY — tier-2/3 cities massively underserved.',
  direct_competitors: ["Byju's", 'Vedantu', 'Unacademy', 'Doubtnut'],
  indirect_competitors: ['YouTube', 'Khan Academy', 'WhiteHat Jr'],
  market_gap: 'No affordable AI-personalized tutor for rural India with vernacular support.',
  swot: {
    strengths: ['AI personalization engine', 'Ultra-low cost model', 'Vernacular support', 'Offline-first'],
    weaknesses: ['High competition', 'Trust building required', 'Content creation cost'],
    opportunities: ['NEP 2020 digital push', 'Jio connectivity', 'EdTech grants'],
    threats: ["Byju's massive funding", 'Free YouTube', 'Rural internet issues'],
  },
  risk_score: 6.4, innovation_uniqueness: 8.1, overall_risk_level: 'Medium',
  execution_challenges: ['Content at scale', 'Teacher resistance', 'Low internet', 'Retention month 1'],
  mitigation_strategies: ['School partnerships', 'Offline-first PWA', 'Gamification', 'Govt tie-ups'],
}

/* ─── GSAP LOADER ─── */
let _gsapReady = false, _gsapPromise = null
function loadGSAP() {
  if (_gsapReady) return Promise.resolve()
  if (_gsapPromise) return _gsapPromise
  _gsapPromise = (async () => {
    if (!window.gsap) await new Promise(r => { const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js'; s.onload = r; document.head.appendChild(s) })
    if (!window.ScrollTrigger) {
      await new Promise(r => { const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js'; s.onload = r; document.head.appendChild(s) })
      window.gsap.registerPlugin(window.ScrollTrigger)
    }
    _gsapReady = true
  })()
  return _gsapPromise
}
function useGSAP(cb, deps = []) {
  const ref = useRef(cb); ref.current = cb
  useEffect(() => {
    let cleanup = null
    loadGSAP().then(() => { cleanup = ref.current(window.gsap, window.ScrollTrigger) })
    return () => { if (typeof cleanup === 'function') cleanup() }
  }, deps)
}

/* ─── GLOBAL CSS ─── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{background:#f4f7f5;color:#0e1f1a;font-family:'DM Sans',sans-serif;overflow-x:hidden;}
:root{
  --teal:#007a61;--teal2:#009e7d;--tealLight:#e6f4f0;--tealMid:rgba(0,122,97,0.12);
  --pink:#d6004e;--gold:#c47a00;--blue:#1a56db;
  --text:#0e1f1a;--sub:#3d6055;--muted:#7da898;
  --border:rgba(0,122,97,0.13);--borderB:rgba(0,122,97,0.28);
  --bg:#f0f5f3;--card:#ffffff;--sidebar:#0e1f1a;
  --fdisp:'DM Serif Display',serif;--fbody:'DM Sans',sans-serif;--fmono:'JetBrains Mono',monospace;
}

/* ══════════════════════ LANDING ══════════════════════ */
.nav{position:fixed;top:0;left:0;right:0;z-index:998;height:64px;display:flex;align-items:center;padding:0 40px;transition:background 0.4s;}
.nav.scrolled{background:rgba(240,245,243,0.94);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);}
.nav-logo{font-family:var(--fdisp);font-size:18px;color:var(--text);margin-right:auto;}
.nav-logo em{color:var(--teal);font-style:italic;}
.nav-links{display:flex;gap:32px;margin-right:40px;}
.nav-link{font-size:13px;color:var(--sub);background:none;border:none;cursor:pointer;transition:color 0.2s;}
.nav-link:hover{color:var(--text);}
.nav-cta{font-size:12px;font-weight:600;background:transparent;border:1px solid var(--borderB);color:var(--teal);padding:8px 22px;border-radius:100px;cursor:pointer;transition:all 0.25s;}
.nav-cta:hover{background:var(--teal);color:#fff;}

.hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;padding:80px 24px 60px;}
.hero-orb-a{position:absolute;width:700px;height:700px;top:-200px;left:-200px;border-radius:50%;filter:blur(120px);background:radial-gradient(circle,rgba(0,122,97,0.10),transparent 65%);pointer-events:none;}
.hero-orb-b{position:absolute;width:500px;height:500px;bottom:-100px;right:-100px;border-radius:50%;filter:blur(120px);background:radial-gradient(circle,rgba(26,86,219,0.07),transparent 65%);pointer-events:none;}
.hero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(0,122,97,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(0,122,97,0.06) 1px,transparent 1px);background-size:64px 64px;}
.hero-eyebrow{font-family:var(--fmono);font-size:11px;letter-spacing:0.18em;color:var(--teal);text-transform:uppercase;margin-bottom:28px;display:flex;align-items:center;gap:10px;opacity:0;}
.hero-eyebrow span{height:1px;width:28px;background:var(--teal);opacity:0.5;display:block;}
.hero-title{font-family:var(--fdisp);font-size:clamp(44px,7vw,88px);font-weight:400;text-align:center;line-height:1.05;color:var(--text);max-width:880px;opacity:0;}
.hero-title em{font-style:italic;color:var(--teal);}
.hero-sub{font-size:16px;color:var(--sub);text-align:center;max-width:480px;line-height:1.75;margin-top:24px;margin-bottom:40px;opacity:0;font-weight:300;}
.hero-actions{display:flex;gap:14px;align-items:center;opacity:0;}
.btn-primary{font-size:13px;font-weight:600;background:var(--teal);color:#fff;border:none;padding:14px 32px;border-radius:100px;cursor:pointer;transition:all 0.3s;box-shadow:0 4px 24px rgba(0,122,97,0.22);}
.btn-primary:hover{background:var(--teal2);transform:translateY(-2px);}
.btn-ghost{font-size:13px;color:var(--sub);background:none;border:1px solid var(--border);padding:13px 28px;border-radius:100px;cursor:pointer;transition:all 0.25s;}
.btn-ghost:hover{border-color:var(--borderB);color:var(--text);}

.marquee-wrap{padding:20px 0;overflow:hidden;border-top:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--bg);}
.marquee-track{display:flex;animation:marquee 22s linear infinite;width:max-content;}
.marquee-item{display:flex;align-items:center;gap:10px;padding:0 36px;font-family:var(--fmono);font-size:10px;letter-spacing:0.14em;color:var(--muted);text-transform:uppercase;white-space:nowrap;}
.marquee-dot{width:4px;height:4px;border-radius:50%;background:var(--teal);opacity:0.5;}
@keyframes marquee{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}

/* ORBITAL SECTION */
.orbital-section{padding:100px 40px;position:relative;z-index:2;overflow:hidden;background:linear-gradient(180deg,#f4f7f5 0%,#edf3f0 100%);}
.orbital-inner{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;}
@media(max-width:900px){.orbital-inner{grid-template-columns:1fr;}.orbital-img-col{order:-1;}}
.orbital-img-col{position:relative;display:flex;align-items:center;justify-content:center;opacity:0;transform:scale(0.88) translateX(30px);transition:opacity 0.9s 0.2s ease,transform 0.9s 0.2s ease;}
.orbital-img-wrap{position:relative;width:100%;max-width:520px;}
.orbital-img{width:100%;border-radius:24px;box-shadow:0 4px 12px rgba(0,122,97,0.08),0 20px 60px rgba(0,122,97,0.14);display:block;position:relative;z-index:2;}
.orbital-glow{position:absolute;inset:-20px;border-radius:40px;background:radial-gradient(ellipse at 50% 50%,rgba(245,200,66,0.18),rgba(0,122,97,0.08) 55%,transparent 75%);filter:blur(24px);z-index:1;animation:glowPulse 3s ease-in-out infinite;}
@keyframes glowPulse{0%,100%{opacity:0.7;transform:scale(1);}50%{opacity:1;transform:scale(1.04);}}
.orbital-badge{position:absolute;bottom:-16px;right:-16px;z-index:3;background:#fff;border:1px solid rgba(0,122,97,0.20);border-radius:14px;padding:12px 18px;box-shadow:0 8px 28px rgba(0,122,97,0.14);display:flex;align-items:center;gap:10px;opacity:0;transform:translateY(8px);transition:opacity 0.6s 0.8s ease,transform 0.6s 0.8s ease;animation:badgeFloat 4s ease-in-out infinite 1.5s;}
@keyframes badgeFloat{0%,100%{transform:translateY(0px);}50%{transform:translateY(-6px);}}
.orbital-pill{position:absolute;top:-12px;left:-12px;z-index:3;background:rgba(245,200,66,0.15);border:1px solid rgba(245,200,66,0.4);border-radius:100px;padding:6px 14px;font-family:var(--fmono);font-size:10px;color:var(--gold);letter-spacing:0.08em;opacity:0;transition:opacity 0.6s 1s ease;animation:pillFloat 3.5s ease-in-out infinite 2s;}
@keyframes pillFloat{0%,100%{transform:translateY(0px) rotate(-1deg);}50%{transform:translateY(-5px) rotate(1deg);}}
.bdot{width:8px;height:8px;border-radius:50%;background:var(--teal);animation:bdotBlink 1.5s ease-in-out infinite;}
@keyframes bdotBlink{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.4;transform:scale(0.7);}}
.orbital-text .sect-eyebrow{font-family:var(--fmono);font-size:10px;letter-spacing:0.16em;color:var(--teal);text-transform:uppercase;margin-bottom:16px;}
.orbital-text .sect-title{font-family:var(--fdisp);font-size:clamp(32px,4vw,52px);line-height:1.1;color:var(--text);margin-bottom:16px;opacity:0;transition:opacity 0.7s 0.1s ease,transform 0.7s 0.1s ease;transform:translateY(20px);}
.orbital-text .sect-title em{font-style:italic;color:var(--teal);}
.orbital-text .sect-sub{font-size:15px;color:var(--sub);max-width:440px;line-height:1.7;margin-bottom:36px;font-weight:300;opacity:0;transition:opacity 0.7s 0.2s ease,transform 0.7s 0.2s ease;transform:translateY(20px);}
.agent-feature{display:flex;gap:12px;align-items:flex-start;margin-bottom:14px;opacity:0;transform:translateX(-20px);transition:opacity 0.5s ease,transform 0.5s ease;}
.agent-feature:hover .agent-icon{transform:scale(1.15);box-shadow:0 4px 14px rgba(0,122,97,0.20);}
.agent-icon{width:34px;height:34px;border-radius:8px;background:rgba(0,122,97,0.08);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;transition:transform 0.3s,box-shadow 0.3s;}
.agent-label{font-family:var(--fmono);font-size:10px;font-weight:500;color:var(--teal);letter-spacing:0.07em;margin-bottom:2px;text-transform:uppercase;}
.agent-desc{font-size:12px;color:var(--sub);line-height:1.6;}
.orbital-section.in-view .orbital-img-col{opacity:1;transform:scale(1) translateX(0);}
.orbital-section.in-view .orbital-badge{opacity:1;transform:translateY(0);}
.orbital-section.in-view .orbital-pill{opacity:1;}
.orbital-section.in-view .agent-feature{opacity:1;transform:translateX(0);}
.orbital-section.in-view .sect-title,.orbital-section.in-view .sect-sub{opacity:1;transform:translateY(0);}

/* FEATURES */
.feat-section{padding:100px 40px;background:var(--bg);}
.feat-inner{max-width:1200px;margin:0 auto;}
.sect-eyebrow{font-family:var(--fmono);font-size:10px;letter-spacing:0.16em;color:var(--teal);text-transform:uppercase;margin-bottom:16px;}
.sect-title{font-family:var(--fdisp);font-size:clamp(32px,4vw,52px);line-height:1.1;color:var(--text);margin-bottom:12px;}
.sect-title em{font-style:italic;color:var(--teal);}
.sect-sub{font-size:15px;color:var(--sub);max-width:440px;line-height:1.7;margin-bottom:56px;font-weight:300;}
.feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border);}
@media(max-width:900px){.feat-grid{grid-template-columns:1fr;}}
.feat-card{background:var(--bg);padding:32px;transition:background 0.3s;opacity:0;}
.feat-card:hover{background:#e6f0ec;}
.feat-icon{font-size:26px;margin-bottom:16px;display:block;}
.feat-name{font-family:var(--fdisp);font-size:20px;color:var(--text);margin-bottom:8px;}
.feat-desc{font-size:13px;color:var(--sub);line-height:1.7;}
.feat-tag{display:inline-flex;margin-top:14px;font-family:var(--fmono);font-size:9px;letter-spacing:0.1em;color:var(--teal);background:rgba(0,122,97,0.08);border:1px solid rgba(0,122,97,0.18);padding:4px 10px;border-radius:4px;}

/* TESTIMONIALS */
.test-section{padding:100px 40px;background:rgba(0,122,97,0.025);border-top:1px solid var(--border);}
.test-inner{max-width:1100px;margin:0 auto;}
.test-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:56px;}
@media(max-width:900px){.test-grid{grid-template-columns:1fr;}}
.test-card{background:#fff;border:1px solid var(--border);border-radius:16px;padding:28px;opacity:0;transition:transform 0.3s,box-shadow 0.3s;}
.test-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,122,97,0.10);}
.test-quote{font-family:var(--fdisp);font-size:17px;font-style:italic;color:var(--text);line-height:1.6;margin-bottom:20px;}
.test-author{display:flex;align-items:center;gap:12px;}
.test-avatar{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--fdisp);font-size:13px;color:#fff;}
.test-name{font-size:13px;font-weight:600;color:var(--text);}
.test-role{font-size:11px;color:var(--sub);}

/* INPUT SECTION */
.input-section{padding:100px 40px;background:var(--bg);border-top:1px solid var(--border);}
.input-inner{max-width:800px;margin:0 auto;}
.input-box{background:#fff;border:1px solid var(--border);border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,122,97,0.08);opacity:0;}
.input-box::before{content:'';display:block;height:1px;background:linear-gradient(90deg,transparent,var(--teal),var(--blue),var(--pink),transparent);}
.input-top{display:flex;align-items:center;justify-content:space-between;padding:12px 20px;border-bottom:1px solid var(--border);}
.input-lbl{font-family:var(--fmono);font-size:9px;letter-spacing:0.13em;color:var(--muted);text-transform:uppercase;}
.input-macs{display:flex;gap:5px;}
.input-mac{width:9px;height:9px;border-radius:50%;}
textarea.input-ta{width:100%;background:transparent;border:none;outline:none;resize:none;color:var(--text);font-size:15px;line-height:1.75;padding:20px 24px;caret-color:var(--teal);font-family:var(--fbody);font-weight:300;}
textarea.input-ta::placeholder{color:var(--muted);}
.input-examples{padding:10px 20px;display:flex;gap:8px;flex-wrap:wrap;border-top:1px solid var(--border);border-bottom:1px solid var(--border);}
.input-ex-lbl{font-family:var(--fmono);font-size:9px;color:var(--muted);align-self:center;flex-shrink:0;}
.input-ex{background:transparent;border:1px solid var(--border);color:var(--sub);font-size:11px;padding:4px 12px;border-radius:100px;cursor:pointer;transition:all 0.2s;}
.input-ex:hover{border-color:var(--borderB);color:var(--teal);}
.input-footer{display:flex;align-items:center;justify-content:space-between;padding:12px 20px;}
.input-count{font-family:var(--fmono);font-size:9px;color:var(--muted);}
.input-submit{display:flex;align-items:center;gap:8px;background:var(--teal);border:none;color:#fff;font-weight:600;font-size:12px;padding:10px 22px;border-radius:100px;cursor:pointer;transition:all 0.3s;}
.input-submit:hover:not(:disabled){background:var(--teal2);}
.input-submit:disabled{opacity:0.35;cursor:not-allowed;}

/* FOOTER */
.footer{padding:36px 40px;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;background:var(--bg);}
.footer-logo{font-family:var(--fdisp);font-size:16px;color:var(--sub);}
.footer-logo em{color:var(--teal);font-style:italic;}
.footer-copy{font-family:var(--fmono);font-size:9px;color:var(--muted);}

/* ══════════════════════ ANALYZING ══════════════════════ */
.anpage{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 24px;background:var(--bg);}
.ancore{width:110px;height:110px;position:relative;margin-bottom:28px;}
.anring{position:absolute;border-radius:50%;border:1.5px solid transparent;animation:spinR 2s linear infinite;}
.ar1{inset:0;border-top-color:var(--teal);}
.ar2{inset:14px;border-right-color:var(--blue);animation-duration:1.4s;animation-direction:reverse;}
.ar3{inset:28px;border-bottom-color:var(--pink);animation-duration:2.2s;}
.ar4{inset:42px;border-left-color:var(--gold);animation-duration:1.7s;animation-direction:reverse;}
.arctr{position:absolute;inset:50px;border-radius:50%;background:var(--teal);opacity:0.3;animation:cP 1.5s ease-in-out infinite;}
@keyframes spinR{to{transform:rotate(360deg);}}
@keyframes cP{0%,100%{transform:scale(1);}50%{transform:scale(1.5);opacity:0.6;}}
.antitle{font-family:var(--fdisp);font-size:24px;font-style:italic;color:var(--text);margin-bottom:8px;}
.anidea{font-size:13px;color:var(--sub);margin-bottom:28px;text-align:center;max-width:480px;line-height:1.6;}
.slist{width:100%;max-width:440px;display:flex;flex-direction:column;gap:8px;}
.sitem{display:flex;align-items:center;gap:12px;padding:12px 16px;background:#fff;border:1px solid var(--border);border-radius:10px;transition:all 0.3s;}
.sitem.active{border-color:var(--borderB);background:rgba(0,122,97,0.04);}
.sitem.done{opacity:0.45;}
.sico{width:30px;height:30px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:14px;background:var(--bg);border:1px solid var(--border);flex-shrink:0;}
.slbl{font-size:13px;font-weight:500;color:var(--sub);}
.sitem.active .slbl{color:var(--text);}
.sdesc{font-family:var(--fmono);font-size:9px;color:var(--muted);}
.sok{margin-left:auto;color:var(--teal);font-family:var(--fmono);font-size:10px;}
.sspin{margin-left:auto;width:14px;height:14px;border-radius:50%;border:1.5px solid rgba(0,122,97,0.15);border-top-color:var(--teal);animation:spinR 0.8s linear infinite;}
.skel{background:linear-gradient(90deg,rgba(0,122,97,0.04) 0%,rgba(0,122,97,0.09) 50%,rgba(0,122,97,0.04) 100%);background-size:200% 100%;animation:skA 1.5s ease-in-out infinite;border-radius:10px;}
@keyframes skA{0%{background-position:200% center;}100%{background-position:-200% center;}}

/* ══════════════════════ DASHBOARD RESULTS ══════════════════════ */
.db-wrap{display:flex;min-height:100vh;background:linear-gradient(135deg,#e8f5f0 0%,#f0f7f4 40%,#eaf2f8 100%);font-family:var(--fbody);}

/* SIDEBAR — light glass */
.db-sidebar{
  width:236px;flex-shrink:0;
  background:rgba(255,255,255,0.72);
  backdrop-filter:blur(24px);
  -webkit-backdrop-filter:blur(24px);
  border-right:1px solid rgba(0,122,97,0.12);
  display:flex;flex-direction:column;
  position:fixed;top:0;left:0;bottom:0;z-index:100;
  box-shadow:4px 0 24px rgba(0,122,97,0.06);
}
.db-sidebar-logo{
  padding:22px 22px 18px;
  border-bottom:1px solid rgba(0,122,97,0.10);
  background:linear-gradient(135deg,rgba(0,122,97,0.08),rgba(26,86,219,0.04));
}
.db-sidebar-logo-text{font-family:var(--fdisp);font-size:20px;color:var(--text);}
.db-sidebar-logo-text em{color:var(--teal);font-style:italic;}
.db-sidebar-logo-sub{font-family:var(--fmono);font-size:9px;color:var(--muted);letter-spacing:0.1em;text-transform:uppercase;margin-top:4px;}
.db-nav{padding:14px 10px;flex:1;overflow-y:auto;}
.db-nav-section{font-family:var(--fmono);font-size:9px;color:var(--muted);letter-spacing:0.12em;text-transform:uppercase;padding:8px 12px 4px;margin-top:8px;}
.db-nav-item{
  display:flex;align-items:center;gap:10px;
  padding:10px 12px;border-radius:10px;cursor:pointer;
  transition:all 0.2s;
  color:var(--sub);font-size:13px;font-weight:400;
  border:none;background:none;width:100%;text-align:left;
}
.db-nav-item:hover{background:rgba(0,122,97,0.07);color:var(--text);}
.db-nav-item.active{
  background:linear-gradient(135deg,rgba(0,122,97,0.12),rgba(0,122,97,0.06));
  color:var(--teal);
  border:1px solid rgba(0,122,97,0.15);
  font-weight:500;
}
.db-nav-item .ni{font-size:15px;width:20px;text-align:center;flex-shrink:0;}
.db-nav-badge{margin-left:auto;background:rgba(0,122,97,0.10);color:var(--teal);font-family:var(--fmono);font-size:9px;padding:2px 7px;border-radius:100px;}
.db-sidebar-footer{padding:14px 18px 18px;border-top:1px solid rgba(0,122,97,0.10);}
.db-sidebar-score{
  background:linear-gradient(135deg,rgba(0,122,97,0.10),rgba(26,86,219,0.06));
  border:1px solid rgba(0,122,97,0.18);
  border-radius:14px;padding:14px 16px;
}
.db-sidebar-score-label{font-family:var(--fmono);font-size:9px;color:var(--muted);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px;}
.db-sidebar-score-val{font-family:var(--fdisp);font-size:30px;font-style:italic;color:var(--teal);line-height:1;}
.db-sidebar-score-sub{font-size:11px;color:var(--sub);margin-top:4px;}
.db-sidebar-score-bar{height:3px;background:rgba(0,122,97,0.12);border-radius:3px;margin-top:10px;overflow:hidden;}
.db-sidebar-score-fill{height:100%;background:linear-gradient(90deg,var(--teal),#1a56db);border-radius:3px;transition:width 2s cubic-bezier(.4,0,.2,1);}
.db-new-btn{width:100%;display:flex;align-items:center;justify-content:center;gap:8px;background:rgba(0,122,97,0.08);border:1px solid rgba(0,122,97,0.20);color:var(--teal);font-size:12px;font-weight:600;padding:10px;border-radius:10px;cursor:pointer;transition:all 0.2s;margin-bottom:12px;}
.db-new-btn:hover{background:rgba(0,122,97,0.15);}

/* MAIN CONTENT */
.db-main{margin-left:236px;flex:1;display:flex;flex-direction:column;min-height:100vh;}

/* TOPBAR — glass with animation */
.db-topbar{
  background:rgba(255,255,255,0.75);
  backdrop-filter:blur(20px);
  -webkit-backdrop-filter:blur(20px);
  border-bottom:1px solid rgba(0,122,97,0.10);
  padding:0 28px;height:64px;
  display:flex;align-items:center;justify-content:space-between;
  position:sticky;top:0;z-index:50;
  box-shadow:0 2px 12px rgba(0,122,97,0.06);
  animation:topbarSlide 0.5s ease both;
}
@keyframes topbarSlide{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);}}
.db-topbar-left{display:flex;flex-direction:column;gap:2px;}
.db-topbar-title{
  font-family:var(--fdisp);font-size:20px;font-style:italic;color:var(--text);
  animation:titleFade 0.6s 0.1s ease both;
}
.db-topbar-breadcrumb{font-family:var(--fmono);font-size:9px;color:var(--muted);letter-spacing:0.08em;animation:titleFade 0.6s 0.2s ease both;}
@keyframes titleFade{from{opacity:0;transform:translateX(-10px);}to{opacity:1;transform:translateX(0);}}
.db-topbar-right{display:flex;align-items:center;gap:10px;animation:titleFade2 0.6s 0.2s ease both;}
@keyframes titleFade2{from{opacity:0;transform:translateX(10px);}to{opacity:1;transform:translateX(0);}}
.db-badge{display:inline-flex;align-items:center;gap:5px;padding:5px 13px;border-radius:100px;font-family:var(--fmono);font-size:10px;font-weight:500;}
.db-badge.green{background:rgba(0,122,97,0.10);color:var(--teal);border:1px solid rgba(0,122,97,0.20);}
.db-badge.amber{background:rgba(196,122,0,0.10);color:var(--gold);border:1px solid rgba(196,122,0,0.20);}
.db-badge.red{background:rgba(214,0,78,0.08);color:var(--pink);border:1px solid rgba(214,0,78,0.18);}
.db-badge .badge-dot{width:6px;height:6px;border-radius:50%;animation:bdotBlink 2s infinite;}
.db-badge.green .badge-dot{background:var(--teal);}
.db-badge.amber .badge-dot{background:var(--gold);}
.db-content{padding:24px 28px 40px;flex:1;}

/* ── GLASS CARD ── */
.db-card{
  background:rgba(255,255,255,0.82);
  backdrop-filter:blur(16px);
  -webkit-backdrop-filter:blur(16px);
  border:1px solid rgba(255,255,255,0.9);
  border-radius:16px;overflow:hidden;
  box-shadow:0 2px 8px rgba(0,122,97,0.05),0 8px 24px rgba(0,122,97,0.06);
  transition:transform 0.25s,box-shadow 0.25s;
}
.db-card:hover{transform:translateY(-2px);box-shadow:0 4px 16px rgba(0,122,97,0.10),0 16px 40px rgba(0,122,97,0.08);}
.db-card-header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid rgba(0,122,97,0.08);background:rgba(255,255,255,0.5);}
.db-card-title{font-family:var(--fdisp);font-size:15px;font-style:italic;color:var(--text);}
.db-card-sub{font-family:var(--fmono);font-size:9px;color:var(--muted);margin-top:2px;}
.db-card-body{padding:20px;}

/* ── GLASS STAT CARD ── */
.db-stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:22px;}
.db-stat-card{
  background:rgba(255,255,255,0.82);
  backdrop-filter:blur(16px);
  -webkit-backdrop-filter:blur(16px);
  border:1px solid rgba(255,255,255,0.9);
  border-radius:16px;padding:18px 20px;
  box-shadow:0 2px 8px rgba(0,122,97,0.05),0 6px 20px rgba(0,122,97,0.05);
  transition:transform 0.25s,box-shadow 0.25s;
  cursor:default;
  animation:cardPop 0.5s ease both;
}
.db-stat-card:hover{transform:translateY(-3px);box-shadow:0 8px 28px rgba(0,122,97,0.12);}
@keyframes cardPop{from{opacity:0;transform:translateY(16px) scale(0.97);}to{opacity:1;transform:translateY(0) scale(1);}}
.db-stat-card:nth-child(1){animation-delay:0.05s;}
.db-stat-card:nth-child(2){animation-delay:0.10s;}
.db-stat-card:nth-child(3){animation-delay:0.15s;}
.db-stat-card:nth-child(4){animation-delay:0.20s;}
.db-stat-card:nth-child(5){animation-delay:0.25s;}
.db-stat-card:nth-child(6){animation-delay:0.30s;}
.db-stat-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px;}
.db-stat-icon{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;}
.db-stat-label{font-family:var(--fmono);font-size:9px;letter-spacing:0.1em;color:var(--muted);text-transform:uppercase;margin-bottom:4px;}
.db-stat-value{font-family:var(--fdisp);font-size:26px;font-style:italic;color:var(--text);line-height:1;margin-bottom:6px;}
.db-stat-change{display:inline-flex;align-items:center;gap:4px;font-family:var(--fmono);font-size:10px;padding:2px 8px;border-radius:100px;}
.db-stat-change.up{background:rgba(0,122,97,0.10);color:var(--teal);}
.db-stat-change.down{background:rgba(214,0,78,0.08);color:var(--pink);}
.db-stat-bar{height:3px;background:rgba(0,122,97,0.08);border-radius:3px;margin-top:10px;overflow:hidden;}
.db-stat-bar-fill{height:100%;border-radius:3px;transition:width 1.8s cubic-bezier(.4,0,.2,1);}

/* ── SKELETON LOADER ── */
.db-skeleton{
  background:linear-gradient(90deg,rgba(0,122,97,0.06) 0%,rgba(0,122,97,0.12) 50%,rgba(0,122,97,0.06) 100%);
  background-size:200% 100%;
  animation:shimmer 1.6s ease-in-out infinite;
  border-radius:10px;
}
@keyframes shimmer{0%{background-position:200% center;}100%{background-position:-200% center;}}
.db-skel-card{background:rgba(255,255,255,0.6);border:1px solid rgba(255,255,255,0.8);border-radius:16px;padding:18px;overflow:hidden;}
.db-skel-row{display:flex;gap:14px;margin-bottom:14px;}

/* GRID */
.db-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:22px;}
.db-grid-3{display:grid;grid-template-columns:2fr 1fr;gap:14px;margin-bottom:22px;}
@media(max-width:1100px){.db-grid-2,.db-grid-3{grid-template-columns:1fr;}}

/* SCORE RING */
.db-score-ring-wrap{display:flex;align-items:center;gap:24px;padding:20px;}
.ring-label{font-family:var(--fmono);font-size:9px;color:var(--muted);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:4px;}
.ring-val{font-family:var(--fdisp);font-size:28px;font-style:italic;color:var(--teal);}
.ring-sub{font-size:12px;color:var(--sub);margin-top:2px;}

/* DIM BARS */
.dim-row{display:flex;align-items:center;gap:10px;margin-bottom:10px;}
.dim-label{font-family:var(--fmono);font-size:9px;color:var(--muted);width:70px;flex-shrink:0;text-transform:uppercase;}
.dim-track{flex:1;height:6px;background:rgba(0,122,97,0.08);border-radius:3px;overflow:hidden;}
.dim-fill{height:100%;border-radius:3px;transition:width 1.8s cubic-bezier(.4,0,.2,1);}
.dim-val{font-family:var(--fdisp);font-size:13px;font-style:italic;width:30px;text-align:right;flex-shrink:0;}

/* SWOT */
.swot-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:16px;}
.swot-cell{border-radius:10px;padding:14px;}
.swot-cell-title{font-family:var(--fmono);font-size:9px;font-weight:500;letter-spacing:0.07em;text-transform:uppercase;margin-bottom:8px;}
.swot-item{display:flex;gap:6px;align-items:flex-start;font-size:11px;color:var(--sub);margin-bottom:5px;line-height:1.5;}
.swot-dot{width:4px;height:4px;border-radius:50%;flex-shrink:0;margin-top:4px;}

/* COMPETITOR TABLE */
.comp-table-header{display:grid;grid-template-columns:1fr auto auto;padding:8px 16px;font-family:var(--fmono);font-size:9px;color:var(--muted);letter-spacing:0.08em;text-transform:uppercase;border-bottom:1px solid rgba(0,122,97,0.08);}
.comp-row{display:grid;grid-template-columns:1fr auto auto;padding:12px 16px;border-bottom:1px solid rgba(0,122,97,0.05);align-items:center;transition:background 0.2s;}
.comp-row:last-child{border-bottom:none;}
.comp-row:hover{background:rgba(0,122,97,0.04);}
.comp-name{font-size:13px;font-weight:500;color:var(--text);}
.comp-type{font-family:var(--fmono);font-size:9px;padding:3px 8px;border-radius:100px;}
.comp-type.direct{background:rgba(214,0,78,0.08);color:var(--pink);}
.comp-type.indirect{background:rgba(0,122,97,0.08);color:var(--teal);}

/* RISK */
.risk-list{display:flex;flex-direction:column;gap:10px;padding:16px 20px;}
.risk-item{display:flex;gap:10px;align-items:flex-start;padding:12px 14px;border-radius:10px;font-size:13px;color:var(--sub);line-height:1.5;}
.risk-item.challenge{background:rgba(214,0,78,0.05);border:1px solid rgba(214,0,78,0.12);}
.risk-item.strategy{background:rgba(0,122,97,0.05);border:1px solid rgba(0,122,97,0.12);}
.risk-icon{font-size:14px;flex-shrink:0;margin-top:1px;}

/* MARKET */
.mkt-pill{display:inline-flex;padding:6px 14px;border-radius:100px;font-size:12px;margin:4px;}
.insight-box{background:linear-gradient(135deg,rgba(0,122,97,0.06),rgba(26,86,219,0.04));border:1px solid rgba(0,122,97,0.14);border-radius:12px;padding:16px;margin-top:16px;}
.insight-label{font-family:var(--fmono);font-size:9px;color:var(--teal);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px;}
.insight-text{font-size:13px;color:var(--sub);line-height:1.65;}

/* SCORE DETAIL */
.score-detail-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:16px 20px;}
.score-detail-card{background:rgba(0,122,97,0.04);border:1px solid rgba(0,122,97,0.10);border-radius:10px;padding:14px;text-align:center;}
.score-detail-val{font-family:var(--fdisp);font-size:26px;font-style:italic;line-height:1;margin-bottom:4px;}
.score-detail-label{font-family:var(--fmono);font-size:9px;color:var(--muted);letter-spacing:0.08em;text-transform:uppercase;}
.score-detail-bar{height:3px;border-radius:3px;margin-top:8px;overflow:hidden;background:rgba(0,122,97,0.1);}
.score-detail-fill{height:100%;border-radius:3px;transition:width 1.8s cubic-bezier(.4,0,.2,1);}

canvas{display:block;width:100%;}

/* STAT CARDS ROW */
.db-stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px;}
.db-stat-card{background:#fff;border:1px solid var(--border);border-radius:14px;padding:18px 20px;transition:transform 0.2s,box-shadow 0.2s;}
.db-stat-card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,122,97,0.10);}
.db-stat-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
.db-stat-icon{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;}
.db-stat-label{font-family:var(--fmono);font-size:9px;letter-spacing:0.1em;color:var(--muted);text-transform:uppercase;margin-bottom:4px;}
.db-stat-value{font-family:var(--fdisp);font-size:24px;font-style:italic;color:var(--text);line-height:1;margin-bottom:6px;}
.db-stat-change{display:inline-flex;align-items:center;gap:4px;font-family:var(--fmono);font-size:10px;padding:2px 8px;border-radius:100px;}
.db-stat-change.up{background:rgba(0,122,97,0.10);color:var(--teal);}
.db-stat-change.down{background:rgba(214,0,78,0.08);color:var(--pink);}
.db-stat-bar{height:3px;background:var(--tealLight);border-radius:3px;margin-top:10px;overflow:hidden;}
.db-stat-bar-fill{height:100%;border-radius:3px;transition:width 1.8s cubic-bezier(.4,0,.2,1);}

/* GRID 2-COL */
.db-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;}
.db-grid-3{display:grid;grid-template-columns:2fr 1fr;gap:16px;margin-bottom:24px;}
@media(max-width:1100px){.db-grid-2,.db-grid-3{grid-template-columns:1fr;}}

/* CARD */
.db-card{background:#fff;border:1px solid var(--border);border-radius:14px;overflow:hidden;}
.db-card-header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--border);}
.db-card-title{font-family:var(--fdisp);font-size:15px;font-style:italic;color:var(--text);}
.db-card-sub{font-family:var(--fmono);font-size:9px;color:var(--muted);letter-spacing:0.08em;margin-top:2px;}
.db-card-body{padding:20px;}

/* SCORE RING */
.db-score-ring-wrap{display:flex;align-items:center;gap:24px;padding:20px;}
.ring-label{font-family:var(--fmono);font-size:9px;color:var(--muted);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:4px;}
.ring-val{font-family:var(--fdisp);font-size:28px;font-style:italic;color:var(--teal);}
.ring-sub{font-size:12px;color:var(--sub);margin-top:2px;}

/* DIMENSION BARS */
.dim-row{display:flex;align-items:center;gap:10px;margin-bottom:10px;}
.dim-label{font-family:var(--fmono);font-size:9px;color:var(--muted);width:70px;flex-shrink:0;text-transform:uppercase;}
.dim-track{flex:1;height:6px;background:var(--tealLight);border-radius:3px;overflow:hidden;}
.dim-fill{height:100%;border-radius:3px;transition:width 1.8s cubic-bezier(.4,0,.2,1);}
.dim-val{font-family:var(--fdisp);font-size:13px;font-style:italic;width:30px;text-align:right;flex-shrink:0;}

/* SWOT GRID */
.swot-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:16px;}
.swot-cell{border-radius:10px;padding:14px;}
.swot-cell-title{font-family:var(--fmono);font-size:9px;font-weight:500;letter-spacing:0.07em;text-transform:uppercase;margin-bottom:8px;}
.swot-item{display:flex;gap:6px;align-items:flex-start;font-size:11px;color:var(--sub);margin-bottom:5px;line-height:1.5;}
.swot-dot{width:4px;height:4px;border-radius:50%;flex-shrink:0;margin-top:4px;}

/* COMPETITORS TABLE */
.comp-table{width:100%;}
.comp-table-header{display:grid;grid-template-columns:1fr auto auto;padding:8px 16px;font-family:var(--fmono);font-size:9px;color:var(--muted);letter-spacing:0.08em;text-transform:uppercase;border-bottom:1px solid var(--border);}
.comp-row{display:grid;grid-template-columns:1fr auto auto;padding:12px 16px;border-bottom:1px solid rgba(0,122,97,0.06);align-items:center;transition:background 0.2s;}
.comp-row:last-child{border-bottom:none;}
.comp-row:hover{background:rgba(0,122,97,0.03);}
.comp-name{font-size:13px;font-weight:500;color:var(--text);}
.comp-type{font-family:var(--fmono);font-size:9px;padding:3px 8px;border-radius:100px;}
.comp-type.direct{background:rgba(214,0,78,0.08);color:var(--pink);}
.comp-type.indirect{background:rgba(0,122,97,0.08);color:var(--teal);}

/* RISK ITEMS */
.risk-list{display:flex;flex-direction:column;gap:10px;padding:16px 20px;}
.risk-item{display:flex;gap:10px;align-items:flex-start;padding:12px 14px;border-radius:10px;font-size:13px;color:var(--sub);line-height:1.5;}
.risk-item.challenge{background:rgba(214,0,78,0.05);border:1px solid rgba(214,0,78,0.12);}
.risk-item.strategy{background:rgba(0,122,97,0.05);border:1px solid rgba(0,122,97,0.12);}
.risk-icon{font-size:14px;flex-shrink:0;margin-top:1px;}

/* MARKET PILLS */
.mkt-pill{display:inline-flex;padding:6px 14px;border-radius:100px;font-size:12px;margin:4px;}

/* INSIGHT BOX */
.insight-box{background:linear-gradient(135deg,rgba(0,122,97,0.06),rgba(26,86,219,0.04));border:1px solid rgba(0,122,97,0.15);border-radius:12px;padding:16px;margin-top:16px;}
.insight-label{font-family:var(--fmono);font-size:9px;color:var(--teal);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px;}
.insight-text{font-size:13px;color:var(--sub);line-height:1.65;}

/* SCORE DETAIL CARDS */
.score-detail-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:16px 20px;}
.score-detail-card{background:var(--bg);border-radius:10px;padding:14px;text-align:center;}
.score-detail-val{font-family:var(--fdisp);font-size:26px;font-style:italic;line-height:1;margin-bottom:4px;}
.score-detail-label{font-family:var(--fmono);font-size:9px;color:var(--muted);letter-spacing:0.08em;text-transform:uppercase;}
.score-detail-bar{height:3px;border-radius:3px;margin-top:8px;overflow:hidden;background:rgba(0,122,97,0.1);}
.score-detail-fill{height:100%;border-radius:3px;transition:width 1.8s cubic-bezier(.4,0,.2,1);}

/* CANVAS */
canvas{display:block;width:100%;}
`

/* ─── CANVAS COMPONENTS ─── */
function Candles({ h = 160 }) {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d'), W = c.parentElement?.offsetWidth || 400
    c.width = W; c.height = h
    const data = []; let price = 100
    for (let i = 0; i < 32; i++) {
      const o = price, ch = (Math.random() - 0.44) * 7, cl = o + ch
      data.push({ open: o, close: cl, high: Math.max(o, cl) + Math.random() * 4, low: Math.min(o, cl) - Math.random() * 3 }); price = cl
    }
    const mn = Math.min(...data.map(d => d.low)), mx = Math.max(...data.map(d => d.high))
    const rng = mx - mn, pad = 10, cw = (W - pad * 2) / data.length
    const ty = v => h - pad - ((v - mn) / rng) * (h - pad * 2 - 20)
    let fr = 0
    const draw = () => {
      ctx.clearRect(0, 0, W, h)
      for (let r = 1; r <= 4; r++) {
        const y = pad + (r / 4) * (h - pad * 2 - 20)
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y)
        ctx.strokeStyle = 'rgba(0,122,97,0.07)'; ctx.lineWidth = 1; ctx.stroke()
      }
      const vis = Math.min(Math.ceil((fr / 50) * data.length), data.length)
      data.slice(0, vis + 1).forEach((d, i) => {
        const x = pad + i * cw + cw * 0.15, bw = cw * 0.7
        const isUp = d.close >= d.open, col = isUp ? '#007a61' : '#d6004e'
        const al = i === vis ? (fr % 50) / 50 : 1
        ctx.globalAlpha = al
        ctx.beginPath(); ctx.moveTo(x + bw / 2, ty(d.high)); ctx.lineTo(x + bw / 2, ty(d.low))
        ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.stroke()
        const top = ty(Math.max(d.open, d.close)), bh = Math.max(2, Math.abs(ty(d.open) - ty(d.close)))
        ctx.fillStyle = col + 'cc'; ctx.fillRect(x, top, bw, bh)
        ctx.globalAlpha = 1
      })
      fr++; if (fr < 50 + data.length) requestAnimationFrame(draw)
    }
    setTimeout(() => requestAnimationFrame(draw), 200)
  }, [])
  return <canvas ref={ref} style={{ width: '100%', height: h }} />
}

function RadarChart({ data, size = 200 }) {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d'); c.width = size; c.height = size
    const cx = size / 2, cy = size / 2, R = size * 0.32, n = data.length
    const angs = data.map((_, i) => -Math.PI / 2 + (2 * Math.PI * i) / n)
    let start = null
    const draw = ts => {
      if (!start) start = ts
      const prog = Math.min((ts - start) / 1400, 1)
      ctx.clearRect(0, 0, size, size)
      for (let r = 1; r <= 5; r++) {
        ctx.beginPath()
        angs.forEach((a, i) => { const x = cx + Math.cos(a) * (R * r / 5), y = cy + Math.sin(a) * (R * r / 5); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y) })
        ctx.closePath(); ctx.strokeStyle = 'rgba(0,122,97,0.12)'; ctx.lineWidth = 1; ctx.setLineDash([2, 4]); ctx.stroke(); ctx.setLineDash([])
      }
      angs.forEach(a => { ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); ctx.strokeStyle = 'rgba(0,122,97,0.08)'; ctx.lineWidth = 1; ctx.stroke() })
      const ease = 1 - Math.pow(1 - prog, 3)
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R)
      g.addColorStop(0, 'rgba(0,210,130,0.25)'); g.addColorStop(1, 'rgba(26,86,219,0.06)')
      ctx.beginPath()
      angs.forEach((a, i) => { const d = (data[i].score / 100) * R * ease, x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d; i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y) })
      ctx.closePath(); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = '#007a61'; ctx.lineWidth = 1.5; ctx.stroke()
      angs.forEach((a, i) => {
        const d = (data[i].score / 100) * R * ease
        const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d
        ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fillStyle = '#007a61'; ctx.fill()
        const lx = cx + Math.cos(a) * (R + 16), ly = cy + Math.sin(a) * (R + 16)
        ctx.font = "8px 'JetBrains Mono',monospace"; ctx.fillStyle = 'rgba(61,96,85,0.8)'; ctx.textAlign = 'center'
        ctx.fillText(data[i].label, lx, ly + 3)
      })
      if (prog < 1) requestAnimationFrame(draw)
    }
    setTimeout(() => requestAnimationFrame(draw), 300)
  }, [data])
  return <canvas ref={ref} style={{ display: 'block', width: '100%', maxWidth: size, margin: '0 auto' }} />
}

function Ring({ score, size = 110, id = 'r', color = '#007a61' }) {
  const stroke = 9, r = (size - stroke * 2) / 2, circ = 2 * Math.PI * r
  useEffect(() => {
    const el = document.getElementById(`arc-${id}`)
    if (el) setTimeout(() => { el.style.strokeDasharray = `${score / 100 * circ} ${circ}` }, 500)
  }, [score])
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
        <defs>
          <linearGradient id={`g-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} /><stop offset="100%" stopColor="#1a56db" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(0,122,97,0.10)" strokeWidth={stroke} strokeDasharray="3 5" />
        <circle id={`arc-${id}`} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`url(#g-${id})`} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`0 ${circ}`} style={{ transition: 'stroke-dasharray 2s cubic-bezier(.4,0,.2,1)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'var(--fdisp)', fontStyle: 'italic', fontSize: size * 0.22, color, lineHeight: 1 }}>{score}</div>
        <div style={{ fontFamily: 'var(--fmono)', fontSize: 9, color: 'var(--muted)' }}>/100</div>
      </div>
    </div>
  )
}

/* ─── LANDING PAGE ─── */
function LandingPage({ onStart }) {
  const [idea, setIdea] = useState('')
  const navRef = useRef(null), heroEyeRef = useRef(null), heroTitleRef = useRef(null)
  const heroSubRef = useRef(null), heroActRef = useRef(null), orbitalRef = useRef(null)
  const featRef = useRef(null), testRef = useRef(null), inputRef = useRef(null)
  const exs = ['AI tutoring for rural India', 'B2B SaaS for CFO reconciliation', 'Mental health chatbot metro', 'Blockchain land registry India']
  const features = [
    { icon: '🧠', name: 'Idea Intelligence', desc: 'Extracts problem-solution fit, target audience, and innovation quotient.', tag: 'GPT-4 powered' },
    { icon: '📊', name: 'Market Sizing', desc: 'Calculates TAM, SAM, SOM using real sector data and growth trends.', tag: 'Live data' },
    { icon: '🔍', name: 'Competitor Mapping', desc: 'Identifies rivals, builds SWOT matrix, finds whitespace opportunities.', tag: 'Web intelligence' },
    { icon: '⚠️', name: 'Risk Profiling', desc: 'Scores execution risk across 12 dimensions — regulation, tech, timing.', tag: '12 dimensions' },
    { icon: '🪙', name: 'Finance Modeling', desc: 'Projects revenue milestones, break-even, and unit economics.', tag: 'DCF + analogues' },
    { icon: '🏆', name: 'VC Verdict', desc: 'Aggregates all signals into a single investment-readiness score.', tag: 'Investor-grade' },
  ]
  const testimonials = [
    { quote: 'StartIQ flagged a market gap we had completely missed. Pivoted our GTM and raised our seed round 3 months later.', name: 'Aryan Gupta', role: 'Founder, EduLeap · YC S23', color: '#007a61' },
    { quote: 'The competitor analysis alone saved us 2 weeks of research. Found rivals we didn\'t even know existed.', name: 'Priya Nair', role: 'Co-founder, HealthStack · Surge 12', color: '#1a56db' },
    { quote: 'Walked into demo day with a 91/100 StartIQ score. Three investors asked to see it. Closed oversubscribed.', name: 'Rohan Mehta', role: 'CEO, FinFlow · Antler IN', color: '#c47a00' },
  ]

  useGSAP((gsap, ST) => {
    ST.create({ trigger: '.hero', start: 'bottom top', onEnter: () => navRef.current?.classList.add('scrolled'), onLeaveBack: () => navRef.current?.classList.remove('scrolled') })
    const tl = gsap.timeline({ delay: 0.2 })
    tl.fromTo(heroEyeRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.1)
    tl.fromTo(heroTitleRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.0, ease: 'power4.out' }, 0.3)
    tl.fromTo(heroSubRef.current, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0.55)
    tl.fromTo(heroActRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.7)
    if (orbitalRef.current) {
      const el = orbitalRef.current
      gsap.fromTo(el.querySelectorAll('.sect-title,.sect-sub'), { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: el, start: 'top 78%' } })
      ST.create({ trigger: el, start: 'top 80%', onEnter: () => el.classList.add('in-view') })
    }
    if (featRef.current) gsap.fromTo(featRef.current.querySelectorAll('.feat-card'), { opacity: 0, y: 50, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out', stagger: 0.07, scrollTrigger: { trigger: featRef.current, start: 'top 85%' } })
    if (testRef.current) gsap.fromTo(testRef.current.querySelectorAll('.test-card'), { opacity: 0, y: 44 }, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', stagger: 0.14, scrollTrigger: { trigger: testRef.current, start: 'top 82%' } })
    if (inputRef.current) gsap.fromTo(inputRef.current.querySelector('.input-box'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: inputRef.current, start: 'top 80%' } })
    return () => ST.getAll().forEach(t => t.kill())
  }, [])

  return (
    <>
      <nav ref={navRef} className="nav">
        <div className="nav-logo">Start<em>IQ</em></div>
        <div className="nav-links">{['Features', 'How it works', 'Pricing'].map(l => <button key={l} className="nav-link">{l}</button>)}</div>
        <button className="nav-cta">Get started</button>
      </nav>

      <section className="hero">
        <div className="hero-orb-a" /><div className="hero-orb-b" /><div className="hero-grid" />
        <div ref={heroEyeRef} className="hero-eyebrow"><span />6 AI agents · real-time · free<span /></div>
        <h1 ref={heroTitleRef} className="hero-title">Evaluate your startup<br />like a <em>VC partner.</em></h1>
        <p ref={heroSubRef} className="hero-sub">Multi-agent AI dissects your idea across market, competition, finance, and risk — delivering an investor-grade report in under 60 seconds.</p>
        <div ref={heroActRef} className="hero-actions">
          <button className="btn-primary" onClick={() => document.querySelector('.input-section')?.scrollIntoView({ behavior: 'smooth' })}>Analyze my idea →</button>
          <button className="btn-ghost" onClick={() => document.querySelector('.orbital-section')?.scrollIntoView({ behavior: 'smooth' })}>See how it works</button>
        </div>
      </section>

      <div className="marquee-wrap">
        <div className="marquee-track">
          {[...Array(2)].map((_, rep) => ['Idea Scoring', 'Market Sizing', 'Competitor Intel', 'Risk Analysis', 'Finance Modeling', 'VC Verdict', 'TAM · SAM · SOM', 'SWOT Matrix', 'Innovation Index', 'Fundability Score'].map((t, i) => (
            <div key={`${rep}-${i}`} className="marquee-item"><span className="marquee-dot" />{t}</div>
          )))}
        </div>
      </div>

      {/* ORBITAL IMAGE SECTION */}
      <section ref={orbitalRef} className="orbital-section">
        <div className="orbital-inner">
          <div className="orbital-text">
            <div className="sect-eyebrow">How it works</div>
            <h2 className="sect-title">6 agents.<br />One <em>verdict.</em></h2>
            <p className="sect-sub">Each specialized AI agent analyzes a unique dimension of your startup. They converge into a single investor-grade report in under 60 seconds.</p>
            {[
              { icon: '💡', label: 'Idea Agent', desc: 'Extracts problem-solution clarity and innovation score' },
              { icon: '📊', label: 'Market Agent', desc: 'Sizes TAM, SAM, SOM with live sector benchmarks' },
              { icon: '🔍', label: 'Competitor Agent', desc: 'Maps rivals and finds market whitespace' },
              { icon: '⚠️', label: 'SWOT Agent', desc: 'Builds comprehensive strengths & weaknesses matrix' },
              { icon: '💰', label: 'Finance Agent', desc: 'Models revenue, break-even and unit economics' },
              { icon: '🏆', label: 'Final Scoring Agent', desc: 'Aggregates all signals into VC-ready score' },
            ].map((f, i) => (
              <div key={i} className="agent-feature" style={{ transitionDelay: `${0.3 + i * 0.07}s` }}>
                <div className="agent-icon">{f.icon}</div>
                <div><div className="agent-label">{f.label}</div><div className="agent-desc">{f.desc}</div></div>
              </div>
            ))}
          </div>
          <div className="orbital-img-col">
            <div className="orbital-img-wrap">
              <div className="orbital-glow" />
              <img src="/agents.png" alt="6 Agents" className="orbital-img" />
              <div className="orbital-badge">
                <div className="bdot" />
                <div>
                  <div style={{ fontFamily: 'var(--fmono)', fontSize: 9, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Analysis running</div>
                  <div style={{ fontFamily: 'var(--fdisp)', fontSize: 17, fontStyle: 'italic', color: 'var(--teal)', lineHeight: 1 }}>78.7 / 100</div>
                </div>
              </div>
              <div className="orbital-pill">⚡ &lt; 60 seconds</div>
            </div>
          </div>
        </div>
      </section>

      <section ref={featRef} className="feat-section">
        <div className="feat-inner">
          <div className="sect-eyebrow">What we analyze</div>
          <h2 className="sect-title">Six agents.<br />One <em>verdict.</em></h2>
          <p className="sect-sub">Every dimension a VC would scrutinize — evaluated in parallel by specialized AI agents.</p>
          <div className="feat-grid">
            {features.map((f, i) => (
              <div key={i} className="feat-card">
                <span className="feat-icon">{f.icon}</span>
                <div className="feat-name">{f.name}</div>
                <div className="feat-desc">{f.desc}</div>
                <div className="feat-tag">{f.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={testRef} className="test-section">
        <div className="test-inner">
          <div className="sect-eyebrow">Founder stories</div>
          <h2 className="sect-title">Built for <em>founders.</em></h2>
          <div className="test-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="test-card">
                <div className="test-quote">"{t.quote}"</div>
                <div className="test-author">
                  <div className="test-avatar" style={{ background: t.color + '22', color: t.color }}>{t.name.split(' ').map(n => n[0]).join('')}</div>
                  <div><div className="test-name">{t.name}</div><div className="test-role">{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={inputRef} className="input-section">
        <div className="input-inner">
          <div className="sect-eyebrow">Start analyzing</div>
          <h2 className="sect-title" style={{ marginBottom: 8 }}>Paste your idea.<br />Get your <em>report.</em></h2>
          <p style={{ fontSize: 15, color: 'var(--sub)', marginBottom: 32, fontWeight: 300 }}>Describe in plain language — the agents figure out the rest.</p>
          <div className="input-box">
            <div className="input-top">
              <span className="input-lbl">Startup idea input</span>
              <div className="input-macs">
                <span className="input-mac" style={{ background: '#ff5f57' }} />
                <span className="input-mac" style={{ background: '#febc2e' }} />
                <span className="input-mac" style={{ background: '#28c840' }} />
              </div>
            </div>
            <textarea className="input-ta" value={idea} onChange={e => setIdea(e.target.value)} onKeyDown={e => { if (e.ctrlKey && e.key === 'Enter' && idea.trim()) onStart(idea) }} placeholder="Describe your startup idea… e.g. An AI platform helping Class 10 students in rural India get personalized tutoring in vernacular languages at 1/10th the cost of existing solutions" rows={5} maxLength={2000} />
            <div className="input-examples">
              <span className="input-ex-lbl">Try →</span>
              {exs.map((ex, i) => <button key={i} className="input-ex" onClick={() => setIdea(ex)}>{ex}</button>)}
            </div>
            <div className="input-footer">
              <span className="input-count">{idea.length} / 2000</span>
              <button className="input-submit" onClick={() => idea.trim() && onStart(idea)} disabled={!idea.trim()}>
                Analyze Idea
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-logo">Start<em>IQ</em></div>
        <div className="footer-copy">© {new Date().getFullYear()} StartIQ · All rights reserved</div>
      </footer>
    </>
  )
}

/* ─── ANALYZING PAGE ─── */
function Analyzing({ idea }) {
  const [active, setActive] = useState(0)
  const [skel, setSkel] = useState(false)
  const steps = [
    { icon: '💡', label: 'Idea Agent', desc: 'Extracting problem · solution · scores' },
    { icon: '📊', label: 'Market Agent', desc: 'TAM · SAM · SOM & trend analysis' },
    { icon: '🔍', label: 'Competitor Agent', desc: 'Mapping rivals via web intelligence' },
    { icon: '⚠️', label: 'SWOT Agent', desc: 'Strengths · weaknesses · opportunities' },
    { icon: '🪙', label: 'Finance Agent', desc: 'Revenue · break-even · projections' },
    { icon: '🏆', label: 'Final Scorer', desc: 'Aggregating → investment verdict' }
  ]
  useEffect(() => {
    const t = setInterval(() => {
      setActive(p => { if (p < steps.length - 1) return p + 1; clearInterval(t); setTimeout(() => setSkel(true), 600); return p })
    }, 440)
    return () => clearInterval(t)
  }, [])
  if (skel) return (
    <div className="anpage">
      <p style={{ fontFamily: 'var(--fmono)', fontSize: 10, color: 'var(--teal)', letterSpacing: '0.14em', marginBottom: 20 }}>Compiling report…</p>
      <div style={{ width: '100%', maxWidth: 900, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="skel" style={{ height: 140 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
          {[0, 1, 2, 3].map(i => <div key={i} className="skel" style={{ height: 90 }} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="skel" style={{ height: 260 }} /><div className="skel" style={{ height: 260 }} />
        </div>
      </div>
    </div>
  )
  return (
    <div className="anpage">
      <div className="ancore"><div className="anring ar1" /><div className="anring ar2" /><div className="anring ar3" /><div className="anring ar4" /><div className="arctr" /></div>
      <h2 className="antitle">Analyzing…</h2>
      <p className="anidea">"{idea.slice(0, 65)}{idea.length > 65 ? '…' : ''}"</p>
      <div className="slist">
        {steps.map((s, i) => (
          <div key={i} className={`sitem${i < active ? ' done' : i === active ? ' active' : ''}`}>
            <div className="sico">{s.icon}</div>
            <div style={{ flex: 1 }}><div className="slbl">{s.label}</div><div className="sdesc">{s.desc}</div></div>
            {i < active && <span className="sok">✓</span>}
            {i === active && <div className="sspin" />}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── DASHBOARD RESULTS ─── */
const COLORS = { idea: '#007a61', market: '#1a56db', finance: '#c47a00', risk: '#d6004e', competitor: '#6d28d9' }
const NAV_ITEMS = [
  { id: 'overview', icon: '◈', label: 'Overview', badge: null },
  { id: 'idea', icon: '💡', label: 'Idea Analysis', badge: null },
  { id: 'market', icon: '📊', label: 'Market Research', badge: null },
  { id: 'comp', icon: '🔍', label: 'Competitors', badge: null },
  { id: 'risk', icon: '⚠️', label: 'Risk & SWOT', badge: null },
  { id: 'finance', icon: '🪙', label: 'Financials', badge: null },
]

function Results({ result, onReset }) {
  const [tab, setTab] = useState('overview')
  const dims = [
    { label: 'Idea', score: result.idea, color: COLORS.idea },
    { label: 'Market', score: result.market, color: COLORS.market },
    { label: 'Finance', score: result.finance, color: COLORS.finance },
    { label: 'Risk', score: result.risk, color: COLORS.risk },
    { label: 'Competitor', score: result.competitor, color: COLORS.competitor },
  ]
  const radarData = dims.map(d => ({ label: d.label, score: d.score }))

  const PAGE_TITLES = { overview: 'Dashboard Overview', idea: 'Idea Analysis', market: 'Market Research', comp: 'Competitor Analysis', risk: 'Risk & SWOT', finance: 'Financial Model' }
  const [loading, setLoading] = useState(true)
  useEffect(() => { setLoading(true); const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t) }, [tab])

  return (
    <div className="db-wrap">
      {/* SIDEBAR */}
      <aside className="db-sidebar">
        <div className="db-sidebar-logo">
          <div className="db-sidebar-logo-text">Start<em>IQ</em></div>
          <div className="db-sidebar-logo-sub">Startup Analyzer</div>
        </div>
        <nav className="db-nav">
          <div className="db-nav-section">Analysis</div>
          {NAV_ITEMS.map(item => (
            <button key={item.id} className={`db-nav-item${tab === item.id ? ' active' : ''}`} onClick={() => setTab(item.id)}>
              <span className="ni">{item.icon}</span>
              {item.label}
              {item.badge && <span className="db-nav-badge">{item.badge}</span>}
            </button>
          ))}
          <div className="db-nav-section" style={{ marginTop: 16 }}>Actions</div>
          <button className="db-nav-item" onClick={onReset}>
            <span className="ni">＋</span>New Analysis
          </button>
        </nav>
        <div className="db-sidebar-footer">
          <div className="db-sidebar-score">
            <div className="db-sidebar-score-label">Overall Score</div>
            <div className="db-sidebar-score-val">{result.overall_score}</div>
            <div className="db-sidebar-score-sub">{result.rating}</div>
            <div className="db-sidebar-score-bar">
              <div className="db-sidebar-score-fill" style={{ width: `${result.overall_score}%` }} />
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="db-main">
        {/* TOPBAR */}
        <div className="db-topbar" key={tab}>
          <div className="db-topbar-left">
            <div className="db-topbar-title">{PAGE_TITLES[tab]}</div>
            <div className="db-topbar-breadcrumb">StartIQ · Analysis Dashboard</div>
          </div>
          <div className="db-topbar-right">
            <span className="db-badge green"><span className="badge-dot" /> Seed Ready</span>
            <span className="db-badge amber"><span className="badge-dot" /> Medium Risk</span>
            <span style={{ fontFamily: 'var(--fmono)', fontSize: 10, color: 'var(--muted)', padding: '4px 10px', background: 'rgba(0,122,97,0.06)', borderRadius: 100 }}>Score: {result.overall_score}/100</span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="db-content" style={{ animation: 'contentFade 0.4s ease both' }}>
          <style>{`@keyframes contentFade{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}`}</style>

          {/* SKELETON STATE */}
          {loading && (
            <div>
              <div className="db-skel-row">
                {[1,2,3,4].map(i => (
                  <div key={i} className="db-skel-card" style={{ flex: 1 }}>
                    <div className="db-skeleton" style={{ height: 12, width: '60%', marginBottom: 12 }} />
                    <div className="db-skeleton" style={{ height: 28, width: '40%', marginBottom: 10 }} />
                    <div className="db-skeleton" style={{ height: 4, width: '100%' }} />
                  </div>
                ))}
              </div>
              <div className="db-skel-row">
                <div className="db-skel-card" style={{ flex: 2 }}>
                  <div className="db-skeleton" style={{ height: 12, width: '30%', marginBottom: 16 }} />
                  <div className="db-skeleton" style={{ height: 200, width: '100%' }} />
                </div>
                <div className="db-skel-card" style={{ flex: 1 }}>
                  <div className="db-skeleton" style={{ height: 12, width: '50%', marginBottom: 16 }} />
                  <div className="db-skeleton" style={{ height: 200, width: '100%', borderRadius: '50%' }} />
                </div>
              </div>
              <div className="db-skel-card">
                <div className="db-skeleton" style={{ height: 12, width: '25%', marginBottom: 16 }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[1,2,3,4].map(i => <div key={i} className="db-skeleton" style={{ height: 100 }} />)}
                </div>
              </div>
            </div>
          )}

          {!loading && <>

          {/* ── OVERVIEW ── */}
          {tab === 'overview' && <>
            {/* Stat Cards */}
            <div className="db-stats-row">
              {dims.map((d, i) => (
                <div key={i} className="db-stat-card" onClick={() => setTab(NAV_ITEMS[i + 1]?.id || 'overview')} style={{ cursor: 'pointer' }}>
                  <div className="db-stat-header">
                    <div>
                      <div className="db-stat-label">{d.label} Score</div>
                      <div className="db-stat-value" style={{ color: d.color }}>{d.score}</div>
                    </div>
                    <div className="db-stat-icon" style={{ background: d.color + '15' }}>
                      <span style={{ fontSize: 18 }}>{NAV_ITEMS[i + 1]?.icon}</span>
                    </div>
                  </div>
                  <span className="db-stat-change up">↑ Strong</span>
                  <div className="db-stat-bar"><div className="db-stat-bar-fill" style={{ width: `${d.score}%`, background: d.color }} /></div>
                </div>
              ))}
              {/* TAM card */}
              <div className="db-stat-card">
                <div className="db-stat-header">
                  <div>
                    <div className="db-stat-label">Total Market (TAM)</div>
                    <div className="db-stat-value" style={{ color: '#007a61' }}>{result.TAM}</div>
                  </div>
                  <div className="db-stat-icon" style={{ background: 'rgba(0,122,97,0.10)' }}>🌍</div>
                </div>
                <span className="db-stat-change up">↑ +{result.yoy_growth}% YoY</span>
                <div className="db-stat-bar"><div className="db-stat-bar-fill" style={{ width: '88%', background: '#007a61' }} /></div>
              </div>
            </div>

            {/* Analytics + Radar */}
            <div className="db-grid-3">
              <div className="db-card">
                <div className="db-card-header">
                  <div><div className="db-card-title">Market Signal</div><div className="db-card-sub">EdTech price simulation · live</div></div>
                  <span className="db-badge green">▲ Bullish</span>
                </div>
                <Candles h={200} />
                <div style={{ display: 'flex', gap: 0, borderTop: '1px solid var(--border)' }}>
                  {[{ l: 'TAM', v: result.TAM, c: '#007a61' }, { l: 'SAM', v: result.SAM, c: '#1a56db' }, { l: 'SOM', v: result.SOM, c: '#d6004e' }, { l: 'YoY', v: `+${result.yoy_growth}%`, c: '#c47a00' }].map(f => (
                    <div key={f.l} style={{ flex: 1, textAlign: 'center', padding: '12px 0', borderRight: '1px solid var(--border)' }}>
                      <div style={{ fontFamily: 'var(--fmono)', fontSize: 8, color: 'var(--muted)', marginBottom: 3 }}>{f.l}</div>
                      <div style={{ fontFamily: 'var(--fdisp)', fontStyle: 'italic', fontSize: 14, color: f.c }}>{f.v}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="db-card">
                <div className="db-card-header"><div><div className="db-card-title">Strength Radar</div><div className="db-card-sub">Dimensional profile</div></div></div>
                <div style={{ padding: '16px 0' }}>
                  <RadarChart data={radarData} size={200} />
                </div>
                <div style={{ padding: '0 16px 16px' }}>
                  {dims.map((d, i) => (
                    <div key={i} className="dim-row">
                      <div className="dim-label">{d.label}</div>
                      <div className="dim-track"><div className="dim-fill" style={{ width: `${d.score}%`, background: d.color }} /></div>
                      <div className="dim-val" style={{ color: d.color }}>{d.score}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SWOT */}
            <div className="db-card" style={{ marginBottom: 24 }}>
              <div className="db-card-header"><div><div className="db-card-title">Competitive SWOT</div><div className="db-card-sub">AI-generated analysis</div></div></div>
              <div className="swot-grid">
                {[{ t: '💪 Strengths', items: result.swot.strengths, bg: 'rgba(0,122,97,0.06)', border: 'rgba(0,122,97,0.15)', color: '#007a61' },
                  { t: '⚠️ Weaknesses', items: result.swot.weaknesses, bg: 'rgba(214,0,78,0.05)', border: 'rgba(214,0,78,0.15)', color: '#d6004e' },
                  { t: '🚀 Opportunities', items: result.swot.opportunities, bg: 'rgba(26,86,219,0.05)', border: 'rgba(26,86,219,0.15)', color: '#1a56db' },
                  { t: '🔥 Threats', items: result.swot.threats, bg: 'rgba(196,122,0,0.05)', border: 'rgba(196,122,0,0.15)', color: '#c47a00' }
                ].map(q => (
                  <div key={q.t} className="swot-cell" style={{ background: q.bg, border: `1px solid ${q.border}` }}>
                    <div className="swot-cell-title" style={{ color: q.color }}>{q.t}</div>
                    {q.items.map((item, i) => <div key={i} className="swot-item"><div className="swot-dot" style={{ background: q.color }} />{item}</div>)}
                  </div>
                ))}
              </div>
            </div>
          </>}

          {/* ── IDEA ── */}
          {tab === 'idea' && <>
            <div className="db-grid-2" style={{ marginBottom: 24 }}>
              <div className="db-card">
                <div className="db-card-header"><div><div className="db-card-title">Idea Overview</div><div className="db-card-sub">Problem · Solution · Target</div></div></div>
                <div className="db-card-body">
                  {[['Problem Statement', result.problem_statement], ['Proposed Solution', result.solution_summary], ['Target Users', result.target_users]].map(([l, v]) => (
                    <div key={l} style={{ marginBottom: 16 }}>
                      <div style={{ fontFamily: 'var(--fmono)', fontSize: 9, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>{l}</div>
                      <div style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.65 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="db-card">
                <div className="db-card-header"><div><div className="db-card-title">Idea Score</div><div className="db-card-sub">94 / 100</div></div></div>
                <div className="db-score-ring-wrap">
                  <Ring score={result.idea} size={110} id="idea-r" color="#007a61" />
                  <div>
                    <div className="ring-label">Overall Idea</div>
                    <div className="ring-val">{result.idea}/100</div>
                    <div className="ring-sub">Excellent clarity & fit</div>
                  </div>
                </div>
                <div className="score-detail-grid">
                  {[{ l: 'Innovation', v: result.innovation_level, c: '#007a61' }, { l: 'Feasibility', v: result.feasibility_score, c: '#c47a00' }, { l: 'Clarity', v: result.clarity_score, c: '#1a56db' }].map(s => (
                    <div key={s.l} className="score-detail-card">
                      <div className="score-detail-val" style={{ color: s.c }}>{s.v}<span style={{ fontSize: 11, color: 'var(--muted)' }}>/10</span></div>
                      <div className="score-detail-label">{s.l}</div>
                      <div className="score-detail-bar"><div className="score-detail-fill" style={{ width: `${s.v * 10}%`, background: s.c }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>}

          {/* ── MARKET ── */}
          {tab === 'market' && <>
            <div className="db-stats-row" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 24 }}>
              {[{ l: 'Total Market', v: result.TAM, sub: 'TAM', c: '#007a61' }, { l: 'Serviceable', v: result.SAM, sub: 'SAM', c: '#1a56db' }, { l: 'Obtainable', v: result.SOM, sub: 'SOM', c: '#d6004e' }].map(m => (
                <div key={m.l} className="db-stat-card">
                  <div className="db-stat-label">{m.sub} — {m.l}</div>
                  <div className="db-stat-value" style={{ color: m.c, fontSize: 28, marginBottom: 8 }}>{m.v}</div>
                  <span className="db-stat-change up">↑ Growing</span>
                  <div className="db-stat-bar" style={{ marginTop: 10 }}><div className="db-stat-bar-fill" style={{ width: '75%', background: m.c }} /></div>
                </div>
              ))}
            </div>
            <div className="db-grid-2">
              <div className="db-card">
                <div className="db-card-header"><div className="db-card-title">Market Signal</div></div>
                <Candles h={220} />
              </div>
              <div className="db-card">
                <div className="db-card-header"><div><div className="db-card-title">Market Trends</div><div className="db-card-sub">Key drivers & tailwinds</div></div></div>
                <div className="db-card-body">
                  <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 16 }}>
                    {result.market_trends.map((t, i) => (
                      <span key={i} className="mkt-pill" style={{ background: 'rgba(0,122,97,0.08)', border: '1px solid rgba(0,122,97,0.18)', color: 'var(--teal)' }}>{t}</span>
                    ))}
                  </div>
                  <div className="insight-box">
                    <div className="insight-label">Key Insight</div>
                    <div className="insight-text">{result.key_insight}</div>
                  </div>
                </div>
              </div>
            </div>
          </>}

          {/* ── COMPETITORS ── */}
          {tab === 'comp' && <>
            <div className="db-grid-2" style={{ marginBottom: 24 }}>
              <div className="db-card">
                <div className="db-card-header"><div><div className="db-card-title">Competitor Landscape</div><div className="db-card-sub">Direct & indirect rivals</div></div></div>
                <div className="comp-table-header"><span>Name</span><span>Type</span><span></span></div>
                {[...result.direct_competitors.map(n => ({ name: n, type: 'direct' })), ...result.indirect_competitors.map(n => ({ name: n, type: 'indirect' }))].map((c, i) => (
                  <div key={i} className="comp-row">
                    <div className="comp-name">{c.name}</div>
                    <span className={`comp-type ${c.type}`}>{c.type}</span>
                  </div>
                ))}
                <div style={{ padding: '16px', background: 'rgba(0,122,97,0.04)', margin: '12px 16px', borderRadius: 10, border: '1px solid rgba(0,122,97,0.12)' }}>
                  <div style={{ fontFamily: 'var(--fmono)', fontSize: 9, color: 'var(--teal)', marginBottom: 6, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Market Gap</div>
                  <div style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.65 }}>{result.market_gap}</div>
                </div>
              </div>
              <div className="db-card">
                <div className="db-card-header"><div className="db-card-title">Strength Radar</div></div>
                <div style={{ padding: 16 }}><RadarChart data={radarData} size={220} /></div>
              </div>
            </div>
          </>}

          {/* ── RISK ── */}
          {tab === 'risk' && <>
            <div className="db-stats-row" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 24 }}>
              {[{ l: 'Risk Score', v: `${result.risk_score}/10`, sub: 'Lower is safer', c: '#c47a00', bg: 'rgba(196,122,0,0.08)' }, { l: 'Innovation Index', v: `${result.innovation_uniqueness}/10`, sub: 'Uniqueness level', c: '#007a61', bg: 'rgba(0,122,97,0.08)' }, { l: 'Risk Level', v: result.overall_risk_level, sub: 'Overall assessment', c: '#d6004e', bg: 'rgba(214,0,78,0.06)' }].map(s => (
                <div key={s.l} className="db-stat-card" style={{ borderTop: `2px solid ${s.c}` }}>
                  <div className="db-stat-label">{s.l}</div>
                  <div className="db-stat-value" style={{ color: s.c }}>{s.v}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{s.sub}</div>
                </div>
              ))}
            </div>
            <div className="db-grid-2">
              <div className="db-card">
                <div className="db-card-header"><div><div className="db-card-title">Execution Challenges</div><div className="db-card-sub">Key risks to watch</div></div></div>
                <div className="risk-list">
                  {result.execution_challenges.map((ch, i) => (
                    <div key={i} className="risk-item challenge"><span className="risk-icon">→</span>{ch}</div>
                  ))}
                </div>
              </div>
              <div className="db-card">
                <div className="db-card-header"><div><div className="db-card-title">Mitigation Strategies</div><div className="db-card-sub">Recommended actions</div></div></div>
                <div className="risk-list">
                  {result.mitigation_strategies.map((s, i) => (
                    <div key={i} className="risk-item strategy"><span className="risk-icon">✓</span>{s}</div>
                  ))}
                </div>
              </div>
            </div>
            <div className="db-card" style={{ marginTop: 16 }}>
              <div className="db-card-header"><div className="db-card-title">SWOT Matrix</div></div>
              <div className="swot-grid">
                {[{ t: '💪 Strengths', items: result.swot.strengths, bg: 'rgba(0,122,97,0.06)', border: 'rgba(0,122,97,0.15)', color: '#007a61' }, { t: '⚠️ Weaknesses', items: result.swot.weaknesses, bg: 'rgba(214,0,78,0.05)', border: 'rgba(214,0,78,0.15)', color: '#d6004e' }, { t: '🚀 Opportunities', items: result.swot.opportunities, bg: 'rgba(26,86,219,0.05)', border: 'rgba(26,86,219,0.15)', color: '#1a56db' }, { t: '🔥 Threats', items: result.swot.threats, bg: 'rgba(196,122,0,0.05)', border: 'rgba(196,122,0,0.15)', color: '#c47a00' }].map(q => (
                  <div key={q.t} className="swot-cell" style={{ background: q.bg, border: `1px solid ${q.border}` }}>
                    <div className="swot-cell-title" style={{ color: q.color }}>{q.t}</div>
                    {q.items.map((item, i) => <div key={i} className="swot-item"><div className="swot-dot" style={{ background: q.color }} />{item}</div>)}
                  </div>
                ))}
              </div>
            </div>
          </>}

          {/* ── FINANCE ── */}
          {tab === 'finance' && <>
            <div className="db-stats-row" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 24 }}>
              {[{ l: 'Finance Score', v: result.finance, sub: 'Revenue model strength', c: '#c47a00' }, { l: 'Market Growth', v: `${result.yoy_growth}%`, sub: 'India EdTech YoY', c: '#007a61' }, { l: 'SOM Target', v: result.SOM, sub: 'Serviceable obtainable', c: '#1a56db' }].map(s => (
                <div key={s.l} className="db-stat-card">
                  <div className="db-stat-label">{s.l}</div>
                  <div className="db-stat-value" style={{ color: s.c }}>{s.v}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{s.sub}</div>
                  <div className="db-stat-bar" style={{ marginTop: 10 }}><div className="db-stat-bar-fill" style={{ width: typeof s.v === 'number' ? `${s.v}%` : '65%', background: s.c }} /></div>
                </div>
              ))}
            </div>
            <div className="db-card">
              <div className="db-card-header"><div><div className="db-card-title">Market Analysis</div><div className="db-card-sub">Revenue potential simulation</div></div><span className="db-badge green">▲ Bullish</span></div>
              <Candles h={240} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderTop: '1px solid var(--border)' }}>
                {[{ l: 'TAM', v: result.TAM, c: '#007a61' }, { l: 'SAM', v: result.SAM, c: '#1a56db' }, { l: 'SOM', v: result.SOM, c: '#d6004e' }, { l: 'YoY', v: `+${result.yoy_growth}%`, c: '#c47a00' }].map(f => (
                  <div key={f.l} style={{ textAlign: 'center', padding: '14px 0', borderRight: '1px solid var(--border)' }}>
                    <div style={{ fontFamily: 'var(--fmono)', fontSize: 8, color: 'var(--muted)', marginBottom: 4 }}>{f.l}</div>
                    <div style={{ fontFamily: 'var(--fdisp)', fontStyle: 'italic', fontSize: 16, color: f.c }}>{f.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </>}

          </> /* end !loading */}

        </div>
      </main>
    </div>
  )
}

/* ─── ROOT ─── */
export default function App() {
  const [page, setPage] = useState('home')
  const [idea, setIdea] = useState('')
  const [result, setResult] = useState(null)

  async function start(txt) {
    setIdea(txt); setPage('analyzing')
    try {
      const res = await fetch('http://127.0.0.1:8001/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idea: txt }) })
      setResult(await res.json())
    } catch {
      await new Promise(r => setTimeout(r, 4800)); setResult(MOCK)
    }
    setPage('results')
  }
  const reset = () => { setPage('home'); setResult(null); setIdea(''); window.scrollTo(0, 0) }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <style>{CSS}</style>
      {page === 'home' && <LandingPage onStart={start} />}
      {page === 'analyzing' && <Analyzing idea={idea} />}
      {page === 'results' && result && <Results result={result} onReset={reset} />}
    </div>
  )
}