import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Zap, Store, Smartphone, BarChart3, 
  Globe, ArrowRight, Sparkles, Layers, 
  Palette, BellRing, Share2, MessageCircle
} from 'lucide-react';
import Footer from '../components/Footer';

export default function Features() {
  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans transition-colors duration-300 pt-24 pb-20 overflow-hidden">
      <Helmet>
        <title>Features — ShopLink.vi</title>
        <meta name="description" content="Explore the powerful tools built to help you run your WhatsApp business effortlessly." />
      </Helmet>

      {/* --- HERO SECTION --- */}
      <section className="px-6 py-16 lg:py-24 max-w-7xl mx-auto text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 animate-in slide-in-from-bottom-8 fade-in duration-1000">
          <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-full px-5 py-2 mb-8 shadow-sm">
            <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Everything you need, nothing you don't</span>
          </div>
          
          <h1 className="text-4xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter mb-6 max-w-4xl mx-auto leading-[1.05]">
            Powerful features.<br />
            <span className="text-emerald-500 italic relative inline-block">
              Zero complexity.
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-emerald-200 dark:text-emerald-900/60" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" fill="transparent" stroke="currentColor" strokeWidth="4"/>
              </svg>
            </span>
          </h1>
          
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed mb-10">
            We stripped away the confusing dashboard settings and focused purely on what makes you money: a beautiful customized store, unlimited products, and seamless WhatsApp checkout.
          </p>
        </div>
      </section>

      {/* --- BENTO BOX FEATURE GRID --- */}
      <section className="px-6 max-w-7xl mx-auto mb-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
          
          {/* Big Feature: Mobile First */}
          <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 lg:p-10 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden animate-in slide-in-from-bottom-12 fade-in duration-1000 delay-100">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-50 dark:bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/10 transition-colors duration-500" />
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-emerald-100 dark:border-emerald-500/20 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                <Smartphone size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">100% Mobile Optimized</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md">Your customers are on their phones. Your store is built to look and feel like a native app, ensuring fast load times and a flawless shopping experience.</p>
              </div>
            </div>
          </div>

          {/* Small Feature: Global Link */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden flex flex-col justify-between animate-in slide-in-from-bottom-12 fade-in duration-1000 delay-200">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
              <Globe size={24} />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">One Link Everywhere</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Put your shop.vi link in your Instagram bio, TikTok, or X profile.</p>
            </div>
            <div className="absolute top-8 right-8 text-slate-100 dark:text-slate-800 group-hover:text-blue-50 dark:group-hover:text-blue-900/30 transition-colors duration-500 transform group-hover:rotate-12">
              <Share2 size={80} />
            </div>
          </div>

          {/* Small Feature: Unlimited Products */}
          <div className="bg-slate-900 dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-800 shadow-xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden flex flex-col justify-between text-white animate-in slide-in-from-bottom-12 fade-in duration-1000 delay-300">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="w-12 h-12 bg-white/10 text-white rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20 group-hover:scale-110 group-hover:bg-white group-hover:text-slate-900 transition-all duration-300 relative z-10">
              <Layers size={24} />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-black mb-2">Unlimited Products</h3>
              <p className="text-sm text-slate-400 font-medium">No caps, no limits. Upload your entire inventory for free.</p>
            </div>
          </div>

          {/* Big Feature: Dynamic Themes */}
          <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 lg:p-10 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group flex items-center justify-between overflow-hidden relative animate-in slide-in-from-bottom-12 fade-in duration-1000 delay-400">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
             <div className="relative z-10 max-w-sm">
              <div className="w-14 h-14 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-purple-100 dark:border-purple-500/20 group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
                <Palette size={28} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Custom Store Themes</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Stand out from the crowd. Choose from animated backgrounds like Aurora, Neon, Bubbles, Ocean, or upload your own custom image.</p>
            </div>
            
            {/* Animated Color Swatches */}
            <div className="hidden sm:grid grid-cols-2 gap-3 relative z-10 mr-4 transform group-hover:rotate-6 transition-transform duration-500">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg animate-pulse" style={{ animationDuration: '3s' }} />
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 shadow-lg animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
              <div className="w-16 h-16 rounded-2xl bg-[#030712] border border-lime-500/30 shadow-[0_0_15px_rgba(132,204,22,0.3)] animate-pulse" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-300 to-pink-400 shadow-lg animate-pulse" style={{ animationDuration: '3.5s', animationDelay: '1.5s' }} />
            </div>
          </div>

        </div>
      </section>

      {/* --- DEEP DIVE SECTIONS --- */}
      <section className="px-6 py-20 max-w-7xl mx-auto space-y-32">
        
        {/* Feature 1: Smart Checkout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#25D366]/20 to-emerald-500/20 blur-3xl rounded-[3rem] group-hover:opacity-70 transition-opacity duration-700 opacity-30" />
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative z-10 transform group-hover:-rotate-2 transition-transform duration-500 overflow-hidden">
               {/* Mockup UI: Checkout Bar */}
               <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 mb-4">
                 <div className="flex justify-between items-center mb-4">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center justify-center">👟</div>
                     <span className="font-bold text-sm">Sneakers</span>
                   </div>
                   <div className="flex items-center gap-2 bg-emerald-500 text-white rounded-lg px-2 py-1 shadow-sm">
                     <span className="text-xs">-</span>
                     <span className="text-xs font-black">2</span>
                     <span className="text-xs">+</span>
                   </div>
                 </div>
                 <div className="h-px bg-slate-200 dark:bg-slate-800 w-full mb-4" />
                 <div className="flex justify-between font-black text-lg">
                   <span>Total</span>
                   <span className="text-emerald-500">₦50,000</span>
                 </div>
               </div>

               <div className="bg-[#25D366] text-white p-3 rounded-[2rem] shadow-[0_15px_30px_-10px_rgba(37,211,102,0.4)] flex items-center justify-between border-4 border-white dark:border-slate-800 group-hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-900 w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
                      <span className="font-black text-sm">2</span>
                    </div>
                    <div className="flex flex-col leading-none">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-green-100 mb-0.5">Total</span>
                      <span className="font-black">₦50,000</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                    <span className="font-bold text-xs uppercase tracking-wide">Order</span>
                    <MessageCircle size={16} className="fill-white" />
                  </div>
               </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 animate-in slide-in-from-right-12 fade-in duration-1000">
            <div className="w-12 h-12 bg-[#25D366]/10 text-[#25D366] rounded-xl flex items-center justify-center mb-6">
              <MessageCircle size={24} />
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
              Smart Cart & Seamless Checkout
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium mb-8 leading-relaxed">
              ShopLink handles the math for you. Customers add items, adjust quantities, and see their exact totals instantly. With one tap, their order is bundled into a clean receipt and sent directly to your WhatsApp.
            </p>
            <ul className="space-y-4">
              {['Persistent shopping carts', 'Auto-calculates totals', 'Generates unique Order IDs (e.g. ORD-73921)'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-bold text-slate-700 dark:text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Zap size={12} fill="currentColor" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Feature 2: Dashboard/Analytics */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-in slide-in-from-left-12 fade-in duration-1000">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
              <BarChart3 size={24} />
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
              Know exactly what's selling.
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium mb-8 leading-relaxed">
              Your command center gives you a bird's-eye view of your business. Track how many people view your store, which products are getting the most clicks, and your total order volume over time.
            </p>
            <Link to="/register" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 transition-colors group">
              Explore Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-3xl rounded-[3rem] group-hover:opacity-70 transition-opacity duration-700 opacity-30" />
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative z-10 transform group-hover:rotate-2 transition-transform duration-500">
               {/* Mockup UI Analytics */}
               <div className="grid grid-cols-2 gap-4 mb-6">
                 <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                    <p className="text-xs font-black text-slate-400 uppercase mb-1">Store Views</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">1,204</p>
                 </div>
                 <div className="bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
                    <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase mb-1">Total Orders</p>
                    <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">48</p>
                 </div>
               </div>
               <div className="h-32 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex items-end px-4 pb-4 gap-2 overflow-hidden">
                 {/* Fake Chart Bars with staggered continuous animations */}
                 {[40, 70, 45, 90, 60, 100, 80].map((height, i) => (
                   <div 
                    key={i} 
                    className="w-full bg-blue-500/20 dark:bg-blue-500/40 rounded-t-sm hover:bg-blue-500 transition-all cursor-pointer animate-pulse" 
                    style={{ height: `${height}%`, animationDelay: `${i * 150}ms`, animationDuration: '2s' }} 
                  />
                 ))}
               </div>
            </div>
            {/* Floating Badge */}
            <div className="absolute -left-6 -bottom-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 animate-bounce z-20" style={{ animationDuration: '3s' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white"><BellRing size={18} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400">Trending Product</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">Sneakers getting clicks!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* --- FINAL CTA --- */}
      <section className="px-6 py-20 max-w-5xl mx-auto relative z-10 animate-in slide-in-from-bottom-12 fade-in duration-1000">
        <div className="bg-slate-900 dark:bg-[#064e3b] rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl group">
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          
          {/* Animated Background Hover */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight">Stop reading. Start selling.</h2>
            <p className="text-slate-400 dark:text-emerald-100/80 text-lg font-medium mb-10">
              Join the thousands of Nigerian vendors streamlining their WhatsApp businesses with ShopLink. It's 100% free forever.
            </p>
            <Link to="/register" className="inline-flex items-center justify-center gap-3 bg-emerald-500 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/30 hover:-translate-y-1 w-full sm:w-auto active:scale-95">
              <Store size={18} /> Create Your Store
            </Link>
          </div>
        </div>
      </section>
      <Footer className="pt-[100px]" />
    </div>
  );
}