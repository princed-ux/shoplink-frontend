import { useMemo } from 'react';

export default function LuxuryBlackTheme() {
  const goldLines = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      top: 15 + i * 17,
      duration: 12 + i * 2,
      delay: i * 1.8,
    })), []);

  const goldParticles = useMemo(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1.5 + Math.random() * 2.5,
      duration: 4 + Math.random() * 6,
      delay: Math.random() * 8,
    })), []);

  const marbleLines = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      top: i * 8.5,
      opacity: 0.025 + Math.random() * 0.035,
      rotate: -30 + Math.random() * 60,
    })), []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Pure black base */}
      <div className="absolute inset-0" style={{ background: '#000000' }} />

      {/* Black marble texture via subtle diagonal lines */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 60px,
            rgba(40,40,40,0.4) 60px,
            rgba(40,40,40,0.4) 61px
          )
        `,
      }} />
      {/* Additional marble veins */}
      {marbleLines.map(l => (
        <div key={l.id} className="absolute left-0 right-0" style={{
          top: `${l.top}%`, height: 1,
          background: 'rgba(60,50,30,0.3)',
          transform: `rotate(${l.rotate}deg) scaleX(2)`,
          opacity: l.opacity,
          filter: 'blur(1px)',
        }} />
      ))}

      {/* Subtle depth gradient */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(20,15,5,0.6), transparent 70%)',
      }} />

      {/* Gold top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{
        background: 'linear-gradient(90deg, transparent, #b8860b, #ffd700, #ffd700, #b8860b, transparent)',
        animation: 'lux-topline 6s ease-in-out infinite',
      }} />
      <div className="absolute top-0 left-0 right-0" style={{
        height: 30,
        background: 'linear-gradient(180deg, rgba(218,165,32,0.1), transparent)',
      }} />

      {/* Gold accent border lines */}
      <div className="absolute top-2 left-4 right-4 h-px" style={{
        background: 'linear-gradient(90deg, transparent, rgba(184,134,11,0.3), rgba(255,215,0,0.4), rgba(184,134,11,0.3), transparent)',
      }} />
      <div className="absolute bottom-2 left-4 right-4 h-px" style={{
        background: 'linear-gradient(90deg, transparent, rgba(184,134,11,0.3), rgba(255,215,0,0.4), rgba(184,134,11,0.3), transparent)',
      }} />

      {/* Luxury gold horizontal light bands */}
      {goldLines.map(l => (
        <div key={l.id} className="absolute left-0 right-0 overflow-hidden" style={{ top: `${l.top}%`, height: 1 }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(218,165,32,0.15), rgba(255,215,0,0.25), rgba(218,165,32,0.15), transparent)',
            animation: `lux-scanline ${l.duration}s ease-in-out ${l.delay}s infinite alternate`,
            filter: 'blur(1px)',
          }} />
        </div>
      ))}

      {/* Side gold edge glows */}
      <div className="absolute top-0 bottom-0 left-0 w-1" style={{
        background: 'linear-gradient(180deg, transparent, rgba(218,165,32,0.2) 30%, rgba(218,165,32,0.2) 70%, transparent)',
      }} />
      <div className="absolute top-0 bottom-0 right-0 w-1" style={{
        background: 'linear-gradient(180deg, transparent, rgba(218,165,32,0.2) 30%, rgba(218,165,32,0.2) 70%, transparent)',
      }} />

      {/* Gold floating particles */}
      {goldParticles.map(p => (
        <div key={p.id} className="absolute rounded-full" style={{
          left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size,
          background: '#ffd700',
          boxShadow: `0 0 ${p.size * 4}px rgba(255,215,0,0.6)`,
          animation: `lux-particle ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
        }} />
      ))}

      {/* Deep center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full" style={{
        background: 'radial-gradient(circle, rgba(40,30,0,0.5), transparent 70%)',
        filter: 'blur(60px)',
        animation: 'lux-center-glow 10s ease-in-out infinite alternate',
      }} />

      {/* Diamond grid pattern overlay */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(45deg, rgba(218,165,32,0.02) 1px, transparent 1px), linear-gradient(-45deg, rgba(218,165,32,0.02) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
      }} />

      <style>{`
        @keyframes lux-topline {
          0%  { opacity:0.5; }
          50% { opacity:1; }
          100%{ opacity:0.5; }
        }
        @keyframes lux-scanline {
          0%  { transform:scaleX(0.8); opacity:0.4; }
          100%{ transform:scaleX(1.1); opacity:1; }
        }
        @keyframes lux-particle {
          0%  { opacity:0.1; transform:scale(0.6) translateY(0); }
          100%{ opacity:0.8; transform:scale(1.4) translateY(-8px); }
        }
        @keyframes lux-center-glow {
          0%  { transform:translate(-50%,-50%) scale(1); opacity:0.5; }
          100%{ transform:translate(-50%,-55%) scale(1.2); opacity:0.8; }
        }
      `}</style>
    </div>
  );
}
