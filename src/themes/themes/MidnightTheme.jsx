import { useEffect, useRef, useMemo } from 'react';

export default function MidnightTheme() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let stars = [];
    let shooters = [];
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from({ length: 300 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.85,
        r: Math.random() * 1.5 + 0.3,
        base: Math.random() * 0.55 + 0.2,
        speed: Math.random() * 0.04 + 0.01,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Twinkling stars
      stars.forEach(s => {
        const tw = s.base + (1 - s.base) * 0.5 * (1 + Math.sin(s.phase + t * s.speed * 60));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${tw})`;
        ctx.fill();
        if (s.r > 1.1) {
          ctx.beginPath();
          ctx.moveTo(s.x - s.r * 2.5, s.y); ctx.lineTo(s.x + s.r * 2.5, s.y);
          ctx.moveTo(s.x, s.y - s.r * 2.5); ctx.lineTo(s.x, s.y + s.r * 2.5);
          ctx.strokeStyle = `rgba(255,255,255,${tw * 0.3})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });

      // Shooting stars
      if (Math.random() < 0.004) {
        shooters.push({
          x: Math.random() * canvas.width * 0.7,
          y: Math.random() * canvas.height * 0.35,
          vx: 4 + Math.random() * 5,
          vy: 2 + Math.random() * 2.5,
          life: 0,
          max: 55 + Math.floor(Math.random() * 40),
        });
      }
      shooters = shooters.filter(s => s.life < s.max);
      shooters.forEach(s => {
        s.life++;
        s.x += s.vx; s.y += s.vy;
        const p = s.life / s.max;
        const alpha = p < 0.25 ? p / 0.25 : 1 - (p - 0.25) / 0.75;
        const tail = 14;
        const grad = ctx.createLinearGradient(s.x - s.vx * tail, s.y - s.vy * tail, s.x, s.y);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, `rgba(255,255,255,${alpha})`);
        ctx.beginPath();
        ctx.moveTo(s.x - s.vx * tail, s.y - s.vy * tail);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  const nebulae = useMemo(() => [
    { top: '15%', left: '20%',  w: 380, h: 180, color: '#4c1d95', dur: 22, delay: 0 },
    { top: '25%', right: '15%', w: 300, h: 140, color: '#1e3a8a', dur: 28, delay: 6 },
    { top: '40%', left: '50%',  w: 250, h: 120, color: '#312e81', dur: 18, delay: 3 },
  ], []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Sky gradient */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #000814 0%, #001233 25%, #023e8a 60%, #1a1a2e 100%)',
      }} />

      {/* ── CRESCENT MOON (C-shape, moved lower) ── */}
      <div className="absolute" style={{
        top: '17%', right: '11%',
        animation: 'moon-float 9s ease-in-out infinite',
      }}>
        {/* Large diffuse glow behind moon */}
        <div className="absolute rounded-full" style={{
          width: 200, height: 200,
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          background: 'radial-gradient(circle at 35% 50%, rgba(254,240,138,0.18), transparent 65%)',
          filter: 'blur(28px)',
        }} />
        <div className="absolute rounded-full" style={{
          width: 110, height: 110,
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          background: 'radial-gradient(circle at 35% 50%, rgba(254,240,138,0.28), transparent 65%)',
          filter: 'blur(14px)',
        }} />

        {/* Crescent moon SVG — C-shape (bite from the right creates C) */}
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" overflow="visible">
          <defs>
            <radialGradient id="moonGrad" cx="32%" cy="28%" r="70%" gradientUnits="objectBoundingBox">
              <stop offset="0%"  stopColor="#fefce8" />
              <stop offset="45%" stopColor="#fef08a" />
              <stop offset="85%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#ca8a04" />
            </radialGradient>
            {/* Mask: full moon MINUS a circle offset to the right → leaves a C on the left */}
            <mask id="crescentMask">
              <circle cx="40" cy="40" r="30" fill="white" />
              {/* Bite circle — offset RIGHT creates C-shape visible on LEFT */}
              <circle cx="55" cy="38" r="25" fill="black" />
            </mask>
          </defs>

          {/* Soft halo just around the crescent area */}
          <ellipse cx="28" cy="40" rx="22" ry="26" fill="rgba(253,224,71,0.10)" style={{ filter: 'blur(10px)' }} />

          {/* Moon body — crescent shape via mask */}
          <circle cx="40" cy="40" r="30" fill="url(#moonGrad)" mask="url(#crescentMask)" />

          {/* Subtle craters on the visible crescent */}
          <circle cx="22" cy="34" r="2.8" fill="rgba(253,224,71,0.22)" mask="url(#crescentMask)" />
          <circle cx="27" cy="50" r="2"   fill="rgba(253,224,71,0.18)" mask="url(#crescentMask)" />
          <circle cx="17" cy="44" r="1.5" fill="rgba(253,224,71,0.15)" mask="url(#crescentMask)" />

          {/* Faint inner-edge glow on the shadow side */}
          <circle cx="55" cy="38" r="25" fill="none"
            stroke="rgba(254,249,195,0.18)" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Nebula clouds */}
      {nebulae.map((n, i) => (
        <div key={i} className="absolute rounded-full" style={{
          top: n.top, left: n.left, right: n.right,
          width: n.w, height: n.h,
          background: `radial-gradient(ellipse, ${n.color}32, transparent 70%)`,
          filter: 'blur(40px)',
          animation: `nebula-drift ${n.dur}s ease-in-out ${n.delay}s infinite`,
        }} />
      ))}

      {/* Canvas: stars + shooting stars */}
      <canvas ref={canvasRef} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />

      {/* Ground atmosphere */}
      <div className="absolute bottom-0 left-0 right-0 h-1/4" style={{
        background: 'linear-gradient(0deg, rgba(2,62,138,0.15), transparent)',
      }} />

      <style>{`
        @keyframes moon-float {
          0%,100%{ transform:translateY(0) rotate(-1deg); }
          50%    { transform:translateY(-12px) rotate(1deg); }
        }
        @keyframes nebula-drift {
          0%  { transform:translate(0,0) scale(1);   opacity:0.6; }
          33% { transform:translate(25px,-15px) scale(1.08); opacity:0.9; }
          66% { transform:translate(-15px,10px) scale(0.95); opacity:0.7; }
          100%{ transform:translate(0,0) scale(1);   opacity:0.6; }
        }
      `}</style>
    </div>
  );
}
