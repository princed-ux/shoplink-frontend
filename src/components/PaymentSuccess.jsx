import { useEffect } from 'react';
import { Crown, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PaymentSuccess({ plan, onClose }) {
  useEffect(() => {
    const colors = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444', '#f97316', '#22d3ee', '#a3e635'];

    // Cannon burst from bottom-left
    confetti({
      particleCount: 120,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 1 },
      colors,
      startVelocity: 65,
      gravity: 0.8,
      scalar: 1.1,
      zIndex: 9999999,
    });

    // Cannon burst from bottom-right
    confetti({
      particleCount: 120,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 1 },
      colors,
      startVelocity: 65,
      gravity: 0.8,
      scalar: 1.1,
      zIndex: 9999999,
    });

    // Center burst with delay
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { x: 0.5, y: 0.9 },
        colors,
        startVelocity: 50,
        gravity: 0.7,
        scalar: 0.9,
        zIndex: 9999999,
      });
    }, 300);
  }, []);

  const isPremium = plan?.id === 'premium';
  const Icon      = isPremium ? Crown : Zap;
  const color     = isPremium ? '#f59e0b' : '#3b82f6';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-md shadow-2xl p-10 text-center animate-in zoom-in-95 duration-300">

        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
          style={{ backgroundColor: color + '20', border: `2px solid ${color}40` }}
        >
          <Icon size={36} fill={color} style={{ color }} />
        </div>

        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
          You're now on {plan?.name}! 🎉
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
          Your subscription is active. All your {plan?.name} features are now unlocked.
        </p>

        {plan?.features && (
          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 mb-8 text-left space-y-2.5">
            {plan.features.slice(1, 5).map((feat, i) => (
              <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" strokeWidth={2.5} />
                {feat}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => { onClose?.(); window.location.href = '/dashboard'; }}
          className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl"
          style={{ backgroundColor: color }}
        >
          Start Using {plan?.name} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
