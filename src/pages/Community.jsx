import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Users, Sparkles, MessageCircle, TrendingUp, 
  ShieldCheck, Heart, ArrowRight, Zap, Globe
} from 'lucide-react';
import Footer from '../components/Footer';

export default function Community() {
  const [chatStep, setChatStep] = useState(0);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Loop the community chat demonstration
  useEffect(() => {
    const timer = setInterval(() => {
      setChatStep((prev) => (prev >= 3 ? 0 : prev + 1));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans transition-colors duration-300 pt-24 pb-20 overflow-hidden">
      <Helmet>
        <title>Vendor Community — ShopLink.vi</title>
        <meta name="description" content="Join the ShopLink vendor community. Network, share tips, and grow your WhatsApp business together." />
      </Helmet>

      {/* --- HERO SECTION --- */}
      <section className="px-6 py-16 lg:py-24 max-w-7xl mx-auto text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 animate-in slide-in-from-bottom-8 fade-in duration-1000">
          <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-full px-5 py-2 mb-8 shadow-sm">
            <Users size={14} className="text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">ShopLink VIP Vendors</span>
          </div>
          
          <h1 className="text-4xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter mb-6 max-w-4xl mx-auto leading-[1.05]">
            In business for yourself,<br />
            <span className="text-emerald-500 italic relative inline-block">
              but never by yourself.
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-emerald-200 dark:text-emerald-900/60" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" fill="transparent" stroke="currentColor" strokeWidth="4"/>
              </svg>
            </span>
          </h1>
          
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed mb-10">
            Join thousands of Nigerian hustlers, creators, and business owners in our private community. Share sales strategies, find reliable delivery partners, and get direct support from the ShopLink team.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#" 
              className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1EBE5C] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all shadow-lg shadow-[#25D366]/30 hover:-translate-y-1 active:scale-95 group"
            >
              <MessageCircle size={18} className="group-hover:animate-bounce" /> Join WhatsApp Group
            </a>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> 100% Free
            </p>
          </div>
        </div>
      </section>

      {/* --- LIVE CHAT MOCKUP SECTION --- */}
      <section className="px-6 py-12 max-w-5xl mx-auto relative z-10">
        <div className="bg-white dark:bg-slate-900/50 rounded-[3rem] p-4 sm:p-8 lg:p-12 border border-slate-200 dark:border-slate-800/60 shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-12 fade-in duration-1000 delay-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />
          
          <div className="text-center mb-10 relative z-10">
            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mb-2">A sneak peek inside 👀</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Real conversations happening right now.</p>
          </div>

          {/* Fake Group Chat Window */}
          <div className="max-w-2xl mx-auto bg-[#EFE7DD] dark:bg-[#0b141a] rounded-3xl overflow-hidden shadow-inner border border-slate-300 dark:border-slate-800 flex flex-col relative z-10">
            {/* Header */}
            <div className="bg-[#075e54] dark:bg-[#202c33] text-white p-4 flex items-center gap-4 z-10 shadow-sm">
              <div className="relative">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white/20">
                  <Users size={20} className="text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-[#202c33]" />
              </div>
              <div>
                <p className="font-bold">ShopLink VIP Vendors 🚀</p>
                <p className="text-[10px] text-white/70">Sarah, Chidi, Admin, You + 4,208 others</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="p-4 sm:p-6 flex flex-col gap-4 relative overflow-hidden h-[380px]">
              <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')" }} />
              
              {/* Message 1 */}
              <div className="flex items-start gap-2 max-w-[85%] relative z-10">
                <img src="https://ui-avatars.com/api/?name=Sarah+Bakes&background=f472b6&color=fff" className="w-8 h-8 rounded-full flex-shrink-0 mt-1" alt="Sarah" />
                <div className="bg-white dark:bg-[#202c33] p-3 rounded-2xl rounded-tl-none shadow-sm">
                  <p className="text-[10px] font-bold text-pink-500 mb-1">Sarah (SweetTooth NG)</p>
                  <p className="text-sm text-slate-800 dark:text-slate-200">Guys! Just got 5 orders in the last hour since I shared my ShopLink on TikTok! 😭🔥 The automated receipts are a lifesaver.</p>
                </div>
              </div>

              {/* Message 2 */}
              <div className={`flex items-start gap-2 max-w-[85%] relative z-10 transition-all duration-500 transform ${chatStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <img src="https://ui-avatars.com/api/?name=Chidi+Tech&background=3b82f6&color=fff" className="w-8 h-8 rounded-full flex-shrink-0 mt-1" alt="Chidi" />
                <div className="bg-white dark:bg-[#202c33] p-3 rounded-2xl rounded-tl-none shadow-sm">
                  <p className="text-[10px] font-bold text-blue-500 mb-1">Chidi (GadgetHub)</p>
                  <p className="text-sm text-slate-800 dark:text-slate-200">That's massive! Congrats Sarah! Btw, does anyone have a reliable dispatch rider for the Island? My guy is delaying.</p>
                </div>
              </div>

              {/* Message 3 */}
              <div className={`flex items-start gap-2 max-w-[85%] relative z-10 transition-all duration-500 transform ${chatStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <img src="https://ui-avatars.com/api/?name=Admin+ShopLink&background=10b981&color=fff" className="w-8 h-8 rounded-full flex-shrink-0 mt-1 border-2 border-emerald-500" alt="Admin" />
                <div className="bg-white dark:bg-[#202c33] p-3 rounded-2xl rounded-tl-none shadow-sm">
                  <p className="text-[10px] font-black text-emerald-500 flex items-center gap-1 mb-1"><ShieldCheck size={10} /> ShopLink Admin</p>
                  <p className="text-sm text-slate-800 dark:text-slate-200">Chidi, check the pinned messages at the top! We verified a list of 10 logistics companies for Lagos last week. 📦</p>
                </div>
              </div>

              {/* Message 4 (User's hypothetical reply) */}
              <div className={`ml-auto max-w-[85%] relative z-10 transition-all duration-500 transform ${chatStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="bg-[#DCF8C6] dark:bg-[#005c4b] p-3 rounded-2xl rounded-tr-none shadow-sm">
                  <p className="text-sm text-slate-800 dark:text-white">This group is actually so helpful. Glad I joined!</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* --- BENEFITS GRID --- */}
      <section className="px-6 py-20 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-in fade-in duration-1000 delay-300">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Why you should join today</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              icon: TrendingUp, 
              color: 'text-blue-500',
              bg: 'bg-blue-50 dark:bg-blue-500/10',
              title: 'Growth Strategies', 
              desc: 'Learn exactly how top vendors are using TikTok, Instagram ads, and WhatsApp status to drive insane traffic to their ShopLink stores.'
            },
            { 
              icon: ShieldCheck, 
              color: 'text-purple-500',
              bg: 'bg-purple-50 dark:bg-purple-500/10',
              title: 'Direct Support', 
              desc: 'Got a feature request or need help setting up? Tag the founders directly. We listen, and we build what the community asks for.'
            },
            { 
              icon: Heart, 
              color: 'text-pink-500',
              bg: 'bg-pink-50 dark:bg-pink-500/10',
              title: 'Trusted Network', 
              desc: 'Find verified logistics partners, packaging suppliers, and collaborate with other business owners in your city to cross-promote products.'
            }
          ].map((benefit, idx) => (
            <div 
              key={idx} 
              className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group animate-in slide-in-from-bottom-12 fade-in"
              style={{ animationDelay: `${(idx + 3) * 150}ms` }}
            >
              <div className={`w-14 h-14 ${benefit.bg} ${benefit.color} rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
                <benefit.icon size={26} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">{benefit.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- COMMUNITY STATS BANNER --- */}
      <section className="py-12 border-y border-slate-100 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-900/50 relative z-10 animate-in fade-in duration-1000">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Active Vendors',   display: '4,000+' },
            { label: 'Daily Messages',   display: '1,200+' },
            { label: 'Cities Covered',   display: '36' },
            { label: 'Verified Partners',display: '50+' },
          ].map((s, i) => (
            <div key={i} className="group">
              <p className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tighter group-hover:text-emerald-500 transition-colors">{s.display}</p>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="px-6 py-20 max-w-5xl mx-auto relative z-10 animate-in slide-in-from-bottom-12 fade-in duration-1000 delay-500">
        <div className="bg-slate-900 dark:bg-[#064e3b] rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl group">
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          
          {/* Animated Background Hover */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/30 transform group-hover:rotate-12 transition-transform duration-500">
              <Globe size={28} />
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight">Your tribe is waiting.</h2>
            <p className="text-slate-400 dark:text-emerald-100/80 text-lg font-medium mb-10">
              Surround yourself with people who understand the hustle. Get answers, get motivated, and grow your sales.
            </p>
            
            <a 
              href="#" 
              className="inline-flex items-center justify-center gap-3 bg-[#25D366] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#1EBE5C] transition-all shadow-lg shadow-[#25D366]/30 hover:-translate-y-1 w-full sm:w-auto active:scale-95"
            >
              <MessageCircle size={18} /> Join WhatsApp Group
            </a>
          </div>
        </div>
      </section>
      <Footer className="pt-[100px]" />
    </div>
  );
}