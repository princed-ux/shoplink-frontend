import { useMemo } from 'react';

export default function CyberCityTheme() {
  const buildings = useMemo(() => [
    { x:0,   w:60,  h:180, lights:[{y:20},{y:60},{y:100},{y:140}] },
    { x:55,  w:40,  h:220, lights:[{y:15},{y:55},{y:95},{y:135},{y:175}] },
    { x:90,  w:70,  h:150, lights:[{y:25},{y:65},{y:105}] },
    { x:155, w:50,  h:260, lights:[{y:10},{y:50},{y:90},{y:130},{y:170},{y:210}] },
    { x:200, w:55,  h:190, lights:[{y:20},{y:60},{y:100},{y:140}] },
    { x:250, w:80,  h:140, lights:[{y:30},{y:70},{y:110}] },
    { x:325, w:45,  h:280, lights:[{y:8},{y:48},{y:88},{y:128},{y:168},{y:208}] },
    { x:365, w:60,  h:170, lights:[{y:20},{y:60},{y:100},{y:140}] },
    { x:420, w:75,  h:200, lights:[{y:15},{y:55},{y:95},{y:145}] },
    { x:490, w:40,  h:240, lights:[{y:10},{y:50},{y:90},{y:130},{y:180}] },
    { x:525, w:65,  h:160, lights:[{y:25},{y:65},{y:105}] },
  ], []);

  const energyLines = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      y: 5 + i * 12,
      duration: 3 + i * 0.6,
      delay: i * 0.5,
      color: i % 3 === 0 ? '#f0abfc' : i % 3 === 1 ? '#67e8f9' : '#4ade80',
    })), []);

  const holoParticles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      dur: 2 + Math.random() * 3,
      delay: Math.random() * 5,
      color: ['#f0abfc','#67e8f9','#4ade80'][i % 3],
    })), []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={{ background: '#020409' }}>
      {/* Dark city sky */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #020409 0%, #060b1a 40%, #0a1228 70%, #06081a 100%)',
      }} />

      {/* Atmosphere glow */}
      <div className="absolute bottom-1/3 left-0 right-0 h-1/3" style={{
        background: 'radial-gradient(ellipse 100% 80% at 50% 100%, rgba(99,102,241,0.12), transparent)',
      }} />

      {/* Grid floor */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2" style={{
        backgroundImage: 'linear-gradient(rgba(99,102,241,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.08) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        backgroundPosition: 'center bottom',
        transform: 'perspective(400px) rotateX(45deg)',
        transformOrigin: 'bottom center',
      }} />

      {/* City skyline */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '55%' }}>
        <svg viewBox="0 0 600 320" preserveAspectRatio="xMidYMax slice" style={{ width:'100%', height:'100%' }}>
          {buildings.map((b, bi) => (
            <g key={bi}>
              <rect x={b.x} y={320 - b.h} width={b.w} height={b.h} fill="#0a0f1e" stroke="rgba(99,102,241,0.15)" strokeWidth="0.5" />
              {/* Antenna */}
              <line x1={b.x + b.w / 2} y1={320 - b.h} x2={b.x + b.w / 2} y2={320 - b.h - 15}
                stroke="rgba(99,102,241,0.4)" strokeWidth="1" />
              <circle cx={b.x + b.w / 2} cy={320 - b.h - 16} r="2" fill="#f0abfc" opacity="0.8" />
              {/* Window lights */}
              {b.lights.map((l, li) => (
                <rect key={li}
                  x={b.x + 6} y={320 - b.h + l.y}
                  width={b.w - 12} height={5} rx="1"
                  fill={li % 3 === 0 ? 'rgba(103,232,249,0.4)' : li % 3 === 1 ? 'rgba(240,171,252,0.3)' : 'rgba(74,222,128,0.3)'}
                />
              ))}
              {/* Edge glow */}
              <rect x={b.x} y={320 - b.h} width={1} height={b.h}
                fill={`rgba(99,102,241,0.2)`} />
              <rect x={b.x + b.w - 1} y={320 - b.h} width={1} height={b.h}
                fill={`rgba(99,102,241,0.2)`} />
            </g>
          ))}
        </svg>
      </div>

      {/* Holographic scan lines */}
      {energyLines.map(l => (
        <div key={l.id} className="absolute left-0 right-0 overflow-hidden" style={{ top: `${l.y}%`, height: 1 }}>
          <div style={{
            height: '100%',
            background: `linear-gradient(90deg, transparent, ${l.color}80, ${l.color}, ${l.color}80, transparent)`,
            animation: `cyber-scan ${l.duration}s linear ${l.delay}s infinite`,
          }} />
        </div>
      ))}

      {/* Holo particles */}
      {holoParticles.map(p => (
        <div key={p.id} className="absolute rounded-full" style={{
          left:`${p.x}%`, top:`${p.y}%`,
          width:p.size, height:p.size,
          background:p.color,
          boxShadow:`0 0 ${p.size*3}px ${p.color}`,
          animation:`holo-flicker ${p.dur}s ease-in-out ${p.delay}s infinite alternate`,
        }} />
      ))}

      {/* Purple/cyan neon glow */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full" style={{
        background:'radial-gradient(circle, rgba(99,102,241,0.07), transparent 70%)',
        filter:'blur(50px)',
        animation:'cyber-glow1 10s ease-in-out infinite alternate',
      }} />
      <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full" style={{
        background:'radial-gradient(circle, rgba(232,121,249,0.06), transparent 70%)',
        filter:'blur(50px)',
        animation:'cyber-glow2 13s ease-in-out infinite alternate-reverse',
      }} />

      <style>{`
        @keyframes cyber-scan {
          0%  { transform:translateX(-100%); }
          100%{ transform:translateX(100vw); }
        }
        @keyframes holo-flicker {
          0%  { opacity:0.1; transform:scale(0.7); }
          100%{ opacity:0.9; transform:scale(1.4); }
        }
        @keyframes cyber-glow1 {
          0%  { transform:translate(0,0) scale(1); }
          100%{ transform:translate(30px,-25px) scale(1.2); }
        }
        @keyframes cyber-glow2 {
          0%  { transform:translate(0,0) scale(1); }
          100%{ transform:translate(-25px,20px) scale(0.9); }
        }
      `}</style>
    </div>
  );
}
