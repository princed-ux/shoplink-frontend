import { useMemo } from 'react';

export default function BubblesTheme() {
  const balls = useMemo(() =>
    Array.from({ length: 22 }, (_, i) => ({
      id: i,
      size: 18 + Math.random() * 60,
      top: Math.random() * 92,
      left: Math.random() * 92,
      duration: 3 + Math.random() * 5,
      delay: -Math.random() * 6,
      hue: 130 + Math.random() * 30,
    })), []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-slate-50" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, #dcfce7, transparent)' }} />
      {balls.map(b => (
        <div key={b.id} className="absolute rounded-full"
          style={{
            width: b.size, height: b.size,
            top: `${b.top}%`, left: `${b.left}%`,
            background: `linear-gradient(135deg, hsl(${b.hue},70%,55%), hsl(${b.hue + 15},80%,40%))`,
            opacity: 0.22,
            willChange: 'transform',
            animation: `bubble-bounce ${b.duration}s ease-in-out infinite alternate`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes bubble-bounce {
          from { transform: translateY(0) scale(1); }
          to   { transform: translateY(-28px) scale(1.06); }
        }
      `}</style>
    </div>
  );
}
