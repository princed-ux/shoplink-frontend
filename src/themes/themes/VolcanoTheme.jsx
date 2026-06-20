import { useEffect, useRef, useMemo } from 'react';

export default function VolcanoTheme() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let embers = [];
    let smoke = [];
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      embers = Array.from({ length: 80 }, () => spawnEmber(canvas));
      smoke = Array.from({ length: 15 }, () => spawnSmoke(canvas));
    };

    const spawnEmber = (c) => ({
      x: c.width * 0.35 + Math.random() * c.width * 0.3,
      y: c.height * 0.55,
      vx: -1.5 + Math.random() * 3,
      vy: -(1.5 + Math.random() * 3.5),
      r: 1.5 + Math.random() * 3,
      life: Math.floor(Math.random() * 80),
      max: 60 + Math.floor(Math.random() * 100),
      heat: Math.random(),
    });

    const spawnSmoke = (c) => ({
      x: c.width * 0.4 + Math.random() * c.width * 0.2,
      y: c.height * 0.45,
      vx: -0.2 + Math.random() * 0.4,
      vy: -(0.4 + Math.random() * 0.8),
      r: 20 + Math.random() * 40,
      life: Math.floor(Math.random() * 100),
      max: 120 + Math.floor(Math.random() * 100),
    });

    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smoke
      smoke.forEach((s, i) => {
        s.life++;
        s.x += s.vx;
        s.y += s.vy;
        s.r += 0.2;
        const lr = s.life / s.max;
        const alpha = (lr < 0.1 ? lr / 0.1 : lr > 0.6 ? 1 - (lr - 0.6) / 0.4 : 1) * 0.12;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(60,40,30,${alpha})`;
        ctx.fill();
        if (s.life >= s.max) smoke[i] = spawnSmoke(canvas);
      });

      // Embers
      embers.forEach((e, i) => {
        e.life++;
        e.x += e.vx;
        e.y += e.vy;
        e.vy += 0.04; // gravity
        const lr = e.life / e.max;
        const alpha = lr < 0.1 ? lr / 0.1 : lr > 0.7 ? 1 - (lr - 0.7) / 0.3 : 1;
        const r = 255, g = Math.floor(80 + e.heat * 120 * (1 - lr)), b = 0;
        const glow = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 3);
        glow.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.5})`);
        glow.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(e.x, e.y, e.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = glow; ctx.fill();
        ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.9})`; ctx.fill();
        if (e.life >= e.max) embers[i] = spawnEmber(canvas);
      });

      raf = requestAnimationFrame(draw);
    };

    resize(); draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Dark volcanic sky */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #0a0200 0%, #1a0500 30%, #2d0a00 55%, #1a0200 100%)',
      }} />

      {/* Lava glow from below */}
      <div className="absolute bottom-0 left-0 right-0 h-2/3" style={{
        background: 'radial-gradient(ellipse 90% 60% at 50% 100%, rgba(220,60,0,0.3), rgba(180,30,0,0.15) 50%, transparent 70%)',
      }} />

      {/* Volcano silhouette */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '55%', opacity: 0.9 }}>
        <svg viewBox="0 0 800 300" preserveAspectRatio="xMidYMax slice" style={{ width:'100%', height:'100%' }}>
          {/* Main volcano */}
          <polygon points="250,300 350,60 450,60 550,300" fill="#0d0200" />
          {/* Crater glow */}
          <ellipse cx="400" cy="60" rx="55" ry="15" fill="#cc3300" opacity="0.4" />
          <ellipse cx="400" cy="60" rx="35" ry="10" fill="#ff4400" opacity="0.6" />
          {/* Lava flow left */}
          <path d="M350,60 Q310,130 280,180 Q270,200 285,220 Q300,200 315,180 Q340,140 360,90 Z"
            fill="#cc2200" opacity="0.35" />
          {/* Lava flow right */}
          <path d="M450,60 Q490,130 520,180 Q530,200 515,220 Q500,200 485,180 Q460,140 440,90 Z"
            fill="#cc2200" opacity="0.3" />
          {/* Background mountains */}
          <polygon points="0,300 100,100 200,300"  fill="#0a0100" opacity="0.7" />
          <polygon points="600,300 700,120 800,300" fill="#0a0100" opacity="0.7" />
        </svg>
      </div>

      {/* Lava rivers at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1/6" style={{
        background: 'linear-gradient(0deg, rgba(200,50,0,0.4), rgba(150,30,0,0.2), transparent)',
        animation: 'lava-pulse 4s ease-in-out infinite alternate',
      }} />

      {/* Heat haze overlay */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 60% 40% at 50% 55%, rgba(200,80,0,0.08), transparent)',
        animation: 'heat-wave 3s ease-in-out infinite alternate',
      }} />

      {/* Canvas: embers + smoke */}
      <canvas ref={canvasRef} className="absolute inset-0" style={{ width:'100%', height:'100%' }} />

      {/* Ash vignette */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(10,2,0,0.4))',
      }} />

      <style>{`
        @keyframes lava-pulse {
          0%  { opacity:0.8; transform:scaleX(1); }
          100%{ opacity:1; transform:scaleX(1.02); }
        }
        @keyframes heat-wave {
          0%  { transform:scaleY(1) translateY(0); }
          100%{ transform:scaleY(1.02) translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
