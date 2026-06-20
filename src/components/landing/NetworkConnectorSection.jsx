import { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import shopLink_logo from '../../assets/logo.png';

// ── Brand SVG Logos ──────────────────────────────────────────────────────────

const InstagramLogo = ({ size = 30 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
    <defs>
      <linearGradient id="ig-g" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f09433"/>
        <stop offset="25%" stopColor="#e6683c"/>
        <stop offset="50%" stopColor="#dc2743"/>
        <stop offset="75%" stopColor="#cc2366"/>
        <stop offset="100%" stopColor="#bc1888"/>
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5.5" fill="url(#ig-g)"/>
    <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.8" fill="none"/>
    <circle cx="17.3" cy="6.7" r="1.2" fill="white"/>
  </svg>
);

const TikTokLogo = ({ size = 30 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <rect width="24" height="24" rx="6" fill="#010101"/>
    <path d="M13.5 3h-2v11.5a2.5 2.5 0 01-2.5 2.5 2.5 2.5 0 01-2.5-2.5 2.5 2.5 0 012.5-2.5c.24 0 .47.03.69.09V9.55a6.01 6.01 0 00-.69-.05 6 6 0 00-6 6 6 6 0 006 6 6 6 0 006-6V8.5a7.46 7.46 0 004 1.16V7.18a5.48 5.48 0 01-3.5-1.68V3z"
      fill="#EE1D52" opacity="0.6" transform="translate(0.5, 0)"/>
    <path d="M13.5 3h-2v11.5a2.5 2.5 0 01-2.5 2.5 2.5 2.5 0 01-2.5-2.5 2.5 2.5 0 012.5-2.5c.24 0 .47.03.69.09V9.55a6.01 6.01 0 00-.69-.05 6 6 0 00-6 6 6 6 0 006 6 6 6 0 006-6V8.5a7.46 7.46 0 004 1.16V7.18a5.48 5.48 0 01-3.5-1.68V3z"
      fill="#69C9D0" opacity="0.6" transform="translate(-0.5, 0)"/>
    <path d="M13.5 3h-2v11.5a2.5 2.5 0 01-2.5 2.5 2.5 2.5 0 01-2.5-2.5 2.5 2.5 0 012.5-2.5c.24 0 .47.03.69.09V9.55a6.01 6.01 0 00-.69-.05 6 6 0 00-6 6 6 6 0 006 6 6 6 0 006-6V8.5a7.46 7.46 0 004 1.16V7.18a5.48 5.48 0 01-3.5-1.68V3z"
      fill="white"/>
  </svg>
);

const WhatsAppLogo = ({ size = 30 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <rect width="24" height="24" rx="6" fill="#25D366"/>
    <path fillRule="evenodd" clipRule="evenodd"
      d="M12 4C7.582 4 4 7.582 4 12c0 1.526.416 2.953 1.141 4.175L4 20l3.946-1.105A7.96 7.96 0 0012 20c4.418 0 8-3.582 8-8s-3.582-8-8-8zm4.098 10.768c-.17.477-.99.91-1.38.968-.353.053-.8.075-1.29-.081a11.82 11.82 0 01-1.168-.431c-2.058-.941-3.4-3.03-3.502-3.17-.1-.14-.819-1.09-.819-2.08 0-.988.518-1.475.702-1.676.184-.2.4-.25.534-.25l.383.007c.123.006.288-.047.45.344.168.4.57 1.388.62 1.49.05.1.083.216.017.347-.067.13-.1.213-.2.328-.1.115-.21.257-.3.346-.1.1-.204.207-.088.406.116.2.515.849 1.107 1.376.761.68 1.403.89 1.602.99.2.1.316.083.433-.05.116-.132.497-.58.63-.778.132-.199.264-.166.445-.1.18.066 1.147.542 1.343.64.197.1.328.149.375.232.049.083.049.481-.12.957z"
      fill="white"/>
  </svg>
);

// ── FIXED TELEGRAM LOGO ──
const TelegramLogo = ({ size = 30 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <circle cx="12" cy="12" r="12" fill="#2AABEE"/>
    {/* Added a slight translation to center the plane inside the circle */}
    <path transform="translate(-1, 0)" d="M5.4 11.8l13.1-5c.6-.2 1.1.1 1 .7l-2.2 10.4c-.1.6-.5.8-1 .5l-2.8-2-1.3 1.3c-.1.1-.3.2-.5.2l.2-2.9 5.3-4.8c.2-.2 0-.3-.3-.1l-6.6 4.1-2.8-.9c-.6-.2-.6-.6.1-.9z" fill="white"/>
  </svg>
);

const FacebookLogo = ({ size = 30 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <rect width="24" height="24" rx="6" fill="#1877F2"/>
    <path d="M16 8h-2c-.55 0-1 .45-1 1v2h3l-.5 3H13v7h-3v-7H8v-3h2V9c0-2.21 1.79-4 4-4h2v3z" fill="white"/>
  </svg>
);

const XLogo = ({ size = 30 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <rect width="24" height="24" rx="6" fill="#111111"/>
    <path d="M17.75 4h-2.5l-3.25 4.5L8.75 4H4l5.5 7.5L4 20h2.5l3.5-5 3.5 5H18l-5.75-8L17.75 4z" fill="white"/>
  </svg>
);

const YouTubeLogo = ({ size = 30 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <rect width="24" height="24" rx="6" fill="#FF0000"/>
    <path d="M19.8 8.2s-.2-1.4-.8-2c-.76-.8-1.6-.8-2-.85C15.2 5.2 12 5.2 12 5.2s-3.2 0-5 .15c-.4.05-1.24.05-2 .85-.6.6-.8 2-.8 2S4 9.8 4 11.4v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.76.8 1.76.77 2.2.85C8.8 19.15 12 19.2 12 19.2s3.2 0 5-.17c.4-.05 1.24-.05 2-.85.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C20 9.8 19.8 8.2 19.8 8.2zM10.2 14.4V9.6l5.4 2.4-5.4 2.4z" fill="white"/>
  </svg>
);

// ── Animated particle canvas background ─────────────────────────────────────
function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    // Particles — small glowing dots drifting upward slowly
    const COUNT = 55;
    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 0.6 + Math.random() * 1.4,
      speed: 0.15 + Math.random() * 0.35,
      drift: (Math.random() - 0.5) * 0.25,
      opacity: 0.1 + Math.random() * 0.35,
      opDir: Math.random() > 0.5 ? 1 : -1,
      opSpeed: 0.003 + Math.random() * 0.006,
      // colour: mostly emerald, few white, few blue
      hue: Math.random() < 0.55 ? 'emerald' : Math.random() < 0.7 ? 'white' : 'blue',
    }));

    // Shooting stars
    const stars = [];
    const spawnStar = () => ({
      x: Math.random() * W,
      y: Math.random() * H * 0.6,
      len: 60 + Math.random() * 80,
      speed: 4 + Math.random() * 5,
      opacity: 0.6 + Math.random() * 0.4,
      life: 0,
      maxLife: 40 + Math.random() * 30,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
    });

    let frameCount = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      frameCount++;

      // Spawn shooting star occasionally
      if (frameCount % 120 === 0 && stars.length < 3) stars.push(spawnStar());

      // Draw particles
      particles.forEach(p => {
        p.y -= p.speed;
        p.x += p.drift;
        p.opacity += p.opDir * p.opSpeed;
        if (p.opacity > 0.45 || p.opacity < 0.08) p.opDir *= -1;
        if (p.y < -4) { p.y = H + 4; p.x = Math.random() * W; }
        if (p.x < -4) p.x = W + 4;
        if (p.x > W + 4) p.x = -4;

        let color;
        if (p.hue === 'emerald') color = `rgba(16,185,129,${p.opacity})`;
        else if (p.hue === 'blue') color = `rgba(59,130,246,${p.opacity * 0.7})`;
        else color = `rgba(255,255,255,${p.opacity * 0.5})`;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });

      // Draw shooting stars
      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        s.life++;
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        const progress = s.life / s.maxLife;
        const alpha = s.opacity * (1 - progress);
        const tailX = s.x - Math.cos(s.angle) * s.len * (1 - progress * 0.5);
        const tailY = s.y - Math.sin(s.angle) * s.len * (1 - progress * 0.5);
        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(1, `rgba(255,255,255,${alpha})`);
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.stroke();
        if (s.life >= s.maxLife) stars.splice(i, 1);
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    />
  );
}

// ── Platform config ──────────────────────────────────────────────────────────
// Re-calculated angles for 7 platforms so they orbit perfectly (360 / 7 = ~51.4 degrees apart)
const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', Logo: InstagramLogo, angle: -90,  color: '#E1306C', tag: '1B+ Users'   },
  { id: 'tiktok',    label: 'TikTok',    Logo: TikTokLogo,    angle: -38,  color: '#69C9D0', tag: 'Viral'       },
  { id: 'whatsapp',  label: 'WhatsApp',  Logo: WhatsAppLogo,  angle: 13,   color: '#25D366', tag: 'Orders Here' },
  { id: 'telegram',  label: 'Telegram',  Logo: TelegramLogo,  angle: 64,   color: '#2AABEE', tag: 'Channels'    },
  { id: 'facebook',  label: 'Facebook',  Logo: FacebookLogo,  angle: 116,  color: '#1877F2', tag: '3B+ Users'   },
  { id: 'x',         label: 'X',         Logo: XLogo,         angle: 167,  color: '#aaaaaa', tag: 'Real-Time'   },
  { id: 'youtube',   label: 'YouTube',   Logo: YouTubeLogo,   angle: 219,  color: '#FF4444', tag: '2B+ Monthly' },
];

// ── Main Component ────────────────────────────────────────────────────────────

export default function NetworkConnectorSection() {
  const [activeIdx, setActiveIdx] = useState(null);

  const CX = 400, CY = 400;
  const ORBIT_R  = 268;
  const NODE_R   = 46;
  const CENTER_R = 74;

  const nodes = PLATFORMS.map((p) => {
    const rad = (p.angle * Math.PI) / 180;
    return { ...p, nx: CX + ORBIT_R * Math.cos(rad), ny: CY + ORBIT_R * Math.sin(rad) };
  });

  return (
    <section className="relative py-24 overflow-hidden bg-[#040911]" style={{ minHeight: '100vh' }}>

      {/* Particle canvas */}
      <ParticleBackground />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_48%,rgba(16,185,129,0.07)_0%,transparent_70%)] pointer-events-none" />
      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle,rgba(255,255,255,0.022) 1px,transparent 1px)',
        backgroundSize: '42px 42px',
      }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-5 py-2 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
            <span className="text-[11px] font-black uppercase tracking-[0.25em]">One Link. Every Platform.</span>
          </div>
          <h2 className="text-5xl lg:text-7xl font-black tracking-tighter text-white mb-5 leading-[0.95]">
            Your store lives<br />
            <span className="text-emerald-400">everywhere.</span>
          </h2>
          <p className="text-slate-400 text-lg font-medium max-w-lg mx-auto leading-relaxed">
            Drop your shop.vi link across every platform. Customers from anywhere — orders straight to your WhatsApp.
          </p>
        </div>

        {/* SVG diagram */}
        <div className="w-full max-w-2xl lg:max-w-3xl mx-auto">
          <svg viewBox="0 0 800 800" className="w-full h-auto" style={{ overflow: 'visible' }}>
            <defs>
              <filter id="nc-cg" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="12" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="nc-ng" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <radialGradient id="nc-of" cx="50%" cy="50%" r="50%">
                <stop offset="68%" stopColor="rgba(16,185,129,0)"/>
                <stop offset="88%" stopColor="rgba(16,185,129,0.05)"/>
                <stop offset="100%" stopColor="rgba(16,185,129,0)"/>
              </radialGradient>
            </defs>

            {/* Orbit fill */}
            <circle cx={CX} cy={CY} r={ORBIT_R + 24} fill="url(#nc-of)" />

            {/* Spinning outer dashed orbit */}
            <circle cx={CX} cy={CY} r={ORBIT_R}
              fill="none" stroke="rgba(16,185,129,0.13)" strokeWidth="1" strokeDasharray="7 7"
              style={{ animation: 'nc-spin 55s linear infinite', transformOrigin: `${CX}px ${CY}px` }}
            />
            {/* Counter-spin inner ring */}
            <circle cx={CX} cy={CY} r={CENTER_R + 30}
              fill="none" stroke="rgba(16,185,129,0.07)" strokeWidth="1" strokeDasharray="3 7"
              style={{ animation: 'nc-spin-r 28s linear infinite', transformOrigin: `${CX}px ${CY}px` }}
            />
            {/* Static mid ring */}
            <circle cx={CX} cy={CY} r={ORBIT_R * 0.52}
              fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="1"
            />

            {/* Connection lines + traveling dots */}
            {nodes.map((node, i) => {
              const active = activeIdx === i;
              const dur = 2.0 + i * 0.32;
              const off = i * 0.52;
              return (
                <g key={`conn-${node.id}`}>
                  {active && (
                    <line x1={node.nx} y1={node.ny} x2={CX} y2={CY}
                      stroke={node.color} strokeWidth="4" strokeOpacity="0.12" />
                  )}
                  <line x1={node.nx} y1={node.ny} x2={CX} y2={CY}
                    stroke={active ? node.color : 'rgba(255,255,255,0.07)'}
                    strokeWidth={active ? 1.5 : 1}
                    strokeDasharray="5 6"
                    style={{ transition: 'stroke 0.35s, stroke-width 0.3s' }}
                  />
                  {/* Dot A */}
                  <circle r="3.2" fill={node.color} opacity="0"
                    style={{ filter: `drop-shadow(0 0 5px ${node.color})` }}>
                    <animateTransform attributeName="transform" type="translate"
                      values={`${node.nx} ${node.ny};${CX} ${CY}`}
                      dur={`${dur}s`} begin={`${off}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0;1;1;0"
                      keyTimes="0;0.07;0.88;1"
                      dur={`${dur}s`} begin={`${off}s`} repeatCount="indefinite" />
                  </circle>
                  {/* Dot B */}
                  <circle r="2.2" fill={node.color} opacity="0"
                    style={{ filter: `drop-shadow(0 0 3px ${node.color})` }}>
                    <animateTransform attributeName="transform" type="translate"
                      values={`${node.nx} ${node.ny};${CX} ${CY}`}
                      dur={`${dur}s`} begin={`${off + 1.0}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0;0.75;0.75;0"
                      keyTimes="0;0.1;0.86;1"
                      dur={`${dur}s`} begin={`${off + 1.0}s`} repeatCount="indefinite" />
                  </circle>
                  {/* Dot C trail */}
                  <circle r="1.5" fill={node.color} opacity="0">
                    <animateTransform attributeName="transform" type="translate"
                      values={`${node.nx} ${node.ny};${CX} ${CY}`}
                      dur={`${dur}s`} begin={`${off + 1.6}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0;0.4;0.4;0"
                      keyTimes="0;0.12;0.84;1"
                      dur={`${dur}s`} begin={`${off + 1.6}s`} repeatCount="indefinite" />
                  </circle>
                </g>
              );
            })}

            {/* Platform nodes */}
            {nodes.map((node, i) => {
              const active = activeIdx === i;
              return (
                <g key={`node-${node.id}`}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setActiveIdx(i)}
                  onMouseLeave={() => setActiveIdx(null)}
                >
                  {active && (
                    <circle cx={node.nx} cy={node.ny} r={NODE_R + 10}
                      fill="none" stroke={node.color} strokeWidth="1" opacity="0"
                      style={{ animation: 'nc-pn 1.1s ease-out infinite' }}
                    />
                  )}
                  <circle cx={node.nx} cy={node.ny} r={NODE_R + 10}
                    fill="none" stroke={node.color} strokeWidth="1"
                    opacity={active ? 0.28 : 0}
                    style={{ transition: 'opacity 0.3s' }}
                  />
                  <circle cx={node.nx} cy={node.ny} r={NODE_R}
                    fill={active ? 'rgba(255,255,255,0.09)' : 'rgba(8,16,32,0.92)'}
                    stroke={active ? node.color : 'rgba(255,255,255,0.11)'}
                    strokeWidth={active ? 1.5 : 1}
                    filter={active ? 'url(#nc-ng)' : 'none'}
                    style={{ transition: 'all 0.3s' }}
                  />
                  <foreignObject
                    x={node.nx - 15} y={node.ny - 15}
                    width="30" height="30"
                    style={{ pointerEvents: 'none', overflow: 'visible' }}
                  >
                    <div xmlns="http://www.w3.org/1999/xhtml"
                      style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <node.Logo size={26} />
                    </div>
                  </foreignObject>
                  <text x={node.nx} y={node.ny + NODE_R + 19}
                    textAnchor="middle" fontSize="11" fontWeight="800"
                    fontFamily="system-ui,-apple-system,sans-serif"
                    letterSpacing="0.09em"
                    fill={active ? node.color : 'rgba(255,255,255,0.32)'}
                    style={{ transition: 'fill 0.3s', textTransform: 'uppercase' }}
                  >
                    {node.label}
                  </text>
                  {active && (
                    <>
                      <rect x={node.nx - 36} y={node.ny + NODE_R + 28}
                        width="72" height="16" rx="8"
                        fill={node.color} opacity="0.18" />
                      <text x={node.nx} y={node.ny + NODE_R + 40}
                        textAnchor="middle" fontSize="9" fontWeight="700"
                        fontFamily="system-ui,sans-serif" letterSpacing="0.04em"
                        fill={node.color}>
                        {node.tag}
                      </text>
                    </>
                  )}
                </g>
              );
            })}

            {/* Center pulse rings */}
            <circle cx={CX} cy={CY} r={CENTER_R + 10} fill="none"
              stroke="rgba(16,185,129,0.22)" strokeWidth="1"
              style={{ animation: 'nc-pc 3.2s ease-out infinite', transformOrigin: `${CX}px ${CY}px` }} />
            <circle cx={CX} cy={CY} r={CENTER_R + 10} fill="none"
              stroke="rgba(16,185,129,0.14)" strokeWidth="1"
              style={{ animation: 'nc-pc 3.2s ease-out 1.6s infinite', transformOrigin: `${CX}px ${CY}px` }} />

            {/* Center hub */}
            <circle cx={CX} cy={CY} r={CENTER_R + 6}
              fill="rgba(16,185,129,0.05)"
              stroke="rgba(16,185,129,0.28)"
              strokeWidth="1.2"
              filter="url(#nc-cg)"
            />
            <circle cx={CX} cy={CY} r={CENTER_R}
              fill="#05111f"
              stroke="rgba(16,185,129,0.6)"
              strokeWidth="1.5"
            />
            <circle cx={CX} cy={CY} r={CENTER_R - 5} fill="#071622" />

            {/* Logo only — no text below */}
            <foreignObject x={CX - 30} y={CY - 30} width="60" height="60"
              style={{ overflow: 'visible' }}>
              <div xmlns="http://www.w3.org/1999/xhtml"
                style={{ width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={shopLink_logo} alt="ShopLink.vi"
                  style={{ width: 44, height: 44, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
              </div>
            </foreignObject>

            <style>{`
              @keyframes nc-spin   { to { transform: rotate(360deg);  } }
              @keyframes nc-spin-r { to { transform: rotate(-360deg); } }
              @keyframes nc-pc {
                0%   { r: 84;  opacity: 0.7; }
                100% { r: 136; opacity: 0;   }
              }
              @keyframes nc-pn {
                0%   { r: 56; opacity: 0.55; }
                100% { r: 74; opacity: 0;    }
              }
            `}</style>
          </svg>
        </div>

        {/* Platform pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-2 mb-14">
          {PLATFORMS.map((p, i) => (
            <div key={p.id}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border cursor-default transition-all duration-300 hover:scale-105"
              style={{ background: `${p.color}12`, borderColor: `${p.color}28` }}
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}
            >
              <p.Logo size={16} />
              <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: p.color }}>
                {p.label}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-slate-400 text-base font-medium leading-relaxed mb-8">
            Put your <span className="text-white font-black">shop.vi/yourname</span> link in every bio, caption, and status.
            One link. Every order lands directly in your WhatsApp — formatted and ready to fulfill.
          </p>
          <Link to="/register"
            className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-emerald-900/40 transition-all hover:-translate-y-1 active:scale-95">
            Claim Your Free Link <ArrowRight size={18} strokeWidth={3} />
          </Link>
          <p className="text-slate-600 text-xs font-bold uppercase tracking-widest mt-5">
            Free forever · No credit card · Setup in 60 seconds
          </p>
        </div>
      </div>
    </section>
  );
}