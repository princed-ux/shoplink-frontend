import { useMemo } from 'react';

export default function OceanTheme() {
  const bubbles = useMemo(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: 2 + Math.random() * 96,
      size: 4 + Math.random() * 14,
      duration: 5 + Math.random() * 9,
      delay: Math.random() * 10,
    })), []);

  const caustics = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 90,
      y: Math.random() * 60,
      size: 40 + Math.random() * 100,
      duration: 4 + Math.random() * 6,
      delay: Math.random() * 8,
    })), []);

  // Fish: proper bidirectional, visible opacity, varied colors & sizes
  const fish = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => {
      const palette = [
        'rgba(0,200,220,0.82)',
        'rgba(0,160,200,0.78)',
        'rgba(50,220,200,0.80)',
        'rgba(0,180,210,0.75)',
      ];
      return {
        id: i,
        y: 22 + i * 8 + (Math.random() * 4 - 2),   // 22 – 78 % depth
        size: i < 4 ? 32 + Math.random() * 20 : 16 + Math.random() * 12,
        duration: 20 + Math.random() * 25,
        delay: i * 4 + Math.random() * 3,
        goRight: i % 2 === 0,
        opacity: 0.38 + Math.random() * 0.22,        // 0.38 – 0.60
        color: palette[i % palette.length],
      };
    }), []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Deep ocean base */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #000d1a 0%, #001a3d 20%, #003080 45%, #005fa3 70%, #0096c7 100%)',
      }} />

      {/* Depth glow */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% 10%, rgba(0,150,199,0.2), transparent 70%)',
      }} />
      <div className="absolute bottom-0 left-0 right-0 h-1/3" style={{
        background: 'linear-gradient(0deg, rgba(0,80,150,0.35), transparent)',
      }} />

      {/* Light caustics */}
      {caustics.map(c => (
        <div key={c.id} className="absolute" style={{
          left: `${c.x}%`, top: `${c.y}%`,
          width: c.size, height: c.size * 0.35,
          background: 'radial-gradient(ellipse, rgba(100,220,255,0.14), transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(8px)',
          animation: `caustic-shimmer ${c.duration}s ease-in-out ${c.delay}s infinite alternate`,
        }} />
      ))}

      {/* Animated light rays from surface */}
      {Array.from({ length: 7 }, (_, i) => (
        <div key={i} className="absolute top-0" style={{
          left: `${8 + i * 13}%`,
          width: 2 + i % 2,
          height: '72%',
          background: 'linear-gradient(180deg, rgba(0,180,216,0.28) 0%, rgba(0,150,199,0.08) 60%, transparent)',
          filter: 'blur(6px)',
          transformOrigin: 'top center',
          transform: `rotate(${-10 + i * 3.5}deg)`,
          animation: `ray-sway ${6 + i * 2}s ease-in-out ${i * 0.8}s infinite alternate`,
        }} />
      ))}

      {/* Rising bubbles */}
      {bubbles.map(b => (
        <div key={b.id} className="absolute" style={{
          left: `${b.x}%`, bottom: '-5%',
          width: b.size, height: b.size,
          borderRadius: '50%',
          border: '1.5px solid rgba(144,224,239,0.5)',
          background: 'radial-gradient(circle at 35% 35%, rgba(200,240,255,0.25), rgba(100,200,240,0.05))',
          animation: `bubble-rise ${b.duration}s ease-in ${b.delay}s infinite`,
        }} />
      ))}

      {/* ── FISH — proper directional swim ── */}
      {fish.map(f => (
        <div key={f.id} className="absolute" style={{
          top: `${f.y}%`,
          /* right-going fish start off-screen LEFT; left-going start off-screen RIGHT */
          ...(f.goRight ? { left: '-90px' } : { right: '-90px' }),
          width: f.size,
          height: f.size * 0.45,
          opacity: f.opacity,
          animation: f.goRight
            ? `fish-swim-right ${f.duration}s linear ${f.delay}s infinite`
            : `fish-swim-left  ${f.duration}s linear ${f.delay}s infinite`,
        }}>
          <svg
            viewBox="0 0 70 28"
            style={{
              width: '100%', height: '100%', display: 'block',
              /* flip SVG so left-going fish face left */
              transform: f.goRight ? 'none' : 'scaleX(-1)',
            }}
          >
            {/* Body — smooth teardrop */}
            <path
              d="M62,14 C52,5 38,5 24,8 C11,11 4,13 3,14 C4,15 11,17 24,20 C38,23 52,23 62,14 Z"
              fill={f.color}
            />
            {/* Forked tail */}
            <path
              d="M3,14 L0,6 L5,13 L5,15 L0,22 Z"
              fill={f.color} opacity="0.9"
            />
            {/* Eye */}
            <circle cx="55" cy="12" r="2.6" fill="rgba(255,255,255,0.85)" />
            <circle cx="55.5" cy="11.5" r="1.2" fill="rgba(0,30,50,0.9)" />
            {/* Dorsal fin */}
            <path
              d="M32,8 Q38,3 47,7"
              fill="none" stroke={f.color} strokeWidth="2" strokeLinecap="round" opacity="0.75"
            />
            {/* Belly shine */}
            <path
              d="M36,13 C44,11 54,12 62,14"
              fill="none" stroke="rgba(180,245,255,0.35)" strokeWidth="1.5" strokeLinecap="round"
            />
          </svg>
        </div>
      ))}

      {/* SVG wave layers */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '45%' }}>
        {/* Wave 3 – back, slow */}
        <div className="absolute bottom-0 left-0 right-0" style={{ animation: 'wave-slow 18s linear infinite', willChange: 'transform' }}>
          <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="w-full" style={{ height: 200 }}>
            <path d="M0,100 C180,60 360,140 540,100 C720,60 900,140 1080,100 C1260,60 1350,110 1440,100 L1440,200 L0,200 Z"
              fill="rgba(0,60,140,0.35)" />
          </svg>
        </div>
        {/* Wave 2 – middle */}
        <div className="absolute bottom-0 left-0 right-0" style={{ animation: 'wave-medium 10s linear infinite', willChange: 'transform' }}>
          <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="w-full" style={{ height: 180 }}>
            <path d="M0,80 C200,130 400,40 600,80 C800,120 1000,40 1200,80 C1320,100 1380,70 1440,80 L1440,200 L0,200 Z"
              fill="rgba(0,100,170,0.42)" />
          </svg>
        </div>
        {/* Wave 1 – front, fast */}
        <div className="absolute bottom-0 left-0 right-0" style={{ animation: 'wave-fast 6s linear infinite', willChange: 'transform' }}>
          <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="w-full" style={{ height: 160 }}>
            <path d="M0,60 C120,100 240,30 360,60 C480,90 600,20 720,60 C840,100 960,30 1080,60 C1200,90 1320,50 1440,60 L1440,200 L0,200 Z"
              fill="rgba(0,140,190,0.52)" />
          </svg>
        </div>
      </div>

      {/* Surface foam shimmer */}
      <div className="absolute" style={{
        top: '55%', left: 0, right: 0, height: 4,
        background: 'linear-gradient(90deg, transparent, rgba(173,232,244,0.3), transparent, rgba(173,232,244,0.3), transparent)',
        filter: 'blur(2px)',
        animation: 'foam-drift 8s linear infinite',
      }} />

      <style>{`
        @keyframes bubble-rise {
          0%   { transform:translateY(0) scale(1);        opacity:0.7; }
          80%  { transform:translateY(-90vh) scale(1.3);  opacity:0.4; }
          100% { transform:translateY(-100vh) scale(1.5); opacity:0; }
        }
        @keyframes wave-slow   { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes wave-medium { from{transform:translateX(-25%)} to{transform:translateX(25%)} }
        @keyframes wave-fast   { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes caustic-shimmer {
          0%  { opacity:0.4; transform:scale(1) rotate(-5deg); }
          100%{ opacity:1.0; transform:scale(1.3) rotate(5deg); }
        }
        @keyframes ray-sway {
          0%  { opacity:0.25; transform:rotate(-10deg) scaleY(0.9); }
          100%{ opacity:0.65; transform:rotate(8deg) scaleY(1.1); }
        }
        /* Fish swim right: start -90px left, end 100vw+90px right, with gentle Y bob */
        @keyframes fish-swim-right {
          0%   { transform:translateX(0)           translateY(0); }
          25%  { transform:translateX(25vw)         translateY(-5px); }
          50%  { transform:translateX(50vw)         translateY(0); }
          75%  { transform:translateX(75vw)         translateY(5px); }
          100% { transform:translateX(calc(100vw + 90px)) translateY(0); }
        }
        /* Fish swim left: start -90px right (right:-90px), end 100vw+90px left */
        @keyframes fish-swim-left {
          0%   { transform:translateX(0)                      translateY(0); }
          25%  { transform:translateX(-25vw)                  translateY(5px); }
          50%  { transform:translateX(-50vw)                  translateY(0); }
          75%  { transform:translateX(-75vw)                  translateY(-5px); }
          100% { transform:translateX(calc(-100vw - 90px))    translateY(0); }
        }
        @keyframes foam-drift {
          0%  { transform:translateX(-50%); opacity:0.4; }
          50% { opacity:0.8; }
          100%{ transform:translateX(50%);  opacity:0.4; }
        }
      `}</style>
    </div>
  );
}
