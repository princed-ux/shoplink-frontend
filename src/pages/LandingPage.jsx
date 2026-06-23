import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag, Zap, ArrowRight, Menu, X, MousePointer2,
  Share2, LayoutDashboard, Sparkles, BarChart3,
  Smartphone, Utensils, Shirt, Phone, Video, MoreVertical,
  CheckCheck, ChevronDown, CheckCircle2, Store,
  LinkIcon, MessageCircle, Star, Package, TrendingUp,
  Eye, MapPin, Flag, Play
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../supabaseClient';

import shopLink_logo       from '../assets/logo.png';
import dashboard_mockup_light    from '../assets/dashboard-mockup_light.png';
import dashboard_mockup_dark    from '../assets/dashboard-mockup_dark.png';
import NetworkConnectorSection from '../components/landing/NetworkConnectorSection';
import TestimonialsSection     from '../components/landing/TestimonialsSection';
import OrderFlowSection        from '../components/landing/OrderFlowSection';
import StatsSection            from '../components/landing/StatsSection';
import AppDownloadBanner       from '../components/landing/AppDownloadBanner';
import Footer from '../components/Footer';

// ── Phone mockup ─────────────────────────────────────────────────────────────
function PhoneMockup({ demoStep }) {
  return (
    <div className="relative mx-auto border-slate-900 dark:border-slate-800 bg-slate-900 dark:bg-slate-950 border-[12px] rounded-[3rem] h-[620px] w-[300px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] dark:shadow-[0_0_80px_-20px_rgba(16,185,129,0.15)] flex flex-col overflow-hidden transition-all duration-300">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-24 bg-black rounded-b-2xl z-50" />
      <div className="bg-[#EFE7DD] dark:bg-[#0b141a] w-full h-full relative flex flex-col font-sans transition-colors duration-300">
        {/* Status bar */}
        <div className="h-10 bg-[#075E54] dark:bg-[#1f2c34] w-full flex items-center justify-between px-5 pt-2 text-white text-[10px] font-medium z-40 transition-colors duration-300">
          <span>9:41</span>
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 bg-white rounded-full opacity-30" />
            <div className="w-2.5 h-2.5 bg-white rounded-full opacity-30" />
          </div>
        </div>
        {/* Chat header */}
        <div className="bg-[#075E54] dark:bg-[#1f2c34] px-4 pb-3 pt-1 text-white flex items-center justify-between shadow-md z-30 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs border border-white/30">KS</div>
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-tight">Kiki's Store</div>
              <div className="text-[10px] opacity-80">Business Account</div>
            </div>
          </div>
          <div className="flex gap-3 opacity-70">
            <Video size={16} />
            <Phone size={16} />
            <MoreVertical size={16} />
          </div>
        </div>
        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 relative overflow-hidden flex flex-col justify-end pb-5">
          <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.02] pointer-events-none bg-repeat invert-0 dark:invert"
            style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')" }} />
          <div className="self-center bg-[#E1F3FB] dark:bg-[#182229] text-slate-600 dark:text-slate-400 text-[9px] px-3 py-1 rounded-lg font-medium uppercase tracking-wide mb-2 shadow-sm">Today</div>

          {/* Incoming order */}
          <div className={`transform transition-all duration-500 ease-out ${demoStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} self-start max-w-[85%]`}>
            <div className="bg-white dark:bg-[#202c33] p-3 rounded-lg rounded-tl-none shadow-sm text-[10px] text-slate-800 dark:text-slate-200 leading-relaxed border-l-4 border-emerald-500 dark:border-emerald-400">
              <p className="font-black mb-2 text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <ShoppingBag size={10} /> NEW ORDER #2401
              </p>
              <div className="space-y-0.5 text-slate-600 dark:text-slate-300 font-mono">
                <p className="flex justify-between gap-4"><span>2x Red Velvet</span><span>10,000</span></p>
                <p className="flex justify-between gap-4"><span>1x Meat Pie Box</span><span>5,000</span></p>
                <hr className="my-1.5 border-dashed border-slate-200 dark:border-slate-700" />
                <p className="flex justify-between font-black text-slate-900 dark:text-white text-[11px]"><span>TOTAL</span><span>₦15,000</span></p>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/50 text-[9px] text-slate-500 dark:text-slate-400 space-y-0.5">
                <p className="flex items-center gap-1"><MapPin size={8} /> 12 Admiralty Way, Lekki</p>
                <p className="flex items-center gap-1"><Phone size={8} /> 08012345678</p>
              </div>
            </div>
          </div>

          {/* Reply */}
          <div className={`transform transition-all duration-500 delay-300 ease-out ${demoStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} self-end max-w-[85%]`}>
            <div className="bg-[#DCF8C6] dark:bg-[#005c4b] p-3 rounded-lg rounded-tr-none shadow-sm text-[10px] text-slate-800 dark:text-white">
              <p>Order received! Packing now.</p>
              <div className="flex justify-end items-center gap-1 mt-1">
                <span className="text-[9px] text-slate-400 dark:text-emerald-200/60">09:43</span>
                <CheckCheck size={11} className="text-blue-500 dark:text-[#53bdeb]" />
              </div>
            </div>
          </div>

          {demoStep === 0 && (
            <div className="absolute bottom-20 left-1/2 animate-bounce drop-shadow-xl z-50">
              <MousePointer2 className="text-slate-900 dark:text-emerald-400 fill-white dark:fill-slate-900" size={28} />
            </div>
          )}
        </div>
        {/* Input bar */}
        <div className="bg-[#F0F0F0] dark:bg-[#1f2c34] p-2 pb-5 flex items-center gap-2 px-3 transition-colors duration-300">
          <div className="bg-white dark:bg-[#2a3942] flex-1 rounded-full h-9 px-4 flex items-center text-slate-400 dark:text-slate-500 text-[10px] shadow-sm">Type a message...</div>
          <div className="w-9 h-9 bg-[#075E54] dark:bg-[#00a884] rounded-full flex items-center justify-center text-white shadow-md">
            <ArrowRight size={14} />
          </div>
        </div>
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-28 h-1 bg-black dark:bg-white rounded-full opacity-20 dark:opacity-20" />
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [demoStep, setDemoStep]   = useState(0);
  const [openFaq, setOpenFaq]     = useState(null);
  const [user, setUser]           = useState(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUser(session.user);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setDemoStep(p => (p + 1) % 4), 3500);
    return () => clearInterval(t);
  }, []);

  const handleShare = async () => {
    const url = 'https://shoplinkvi.com';
    if (navigator.share) {
      try { await navigator.share({ title: 'ShopLink.vi', text: 'Turn your WhatsApp into a store!', url }); }
      catch { navigator.clipboard.writeText(url); toast.success('Link copied!'); }
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied!');
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans overflow-x-hidden transition-colors duration-300">
      <Toaster position="bottom-center" toastOptions={{ className: 'dark:bg-slate-800 dark:text-white' }} />
      <Helmet>
        <title>ShopLink.vi — Free WhatsApp Store Builder</title>
        <meta name="description" content="Create a free WhatsApp store in 60 seconds. No credit card. No trial. 100% free." />
        <meta name="mobile-web-app-capable" content="yes" />
      </Helmet>

      {/* Branded Video Modal Overlay */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-md transition-opacity duration-300">
          {/* Backdrop that closes modal when clicked */}
          <div 
            className="absolute inset-0 cursor-pointer" 
            onClick={() => setIsVideoModalOpen(false)} 
          />
          
          {/* Modal Container */}
          <div className="relative w-full max-w-6xl z-10 animate-in zoom-in-95 duration-300 flex flex-col">
            
            {/* Close Button - Moved Safely ABOVE the Video */}
            <div className="flex justify-end mb-4 sm:mb-6">
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="w-12 h-12 bg-white/10 hover:bg-emerald-500 hover:text-white text-slate-200 rounded-full flex items-center justify-center transition-all backdrop-blur-md border border-white/20 shadow-xl"
              >
                <X size={24} />
              </button>
            </div>

            {/* Video Player Box */}
            <div className="bg-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)] border border-emerald-500/20">
              <div className="relative pt-[56.25%] w-full flex items-center justify-center">
                
                {/* Branded Loading Indicator */}
                {isVideoLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-emerald-500 space-y-4">
                    <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                    <p className="text-sm font-bold uppercase tracking-widest text-emerald-400 animate-pulse">Loading Demo...</p>
                  </div>
                )}

                <iframe
                  className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${isVideoLoading ? 'opacity-0' : 'opacity-100'}`}
                  src="https://www.youtube.com/embed/_7LWXLjo5yo?autoplay=1&modestbranding=1&rel=0&vq=hd1080"
                  title="ShopLink.vi Demo"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  onLoad={() => setIsVideoLoading(false)}
                ></iframe>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Ambient glow */}
      <div className="fixed top-0 left-0 right-0 h-[400px] overflow-hidden pointer-events-none z-0 flex justify-center">
        <div className="w-[800px] h-[400px] bg-emerald-500/5 dark:bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      {/* ── HERO ── */}
      <header className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-full px-5 py-2 mb-8 animate-in slide-in-from-bottom-4 fade-in duration-700">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">100% Free · Create Your Link</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white mb-6 leading-[0.95] tracking-tighter animate-in slide-in-from-bottom-6 fade-in duration-700 delay-100">
              Turn your{' '}
              <span className="text-emerald-500 italic relative inline-block">
                WhatsApp
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-emerald-200 dark:text-emerald-900/60" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" fill="transparent" stroke="currentColor" strokeWidth="4"/>
                </svg>
              </span>{' '}
              into a checkout machine.
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium animate-in fade-in duration-700 delay-200">
              Create your free store in 60 seconds. Share one link across Instagram, TikTok, and WhatsApp.
              Receive formatted orders directly to your WhatsApp.{' '}
              <strong className="text-slate-900 dark:text-white">Free. Always.</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-in fade-in duration-700 delay-300">
              <Link to="/register"
                className="bg-slate-900 dark:bg-emerald-500 dark:text-white text-white px-10 py-5 rounded-2xl text-sm font-black uppercase tracking-widest shadow-2xl hover:bg-emerald-600 dark:hover:bg-emerald-400 transition-all flex items-center justify-center gap-3 hover:-translate-y-1 group">
                <Zap size={18} fill="currentColor" className="text-yellow-400 group-hover:text-white" /> Create Free Store
              </Link>
              {/* Updated Video Button */}
              <button onClick={() => { setIsVideoModalOpen(true); setIsVideoLoading(true); }}
                className="bg-white dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-800 px-10 py-5 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center justify-center gap-3 shadow-sm hover:-translate-y-1">
                <Play size={18} /> Watch Video
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {['No Card Needed', 'Instant Setup', 'Always Free'].map((t, i) => (
                <span key={i} className="flex items-center gap-1">
                  <CheckCircle2 size={13} className="text-emerald-500" /> {t}
                </span>
              ))}
            </div>
          </div>

          {/* Phone mockup */}
          <div className="relative z-10 hidden lg:block">
            <div className="group hover:scale-[1.02] transition-transform duration-700">
              <PhoneMockup demoStep={demoStep} />
            </div>
            {/* Floating stat badges */}
            <div className="absolute -left-10 top-1/3 bg-white dark:bg-slate-900 rounded-2xl px-4 py-3 shadow-2xl border border-slate-100 dark:border-slate-800/60 animate-bounce">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <ShoppingBag size={15} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">New Order</p>
                  <p className="text-xs font-black text-slate-900 dark:text-white">₦15,000 received</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-6 bottom-1/4 bg-white dark:bg-slate-900 rounded-2xl px-4 py-3 shadow-2xl border border-slate-100 dark:border-slate-800/60 animate-bounce" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Eye size={15} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Store Views</p>
                  <p className="text-xs font-black text-slate-900 dark:text-white">+340 today</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── STATS BANNER ── */}
      <div className="border-y border-slate-100 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-900/50 py-8 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Cost to Start',    display: '₦0' },
            { label: 'Setup Time',       display: '60s' },
            { label: 'Products Limit',   display: '∞' },
            { label: 'Platforms',        display: '6+' },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{s.display}</p>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <StatsSection />

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-6 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-slate-900 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border dark:border-emerald-500/20 text-white px-4 py-1.5 rounded-full mb-4">
              <Sparkles size={13} className="text-emerald-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">3 Steps</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
              From zero to selling in minutes.
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto">
              No coding. No complicated setup. Just your products and your WhatsApp.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-emerald-100 via-emerald-400 to-emerald-100 dark:from-slate-800 dark:via-emerald-900 dark:to-slate-800" />
            {[
              { icon: Store,         step: '01', title: 'Create Your Store',       desc: 'Sign up free. Grab your unique shop.vi/yourname link. No payment needed, ever.' },
              { icon: Package,       step: '02', title: 'Add Your Products',       desc: 'Upload photos, set prices, add descriptions. Your storefront is live instantly.' },
              { icon: MessageCircle, step: '03', title: 'Receive WhatsApp Orders', desc: 'Share your link everywhere. Get formatted receipts delivered straight to your WhatsApp.' },
            ].map((item, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-24 h-24 bg-white dark:bg-slate-900 border-4 border-slate-50 dark:border-slate-800 rounded-full flex items-center justify-center shadow-xl mb-6 text-emerald-500 group-hover:scale-110 group-hover:border-emerald-100 dark:group-hover:border-emerald-900/50 transition-all duration-300">
                  <item.icon size={28} />
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-3">Step {item.step}</div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <OrderFlowSection />

      {/* ── NETWORK SECTION ── */}
      <NetworkConnectorSection shopLogo={shopLink_logo} />

      {/* ── ORDER SHOWCASE ── */}
      <section className="py-24 px-6 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Receipt card */}
          <div className="flex justify-center order-2 lg:order-1">
            <div className="relative">
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-800 max-w-sm w-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <MessageCircle size={22} className="text-white" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 dark:text-white">New Order Received</p>
                    <p className="text-xs text-emerald-500 font-bold">via shop.vi/kikistore</p>
                  </div>
                </div>
                <div className="bg-[#DCF8C6] dark:bg-[#005c4b]/30 rounded-2xl p-5 font-mono text-sm text-slate-800 dark:text-emerald-50 leading-relaxed border dark:border-emerald-900/30">
                  <p className="font-black text-slate-900 dark:text-white mb-2">ORDER #2401</p>
                  <p className="text-slate-400 dark:text-emerald-700/50 text-xs mb-2">────────────────</p>
                  <p className="flex justify-between gap-4"><span>2x Red Velvet</span><span>₦10,000</span></p>
                  <p className="flex justify-between gap-4"><span>1x Meat Pie Box</span><span>₦5,000</span></p>
                  <p className="text-slate-400 dark:text-emerald-700/50 text-xs my-2">────────────────</p>
                  <p className="flex justify-between font-black text-slate-900 dark:text-white">
                    <span>TOTAL</span><span className="text-emerald-600 dark:text-emerald-400">₦15,000</span>
                  </p>
                  <div className="mt-3 pt-2 border-t border-slate-200 dark:border-emerald-900/40 text-xs text-slate-500 dark:text-emerald-200/70 space-y-1">
                    <p className="flex items-center gap-1.5"><MapPin size={10} /> 12 Admiralty Way, Lekki</p>
                    <p className="flex items-center gap-1.5"><Phone size={10} /> 08012345678</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <CheckCheck size={14} className="text-blue-500 dark:text-[#53bdeb]" />
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Delivered to your WhatsApp</span>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-emerald-500 text-white rounded-2xl px-4 py-2 shadow-xl shadow-emerald-500/30">
                <p className="text-[10px] font-black uppercase tracking-widest">Auto-Generated</p>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl px-4 py-2 shadow-xl">
                <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <CheckCheck size={12} /> Formatted Receipt
                </p>
              </div>
            </div>
          </div>

          {/* Copy */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-4 py-1.5 rounded-full mb-6">
              <Zap size={13} fill="currentColor" />
              <span className="text-[10px] font-black uppercase tracking-widest">Zero Extra Work</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-6 leading-[1.1]">
              Orders arrive formatted, ready to action.
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed mb-8">
              When a customer checks out from your store, a pre-filled WhatsApp message with all order details
              is sent directly to your number. No typing. No confusion.
            </p>
            <div className="space-y-3">
              {[
                { icon: ShoppingBag,   title: 'Customer adds to cart',            desc: 'They browse your store and tap what they want' },
                { icon: MessageCircle, title: 'WhatsApp opens automatically',     desc: 'A pre-filled message with full order details is ready' },
                { icon: CheckCheck,    title: 'You receive the order',            desc: 'Name, items, quantities, total — all formatted for you' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl hover:bg-emerald-50 dark:hover:bg-emerald-500/5 transition-colors group border border-transparent hover:border-emerald-100 dark:hover:border-emerald-500/20">
                  <div className="w-9 h-9 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm group-hover:bg-emerald-500 transition-colors border dark:border-slate-700">
                    <item.icon size={16} className="text-slate-500 dark:text-slate-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 dark:text-white text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{item.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DASHBOARD SHOWCASE ── */}
      <section className="py-20 px-6 bg-slate-50 dark:bg-slate-900 overflow-hidden transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-slate-900 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border dark:border-emerald-500/20 text-white px-4 py-1.5 rounded-full mb-4">
              <BarChart3 size={13} className="text-emerald-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">Command Center</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
              Manage everything from one dashboard.
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto">
              Track store views, manage products, and update your brand — all from your phone.
            </p>
          </div>

          <div className="relative mx-auto max-w-5xl">
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/15 to-emerald-300/5 blur-[100px] rounded-[3rem] -z-10" />
            
            {/* The Container */}
            <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/80 dark:border-slate-700/50 p-3 rounded-[3rem] shadow-[0_30px_100px_-15px_rgba(34,197,94,0.15)] dark:shadow-none">
              <div className="overflow-hidden rounded-[2.5rem] bg-slate-100 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50 relative">
                
                {/* 1. LIGHT MODE SCREENSHOT: Visible by default, hidden when 'dark' class is present */}
                <img 
                  src={dashboard_mockup_light} 
                  alt="ShopLink Dashboard Light" 
                  className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-700 block dark:hidden" 
                />

                {/* 2. DARK MODE SCREENSHOT: Hidden by default, visible only when 'dark' class is present */}
                <img 
                  src={dashboard_mockup_dark} 
                  alt="ShopLink Dashboard Dark" 
                  className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-700 hidden dark:block" 
                />

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ── */}
      <section className="py-24 px-6 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-4">Who is ShopLink for?</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Built for the hustlers, chefs, and fashionistas of Nigeria.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shirt,      color: 'bg-pink-50 dark:bg-pink-500/10 text-pink-500',  hoverColor: 'group-hover:bg-pink-100 dark:group-hover:bg-pink-500/20', title: 'Fashion Vendors',   desc: 'Stop sending 50 photos to every customer. One link shows all your sizes, colors, and prices.' },
              { icon: Utensils,   color: 'bg-orange-50 dark:bg-orange-500/10 text-orange-500', hoverColor: 'group-hover:bg-orange-100 dark:group-hover:bg-orange-500/20', title: 'Food & Kitchens',   desc: 'Great for food tray businesses. Let customers select their meal and get totals instantly.' },
              { icon: Smartphone, color: 'bg-blue-50 dark:bg-blue-500/10 text-blue-500',   hoverColor: 'group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20', title: 'Gadget Stores',    desc: "Sell phones, accessories, electronics. Manage stock so customers never order what you've sold." },
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-emerald-100 dark:hover:border-emerald-900/50 transition-all group hover:-translate-y-2">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all border border-transparent dark:border-white/5 ${item.color} ${item.hoverColor}`}>
                  <item.icon size={26} />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection />

      {/* ── FREE FOREVER CTA ── */}
      <section className="py-24 px-6 bg-emerald-600 dark:bg-[#064e3b] text-white rounded-[3rem] mx-4 lg:mx-10 mb-10 relative overflow-hidden shadow-2xl shadow-emerald-500/20 dark:border dark:border-emerald-800">
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-black/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full mb-8">
            <Star size={13} fill="currentColor" />
            <span className="text-[10px] font-black uppercase tracking-widest">No Catch. No Hidden Fees.</span>
          </div>
          <h2 className="text-4xl lg:text-7xl font-black tracking-tighter mb-6">
            Free today.<br />Free forever.
          </h2>
          <p className="text-emerald-100 dark:text-emerald-200/80 text-xl font-medium mb-12 max-w-2xl mx-auto">
            ShopLink is completely free. Create your store, upload unlimited products, and receive orders — zero cost, zero commitment.
          </p>

          <div className="grid sm:grid-cols-3 gap-3 max-w-2xl mx-auto mb-12">
            {['Unlimited Products', 'WhatsApp Checkout', 'Store Analytics', 'Custom Branding', 'Instant Setup', 'No Expiry Date'].map((f, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-3 rounded-2xl">
                <CheckCircle2 size={14} className="flex-shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-wide">{f}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white dark:bg-emerald-500 text-emerald-700 dark:text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-50 dark:hover:bg-emerald-400 transition shadow-2xl flex items-center justify-center gap-3 active:scale-95">
              <Zap size={18} fill="currentColor" className="text-emerald-500 dark:text-yellow-400" /> Create Free Store
            </Link>
            <button onClick={handleShare} className="bg-emerald-700/60 dark:bg-black/20 border border-white/20 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-800 dark:hover:bg-black/40 transition flex items-center justify-center gap-3">
              <Share2 size={18} /> Share ShopLink
            </button>
          </div>
        </div>
      </section>

      <AppDownloadBanner />

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 px-6 bg-white dark:bg-slate-950">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-4">Got Questions?</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Everything you need to know.</p>
          </div>
          <div className="space-y-3">
            {[
              { q: 'Is ShopLink really free?',                a: 'Yes — completely free, and it always will be. No credit card, no trial, no hidden fees. Create your store and start selling at zero cost.' },
              { q: 'Do I have to pay for Pro or Premium?',    a: 'No. Pro and Premium are completely optional upgrades — never required to sell. The free plan is fully functional. Paid tiers just add extra polish like more product photos, animated GIFs, premium themes, a verified badge and deeper analytics.' },
              { q: 'Can I add multiple photos to a product?', a: 'Yes. Every store can add a product photo for free. Pro lets you add up to 5 photos per product, and Premium up to 10 photos plus animated GIFs — perfect for showing the front, back and sides of an item like a real online store.' },
              { q: "What's the difference between Free, Pro and Premium?", a: 'Free gives you a complete store with unlimited products and WhatsApp checkout. Pro adds up to 5 photos per product, stock tracking, product variants, more themes and a blue verified badge. Premium adds up to 10 photos plus GIFs, all premium themes, a gold verified badge, CSV bulk import and the deepest analytics. Free is enough to sell — the rest is optional.' },
              { q: 'Do I need a laptop to use ShopLink?',     a: 'Not at all. ShopLink is built for mobile. Manage your entire store from your phone.' },
              { q: 'How do I receive my money?',              a: "ShopLink is not a payment processor. Customers send formatted orders to your WhatsApp and you arrange payment (transfer, cash) directly — just faster and more organised." },
              { q: 'How many products can I upload?',         a: 'Unlimited. There is no product cap. Upload as many items as your store needs.' },
              { q: "Can I change my shop name or link?",      a: "Yes! You can update both your shop name and your shop.vi/link at any time from your Account Settings, provided the new link isn't already taken by someone else." },
              { q: 'What platforms work with ShopLink?',      a: 'Any platform where you can share a link — Instagram, TikTok, WhatsApp Status, Facebook, Telegram, X, YouTube. One link works everywhere.' },
            ].map((faq, i) => (
              <div key={i} className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden hover:border-emerald-300 dark:hover:border-slate-700 hover:shadow-lg transition-all">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left">
                  <span className="font-black text-sm text-slate-900 dark:text-white">{faq.q}</span>
                  <ChevronDown size={17} className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ml-4 ${openFaq === i ? 'rotate-180 text-emerald-500' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="px-6 pb-6 text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <Footer />
    </div>
  ); 
}