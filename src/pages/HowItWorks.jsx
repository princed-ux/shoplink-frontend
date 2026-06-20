import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Store, PackagePlus, MessageCircle, Zap, CheckCircle2, ShoppingCart, Image as ImageIcon, Smartphone } from 'lucide-react';
import Footer from '../components/Footer';

export default function HowItWorks() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const steps = [
    {
      badge: "Step 1",
      title: "Claim your storefront in 60 seconds",
      description: "No coding, no complex setups. Just enter your business name, phone number, and boom—your beautiful digital storefront is live and ready for the world.",
      icon: Store,
      features: ["Custom shoplink.vi/yourname URL", "Optimized for mobile viewing", "Zero hosting fees"],
      visual: (
        <div className="w-full h-[400px] bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          {/* Abstract Phone Mockup */}
          <div className="relative w-64 h-[450px] bg-white dark:bg-slate-950 rounded-[3rem] border-[8px] border-slate-200 dark:border-slate-800 shadow-2xl translate-y-12 group-hover:translate-y-8 transition-transform duration-700">
            {/* Phone Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-200 dark:bg-slate-800 rounded-b-3xl z-10" />
            
            {/* UI Content */}
            <div className="p-6 pt-12 space-y-6">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl mx-auto flex items-center justify-center animate-pulse">
                <Store size={28} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-3/4 mx-auto" />
                <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded-full w-1/2 mx-auto" />
              </div>
              <div className="space-y-3 pt-4">
                <div className="h-12 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center px-4">
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full w-1/3" />
                </div>
                <div className="h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <div className="h-2 bg-white/80 rounded-full w-1/4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      badge: "Step 2",
      title: "Upload your inventory",
      description: "Snap a picture, add a price, and write a quick description. Your products are instantly organized into a clean, searchable catalog for your customers.",
      icon: PackagePlus,
      features: ["Unlimited product listings", "Easy category management", "Stock status toggles"],
      visual: (
        <div className="w-full h-[400px] bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          {/* Floating Product Cards */}
          <div className="relative w-full max-w-sm">
            {/* Card 1 (Back) */}
            <div className="absolute top-0 right-4 w-48 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg transform rotate-6 translate-x-4 opacity-60 scale-90 group-hover:rotate-12 transition-transform duration-700">
              <div className="w-full h-24 bg-slate-100 dark:bg-slate-800 rounded-xl mb-3 flex items-center justify-center">
                <ImageIcon size={24} className="text-slate-300 dark:text-slate-600" />
              </div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full w-2/3 mb-2" />
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full w-1/3" />
            </div>
            
            {/* Card 2 (Front) */}
            <div className="relative z-10 w-64 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl transform -rotate-3 -translate-x-4 group-hover:rotate-0 group-hover:translate-y-[-10px] transition-transform duration-700">
              <div className="w-full h-32 bg-blue-50 dark:bg-blue-500/10 rounded-xl mb-4 flex items-center justify-center border border-blue-100 dark:border-blue-500/20">
                <PackagePlus size={32} className="text-blue-500" />
              </div>
              <div className="h-4 bg-slate-800 dark:bg-slate-200 rounded-full w-3/4 mb-3" />
              <div className="flex justify-between items-center">
                <div className="h-5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-md w-16 flex items-center justify-center text-[10px] font-black">$45.00</div>
                <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                   <ShoppingCart size={14} className="text-slate-500 dark:text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      badge: "Step 3",
      title: "Receive formatted WhatsApp orders",
      description: "Customers browse your site, add items to their cart, and checkout. Instead of messy DMs, you receive a perfectly formatted WhatsApp message with their exact order, total price, and delivery details.",
      icon: MessageCircle,
      features: ["No more manual price calculations", "Capture delivery info upfront", "Higher conversion rates"],
      visual: (
        <div className="w-full h-[400px] bg-[#25D366]/5 rounded-[2.5rem] border border-[#25D366]/20 flex items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-[#25D366]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          {/* WhatsApp Chat Bubble Mockup */}
          <div className="relative w-full max-w-sm p-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl rounded-tr-sm p-5 shadow-2xl border border-slate-100 dark:border-slate-800 transform group-hover:scale-105 transition-transform duration-500">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/30">
                  <MessageCircle size={20} className="text-white" fill="currentColor" />
                </div>
                <div>
                  <div className="h-3 bg-slate-800 dark:bg-slate-200 rounded-full w-24 mb-1.5" />
                  <div className="h-2 bg-slate-300 dark:bg-slate-600 rounded-full w-16" />
                </div>
              </div>
              
              <div className="space-y-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#25D366]" />
                  <div className="h-2.5 bg-slate-600 dark:bg-slate-400 rounded-full w-32" />
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-800/60">
                   <div className="h-2 bg-slate-400 dark:bg-slate-500 rounded-full w-12" />
                   <div className="h-3 bg-slate-800 dark:bg-slate-200 rounded-full w-16" />
                </div>
              </div>
            </div>
            
            {/* Small decorative bubble */}
            <div className="absolute -bottom-2 -left-4 bg-[#25D366] text-white px-4 py-2 rounded-2xl rounded-bl-sm shadow-lg text-xs font-bold transform -rotate-6 group-hover:rotate-0 transition-transform duration-500">
              New Order! 🚀
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans overflow-x-hidden transition-colors duration-300 pt-32 pb-20">
      <Helmet>
        <title>How It Works — ShopLink.vi</title>
        <meta name="description" content="See how easy it is to launch your WhatsApp storefront and start receiving perfectly formatted orders." />
      </Helmet>

      {/* Ambient glow */}
      <div className="fixed top-0 left-0 right-0 h-[500px] overflow-hidden pointer-events-none z-0 flex justify-center">
        <div className="w-[800px] h-[500px] bg-blue-500/5 dark:bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* ── HERO SECTION ── */}
        <section className="text-center max-w-3xl mx-auto mb-24 animate-in slide-in-from-bottom-8 fade-in duration-700">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded-full mb-6 shadow-sm">
            <Zap size={14} className="fill-current" />
            <span className="text-[10px] font-black uppercase tracking-widest">Simple Setup</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white mb-6 leading-tight">
            From zero to selling in <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500">three simple steps.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            We've stripped away all the complex e-commerce jargon. If you know how to send a text message, you know how to use ShopLink.
          </p>
        </section>

        {/* ── STEPS SECTION ── */}
        <section className="space-y-32 mb-32">
          {steps.map((step, index) => {
            const isEven = index % 2 === 1;
            
            return (
              <div key={index} className={`flex flex-col ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20`}>
                
                {/* Text Content */}
                <div className="flex-1 space-y-6 w-full">
                  <div className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-black px-4 py-1.5 rounded-lg mb-2">
                    {step.badge}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                    {step.title}
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                    {step.description}
                  </p>
                  
                  <ul className="space-y-4 pt-4">
                    {step.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
                        <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual Area */}
                <div className="flex-1 w-full perspective-1000">
                  {step.visual}
                </div>
                
              </div>
            );
          })}
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="bg-slate-900 dark:bg-slate-900 rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl border border-slate-800">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-emerald-500/30">
              <Store size={32} />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-6">
              Stop explaining. Start selling.
            </h2>
            <p className="text-slate-400 text-lg font-medium mb-10 leading-relaxed">
              Join the smart vendors who are saving hours every day and giving their customers a professional shopping experience.
            </p>
            <Link to="/register" className="inline-flex items-center gap-3 bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-400 transition-all hover:-translate-y-1 active:scale-95 shadow-xl shadow-emerald-500/20">
              Launch Your Free Store <ArrowRight size={18} strokeWidth={3} />
            </Link>
          </div>
        </section>

      </div>
      <Footer className="pt-[100px]" />
    </div>
  );
}