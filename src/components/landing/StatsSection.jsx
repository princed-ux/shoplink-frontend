import { useEffect, useRef, useState } from 'react';
import { TrendingUp, Store, MapPin, Zap, Activity } from 'lucide-react';

// --- CUSTOM WHATSAPP ICON ---
function WhatsAppIcon({ size = 24, color = "currentColor", className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

// --- ADVANCED LIVE COUNTER HOOK ---
function useLiveCounter(baseValue, duration = 2000, startWhen = false, liveTickMs = 0) {
  const [count, setCount] = useState(0);

  // Phase 1: Smooth 60fps initial count up
  useEffect(() => {
    if (!startWhen) return;
    let startTime;
    let animationFrame;

    const updateCounter = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function for smoother finish
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
      
      if (percentage < 1) {
        setCount(Math.floor(baseValue * easeOutQuart));
        animationFrame = requestAnimationFrame(updateCounter);
      } else {
        setCount(baseValue);
      }
    };
    
    animationFrame = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(animationFrame);
  }, [baseValue, duration, startWhen]);

  // Phase 2: Slow, randomized continuous ticking for "Live" effect
  useEffect(() => {
    if (!startWhen || count < baseValue || !liveTickMs) return;

    const timer = setInterval(() => {
      // 60% chance to increment on tick so it feels organic, not robotic
      if (Math.random() > 0.4) {
        setCount(c => c + 1);
      }
    }, liveTickMs);

    return () => clearInterval(timer);
  }, [startWhen, count, baseValue, liveTickMs]);

  return count;
}

// --- STAT CARD COMPONENT ---
function StatCard({ icon: Icon, color, bgColor, value, suffix, label, sublabel, delay, started, liveTickMs, isWhatsApp }) {
  const count = useLiveCounter(value, 2000 + delay, started, liveTickMs);
  
  return (
    <div
      className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl dark:hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)] hover:border-emerald-100 dark:hover:border-emerald-500/30 transition-all duration-500 hover:-translate-y-2 group overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Background radial glow (visible on hover) */}
      <div
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 dark:opacity-0 dark:group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"
        style={{ background: bgColor }}
      />
      
      {/* Icon */}
      <div className="flex justify-between items-start mb-6">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md relative z-10 transition-transform duration-500 group-hover:scale-110"
          style={{ background: `linear-gradient(135deg, ${color}15, ${color}30)`, border: `1px solid ${color}40` }}
        >
          {isWhatsApp ? <WhatsAppIcon size={26} color={color} /> : <Icon size={24} style={{ color }} />}
        </div>
        
        {/* Live indicator (Only shows if the stat is actively ticking) */}
        {liveTickMs > 0 && started && count >= value && (
          <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 px-2.5 py-1 rounded-full animate-in fade-in duration-1000">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Live</span>
          </div>
        )}
      </div>

      {/* Data */}
      <div className="relative z-10">
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums transition-colors">
            {count.toLocaleString()}
          </span>
          <span className="text-3xl font-black transition-colors" style={{ color }}>{suffix}</span>
        </div>
        <p className="font-black text-slate-900 dark:text-slate-200 text-lg mb-1 transition-colors">{label}</p>
        <p className="text-slate-400 dark:text-slate-500 text-sm font-medium transition-colors">{sublabel}</p>
      </div>

      {/* Progress/Trend bar */}
      <div className="mt-6 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative z-10 transition-colors">
        <div
          className="h-full rounded-full transition-all duration-[2.5s] ease-out"
          style={{
            width: started ? '100%' : '0%',
            background: `linear-gradient(90deg, ${color}40, ${color})`,
          }}
        />
      </div>
    </div>
  );
}

// --- DATA CONFIG ---
// Note: liveTickMs sets how fast the number grows AFTER the initial load.
// 0 means it stays static (like States Reached).
const STATS = [
  {
    icon: Store,
    color: '#10b981', // Emerald
    bgColor: '#10b981',
    value: 1247,
    suffix: '+',
    label: 'Stores Created',
    sublabel: 'Vendors live across Nigeria',
    delay: 0,
    liveTickMs: 6500, // Ticks roughly every 6.5s
  },
  {
    icon: null, // We'll use custom WhatsApp flag
    isWhatsApp: true,
    color: '#25D366', // WhatsApp Green
    bgColor: '#25D366',
    value: 28400,
    suffix: '+',
    label: 'Orders Processed',
    sublabel: 'Formatted receipts delivered',
    delay: 150,
    liveTickMs: 2500, // Ticks roughly every 2.5s
  },
  {
    icon: MapPin,
    color: '#3b82f6', // Blue
    bgColor: '#3b82f6',
    value: 36,
    suffix: '',
    label: 'States Reached',
    sublabel: 'From Lagos to Maiduguri',
    delay: 300,
    liveTickMs: 0, // Doesn't increase (capped at 36 states)
  },
  {
    icon: TrendingUp,
    color: '#f59e0b', // Amber
    bgColor: '#f59e0b',
    value: 3,
    suffix: 'x',
    label: 'Average Order Boost',
    sublabel: 'Vendors report after 1 week',
    delay: 450,
    liveTickMs: 0, // Doesn't increase
  },
];

export default function StatsSection() {
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-24 px-6 bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-300">
      
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.05)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.1)_0%,transparent_70%)] transition-colors" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-5 py-2 rounded-full mb-6 transition-colors">
            <Activity size={14} className="text-emerald-500 animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Live Platform Stats</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-black tracking-tighter text-slate-900 dark:text-white mb-4 leading-[1.0] transition-colors">
            ShopLink by<br />
            <span className="text-emerald-600 dark:text-emerald-500">the numbers.</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-lg mx-auto transition-colors">
            Real vendors. Real orders. Real growth — happening every day across Nigeria.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {STATS.map((s, i) => (
            <StatCard key={i} {...s} started={started} />
          ))}
        </div>

        {/* Bottom highlight banner */}
        <div className="relative bg-slate-900 dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-[3rem] p-10 lg:p-14 overflow-hidden text-center shadow-2xl transition-colors">
          {/* Internal banner glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(16,185,129,0.12)_0%,transparent_70%)] pointer-events-none" />
          <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <p className="text-slate-400 font-black text-[11px] uppercase tracking-[0.25em] mb-4">And growing fast</p>
            <h3 className="text-3xl lg:text-5xl font-black text-white tracking-tighter mb-4">
              A new store is created every <span className="text-emerald-400 relative inline-block">
                4 minutes.
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-emerald-400/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" fill="transparent" stroke="currentColor" strokeWidth="4"/>
                </svg>
              </span>
            </h3>
            <p className="text-slate-400 font-medium text-lg max-w-xl mx-auto">
              Nigerian vendors are discovering ShopLink daily. Join them before your market gets saturated.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}