import { useEffect, useRef, useMemo } from 'react';

export default function GalaxyTheme() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let stars = [];
    let dust = [];
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from({ length: 300 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.6 + 0.2,
        base: Math.random() * 0.5 + 0.2,
        speed: Math.random() * 0.03 + 0.008,
        phase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.8 ? [255, 200, 150] : Math.random() > 0.5 ? [150, 200, 255] : [255, 255, 255],
      }));
      dust = Array.from({ length: 60 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 0.5 + Math.random() * 1.5,
        alpha: Math.random() * 0.25 + 0.05,
        speed: Math.random() * 0.015,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Cosmic dust
      dust.forEach(d => {
        const tw = d.alpha * (0.5 + 0.5 * Math.sin(d.phase + t * d.speed * 60));
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,160,255,${tw})`;
        ctx.fill();
      });

      // Stars
      stars.forEach(s => {
        const tw = s.base + (1 - s.base) * 0.5 * (1 + Math.sin(s.phase + t * s.speed * 60));
        const [r, g, b] = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${tw})`;
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
    { top:'10%', left:'5%',  w:500, h:250, color:'#7c3aed', opacity:0.12, dur:22, delay:0 },
    { top:'40%', right:'5%', w:400, h:200, color:'#1d4ed8', opacity:0.10, dur:28, delay:8 },
    { top:'25%', left:'35%', w:360, h:180, color:'#be185d', opacity:0.08, dur:18, delay:4 },
  ], []);

  const planets = useMemo(() => [
    { top:'15%', right:'18%', size:40, color:'#a855f7', ring:true,  dur:12, delay:0 },
    { top:'55%', left:'8%',   size:22, color:'#3b82f6', ring:false, dur:9,  delay:3 },
    { top:'70%', right:'12%', size:15, color:'#f97316', ring:false, dur:7,  delay:1.5 },
  ], []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Deep space */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(160deg, #000000 0%, #0a0015 30%, #07001f 60%, #000814 100%)',
      }} />

      {/* Milky way band */}
      <div className="absolute" style={{
        top: '20%', left: '-10%', right: '-10%', height: '60%',
        background: 'linear-gradient(105deg, transparent, rgba(120,100,200,0.06) 30%, rgba(180,150,255,0.08) 50%, rgba(100,80,180,0.06) 70%, transparent)',
        filter: 'blur(40px)',
        transform: 'rotate(-15deg)',
        animation: 'galaxy-band 30s ease-in-out infinite alternate',
      }} />

      {/* Nebulae */}
      {nebulae.map((n, i) => (
        <div key={i} className="absolute rounded-full" style={{
          top: n.top, left: n.left, right: n.right,
          width: n.w, height: n.h,
          background: `radial-gradient(ellipse, ${n.color}40, transparent 70%)`,
          opacity: n.opacity * 8,
          filter: 'blur(50px)',
          animation: `nebula-slow ${n.dur}s ease-in-out ${n.delay}s infinite`,
        }} />
      ))}

      {/* Planets */}
      {planets.map((p, i) => (
        <div key={i} className="absolute" style={{
          top: p.top, left: p.left, right: p.right,
          animation: `planet-float ${p.dur}s ease-in-out ${p.delay}s infinite alternate`,
        }}>
          <div style={{ position:'relative', width:p.size, height:p.size }}>
            {/* Planet glow */}
            <div className="absolute rounded-full" style={{
              inset: -p.size * 0.4,
              background: `radial-gradient(circle, ${p.color}25, transparent 70%)`,
              filter: 'blur(10px)',
            }} />
            {/* Planet body */}
            <div className="rounded-full" style={{
              width:p.size, height:p.size,
              background: `radial-gradient(circle at 35% 35%, ${p.color}dd, ${p.color}66)`,
              boxShadow: `0 0 20px ${p.color}40`,
            }} />
            {/* Ring */}
            {p.ring && (
              <div style={{
                position:'absolute',
                top:'40%', left:'-55%',
                width:p.size * 2.1, height:p.size * 0.35,
                border: `2px solid rgba(168,85,247,0.4)`,
                borderRadius:'50%',
                transform: 'rotate(-20deg)',
              }} />
            )}
          </div>
        </div>
      ))}

      {/* Canvas: stars + dust */}
      <canvas ref={canvasRef} className="absolute inset-0" style={{ width:'100%', height:'100%' }} />

      <style>{`
        @keyframes galaxy-band {
          0%  { opacity:0.5; transform:rotate(-15deg) scaleX(1); }
          100%{ opacity:0.9; transform:rotate(-12deg) scaleX(1.05); }
        }
        @keyframes nebula-slow {
          0%  { transform:translate(0,0) scale(1); }
          33% { transform:translate(20px,-15px) scale(1.06); }
          66% { transform:translate(-15px,10px) scale(0.96); }
          100%{ transform:translate(0,0) scale(1); }
        }
        @keyframes planet-float {
          0%  { transform:translateY(0); }
          100%{ transform:translateY(-12px); }
        }
      `}</style>
    </div>
  );
}
