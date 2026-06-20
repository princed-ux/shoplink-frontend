import { useMemo } from 'react';

export default function NeonTheme() {
  const particles = useMemo(() =>
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 3,
      duration: 2 + Math.random() * 4,
      delay: Math.random() * 5,
      color: Math.random() > 0.5 ? '#22c55e' : '#86efac',
    })), []);

  const energyLines = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      top: 10 + i * 15,
      duration: 4 + i * 1.5,
      delay: i * 0.8,
    })), []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={{ background: '#030712' }}>
      {/* Grid floor */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(34,197,94,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.07) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      {/* Perspective grid overlay (vanishing point) */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 100% 60% at 50% 100%, rgba(34,197,94,0.06), transparent 70%)',
      }} />

      {/* Central glow hub */}
      <div className="absolute" style={{
        top: '30%', left: '50%',
        width: 500, height: 300,
        transform: 'translate(-50%, -50%)',
        background: 'radial-gradient(ellipse, rgba(34,197,94,0.08), transparent 70%)',
        filter: 'blur(60px)',
        animation: 'neon-pulse-hub 6s ease-in-out infinite',
      }} />

      {/* Horizontal energy lines */}
      {energyLines.map(l => (
        <div key={l.id} className="absolute left-0 right-0 overflow-hidden" style={{ top: `${l.top}%`, height: 1 }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.6), rgba(134,239,172,0.8), rgba(34,197,94,0.6), transparent)',
            animation: `neon-scanline ${l.duration}s linear infinite`,
            animationDelay: `${l.delay}s`,
          }} />
        </div>
      ))}

      {/* Glowing corner accents */}
      <div className="absolute top-0 left-0 w-64 h-64" style={{
        background: 'conic-gradient(from 180deg at 0% 0%, rgba(34,197,94,0.15), transparent 40%)',
        filter: 'blur(20px)',
      }} />
      <div className="absolute bottom-0 right-0 w-64 h-64" style={{
        background: 'conic-gradient(from 0deg at 100% 100%, rgba(34,197,94,0.15), transparent 40%)',
        filter: 'blur(20px)',
      }} />

      {/* Glowing particles */}
      {particles.map(p => (
        <div key={p.id} className="absolute rounded-full" style={{
          left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size,
          background: p.color,
          boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          animation: `neon-particle-pulse ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
        }} />
      ))}

      {/* Neon glow accents */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full" style={{
        background: 'radial-gradient(circle, rgba(34,197,94,0.06), transparent 70%)',
        filter: 'blur(50px)',
        animation: 'neon-glow-drift1 10s ease-in-out infinite alternate',
      }} />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full" style={{
        background: 'radial-gradient(circle, rgba(132,204,22,0.05), transparent 70%)',
        filter: 'blur(50px)',
        animation: 'neon-glow-drift2 12s ease-in-out infinite alternate-reverse',
      }} />

      <style>{`
        @keyframes neon-pulse-hub {
          0%,100%{ opacity:0.5; transform:translate(-50%,-50%) scale(1); }
          50%    { opacity:1;   transform:translate(-50%,-50%) scale(1.2); }
        }
        @keyframes neon-scanline {
          0%  { transform:translateX(-100%); }
          100%{ transform:translateX(100%); }
        }
        @keyframes neon-particle-pulse {
          0%  { opacity:0.2; transform:scale(0.8); }
          100%{ opacity:0.9; transform:scale(1.3); }
        }
        @keyframes neon-glow-drift1 {
          0%  { transform:translate(0,0) scale(1); }
          100%{ transform:translate(40px,-30px) scale(1.15); }
        }
        @keyframes neon-glow-drift2 {
          0%  { transform:translate(0,0) scale(1); }
          100%{ transform:translate(-30px,25px) scale(0.9); }
        }
      `}</style>
    </div>
  );
}
