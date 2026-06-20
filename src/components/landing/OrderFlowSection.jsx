import { useState, useEffect } from 'react';
import { ShoppingBag, Share2, MessageCircle, CheckCheck, ArrowRight,
  Smartphone, MapPin, Phone, Flag, Link as LinkIcon } from 'lucide-react';
  
const STEPS = [
  {
    id: 1,
    icon: Share2,
    color: '#8b5cf6', // Purple
    bg: 'bg-purple-50 dark:bg-purple-500/10',
    border: 'border-purple-100 dark:border-purple-500/20',
    iconBg: 'bg-purple-500 dark:bg-purple-600',
    label: 'You share your link',
    desc: 'Post shop.vi/yourstore in your Instagram bio, TikTok, WhatsApp status — anywhere.',
  },
  {
    id: 2,
    icon: ShoppingBag,
    color: '#10b981', // Emerald
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    border: 'border-emerald-100 dark:border-emerald-500/20',
    iconBg: 'bg-emerald-500 dark:bg-emerald-600',
    label: 'Customer browses & orders',
    desc: 'They open your store, browse your products, add items to cart and tap "Order on WhatsApp".',
  },
  {
    id: 3,
    icon: MessageCircle,
    color: '#25D366', // WhatsApp Green
    bg: 'bg-green-50 dark:bg-green-500/10',
    border: 'border-green-100 dark:border-green-500/20',
    iconBg: 'bg-[#25D366] dark:bg-[#20b558]',
    label: 'WhatsApp opens automatically',
    desc: 'A pre-filled message with the full order details launches directly in WhatsApp.',
  },
  {
    id: 4,
    icon: CheckCheck,
    color: '#3b82f6', // Blue
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    border: 'border-blue-100 dark:border-blue-500/20',
    iconBg: 'bg-blue-500 dark:bg-blue-600',
    label: 'You receive & fulfill',
    desc: 'The order lands in your WhatsApp with name, items, total and address — ready to action.',
  },
];

export default function OrderFlowSection() {
  const [activeStep, setActiveStep] = useState(0);

  // Auto-cycle through steps
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep(s => (s + 1) % STEPS.length);
    }, 3500); // Slightly increased to 3.5s so users can read the dark mode UI better
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 px-6 bg-white dark:bg-slate-950 overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-slate-900 dark:bg-emerald-500/10 text-white dark:text-emerald-400 px-4 py-1.5 rounded-full mb-5 dark:border dark:border-emerald-500/20">
            <Smartphone size={14} className="text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">How It Works</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-black tracking-tighter text-slate-900 dark:text-white mb-4 leading-[1.0]">
            From link share to<br />
            <span className="text-emerald-600 dark:text-emerald-500">WhatsApp order.</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-lg mx-auto">
            The entire flow takes less than 60 seconds for your customers.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT: Step list */}
          <div className="space-y-4">
            {STEPS.map((s, i) => {
              const isActive = activeStep === i;
              const isDone = i < activeStep;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveStep(i)}
                  className={`w-full text-left p-5 rounded-[1.75rem] border-2 transition-all duration-400 group ${
                    isActive
                      ? `${s.bg} ${s.border} shadow-lg dark:shadow-none`
                      : 'bg-white dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Step number / icon */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isActive ? `${s.iconBg} shadow-lg shadow-${s.color}/30` : isDone ? 'bg-slate-900 dark:bg-emerald-500' : 'bg-slate-100 dark:bg-slate-800'
                    }`}>
                      {isDone && !isActive
                        ? <CheckCheck size={20} className="text-white" />
                        : <s.icon size={20} className={isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'} />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                          isActive ? 'text-slate-400 dark:text-slate-300' : 'text-slate-300 dark:text-slate-600'
                        }`}>Step {s.id}</span>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ backgroundColor: s.color }} />
                        )}
                      </div>
                      <p className={`font-black text-base leading-tight mb-1 ${
                        isActive ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'
                      }`}>{s.label}</p>
                      {isActive && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-2 animate-in fade-in duration-300">
                          {s.desc}
                        </p>
                      )}
                    </div>
                    <ArrowRight size={16} className={`flex-shrink-0 mt-1 transition-all ${
                      isActive ? 'text-slate-400 dark:text-slate-500 translate-x-1' : 'text-slate-200 dark:text-slate-700'
                    }`} />
                  </div>

                  {/* Progress bar */}
                  {isActive && (
                    <div className="mt-4 h-1 bg-white/60 dark:bg-slate-950/50 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          background: s.color,
                          animation: 'flow-progress 3.5s linear forwards',
                        }}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* RIGHT: Animated visual */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm">

              {/* Phone frame */}
              <div className="relative bg-slate-900 dark:bg-slate-800 border-slate-900 dark:border-slate-800 border-[12px] rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] dark:shadow-[0_0_80px_-20px_rgba(16,185,129,0.15)] transition-all duration-300">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-2xl z-20" />
                
                <div className="bg-slate-100 dark:bg-slate-950 rounded-[2rem] overflow-hidden h-[500px] relative transition-colors duration-300">

                  {/* Step 1 — Share link */}
                  {activeStep === 0 && (
                    <div className="h-full animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col bg-slate-50 dark:bg-slate-950">
                      <div className="bg-gradient-to-br from-purple-600 to-purple-800 dark:from-purple-900/80 dark:to-purple-900/30 p-6 pt-10 transition-colors">
                        <p className="text-purple-200 text-[10px] font-black uppercase tracking-widest mb-1">Instagram Bio</p>
                        <p className="text-white font-black text-xl tracking-tight">@kikisstore</p>
<p className="text-purple-200 text-sm mt-2 font-medium flex items-center gap-1.5">
  <Flag size={11} className="text-purple-200" /> Fashion vendor · Lagos
</p>
                        <div className="mt-4 bg-white/15 dark:bg-black/20 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20 flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <ShoppingBag size={14} className="text-white" />
                          </div>
                          <div>
                            <p className="text-white font-black text-xs flex items-center gap-1.5">
  <LinkIcon size={10} /> shop.vi/kikisstore
</p>
                            <p className="text-purple-200 dark:text-purple-300 text-[10px]">Tap to browse my store</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-5 space-y-3 flex-1">
                        {['Latest Ankara Sets', 'Handbags & Purses', 'Footwear Collection'].map((item, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex-shrink-0" />
                            <div className="flex-1">
                              <p className="font-black text-slate-800 dark:text-slate-200 text-xs">{item}</p>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500">View collection →</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2 — Customer browses */}
                  {activeStep === 1 && (
                    <div className="h-full animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col bg-white dark:bg-slate-950">
                      <div className="bg-white dark:bg-slate-900 p-5 pt-10 border-b border-slate-100 dark:border-slate-800 transition-colors">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Kiki's Store</p>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">Red Velvet Ankara Set</h3>
                        <p className="text-emerald-600 dark:text-emerald-400 font-black text-xl mt-1">₦10,000</p>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-800/50 h-36 flex items-center justify-center transition-colors">
                        <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700/50 rounded-2xl flex items-center justify-center">
                          <ShoppingBag size={28} className="text-slate-400 dark:text-slate-500" />
                        </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div className="space-y-2 mb-5">
                          {['Size: M', 'Colour: Red', 'Qty: 2'].map((attr, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-slate-500 dark:text-slate-400 font-medium">{attr.split(':')[0]}</span>
                              <span className="font-black text-slate-800 dark:text-slate-200">{attr.split(':')[1]}</span>
                            </div>
                          ))}
                        </div>
                        <div className="bg-emerald-600 dark:bg-emerald-500 text-white rounded-2xl px-5 py-4 flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 dark:shadow-none transition-colors">
                          <MessageCircle size={18} />
                          <span className="font-black text-sm uppercase tracking-widest">Order on WhatsApp</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3 — WhatsApp opens */}
                  {activeStep === 2 && (
                    <div className="h-full animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col bg-[#ECE5DD] dark:bg-[#0b141a]">
                      <div className="bg-[#075E54] dark:bg-[#1f2c34] p-4 pt-10 flex items-center gap-3 shadow-md z-10 transition-colors">
                        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-xs border border-white/30">KS</div>
                        <div>
                          <p className="text-white font-black text-sm leading-tight">Kiki's Store</p>
                          <p className="text-[10px] text-green-100/80">Business Account</p>
                        </div>
                      </div>
                      <div className="flex-1 p-4 relative overflow-hidden flex flex-col justify-end pb-16">
                         {/* WhatsApp Background Pattern */}
                        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.02] pointer-events-none bg-repeat invert-0 dark:invert"
                          style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')" }} />
                        
                        <div className="bg-white dark:bg-[#202c33] rounded-xl rounded-tl-none p-4 shadow-sm max-w-[85%] border-l-4 border-emerald-500 dark:border-emerald-400 relative z-10">
                          <p className="font-black text-emerald-800 dark:text-emerald-400 text-xs mb-2 flex items-center gap-1">
                            <ShoppingBag size={11} /> NEW ORDER #2401
                          </p>
                          <div className="font-mono text-xs text-slate-700 dark:text-slate-300 space-y-1">
                            <p className="flex justify-between"><span>2x Red Velvet</span><span>10,000</span></p>
                            <p className="flex justify-between"><span>1x Handbag</span><span>5,000</span></p>
                            <hr className="border-dashed border-slate-200 dark:border-slate-700 my-1.5" />
                            <p className="font-black text-slate-900 dark:text-white flex justify-between">
                              <span>TOTAL</span><span className="text-emerald-600 dark:text-emerald-400">₦15,000</span>
                            </p>
                          </div>
                          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/50 text-[10px] text-slate-500 dark:text-slate-400 space-y-0.5">
                            <p className="flex items-center gap-1"><MapPin size={8} /> 12 Admiralty Way, Lekki</p>
                            <p className="flex items-center gap-1"><Phone size={8} /> 08012345678</p>
                          </div>
                        </div>
                      </div>
                      {/* Input bar */}
                      <div className="absolute bottom-0 w-full bg-[#F0F0F0] dark:bg-[#1f2c34] p-2 pb-5 flex items-center gap-2 px-3 transition-colors">
                        <div className="bg-white dark:bg-[#2a3942] flex-1 rounded-full h-9 px-4 flex items-center text-slate-400 dark:text-slate-500 text-[10px] shadow-sm">Type a message...</div>
                        <div className="w-9 h-9 bg-[#075E54] dark:bg-[#00a884] rounded-full flex items-center justify-center text-white shadow-md">
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4 — Done */}
                  {activeStep === 3 && (
                    <div className="h-full animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 transition-colors">
                      <div className="w-16 h-16 bg-emerald-500 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-200 dark:shadow-none dark:border-2 dark:border-emerald-500 flex-shrink-0">
                        <CheckCheck size={28} className="text-white dark:text-emerald-400" strokeWidth={2.5} />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 text-center">Order Received!</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs text-center font-medium mb-6 leading-relaxed px-2">
                        The order is in your WhatsApp, formatted and ready. Just confirm and fulfil.
                      </p>
                      <div className="w-full space-y-2">
                        {[
                          { label: 'Customer', val: 'Adunola James' },
                          { label: 'Total',    val: '₦15,000' },
                          { label: 'Items',    val: '3 products' },
                          { label: 'Via',      val: 'shop.vi/kikisstore' },
                        ].map((row, i) => (
                          <div key={i} className="flex justify-between items-center text-xs p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-transparent dark:border-slate-700/50">
                            <span className="text-slate-400 dark:text-slate-500 font-bold">{row.label}</span>
                            <span className="font-black text-slate-800 dark:text-slate-200">{row.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes flow-progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </section>
  );
}