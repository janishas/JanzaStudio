import { useState, useEffect, useRef } from "react";

// ─── Utility helpers ──────────────────────────────────────────────────────────
const LS_KEY = "jc_bookings";
const loadBookings = () => {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
  catch { return []; }
};
const saveBookings = (b) => localStorage.setItem(LS_KEY, JSON.stringify(b));

function useCountUp(target, trigger, duration = 2000) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [trigger, target, duration]);
  return val;
}

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// ─── Style constants ──────────────────────────────────────────────────────────
const GOLD = "#C9A84C";
const GOLD2 = "#F5D78E";
const DARK = "#0A0A0F";
const DARK2 = "#111118";
const DARK3 = "#1A1A24";
const GLASS = "rgba(255,255,255,0.04)";
const GLASS_BORDER = "rgba(201,168,76,0.18)";

// ─── Brand constants ──────────────────────────────────────────────────────────
const BRAND = "JanzaStudio";
const BRAND_URL = "janzastudio.in";
const TAGLINE = "Every Brand Has a Universe — Let's Build Yours";

// ─── Sparkle Text Component ───────────────────────────────────────────────────
function SparkleText({ children, size = 19, className = "" }) {
  const [sparks, setSparks] = useState([]);
  const intervalRef = useRef(null);
  const fontSize = typeof size === "number" ? size : size;

  const addSpark = () => {
    const id = Date.now() + Math.random();
    const spark = {
      id,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 10 + 6,
      duration: Math.random() * 600 + 400,
      color: Math.random() > 0.5 ? GOLD : GOLD2,
      rotation: Math.random() * 360,
    };
    setSparks(prev => [...prev.slice(-12), spark]);
    setTimeout(() => setSparks(prev => prev.filter(s => s.id !== id)), spark.duration);
  };

  useEffect(() => {
    intervalRef.current = setInterval(addSpark, 280);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <span style={{ position:"relative", display:"inline-block" }} className={className}>
      {sparks.map(s => (
        <span key={s.id} style={{
          position:"absolute",
          left:`${s.x}%`, top:`${s.y}%`,
          width: s.size, height: s.size,
          pointerEvents:"none", zIndex:10,
          animation:`sparkPop ${s.duration}ms ease-out forwards`,
          transformOrigin:"center",
        }}>
          <svg width={s.size} height={s.size} viewBox="0 0 20 20" style={{ transform:`rotate(${s.rotation}deg)` }}>
            <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z"
              fill={s.color} opacity="0.95"/>
          </svg>
        </span>
      ))}
      <span style={{
        fontFamily:"'Playfair Display',serif",
        fontSize: fontSize,
        fontWeight:700,
        background:`linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 40%, #fff 55%, ${GOLD2} 70%, ${GOLD} 100%)`,
        backgroundSize:"300% 100%",
        WebkitBackgroundClip:"text",
        WebkitTextFillColor:"transparent",
        backgroundClip:"text",
        animation:"textShimmer 3s linear infinite",
        letterSpacing:0.5,
      }}>{children}</span>
      <style>{`
        @keyframes sparkPop {
          0%   { transform: translate(-50%,-50%) scale(0) rotate(0deg); opacity:1; }
          50%  { transform: translate(-50%,-50%) scale(1.2) rotate(180deg); opacity:1; }
          100% { transform: translate(-50%,-50%) scale(0) rotate(360deg); opacity:0; }
        }
      `}</style>
    </span>
  );
}

// ─── Sparkle Domain Link ──────────────────────────────────────────────────────
function DomainLink() {
  const [hovered, setHovered] = useState(false);
  const [sparks, setSparks] = useState([]);

  useEffect(() => {
    const iv = setInterval(() => {
      const id = Date.now() + Math.random();
      setSparks(prev => [...prev.slice(-16), {
        id,
        x: Math.random() * 110 - 5,
        y: Math.random() * 110 - 5,
        size: Math.random() * 8 + 4,
        color: Math.random() > 0.4 ? GOLD2 : "#ffffff",
        dur: Math.random() * 700 + 400,
      }]);
      setTimeout(() => setSparks(prev => prev.filter(s => s.id !== id)), 1100);
    }, 200);
    return () => clearInterval(iv);
  }, []);

  return (
    <a
      href={`https://www.${BRAND_URL}`}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:"relative", display:"inline-flex", alignItems:"center", gap:8,
        textDecoration:"none", padding:"10px 24px",
        borderRadius:50,
        background: hovered
          ? `linear-gradient(135deg,${GOLD},${GOLD2})`
          : `rgba(201,168,76,0.1)`,
        border:`1.5px solid ${hovered ? GOLD2 : GOLD}`,
        transition:"all 0.35s ease",
        boxShadow: hovered
          ? `0 0 30px ${GOLD}88, 0 0 60px ${GOLD}44`
          : `0 0 15px ${GOLD}33`,
      }}
    >
      {sparks.map(s => (
        <span key={s.id} style={{
          position:"absolute",
          left:`${s.x}%`, top:`${s.y}%`,
          width:s.size, height:s.size,
          pointerEvents:"none", zIndex:20,
          animation:`sparkPop ${s.dur}ms ease-out forwards`,
        }}>
          <svg width={s.size} height={s.size} viewBox="0 0 20 20">
            <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z"
              fill={s.color}/>
          </svg>
        </span>
      ))}
      {/* Cosmos icon */}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="4" fill={hovered ? "#0A0A0F" : GOLD}/>
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke={hovered ? "#0A0A0F" : GOLD} strokeWidth="1.4" fill="none"/>
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke={hovered ? "#0A0A0F" : GOLD} strokeWidth="1.4" fill="none"
          transform="rotate(60 12 12)"/>
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke={hovered ? "#0A0A0F" : GOLD} strokeWidth="1.4" fill="none"
          transform="rotate(120 12 12)"/>
      </svg>
      <span style={{
        fontFamily:"'Jost',sans-serif", fontWeight:700,
        fontSize:14, letterSpacing:1.5,
        color: hovered ? "#0A0A0F" : GOLD,
        textTransform:"uppercase",
      }}>{BRAND_URL}</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={hovered?"#0A0A0F":GOLD} strokeWidth="2.5">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
    </a>
  );
}


const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@300;400;500;600&family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;600;700&family=Italiana&family=Rajdhani:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --gold: ${GOLD};
    --gold2: ${GOLD2};
    --dark: ${DARK};
    --dark2: ${DARK2};
    --dark3: ${DARK3};
    --glass: ${GLASS};
    --glass-border: ${GLASS_BORDER};
    --radius: 18px;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--dark);
    color: #e8e0d0;
    font-family: 'Jost', sans-serif;
    overflow-x: hidden;
    cursor: default;
  }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: var(--dark2); }
  ::-webkit-scrollbar-thumb { background: linear-gradient(180deg,${GOLD},${GOLD2}); border-radius: 3px; }

  .playfair { font-family: 'Playfair Display', serif; }
  .cormorant { font-family: 'Cormorant Garamond', serif; }
  .gold { color: var(--gold); }
  .gold2 { color: var(--gold2); }

  /* ── Premium Glass card ── */
  .glass-card {
    background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%);
    border: 1px solid rgba(201,168,76,0.18);
    border-radius: var(--radius);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
    position: relative;
    overflow: hidden;
  }
  .glass-card::before {
    content:'';
    position:absolute; inset:0; border-radius:inherit;
    background: linear-gradient(135deg, rgba(201,168,76,0.06) 0%, transparent 60%);
    pointer-events:none;
    opacity:0; transition:opacity 0.35s;
  }
  .glass-card:hover::before { opacity:1; }
  .glass-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(201,168,76,0.12);
    border-color: rgba(201,168,76,0.35);
  }

  /* ── Gold gradient text ── */
  .grad-text {
    background: linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 45%, #fff 60%, ${GOLD2} 75%, ${GOLD} 100%);
    background-size: 200% 100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: textShimmer 5s linear infinite;
  }

  /* ── Animated underline ── */
  .hover-line { position: relative; display: inline-block; }
  .hover-line::after {
    content: '';
    position: absolute; bottom: -2px; left: 0;
    width: 0; height: 1px;
    background: linear-gradient(90deg, ${GOLD}, ${GOLD2});
    transition: width 0.35s ease;
  }
  .hover-line:hover::after { width: 100%; }

  /* ── Gold button ── */
  .btn-gold {
    background: linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 50%, ${GOLD} 100%);
    background-size: 200% 200%;
    color: #0A0A0F;
    border: none;
    border-radius: 50px;
    padding: 14px 38px;
    font-family: 'Jost', sans-serif;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 1.5px;
    cursor: pointer;
    transition: all 0.4s ease;
    position: relative; overflow: hidden;
    text-transform: uppercase;
    box-shadow: 0 4px 20px rgba(201,168,76,0.3);
  }
  .btn-gold:hover {
    background-position: right center;
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(201,168,76,0.5);
  }
  .btn-gold::after {
    content: ''; position: absolute; inset: 0; border-radius: inherit;
    background: radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.3) 0%, transparent 60%);
    opacity: 0; transition: opacity 0.3s;
  }
  .btn-gold:hover::after { opacity: 1; }

  /* ── Outline button ── */
  .btn-outline {
    background: transparent;
    color: var(--gold);
    border: 1px solid rgba(201,168,76,0.5);
    border-radius: 50px;
    padding: 13px 36px;
    font-family: 'Jost', sans-serif;
    font-weight: 500; font-size: 14px;
    letter-spacing: 1.5px; text-transform: uppercase;
    cursor: pointer; transition: all 0.35s ease;
    backdrop-filter: blur(8px);
  }
  .btn-outline:hover {
    background: linear-gradient(135deg,${GOLD},${GOLD2});
    color: var(--dark); border-color: transparent;
    box-shadow: 0 8px 30px rgba(201,168,76,0.4);
    transform: translateY(-3px);
  }

  /* ── Section label ── */
  .section-label {
    font-family: 'Rajdhani', sans-serif;
    font-size: 11px; font-weight: 700;
    letter-spacing: 4px; text-transform: uppercase;
    color: ${GOLD};
    display: inline-flex; align-items: center; gap: 12px;
    margin-bottom: 20px;
  }
  .section-label::before, .section-label::after {
    content: ''; display: block;
    width: 30px; height: 1px;
    background: linear-gradient(90deg, transparent, ${GOLD});
  }
  .section-label::after {
    background: linear-gradient(90deg, ${GOLD}, transparent);
  }

  /* ── Divider line ── */
  .gold-divider {
    width: 60px; height: 2px;
    background: linear-gradient(90deg, ${GOLD}, ${GOLD2}, transparent);
    margin: 0 auto 28px;
    border-radius: 2px;
  }

  /* Fade in up */
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(40px); }
    to   { opacity:1; transform:translateY(0); }
  }
  .fade-up    { animation: fadeUp 0.8s ease forwards; }
  .fade-up-d1 { animation: fadeUp 0.8s 0.15s ease both; }
  .fade-up-d2 { animation: fadeUp 0.8s 0.30s ease both; }
  .fade-up-d3 { animation: fadeUp 0.8s 0.45s ease both; }
  .fade-up-d4 { animation: fadeUp 0.8s 0.60s ease both; }

  /* Float */
  @keyframes floatY {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-14px); }
  }
  .float { animation: floatY 6s ease-in-out infinite; }

  /* Shimmer */
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }

  /* Rotate */
  @keyframes spin-slow { to { transform: rotate(360deg); } }

  /* Pulse ring */
  @keyframes pulse-ring {
    0%   { transform:scale(1); opacity:0.6; }
    100% { transform:scale(1.8); opacity:0; }
  }

  /* nav */
  nav { transition: all 0.4s ease; }
  nav.scrolled {
    background: rgba(8,8,12,0.97) !important;
    backdrop-filter: blur(24px);
    border-bottom: 1px solid rgba(201,168,76,0.15);
    box-shadow: 0 4px 40px rgba(0,0,0,0.6);
  }

  /* Form inputs */
  .inp {
    width:100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(201,168,76,0.18);
    border-radius: 12px;
    padding: 15px 20px;
    color: #e8e0d0;
    font-family: 'Jost', sans-serif; font-size: 15px;
    outline: none;
    transition: border-color 0.3s, box-shadow 0.3s, background 0.3s;
  }
  .inp:focus {
    border-color: ${GOLD};
    background: rgba(201,168,76,0.06);
    box-shadow: 0 0 0 4px rgba(201,168,76,0.1);
  }
  .inp::placeholder { color: rgba(232,224,208,0.3); }
  select.inp option { background: var(--dark2); color: #e8e0d0; }

  /* Table */
  table { border-collapse: collapse; width: 100%; }
  th { background: rgba(201,168,76,0.08); color: var(--gold); font-weight:600; font-size:12px; letter-spacing:1.5px; text-transform:uppercase; padding:16px 20px; text-align:left; border-bottom:1px solid rgba(201,168,76,0.15); }
  td { padding:14px 20px; font-size:14px; border-bottom:1px solid rgba(255,255,255,0.04); }
  tr:hover td { background: rgba(201,168,76,0.04); }

  /* Progress bar */
  @keyframes growBar { from { width:0; } to { width: var(--w); } }
  .progress-bar { animation: growBar 1.6s cubic-bezier(0.23,1,0.32,1) forwards; }

  /* Mobile nav */
  .mobile-nav-open { transform: translateX(0) !important; }

  /* Section reveal */
  .reveal { opacity:0; transform:translateY(50px); transition: opacity 0.8s ease, transform 0.8s ease; }
  .reveal.visible { opacity:1; transform:translateY(0); }

  /* Map embed */
  iframe { border:none; border-radius:12px; }

  /* ── Custom cursor ── */
  * { cursor: none !important; }
  @keyframes sparkFly {
    0%   { transform: translate(-50%,-50%) scale(1); opacity: 1; }
    100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0); opacity: 0; }
  }
  .spark {
    position: fixed; pointer-events: none; z-index: 99990;
    width: 4px; height: 4px; border-radius: 50%;
    background: var(--gold2);
    animation: sparkFly 0.5s ease-out forwards;
  }

  /* ── Scroll progress bar ── */
  #scroll-bar {
    position: fixed; top: 0; left: 0; height: 3px; z-index: 99997;
    background: linear-gradient(90deg, ${GOLD}, ${GOLD2}, ${GOLD});
    background-size: 200% 100%;
    animation: shimmer 2s linear infinite;
    transition: width 0.1s linear;
    border-radius: 0 3px 3px 0;
    box-shadow: 0 0 12px ${GOLD}99;
  }

  /* ── Flip card ── */
  .flip-wrap { perspective: 900px; }
  .flip-inner {
    position: relative; transform-style: preserve-3d;
    transition: transform 0.7s cubic-bezier(0.23,1,0.32,1);
  }
  .flip-wrap:hover .flip-inner { transform: rotateY(180deg); }
  .flip-front, .flip-back { backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: var(--radius); overflow: hidden; }
  .flip-back {
    position: absolute; inset: 0; transform: rotateY(180deg);
    background: linear-gradient(135deg, rgba(201,168,76,0.18), rgba(10,10,15,0.95));
    border: 1px solid ${GOLD}55;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 28px; text-align: center;
  }

  /* ── Swipe reveal ── */
  @keyframes swipeIn {
    from { transform: translateX(-50px) skewX(-10deg); opacity: 0; }
    to   { transform: translateX(0) skewX(0deg); opacity: 1; }
  }
  .swipe-in { animation: swipeIn 0.7s cubic-bezier(0.23,1,0.32,1) both; }

  /* ── Text shimmer ── */
  @keyframes textShimmer {
    0%   { background-position: -400% center; }
    100% { background-position:  400% center; }
  }
  .shimmer-text {
    background: linear-gradient(90deg, ${GOLD} 0%, ${GOLD2} 30%, #fff 50%, ${GOLD2} 70%, ${GOLD} 100%);
    background-size: 400% 100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: textShimmer 4s linear infinite;
  }

  /* ── Neon glow pulse ── */
  @keyframes neonPulse {
    0%,100% { box-shadow: 0 0 8px ${GOLD}44, 0 0 24px ${GOLD}22; }
    50%      { box-shadow: 0 0 24px ${GOLD}99, 0 0 60px ${GOLD}55, 0 0 100px ${GOLD}22; }
  }
  .neon-glow { animation: neonPulse 3s ease-in-out infinite; }

  /* ── Diagonal gradient bg sweep ── */
  @keyframes bgSweep {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  /* ── Stagger children ── */
  .stagger > *:nth-child(1) { animation-delay: 0s; }
  .stagger > *:nth-child(2) { animation-delay: 0.1s; }
  .stagger > *:nth-child(3) { animation-delay: 0.2s; }
  .stagger > *:nth-child(4) { animation-delay: 0.3s; }
  .stagger > *:nth-child(5) { animation-delay: 0.4s; }
  .stagger > *:nth-child(6) { animation-delay: 0.5s; }

  /* ── Tilt card ── */
  .tilt-card { transform-style: preserve-3d; transition: transform 0.1s ease; }

  /* ── Page transition ── */
  @keyframes pageIn {
    from { opacity:0; transform: translateY(24px) scale(0.98); }
    to   { opacity:1; transform: translateY(0) scale(1); }
  }
  .page-in { animation: pageIn 0.55s cubic-bezier(0.23,1,0.32,1) both; }

  /* ── Floating orbs ── */
  @keyframes orbFloat {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(40px,-30px) scale(1.08); }
    66%      { transform: translate(-25px,20px) scale(0.93); }
  }
  .orb { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(80px); }

  /* ── Marquee ── */
  @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  .marquee-track { animation: marquee 22s linear infinite; display: flex; width: max-content; }
  .marquee-track:hover { animation-play-state: paused; }

  /* ── Gold border glow on hover ── */
  @keyframes borderGlow {
    0%,100% { border-color: rgba(201,168,76,0.18); }
    50%      { border-color: rgba(201,168,76,0.55); box-shadow: 0 0 30px rgba(201,168,76,0.15); }
  }

  /* ── Stat counter card ── */
  .stat-card {
    background: linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(255,255,255,0.03) 100%);
    border: 1px solid rgba(201,168,76,0.2);
    border-radius: 20px;
    padding: 36px 24px;
    text-align: center;
    transition: transform 0.35s ease, box-shadow 0.35s ease;
    position: relative; overflow: hidden;
  }
  .stat-card::after {
    content:''; position:absolute; bottom:0; left:50%; transform:translateX(-50%);
    width:60%; height:2px;
    background: linear-gradient(90deg, transparent, ${GOLD}, transparent);
  }
  .stat-card:hover { transform:translateY(-8px); box-shadow:0 24px 60px rgba(0,0,0,0.4), 0 0 40px rgba(201,168,76,0.1); }

  /* ── Skill bar track ── */
  .skill-track {
    background: rgba(255,255,255,0.06);
    border-radius: 50px; height: 6px; overflow: hidden;
    position: relative;
  }
  .skill-fill {
    height: 100%; border-radius: 50px;
    background: linear-gradient(90deg, ${GOLD}, ${GOLD2});
    box-shadow: 0 0 10px ${GOLD}66;
    animation: growBar 1.6s cubic-bezier(0.23,1,0.32,1) forwards;
    width: 0;
  }

  /* ── Mobile responsive ── */
  @media (max-width: 768px) {
    .desktop-nav { display: none !important; }
    .hamburger   { display: block !important; }
    .grid-2 { grid-template-columns: 1fr !important; }
    .grid-3 { grid-template-columns: 1fr !important; }
    .grid-4 { grid-template-columns: 1fr 1fr !important; }
  }
`;


// ─── Galaxy Background ────────────────────────────────────────────────────────
function ParticlesBg() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W, H;

    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Stars (3 layers: tiny/medium/bright) ──
    const stars = Array.from({ length: 320 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.6 + 0.2,
      alpha: Math.random() * 0.7 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleDir: Math.random() > 0.5 ? 1 : -1,
      color: Math.random() > 0.85
        ? `rgba(245,215,142,`   // gold
        : Math.random() > 0.6
        ? `rgba(180,200,255,`   // blue-white
        : `rgba(255,255,255,`,  // white
    }));

    // ── Sparkle stars (bigger, cross-shaped) ──
    const sparkles = Array.from({ length: 18 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 3 + 2,
      alpha: Math.random(),
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.015 + 0.008,
    }));

    // ── Shooting stars ──
    const shoots = [];
    let shootTimer = 0;
    const spawnShoot = () => ({
      x: Math.random() * W,
      y: Math.random() * H * 0.5,
      len: Math.random() * 180 + 80,
      speed: Math.random() * 12 + 8,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
      alpha: 1,
      life: 0,
      maxLife: Math.random() * 40 + 30,
    });

    // ── Nebula clouds ──
    const nebulas = [
      { x: 0.15, y: 0.25, rx: 0.22, ry: 0.14, color: "rgba(120,60,180,", alpha: 0.045 },
      { x: 0.78, y: 0.65, rx: 0.18, ry: 0.12, color: "rgba(201,168,76,",  alpha: 0.04  },
      { x: 0.5,  y: 0.8,  rx: 0.28, ry: 0.1,  color: "rgba(60,100,200,",  alpha: 0.035 },
      { x: 0.88, y: 0.18, rx: 0.15, ry: 0.1,  color: "rgba(180,80,120,",  alpha: 0.04  },
    ];

    // ── Saturn ──
    const saturn = {
      x: 0.82, y: 0.18,
      rx: 28, ry: 28,
      ringRx: 62, ringRy: 14,
      angle: 0,
      orbitX: 0, orbitY: 0,
      orbitSpeed: 0.0003,
      phase: 0,
    };

    // ── Galaxy spiral core ──
    const coreParticles = Array.from({ length: 120 }, (_, i) => {
      const angle = (i / 120) * Math.PI * 8;
      const dist  = (i / 120) * 0.18 + 0.01;
      return {
        baseAngle: angle,
        dist,
        speed: 0.0002 + (i / 120) * 0.0003,
        alpha: (1 - i / 120) * 0.6 + 0.05,
        r: Math.random() * 1.2 + 0.3,
      };
    });

    let t = 0;
    let raf;

    const drawCross = (x, y, size, alpha, color) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.8;
      const arm = size * 2.5;
      // vertical
      const grad1 = ctx.createLinearGradient(x, y - arm, x, y + arm);
      grad1.addColorStop(0, "transparent");
      grad1.addColorStop(0.5, color);
      grad1.addColorStop(1, "transparent");
      ctx.strokeStyle = grad1;
      ctx.beginPath(); ctx.moveTo(x, y - arm); ctx.lineTo(x, y + arm); ctx.stroke();
      // horizontal
      const grad2 = ctx.createLinearGradient(x - arm, y, x + arm, y);
      grad2.addColorStop(0, "transparent");
      grad2.addColorStop(0.5, color);
      grad2.addColorStop(1, "transparent");
      ctx.strokeStyle = grad2;
      ctx.beginPath(); ctx.moveTo(x - arm, y); ctx.lineTo(x + arm, y); ctx.stroke();
      // center glow
      ctx.globalAlpha = alpha * 0.9;
      const grd = ctx.createRadialGradient(x, y, 0, x, y, size * 1.5);
      grd.addColorStop(0, color);
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(x, y, size * 1.5, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.016;

      // ── Nebula ──
      nebulas.forEach(n => {
        const grd = ctx.createRadialGradient(n.x*W, n.y*H, 0, n.x*W, n.y*H, n.rx*W);
        grd.addColorStop(0, n.color + n.alpha + ")");
        grd.addColorStop(0.5, n.color + (n.alpha * 0.5) + ")");
        grd.addColorStop(1, n.color + "0)");
        ctx.save();
        ctx.scale(1, n.ry / n.rx);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(n.x*W, (n.y*H) / (n.ry/n.rx), n.rx*W, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
      });

      // ── Galaxy core spiral ──
      const coreX = W * 0.5, coreY = H * 0.42;
      coreParticles.forEach((p, i) => {
        const a = p.baseAngle + t * p.speed * 60;
        const x = coreX + Math.cos(a) * p.dist * W;
        const y = coreY + Math.sin(a) * p.dist * H * 0.5;
        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        const hue = 40 + (i / 120) * 30;
        ctx.fillStyle = `hsla(${hue},80%,75%,${p.alpha})`;
        ctx.fill();
      });
      // core glow
      const coreGrd = ctx.createRadialGradient(coreX, coreY, 0, coreX, coreY, 60);
      coreGrd.addColorStop(0, `rgba(245,215,142,0.18)`);
      coreGrd.addColorStop(0.4, `rgba(201,168,76,0.07)`);
      coreGrd.addColorStop(1, "transparent");
      ctx.fillStyle = coreGrd;
      ctx.beginPath(); ctx.arc(coreX, coreY, 60, 0, Math.PI*2); ctx.fill();

      // ── Stars ──
      stars.forEach(s => {
        s.alpha += s.twinkleSpeed * s.twinkleDir;
        if (s.alpha > 0.95 || s.alpha < 0.1) s.twinkleDir *= -1;
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color + s.alpha + ")";
        ctx.fill();
      });

      // ── Sparkle cross stars ──
      sparkles.forEach(s => {
        s.phase += s.speed;
        const a = (Math.sin(s.phase) + 1) / 2;
        const color = Math.random() > 0.5 ? `rgba(245,215,142,` : `rgba(200,220,255,`;
        drawCross(s.x * W, s.y * H, s.size, a * 0.9, color + "1)");
      });

      // ── Shooting stars ──
      shootTimer++;
      if (shootTimer > 90 + Math.random() * 120) {
        shoots.push(spawnShoot());
        shootTimer = 0;
      }
      for (let i = shoots.length - 1; i >= 0; i--) {
        const s = shoots[i];
        s.life++;
        s.alpha = 1 - s.life / s.maxLife;
        const ex = s.x + Math.cos(s.angle) * s.speed * s.life;
        const ey = s.y + Math.sin(s.angle) * s.speed * s.life;
        const sx = s.x + Math.cos(s.angle) * Math.max(0, s.speed * s.life - s.len);
        const sy = s.y + Math.sin(s.angle) * Math.max(0, s.speed * s.life - s.len);
        const grad = ctx.createLinearGradient(sx, sy, ex, ey);
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(0.6, `rgba(245,215,142,${s.alpha * 0.8})`);
        grad.addColorStop(1, `rgba(255,255,255,${s.alpha})`);
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // sparkle at head
        drawCross(ex, ey, 2, s.alpha * 0.8, `rgba(255,255,255,1)`);
        if (s.life >= s.maxLife) shoots.splice(i, 1);
      }

      // ── Saturn ──
      saturn.phase += saturn.orbitSpeed;
      const sx = W * saturn.x + Math.cos(saturn.phase) * 18;
      const sy = H * saturn.y + Math.sin(saturn.phase * 0.7) * 10;

      // back ring
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(-0.3);
      const ringGrdBack = ctx.createLinearGradient(-saturn.ringRx, 0, saturn.ringRx, 0);
      ringGrdBack.addColorStop(0,   "rgba(201,168,76,0)");
      ringGrdBack.addColorStop(0.15,"rgba(201,168,76,0.25)");
      ringGrdBack.addColorStop(0.5, "rgba(245,215,142,0.5)");
      ringGrdBack.addColorStop(0.85,"rgba(201,168,76,0.25)");
      ringGrdBack.addColorStop(1,   "rgba(201,168,76,0)");
      ctx.strokeStyle = ringGrdBack;
      ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.ellipse(0, 0, saturn.ringRx, saturn.ringRy, 0, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 4;
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = "rgba(255,240,180,0.4)";
      ctx.beginPath();
      ctx.ellipse(0, saturn.ringRy * 0.3, saturn.ringRx * 0.85, saturn.ringRy * 0.7, 0, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // planet body
      ctx.save();
      ctx.translate(sx, sy);
      const planetGrd = ctx.createRadialGradient(-8, -8, 2, 0, 0, saturn.rx);
      planetGrd.addColorStop(0,   "rgba(255,235,160,0.95)");
      planetGrd.addColorStop(0.3, "rgba(220,180,100,0.9)");
      planetGrd.addColorStop(0.6, "rgba(180,130,70,0.85)");
      planetGrd.addColorStop(1,   "rgba(120,80,40,0.8)");
      ctx.fillStyle = planetGrd;
      ctx.beginPath();
      ctx.arc(0, 0, saturn.rx, 0, Math.PI * 2);
      ctx.fill();
      // planet bands
      [-8, -2, 5, 11].forEach((by, bi) => {
        ctx.save();
        ctx.clip();
        ctx.globalAlpha = 0.12 + bi * 0.04;
        ctx.fillStyle = bi % 2 === 0 ? "rgba(255,200,100,1)" : "rgba(150,100,50,1)";
        ctx.fillRect(-saturn.rx, by - 3, saturn.rx * 2, 5);
        ctx.restore();
        ctx.beginPath(); ctx.arc(0, 0, saturn.rx, 0, Math.PI * 2);
      });
      // shine
      ctx.globalAlpha = 0.35;
      const shine = ctx.createRadialGradient(-10, -10, 1, -6, -6, 18);
      shine.addColorStop(0, "rgba(255,255,220,0.9)");
      shine.addColorStop(1, "rgba(255,255,220,0)");
      ctx.fillStyle = shine;
      ctx.beginPath(); ctx.arc(0, 0, saturn.rx, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      // front ring
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(-0.3);
      const ringGrdFront = ctx.createLinearGradient(-saturn.ringRx, 0, saturn.ringRx, 0);
      ringGrdFront.addColorStop(0,   "rgba(201,168,76,0)");
      ringGrdFront.addColorStop(0.15,"rgba(201,168,76,0.3)");
      ringGrdFront.addColorStop(0.5, "rgba(245,215,142,0.6)");
      ringGrdFront.addColorStop(0.85,"rgba(201,168,76,0.3)");
      ringGrdFront.addColorStop(1,   "rgba(201,168,76,0)");
      ctx.strokeStyle = ringGrdFront;
      ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.ellipse(0, 0, saturn.ringRx, saturn.ringRy, 0, 0, Math.PI);
      ctx.stroke();
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = "rgba(255,250,200,0.5)";
      ctx.beginPath();
      ctx.ellipse(0, saturn.ringRy * 0.25, saturn.ringRx * 0.85, saturn.ringRy * 0.65, 0, 0, Math.PI);
      ctx.stroke();
      ctx.restore();

      // Saturn glow
      const satGlow = ctx.createRadialGradient(sx, sy, 0, sx, sy, 80);
      satGlow.addColorStop(0, "rgba(245,215,142,0.08)");
      satGlow.addColorStop(1, "transparent");
      ctx.fillStyle = satGlow;
      ctx.beginPath(); ctx.arc(sx, sy, 80, 0, Math.PI * 2); ctx.fill();

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position:"fixed", inset:0, zIndex:0, pointerEvents:"none",
    }} />
  );
}


// ─── Smooth Canvas Cursor ────────────────────────────────────────────────────
function CursorFX() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.style.cssText = `position:fixed;inset:0;z-index:99999;pointer-events:none;width:100vw;height:100vh;`;
    document.body.appendChild(canvas);
    canvasRef.current = canvas;
    const ctx = canvas.getContext("2d");
    let W, H;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const mouse = { x: W/2, y: H/2 };
    const dot   = { x: W/2, y: H/2 };
    const ring  = { x: W/2, y: H/2 };
    const trail = Array.from({ length: 22 }, () => ({ x: W/2, y: H/2 }));
    let isHovered = false, clickPulse = 0, sparkParticles = [];
    const lerp = (a, b, t) => a + (b - a) * t;
    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onOver = (e) => { isHovered = !!e.target.closest("button,a,.glass-card,.btn-gold,.btn-outline,[data-hover]"); };
    const onClick = () => {
      clickPulse = 1;
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI * 2 * i) / 10 + Math.random() * 0.4;
        const speed = Math.random() * 3.5 + 1.5;
        sparkParticles.push({ x: mouse.x, y: mouse.y, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed, life: 1, size: Math.random()*3+1.5, color: Math.random()>0.5 ? GOLD : GOLD2 });
      }
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("click", onClick);
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      dot.x  = lerp(dot.x,  mouse.x, 0.35);
      dot.y  = lerp(dot.y,  mouse.y, 0.35);
      ring.x = lerp(ring.x, mouse.x, 0.10);
      ring.y = lerp(ring.y, mouse.y, 0.10);
      trail.unshift({ x: dot.x, y: dot.y });
      trail.length = 22;
      // comet tail
      for (let i = 1; i < trail.length; i++) {
        const alpha = (1 - i / trail.length) * 0.55;
        const width = (1 - i / trail.length) * (isHovered ? 5 : 3.5);
        ctx.beginPath();
        ctx.moveTo(trail[i-1].x, trail[i-1].y);
        ctx.lineTo(trail[i].x, trail[i].y);
        ctx.strokeStyle = i < 6 ? `rgba(255,255,200,${alpha})` : i < 13 ? `rgba(245,215,142,${alpha*0.8})` : `rgba(201,168,76,${alpha*0.5})`;
        ctx.lineWidth = width; ctx.lineCap = "round"; ctx.stroke();
      }
      // outer ring
      const ringSize = isHovered ? 36 : 24;
      clickPulse = lerp(clickPulse, 0, 0.08);
      const pulse = clickPulse * 18;
      const rg = ctx.createRadialGradient(ring.x, ring.y, 0, ring.x, ring.y, ringSize+pulse+12);
      rg.addColorStop(0, `rgba(201,168,76,0)`);
      rg.addColorStop(0.6, `rgba(201,168,76,${isHovered?0.08:0.04})`);
      rg.addColorStop(1, `rgba(201,168,76,0)`);
      ctx.fillStyle = rg;
      ctx.beginPath(); ctx.arc(ring.x, ring.y, ringSize+pulse+12, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(ring.x, ring.y, ringSize+pulse, 0, Math.PI*2);
      ctx.strokeStyle = isHovered ? `rgba(245,215,142,0.9)` : `rgba(201,168,76,0.55)`;
      ctx.lineWidth = isHovered ? 1.8 : 1.2; ctx.stroke();
      if (isHovered) {
        ctx.save(); ctx.setLineDash([4,6]);
        ctx.beginPath(); ctx.arc(ring.x, ring.y, ringSize+pulse+8, 0, Math.PI*2);
        ctx.strokeStyle = `rgba(245,215,142,0.25)`; ctx.lineWidth = 1; ctx.stroke();
        ctx.setLineDash([]); ctx.restore();
      }
      // inner dot
      const dotSize = isHovered ? 5 : 4;
      const dg = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, dotSize*4);
      dg.addColorStop(0, `rgba(255,240,180,0.9)`); dg.addColorStop(0.4, `rgba(245,215,142,0.4)`); dg.addColorStop(1, `rgba(201,168,76,0)`);
      ctx.fillStyle = dg; ctx.beginPath(); ctx.arc(dot.x, dot.y, dotSize*4, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(dot.x, dot.y, dotSize, 0, Math.PI*2);
      ctx.fillStyle = isHovered ? GOLD2 : "#ffffff"; ctx.fill();
      if (isHovered) {
        ctx.save(); ctx.globalAlpha = 0.85;
        [[0,-10,0,10],[-10,0,10,0]].forEach(([x1,y1,x2,y2]) => {
          const g = ctx.createLinearGradient(dot.x+x1,dot.y+y1,dot.x+x2,dot.y+y2);
          g.addColorStop(0,"rgba(255,255,200,0)"); g.addColorStop(0.5,"rgba(255,240,180,0.9)"); g.addColorStop(1,"rgba(255,255,200,0)");
          ctx.strokeStyle = g; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.moveTo(dot.x+x1,dot.y+y1); ctx.lineTo(dot.x+x2,dot.y+y2); ctx.stroke();
        });
        ctx.restore();
      }
      // sparks
      for (let i = sparkParticles.length-1; i >= 0; i--) {
        const s = sparkParticles[i];
        s.x += s.vx; s.y += s.vy; s.vy += 0.08; s.life -= 0.045;
        if (s.life <= 0) { sparkParticles.splice(i,1); continue; }
        ctx.save(); ctx.globalAlpha = s.life;
        const sg = ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.size*2);
        sg.addColorStop(0,s.color); sg.addColorStop(1,"transparent");
        ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(s.x,s.y,s.size*2,0,Math.PI*2); ctx.fill();
        ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("click", onClick);
      canvas.remove();
    };
  }, []);
  return null;
}

// ─── Scroll Progress Bar ──────────────────────────────────────────────────────
function ScrollProgress() {
  const barRef = useRef(null);
  useEffect(() => {
    const onScroll = () => {
      const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (barRef.current) barRef.current.style.width = pct + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div id="scroll-bar" ref={barRef} style={{ width:"0%" }} />;
}

// ─── Floating Orbs Background ─────────────────────────────────────────────────
function FloatingOrbs() {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", overflow:"hidden" }}>
      <div className="orb" style={{ width:500, height:500, background:`${GOLD}09`, top:"-15%", left:"-10%", animation:"orbFloat 18s ease-in-out infinite" }} />
      <div className="orb" style={{ width:400, height:400, background:`rgba(139,92,246,0.07)`, bottom:"-10%", right:"-8%", animation:"orbFloat 22s 3s ease-in-out infinite" }} />
      <div className="orb" style={{ width:300, height:300, background:`${GOLD}06`, top:"50%", left:"60%", animation:"orbFloat 16s 6s ease-in-out infinite" }} />
    </div>
  );
}

// ─── Marquee Strip ────────────────────────────────────────────────────────────
function MarqueeStrip() {
  const items = ["Web Design ✦","UI/UX ✦","SEO ✦","Business Websites ✦","Portfolio Sites ✦","Tirunelveli ✦","React Dev ✦","Responsive Design ✦","Branding ✦","Digital Presence ✦"];
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow:"hidden", borderTop:`1px solid ${GLASS_BORDER}`, borderBottom:`1px solid ${GLASS_BORDER}`, background:`rgba(201,168,76,0.04)`, padding:"14px 0" }}>
      <div className="marquee-track">
        {doubled.map((it, i) => (
          <span key={i} style={{ marginRight:48, fontSize:13, color:`${GOLD}cc`, fontWeight:600, letterSpacing:2, whiteSpace:"nowrap", fontFamily:"'Jost',sans-serif" }}>{it}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Magnetic Button wrapper ──────────────────────────────────────────────────
function MagBtn({ children, className, onClick, style }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
    const my = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
    el.style.setProperty("--mx", mx + "%");
    el.style.setProperty("--my", my + "%");
    const dx = (e.clientX - rect.left - rect.width / 2) * 0.12;
    const dy = (e.clientY - rect.top  - rect.height / 2) * 0.12;
    el.style.transform = `translate(${dx}px,${dy}px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <button ref={ref} className={className} onClick={onClick} onMouseMove={onMove} onMouseLeave={onLeave} style={style}>
      {children}
    </button>
  );
}

// ─── Tilt Card wrapper ────────────────────────────────────────────────────────
function TiltCard({ children, style = {}, className = "" }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const x = (e.clientY - rect.top  - rect.height / 2) / rect.height * 14;
    const y = -(e.clientX - rect.left - rect.width  / 2) / rect.width  * 14;
    el.style.transform = `rotateX(${x}deg) rotateY(${y}deg) scale(1.03)`;
    el.style.boxShadow = `${-y*2}px ${x*2}px 40px rgba(201,168,76,0.18)`;
  };
  const onLeave = () => {
    if (ref.current) { ref.current.style.transform = ""; ref.current.style.boxShadow = ""; }
  };
  return (
    <div ref={ref} className={`tilt-card ${className}`} onMouseMove={onMove} onMouseLeave={onLeave} style={{ transformStyle:"preserve-3d", transition:"transform 0.15s ease, box-shadow 0.15s ease", ...style }}>
      {children}
    </div>
  );
}


function Navbar({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const links = ["Home","About","Services","Portfolio","Booking","Contact","Admin"];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={scrolled ? "scrolled" : ""} style={{
      position:"fixed", top:0, left:0, right:0, zIndex:1000,
      padding:"0 5%", display:"flex", alignItems:"center", justifyContent:"space-between",
      height:72, background:"transparent",
    }}>
      {/* Logo */}
      <div onClick={() => setPage("Home")} style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:0 }}>
        <span style={{
          fontFamily:"'Cinzel Decorative', serif",
          fontSize:20,
          fontWeight:900,
          letterSpacing:3,
          background:`linear-gradient(135deg, #fff 0%, ${GOLD2} 30%, ${GOLD} 55%, ${GOLD2} 75%, #fff 100%)`,
          backgroundSize:"300% 100%",
          WebkitBackgroundClip:"text",
          WebkitTextFillColor:"transparent",
          backgroundClip:"text",
          animation:"textShimmer 3s linear infinite",
          textShadow:"none",
          filter:`drop-shadow(0 0 8px ${GOLD}88)`,
          position:"relative",
        }}>
          JANZA
        </span>
        <span style={{
          fontFamily:"'Italiana', serif",
          fontSize:22,
          fontWeight:400,
          letterSpacing:5,
          background:`linear-gradient(135deg, ${GOLD2} 0%, #fff 40%, ${GOLD2} 100%)`,
          backgroundSize:"200% 100%",
          WebkitBackgroundClip:"text",
          WebkitTextFillColor:"transparent",
          backgroundClip:"text",
          animation:"textShimmer 4s 1s linear infinite",
          marginLeft:4,
          position:"relative",
          top:1,
        }}>
          Studio
        </span>
      </div>

      {/* Desktop links */}
      <div style={{ display:"flex", gap:28, alignItems:"center" }} className="desktop-nav">
        {links.filter(l => l !== "Admin").map(l => (
          <button key={l} onClick={() => setPage(l)} className="hover-line" style={{
            background:"none", border:"none", cursor:"pointer",
            color: page===l ? GOLD : "rgba(232,224,208,0.75)",
            fontFamily:"'Jost',sans-serif", fontSize:14, fontWeight:500, letterSpacing:0.5,
            transition:"color 0.3s",
          }}>{l}</button>
        ))}
        <button onClick={() => setPage("Admin")} className="btn-outline" style={{ padding:"9px 22px", fontSize:13, display:"flex", alignItems:"center", gap:6 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          Admin
        </button>
      </div>

      {/* Mobile hamburger */}
      <button onClick={() => setMenuOpen(!menuOpen)} style={{
        display:"none", background:"none", border:"none", cursor:"pointer",
        color: GOLD, fontSize:24,
      }} className="hamburger">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>

      {/* Mobile drawer */}
      <div style={{
        position:"fixed", top:0, right:0, width:260, height:"100vh",
        background: DARK2, borderLeft:`1px solid ${GLASS_BORDER}`,
        padding:"80px 32px 32px",
        display:"flex", flexDirection:"column", gap:20,
        transform: menuOpen ? "translateX(0)" : "translateX(100%)",
        transition:"transform 0.4s ease", zIndex:2000,
      }}>
        <button onClick={() => setMenuOpen(false)} style={{
          position:"absolute", top:20, right:20,
          background:"none", border:"none", color: GOLD, fontSize:22, cursor:"pointer",
        }}>✕</button>
        {links.map(l => (
          <button key={l} onClick={() => { setPage(l); setMenuOpen(false); }} style={{
            background:"none", border:"none", cursor:"pointer",
            color: page===l ? GOLD : "#e8e0d0",
            fontFamily:"'Jost',sans-serif", fontSize:17, fontWeight:500,
            textAlign:"left", padding:"6px 0", borderBottom:`1px solid ${GLASS_BORDER}`,
          }}>{l}</button>
        ))}
      </div>

      <style>{`
        @media(max-width:768px){
          .desktop-nav { display:none !important; }
          .hamburger { display:block !important; }
        }
      `}</style>
    </nav>
  );
}

// ─── WhatsApp FAB ─────────────────────────────────────────────────────────────
function WhatsAppFAB() {
  return (
    <a href="https://wa.me/919876543210?text=Hi%20Janisha%2C%20I%20need%20your%20services!" target="_blank" rel="noreferrer"
      style={{
        position:"fixed", bottom:30, right:30, zIndex:999,
        width:58, height:58, borderRadius:"50%",
        background:"#25D366", display:"flex", alignItems:"center", justifyContent:"center",
        boxShadow:"0 6px 24px rgba(37,211,102,0.5)", cursor:"pointer",
        textDecoration:"none", fontSize:28,
      }}>
      <span role="img" aria-label="whatsapp"><svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></span>
      <div style={{
        position:"absolute", inset:-4, borderRadius:"50%",
        border:"2px solid #25D366", animation:"pulse-ring 2s ease-out infinite",
      }} />
    </a>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ children, style = {} }) {
  const [ref, inView] = useInView();
  return (
    <section ref={ref} className={`reveal ${inView ? "visible" : ""}`} style={{ padding:"100px 5%", ...style }}>
      {children}
    </section>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ setPage }) {
  const [statsRef, statsInView] = useInView();
  const websites = useCountUp(50, statsInView);
  const clients  = useCountUp(20, statsInView);
  const satis    = useCountUp(100, statsInView);

  const services = [
    { icon: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <rect x="4" y="8" width="28" height="20" rx="3" stroke={GOLD} strokeWidth="1.5" fill={`${GOLD}12`}/>
          <rect x="8" y="12" width="8" height="6" rx="1" stroke={GOLD} strokeWidth="1" fill={`${GOLD}20`}/>
          <line x1="20" y1="13" x2="28" y2="13" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
          <line x1="20" y1="17" x2="26" y2="17" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
          <line x1="8" y1="22" x2="28" y2="22" stroke={GOLD} strokeWidth="1" opacity="0.3"/>
          <rect x="14" y="28" width="8" height="3" rx="1" stroke={GOLD} strokeWidth="1" fill={`${GOLD}15`}/>
          <line x1="10" y1="31" x2="26" y2="31" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
        </svg>
      ), title:"Business Websites", desc:"Stunning sites for bakeries, gyms, hotels, cafes, tour planners & salons." },
    { icon: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="13" r="7" stroke={GOLD} strokeWidth="1.5" fill={`${GOLD}12`}/>
          <circle cx="18" cy="13" r="3" stroke={GOLD} strokeWidth="1.2" fill={`${GOLD}25`}/>
          <path d="M6 30 C6 24 30 24 30 30" stroke={GOLD} strokeWidth="1.5" fill={`${GOLD}12`} strokeLinecap="round"/>
          <line x1="8" y1="22" x2="28" y2="22" stroke={GOLD} strokeWidth="1" opacity="0.3"/>
        </svg>
      ), title:"Portfolio Websites", desc:"Personal portfolios that make you unforgettable to clients & employers." },
  ];

  const testimonials = [
    { name:"Priya Bakery", role:"Bakery Owner, Tirunelveli", text:"Janisha transformed our bakery's online presence. Orders doubled within a month!" },
    { name:"FitZone Gym", role:"Gym Director", text:"Our new gym website is stunning. Members love booking sessions online now." },
    { name:"Royal Cafe", role:"Cafe Owner", text:"The website is absolutely gorgeous. Exactly the luxury feel we wanted." },
  ];

  return (
    <div style={{ position:"relative" }}>
      {/* Hero */}
      <div style={{
        minHeight:"100vh", display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        textAlign:"center", padding:"120px 5% 80px",
        position:"relative", overflow:"hidden",
      }}>
        {/* Decorative rings */}
        <div style={{
          position:"absolute", width:600, height:600,
          borderRadius:"50%", border:`1px solid rgba(201,168,76,0.08)`,
          top:"50%", left:"50%", transform:"translate(-50%,-50%)",
          pointerEvents:"none",
        }} />
        <div style={{
          position:"absolute", width:400, height:400,
          borderRadius:"50%", border:`1px solid rgba(201,168,76,0.12)`,
          top:"50%", left:"50%", transform:"translate(-50%,-50%)",
          pointerEvents:"none",
        }} />

        {/* Badge */}
        <div className="fade-up" style={{
          display:"inline-flex", alignItems:"center", gap:10,
          background:`linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))`,
          border:`1px solid ${GOLD}44`,
          borderRadius:50, padding:"10px 24px", marginBottom:32,
          fontSize:12, color: GOLD2, letterSpacing:3, fontWeight:600,
          boxShadow:`0 0 20px ${GOLD}22`,
        }}>
          <svg width="12" height="12" viewBox="0 0 20 20" fill={GOLD}><path d="M10 0L11.5 8.5L20 10L11.5 11.5L10 20L8.5 11.5L0 10L8.5 8.5Z"/></svg>
          TIRUNELVELI'S PREMIUM DIGITAL STUDIO
          <svg width="12" height="12" viewBox="0 0 20 20" fill={GOLD}><path d="M10 0L11.5 8.5L20 10L11.5 11.5L10 20L8.5 11.5L0 10L8.5 8.5Z"/></svg>
        </div>

        <h1 className="fade-up-d1 playfair" style={{ fontSize:"clamp(38px,7vw,80px)", lineHeight:1.1, marginBottom:16 }}>
          <SparkleText size={48}>JanzaStudio</SparkleText>
          <br />
          <em style={{ fontStyle:"italic", fontSize:"clamp(22px,4vw,48px)" }} className="shimmer-text">
            Your Creative Studio
          </em>
        </h1>

        {/* Tagline sparkle */}
        <div className="fade-up-d2" style={{
          position:"relative", display:"inline-block",
          marginBottom:20,
        }}>
          <p className="cormorant" style={{
            fontSize:"clamp(18px,2.5vw,28px)",
            color: GOLD2,
            maxWidth:640, lineHeight:1.6,
            fontStyle:"italic", fontWeight:500,
            textShadow:`0 0 30px ${GOLD}66, 0 0 60px ${GOLD}33`,
          }}>
            ✦ {TAGLINE} ✦
          </p>
        </div>

        <p className="fade-up-d2 cormorant" style={{ fontSize:"clamp(16px,2vw,22px)", color:"rgba(232,224,208,0.55)", maxWidth:520, marginBottom:32, lineHeight:1.6 }}>
          From concept to launch — beautifully crafted digital experiences that grow your business.
        </p>

        {/* Domain link */}
        <div className="fade-up-d3" style={{ marginBottom:32 }}>
          <DomainLink />
        </div>

        <div className="fade-up-d3" style={{ display:"flex", gap:16, flexWrap:"wrap", justifyContent:"center" }}>
          <MagBtn className="btn-gold" onClick={() => setPage("Services")}>Explore Services</MagBtn>
          <MagBtn className="btn-outline" onClick={() => setPage("Portfolio")}>View Portfolio</MagBtn>
        </div>

        {/* Floating badge */}
        <div className="float fade-up-d4" style={{
          marginTop:64,
          background:GLASS, border:`1px solid ${GLASS_BORDER}`,
          borderRadius:16, padding:"12px 24px",
          fontSize:13, color:"rgba(232,224,208,0.6)",
          display:"inline-flex", alignItems:"center", gap:8,
        }}>
          <span style={{ width:8, height:8, borderRadius:"50%", background:"#4ade80", display:"inline-block" }} />
          Available for new projects · Tirunelveli, TN
        </div>
      </div>

      {/* Stats */}
      <div ref={statsRef} style={{
        padding:"80px 5%",
        display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:28, textAlign:"center",
      }}>
        {[
          { val: websites, suffix:"+", label:"Websites Built", icon:<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg> },
          { val: clients,  suffix:"+", label:"Happy Clients",  icon:<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
          { val: satis,    suffix:"%", label:"Satisfaction Rate", icon:<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> },
        ].map((s,i) => (
          <div key={i} className="stat-card neon-glow swipe-in" style={{ animationDelay:`${i*0.12}s` }}>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:16, opacity:0.8 }}>{s.icon}</div>
            <div className="playfair shimmer-text" style={{ fontSize:"clamp(38px,5vw,64px)", fontWeight:700, lineHeight:1 }}>
              {s.val}{s.suffix}
            </div>
            <div style={{ color:"rgba(232,224,208,0.5)", fontSize:13, marginTop:10, letterSpacing:2, textTransform:"uppercase", fontFamily:"'Rajdhani',sans-serif", fontWeight:600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Services overview */}
      <Section>
        <div style={{ textAlign:"center", marginBottom:64 }}>
          <div className="section-label" style={{ justifyContent:"center" }}>WHAT WE DO</div>
          <h2 className="playfair" style={{ fontSize:"clamp(28px,4vw,52px)", marginBottom:16 }}>
            Our <span className="grad-text">Services</span>
          </h2>
          <div className="gold-divider" />
          <p style={{ color:"rgba(232,224,208,0.5)", fontSize:16, maxWidth:480, margin:"0 auto" }}>Tailored digital solutions built to grow your business</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:24 }}>
          {services.map((s,i) => (
            <TiltCard key={i} className="glass-card swipe-in" style={{
              padding:40, cursor:"pointer", animationDelay:`${i*0.12}s`,
            }}>
              <div style={{ marginBottom:22 }}>{s.icon}</div>
              <h3 className="playfair" style={{ fontSize:22, marginBottom:14, color:"#fff" }}>{s.title}</h3>
              <p style={{ color:"rgba(232,224,208,0.55)", lineHeight:1.8, fontSize:15 }}>{s.desc}</p>
              <div style={{ marginTop:20, display:"flex", alignItems:"center", gap:6, color:GOLD, fontSize:13, fontWeight:600, letterSpacing:1 }}>
                <span>Learn More</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>
              </div>
            </TiltCard>
          ))}
        </div>
        <div style={{ textAlign:"center", marginTop:52 }}>
          <MagBtn className="btn-gold" onClick={() => setPage("Services")}>View All Services</MagBtn>
        </div>
      </Section>

      {/* Portfolio preview */}
      <Section style={{ background:`linear-gradient(180deg, transparent, rgba(201,168,76,0.03), transparent)` }}>
        <div style={{ textAlign:"center", marginBottom:64 }}>
          <div className="section-label" style={{ justifyContent:"center" }}>OUR WORK</div>
          <h2 className="playfair" style={{ fontSize:"clamp(28px,4vw,52px)", marginBottom:16 }}>
            Featured <span className="grad-text">Portfolio</span>
          </h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:20 }}>
          {[
            { svgKey:"bakery",  cat:"Bakery Website",  name:"Maara Bakes",           color:"#C9A84C", live:true },
            { svgKey:"gym",     cat:"Gym Website",     name:"FitZone Pro",            color:"#EF4444" },
            { svgKey:"cafe",    cat:"Cafe Website",    name:"Royal Brew Cafe",        color:"#F59E0B" },
            { svgKey:"tour",    cat:"Tour Planner",    name:"Tamil Nadu Tours",       color:"#10B981" },
            { svgKey:"hotel",   cat:"Hotel Website",   name:"Heritage Residency",     color:"#3B82F6" },
            { svgKey:"salon",   cat:"Salon Website",   name:"Glam & Grace Salon",     color:"#EC4899" },
          ].map((p,i) => (
            <TiltCard key={i} className="glass-card swipe-in" style={{ padding:24, cursor:"pointer", animationDelay:`${i*0.09}s` }}>
              <div style={{
                width:48, height:48, borderRadius:10, marginBottom:14,
                background:`${p.color}18`, display:"flex", alignItems:"center", justifyContent:"center",
              }}><ProjectIllustration svgKey={p.svgKey} color={p.color} /></div>
              <div style={{ fontSize:10, color: GOLD, letterSpacing:2, fontWeight:600, marginBottom:4, display:"flex", alignItems:"center", gap:6 }}>
                {p.cat.toUpperCase()}
                {p.live && <span style={{ background:`linear-gradient(135deg,${GOLD},${GOLD2})`, color:"#0A0A0F", borderRadius:50, padding:"1px 7px", fontSize:8, fontWeight:700 }}>LIVE</span>}
              </div>
              <div className="playfair" style={{ fontSize:16 }}>{p.name}</div>
            </TiltCard>
          ))}
        </div>
        <div style={{ textAlign:"center", marginTop:48 }}>
          <MagBtn className="btn-outline" onClick={() => setPage("Portfolio")}>View Full Portfolio →</MagBtn>
        </div>
      </Section>

      {/* Testimonials */}
      <Section>
        <div style={{ textAlign:"center", marginBottom:64 }}>
          <div className="section-label" style={{ justifyContent:"center" }}>TESTIMONIALS</div>
          <h2 className="playfair" style={{ fontSize:"clamp(28px,4vw,52px)", marginBottom:16 }}>
            Client <span className="grad-text">Stories</span>
          </h2>
          <div className="gold-divider" />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:28 }}>
          {testimonials.map((t,i) => (
            <TiltCard key={i} className="glass-card" style={{ padding:36, position:"relative", animationDelay:`${i*0.1}s` }}>
              {/* Quote mark */}
              <div style={{
                fontFamily:"'Playfair Display',serif", fontSize:80, color:GOLD,
                lineHeight:0.8, marginBottom:20, opacity:0.25, userSelect:"none",
              }}>"</div>
              <p style={{ color:"rgba(232,224,208,0.8)", lineHeight:1.9, fontSize:15, marginBottom:28, fontStyle:"italic" }}>{t.text}</p>
              <div style={{ borderTop:`1px solid rgba(201,168,76,0.15)`, paddingTop:18, display:"flex", alignItems:"center", gap:14 }}>
                <div style={{
                  width:40, height:40, borderRadius:"50%",
                  background:`linear-gradient(135deg,${GOLD},${GOLD2})`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontFamily:"'Playfair Display',serif", fontWeight:700, color:"#0A0A0F", fontSize:16,
                  flexShrink:0,
                }}>{t.name[0]}</div>
                <div>
                  <div style={{ fontWeight:600, fontSize:15, color:"#fff" }}>{t.name}</div>
                  <div style={{ fontSize:12, color:GOLD, marginTop:2, letterSpacing:0.5 }}>{t.role}</div>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </Section>

      {/* CTA banner */}
      <div style={{
        margin:"0 5% 100px",
        background:`linear-gradient(135deg, rgba(201,168,76,0.12) 0%, rgba(10,10,15,0.8) 50%, rgba(201,168,76,0.08) 100%)`,
        border:`1px solid rgba(201,168,76,0.25)`,
        borderRadius:28, padding:"70px 40px", textAlign:"center",
        position:"relative", overflow:"hidden",
        boxShadow:`0 0 60px rgba(201,168,76,0.08)`,
      }}>
        {/* Decorative circles */}
        <div style={{ position:"absolute", top:-80, right:-80, width:260, height:260, borderRadius:"50%", background:`rgba(201,168,76,0.04)`, border:`1px solid rgba(201,168,76,0.08)` }} />
        <div style={{ position:"absolute", bottom:-60, left:-60, width:200, height:200, borderRadius:"50%", background:`rgba(201,168,76,0.03)`, border:`1px solid rgba(201,168,76,0.06)` }} />
        <div className="section-label" style={{ justifyContent:"center", marginBottom:24 }}>START YOUR JOURNEY</div>
        <h2 className="playfair" style={{ fontSize:"clamp(24px,3.5vw,48px)", marginBottom:20 }}>
          Ready to Enter Your <SparkleText size={32}>Studio?</SparkleText>
        </h2>
        <p style={{ color:GOLD2, marginBottom:10, fontSize:20, fontStyle:"italic", fontFamily:"'Cormorant Garamond',serif", textShadow:`0 0 20px ${GOLD}66` }}>
          ✦ {TAGLINE} ✦
        </p>
        <p style={{ color:"rgba(232,224,208,0.45)", marginBottom:40, fontSize:15 }}>
          Book a free consultation today and let's launch your digital world.
        </p>
        <div style={{ display:"flex", gap:20, justifyContent:"center", flexWrap:"wrap" }}>
          <MagBtn className="btn-gold" onClick={() => setPage("Booking")}>Book Free Consultation</MagBtn>
          <MagBtn className="btn-outline" onClick={() => setPage("Contact")}>Get in Touch</MagBtn>
        </div>
      </div>
    </div>
  );
}

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────
function AboutPage() {
  const skills = ["Web Design","UI/UX","SEO","HTML/CSS","React","Responsive Design","Branding","Figma","Performance Optimization"];
  const skillLevels = [
    { name:"Web Design", pct:95 },
    { name:"UI/UX Design", pct:90 },
    { name:"SEO Optimization", pct:82 },
    { name:"React Development", pct:88 },
  ];
  const [progRef, progInView] = useInView();

  return (
    <div style={{ paddingTop:100 }}>
      {/* Hero */}
      <Section style={{ paddingTop:60 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:60, alignItems:"center" }}>
          <div>
            <div style={{ color: GOLD, fontSize:12, letterSpacing:3, marginBottom:16, fontWeight:600 }}>ABOUT JANISHA</div>
            <h1 className="playfair" style={{ fontSize:"clamp(32px,5vw,56px)", lineHeight:1.2, marginBottom:24 }}>
              Crafting Digital <span className="grad-text">Excellence</span><br/>from Tirunelveli
            </h1>
            <p style={{ color:"rgba(232,224,208,0.7)", lineHeight:1.9, fontSize:16, marginBottom:20 }}>
              Hi, I'm Janisha — a passionate freelance web designer and digital services provider based in the heart of Tirunelveli, Tamil Nadu. I believe every local business deserves a stunning online presence that competes with the best in the world.
            </p>
            <p style={{ color:"rgba(232,224,208,0.7)", lineHeight:1.9, fontSize:16, marginBottom:36 }}>
              With a unique background in both digital design and performing arts, I bring creativity, precision, and a deep understanding of what makes a brand memorable — whether it's a pixel-perfect website or a show-stopping choreography.
            </p>
            <div style={{ display:"flex", gap:32 }}>
              {[["3+","Years Experience"],["50+","Projects Done"],["20+","Happy Clients"]].map(([n,l]) => (
                <div key={l}>
                  <div className="playfair grad-text" style={{ fontSize:36, fontWeight:700 }}>{n}</div>
                  <div style={{ fontSize:12, color:"rgba(232,224,208,0.5)", letterSpacing:0.5 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Photo placeholder */}
          <div style={{ position:"relative", display:"flex", justifyContent:"center" }}>
            <div style={{
              width:320, height:400, borderRadius:24,
              background:`linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.05))`,
              border:`1px solid ${GLASS_BORDER}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:80,
            }}>👩‍💻</div>
            <div style={{
              position:"absolute", bottom:-20, right:0,
              background:DARK2, border:`1px solid ${GLASS_BORDER}`,
              borderRadius:14, padding:"14px 20px",
            }}>
              <div style={{ color: GOLD, fontWeight:700, fontSize:22 }} className="playfair">✦</div>
              <div style={{ fontSize:12, color:"rgba(232,224,208,0.6)" }}>Tirunelveli, TN</div>
            </div>
          </div>
        </div>
      </Section>

      {/* Mission / Vision / Values */}
      <Section>
        <div style={{ textAlign:"center", marginBottom:60 }}>
          <h2 className="playfair" style={{ fontSize:"clamp(28px,4vw,44px)" }}>
            Mission, Vision & <span className="grad-text">Values</span>
          </h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:24 }}>
          {[
            { icon: <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" stroke={GOLD} strokeWidth="1.5" fill={`${GOLD}10`}/><circle cx="20" cy="20" r="8" stroke={GOLD} strokeWidth="1.5" fill={`${GOLD}20`}/><circle cx="20" cy="20" r="2" fill={GOLD}/><line x1="20" y1="2" x2="20" y2="8" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/><line x1="20" y1="32" x2="20" y2="38" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/><line x1="2" y1="20" x2="8" y2="20" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/><line x1="32" y1="20" x2="38" y2="20" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/></svg>, title:"Mission", text:"To empower local businesses with world-class digital presence that drives real growth and meaningful connections." },
            { icon: <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M20 4 L24 16 L36 16 L26 24 L30 36 L20 28 L10 36 L14 24 L4 16 L16 16 Z" stroke={GOLD} strokeWidth="1.5" fill={`${GOLD}15`}/></svg>, title:"Vision", text:"To become Tamil Nadu's most trusted creative studio, where every local brand shines globally." },
            { icon: <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M20 6 C14 6 8 10 8 17 C8 26 20 34 20 34 C20 34 32 26 32 17 C32 10 26 6 20 6Z" stroke={GOLD} strokeWidth="1.5" fill={`${GOLD}15`}/><path d="M20 6 C14 6 8 10 8 17 C8 26 20 34 20 34" stroke={GOLD2} strokeWidth="1" fill="none" opacity="0.5"/></svg>, title:"Values", text:"Integrity, creativity, and excellence in every pixel. Your success is our purpose, your trust is our greatest asset." },
          ].map((m,i) => (
            <TiltCard key={i} className="glass-card swipe-in" style={{ padding:36, textAlign:"center", animationDelay:`${i*0.12}s` }}>
              <div style={{ marginBottom:20, display:"flex", justifyContent:"center" }}>{m.icon}</div>
              <h3 className="playfair grad-text" style={{ fontSize:24, marginBottom:14 }}>{m.title}</h3>
              <p style={{ color:"rgba(232,224,208,0.65)", lineHeight:1.8 }}>{m.text}</p>
            </TiltCard>
          ))}
        </div>
      </Section>

      {/* Skills */}
      <Section>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:60, alignItems:"start" }}>
          <div>
            <div style={{ color: GOLD, fontSize:12, letterSpacing:3, marginBottom:16, fontWeight:600 }}>EXPERTISE</div>
            <h2 className="playfair" style={{ fontSize:"clamp(24px,3.5vw,40px)", marginBottom:36 }}>
              Skills & <span className="grad-text">Specialties</span>
            </h2>
            <div ref={progRef} style={{ display:"flex", flexDirection:"column", gap:20 }}>
              {skillLevels.map((s) => (
                <div key={s.name}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8, fontSize:14 }}>
                    <span>{s.name}</span>
                    <span className="gold">{s.pct}%</span>
                  </div>
                  <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:50, height:6, overflow:"hidden" }}>
                    <div className="progress-bar" style={{
                      "--w":`${s.pct}%`,
                      height:"100%", borderRadius:50,
                      background:`linear-gradient(90deg,${GOLD},${GOLD2})`,
                      width: progInView ? `${s.pct}%` : "0%",
                      transition:"width 1.4s ease",
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ color: GOLD, fontSize:12, letterSpacing:3, marginBottom:16, fontWeight:600 }}>SKILL TAGS</div>
            <h2 className="playfair" style={{ fontSize:"clamp(24px,3.5vw,40px)", marginBottom:36 }}>
              My <span className="grad-text">Toolkit</span>
            </h2>
            <div style={{ display:"flex", flexWrap:"wrap", gap:12 }}>
              {skills.map(s => (
                <span key={s} style={{
                  background:`rgba(201,168,76,0.1)`, border:`1px solid ${GLASS_BORDER}`,
                  borderRadius:50, padding:"8px 18px",
                  fontSize:13, color: GOLD, fontWeight:500,
                  transition:"all 0.3s", cursor:"default",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background=`rgba(201,168,76,0.2)`; e.currentTarget.style.transform="scale(1.05)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background=`rgba(201,168,76,0.1)`; e.currentTarget.style.transform=""; }}
                >{s}</span>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

// ─── SERVICES PAGE ────────────────────────────────────────────────────────────
function ServicesPage({ setPage }) {
  const services = [
    {
      icon: (
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
          <rect x="6" y="10" width="40" height="32" rx="5" stroke="#8B5CF6" strokeWidth="1.8" fill="rgba(139,92,246,0.1)"/>
          <rect x="12" y="16" width="12" height="10" rx="2" stroke="#8B5CF6" strokeWidth="1.4" fill="rgba(139,92,246,0.15)"/>
          <line x1="28" y1="18" x2="40" y2="18" stroke="#8B5CF6" strokeWidth="1.4" strokeLinecap="round" opacity="0.7"/>
          <line x1="28" y1="24" x2="36" y2="24" stroke="#8B5CF6" strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
          <line x1="12" y1="32" x2="40" y2="32" stroke="#8B5CF6" strokeWidth="1.2" opacity="0.35"/>
          <rect x="20" y="42" width="12" height="4" rx="1.5" stroke="#8B5CF6" strokeWidth="1.2" fill="rgba(139,92,246,0.1)"/>
          <line x1="14" y1="46" x2="38" y2="46" stroke="#8B5CF6" strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
        </svg>
      ),
      tagline:"Make Your Business Shine Online",
      desc:"Custom-designed websites for local businesses that attract customers and build credibility.",
      features:["Mobile-responsive design","WhatsApp integration","Google Maps embed","SEO optimization","Fast loading performance","Custom color branding"],
      benefits:["Attract more local customers","Build professional credibility","24/7 online presence","Increase bookings & sales"],
      clients:["Bakeries & Sweet Shops","Gyms & Fitness Centers","Hotels & Resorts","Cafes & Restaurants","Tour Planners","Beauty Salons & Spas"],
      color:"#8B5CF6",
    },
    {
      icon: (
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
          <circle cx="26" cy="18" r="10" stroke="#10B981" strokeWidth="1.8" fill="rgba(16,185,129,0.1)"/>
          <circle cx="26" cy="18" r="4.5" stroke="#10B981" strokeWidth="1.4" fill="rgba(16,185,129,0.2)"/>
          <path d="M9 42 C9 34 43 34 43 42" stroke="#10B981" strokeWidth="1.8" fill="rgba(16,185,129,0.1)" strokeLinecap="round"/>
          <line x1="9" y1="35" x2="43" y2="35" stroke="#10B981" strokeWidth="1" opacity="0.3"/>
        </svg>
      ),
      title:"Personal Portfolio Websites",
      tagline:"Your Work Deserves to Be Seen",
      desc:"Elegant personal portfolios that showcase your skills, projects, and personality to the world.",
      features:["Stunning project galleries","Animated skill displays","Contact & inquiry forms","Blog section","Resume integration","Social media links"],
      benefits:["Stand out to employers","Attract premium clients","Build personal brand","Showcase your best work"],
      clients:["Photographers","Designers & Artists","Freelancers","Developers","Writers","Models & Actors"],
      color:"#10B981",
    },
  ];

  return (
    <div style={{ paddingTop:100 }}>
      <Section style={{ paddingTop:60, textAlign:"center" }}>
        <div style={{ color: GOLD, fontSize:12, letterSpacing:3, marginBottom:16, fontWeight:600 }}>WHAT WE OFFER</div>
        <h1 className="playfair" style={{ fontSize:"clamp(32px,5vw,60px)", marginBottom:20 }}>
          Our <span className="grad-text">Services</span>
        </h1>
        <p style={{ color:"rgba(232,224,208,0.6)", fontSize:18, maxWidth:560, margin:"0 auto" }}>
          Comprehensive digital solutions and creative services tailored for your unique needs.
        </p>
      </Section>

      {services.map((s,i) => (
        <Section key={i}>
          <TiltCard className="glass-card swipe-in" style={{ padding:"48px 40px", position:"relative", overflow:"hidden" }}>
            {/* BG accent */}
            <div style={{
              position:"absolute", top:-40, right:-40,
              width:180, height:180, borderRadius:"50%",
              background:`${s.color}15`, pointerEvents:"none",
              animation:"orbFloat 8s ease-in-out infinite",
            }} />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"start" }}>
              <div>
                <div style={{ marginBottom:20 }}>{s.icon}</div>
                <div style={{ fontSize:11, color: GOLD, letterSpacing:3, fontWeight:600, marginBottom:10 }}>0{i+1}</div>
                <h2 className="playfair" style={{ fontSize:"clamp(22px,3vw,36px)", marginBottom:10 }}>{s.title}</h2>
                <p style={{ color: GOLD, fontStyle:"italic", marginBottom:20, fontSize:16 }} className="cormorant">{s.tagline}</p>
                <p style={{ color:"rgba(232,224,208,0.7)", lineHeight:1.8, marginBottom:28 }}>{s.desc}</p>
                <MagBtn className="btn-gold" onClick={() => setPage("Booking")}>Book This Service</MagBtn>
              </div>
              <div style={{ display:"grid", gap:20 }}>
                <div>
                  <h4 style={{ color: GOLD, fontSize:12, letterSpacing:2, marginBottom:14 }}>FEATURES</h4>
                  <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:8 }}>
                    {s.features.map(f => (
                      <li key={f} style={{ display:"flex", alignItems:"center", gap:10, fontSize:14, color:"rgba(232,224,208,0.75)" }}>
                        <span style={{ color: GOLD }}>✦</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 style={{ color: GOLD, fontSize:12, letterSpacing:2, marginBottom:14 }}>IDEAL FOR</h4>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {s.clients.map(c => (
                      <span key={c} style={{
                        background:`${s.color}15`, border:`1px solid ${s.color}40`,
                        borderRadius:50, padding:"5px 14px", fontSize:12, color: s.color,
                      }}>{c}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TiltCard>
        </Section>
      ))}
    </div>
  );
}

// ─── Animated SVG Illustrations ──────────────────────────────────────────────
function ProjectIllustration({ svgKey, color }) {
  const c = color;
  const illustrations = {
    bakery: (
      <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
        <style>{`@keyframes rise{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}`}</style>
        {/* cake base */}
        <rect x="20" y="70" width="70" height="18" rx="4" fill={`${c}30`} stroke={c} strokeWidth="1.5"/>
        {/* cake middle */}
        <rect x="28" y="52" width="54" height="20" rx="4" fill={`${c}20`} stroke={c} strokeWidth="1.5"/>
        {/* cake top */}
        <rect x="36" y="36" width="38" height="18" rx="4" fill={`${c}15`} stroke={c} strokeWidth="1.5"/>
        {/* candles */}
        <rect x="46" y="24" width="5" height="13" rx="2" fill={`${c}40`} stroke={c} strokeWidth="1"/>
        <rect x="59" y="24" width="5" height="13" rx="2" fill={`${c}40`} stroke={c} strokeWidth="1"/>
        {/* flames */}
        <ellipse cx="48.5" cy="22" rx="3" ry="4" fill={GOLD2} style={{animation:"rise 1.4s ease-in-out infinite"}}/>
        <ellipse cx="61.5" cy="22" rx="3" ry="4" fill={GOLD} style={{animation:"rise 1.4s 0.3s ease-in-out infinite"}}/>
        {/* dots decoration */}
        {[30,40,50,60,70,80].map(x=><circle key={x} cx={x} cy="79" r="2" fill={c} opacity="0.5"/>)}
      </svg>
    ),
    bakery2: (
      <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
        <style>{`@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}`}</style>
        {/* bread loaf */}
        <ellipse cx="55" cy="68" rx="36" ry="14" fill={`${c}25`} stroke={c} strokeWidth="1.5"/>
        <ellipse cx="55" cy="55" rx="30" ry="18" fill={`${c}20`} stroke={c} strokeWidth="1.5" style={{animation:"bob 2s ease-in-out infinite"}}/>
        {/* score lines */}
        <path d="M40 52 Q55 44 70 52" stroke={c} strokeWidth="1.2" fill="none" opacity="0.7"/>
        <path d="M44 58 Q55 51 66 58" stroke={c} strokeWidth="1.2" fill="none" opacity="0.5"/>
        {/* steam */}
        <path d="M42 36 Q44 30 42 24" stroke={GOLD2} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" style={{animation:"bob 2s 0.2s ease-in-out infinite"}}/>
        <path d="M55 32 Q57 26 55 20" stroke={GOLD2} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" style={{animation:"bob 2s 0.5s ease-in-out infinite"}}/>
        <path d="M68 36 Q70 30 68 24" stroke={GOLD2} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" style={{animation:"bob 2s 0.8s ease-in-out infinite"}}/>
      </svg>
    ),
    gym: (
      <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
        <style>{`@keyframes lift{0%,100%{transform:translateY(0)}40%{transform:translateY(-8px)}}`}</style>
        {/* barbell bar */}
        <rect x="22" y="52" width="66" height="6" rx="3" fill={`${c}30`} stroke={c} strokeWidth="1.5" style={{animation:"lift 2s ease-in-out infinite"}}/>
        {/* left weights */}
        <rect x="16" y="44" width="12" height="22" rx="4" fill={`${c}25`} stroke={c} strokeWidth="1.5" style={{animation:"lift 2s ease-in-out infinite"}}/>
        <rect x="10" y="47" width="8" height="16" rx="3" fill={`${c}20`} stroke={c} strokeWidth="1.5" style={{animation:"lift 2s ease-in-out infinite"}}/>
        {/* right weights */}
        <rect x="82" y="44" width="12" height="22" rx="4" fill={`${c}25`} stroke={c} strokeWidth="1.5" style={{animation:"lift 2s ease-in-out infinite"}}/>
        <rect x="92" y="47" width="8" height="16" rx="3" fill={`${c}20`} stroke={c} strokeWidth="1.5" style={{animation:"lift 2s ease-in-out infinite"}}/>
        {/* person silhouette */}
        <circle cx="55" cy="30" r="7" fill={`${c}35`} stroke={c} strokeWidth="1.5"/>
        <path d="M55 37 L55 50" stroke={c} strokeWidth="2" strokeLinecap="round"/>
        <path d="M42 42 L55 46 L68 42" stroke={c} strokeWidth="2" strokeLinecap="round"/>
        <path d="M55 50 L48 65 M55 50 L62 65" stroke={c} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    cafe: (
      <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
        <style>{`@keyframes steam{0%{opacity:0;transform:translateY(0)}50%{opacity:0.8}100%{opacity:0;transform:translateY(-14px)}}`}</style>
        {/* cup */}
        <path d="M32 60 L38 88 H72 L78 60 Z" fill={`${c}20`} stroke={c} strokeWidth="1.5"/>
        {/* saucer */}
        <ellipse cx="55" cy="88" rx="22" ry="5" fill={`${c}15`} stroke={c} strokeWidth="1.5"/>
        {/* handle */}
        <path d="M78 65 Q92 65 92 74 Q92 83 78 83" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* liquid surface */}
        <ellipse cx="55" cy="62" rx="22" ry="5" fill={`${c}30`} stroke={c} strokeWidth="1"/>
        {/* steam wisps */}
        <path d="M44 52 Q46 44 44 36" stroke={GOLD2} strokeWidth="1.5" fill="none" strokeLinecap="round" style={{animation:"steam 2s ease-out infinite"}}/>
        <path d="M55 48 Q57 40 55 32" stroke={GOLD} strokeWidth="1.5" fill="none" strokeLinecap="round" style={{animation:"steam 2s 0.4s ease-out infinite"}}/>
        <path d="M66 52 Q68 44 66 36" stroke={GOLD2} strokeWidth="1.5" fill="none" strokeLinecap="round" style={{animation:"steam 2s 0.8s ease-out infinite"}}/>
      </svg>
    ),
    tour: (
      <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
        <style>{`@keyframes pinBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}`}</style>
        {/* map background */}
        <rect x="18" y="25" width="74" height="60" rx="8" fill={`${c}12`} stroke={c} strokeWidth="1.5"/>
        {/* map lines */}
        <path d="M18 50 Q40 44 55 55 Q70 66 92 58" stroke={c} strokeWidth="1" opacity="0.4" fill="none"/>
        <path d="M18 65 Q35 60 50 68 Q65 75 92 70" stroke={c} strokeWidth="1" opacity="0.3" fill="none"/>
        {/* pin */}
        <circle cx="55" cy="46" r="8" fill={`${c}35`} stroke={c} strokeWidth="1.5" style={{animation:"pinBounce 1.8s ease-in-out infinite"}}/>
        <circle cx="55" cy="46" r="3" fill={c} style={{animation:"pinBounce 1.8s ease-in-out infinite"}}/>
        <path d="M55 54 L55 62" stroke={c} strokeWidth="2" strokeLinecap="round" style={{animation:"pinBounce 1.8s ease-in-out infinite"}}/>
        {/* dotted path */}
        {[0,1,2,3].map(n=><circle key={n} cx={30+n*12} cy={72} r="2" fill={c} opacity={0.5-n*0.1}/>)}
      </svg>
    ),
    hotel: (
      <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
        <style>{`@keyframes glow{0%,100%{opacity:0.4}50%{opacity:1}}`}</style>
        {/* building */}
        <rect x="25" y="35" width="60" height="55" rx="4" fill={`${c}12`} stroke={c} strokeWidth="1.5"/>
        {/* roof */}
        <polygon points="55,18 22,38 88,38" fill={`${c}20`} stroke={c} strokeWidth="1.5"/>
        {/* windows */}
        {[0,1,2].map(col=>[0,1,2].map(row=>(
          <rect key={`${col}-${row}`} x={33+col*16} y={44+row*14} width="9" height="9" rx="2"
            fill={`${c}${row===0?"50":"25"}`} stroke={c} strokeWidth="1"
            style={row===0?{animation:`glow ${1+col*0.3}s ease-in-out infinite`}:{}}/>
        )))}
        {/* door */}
        <rect x="48" y="74" width="14" height="16" rx="2" fill={`${c}30`} stroke={c} strokeWidth="1"/>
        <circle cx="59" cy="82" r="1.5" fill={c}/>
      </svg>
    ),
    salon: (
      <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
        <style>{`@keyframes sparkle{0%,100%{opacity:0;transform:scale(0)}50%{opacity:1;transform:scale(1)}}`}</style>
        {/* mirror frame */}
        <ellipse cx="55" cy="52" rx="26" ry="32" fill={`${c}10`} stroke={c} strokeWidth="1.5"/>
        <ellipse cx="55" cy="52" rx="20" ry="26" fill={`${c}08`} stroke={c} strokeWidth="1" opacity="0.5"/>
        {/* scissors */}
        <path d="M38 80 L55 60 L72 80" stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <circle cx="36" cy="82" r="5" fill="none" stroke={c} strokeWidth="1.5"/>
        <circle cx="74" cy="82" r="5" fill="none" stroke={c} strokeWidth="1.5"/>
        {/* sparkles */}
        <g style={{animation:"sparkle 1.6s ease-in-out infinite"}}><line x1="28" y1="32" x2="28" y2="40" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/><line x1="24" y1="36" x2="32" y2="36" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/></g>
        <g style={{animation:"sparkle 1.6s 0.5s ease-in-out infinite"}}><line x1="78" y1="26" x2="78" y2="34" stroke={GOLD2} strokeWidth="1.5" strokeLinecap="round"/><line x1="74" y1="30" x2="82" y2="30" stroke={GOLD2} strokeWidth="1.5" strokeLinecap="round"/></g>
        <g style={{animation:"sparkle 1.6s 1s ease-in-out infinite"}}><line x1="82" y1="52" x2="82" y2="58" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round"/><line x1="79" y1="55" x2="85" y2="55" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round"/></g>
      </svg>
    ),
    gym2: (
      <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
        <style>{`@keyframes pulse2{0%,100%{r:18}50%{r:22}}`}</style>
        {/* yoga person */}
        <circle cx="55" cy="28" r="8" fill={`${c}30`} stroke={c} strokeWidth="1.5"/>
        {/* body */}
        <path d="M55 36 L55 60" stroke={c} strokeWidth="2" strokeLinecap="round"/>
        {/* arms out like tree pose */}
        <path d="M55 44 Q40 38 30 44" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M55 44 Q70 38 80 44" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none"/>
        {/* legs */}
        <path d="M55 60 L42 80 M55 60 L62 80" stroke={c} strokeWidth="2" strokeLinecap="round"/>
        {/* aura circle */}
        <circle cx="55" cy="55" r="18" stroke={c} strokeWidth="1" strokeDasharray="4 4" opacity="0.4" style={{animation:"spin-slow 6s linear infinite"}}/>
        {/* glow */}
        <circle cx="55" cy="55" r="28" stroke={`${c}`} strokeWidth="0.5" opacity="0.15"/>
      </svg>
    ),
  };
  return illustrations[svgKey] || illustrations["bakery"];
}

// ─── PORTFOLIO PAGE ───────────────────────────────────────────────────────────
function PortfolioPage() {
  const [active, setActive] = useState("All");
  const cats = ["All","Bakery","Gym","Cafe","Tour","Hotel","Salon"];
  const projects = [
    { svgKey:"bakery", cat:"Bakery", name:"Maara Bakes", desc:"Real client project — a delightful bakery website with gallery, menu and WhatsApp ordering. Live & running.", tech:["React","Tailwind","Animation"], color:"#C9A84C", live:true, liveUrl:"#" },
    { svgKey:"bakery2", cat:"Bakery", name:"Sweet Dreams Bakery", desc:"Elegant online store with menu gallery and order form.", tech:["React","Tailwind","Animation"], color:"#8B5CF6" },
    { svgKey:"gym", cat:"Gym", name:"FitZone Pro", desc:"Dynamic gym website with class schedules and trainer profiles.", tech:["HTML","CSS","JS"], color:"#EF4444" },
    { svgKey:"cafe", cat:"Cafe", name:"Royal Brew Cafe", desc:"Warm, inviting cafe site with online menu and reservations.", tech:["React","Framer Motion"], color:"#F59E0B" },
    { svgKey:"tour", cat:"Tour", name:"Tamil Nadu Tours", desc:"Immersive tour planner with destination galleries and booking.", tech:["React","API"], color:"#10B981" },
    { svgKey:"hotel", cat:"Hotel", name:"Heritage Residency", desc:"Luxury hotel website with room showcase and booking engine.", tech:["HTML","CSS","JS"], color:"#3B82F6" },
    { svgKey:"salon", cat:"Salon", name:"Glam & Grace Salon", desc:"Stylish salon site with services menu and appointment booking.", tech:["React","Animation"], color:"#EC4899" },
    { svgKey:"gym2", cat:"Gym", name:"ZenFit Studio", desc:"Yoga and fitness studio with class booking and instructor profiles.", tech:["React"], color:"#EF4444" },
  ];

  const filtered = active === "All" ? projects : projects.filter(p => p.cat === active);

  return (
    <div style={{ paddingTop:100 }}>
      <Section style={{ paddingTop:60, textAlign:"center" }}>
        <div style={{ color: GOLD, fontSize:12, letterSpacing:3, marginBottom:16, fontWeight:600 }}>OUR WORK</div>
        <h1 className="playfair" style={{ fontSize:"clamp(32px,5vw,60px)", marginBottom:20 }}>
          Portfolio <span className="grad-text">Showcase</span>
        </h1>
        <p style={{ color:"rgba(232,224,208,0.6)", fontSize:17, maxWidth:520, margin:"0 auto 40px" }}>
          A curated selection of websites and projects we're proud to call our own.
        </p>

        {/* Filter tabs */}
        <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
          {cats.map(c => (
            <button key={c} onClick={() => setActive(c)} style={{
              background: active===c ? `linear-gradient(135deg,${GOLD},${GOLD2})` : "transparent",
              border:`1px solid ${active===c ? GOLD : GLASS_BORDER}`,
              borderRadius:50, padding:"9px 22px",
              color: active===c ? "#0A0A0F" : "rgba(232,224,208,0.6)",
              fontFamily:"'Jost',sans-serif", fontSize:14, fontWeight:500, cursor:"pointer",
              transition:"all 0.3s",
            }}>{c}</button>
          ))}
        </div>
      </Section>

      <Section style={{ paddingTop:20 }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:28 }} className="stagger">
          {filtered.map((p,i) => (
            <div key={i} className="flip-wrap swipe-in" style={{ height:340, animationDelay:`${i*0.08}s` }}>
              <div className="flip-inner" style={{ height:"100%" }}>
                {/* FRONT */}
                <div className="flip-front glass-card" style={{ height:"100%", overflow:"hidden" }}>
                  <div style={{
                    height:180, background:`linear-gradient(135deg,${p.color}20,${p.color}06)`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    position:"relative", overflow:"hidden",
                  }}>
                    {/* animated bg pattern */}
                    <div style={{
                      position:"absolute", inset:0,
                      background:`radial-gradient(circle at 30% 70%, ${p.color}15, transparent 60%)`,
                      animation:"orbFloat 6s ease-in-out infinite",
                    }}/>
                    <ProjectIllustration svgKey={p.svgKey} color={p.color} />
                    <div style={{
                      position:"absolute", top:12, right:12,
                      background:`${p.color}25`, border:`1px solid ${p.color}50`,
                      borderRadius:50, padding:"4px 12px",
                      fontSize:11, color:p.color, fontWeight:600, backdropFilter:"blur(4px)",
                    }}>{p.cat}</div>
                    {p.live && (
                      <div style={{
                        position:"absolute", top:12, left:12,
                        background:`linear-gradient(135deg,${GOLD},${GOLD2})`,
                        borderRadius:50, padding:"4px 12px",
                        fontSize:10, color:"#0A0A0F", fontWeight:700, letterSpacing:1,
                        display:"flex", alignItems:"center", gap:5,
                      }}>
                        <span style={{ width:5, height:5, borderRadius:"50%", background:"#0A0A0F", display:"inline-block", animation:"pulse-ring 1.5s ease-out infinite" }} />
                        LIVE
                      </div>
                    )}
                    {/* flip hint */}
                    <div style={{ position:"absolute", bottom:8, right:10, fontSize:10, color:`${p.color}80`, letterSpacing:1 }}>hover to flip ↺</div>
                  </div>
                  <div style={{ padding:22 }}>
                    <h3 className="playfair" style={{ fontSize:19, marginBottom:6 }}>{p.name}</h3>
                    <p style={{ color:"rgba(232,224,208,0.55)", fontSize:12, lineHeight:1.5 }}>{p.desc.substring(0,60)}…</p>
                  </div>
                </div>
                {/* BACK */}
                <div className="flip-back">
                  <div style={{ fontSize:36, marginBottom:14 }}>
                    <ProjectIllustration svgKey={p.svgKey} color={p.color} />
                  </div>
                  <h3 className="playfair grad-text" style={{ fontSize:20, marginBottom:10 }}>{p.name}</h3>
                  <p style={{ color:"rgba(232,224,208,0.7)", fontSize:13, lineHeight:1.7, marginBottom:16 }}>{p.desc}</p>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap", justifyContent:"center", marginBottom:14 }}>
                    {p.tech.map(t => (
                      <span key={t} style={{
                        background:`${p.color}20`, border:`1px solid ${p.color}50`,
                        borderRadius:4, padding:"3px 10px", fontSize:11, color:p.color,
                      }}>{t}</span>
                    ))}
                  </div>
                  {p.live && (
                    <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{
                      display:"inline-flex", alignItems:"center", gap:6,
                      background:`linear-gradient(135deg,${GOLD},${GOLD2})`,
                      color:"#0A0A0F", borderRadius:50, padding:"8px 20px",
                      fontSize:13, fontWeight:700, textDecoration:"none",
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      View Live Site
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ─── BOOKING PAGE ─────────────────────────────────────────────────────────────
function BookingPage() {
  const empty = { name:"", phone:"", email:"", service:"", date:"", time:"", message:"" };
  const [form, setForm] = useState(empty);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState(""); // "sent" | "failed" | ""

  // ── EmailJS Config ─────────────────────────────────────────────
  // STEP 1: Replace with your EmailJS Public Key
  const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";
  // STEP 2: Replace with your EmailJS Service ID
  const EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID";
  // STEP 3: Replace with your EmailJS Template ID
  const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
  // ───────────────────────────────────────────────────────────────

  const services = ["Business Website (Bakery / Gym / Hotel / Cafe / Tour / Salon)","Personal Portfolio Website","SEO & Digital Marketing","Website Maintenance","Other / Consultation"];
  const times = ["09:00 AM","10:00 AM","11:00 AM","12:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM","06:00 PM"];

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^\d{10}$/.test(form.phone)) e.phone = "Valid 10-digit phone required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.service) e.service = "Please select a service";
    if (!form.date) e.date = "Please pick a date";
    if (!form.time) e.time = "Please pick a time slot";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    // Save to localStorage
    const bookings = loadBookings();
    const newBooking = { ...form, id: Date.now(), status:"Pending", createdAt: new Date().toISOString() };
    bookings.push(newBooking);
    saveBookings(bookings);

    // Send email via EmailJS
    setSending(true);
    try {
      // Load EmailJS SDK dynamically
      if (!window.emailjs) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
        window.emailjs.init(EMAILJS_PUBLIC_KEY);
      }

      await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        to_name:      "Janisha",
        to_email:     "janishasanthakumar@gmail.com",
        from_name:    form.name,
        from_email:   form.email,
        phone:        form.phone,
        service:      form.service,
        date:         form.date,
        time:         form.time,
        message:      form.message || "No additional message",
        reply_to:     form.email,
      });

      setEmailStatus("sent");
    } catch (err) {
      console.error("EmailJS error:", err);
      setEmailStatus("failed");
    }

    setSending(false);
    setSubmitted(true);
    setForm(empty);
    setErrors({});
  };

  const F = ({ label, name, type="text", as="input", options=[] }) => (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      <label style={{ fontSize:13, color:"rgba(232,224,208,0.55)", letterSpacing:0.5 }}>{label}</label>
      {as === "select" ? (
        <select className="inp" value={form[name]} onChange={e => setForm({...form,[name]:e.target.value})}>
          <option value="">Select...</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : as === "textarea" ? (
        <textarea className="inp" rows={4} placeholder={`Your ${label.toLowerCase()}...`} value={form[name]} onChange={e => setForm({...form,[name]:e.target.value})} />
      ) : (
        <input className="inp" type={type} placeholder={`Your ${label.toLowerCase()}...`} value={form[name]} onChange={e => setForm({...form,[name]:e.target.value})} />
      )}
      {errors[name] && <span style={{ fontSize:12, color:"#EF4444" }}>⚠ {errors[name]}</span>}
    </div>
  );

  return (
    <div style={{ paddingTop:100 }}>
      <Section style={{ paddingTop:60 }}>
        <div style={{ maxWidth:720, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:60 }}>
            <div style={{ color: GOLD, fontSize:12, letterSpacing:3, marginBottom:16, fontWeight:600 }}>GET STARTED</div>
            <h1 className="playfair" style={{ fontSize:"clamp(28px,4vw,52px)", marginBottom:16 }}>
              Book an <span className="grad-text">Appointment</span>
            </h1>
            <p style={{ color:"rgba(232,224,208,0.6)", fontSize:16 }}>
              Fill the form below and we'll get back to you within 24 hours.
            </p>
          </div>

          {submitted ? (
            <div className="glass-card" style={{ padding:60, textAlign:"center" }}>
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none" style={{margin:"0 auto 24px",display:"block"}}><circle cx="36" cy="36" r="32" stroke={GOLD} strokeWidth="2" fill={`${GOLD}12`}/><polyline points="22,36 31,46 50,26" stroke={GOLD} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <h2 className="playfair grad-text" style={{ fontSize:32, marginBottom:16 }}>Appointment Requested!</h2>
              <p style={{ color:"rgba(232,224,208,0.7)", fontSize:17, lineHeight:1.8, marginBottom:16 }}>
                Your appointment request has been received.<br/>We will contact you soon.
              </p>
              {/* Email status */}
              {emailStatus === "sent" && (
                <div style={{
                  display:"inline-flex", alignItems:"center", gap:8,
                  background:"rgba(74,222,128,0.1)", border:"1px solid rgba(74,222,128,0.3)",
                  borderRadius:50, padding:"8px 20px", marginBottom:24,
                  fontSize:13, color:"#4ade80",
                }}>
                  ✅ Email notification sent to janishasanthakumar@gmail.com
                </div>
              )}
              {emailStatus === "failed" && (
                <div style={{
                  display:"inline-flex", alignItems:"center", gap:8,
                  background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)",
                  borderRadius:50, padding:"8px 20px", marginBottom:24,
                  fontSize:13, color:"#f87171",
                }}>
                  ⚠ Booking saved but email failed — check EmailJS setup
                </div>
              )}
              <br/>
              <button className="btn-gold" style={{ marginTop:8 }} onClick={() => { setSubmitted(false); setEmailStatus(""); }}>Book Another</button>
            </div>
          ) : (
            <div className="glass-card" style={{ padding:"48px 40px" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
                <F label="Full Name" name="name" />
                <F label="Phone Number" name="phone" type="tel" />
                <F label="Email Address" name="email" type="email" />
                <F label="Service" name="service" as="select" options={services} />
                <F label="Preferred Date" name="date" type="date" />
                <F label="Preferred Time" name="time" as="select" options={times} />
              </div>
              <div style={{ marginTop:24 }}>
                <F label="Message / Additional Details" name="message" as="textarea" />
              </div>
              <div style={{ marginTop:32, textAlign:"center" }}>
                <MagBtn className="btn-gold" onClick={handleSubmit} style={{ fontSize:16, padding:"16px 48px", opacity: sending ? 0.7 : 1 }}>
                  {sending ? "⏳ Sending..." : "Confirm Appointment →"}
                </MagBtn>
                {sending && (
                  <p style={{ color:`${GOLD}99`, fontSize:13, marginTop:12 }}>
                    Saving your booking & sending email notification...
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}

// ─── Animated Contact Icons ───────────────────────────────────────────────────
function IconEmail() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <style>{`@keyframes dash{to{stroke-dashoffset:0}}`}</style>
      <rect x="2" y="4" width="20" height="16" rx="3" stroke={GOLD} strokeWidth="1.6" fill="none"
        strokeDasharray="72" strokeDashoffset="72" style={{animation:"dash 1s ease forwards"}}/>
      <path d="M2 8 L12 14 L22 8" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round" fill="none"
        strokeDasharray="24" strokeDashoffset="24" style={{animation:"dash 0.8s 0.4s ease forwards"}}/>
    </svg>
  );
}
function IconLocation() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <style>{`@keyframes pinDrop{0%{transform:translateY(-6px);opacity:0}100%{transform:translateY(0);opacity:1}}`}</style>
      <g style={{animation:"pinDrop 0.7s ease forwards"}}>
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
          stroke={GOLD} strokeWidth="1.6" fill={`${GOLD}18`}/>
        <circle cx="12" cy="9" r="2.5" stroke={GOLD} strokeWidth="1.4" fill="none"/>
      </g>
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <style>{`@keyframes rotatHand{from{transform:rotate(0deg);transform-origin:12px 12px}to{transform:rotate(360deg);transform-origin:12px 12px}}`}</style>
      <circle cx="12" cy="12" r="9" stroke={GOLD} strokeWidth="1.6" fill="none"/>
      <line x1="12" y1="7" x2="12" y2="12" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round"
        style={{animation:"rotatHand 6s linear infinite", transformOrigin:"12px 12px"}}/>
      <line x1="12" y1="12" x2="16" y2="14" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="1.2" fill={GOLD}/>
    </svg>
  );
}

// ─── CONTACT PAGE ─────────────────────────────────────────────────────────────
function ContactPage() {
  const [form, setForm] = useState({ name:"", email:"", message:"" });
  const [sent, setSent] = useState(false);

  const info = [
    { IconComp: IconEmail,    label:"Email",     val:"janishasanthakumar@gmail.com" },
    { IconComp: IconLocation, label:"Location",  val:"Tirunelveli, Tamil Nadu, India" },
    { IconComp: IconClock,    label:"Available", val:"Mon–Sat, 9 AM – 7 PM" },
  ];

  return (
    <div style={{ paddingTop:100 }}>
      <Section style={{ paddingTop:60 }}>
        <div style={{ textAlign:"center", marginBottom:60 }}>
          <div style={{ color: GOLD, fontSize:12, letterSpacing:3, marginBottom:16, fontWeight:600 }}>LET'S TALK</div>
          <h1 className="playfair" style={{ fontSize:"clamp(28px,4vw,52px)" }}>
            Get in <span className="grad-text">Touch</span>
          </h1>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:40 }}>
          {/* Info */}
          <div>
            <div style={{ display:"grid", gap:20, marginBottom:32 }}>
              {info.map((c,i) => (
                <div key={i} className="glass-card" style={{ padding:20, display:"flex", alignItems:"center", gap:16 }}>
                  <div style={{
                    width:48, height:48, borderRadius:12,
                    background:`rgba(201,168,76,0.1)`, display:"flex",
                    alignItems:"center", justifyContent:"center", flexShrink:0,
                  }}><c.IconComp /></div>
                  <div>
                    <div style={{ fontSize:11, color: GOLD, letterSpacing:2, marginBottom:2 }}>{c.label.toUpperCase()}</div>
                    <div style={{ fontSize:15 }}>{c.val}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Map embed */}
            <div style={{ borderRadius:16, overflow:"hidden", border:`1px solid ${GLASS_BORDER}` }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62874.04568!2d77.6915!3d8.7139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b04170ed7f39f61%3A0x1bc98c65e4c01b6!2sTirunelveli%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1600000000000"
                width="100%" height="220" allowFullScreen="" loading="lazy"
                title="Tirunelveli Map"
              />
            </div>
          </div>

          {/* Form */}
          <div className="glass-card" style={{ padding:"36px 32px" }}>
            <h3 className="playfair" style={{ fontSize:24, marginBottom:28 }}>Send a Message</h3>
            {sent ? (
              <div style={{ textAlign:"center", padding:"40px 0" }}>
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{margin:"0 auto 16px",display:"block"}}><path d="M6 28 L50 10 L34 50 L26 34 Z" stroke={GOLD} strokeWidth="1.8" fill={`${GOLD}15`} strokeLinejoin="round"/><line x1="26" y1="34" x2="50" y2="10" stroke={GOLD} strokeWidth="1.4" opacity="0.6"/></svg>
                <p style={{ color: GOLD, fontSize:17 }}>Message sent! We'll reply soon.</p>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
                <div>
                  <label style={{ fontSize:13, color:"rgba(232,224,208,0.5)", display:"block", marginBottom:6 }}>Name</label>
                  <input className="inp" placeholder="Your name" value={form.name} onChange={e => setForm({...form,name:e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize:13, color:"rgba(232,224,208,0.5)", display:"block", marginBottom:6 }}>Email</label>
                  <input className="inp" type="email" placeholder="Your email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize:13, color:"rgba(232,224,208,0.5)", display:"block", marginBottom:6 }}>Message</label>
                  <textarea className="inp" rows={5} placeholder="Your message..." value={form.message} onChange={e => setForm({...form,message:e.target.value})} />
                </div>
                <button className="btn-gold" onClick={() => { if(form.name&&form.email&&form.message) setSent(true); }} style={{ alignSelf:"flex-start" }}>Send Message →</button>
              </div>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function AdminPage() {
  const [bookings, setBookings] = useState(loadBookings);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const refresh = () => setBookings(loadBookings());

  const updateStatus = (id, status) => {
    const updated = bookings.map(b => b.id===id ? {...b,status} : b);
    saveBookings(updated);
    setBookings(updated);
    if (selected?.id === id) setSelected({...selected, status});
  };

  const filtered = filter === "All" ? bookings : bookings.filter(b => b.status === filter);

  const kpis = [
    { label:"Total Bookings", val: bookings.length, svgPath:<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="17" rx="2" stroke="#3B82F6" strokeWidth="1.6"/><line x1="3" y1="9" x2="21" y2="9" stroke="#3B82F6" strokeWidth="1.4"/><line x1="8" y1="2" x2="8" y2="6" stroke="#3B82F6" strokeWidth="1.6" strokeLinecap="round"/><line x1="16" y1="2" x2="16" y2="6" stroke="#3B82F6" strokeWidth="1.6" strokeLinecap="round"/><line x1="7" y1="14" x2="17" y2="14" stroke="#3B82F6" strokeWidth="1.2" opacity="0.5"/><line x1="7" y1="17" x2="13" y2="17" stroke="#3B82F6" strokeWidth="1.2" opacity="0.4"/></svg>, color:"#3B82F6" },
    { label:"Pending", val: bookings.filter(b=>b.status==="Pending").length, svgPath:<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#F59E0B" strokeWidth="1.6"/><line x1="12" y1="7" x2="12" y2="12" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round"/><line x1="12" y1="12" x2="16" y2="15" stroke="#F59E0B" strokeWidth="1.4" strokeLinecap="round"/><circle cx="12" cy="12" r="1" fill="#F59E0B"/></svg>, color:"#F59E0B" },
    { label:"Confirmed", val: bookings.filter(b=>b.status==="Confirmed").length, svgPath:<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#10B981" strokeWidth="1.6"/><polyline points="8,12 11,15 16,9" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>, color:"#10B981" },
    { label:"Completed", val: bookings.filter(b=>b.status==="Completed").length, svgPath:<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><polygon points="12,2 15,9 22,9 16,14 18,21 12,17 6,21 8,14 2,9 9,9" stroke="#8B5CF6" strokeWidth="1.4" fill="rgba(139,92,246,0.15)" strokeLinejoin="round"/></svg>, color:"#8B5CF6" },
  ];

  // Simple service demand chart
  const serviceCounts = {};
  bookings.forEach(b => {
    const short = b.service?.split(" ")[0] || "Other";
    serviceCounts[short] = (serviceCounts[short]||0)+1;
  });
  const maxCount = Math.max(1, ...Object.values(serviceCounts));

  const statusColor = { Pending:"#F59E0B", Confirmed:"#10B981", Completed:"#8B5CF6" };

  return (
    <div style={{ paddingTop:100 }}>
      <Section style={{ paddingTop:40 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:40 }}>
          <div>
            <div style={{ color: GOLD, fontSize:12, letterSpacing:3, marginBottom:8, fontWeight:600 }}>ADMIN PANEL</div>
            <h1 className="playfair" style={{ fontSize:"clamp(24px,3.5vw,44px)" }}>
              Dashboard <span className="grad-text">Overview</span>
            </h1>
          </div>
          <button className="btn-outline" style={{ fontSize:13 }} onClick={refresh}>↻ Refresh</button>
        </div>

        {/* KPIs */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:20, marginBottom:40 }}>
          {kpis.map((k,i) => (
            <div key={i} className="glass-card" style={{ padding:24, position:"relative", overflow:"hidden" }}>
              <div style={{
                position:"absolute", top:-10, right:-10,
                width:70, height:70, borderRadius:"50%",
                background:`${k.color}10`,
              }} />
              <div style={{ marginBottom:10 }}>{k.svgPath}</div>
              <div style={{ fontSize:"clamp(28px,4vw,40px)", fontWeight:700, color:k.color, fontFamily:"'Playfair Display',serif" }}>{k.val}</div>
              <div style={{ fontSize:13, color:"rgba(232,224,208,0.5)", marginTop:4 }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* Analytics */}
        {Object.keys(serviceCounts).length > 0 && (
          <div className="glass-card" style={{ padding:32, marginBottom:40 }}>
            <h3 className="playfair" style={{ fontSize:22, marginBottom:24 }}>Service Demand Analytics</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {Object.entries(serviceCounts).map(([svc, cnt]) => (
                <div key={svc}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6, fontSize:14 }}>
                    <span style={{ color:"rgba(232,224,208,0.8)" }}>{svc}</span>
                    <span className="gold">{cnt} booking{cnt>1?"s":""}</span>
                  </div>
                  <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:50, height:8, overflow:"hidden" }}>
                    <div style={{
                      height:"100%", borderRadius:50,
                      background:`linear-gradient(90deg,${GOLD},${GOLD2})`,
                      width:`${(cnt/maxCount)*100}%`,
                      transition:"width 1.2s ease",
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter + Table */}
        <div className="glass-card" style={{ padding:32 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, flexWrap:"wrap", gap:12 }}>
            <h3 className="playfair" style={{ fontSize:22 }}>Appointment Records</h3>
            <div style={{ display:"flex", gap:8 }}>
              {["All","Pending","Confirmed","Completed"].map(s => (
                <button key={s} onClick={() => setFilter(s)} style={{
                  background: filter===s ? `linear-gradient(135deg,${GOLD},${GOLD2})` : "transparent",
                  border:`1px solid ${filter===s ? GOLD : GLASS_BORDER}`,
                  borderRadius:50, padding:"7px 18px",
                  color: filter===s ? "#0A0A0F" : "rgba(232,224,208,0.6)",
                  fontFamily:"'Jost',sans-serif", fontSize:13, cursor:"pointer", transition:"all 0.3s",
                }}>{s}</button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"40px 0", color:"rgba(232,224,208,0.4)" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{margin:"0 auto 14px",display:"block"}}><rect x="3" y="4" width="18" height="17" rx="2" stroke="rgba(232,224,208,0.3)" strokeWidth="1.4"/><line x1="3" y1="9" x2="21" y2="9" stroke="rgba(232,224,208,0.3)" strokeWidth="1.2"/><line x1="9" y1="14" x2="15" y2="14" stroke="rgba(232,224,208,0.2)" strokeWidth="1.2"/></svg>
              <p>No bookings yet. Bookings made via the Booking page appear here.</p>
            </div>
          ) : (
            <div style={{ overflowX:"auto" }}>
              <table>
                <thead>
                  <tr>
                    {["Name","Service","Date","Time","Status","Actions"].map(h => <th key={h}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(b => (
                    <tr key={b.id}>
                      <td style={{ fontWeight:500 }}>{b.name}</td>
                      <td style={{ color:"rgba(232,224,208,0.65)", maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{b.service}</td>
                      <td>{b.date}</td>
                      <td>{b.time}</td>
                      <td>
                        <span style={{
                          background:`${statusColor[b.status]||"#888"}22`,
                          border:`1px solid ${statusColor[b.status]||"#888"}50`,
                          borderRadius:50, padding:"4px 14px",
                          fontSize:12, color: statusColor[b.status]||"#888", fontWeight:600,
                        }}>{b.status}</span>
                      </td>
                      <td>
                        <div style={{ display:"flex", gap:6 }}>
                          <button onClick={() => setSelected(b)} style={{
                            background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                            borderRadius:6, padding:"5px 12px", color:"#e8e0d0", fontSize:12, cursor:"pointer",
                          }}>View</button>
                          {b.status==="Pending" && (
                            <button onClick={() => updateStatus(b.id,"Confirmed")} style={{
                              background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.3)",
                              borderRadius:6, padding:"5px 12px", color:"#10B981", fontSize:12, cursor:"pointer",
                            }}>Confirm</button>
                          )}
                          {b.status==="Confirmed" && (
                            <button onClick={() => updateStatus(b.id,"Completed")} style={{
                              background:"rgba(139,92,246,0.15)", border:"1px solid rgba(139,92,246,0.3)",
                              borderRadius:6, padding:"5px 12px", color:"#8B5CF6", fontSize:12, cursor:"pointer",
                            }}>Complete</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {selected && (
          <div style={{
            position:"fixed", inset:0, zIndex:5000,
            background:"rgba(0,0,0,0.75)", display:"flex", alignItems:"center", justifyContent:"center",
            padding:"20px",
          }} onClick={() => setSelected(null)}>
            <div className="glass-card" style={{
              maxWidth:520, width:"100%", padding:40,
              background: DARK2, position:"relative",
            }} onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelected(null)} style={{
                position:"absolute", top:16, right:16,
                background:"none", border:"none", color: GOLD, fontSize:20, cursor:"pointer",
              }}>✕</button>
              <h3 className="playfair" style={{ fontSize:24, marginBottom:24 }}>Booking Details</h3>
              <div style={{ display:"grid", gap:14 }}>
                {[
                  ["Name", selected.name],
                  ["Phone", selected.phone],
                  ["Email", selected.email],
                  ["Service", selected.service],
                  ["Date", selected.date],
                  ["Time", selected.time],
                  ["Status", selected.status],
                  ["Message", selected.message||"—"],
                ].map(([l,v]) => (
                  <div key={l} style={{ display:"grid", gridTemplateColumns:"120px 1fr", gap:12 }}>
                    <span style={{ color: GOLD, fontSize:13, fontWeight:600 }}>{l}</span>
                    <span style={{ color:"rgba(232,224,208,0.8)", fontSize:14 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:12, marginTop:28 }}>
                {selected.status==="Pending" && (
                  <button className="btn-gold" style={{ fontSize:14, padding:"11px 24px" }}
                    onClick={() => { updateStatus(selected.id,"Confirmed"); }}>Confirm</button>
                )}
                {selected.status==="Confirmed" && (
                  <button className="btn-gold" style={{ fontSize:14, padding:"11px 24px" }}
                    onClick={() => { updateStatus(selected.id,"Completed"); }}>Mark Completed</button>
                )}
                <button className="btn-outline" style={{ fontSize:14, padding:"10px 24px" }} onClick={() => setSelected(null)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ setPage }) {
  return (
    <footer style={{
      background: DARK2, borderTop:`1px solid ${GLASS_BORDER}`,
      padding:"60px 5% 30px",
    }}>
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:48, marginBottom:48 }}>
        <div>
          <div style={{ marginBottom:16 }}>
            <SparkleText size={22}>JanzaStudio</SparkleText>
          </div>
          <p style={{ color:"rgba(232,224,208,0.5)", lineHeight:1.8, fontSize:14, maxWidth:320, marginBottom:12 }}>
            Crafting stunning digital experiences for local businesses in Tirunelveli and beyond.
          </p>
          <DomainLink />
        </div>
        <div>
          <div style={{ color: GOLD, fontSize:11, letterSpacing:2, fontWeight:600, marginBottom:16 }}>QUICK LINKS</div>
          {["Home","About","Services","Portfolio","Booking","Contact"].map(l => (
            <button key={l} onClick={() => setPage(l)} className="hover-line" style={{
              display:"block", background:"none", border:"none", cursor:"pointer",
              color:"rgba(232,224,208,0.55)", fontFamily:"'Jost',sans-serif",
              fontSize:14, padding:"5px 0", textAlign:"left",
            }}>{l}</button>
          ))}
        </div>
        <div>
          <div style={{ color: GOLD, fontSize:11, letterSpacing:2, fontWeight:600, marginBottom:16 }}>CONTACT</div>
          <p style={{ color:"rgba(232,224,208,0.55)", fontSize:14, lineHeight:2 }}>
            Tirunelveli, Tamil Nadu<br />
            janishasanthakumar@gmail.com
          </p>
        </div>
      </div>
      <div style={{
        borderTop:`1px solid ${GLASS_BORDER}`, paddingTop:24,
        display:"flex", justifyContent:"space-between", alignItems:"center",
        color:"rgba(232,224,208,0.3)", fontSize:13, flexWrap:"wrap", gap:12,
      }}>
        <span>© 2025 JanzaStudio. All rights reserved.</span>
        <span style={{ color: GOLD }}>✦ Every Brand Has a Universe</span>
      </div>
    </footer>
  );
}

// ─── LOADING SCREEN ───────────────────────────────────────────────────────────
function LoadingScreen({ done }) {
  return (
    <div style={{
      position:"fixed", inset:0, background: DARK,
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      zIndex:9999, transition:"opacity 0.6s ease",
      opacity: done ? 0 : 1, pointerEvents: done ? "none" : "all",
    }}>
      <div style={{ marginBottom:32, textAlign:"center" }}>
        <SparkleText size={36}>JanzaStudio</SparkleText>
        <div style={{ fontSize:13, color:`${GOLD}99`, marginTop:10, letterSpacing:2, fontFamily:"'Rajdhani',sans-serif", fontWeight:600 }}>
          YOUR DIGITAL STUDIO
        </div>
      </div>
      <div style={{ width:120, height:2, background:"rgba(255,255,255,0.06)", borderRadius:1, overflow:"hidden" }}>
        <div style={{
          height:"100%", background:`linear-gradient(90deg,${GOLD},${GOLD2})`,
          borderRadius:1, animation:"growBar 1.2s ease forwards",
          "--w":"100%",
        }} />
      </div>
    </div>
  );
}

// ─── Google Tag Manager ───────────────────────────────────────────────────────
function GTM() {
  useEffect(() => {
    // GTM dataLayer init
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });

    // Inject GTM script (replace GTM-XXXXXXX with your actual GTM ID)
    const GTM_ID = "GTM-XXXXXXX";
    if (document.getElementById("gtm-script")) return;
    const script = document.createElement("script");
    script.id = "gtm-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
    document.head.appendChild(script);

    // GTM noscript iframe
    if (!document.getElementById("gtm-noscript")) {
      const ns = document.createElement("noscript");
      ns.id = "gtm-noscript";
      ns.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
      document.body.insertBefore(ns, document.body.firstChild);
    }
  }, []);
  return null;
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("Home");
  const [loading, setLoading] = useState(true);
  const [pageKey, setPageKey] = useState(0);

  const navigate = (p) => {
    setPage(p);
    setPageKey(k => k + 1);
    // GTM page view event
    if (window.dataLayer) window.dataLayer.push({ event: "page_view", page_title: p });
  };

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => { window.scrollTo({ top:0, behavior:"smooth" }); }, [page]);

  const renderPage = () => {
    switch(page) {
      case "Home":      return <HomePage setPage={navigate} />;
      case "About":     return <AboutPage />;
      case "Services":  return <ServicesPage setPage={navigate} />;
      case "Portfolio": return <PortfolioPage />;
      case "Booking":   return <BookingPage />;
      case "Contact":   return <ContactPage />;
      case "Admin":     return <AdminPage />;
      default:          return <HomePage setPage={navigate} />;
    }
  };

  return (
    <>
      <style>{globalStyles}</style>
      <GTM />
      <LoadingScreen done={!loading} />
      <CursorFX />
      <ScrollProgress />
      <div style={{ minHeight:"100vh", position:"relative" }}>
        <ParticlesBg />
        <FloatingOrbs />
        <div style={{ position:"relative", zIndex:1 }}>
          <Navbar page={page} setPage={navigate} />
          <main key={pageKey} className="page-in" style={{ minHeight:"100vh" }}>
            {renderPage()}
          </main>
          <MarqueeStrip />
          <Footer setPage={navigate} />
        </div>
      </div>
      <WhatsAppFAB />
    </>
  );
}
