import { useMemo } from 'react';

export default function SunsetTheme() {
  const birds = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      y: 10 + i * 5 + Math.random() * 3,
      size: 5 + Math.random() * 7,
      duration: 24 + Math.random() * 18,
      delay: i * 5.5 + Math.random() * 4,
    })), []);

  const clouds = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => ({
      id: i,
      top: 6 + i * 8,
      width: 220 + Math.random() * 260,
      height: 55 + Math.random() * 60,
      // Warm sunset tints: golden for low clouds, violet for high ones
      color: i < 3
        ? `rgba(255,${160 + i * 15},${60 + i * 20},1)`
        : i < 5
          ? 'rgba(255,190,130,0.9)'
          : 'rgba(220,160,200,0.85)',
      opacity: 0.14 + Math.random() * 0.14,
      duration: 38 + i * 11,
    })), []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">

      {/* ── Sky gradient: deep violet top → orange → golden horizon ── */}
      <div className="absolute inset-0" style={{
        background: `linear-gradient(180deg,
          #1a0533  0%,
          #6b21a8 10%,
          #be185d 24%,
          #ef4444 38%,
          #f97316 52%,
          #fbbf24 66%,
          #fef3c7 88%,
          #fff9ed 100%)`,
      }} />

      {/* Atmospheric haze across horizon */}
      <div className="absolute left-0 right-0" style={{
        top: '50%', height: '35%',
        background: 'radial-gradient(ellipse 100% 100% at 50% 0%, rgba(251,191,36,0.55), rgba(249,115,22,0.25) 45%, transparent 75%)',
        filter: 'blur(18px)',
      }} />

      {/* ── Sun body (positioned lower, near the horizon) ── */}
      <div className="absolute" style={{
        top: '46%', left: '50%',
        transform: 'translate(-50%,-50%)',
        animation: 'sun-float 12s ease-in-out infinite',
      }}>
        {/* Outer corona halo */}
        <div className="absolute rounded-full" style={{
          width: 320, height: 320,
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          background: 'radial-gradient(circle, rgba(251,191,36,0.14), rgba(249,115,22,0.07), transparent 70%)',
          filter: 'blur(28px)',
        }} />
        {/* Mid glow ring */}
        <div className="absolute rounded-full" style={{
          width: 175, height: 175,
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          background: 'radial-gradient(circle, rgba(253,224,71,0.52), rgba(251,191,36,0.28), transparent 70%)',
          filter: 'blur(16px)',
        }} />
        {/* Inner warm bloom */}
        <div className="absolute rounded-full" style={{
          width: 105, height: 105,
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          background: 'radial-gradient(circle, rgba(255,255,200,0.75), rgba(254,240,138,0.55), transparent 70%)',
          filter: 'blur(8px)',
        }} />
        {/* Sun disc */}
        <div className="rounded-full" style={{
          width: 72, height: 72,
          background: 'radial-gradient(circle at 42% 36%, #fefce8, #fef08a 35%, #fbbf24 65%, #f97316 100%)',
          boxShadow: '0 0 55px rgba(251,191,36,0.85), 0 0 110px rgba(249,115,22,0.55), 0 0 200px rgba(239,68,68,0.25)',
        }} />
      </div>

      {/* ── Rotating light rays container ── */}
      <div className="absolute" style={{
        top: '46%', left: '50%',
        width: 0, height: 0,
        animation: 'sun-rays-spin 45s linear infinite',
      }}>
        {Array.from({ length: 14 }, (_, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: 0, left: 0,
            width: i % 3 === 0 ? 3 : 2,
            height: '65vh',
            marginLeft: i % 3 === 0 ? '-1.5px' : '-1px',
            background: 'linear-gradient(180deg, rgba(251,191,36,0.5) 0%, rgba(249,115,22,0.12) 35%, transparent 65%)',
            transformOrigin: 'top center',
            transform: `rotate(${i * (360/14)}deg)`,
            filter: 'blur(5px)',
            opacity: i % 3 === 0 ? 0.75 : 0.32,
          }} />
        ))}
      </div>

      {/* ── Clouds with warm sunset coloring ── */}
      {clouds.map(c => (
        <div key={c.id} className="absolute" style={{
          top: `${c.top}%`,
          width: c.width, height: c.height,
          background: `radial-gradient(ellipse, ${c.color}, transparent 78%)`,
          borderRadius: '50%',
          opacity: c.opacity,
          filter: 'blur(18px)',
          animation: `cloud-drift ${c.duration}s linear infinite`,
          animationDelay: `${-c.duration * 0.35}s`,
        }} />
      ))}

      {/* ── Birds flying across ── */}
      {birds.map(b => (
        <div key={b.id} className="absolute" style={{
          top: `${b.y}%`,
          left: '-50px',
          opacity: 0.52,
          animation: `birds-fly ${b.duration}s linear ${b.delay}s infinite`,
        }}>
          <svg width={b.size * 4} height={b.size * 2} viewBox="0 0 40 18">
            {/* Single seagull M-silhouette */}
            <path d="M0,9 Q10,3 20,9 Q30,15 40,9"
              fill="none" stroke="rgba(20,8,3,0.72)" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
      ))}

      {/* Warm ground glow (below horizon) */}
      <div className="absolute bottom-0 left-0 right-0 h-2/5" style={{
        background: 'linear-gradient(0deg, rgba(251,191,36,0.18), rgba(249,115,22,0.08), transparent)',
      }} />

      {/* ── Terrain / hills silhouette ── */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '32%' }}>
        <svg viewBox="0 0 1440 220" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
          {/* Far distant hills */}
          <path d="M0,220 L0,140 C90,110 180,95 300,108 C420,121 490,138 620,112 C750,86 820,72 960,88 C1100,104 1160,122 1300,108 C1370,101 1410,96 1440,98 L1440,220 Z"
            fill="rgba(90,10,40,0.38)" />
          {/* Near hills (darker, more prominent) */}
          <path d="M0,220 L0,170 C110,152 200,142 310,158 C420,174 460,184 590,165 C720,146 760,134 900,150 C1040,166 1080,176 1220,165 C1310,157 1380,160 1440,155 L1440,220 Z"
            fill="rgba(15,5,15,0.62)" />
        </svg>
      </div>

      <style>{`
        @keyframes sun-float {
          0%,100%{ transform:translate(-50%,-50%) translateY(0); }
          50%    { transform:translate(-50%,-50%) translateY(-8px); }
        }
        @keyframes sun-rays-spin {
          from{ transform:rotate(0deg); }
          to  { transform:rotate(360deg); }
        }
        @keyframes cloud-drift {
          0%  { transform:translateX(-130%); }
          100%{ transform:translateX(120vw); }
        }
        @keyframes birds-fly {
          0%   { transform:translateX(0)           translateY(0); }
          30%  { transform:translateX(30vw)         translateY(-6px); }
          60%  { transform:translateX(60vw)         translateY(3px); }
          100% { transform:translateX(calc(100vw + 60px)) translateY(0); }
        }
      `}</style>
    </div>
  );
}
