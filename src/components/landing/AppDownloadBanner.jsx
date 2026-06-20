import { Smartphone, Star, Shield, Zap, Download, CheckCircle2, TrendingUp, ShoppingBag, Bell } from 'lucide-react';

// Google Play Store SVG badge
const PlayStoreBadge = () => (
  <svg viewBox="0 0 135 40" width="160" height="47" xmlns="http://www.w3.org/2000/svg">
    <rect width="135" height="40" rx="6" fill="black"/>
    <rect x="0.5" y="0.5" width="134" height="39" rx="5.5" stroke="white" strokeOpacity="0.2" fill="none"/>
    <polygon points="12,10 12,30 28,20" fill="url(#play-grad)"/>
    <defs>
      <linearGradient id="play-grad" x1="12" y1="10" x2="28" y2="30" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#00C3FF"/>
        <stop offset="33%" stopColor="#00E676"/>
        <stop offset="66%" stopColor="#FFDE03"/>
        <stop offset="100%" stopColor="#FF3D00"/>
      </linearGradient>
    </defs>
    <text x="35" y="15" fontSize="8" fill="rgba(255,255,255,0.8)" fontFamily="system-ui,sans-serif" letterSpacing="0.5">GET IT ON</text>
    <text x="34" y="28" fontSize="15" fontWeight="600" fill="white" fontFamily="system-ui,sans-serif" letterSpacing="-0.2">Google Play</text>
  </svg>
);

// Apple App Store SVG badge
const AppStoreBadge = () => (
  <svg viewBox="0 0 135 40" width="160" height="47" xmlns="http://www.w3.org/2000/svg">
    <rect width="135" height="40" rx="6" fill="black"/>
    <rect x="0.5" y="0.5" width="134" height="39" rx="5.5" stroke="white" strokeOpacity="0.2" fill="none"/>
    <path d="M19.3,16.4c-0.1-2.4,1.9-3.8,2-3.8c-1.1-1.6-2.8-1.8-3.3-1.8c-1.4-0.1-2.8,0.8-3.5,0.8c-0.7,0-1.8-0.8-3-0.8 c-1.4,0-2.8,0.8-3.5,2c-1.6,2.7-0.4,6.7,1.1,8.9c0.7,1.1,1.6,2.3,2.7,2.3c1.1,0,1.5-0.7,2.8-0.7c1.3,0,1.7,0.7,2.8,0.7 c1.2,0,2-1.1,2.7-2.2c0.8-1.2,1.2-2.3,1.2-2.3S19.4,18.8,19.3,16.4 M17.1,12.4c0.6-0.7,1-1.8,0.9-2.9c-0.9,0-2.1,0.6-2.8,1.3 c-0.6,0.6-1.1,1.7-1,2.8C15.2,13.7,16.4,13.1,17.1,12.4" fill="white"/>
    <text x="35" y="15" fontSize="8" fill="rgba(255,255,255,0.8)" fontFamily="system-ui,sans-serif" letterSpacing="0.5">Download on the</text>
    <text x="34" y="28" fontSize="15" fontWeight="600" fill="white" fontFamily="system-ui,sans-serif" letterSpacing="-0.2">App Store</text>
  </svg>
);

const FEATURES = [
  { icon: Zap,          text: 'Manage your store on the go' },
  { icon: Shield,       text: 'Secure login with Google' },
  { icon: Smartphone,   text: 'Built for Nigerian mobile users' },
  { icon: CheckCircle2, text: 'All features from the web, in your pocket' },
];

export default function AppDownloadBanner() {
  return (
    <section className="py-24 px-6 bg-slate-50 dark:bg-slate-900 relative overflow-hidden transition-colors duration-300 border-t border-slate-100 dark:border-slate-800">

      {/* --- Ambient Atmosphere --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Light mode glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-[100px]" />
        {/* Subtle grid texture */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
          style={{ backgroundImage: 'radial-gradient(circle, #0f172a 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── LEFT: Copy & CTAs ── */}
          <div className="order-2 lg:order-1">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-4 py-1.5 rounded-full mb-8 shadow-sm">
              <Smartphone size={14} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Now on Android</span>
            </div>

            <h2 className="text-4xl lg:text-6xl font-black tracking-tighter text-slate-900 dark:text-white mb-6 leading-[1.0] transition-colors">
              Take your store<br />
              <span className="text-emerald-600 dark:text-emerald-400">everywhere.</span>
            </h2>

            <p className="text-slate-600 dark:text-slate-400 text-lg font-medium leading-relaxed mb-10 max-w-lg transition-colors">
              The ShopLink mobile app puts your entire store in your pocket. Add products, track views, and manage everything — straight from your phone.
            </p>

            {/* Feature list */}
            <div className="space-y-4 mb-10">
              {FEATURES.map((f, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 group-hover:border-emerald-200 dark:group-hover:border-emerald-500/30 transition-all">
                    <f.icon size={18} className="text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 font-bold text-sm transition-colors">{f.text}</span>
                </div>
              ))}
            </div>

            {/* App Store / Rating Badges */}
            <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center mb-8">
              
              {/* Stores Grid */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Active Google Play Link */}
                <a
                  href="https://play.google.com/store/apps/details?id=com.shoplink.mobile"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:-translate-y-1 transition-transform duration-300 shadow-xl rounded-lg"
                >
                  <PlayStoreBadge />
                </a>

                {/* Coming Soon iOS Badge */}
                <div className="relative group cursor-not-allowed">
                  <div className="opacity-50 grayscale transition-all duration-300 shadow-xl rounded-lg overflow-hidden">
                    <AppStoreBadge />
                  </div>
                  <div className="absolute -top-3 -right-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg z-10 border border-slate-700 dark:border-slate-200">
                    Coming Soon
                  </div>
                </div>
              </div>

              {/* Rating block */}
              <div className="flex flex-col gap-1 border-l-0 sm:border-l-2 border-slate-200 dark:border-slate-700 sm:pl-6">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} size={14} className="text-amber-400" fill="currentColor" />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-900 dark:text-white font-black text-sm">4.8/5 Rating</span>
                  <span className="text-slate-400 text-xs font-bold">· New Release!</span>
                </div>
              </div>

            </div>
          </div>

          {/* ── RIGHT: Premium Hero Mockup ── */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end relative h-[600px] w-full max-w-md mx-auto perspective-1000">
            
            {/* The Main Phone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[580px] bg-slate-900 border-[8px] border-slate-800 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] dark:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden z-10 transition-transform duration-700 hover:scale-[1.02]">
              
              {/* Dynamic Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-slate-800 rounded-b-3xl z-30" />
              
              {/* --- INNER APP UI (Adaptive Light/Dark Mode) --- */}
              <div className="flex-1 bg-slate-50 dark:bg-[#060B14] w-full relative flex flex-col transition-colors duration-500 pt-6">
                
                {/* App Header */}
                <div className="px-5 pb-4 border-b border-slate-200 dark:border-white/5 bg-white dark:bg-[#0d1f38] transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">ShopLink.vi</p>
                      <p className="text-slate-900 dark:text-white font-black text-base">Dashboard</p>
                    </div>
                    <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Dashboard Stats */}
                <div className="p-4 grid grid-cols-2 gap-3">
                  <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-transparent rounded-2xl p-3 shadow-sm transition-colors">
                    <div className="w-7 h-7 bg-blue-50 dark:bg-blue-500/20 rounded-lg flex items-center justify-center mb-2">
                      <TrendingUp size={12} className="text-blue-500 dark:text-blue-400" />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Views Today</p>
                    <p className="font-black text-slate-900 dark:text-white text-lg">1,248</p>
                  </div>
                  <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-transparent rounded-2xl p-3 shadow-sm transition-colors">
                    <div className="w-7 h-7 bg-emerald-50 dark:bg-emerald-500/20 rounded-lg flex items-center justify-center mb-2">
                      <ShoppingBag size={12} className="text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Sales</p>
                    <p className="font-black text-slate-900 dark:text-white text-lg">₦45k</p>
                  </div>
                </div>

                {/* Recent Products List */}
                <div className="px-4 flex-1">
                  <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest mb-3">Top Products</h3>
                  <div className="space-y-2.5">
                    {['Red Velvet Dress', 'Luxury Handbag', 'Gold Plated Watch'].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white dark:bg-white/5 border border-slate-100 dark:border-transparent rounded-xl p-2.5 shadow-sm transition-colors">
                        <div className="w-10 h-10 rounded-lg flex-shrink-0" style={{
                          background: ['#ec4899', '#f59e0b', '#3b82f6'][i] + (document.documentElement?.classList.contains('dark') ? '22' : '15'),
                        }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-900 dark:text-white text-xs font-bold truncate">{item}</p>
                          <p className="text-slate-400 text-[10px] font-medium">In Stock</p>
                        </div>
                        <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-black bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded">Active</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Navigation Bar */}
                <div className="mt-auto bg-white dark:bg-[#0d1f38] border-t border-slate-200 dark:border-white/5 px-6 py-4 flex justify-between items-center transition-colors">
                  <div className="flex flex-col items-center gap-1">
                    <TrendingUp size={16} className="text-emerald-500" />
                    <span className="text-[8px] font-black uppercase text-emerald-500">Home</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 opacity-40">
                    <ShoppingBag size={16} className="text-slate-500" />
                    <span className="text-[8px] font-black uppercase text-slate-500">Products</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 opacity-40">
                    <Shield size={16} className="text-slate-500" />
                    <span className="text-[8px] font-black uppercase text-slate-500">Settings</span>
                  </div>
                </div>
              </div>
            </div>

            {/* --- FLOATING UI ELEMENTS --- */}
            
            {/* Notification Badge */}
            <div className="absolute top-24 -right-12 lg:-right-16 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-3 shadow-xl dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] z-20 animate-float flex items-center gap-3 transition-colors">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center">
                <Bell size={16} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">New Order</p>
                <p className="text-xs font-black text-slate-900 dark:text-white">₦15,000 received</p>
              </div>
            </div>

            {/* App Store Tag */}
            <div className="absolute bottom-20 -left-8 lg:-left-12 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-4 py-2.5 shadow-xl dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] z-20 animate-bounce-slow flex items-center gap-2.5 transition-colors">
              <div className="w-6 h-6 bg-emerald-500 rounded-md flex items-center justify-center">
                <Download size={12} className="text-white" strokeWidth={3} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Live on Android!</span>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(2deg); }
          50% { transform: translateY(-15px) rotate(-1deg); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
      `}</style>
    </section>
  );
}