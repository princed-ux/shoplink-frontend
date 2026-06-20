import { useEffect, useRef, useMemo } from 'react';

export default function ArcticCrystalTheme() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let snowflakes = [];
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      snowflakes = Array.from({ length: 140 }, () => spawnSnow(canvas));
    };

    const spawnSnow = (c) => ({
      x: Math.random() * c.width,
      y: Math.random() * c.height - c.height,
      r: 0.9 + Math.random() * 2.8,
      vy: 0.5 + Math.random() * 1.3,
      vx: -0.3 + Math.random() * 0.6,
      opacity: 0.5 + Math.random() * 0.5,      // more visible: 0.5 – 1.0
      phase: Math.random() * Math.PI * 2,
      crystal: Math.random() > 0.65,
    });

    const drawCrystalSnow = (x, y, r, alpha) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = 'rgba(220,245,255,0.95)';
      ctx.lineWidth = 0.9;
      for (let i = 0; i < 6; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI) / 3);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -r * 2.8); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, -r * 1.3); ctx.lineTo(-r * 0.7, -r * 2.0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, -r * 1.3); ctx.lineTo( r * 0.7, -r * 2.0); ctx.stroke();
        ctx.restore();
      }
      ctx.restore();
    };

    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Random ice sparkles
      if (Math.random() < 0.06) {
        const sx = Math.random() * canvas.width;
        const sy = canvas.height * 0.6 + Math.random() * canvas.height * 0.4;
        ctx.save();
        ctx.globalAlpha = 0.7 + Math.random() * 0.3;
        ctx.strokeStyle = 'rgba(200,240,255,0.95)';
        ctx.lineWidth = 1;
        const gs = 4 + Math.random() * 6;
        ctx.beginPath();
        ctx.moveTo(sx - gs, sy); ctx.lineTo(sx + gs, sy);
        ctx.moveTo(sx, sy - gs); ctx.lineTo(sx, sy + gs);
        ctx.moveTo(sx - gs * 0.6, sy - gs * 0.6); ctx.lineTo(sx + gs * 0.6, sy + gs * 0.6);
        ctx.moveTo(sx + gs * 0.6, sy - gs * 0.6); ctx.lineTo(sx - gs * 0.6, sy + gs * 0.6);
        ctx.stroke();
        ctx.restore();
      }

      snowflakes.forEach((s, i) => {
        s.y += s.vy;
        s.x += s.vx + Math.sin(t * 0.5 + s.phase) * 0.35;
        if (s.y > canvas.height + 20) {
          snowflakes[i] = { ...spawnSnow(canvas), y: -20, x: Math.random() * canvas.width };
        }
        if (s.crystal && s.r > 1.8) {
          drawCrystalSnow(s.x, s.y, s.r, s.opacity);
        } else {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(230,248,255,${s.opacity})`;
          ctx.fill();
        }
      });

      raf = requestAnimationFrame(draw);
    };

    resize(); draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  const iceShards = useMemo(() =>
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      x: 1 + i * 7,
      y: 55 + (i % 4) * 12,
      h: 90 + Math.random() * 140,
      w: 22 + Math.random() * 28,
      dur: 6 + i * 0.7,
      delay: i * 0.5,
    })), []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">

      {/* ── Arctic twilight sky — dark enough to make everything pop ── */}
      <div className="absolute inset-0" style={{
        background: `linear-gradient(180deg,
          #071e38 0%,
          #0d3460 18%,
          #1a5fa8 38%,
          #3d8fc0 58%,
          #7ab8d4 76%,
          #b0d8ea 90%,
          #d5eef7 100%)`,
      }} />

      {/* ── Aurora borealis — vivid green bands ── */}
      <div className="absolute left-0 right-0" style={{
        top: 0, height: '50%',
        background: `linear-gradient(180deg,
          rgba(20,220,120,0.42) 0%,
          rgba(50,200,100,0.28) 25%,
          rgba(80,170,255,0.18) 55%,
          transparent)`,
        filter: 'blur(22px)',
        animation: 'arctic-aurora 14s ease-in-out infinite alternate',
      }} />
      {/* Second aurora band - teal highlight */}
      <div className="absolute left-0 right-0" style={{
        top: '5%', height: '35%',
        background: `linear-gradient(180deg,
          transparent,
          rgba(0,255,180,0.22) 30%,
          rgba(0,200,160,0.15) 65%,
          transparent)`,
        filter: 'blur(35px)',
        animation: 'arctic-aurora2 20s ease-in-out infinite alternate-reverse',
      }} />
      {/* Magenta/violet ribbon */}
      <div className="absolute left-0 right-0" style={{
        top: '8%', height: '28%',
        background: `linear-gradient(180deg,
          transparent,
          rgba(140,60,255,0.15) 40%,
          rgba(80,120,255,0.10) 70%,
          transparent)`,
        filter: 'blur(40px)',
        animation: 'arctic-aurora3 16s ease-in-out 4s infinite alternate',
      }} />

      {/* Ice crystal reflections (light beams) */}
      {Array.from({ length: 7 }, (_, i) => (
        <div key={i} className="absolute" style={{
          top: `${8 + i * 11}%`, left: `${4 + i * 14}%`,
          width: 3, height: '65%',
          background: `linear-gradient(180deg, rgba(200,240,255,0.55), rgba(150,210,245,0.25) 55%, transparent)`,
          filter: 'blur(7px)',
          transform: `rotate(${-12 + i * 4}deg)`,
          transformOrigin: 'top center',
          animation: `crystal-ray ${6 + i * 1.4}s ease-in-out ${i * 1.0}s infinite alternate`,
        }} />
      ))}

      {/* ── Ice shards — much more visible ── */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '48%', opacity: 0.58 }}>
        {iceShards.map(s => (
          <div key={s.id} className="absolute bottom-0" style={{
            left: `${s.x}%`,
            animation: `ice-shard ${s.dur}s ease-in-out ${s.delay}s infinite alternate`,
          }}>
            <svg width={s.w} height={s.h} viewBox={`0 0 ${s.w} ${s.h}`}>
              {/* Main shard */}
              <polygon
                points={`${s.w/2},0 ${s.w},${s.h*0.65} ${s.w*0.78},${s.h} ${s.w*0.22},${s.h} 0,${s.h*0.65}`}
                fill="rgba(200,238,255,0.82)"
                stroke="rgba(230,248,255,0.98)"
                strokeWidth="1.2"
              />
              {/* Center spine */}
              <line x1={s.w/2} y1="0" x2={s.w/2} y2={s.h}
                stroke="rgba(240,252,255,0.65)" strokeWidth="0.7" />
              {/* Horizontal facet lines */}
              <line x1={s.w*0.15} y1={s.h*0.35} x2={s.w*0.85} y2={s.h*0.35}
                stroke="rgba(255,255,255,0.35)" strokeWidth="0.6" />
              <line x1={s.w*0.1}  y1={s.h*0.60} x2={s.w*0.9}  y2={s.h*0.60}
                stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
            </svg>
          </div>
        ))}
      </div>

      {/* ── Distant snow mountains ── */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '42%' }}>
        <svg viewBox="0 0 1440 280" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
          {/* Far range */}
          <path d="M0,280 L0,180 C100,155 200,138 320,160 C440,182 510,200 650,165 C790,130 870,115 1020,138 C1170,161 1230,178 1380,162 L1440,158 L1440,280 Z"
            fill="rgba(15,40,75,0.40)" />
          {/* Snow caps on far range */}
          <path d="M320,160 L290,195 L360,195 Z"  fill="rgba(210,238,255,0.55)" />
          <path d="M650,165 L618,200 L688,200 Z"  fill="rgba(210,238,255,0.55)" />
          <path d="M1020,138 L988,175 L1058,175 Z" fill="rgba(210,238,255,0.55)" />
          {/* Near ridge */}
          <path d="M0,280 L0,215 C130,200 220,192 360,208 C500,224 560,232 710,215 C860,198 920,188 1080,205 C1200,218 1300,225 1440,210 L1440,280 Z"
            fill="rgba(10,28,55,0.55)" />
        </svg>
      </div>

      {/* Ice ground reflection */}
      <div className="absolute bottom-0 left-0 right-0 h-1/4" style={{
        background: 'linear-gradient(0deg, rgba(160,220,245,0.30), rgba(130,200,230,0.12), transparent)',
      }} />

      {/* Canvas: falling snow + sparkles */}
      <canvas ref={canvasRef} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />

      {/* Frost vignette */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 55%, rgba(100,170,210,0.12))',
      }} />

      <style>{`
        @keyframes arctic-aurora {
          0%  { transform:skewY(-2deg) translateX(-4%) scaleX(1.0); opacity:0.75; }
          100%{ transform:skewY(2deg)  translateX(4%)  scaleX(1.06); opacity:1.0; }
        }
        @keyframes arctic-aurora2 {
          0%  { transform:translateX(-8%) scaleX(1.05); opacity:0.55; }
          100%{ transform:translateX(8%)  scaleX(0.95); opacity:0.90; }
        }
        @keyframes arctic-aurora3 {
          0%  { transform:skewY(1deg)  translateX(5%); opacity:0.45; }
          100%{ transform:skewY(-1deg) translateX(-3%); opacity:0.80; }
        }
        @keyframes ice-shard {
          0%  { transform:translateY(0) rotate(0deg); }
          100%{ transform:translateY(-10px) rotate(0.8deg); }
        }
        @keyframes crystal-ray {
          0%  { opacity:0.30; transform:rotate(calc(-12deg)) scaleY(0.9); }
          100%{ opacity:0.75; transform:rotate(calc(10deg))  scaleY(1.12); }
        }
      `}</style>
    </div>
  );
}
