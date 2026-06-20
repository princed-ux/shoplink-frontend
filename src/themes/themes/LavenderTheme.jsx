import { useMemo } from 'react';

export default function LavenderTheme() {
  const petals = useMemo(() =>
    Array.from({ length: 22 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 8 + Math.random() * 14,
      duration: 8 + Math.random() * 10,
      delay: Math.random() * 12,
      drift: -30 + Math.random() * 60,
      rotation: Math.random() * 360,
      color: Math.random() > 0.4 ? '#c4b5fd' : '#a78bfa',
    })), []);

  const sparkles = useMemo(() =>
    Array.from({ length: 35 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 3,
      duration: 2 + Math.random() * 4,
      delay: Math.random() * 6,
    })), []);

  // Drifting butterflies — cross screen left→right or right→left
  const butterflies = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      y: 15 + i * 13 + Math.random() * 6,
      size: 14 + Math.random() * 10,
      duration: 26 + Math.random() * 20,
      delay: i * 7 + Math.random() * 5,
      goRight: i % 2 === 0,
      color: i % 2 === 0 ? '#c4b5fd' : '#e879f9',
    })), []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Dreamy lavender base */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(160deg, #faf5ff 0%, #e9d5ff 40%, #c4b5fd 70%, #a78bfa 100%)',
      }} />

      {/* Soft mist layer */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 90% 70% at 50% 30%, rgba(255,255,255,0.35), transparent)',
      }} />

      {/* Ambient glow blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full" style={{
        background: 'radial-gradient(circle, #c4b5fd, transparent 70%)',
        opacity: 0.3, filter: 'blur(80px)',
        animation: 'lav-blob1 12s ease-in-out infinite alternate',
      }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full" style={{
        background: 'radial-gradient(circle, #a78bfa, transparent 70%)',
        opacity: 0.25, filter: 'blur(80px)',
        animation: 'lav-blob2 15s ease-in-out infinite alternate-reverse',
      }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full" style={{
        background: 'radial-gradient(circle, #e879f9, transparent 70%)',
        opacity: 0.12, filter: 'blur(70px)',
        animation: 'lav-blob3 9s ease-in-out infinite alternate',
      }} />

      {/* Animated mist */}
      <div className="absolute" style={{
        bottom: '20%', left: 0, right: 0, height: 100,
        background: 'linear-gradient(0deg, transparent, rgba(196,181,253,0.12), transparent)',
        filter: 'blur(30px)',
        animation: 'lav-mist1 18s ease-in-out infinite alternate',
      }} />

      {/* Falling petals */}
      {petals.map(p => (
        <div key={p.id} className="absolute" style={{
          left: `${p.x}%`, top: '-5%',
          animation: `petal-fall ${p.duration}s ease-in-out ${p.delay}s infinite`,
        }}>
          <svg width={p.size} height={p.size * 1.5} viewBox="0 0 20 30" style={{
            transform: `rotate(${p.rotation}deg)`,
            filter: `drop-shadow(0 2px 4px ${p.color}50)`,
          }}>
            <ellipse cx="10" cy="15" rx="8" ry="13" fill={p.color} opacity="0.55" />
            <line x1="10" y1="2" x2="10" y2="28" stroke={p.color} strokeWidth="0.8" opacity="0.4" />
          </svg>
        </div>
      ))}

      {/* ── Drifting butterflies ── */}
      {butterflies.map(b => (
        <div key={b.id} className="absolute" style={{
          top: `${b.y}%`,
          ...(b.goRight ? { left: '-60px' } : { right: '-60px' }),
          animation: b.goRight
            ? `butterfly-right ${b.duration}s ease-in-out ${b.delay}s infinite`
            : `butterfly-left  ${b.duration}s ease-in-out ${b.delay}s infinite`,
          opacity: 0.72,
        }}>
          <svg width={b.size * 2} height={b.size * 1.5} viewBox="0 0 40 28"
            style={{ transform: b.goRight ? 'none' : 'scaleX(-1)' }}>
            {/* Upper wings */}
            <ellipse cx="14" cy="10" rx="12" ry="8"
              fill={b.color} opacity="0.75" transform="rotate(-20 14 10)" />
            <ellipse cx="26" cy="10" rx="12" ry="8"
              fill={b.color} opacity="0.75" transform="rotate(20 26 10)" />
            {/* Lower wings */}
            <ellipse cx="14" cy="20" rx="9" ry="6"
              fill={b.color} opacity="0.60" transform="rotate(15 14 20)" />
            <ellipse cx="26" cy="20" rx="9" ry="6"
              fill={b.color} opacity="0.60" transform="rotate(-15 26 20)" />
            {/* Body */}
            <ellipse cx="20" cy="14" rx="2" ry="8" fill="rgba(109,40,217,0.6)" />
            {/* Antennae */}
            <line x1="18" y1="7"  x2="14" y2="2" stroke="rgba(109,40,217,0.5)" strokeWidth="0.8"/>
            <line x1="22" y1="7"  x2="26" y2="2" stroke="rgba(109,40,217,0.5)" strokeWidth="0.8"/>
            <circle cx="14" cy="2" r="1" fill="rgba(196,181,253,0.8)"/>
            <circle cx="26" cy="2" r="1" fill="rgba(196,181,253,0.8)"/>
          </svg>
        </div>
      ))}

      {/* Sparkle particles */}
      {sparkles.map(s => (
        <div key={s.id} className="absolute" style={{
          left: `${s.x}%`, top: `${s.y}%`,
          animation: `sparkle-pop ${s.duration}s ease-in-out ${s.delay}s infinite`,
        }}>
          <svg width={s.size * 2} height={s.size * 2} viewBox="0 0 20 20">
            <line x1="10" y1="2" x2="10" y2="18" stroke="#e879f9" strokeWidth="1.5" opacity="0.7" />
            <line x1="2" y1="10" x2="18" y2="10" stroke="#e879f9" strokeWidth="1.5" opacity="0.7" />
            <line x1="4" y1="4" x2="16" y2="16" stroke="#c4b5fd" strokeWidth="1" opacity="0.5" />
            <line x1="16" y1="4" x2="4" y2="16" stroke="#c4b5fd" strokeWidth="1" opacity="0.5" />
          </svg>
        </div>
      ))}

      <style>{`
        @keyframes petal-fall {
          0%   { transform:translateY(-10px) translateX(0) rotate(0deg); opacity:0; }
          5%   { opacity:0.7; }
          90%  { opacity:0.5; }
          100% { transform:translateY(110vh) translateX(var(--pdrift,30px)) rotate(180deg); opacity:0; }
        }
        @keyframes sparkle-pop {
          0%,100%{ opacity:0; transform:scale(0.5) rotate(0deg); }
          30%,70%{ opacity:0.8; transform:scale(1.2) rotate(45deg); }
        }
        @keyframes lav-blob1 {
          0%  { transform:scale(1) translate(0,0); }
          100%{ transform:scale(1.2) translate(-25px,15px); }
        }
        @keyframes lav-blob2 {
          0%  { transform:scale(1) translate(0,0); }
          100%{ transform:scale(1.15) translate(20px,-12px); }
        }
        @keyframes lav-blob3 {
          0%  { transform:translate(-50%,-50%) scale(1); }
          100%{ transform:translate(-50%,-56%) scale(1.18); }
        }
        @keyframes lav-mist1 {
          0%  { transform:translateX(-5%) scaleX(1); opacity:0.5; }
          100%{ transform:translateX(5%) scaleX(1.04); opacity:1; }
        }
        /* Butterfly wing-flap is simulated by scaleY oscillation on the SVG during flight */
        @keyframes butterfly-right {
          0%   { transform:translateX(0)                    translateY(0);   }
          15%  { transform:translateX(15vw)                 translateY(-8px)  scaleY(0.85); }
          30%  { transform:translateX(30vw)                 translateY(5px);  }
          45%  { transform:translateX(45vw)                 translateY(-10px) scaleY(0.85); }
          60%  { transform:translateX(60vw)                 translateY(3px);  }
          75%  { transform:translateX(75vw)                 translateY(-6px)  scaleY(0.85); }
          100% { transform:translateX(calc(100vw + 70px))   translateY(0);    }
        }
        @keyframes butterfly-left {
          0%   { transform:translateX(0)                       translateY(0);   }
          15%  { transform:translateX(-15vw)                   translateY(-8px)  scaleY(0.85); }
          30%  { transform:translateX(-30vw)                   translateY(5px);  }
          45%  { transform:translateX(-45vw)                   translateY(-10px) scaleY(0.85); }
          60%  { transform:translateX(-60vw)                   translateY(3px);  }
          75%  { transform:translateX(-75vw)                   translateY(-6px)  scaleY(0.85); }
          100% { transform:translateX(calc(-100vw - 70px))     translateY(0);    }
        }
      `}</style>
    </div>
  );
}
