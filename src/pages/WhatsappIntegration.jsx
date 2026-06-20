import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  MessageCircle, ShoppingBag, Zap, ArrowRight, 
  CheckCircle2, Store, LayoutList, CheckCheck,
  MousePointer2, Sparkles
} from 'lucide-react';
import Footer from '../components/Footer';

export default function WhatsappIntegration() {
  // State to handle the live chat demonstration animation
  const [chatStep, setChatStep] = useState(0);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Loop the chat demonstration
  useEffect(() => {
    const timer = setInterval(() => {
      setChatStep((prev) => (prev >= 2 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans transition-colors duration-300 pt-24 pb-20 overflow-hidden">
      <Helmet>
        <title>WhatsApp Integration — ShopLink.vi</title>
        <meta name="description" content="See how ShopLink formats customer orders and sends them directly to your WhatsApp." />
      </Helmet>

      {/* --- HERO SECTION --- */}
      <section className="px-6 py-16 lg:py-24 max-w-7xl mx-auto text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 animate-in slide-in-from-bottom-8 fade-in duration-1000">
          <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-full px-5 py-2 mb-8 shadow-sm">
            <MessageCircle size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Seamless Checkout Flow</span>
          </div>
          
          <h1 className="text-4xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter mb-6 max-w-4xl mx-auto leading-[1.05]">
            No more confusing DMs.<br />
            <span className="text-emerald-500 italic">Perfectly formatted orders.</span>
          </h1>
          
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed mb-10">
            We bridge the gap between your web storefront and your WhatsApp inbox. 
            When a customer checks out, ShopLink auto-generates a clean receipt and opens their WhatsApp to send it directly to you.
          </p>
        </div>
      </section>

      {/* --- THE ANIMATED DEMONSTRATION SECTION --- */}
      <section className="px-6 py-12 max-w-6xl mx-auto relative z-10">
        <div className="bg-white dark:bg-slate-900/50 rounded-[3rem] p-8 lg:p-16 border border-slate-200 dark:border-slate-800/60 shadow-2xl relative overflow-hidden">
          
          <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
            
            {/* Left: The "Customer Cart" view */}
            <div className="space-y-8 animate-in slide-in-from-left-8 fade-in duration-1000 delay-300">
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">1. The Customer Checks Out</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  Your customer browses your ShopLink store, adds items to their cart, and taps the checkout button.
                </p>
              </div>

              {/* Fake UI Cart */}
              <div className="bg-slate-50 dark:bg-slate-950 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 relative">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-900 dark:text-white">Your Cart</span>
                  <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 px-2 py-1 rounded text-xs font-bold">2 items</span>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700">👟</div>
                      <span className="font-bold dark:text-slate-300">Sneakers (Size 42)</span>
                    </div>
                    <span className="font-black dark:text-white">₦25,000</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700">👕</div>
                      <span className="font-bold dark:text-slate-300">Vintage Tee (L)</span>
                    </div>
                    <span className="font-black dark:text-white">₦8,000</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mb-6">
                  <div className="flex justify-between items-center font-black text-lg">
                    <span className="dark:text-white">Total</span>
                    <span className="text-emerald-500">₦33,000</span>
                  </div>
                </div>

                {/* Animated Checkout Button */}
                <div className="relative">
                  <button className="w-full bg-[#25D366] hover:bg-[#1EBE5C] text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-[0_10px_20px_-10px_rgba(37,211,102,0.5)] z-10 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <MessageCircle size={16} className="relative z-10" /> 
                    <span className="relative z-10">Order via WhatsApp</span>
                  </button>
                  {/* Fake Cursor Animation */}
                  <MousePointer2 
                    size={24} 
                    className={`absolute right-4 bottom-0 text-slate-900 dark:text-white fill-white dark:fill-slate-900 transition-all duration-700 z-20 ${chatStep > 0 ? 'scale-90 opacity-0' : 'animate-bounce'}`}
                  />
                </div>
              </div>
            </div>

            {/* Middle Arrow (Hidden on mobile) */}
            <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-emerald-500 rounded-full items-center justify-center shadow-lg shadow-emerald-500/30 z-20 animate-pulse">
              <ArrowRight className="text-white" size={20} />
            </div>

            {/* Right: The "Vendor WhatsApp" view */}
            <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-1000 delay-500">
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">2. You Receive the Order</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  WhatsApp opens with a pre-filled message matching your exact storefront data.
                </p>
              </div>

              {/* Fake WhatsApp Interface */}
              <div className="bg-[#EFE7DD] dark:bg-[#0b141a] rounded-3xl overflow-hidden shadow-inner relative border border-slate-300 dark:border-slate-800 h-[480px] flex flex-col">
                
                {/* WA Header */}
                <div className="bg-[#075e54] dark:bg-[#202c33] text-white p-4 flex items-center gap-3 z-10 shadow-md">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">KS</div>
                  <div>
                    <p className="font-bold text-sm">Kiki's Store</p>
                    <p className="text-[10px] text-white/70">business account</p>
                  </div>
                </div>

                {/* Chat Area */}
                <div className="p-4 flex-1 overflow-hidden relative flex flex-col justify-end pb-6 space-y-4">
                  <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')" }} />
                  
                  {/* Incoming Order Bubble (Appears on Step 1 & 2) */}
                  <div className={`transition-all duration-500 transform ${chatStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} w-full max-w-[90%]`}>
                    <div className="bg-white dark:bg-[#202c33] p-4 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-mono text-[11px] relative">
                      
                      <p className="font-black mb-3 text-emerald-700 dark:text-emerald-400 text-xs">*NEW ORDER RECEIVED*</p>
                      
                      <p><span className="font-bold">*Store:*</span> KIKI'S STORE</p>
                      <p><span className="font-bold">*Order ID:*</span> ORD-73921</p>
                      <p className="mb-3"><span className="font-bold">*Date:*</span> 09/04/2026</p>

                      <p className="font-bold">*ORDER ITEMS:*</p>
                      <p className="text-slate-400 dark:text-slate-600 mb-1">━━━━━━━━━━━━━━━━━</p>
                      
                      <p className="font-bold text-slate-900 dark:text-white">{'> *1x Sneakers (42)*'}</p>
                      <p className="mb-2">{'> ₦25,000'}</p>
                      
                      <p className="font-bold text-slate-900 dark:text-white">{'> *1x Vintage Tee (L)*'}</p>
                      <p className="mb-3">{'> ₦8,000'}</p>

                      <p className="text-slate-400 dark:text-slate-600 mb-1">━━━━━━━━━━━━━━━━━</p>
                      <p className="font-black text-emerald-600 dark:text-emerald-400 mb-4">*TOTAL DUE: ₦33,000*</p>
                      
                      <p className="italic text-slate-500 dark:text-slate-400 leading-tight">_Hello! I would like to place this order. Please let me know how to proceed with payment._</p>

                      <div className="flex justify-end items-center gap-1 mt-2">
                        <span className="text-[9px] text-slate-400">14:05</span>
                        <CheckCheck size={14} className="text-[#53bdeb]" />
                      </div>
                    </div>
                  </div>

                  {/* Vendor Reply Bubble (Appears on Step 2) */}
                  <div className={`transition-all duration-500 transform ${chatStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ml-auto max-w-[85%]`}>
                    <div className="bg-[#DCF8C6] dark:bg-[#005c4b] p-3 rounded-2xl rounded-tr-none shadow-sm text-xs text-slate-800 dark:text-white">
                      <p>Order received! Transfer ₦33,000 to: 0123456789 GTBank. Will ship out today! 🚚</p>
                      <div className="flex justify-end items-center gap-1 mt-1">
                        <span className="text-[9px] text-slate-500 dark:text-emerald-200/60">14:06</span>
                        <CheckCheck size={12} className="text-[#53bdeb] dark:text-[#53bdeb]" />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID (With Hover Animations) --- */}
      <section className="px-6 py-20 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Why this beats standard DMs</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              icon: LayoutList, 
              title: 'Eliminate Back-and-Forth', 
              desc: 'No more asking "What size did you want?" or "Send your address again." Everything you need to fulfill the order is captured upfront.'
            },
            { 
              icon: Zap, 
              title: 'Zero Cart Abandonment', 
              desc: 'Because the final step happens on WhatsApp (an app they already trust and use), customers are much more likely to complete their purchase.'
            },
            { 
              icon: Store, 
              title: 'Look Ultra-Professional', 
              desc: 'A structured, automated receipt shows your customers that you run a serious business, building instant trust and brand loyalty.'
            }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white shadow-sm">
                <feature.icon size={26} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="px-6 py-10 relative z-10">
        <div className="max-w-4xl mx-auto bg-slate-900 dark:bg-emerald-900/20 border border-slate-800 dark:border-emerald-500/20 rounded-[3rem] p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-4 tracking-tight">Ready to automate your DMs?</h2>
            <p className="text-slate-400 dark:text-emerald-100/70 mb-8 max-w-lg mx-auto font-medium">
              Set up your ShopLink store in 60 seconds and start receiving perfectly formatted WhatsApp orders today. It's free forever.
            </p>
            <Link to="/register" className="inline-flex items-center gap-3 bg-emerald-500 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-emerald-400 hover:-translate-y-1 transition-all shadow-lg shadow-emerald-500/30">
              <Sparkles size={18} className="fill-white" /> Create Free Store
            </Link>
          </div>
        </div>
      </section>
      <Footer className="pt-[100px]" />
    </div>
  );
}