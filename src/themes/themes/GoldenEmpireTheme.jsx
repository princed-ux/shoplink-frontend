import { useEffect, useRef, useMemo } from 'react';

export default function GoldenEmpireTheme() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let particles = [];
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: 80 }, () => spawn(canvas));
    };

    const spawn = (c) => ({
      x: Math.random() * c.width,
      y: c.height + 10,
      vx: -0.5 + Math.random() * 1,
      vy: -(0.4 + Math.random() * 1.2),
      r: 1 + Math.random() * 2.5,
      life: 0,
      max: 150 + Math.floor(Math.random() * 150),
      phase: Math.random() * Math.PI * 2,
    });

    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.life++;
        p.x += p.vx + Math.sin(t + p.phase) * 0.3;
        p.y += p.vy;
        const lr = p.life / p.max;
        const alpha = lr < 0.1 ? lr / 0.1 : lr > 0.75 ? 1 - (lr - 0.75) / 0.25 : 1;
        const r = 255, g = 190 + Math.sin(t * 2 + p.phase) * 40, b = 30;
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        glow.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.45})`);
        glow.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = glow; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.85})`; ctx.fill();
        if (p.life >= p.max) particles[i] = spawn(canvas);
      });
      raf = requestAnimationFrame(draw);
    };

    resize(); draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  const pillars = useMemo(() => [
    { x: '5%',  h: '70%' }, { x: '12%', h: '60%' },
    { x: '82%', h: '65%' }, { x: '90%', h: '55%' },
  ], []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Imperial base */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #1c0a00 0%, #2d1400 30%, #3d1a00 60%, #1c0a00 100%)',
      }} />
      {/* Imperial sky glow */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(180,90,0,0.2), transparent 70%)',
      }} />

      {/* Gold shimmer top border */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{
        background: 'linear-gradient(90deg, transparent, #fbbf24cc, #fde68aff, #fbbf24cc, transparent)',
        animation: 'empire-top-shine 5s ease-in-out infinite',
      }} />
      <div className="absolute top-0 left-0 right-0" style={{
        height: 40,
        background: 'linear-gradient(180deg, rgba(251,191,36,0.15), transparent)',
      }} />

      {/* Palace silhouette */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height:'50%', opacity:0.25 }}>
        <svg viewBox="0 0 800 280" preserveAspectRatio="xMidYMax slice" style={{ width:'100%', height:'100%' }}>
          {/* Main palace */}
          <rect x="250" y="80" width="300" height="200" fill="#1c0a00" />
          {/* Central dome */}
          <ellipse cx="400" cy="80" rx="80" ry="50" fill="#1c0a00" />
          <ellipse cx="400" cy="55" rx="35" ry="25" fill="#1c0a00" />
          {/* Spires */}
          <polygon points="400,0 408,55 392,55" fill="#1c0a00" />
          <polygon points="320,50 326,90 314,90" fill="#1c0a00" />
          <polygon points="480,50 486,90 474,90" fill="#1c0a00" />
          {/* Side wings */}
          <rect x="100" y="130" width="160" height="150" fill="#1c0a00" />
          <rect x="540" y="130" width="160" height="150" fill="#1c0a00" />
          {/* Wing domes */}
          <ellipse cx="180" cy="130" rx="45" ry="28" fill="#1c0a00" />
          <ellipse cx="620" cy="130" rx="45" ry="28" fill="#1c0a00" />
          {/* Windows */}
          {[290,330,370,410,450,490].map((x, i) => (
            <rect key={i} x={x} y={120} width={20} height={30} rx="10" fill="#3d1a0040" />
          ))}
          {/* Gold edge highlights */}
          <path d="M250,80 L550,80 L550,280 L250,280 Z" fill="none" stroke="#fbbf2420" strokeWidth="1" />
        </svg>
      </div>

      {/* Decorative pillars */}
      {pillars.map((p, i) => (
        <div key={i} className="absolute bottom-0" style={{
          left: p.left, right: p.right, width: 8,
          height: p.h, left: p.x,
          background: 'linear-gradient(180deg, rgba(251,191,36,0.25), rgba(251,191,36,0.1) 80%, transparent)',
          filter: 'blur(3px)',
        }} />
      ))}

      {/* Gold light beams */}
      {[15, 35, 50, 65, 85].map((x, i) => (
        <div key={i} className="absolute top-0" style={{
          left: `${x}%`, width: 2, height: '70%',
          background: 'linear-gradient(180deg, rgba(251,191,36,0.2), rgba(251,191,36,0.05) 70%, transparent)',
          filter: 'blur(12px)',
          animation: `empire-beam ${8 + i * 1.5}s ease-in-out ${i * 1.2}s infinite alternate`,
        }} />
      ))}

      {/* Canvas: gold particles */}
      <canvas ref={canvasRef} className="absolute inset-0" style={{ width:'100%', height:'100%' }} />

      <style>{`
        @keyframes empire-top-shine {
          0%  { opacity:0.5; background-position:0%; }
          50% { opacity:1; }
          100%{ opacity:0.5; background-position:200%; }
        }
        @keyframes empire-beam {
          0%  { opacity:0.2; transform:rotate(-3deg); }
          100%{ opacity:0.6; transform:rotate(3deg); }
        }
      `}</style>
    </div>
  );
}
