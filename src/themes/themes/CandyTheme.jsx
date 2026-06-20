import { useMemo } from 'react';

export default function CandyTheme() {
  const candyItems = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => {
      const types = ['lollipop', 'ball', 'marshmallow', 'star'];
      const colors = ['#f9a8d4','#93c5fd','#fde68a','#a5f3fc','#c4b5fd','#86efac'];
      return {
        id: i,
        type: types[i % types.length],
        color: colors[i % colors.length],
        x: 2 + Math.random() * 95,
        y: 2 + Math.random() * 95,
        size: 12 + Math.random() * 22,
        duration: 5 + Math.random() * 8,
        delay: Math.random() * 6,
        rotation: Math.random() * 360,
      };
    }), []);

  const clouds = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: 5 + i * 20,
      y: 5 + Math.random() * 30,
      w: 80 + Math.random() * 120,
      h: 40 + Math.random() * 30,
      duration: 20 + i * 8,
      delay: i * 3,
    })), []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Pastel background */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(135deg, #fce7f3 0%, #dbeafe 35%, #fef3c7 65%, #f0fdf4 100%)',
      }} />

      {/* Bubblegum glow blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full" style={{
        background: 'radial-gradient(circle, #f9a8d4, transparent 70%)',
        opacity: 0.3, filter: 'blur(70px)',
        animation: 'candy-blob1 10s ease-in-out infinite alternate',
      }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full" style={{
        background: 'radial-gradient(circle, #93c5fd, transparent 70%)',
        opacity: 0.3, filter: 'blur(70px)',
        animation: 'candy-blob2 12s ease-in-out infinite alternate-reverse',
      }} />
      <div className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full -translate-x-1/2 -translate-y-1/2" style={{
        background: 'radial-gradient(circle, #fde68a, transparent 70%)',
        opacity: 0.2, filter: 'blur(60px)',
        animation: 'candy-blob3 8s ease-in-out infinite alternate',
      }} />

      {/* Floating clouds */}
      {clouds.map(c => (
        <div key={c.id} className="absolute" style={{
          left: `${c.x}%`, top: `${c.y}%`,
          width: c.w, height: c.h,
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.85), rgba(255,255,255,0.3))',
          borderRadius: '50%',
          filter: 'blur(12px)',
          animation: `cloud-gentle ${c.duration}s ease-in-out ${c.delay}s infinite alternate`,
        }} />
      ))}

      {/* Candy shapes */}
      {candyItems.map(item => (
        <div key={item.id} className="absolute" style={{
          left: `${item.x}%`, top: `${item.y}%`,
          animation: `candy-float ${item.duration}s ease-in-out ${item.delay}s infinite alternate`,
          transform: `rotate(${item.rotation}deg)`,
        }}>
          {item.type === 'lollipop' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: item.size, height: item.size,
                borderRadius: '50%',
                background: `radial-gradient(circle at 35% 35%, white, ${item.color})`,
                boxShadow: `0 0 ${item.size * 0.5}px ${item.color}60`,
                opacity: 0.6,
              }} />
              <div style={{ width: 2, height: item.size * 0.8, background: item.color, opacity: 0.4 }} />
            </div>
          )}
          {item.type === 'ball' && (
            <div style={{
              width: item.size, height: item.size,
              borderRadius: '50%',
              background: `radial-gradient(circle at 35% 35%, white, ${item.color})`,
              boxShadow: `0 0 ${item.size * 0.4}px ${item.color}50`,
              opacity: 0.55,
            }} />
          )}
          {item.type === 'marshmallow' && (
            <div style={{
              width: item.size * 1.3, height: item.size,
              borderRadius: item.size * 0.4,
              background: `radial-gradient(ellipse at 40% 35%, white, ${item.color}80)`,
              boxShadow: `0 2px ${item.size * 0.4}px ${item.color}40`,
              opacity: 0.55,
            }} />
          )}
          {item.type === 'star' && (
            <svg width={item.size} height={item.size} viewBox="0 0 24 24" style={{ opacity: 0.5 }}>
              <polygon points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9"
                fill={item.color} />
            </svg>
          )}
        </div>
      ))}

      <style>{`
        @keyframes candy-float {
          0%  { transform:rotate(var(--rot,0deg)) translateY(0) scale(1); }
          100%{ transform:rotate(calc(var(--rot,0deg) + 15deg)) translateY(-20px) scale(1.08); }
        }
        @keyframes candy-blob1 {
          0%  { transform:scale(1) translate(0,0); }
          100%{ transform:scale(1.2) translate(-30px,20px); }
        }
        @keyframes candy-blob2 {
          0%  { transform:scale(1) translate(0,0); }
          100%{ transform:scale(1.15) translate(25px,-15px); }
        }
        @keyframes candy-blob3 {
          0%  { transform:translate(-50%,-50%) scale(1); }
          100%{ transform:translate(-50%,-55%) scale(1.2); }
        }
        @keyframes cloud-gentle {
          0%  { transform:translateX(0) scale(1); }
          100%{ transform:translateX(20px) scale(1.05); }
        }
      `}</style>
    </div>
  );
}
