import { useEffect, useRef, useMemo } from 'react';

export default function ForestTheme() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let fireflies = [];
    let leaves = [];
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      fireflies = Array.from({ length: 55 }, () => ({
        x: Math.random() * canvas.width,
        y: canvas.height * 0.1 + Math.random() * canvas.height * 0.75,
        r: 1.5 + Math.random() * 2.5,
        vx: -0.4 + Math.random() * 0.8,
        vy: -0.3 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.04,
        color: Math.random() > 0.3
          ? { r: 180, g: 255, b: 100 }
          : { r: 255, g: 240, b: 100 },
      }));
    };

    const addLeaf = () => {
      leaves.push({
        x: Math.random() * canvas.width,
        y: -20,
        vx: -0.5 + Math.random() * 1,
        vy: 0.6 + Math.random() * 1.2,
        rot: Math.random() * Math.PI * 2,
        rotV: -0.02 + Math.random() * 0.04,
        size: 6 + Math.random() * 8,
        opacity: 0.4 + Math.random() * 0.4,
        color: Math.random() > 0.5 ? [34, 197, 94] : [22, 163, 74],
      });
    };

    let leafTimer = 0;
    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fireflies
      fireflies.forEach(f => {
        f.x += f.vx;
        f.y += f.vy;
        if (f.x < 0) f.x = canvas.width;
        if (f.x > canvas.width) f.x = 0;
        if (f.y < canvas.height * 0.1 || f.y > canvas.height * 0.9) f.vy *= -1;

        const glow = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(f.phase + t * f.speed * 60));
        const { r, g, b } = f.color;

        // Outer glow
        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 5);
        grad.addColorStop(0, `rgba(${r},${g},${b},${glow * 0.6})`);
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${glow * 0.9 + 0.1})`;
        ctx.fill();
      });

      // Falling leaves
      leafTimer += 1;
      if (leafTimer > 60) { addLeaf(); leafTimer = 0; }
      leaves = leaves.filter(l => l.y < canvas.height + 30);
      leaves.forEach(l => {
        l.x += l.vx + Math.sin(t * 2) * 0.3;
        l.y += l.vy;
        l.rot += l.rotV;
        ctx.save();
        ctx.translate(l.x, l.y);
        ctx.rotate(l.rot);
        ctx.globalAlpha = l.opacity;
        ctx.beginPath();
        ctx.ellipse(0, 0, l.size, l.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${l.color[0]},${l.color[1]},${l.color[2]})`;
        ctx.fill();
        ctx.restore();
      });

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  // Tree silhouettes memoized
  const trees = useMemo(() => [
    { x: '-5%', w: 180, h: 320, opacity: 0.55 },
    { x: '8%',  w: 140, h: 280, opacity: 0.45 },
    { x: '78%', w: 160, h: 300, opacity: 0.5  },
    { x: '88%', w: 120, h: 260, opacity: 0.4  },
    { x: '65%', w: 100, h: 220, opacity: 0.35 },
  ], []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Forest base */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #052e16 0%, #14532d 30%, #166534 60%, #15803d 100%)',
      }} />

      {/* Sun rays from top */}
      {[20, 35, 50, 65, 80].map((x, i) => (
        <div key={i} className="absolute top-0" style={{
          left: `${x}%`,
          width: 2 + i % 2,
          height: '65%',
          background: 'linear-gradient(180deg, rgba(255,230,100,0.15) 0%, rgba(255,200,50,0.04) 70%, transparent)',
          filter: 'blur(8px)',
          transformOrigin: 'top center',
          transform: `rotate(${-5 + i * 2.5}deg)`,
          animation: `ray-forest ${7 + i * 1.5}s ease-in-out ${i * 1.2}s infinite alternate`,
        }} />
      ))}

      {/* Fog layers */}
      <div className="absolute" style={{
        bottom: '15%', left: 0, right: 0, height: 120,
        background: 'linear-gradient(0deg, transparent, rgba(200,255,200,0.08) 40%, rgba(180,255,180,0.05), transparent)',
        filter: 'blur(25px)',
        animation: 'fog-drift1 20s ease-in-out infinite alternate',
      }} />
      <div className="absolute" style={{
        bottom: '25%', left: 0, right: 0, height: 80,
        background: 'linear-gradient(0deg, transparent, rgba(210,255,210,0.06), transparent)',
        filter: 'blur(30px)',
        animation: 'fog-drift2 28s ease-in-out infinite alternate-reverse',
      }} />

      {/* Tree silhouettes */}
      {trees.map((tree, i) => (
        <div key={i} className="absolute bottom-0" style={{
          left: tree.x,
          width: tree.w, height: tree.h,
          opacity: tree.opacity,
        }}>
          <svg viewBox="0 0 100 180" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            {/* Trunk */}
            <rect x="44" y="130" width="12" height="50" fill="#052e16" />
            {/* Foliage layers */}
            <polygon points="50,0 80,70 20,70" fill="#052e16" />
            <polygon points="50,25 85,100 15,100" fill="#052e16" />
            <polygon points="50,55 90,135 10,135" fill="#052e16" />
          </svg>
        </div>
      ))}

      {/* Ground glow */}
      <div className="absolute bottom-0 left-0 right-0 h-1/4" style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(34,197,94,0.15), transparent)',
      }} />

      {/* Canvas: fireflies + leaves */}
      <canvas ref={canvasRef} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />

      <style>{`
        @keyframes fog-drift1 {
          0%  { transform:translateX(-5%) scaleX(1); opacity:0.6; }
          100%{ transform:translateX(5%) scaleX(1.05); opacity:1; }
        }
        @keyframes fog-drift2 {
          0%  { transform:translateX(5%) scaleX(0.95); opacity:0.5; }
          100%{ transform:translateX(-3%) scaleX(1.02); opacity:0.9; }
        }
        @keyframes ray-forest {
          0%  { opacity:0.4; transform:rotate(calc(-5deg + var(--ri,0))) scaleY(0.9); }
          100%{ opacity:0.8; transform:rotate(calc(5deg + var(--ri,0))) scaleY(1.1); }
        }
      `}</style>
    </div>
  );
}
