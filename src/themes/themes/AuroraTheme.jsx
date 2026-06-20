export default function AuroraTheme() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={{ background: '#050d1a' }}>
      {/* Base sky */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #000814 0%, #050d1a 40%, #0a1628 100%)' }} />

      {/* Aurora band 1 - slow teal */}
      <div className="absolute left-0 right-0" style={{
        top: '5%', height: '45%',
        background: 'linear-gradient(180deg, transparent, rgba(16,185,129,0.22) 30%, rgba(6,182,212,0.18) 60%, transparent)',
        filter: 'blur(30px)',
        animation: 'aurora-wave1 14s ease-in-out infinite',
      }} />

      {/* Aurora band 2 - medium emerald */}
      <div className="absolute left-0 right-0" style={{
        top: '10%', height: '40%',
        background: 'linear-gradient(180deg, transparent, rgba(52,211,153,0.18) 40%, rgba(20,184,166,0.14) 70%, transparent)',
        filter: 'blur(40px)',
        animation: 'aurora-wave2 10s ease-in-out infinite alternate',
      }} />

      {/* Aurora band 3 - fast violet */}
      <div className="absolute left-0 right-0" style={{
        top: '0%', height: '55%',
        background: 'linear-gradient(180deg, transparent, rgba(124,58,237,0.12) 30%, rgba(99,102,241,0.10) 60%, transparent)',
        filter: 'blur(50px)',
        animation: 'aurora-wave3 18s ease-in-out infinite',
      }} />

      {/* Large glowing orbs */}
      <div className="absolute rounded-full" style={{
        top: '8%', left: '15%', width: 520, height: 260,
        background: 'radial-gradient(ellipse, rgba(16,185,129,0.15), transparent 70%)',
        filter: 'blur(60px)',
        animation: 'aurora-orb1 12s ease-in-out infinite alternate',
      }} />
      <div className="absolute rounded-full" style={{
        top: '5%', right: '5%', width: 420, height: 200,
        background: 'radial-gradient(ellipse, rgba(6,182,212,0.12), transparent 70%)',
        filter: 'blur(70px)',
        animation: 'aurora-orb2 15s ease-in-out infinite alternate-reverse',
      }} />
      <div className="absolute rounded-full" style={{
        top: '15%', left: '40%', width: 360, height: 180,
        background: 'radial-gradient(ellipse, rgba(52,211,153,0.10), transparent 70%)',
        filter: 'blur(50px)',
        animation: 'aurora-orb3 9s ease-in-out infinite alternate',
      }} />

      {/* Distant stars */}
      {Array.from({ length: 60 }, (_, i) => (
        <div key={i} className="absolute rounded-full bg-white"
          style={{
            width: Math.random() * 1.5 + 0.5,
            height: Math.random() * 1.5 + 0.5,
            top: `${Math.random() * 55}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.1,
            animation: `star-twinkle ${3 + Math.random() * 5}s ease-in-out ${Math.random() * 4}s infinite alternate`,
          }}
        />
      ))}

      {/* Ground reflection */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3" style={{
        background: 'linear-gradient(0deg, rgba(16,185,129,0.05), transparent)',
        filter: 'blur(20px)',
      }} />

      <style>{`
        @keyframes aurora-wave1 {
          0%  { transform: scaleX(1) skewY(-1deg) translateX(0); }
          33% { transform: scaleX(1.08) skewY(1deg) translateX(20px); }
          66% { transform: scaleX(0.95) skewY(-0.5deg) translateX(-15px); }
          100%{ transform: scaleX(1) skewY(-1deg) translateX(0); }
        }
        @keyframes aurora-wave2 {
          0%  { transform: skewY(2deg) translateX(-30px) scaleX(1.1); }
          100%{ transform: skewY(-1deg) translateX(40px) scaleX(0.95); }
        }
        @keyframes aurora-wave3 {
          0%  { transform: scaleX(0.9) skewY(1.5deg) translateX(10px); }
          50% { transform: scaleX(1.05) skewY(-1deg) translateX(-20px); }
          100%{ transform: scaleX(0.9) skewY(1.5deg) translateX(10px); }
        }
        @keyframes aurora-orb1 {
          0%  { transform: translateX(0) translateY(0) scale(1); }
          100%{ transform: translateX(60px) translateY(20px) scale(1.15); }
        }
        @keyframes aurora-orb2 {
          0%  { transform: translateX(0) translateY(0) scale(1); }
          100%{ transform: translateX(-50px) translateY(30px) scale(1.2); }
        }
        @keyframes aurora-orb3 {
          0%  { transform: translateX(0) translateY(0) scale(1); }
          100%{ transform: translateX(40px) translateY(-20px) scale(0.85); }
        }
        @keyframes star-twinkle {
          0%  { opacity: 0.1; transform: scale(0.8); }
          100%{ opacity: 0.7; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
