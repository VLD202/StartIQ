import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts'

// ── TOKENS ───────────────────────────────────────────────────────────────────
const G  = '#00f5a8'
const G2 = '#00c47a'
const PK = '#ff5f9e'
const PK2= '#cc3d75'
const MUT= '#7a8899'

const scoreColor = s => s >= 80 ? G : s >= 60 ? '#f0c040' : PK

// ── MOCK DATA ─────────────────────────────────────────────────────────────────
const MOCK = {
  overall_score:78.7, investment_ready:true, rating:'Seed Ready 🌱',
  idea:84, market:76, finance:72, risk:88, competitor:70,
  problem_statement:'Students lack affordable, personalized tutoring that adapts to their individual learning pace and style across different subjects.',
  solution_summary:'An AI-powered tutoring platform with real-time feedback, adaptive lessons, progress tracking, and full vernacular language support.',
  target_users:'Students aged 14–16 in Indian tier-2/3 cities seeking affordable quality education',
  innovation_level:7.5, feasibility_score:8.2, clarity_score:9.0,
  TAM:'$45B — Global EdTech market',
  SAM:'$8B — India online tutoring market',
  SOM:'$500M — AI-personalized tutoring segment',
  market_trends:['AI personalization','Post-COVID learning surge','Vernacular content','Smartphone penetration'],
  growth_potential:'High',
  key_insight:'India EdTech growing at 28% YoY — tier-2/3 cities massively underserved.',
  direct_competitors:["Byju's",'Vedantu','Unacademy','Doubtnut'],
  indirect_competitors:['YouTube tutorials','Khan Academy','WhiteHat Jr'],
  market_gap:'No affordable AI-personalized tutor exists for rural students with vernacular support.',
  swot:{
    strengths:['AI personalization engine','Ultra-low cost model','Vernacular support','Offline-first arch'],
    weaknesses:['High competition','Trust building required','Content creation cost'],
    opportunities:['NEP 2020 digital push','Jio connectivity','EdTech grants'],
    threats:["Byju's massive funding","Free YouTube","Rural internet issues"],
  },
  competitive_advantage:'First mover in affordable AI tutoring for rural India with vernacular support.',
  risk_score:6.4, innovation_uniqueness:8.1,
  execution_challenges:['Content creation at scale','Teacher resistance','Low internet in target areas','Retention month 1'],
  mitigation_strategies:['Partner with local schools','Offline-first PWA','Gamification streaks','Govt school tie-ups'],
  overall_risk_level:'Medium',
  innovation_summary:'Highly innovative — adaptive AI × vernacular education intersection is largely untapped.',
}

const METRICS = [
  { key:'idea',       label:'Idea',       icon:'💡', desc:'Strength & clarity',  ic:'ic-green' },
  { key:'market',     label:'Market',     icon:'📊', desc:'Size & potential',    ic:'ic-pink'  },
  { key:'finance',    label:'Finance',    icon:'💰', desc:'Revenue model',       ic:'ic-green' },
  { key:'risk',       label:'Risk',       icon:'⚠️', desc:'Execution safety',    ic:'ic-pink'  },
  { key:'competitor', label:'Competitor', icon:'🔍', desc:'Market position',     ic:'ic-mix'   },
]

// ── MESH BACKGROUND ───────────────────────────────────────────────────────────
function MeshBg() {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d')
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; draw() }
    function draw() {
      ctx.clearRect(0,0,c.width,c.height)
      const g1 = ctx.createRadialGradient(c.width*.15,c.height*.2,0,c.width*.15,c.height*.2,c.width*.5)
      g1.addColorStop(0,'rgba(0,100,60,0.18)'); g1.addColorStop(1,'transparent')
      ctx.fillStyle=g1; ctx.fillRect(0,0,c.width,c.height)
      const g2 = ctx.createRadialGradient(c.width*.85,c.height*.35,0,c.width*.85,c.height*.35,c.width*.45)
      g2.addColorStop(0,'rgba(80,40,120,0.2)'); g2.addColorStop(1,'transparent')
      ctx.fillStyle=g2; ctx.fillRect(0,0,c.width,c.height)
      const g3 = ctx.createRadialGradient(c.width*.5,c.height*.85,0,c.width*.5,c.height*.85,c.width*.35)
      g3.addColorStop(0,'rgba(150,40,80,0.1)'); g3.addColorStop(1,'transparent')
      ctx.fillStyle=g3; ctx.fillRect(0,0,c.width,c.height)
    }
    resize(); window.addEventListener('resize',resize)
    return () => window.removeEventListener('resize',resize)
  },[])
  return <canvas ref={ref} className="bg-mesh-canvas"/>
}

// ── ANIMATED COUNTER ──────────────────────────────────────────────────────────
function Counter({ to, dur=1500, dec=0 }) {
  const [v,setV] = useState(0)
  useEffect(()=>{
    let s=null,raf
    const step=ts=>{if(!s)s=ts;const p=Math.min((ts-s)/dur,1);setV(+(to*(1-Math.pow(1-p,3))).toFixed(dec));if(p<1)raf=requestAnimationFrame(step)}
    raf=requestAnimationFrame(step)
    return()=>cancelAnimationFrame(raf)
  },[to])
  return <>{v}</>
}

// ── BIG SCORE RING ────────────────────────────────────────────────────────────
function BigRing({ score }) {
  const r=70, circ=2*Math.PI*r
  useEffect(()=>{
    const el = document.getElementById('bigArc')
    if(el) setTimeout(()=>{ el.style.strokeDasharray=`${score/100*circ} ${circ}` },200)
  },[score])
  return (
    <div className="score-ring-wrap">
      <div className="wave"/><div className="wave"/><div className="wave"/>
      <svg width="168" height="168" viewBox="0 0 168 168" style={{transform:'rotate(-90deg)'}}>
        <defs>
          <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={G}/><stop offset="100%" stopColor={PK}/>
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <circle cx="84" cy="84" r={r} fill="none" stroke="rgba(0,245,168,0.06)" strokeWidth="9"/>
        <circle id="bigArc" cx="84" cy="84" r={r} fill="none" stroke="url(#rg)" strokeWidth="9"
          strokeLinecap="round" strokeDasharray={`0 ${circ}`} filter="url(#glow)"
          style={{transition:'stroke-dasharray 2s cubic-bezier(.4,0,.2,1)'}}/>
      </svg>
      <div className="score-center">
        <div className="score-num"><Counter to={score} dec={1}/></div>
        <div className="score-denom">/100</div>
      </div>
    </div>
  )
}

// ── SMALL RING ────────────────────────────────────────────────────────────────
function SmallRing({ score, size=80 }) {
  const r=32, circ=2*Math.PI*r, color=scoreColor(score)
  return (
    <div className="score-ring-sm" style={{width:size,height:size}}>
      <svg style={{position:'absolute',inset:0,transform:'rotate(-90deg)'}} width={size} height={size} viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke={color+'18'} strokeWidth="6"/>
        <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${score/100*circ} ${circ}`}
          style={{transition:'stroke-dasharray 1.5s cubic-bezier(.4,0,.2,1)',filter:`drop-shadow(0 0 8px ${color}66)`}}/>
      </svg>
      <div style={{position:'relative',zIndex:1,display:'flex',flexDirection:'column',alignItems:'center'}}>
        <span style={{fontSize:size*.22,fontWeight:900,color,lineHeight:1}}><Counter to={score}/></span>
        <span style={{fontSize:size*.1,color:MUT,fontFamily:"'DM Mono',monospace"}}>/100</span>
      </div>
    </div>
  )
}

// ── MINI RING (tile) ──────────────────────────────────────────────────────────
function MiniRing({ score, color }) {
  const r=24, circ=2*Math.PI*r
  return (
    <div className="mini-ring-wrap">
      <svg width="60" height="60" viewBox="0 0 60 60" style={{transform:'rotate(-90deg)'}}>
        <circle cx="30" cy="30" r={r} fill="none" stroke={color+'18'} strokeWidth="5"/>
        <circle cx="30" cy="30" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${score/100*circ} ${circ}`}
          style={{transition:'stroke-dasharray 1.4s cubic-bezier(.4,0,.2,1)',filter:`drop-shadow(0 0 5px ${color})`}}/>
      </svg>
      <div className="mini-ring-num" style={{color}}><Counter to={score}/></div>
    </div>
  )
}

// ── RADAR CANVAS ──────────────────────────────────────────────────────────────
function RadarCanvas({ data }) {
  const ref = useRef(null)
  useEffect(()=>{
    const c=ref.current; if(!c)return
    const ctx=c.getContext('2d'), W=300,H=200,cx=W/2,cy=H/2+5,R=72
    const labels=data.map(d=>d.subject), scores=data.map(d=>d.score)
    const ang=labels.map((_,i)=>-Math.PI/2+(2*Math.PI*i)/labels.length)
    let s=null
    function draw(prog){
      ctx.clearRect(0,0,W,H)
      for(let r=1;r<=4;r++){
        ctx.beginPath();ang.forEach((a,i)=>{const x=cx+Math.cos(a)*(R*r/4),y=cy+Math.sin(a)*(R*r/4);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y)});ctx.closePath()
        ctx.strokeStyle='rgba(255,255,255,0.05)';ctx.lineWidth=1;ctx.setLineDash([3,4]);ctx.stroke();ctx.setLineDash([])
      }
      ang.forEach(a=>{ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*R,cy+Math.sin(a)*R);ctx.strokeStyle='rgba(255,255,255,0.04)';ctx.lineWidth=1;ctx.stroke()})
      const g=ctx.createRadialGradient(cx,cy,0,cx,cy,R)
      g.addColorStop(0,'rgba(0,245,168,0.25)');g.addColorStop(0.6,'rgba(0,245,168,0.1)');g.addColorStop(1,'rgba(255,95,158,0.08)')
      ctx.beginPath()
      ang.forEach((a,i)=>{const d=(scores[i]/100)*R*prog,x=cx+Math.cos(a)*d,y=cy+Math.sin(a)*d;i===0?ctx.moveTo(x,y):ctx.lineTo(x,y)})
      ctx.closePath();ctx.fillStyle=g;ctx.fill();ctx.strokeStyle='rgba(0,245,168,0.7)';ctx.lineWidth=1.5;ctx.stroke()
      ang.forEach((a,i)=>{
        const d=(scores[i]/100)*R*prog,x=cx+Math.cos(a)*d,y=cy+Math.sin(a)*d
        const gd=ctx.createRadialGradient(x,y,0,x,y,12);gd.addColorStop(0,'rgba(0,245,168,0.4)');gd.addColorStop(1,'transparent')
        ctx.beginPath();ctx.arc(x,y,12,0,Math.PI*2);ctx.fillStyle=gd;ctx.fill()
        ctx.beginPath();ctx.arc(x,y,3.5,0,Math.PI*2);ctx.fillStyle=G;ctx.shadowColor=G;ctx.shadowBlur=10;ctx.fill();ctx.shadowBlur=0
      })
      ctx.font="10px 'DM Mono',monospace";ctx.fillStyle='rgba(122,136,153,0.85)';ctx.textAlign='center'
      ang.forEach((a,i)=>{const x=cx+Math.cos(a)*(R+18),y=cy+Math.sin(a)*(R+18)+4;ctx.fillText(labels[i],x,y)})
    }
    function anim(ts){if(!s)s=ts;const p=Math.min((ts-s)/1500,1);draw(1-Math.pow(1-p,3));if(p<1)requestAnimationFrame(anim)}
    setTimeout(()=>requestAnimationFrame(anim),400)
  },[data])
  return <canvas ref={ref} width={300} height={200} style={{display:'block',width:'100%'}}/>
}

// ── CUSTOM BAR TOOLTIP ────────────────────────────────────────────────────────
function ChartTip({active,payload,label}){
  if(!active||!payload?.length)return null
  return(
    <div style={{background:'rgba(10,14,26,0.95)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:'10px 14px',backdropFilter:'blur(16px)'}}>
      <p style={{fontSize:10,color:MUT,fontFamily:"'DM Mono',monospace",letterSpacing:'0.1em',marginBottom:4}}>{label}</p>
      <p style={{fontSize:22,fontWeight:900,color:scoreColor(payload[0].value)}}>{payload[0].value}</p>
    </div>
  )
}

// ── TAG ───────────────────────────────────────────────────────────────────────
function Tag({children,v='muted'}){
  return <span className={`tag tag-${v}`}>{children}</span>
}

// ══════════════════════════════════════════════════════════
// LANDING
// ══════════════════════════════════════════════════════════
function LandingPage({onStart}){
  const [idea,setIdea]=useState('')
  const examples=['AI-powered tutoring app for Class 10 students in India','B2B SaaS for automating financial reconciliation for CFOs','Mental health chatbot for working professionals in metro cities','Blockchain-based land registry for rural India']
  return(
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',position:'relative',zIndex:2}}>
      <nav className="landing-nav">
        <div className="logo-wrap" style={{display:'flex',alignItems:'center',gap:10}}>
          <div className="logo-icon">S</div>
          <span className="logo-text">Start<em>IQ</em></span>
        </div>
        <div style={{display:'flex',gap:4}}>
          {['Docs','Pricing','About'].map(l=><button key={l} className="tab-btn">{l}</button>)}
        </div>
        <button className="analyze-btn" style={{padding:'9px 20px',fontSize:13}}>Sign in →</button>
      </nav>
      <div className="hero-wrap">
        <div className="hero-eyebrow"><div className="pulse-dot"/><span>6 AI Agents · Real-time Analysis · Free</span></div>
        <h1 className="hero-title">Evaluate your startup<br/><span className="hero-gradient">like a VC partner.</span></h1>
        <p className="hero-sub">Multi-agent AI dissects your idea across market, competition, finance, and risk — in seconds.</p>
        <div className="input-card">
          <div className="input-header">
            <label className="input-label">Describe your startup idea</label>
            <textarea className="idea-textarea" value={idea} onChange={e=>setIdea(e.target.value)}
              onKeyDown={e=>{if(e.ctrlKey&&e.key==='Enter'&&idea.trim())onStart(idea)}}
              placeholder="e.g. An AI-powered platform that helps Class 10 students get personalized tutoring in vernacular languages at 1/10th the cost…" rows={4}/>
          </div>
          <div className="examples-strip">
            <p className="examples-label">Try an example →</p>
            <div className="example-chips">{examples.map((ex,i)=><button key={i} className="example-chip" onClick={()=>setIdea(ex)}>{ex.length>44?ex.slice(0,44)+'…':ex}</button>)}</div>
          </div>
          <div className="input-footer">
            <span className="char-count">{idea.length} / 2000</span>
            <button className="analyze-btn" onClick={()=>idea.trim()&&onStart(idea)} disabled={!idea.trim()}>
              <span>Analyze Idea</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
        <div className="pipeline-strip">
          {['💡 Idea','📊 Market','🔍 Competitor','⚠️ Risk','💰 Finance','🏆 Score'].map((a,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:8}}>
              <div className="agent-pill">{a}</div>
              {i<5&&<span className="pipeline-arrow">→</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// ANALYZING
// ══════════════════════════════════════════════════════════
function AnalyzingPage({idea}){
  const [active,setActive]=useState(0)
  const [showSkel,setShowSkel]=useState(false)
  const steps=[
    {icon:'💡',label:'Idea Agent',sub:'Extracting problem · solution · scores'},
    {icon:'📊',label:'Market Agent',sub:'TAM · SAM · SOM & real trend data'},
    {icon:'🔍',label:'Competitor Agent',sub:'Mapping rivals via web search'},
    {icon:'⚠️',label:'Risk Agent',sub:'Scoring execution risk & innovation'},
    {icon:'💰',label:'Finance Agent',sub:'Revenue · break-even · projections'},
    {icon:'🏆',label:'Final Scorer',sub:'Aggregating → investment verdict'},
  ]
  useEffect(()=>{
    const t=setInterval(()=>{
      setActive(p=>{if(p<steps.length-1)return p+1;clearInterval(t);setTimeout(()=>setShowSkel(true),500);return p})
    },420)
    return()=>clearInterval(t)
  },[])
  return(
    <div className="analyzing-wrap">
      {!showSkel?(
        <>
          <div className="lottie-wrap"><div className="lottie-ring lr-1"/><div className="lottie-ring lr-2"/><div className="lottie-ring lr-3"/><div className="lr-core"/></div>
          <h2 className="analyzing-title">Analyzing your idea…</h2>
          <p className="analyzing-sub">"{idea.slice(0,65)}{idea.length>65?'…':''}"</p>
          <div className="steps-card">
            {steps.map((s,i)=>(
              <div key={i} className={`pipeline-step${i<=active?' pipeline-active':''}`}>
                <div className={`step-icon-box${i<active?' step-done':i===active?' step-current':''}`}>{s.icon}</div>
                <div style={{flex:1}}>
                  <p className="step-name" style={{color:i<=active?'var(--text)':'var(--muted)'}}>{s.label}</p>
                  <p className="step-sub">{s.sub}</p>
                </div>
                {i<active&&<span className="step-check">✓</span>}
                {i===active&&<div className="micro-spin"/>}
              </div>
            ))}
          </div>
        </>
      ):(
        <div style={{width:'100%',maxWidth:900}}>
          <p style={{textAlign:'center',marginBottom:24,fontSize:13,color:G,fontFamily:"'DM Mono',monospace",letterSpacing:'0.1em',fontWeight:600}}>✦ Building your report…</p>
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            <div className="skeleton" style={{height:200,borderRadius:24}}/>
            <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:12}}>
              {[...Array(5)].map((_,i)=><div key={i} className="skeleton" style={{height:140,borderRadius:18}}/>)}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              <div className="skeleton" style={{height:260,borderRadius:20}}/>
              <div className="skeleton" style={{height:260,borderRadius:20}}/>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// RESULTS
// ══════════════════════════════════════════════════════════
function ResultsPage({result,idea,onReset}){
  const [tab,setTab]=useState('overview')
  const tabs=[{id:'overview',l:'Overview',icon:'🎯'},{id:'idea',l:'Idea',icon:'💡'},{id:'market',l:'Market',icon:'📊'},{id:'competitor',l:'Competitor',icon:'🔍'},{id:'risk',l:'Risk',icon:'⚠️'}]
  const radarData=METRICS.map(m=>({subject:m.label,score:result[m.key]}))
  const barData=METRICS.map(m=>({name:m.label,score:result[m.key]}))

  const tileColors=[G,PK,G2,PK2,G]

  return(
    <div style={{position:'relative',zIndex:2}}>
      {/* FLOATING PILL NAV */}
      <div className="navbar-wrap" style={{paddingTop:16}}>
        <div className="navbar">
          <div className="logo-icon" style={{width:30,height:30,fontSize:12,borderRadius:9}}>S</div>
          <span className="logo-text" style={{fontSize:14}}>Start<em>IQ</em></span>
          <div className="tab-row">
            {tabs.map(t=>(
              <button key={t.id} className={`tab-btn${tab===t.id?' active':''}`} onClick={()=>setTab(t.id)}>
                <span style={{fontSize:13}}>{t.icon}</span> {t.l}
              </button>
            ))}
          </div>
          <button className="new-idea-btn" onClick={onReset}>← New</button>
        </div>
      </div>

      <div className="page">

        {/* ══ OVERVIEW ══════════════════════════════════════════════════════ */}
        {tab==='overview'&&(
          <div className="tab-content">
            {/* Verdict */}
            <div className="verdict-card">
              <div className="verdict-topbar"/>
              <div className="verdict-inner">
                <BigRing score={result.overall_score}/>
                <div className="verdict-right">
                  <div className="verdict-eyebrow">OVERALL VERDICT</div>
                  <div className="verdict-title">{result.rating}</div>
                  <div className="chips-row">
                    <div className="chip-ready"><div className="pulse-dot"/>Investment Ready</div>
                    <div className="chip-score">Score: {result.overall_score}/100</div>
                  </div>
                  <p className="verdict-desc">Strong fundamentals — consider pitching to angel investors or applying to accelerators like YC or Surge.</p>
                </div>
              </div>
            </div>

            {/* Figures */}
            <div className="figures-grid">
              {[
                {icon:'💰',val:'$45B',lbl:'Total Addressable',sub:'Global EdTech Market',color:G,gc:'glass-green'},
                {icon:'📊',val:'$8B', lbl:'Serviceable Market',sub:'India Online Tutoring', color:PK,gc:'glass-pink'},
                {icon:'🎯',val:'$500M',lbl:'Obtainable Market',sub:'AI-personalized',      color:G, gc:'glass-green'},
                {icon:'📈',val:'28%', lbl:'YoY Growth Rate',  sub:'India EdTech Sector',  color:PK,gc:'glass-pink'},
              ].map((f,i)=>(
                <div key={i} className={`figure-card glass ${f.gc} glass-hover${i%2===1?' glass-hover-pink':''}`} style={{animationDelay:`${i*-1.5}s`}}>
                  <span className="fig-icon" style={{color:f.color}}>{f.icon}</span>
                  <div className="fig-val" style={{color:f.color,textShadow:`0 0 20px ${f.color}55`}}>{f.val}</div>
                  <div className="fig-label">{f.lbl}</div>
                  <div className="fig-sub">{f.sub}</div>
                </div>
              ))}
            </div>

            {/* Metric tiles */}
            <div className="tiles-grid">
              {METRICS.map((m,i)=>{
                const color=tileColors[i]
                const gc=i%2===0?'glass-green':'glass-pink'
                const hov=i%2===0?'glass-hover':'glass-hover glass-hover-pink'
                return(
                  <div key={m.key} className={`metric-tile glass ${gc} ${hov} d${i+1}`} style={{position:'relative'}}
                    onClick={()=>setTab(m.key==='competitor'?'competitor':m.key==='risk'?'risk':m.key)}>
                    <div className="tile-topbar" style={{background:`linear-gradient(90deg,${color},transparent)`}}/>
                    <div className={`icon-circle ${m.ic}`}><span style={{fontSize:18}}>{m.icon}</span></div>
                    <MiniRing score={result[m.key]} color={color}/>
                    <div className="tile-label">{m.label}</div>
                    <div className="tile-desc">{m.desc}</div>
                  </div>
                )
              })}
            </div>

            {/* Charts */}
            <div className="charts-grid">
              <div className="chart-card glass glass-green">
                <div className="chart-title">Score Breakdown</div>
                <div className="chart-sub">Agent-level evaluation</div>
                <div style={{display:'flex',alignItems:'flex-end',gap:10,height:150}}>
                  {barData.map((d,i)=>{
                    const c=tileColors[i]
                    return(
                      <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
                        <span style={{fontSize:11,fontWeight:800,color:c}}>{d.score}</span>
                        <div style={{width:'100%',borderRadius:'8px 8px 0 0',background:'rgba(255,255,255,0.04)',flex:1,position:'relative',overflow:'hidden'}}>
                          <div style={{position:'absolute',bottom:0,left:0,right:0,height:`${d.score}%`,borderRadius:'8px 8px 0 0',background:`linear-gradient(to top,${c}99,${c})`,boxShadow:`0 0 16px ${c}55`,animation:'barGrow 1.3s cubic-bezier(.4,0,.2,1) both',animationDelay:`${i*.1}s`}}/>
                        </div>
                        <span style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:'var(--muted)'}}>{d.name.slice(0,4)}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="chart-card glass glass-pink">
                <div className="chart-title">Strength Radar</div>
                <div className="chart-sub">Dimensional profile</div>
                <RadarCanvas data={radarData}/>
              </div>
            </div>

            {/* Agents glassmorphism */}
            <div className="slabel">AI Agent Pipeline</div>
            <div className="agents-grid">
              {[
                {num:'AGENT 01',icon:'💡',name:'Idea Agent',    outs:'problem_statement\nsolution_summary\nidea_score',     score:result.idea,       gc:'glass-green',c:G},
                {num:'AGENT 02',icon:'📊',name:'Market Agent',  outs:'TAM / SAM / SOM\nmarket_trends\nmarket_score',       score:result.market,     gc:'glass-pink', c:PK},
                {num:'AGENT 03',icon:'🔍',name:'Competitor',    outs:'direct_competitors\nSWOT comparison\ncomp_score',     score:result.competitor, gc:'glass-pink', c:PK},
                {num:'AGENT 04',icon:'💰',name:'Finance Agent', outs:'revenue_model\nbreak_even\nfinance_score',            score:result.finance,    gc:'glass-green',c:G2},
                {num:'AGENT 05',icon:'⚠️',name:'Risk Agent',    outs:'execution_risks\nmitigation_tips\nrisk_score',        score:result.risk,       gc:'glass-pink', c:PK2},
                {num:'AGENT 06',icon:'🏆',name:'Final Scorer',  outs:'investment_ready\nverdict_text\nfinal_score',         score:result.overall_score,gc:'glass-green',c:G,final:true},
              ].map((a,i)=>(
                <div key={i} className={`agent-card glass ${a.gc} glass-hover${a.c===PK||a.c===PK2?' glass-hover-pink':''} d${i+1}`} style={{position:'relative'}}>
                  <div className="agent-glow-bar" style={{background:`linear-gradient(to bottom,${a.c},transparent)`}}/>
                  <div className="agent-num" style={{color:a.c}}>{a.num}</div>
                  <span className="agent-icon">{a.icon}</span>
                  <div className="agent-name">{a.name}</div>
                  <div className="agent-outs">
                    {a.outs.split('\n').map((l,j)=><span key={j}>{l}<br/></span>)}
                    <span className="agent-score" style={{color:a.c}}>{a.score}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* SWOT */}
            <div className="slabel">Competitive SWOT</div>
            <div className="swot-grid">
              {[
                {cls:'swot-s',title:'💪 Strengths',    items:result.swot.strengths,    dot:G},
                {cls:'swot-w',title:'⚠️ Weaknesses',   items:result.swot.weaknesses,   dot:PK},
                {cls:'swot-o',title:'🚀 Opportunities',items:result.swot.opportunities,dot:'#7b5ea7'},
                {cls:'swot-t',title:'🔥 Threats',      items:result.swot.threats,      dot:MUT},
              ].map(q=>(
                <div key={q.title} className={`swot-card ${q.cls}`}>
                  <div className="swot-title">{q.title}</div>
                  {q.items.map((item,i)=>(
                    <div key={i} className="swot-item">
                      <div className="swot-dot" style={{background:q.dot}}/>
                      {item}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ IDEA ══════════════════════════════════════════════════════════ */}
        {tab==='idea'&&(
          <div className="tab-content">
            <div className="section-head">
              <span className="section-icon">💡</span>
              <div style={{flex:1}}><div className="section-title">Idea Analysis</div><div className="section-sub">Problem · Solution · Innovation scores</div></div>
              <SmallRing score={result.idea}/>
            </div>
            <div className="two-col">
              <div className="detail-card glass glass-green">
                <p className="dlabel">Problem Statement</p><p className="dtext">{result.problem_statement}</p>
                <p className="dlabel">Proposed Solution</p><p className="dtext">{result.solution_summary}</p>
                <p className="dlabel">Target Users</p><p className="dtext" style={{marginBottom:0}}>{result.target_users}</p>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                {[
                  {label:'Innovation Level',val:result.innovation_level,icon:'🚀',desc:'Novelty vs market',color:G},
                  {label:'Feasibility',     val:result.feasibility_score,icon:'⚙️',desc:'Practical to build',color:G2},
                  {label:'Clarity Score',   val:result.clarity_score,    icon:'🎯',desc:'How well-defined', color:PK},
                ].map(s=>(
                  <div key={s.label} className="detail-card glass" style={{padding:20}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                      <div style={{display:'flex',alignItems:'center',gap:10}}>
                        <span style={{fontSize:20}}>{s.icon}</span>
                        <div><p style={{fontSize:14,fontWeight:700,color:'var(--text)'}}>{s.label}</p><p style={{fontSize:11,color:MUT,fontFamily:"'DM Mono',monospace"}}>{s.desc}</p></div>
                      </div>
                      <div><span style={{fontSize:28,fontWeight:900,color:s.color}}>{s.val}</span><span style={{fontSize:13,color:MUT,fontFamily:"'DM Mono',monospace"}}>/10</span></div>
                    </div>
                    <div className="score-bar"><div className="score-fill" style={{width:`${s.val*10}%`,background:s.color,boxShadow:`0 0 8px ${s.color}55`}}/></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ MARKET ════════════════════════════════════════════════════════ */}
        {tab==='market'&&(
          <div className="tab-content">
            <div className="section-head">
              <span className="section-icon">📊</span>
              <div style={{flex:1}}><div className="section-title">Market Analysis</div><div className="section-sub">TAM · SAM · SOM · Trends · Growth</div></div>
              <SmallRing score={result.market}/>
            </div>
            <div className="tam-grid">
              {[
                {label:'TAM',val:result.TAM,desc:'Total Addressable Market — global opportunity',color:G,  border:G},
                {label:'SAM',val:result.SAM,desc:'Serviceable Addressable — realistic reach',   color:G2, border:G2},
                {label:'SOM',val:result.SOM,desc:'Serviceable Obtainable — 3-year target',      color:PK, border:PK},
              ].map(m=>(
                <div key={m.label} className="tam-card glass" style={{borderTopColor:m.border}}>
                  <div className="tam-label" style={{color:m.color}}>{m.label}</div>
                  <div className="tam-val">{m.val.split('—')[0].trim()}</div>
                  <div className="tam-desc">{m.desc}</div>
                  {m.val.includes('—')&&<div style={{marginTop:8,fontSize:12,color:MUT,borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:8}}>{m.val.split('—')[1]?.trim()}</div>}
                </div>
              ))}
            </div>
            <div className="two-col">
              <div className="detail-card glass glass-green">
                <p className="dlabel">Market Trends</p>
                <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:18}}>{result.market_trends.map((t,i)=><Tag key={i} v="green">{t}</Tag>)}</div>
                <p className="dlabel">Growth Potential</p>
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:18}}><Tag v="green">{result.growth_potential}</Tag></div>
                <p className="dlabel">Key Insight</p>
                <p className="dtext" style={{marginBottom:0}}>{result.key_insight}</p>
              </div>
              <div className="detail-card glass glass-pink" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center'}}>
                <span style={{fontSize:44,marginBottom:16}}>📈</span>
                <p style={{fontSize:22,fontWeight:900,color:'var(--text)',marginBottom:8}}>{result.growth_potential} Growth</p>
                <p style={{fontSize:13,color:MUT,lineHeight:1.7,maxWidth:260,fontWeight:500}}>{result.key_insight}</p>
                <div style={{display:'flex',gap:6,marginTop:14,flexWrap:'wrap',justifyContent:'center'}}>
                  <Tag v="green">Expanding</Tag><Tag v="pink">High Demand</Tag>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ COMPETITOR ════════════════════════════════════════════════════ */}
        {tab==='competitor'&&(
          <div className="tab-content">
            <div className="section-head">
              <span className="section-icon">🔍</span>
              <div style={{flex:1}}><div className="section-title">Competitor Analysis</div><div className="section-sub">Direct · Indirect · SWOT · Your Edge</div></div>
              <SmallRing score={result.competitor}/>
            </div>
            <div className="two-col">
              <div className="detail-card glass glass-pink">
                <p className="dlabel">Direct Competitors</p>
                <div className="comp-list">{result.direct_competitors.map((c,i)=><Tag key={i} v="pink">{c}</Tag>)}</div>
                <p className="dlabel">Indirect Competitors</p>
                <div className="comp-list">{result.indirect_competitors.map((c,i)=><Tag key={i} v="muted">{c}</Tag>)}</div>
                <div className="info-box info-box-pink">
                  <p className="info-box-label">MARKET GAP</p>
                  <p className="info-box-text">{result.market_gap}</p>
                </div>
              </div>
              <div className="detail-card glass glass-green">
                <p className="dlabel">Competitive Advantage</p>
                <div className="info-box info-box-green" style={{marginBottom:16}}>
                  <p className="info-box-text">{result.competitive_advantage}</p>
                </div>
                <p className="dlabel">Why You Win</p>
                {result.swot.strengths.map((s,i)=>(
                  <div key={i} style={{display:'flex',gap:8,marginBottom:8}}>
                    <span style={{color:G,fontSize:12,marginTop:3,flexShrink:0}}>→</span>
                    <p style={{fontSize:13,color:MUT,lineHeight:1.5,fontWeight:500}}>{s}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="swot-grid">
              {[
                {cls:'swot-s',title:'💪 Strengths',    items:result.swot.strengths,    dot:G},
                {cls:'swot-w',title:'⚠️ Weaknesses',   items:result.swot.weaknesses,   dot:PK},
                {cls:'swot-o',title:'🚀 Opportunities',items:result.swot.opportunities,dot:'#7b5ea7'},
                {cls:'swot-t',title:'🔥 Threats',      items:result.swot.threats,      dot:MUT},
              ].map(q=>(
                <div key={q.title} className={`swot-card ${q.cls}`}>
                  <div className="swot-title">{q.title}</div>
                  {q.items.map((item,i)=><div key={i} className="swot-item"><div className="swot-dot" style={{background:q.dot}}/>{item}</div>)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ RISK ══════════════════════════════════════════════════════════ */}
        {tab==='risk'&&(
          <div className="tab-content">
            <div className="section-head">
              <span className="section-icon">⚠️</span>
              <div style={{flex:1}}><div className="section-title">Risk & Innovation</div><div className="section-sub">Challenges · Mitigations · Innovation score</div></div>
              <SmallRing score={result.risk}/>
            </div>
            <div className="score-boxes">
              {[
                {label:'Risk Score',val:`${result.risk_score}/10`,  icon:'⚠️',color:'#f0c040',sub:'Lower is safer'},
                {label:'Innovation',val:`${result.innovation_uniqueness}/10`,icon:'🔮',color:G,sub:'Uniqueness'},
                {label:'Risk Level',val:result.overall_risk_level,  icon:'🎯',
                  color:result.overall_risk_level==='Low'?G:result.overall_risk_level==='Medium'?'#f0c040':PK,
                  sub:'Overall'},
              ].map(s=>(
                <div key={s.label} className="score-box glass">
                  <div className="score-box-icon">{s.icon}</div>
                  <div className="score-box-val" style={{color:s.color}}>{s.val}</div>
                  <div className="score-box-lbl">{s.label}</div>
                  <div className="score-box-sub">{s.sub}</div>
                </div>
              ))}
            </div>
            <div className="two-col">
              <div className="detail-card glass glass-pink">
                <p className="dlabel">Execution Challenges</p>
                {result.execution_challenges.map((c,i)=>(
                  <div key={i} className="challenge-item ch-bad">
                    <span style={{color:PK,fontSize:12,flexShrink:0,marginTop:2}}>→</span>
                    <p className="ch-text">{c}</p>
                  </div>
                ))}
              </div>
              <div className="detail-card glass glass-green">
                <p className="dlabel">Mitigation Strategies</p>
                {result.mitigation_strategies.map((s,i)=>(
                  <div key={i} className="challenge-item ch-good">
                    <span style={{color:G,fontSize:12,flexShrink:0,marginTop:2}}>✓</span>
                    <p className="ch-text">{s}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="detail-card glass glass-green">
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
                <span style={{fontSize:22}}>🔮</span>
                <p style={{fontSize:15,fontWeight:800,color:'var(--text)'}}>Innovation Summary</p>
              </div>
              <p style={{fontSize:14,color:MUT,lineHeight:1.75,fontWeight:500}}>{result.innovation_summary}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:24,marginTop:24,borderTop:'1px solid rgba(255,255,255,0.05)'}}>
          <p style={{fontSize:11,color:MUT,fontFamily:"'DM Mono',monospace"}}>
            StartIQ multi-agent analysis · {new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
          </p>
          <button style={{fontSize:12,color:G,background:'none',border:'1px solid rgba(0,245,168,0.2)',borderRadius:8,padding:'6px 14px',cursor:'pointer',fontWeight:600,fontFamily:"'Manrope',sans-serif"}}>
            Export PDF →
          </button>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════
export default function App(){
  const [page,setPage]=useState('landing')
  const [idea,setIdea]=useState('')
  const [result,setResult]=useState(null)

  async function start(txt){
    setIdea(txt);setPage('analyzing')
    try{const res=await axios.post('http://127.0.0.1:8001/analyze',{idea:txt});setResult(res.data)}
    catch{await new Promise(r=>setTimeout(r,4600));setResult(MOCK)}
    setPage('results')
  }
  function reset(){setPage('landing');setResult(null);setIdea('')}

  return(
    <div className="app-root">
      <MeshBg/>
      <div className="bg-orb orb-a"/>
      <div className="bg-orb orb-b"/>
      <div className="bg-orb orb-c"/>
      <div className="bg-grid"/>
      {page==='landing'  &&<LandingPage onStart={start}/>}
      {page==='analyzing'&&<AnalyzingPage idea={idea}/>}
      {page==='results'  &&result&&<ResultsPage result={result} idea={idea} onReset={reset}/>}
    </div>
  )
}