import { useEffect, useRef, useMemo } from 'react';

export default function DiamondTheme() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let crystals = [];
    let t = 0;

    const COLORS = [
      [200, 220, 255],
      [220, 240, 255],
      [180, 220, 255],
      [255, 255, 255],
      [200, 180, 255],
    ];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      crystals = Array.from({ length: 90 }, () => spawnCrystal(canvas));
    };

    const spawnCrystal = (c) => {
      const col = COLORS[Math.floor(Math.random() * COLORS.length)];
      return {
        x: Math.random() * c.width,
        y: Math.random() * c.height,
        vx: -0.3 + Math.random() * 0.6,
        vy: -(0.2 + Math.random() * 0.8),
        r: 1 + Math.random() * 3.5,
        life: Math.floor(Math.random() * 200),
        max: 150 + Math.floor(Math.random() * 200),
        rot: Math.random() * Math.PI * 2,
        rotV: -0.01 + Math.random() * 0.02,
        phase: Math.random() * Math.PI * 2,
        color: col,
        type: Math.random() > 0.4 ? 'diamond' : 'sparkle',
      };
    };

    const drawDiamond = (x, y, r, alpha, col) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.PI / 4);
      // Facets
      const c1 = `rgba(${col[0]},${col[1]},${col[2]},${alpha})`;
      const c2 = `rgba(${Math.min(col[0]+30,255)},${Math.min(col[1]+30,255)},${Math.min(col[2]+30,255)},${alpha * 0.6})`;
      ctx.beginPath();
      ctx.moveTo(0, -r * 1.5);
      ctx.lineTo(r, 0);
      ctx.lineTo(0, r * 1.5);
      ctx.lineTo(-r, 0);
      ctx.closePath();
      const grd = ctx.createLinearGradient(-r, -r * 1.5, r, r * 1.5);
      grd.addColorStop(0, c1);
      grd.addColorStop(0.5, c2);
      grd.addColorStop(1, c1);
      ctx.fillStyle = grd;
      ctx.fill();
      ctx.restore();
    };

    const drawSparkle = (x, y, r, alpha, col) => {
      ctx.save();
      ctx.translate(x, y);
      const c = `rgba(${col[0]},${col[1]},${col[2]},${alpha})`;
      for (let a = 0; a < 4; a++) {
        ctx.save();
        ctx.rotate((a * Math.PI) / 2);
        ctx.beginPath();
        ctx.moveTo(0, -r * 3);
        ctx.lineTo(r * 0.4, -r * 0.4);
        ctx.lineTo(0, 0);
        ctx.lineTo(-r * 0.4, -r * 0.4);
        ctx.closePath();
        ctx.fillStyle = c;
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    };

    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      crystals.forEach((p, i) => {
        p.life++;
        p.x += p.vx + Math.sin(t * 0.8 + p.phase) * 0.2;
        p.y += p.vy;
        p.rot += p.rotV;

        const lr = p.life / p.max;
        const alpha = lr < 0.1 ? lr / 0.1 : lr > 0.75 ? 1 - (lr - 0.75) / 0.25 : 1;

        // Glow
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
        glow.addColorStop(0, `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${alpha * 0.25})`);
        glow.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.translate(-p.x, -p.y);
        if (p.type === 'diamond') {
          drawDiamond(p.x, p.y, p.r, alpha * 0.8, p.color);
        } else {
          drawSparkle(p.x, p.y, p.r, alpha * 0.7, p.color);
        }
        ctx.restore();

        if (p.life >= p.max || p.y < -20) crystals[i] = spawnCrystal(canvas);
      });

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  const prismBeams = useMemo(() => [
    { x: '20%', color: '#bfdbfe', angle: -15, dur: 9, delay: 0 },
    { x: '35%', color: '#e0e7ff', angle: -8,  dur: 12, delay: 2 },
    { x: '50%', color: '#f0abfc', angle: 0,   dur: 8,  delay: 1 },
    { x: '65%', color: '#a5f3fc', angle: 8,   dur: 11, delay: 3 },
    { x: '80%', color: '#ddd6fe', angle: 15,  dur: 10, delay: 1.5 },
  ], []);

  const floatingCrystals = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 5 + i * 12,
      y: 10 + (i % 3) * 25,
      size: 18 + Math.random() * 24,
      duration: 6 + i * 1.2,
      delay: i * 0.8,
    })), []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Platinum/silver base */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(160deg, #0a0e1a 0%, #0f1729 30%, #1a2540 60%, #0d1b35 100%)',
      }} />

      {/* Deep shine overlay */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(100,160,255,0.08), transparent 70%)',
      }} />

      {/* Glassmorphism panels */}
      <div className="absolute" style={{
        top: '15%', left: '5%', width: '90%', height: '70%',
        background: 'rgba(180,220,255,0.02)',
        borderRadius: '40px',
        border: '1px solid rgba(180,220,255,0.06)',
        backdropFilter: 'blur(1px)',
      }} />

      {/* Prism light beams */}
      {prismBeams.map((b, i) => (
        <div key={i} className="absolute top-0" style={{
          left: b.x,
          width: 3,
          height: '80%',
          background: `linear-gradient(180deg, ${b.color}40, ${b.color}15 60%, transparent)`,
          filter: 'blur(12px)',
          transformOrigin: 'top center',
          transform: `rotate(${b.angle}deg)`,
          animation: `prism-beam ${b.dur}s ease-in-out ${b.delay}s infinite alternate`,
        }} />
      ))}

      {/* Reflective highlights */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        style={{ animation: 'diamond-shine 5s ease-in-out infinite' }} />
      <div className="absolute top-0 left-0 right-0 h-8" style={{
        background: 'linear-gradient(180deg, rgba(200,220,255,0.1), transparent)',
      }} />

      {/* Floating crystal shapes */}
      {floatingCrystals.map(c => (
        <div key={c.id} className="absolute" style={{
          left: `${c.x}%`, top: `${c.y}%`,
          animation: `crystal-float ${c.duration}s ease-in-out ${c.delay}s infinite alternate`,
          opacity: 0.12,
        }}>
          <svg width={c.size} height={c.size * 1.6} viewBox="0 0 30 48">
            <polygon points="15,0 30,12 30,36 15,48 0,36 0,12" fill="none" stroke="#93c5fd" strokeWidth="1.5" />
            <polygon points="15,4 26,13 26,35 15,44 4,35 4,13" fill="rgba(147,197,253,0.2)" />
            <line x1="15" y1="0" x2="15" y2="48" stroke="#bfdbfe" strokeWidth="0.5" opacity="0.5" />
            <line x1="0" y1="24" x2="30" y2="24" stroke="#bfdbfe" strokeWidth="0.5" opacity="0.5" />
          </svg>
        </div>
      ))}

      {/* Canvas: crystal dust */}
      <canvas ref={canvasRef} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />

      {/* Edge shimmer */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 0% 50%, rgba(147,197,253,0.06), transparent 40%), radial-gradient(ellipse at 100% 50%, rgba(221,214,254,0.06), transparent 40%)',
      }} />

      <style>{`
        @keyframes prism-beam {
          0%  { opacity:0.2; transform:rotate(calc(var(--pa,0deg) - 3deg)) scaleY(0.85); }
          100%{ opacity:0.7; transform:rotate(calc(var(--pa,0deg) + 3deg)) scaleY(1.1); }
        }
        @keyframes diamond-shine {
          0%  { transform:translateX(-100%); opacity:0; }
          40% { opacity:1; }
          100%{ transform:translateX(100%); opacity:0; }
        }
        @keyframes crystal-float {
          0%  { transform:translateY(0) rotate(-5deg); }
          100%{ transform:translateY(-18px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}
