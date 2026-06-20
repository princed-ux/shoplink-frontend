import { useEffect, useRef, useMemo } from 'react';

export default function RoyalTheme() {
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
      particles = Array.from({ length: 110 }, () => spawnParticle(canvas));
    };

    const spawnParticle = (c) => ({
      x: Math.random() * c.width,
      y: c.height + 10,
      vx: -0.6 + Math.random() * 1.2,
      vy: -(0.5 + Math.random() * 1.5),
      r: 1.5 + Math.random() * 3,
      life: 0,
      max: 120 + Math.floor(Math.random() * 180),
      phase: Math.random() * Math.PI * 2,
      gold: Math.random() > 0.3,
    });

    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.life++;
        p.x += p.vx + Math.sin(t * 1.5 + p.phase) * 0.4;
        p.y += p.vy;

        const lifeRatio = p.life / p.max;
        const alpha = lifeRatio < 0.15
          ? lifeRatio / 0.15
          : lifeRatio > 0.7
          ? 1 - (lifeRatio - 0.7) / 0.3
          : 1;

        const [r, g, b] = p.gold
          ? [255, 200 + Math.sin(t * 3 + p.phase) * 30, 50]
          : [220, 180, 255];

        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        glow.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.5})`);
        glow.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.9})`;
        ctx.fill();

        // Sparkle cross on large particles
        if (p.r > 2.5 && alpha > 0.4) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(t * 0.5 + p.phase);
          const len = p.r * 3;
          ctx.beginPath();
          ctx.moveTo(-len, 0); ctx.lineTo(len, 0);
          ctx.moveTo(0, -len); ctx.lineTo(0, len);
          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.6})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
          ctx.restore();
        }

        if (p.life >= p.max) particles[i] = spawnParticle(canvas);
      });

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  const beams = useMemo(() => Array.from({ length: 5 }, (_, i) => ({
    id: i,
    x: 10 + i * 20,
    duration: 8 + i * 2,
    delay: i * 1.5,
  })), []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Rich crimson base */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(160deg, #0d0406 0%, #1a0a00 30%, #3b0d00 60%, #1a0505 100%)',
      }} />

      {/* Velvet texture simulation */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(ellipse at 1px 1px, rgba(180,60,0,0.05) 1px, transparent 0)',
        backgroundSize: '28px 28px',
      }} />

      {/* Central crimson glow */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(153,27,27,0.35), transparent 70%)',
      }} />

      {/* Gold border shimmer top */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{
        background: 'linear-gradient(90deg, transparent, #fbbf24, #fde68a, #fbbf24, transparent)',
        animation: 'gold-shimmer 4s ease-in-out infinite',
      }} />
      <div className="absolute top-0 left-0 right-0 h-6" style={{
        background: 'linear-gradient(180deg, rgba(251,191,36,0.12), transparent)',
      }} />

      {/* Luxury light beams */}
      {beams.map(b => (
        <div key={b.id} className="absolute top-0" style={{
          left: `${b.x}%`,
          width: 2,
          height: '75%',
          background: 'linear-gradient(180deg, rgba(251,191,36,0.25), rgba(251,191,36,0.08) 60%, transparent)',
          filter: 'blur(10px)',
          transformOrigin: 'top center',
          animation: `royal-beam ${b.duration}s ease-in-out ${b.delay}s infinite alternate`,
        }} />
      ))}

      {/* Crown decoration */}
      <div className="absolute" style={{
        top: '8%', left: '50%',
        transform: 'translateX(-50%)',
        animation: 'crown-float 7s ease-in-out infinite',
        opacity: 0.18,
      }}>
        <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
          <path d="M4,50 L4,28 L20,10 L40,24 L60,10 L76,28 L76,50 Z" fill="#fbbf24" />
          <circle cx="20" cy="10" r="4" fill="#fde68a" />
          <circle cx="40" cy="4" r="5" fill="#fde68a" />
          <circle cx="60" cy="10" r="4" fill="#fde68a" />
          <rect x="4" y="50" width="72" height="8" rx="2" fill="#f59e0b" />
        </svg>
      </div>

      {/* Luxury pattern diamonds */}
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="absolute" style={{
          left: `${8 + i * 12}%`,
          top: `${20 + (i % 3) * 25}%`,
          animation: `lux-pattern ${5 + i}s ease-in-out ${i * 0.7}s infinite alternate`,
          opacity: 0.06,
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <polygon points="12,2 22,12 12,22 2,12" fill="#fbbf24" />
          </svg>
        </div>
      ))}

      {/* Canvas: gold particles */}
      <canvas ref={canvasRef} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />

      {/* Bottom gold glow */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3" style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(120,53,15,0.3), transparent)',
      }} />

      <style>{`
        @keyframes gold-shimmer {
          0%  { background-position:0% 0%; opacity:0.6; }
          50% { opacity:1; }
          100%{ background-position:200% 0%; opacity:0.6; }
        }
        @keyframes royal-beam {
          0%  { opacity:0.3; transform:rotate(-3deg) scaleY(0.9); }
          100%{ opacity:0.8; transform:rotate(3deg) scaleY(1.1); }
        }
        @keyframes crown-float {
          0%,100%{ transform:translateX(-50%) translateY(0) rotate(-2deg); }
          50%    { transform:translateX(-50%) translateY(-14px) rotate(2deg); }
        }
        @keyframes lux-pattern {
          0%  { transform:rotate(0deg) scale(1); opacity:0.05; }
          100%{ transform:rotate(45deg) scale(1.2); opacity:0.12; }
        }
      `}</style>
    </div>
  );
}
