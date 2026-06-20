import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Zap, Heart, Globe, Sparkles, Store, ShieldCheck } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';

export default function About() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans overflow-x-hidden transition-colors duration-300 pt-32 pb-20">
      <Helmet>
        <title>About Us — ShopLink.vi</title>
        <meta name="description" content="Learn why we built ShopLink.vi to empower digital entrepreneurs." />
      </Helmet>

      {/* Ambient glow */}
      <div className="fixed top-0 left-0 right-0 h-[500px] overflow-hidden pointer-events-none z-0 flex justify-center">
        <div className="w-[800px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* ── HERO SECTION ── */}
        <section className="text-center max-w-4xl mx-auto mb-32 animate-in slide-in-from-bottom-8 fade-in duration-700">
          <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-4 py-1.5 rounded-full mb-6 shadow-sm">
            <Sparkles size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Our Mission</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-slate-900 dark:text-white mb-8 leading-[1.05]">
            We are retiring the <br />
            <span className="text-emerald-500 italic relative inline-block">
              "DM for price"
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-emerald-200 dark:text-emerald-900/60" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" fill="transparent" stroke="currentColor" strokeWidth="4"/>
              </svg>
            </span> era.
          </h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
            Selling online shouldn't mean spending 6 hours a day replying to "how much?", sending the same pictures, and calculating totals manually. We built ShopLink to give every ambitious vendor a professional storefront in 60 seconds.
          </p>
        </section>

        {/* ── THE STORY GRID ── */}
        <section className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center mb-32">
          <div className="order-2 md:order-1 animate-in slide-in-from-left-8 fade-in duration-1000 delay-200">
            <h2 className="text-3xl lg:text-4xl font-black tracking-tight mb-6 leading-tight">Built for the pulse of modern commerce.</h2>
            <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              <p>
                Whether you're baking cakes at midnight, sourcing the latest sneakers, or designing custom fashion, your energy should go into growing your craft—not fighting with disorganized WhatsApp chats.
              </p>
              <p>
                We noticed a massive gap: traditional e-commerce websites are too expensive, too complex to manage on a phone, and frankly, buyers still prefer the trust and speed of finalizing transactions on WhatsApp. 
              </p>
              <p>
                <strong className="text-slate-900 dark:text-white font-black">So we built the ultimate bridge.</strong> A beautiful, lightning-fast storefront that does the heavy lifting of displaying your inventory and calculating totals, seamlessly connected to the personal touch of a WhatsApp checkout.
              </p>
            </div>
          </div>
          <div className="order-1 md:order-2 relative animate-in slide-in-from-right-8 fade-in duration-1000 delay-300">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 rounded-[3rem] blur-2xl transform rotate-3 scale-105" />
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white dark:border-slate-800 p-8 md:p-12 rounded-[3rem] relative shadow-2xl">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-emerald-500/30">
                <Target size={32} />
              </div>
              <h3 className="text-2xl font-black mb-4 text-slate-900 dark:text-white">Our Vision</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                To become the core digital infrastructure for millions of micro-entrepreneurs. We believe world-class technology should be beautifully designed, completely accessible, and instantly useful.
              </p>
            </div>
          </div>
        </section>

        {/* ── CORE VALUES ── */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-black tracking-tight mb-4 text-slate-900 dark:text-white">What drives us</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Zero Friction', desc: 'If it takes more than 60 seconds to set up, it’s too slow. We obsess over making our tools instantly usable right from your smartphone.' },
              { 
  icon: ShieldCheck, 
  title: 'Free to Launch', 
  desc: 'Starting a hustle is hard enough without upfront costs. We give you the core tools to launch and run your storefront completely free, with zero risk.' 
},
              { icon: Heart, title: 'Vendor First', desc: 'Every feature we build starts with a simple question: Will this save the seller time? If it doesn’t add value to your day, we don’t build it.' }
            ].map((value, i) => (
              <div key={i} className="bg-white dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-500/50 transition-all duration-300 group hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-500/5">
                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 group-hover:scale-110 transition-transform duration-300 border border-emerald-100 dark:border-emerald-500/20">
                  <value.icon size={26} strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-black mb-3 text-slate-900 dark:text-white">{value.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="bg-emerald-600 dark:bg-[#064e3b] rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-emerald-500/20 dark:border dark:border-emerald-800">
          <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-black/20 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
              Ready to upgrade your hustle?
            </h2>
            <p className="text-emerald-100 dark:text-emerald-200/80 text-lg font-medium mb-10 leading-relaxed">
              Join the vendors who have stopped typing prices manually and started receiving beautifully formatted orders directly on WhatsApp.
            </p>
            <Link to="/register" className="inline-flex items-center gap-3 bg-slate-900 dark:bg-emerald-500 text-white px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black dark:hover:bg-emerald-400 transition-all hover:-translate-y-1 active:scale-95 shadow-2xl shadow-slate-900/50">
              Create Your Free Store <ArrowRight size={18} strokeWidth={3} />
            </Link>
          </div>
        </section>

      </div>
      <Footer className="pt-[100px]" />
    </div>
  );
}