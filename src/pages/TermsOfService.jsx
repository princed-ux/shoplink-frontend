import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Scale, ShieldCheck, CreditCard, 
  AlertCircle, FileText, Menu, X, LayoutDashboard,
  CheckCircle2, Ban, HelpCircle, Mail
} from 'lucide-react';
import shopLink_logo from "../assets/logo.png";
import Footer from '../components/Footer';

export default function TermsOfService() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('sb-xofnbiypfsjyfdwrkgam-auth-token');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed?.user) setUser(parsed.user);
      } catch (e) {}
    }
  }, []);

  const sections = [
    { id: 'summary', title: 'Quick Summary', icon: FileText },
    { id: 'use', title: 'Acceptable Use', icon: ShieldCheck },
    { id: 'payments', title: 'Payments & Fees', icon: CreditCard },
    { id: 'liability', title: 'Liability', icon: AlertCircle },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-200 overflow-x-hidden selection:bg-emerald-200 dark:selection:bg-emerald-500/30 transition-colors duration-300">
      
      
      {/* --- HEADER --- */}
      <div className="pt-32 pb-16 px-6 bg-white dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all font-bold text-[10px] uppercase tracking-[0.2em] mb-8 group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to Home
            </Link>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-slate-900 dark:text-white mb-6">
                Terms of <span className="text-emerald-600 italic">Service</span>
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors">
                <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
                    Last Updated: February 2026
                </span>
                <span className="hidden sm:inline">•</span>
                <span>Please read these terms carefully before using our platform.</span>
            </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* LEFT: SIDEBAR */}
          <aside className="hidden lg:block lg:col-span-3 h-fit sticky top-32">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
              <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Contents</h3>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <a 
                    key={s.id} 
                    href={`#${s.id}`} 
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all font-bold text-xs uppercase tracking-wide"
                  >
                    <s.icon size={14} /> {s.title}
                  </a>
                ))}
              </nav>
              <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800">
                <Link to="/support" className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                    <HelpCircle size={14} /> Need Clarification?
                </Link>
              </div>
            </div>
          </aside>

          {/* RIGHT: MAIN CONTENT */}
          <main className="lg:col-span-9 space-y-16">
            
            {/* 0. SUMMARY CARD */}
            <section id="summary" className="bg-emerald-50 dark:bg-emerald-500/10 rounded-[2.5rem] p-8 lg:p-12 border border-emerald-100 dark:border-emerald-500/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <Scale size={140} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="relative z-10">
                    <h2 className="text-2xl font-black text-emerald-900 dark:text-emerald-400 mb-6 flex items-center gap-3">
                        <FileText className="text-emerald-600 dark:text-emerald-400" /> TL;DR (Quick Summary)
                    </h2>
                    <ul className="space-y-4">
                        {[
                            "ShopLink provides the tools, you provide the products.",
                            "We do not hold your money. Payments happen directly between you and the customer.",
                            "Illegal items (drugs, fraud, weapons) result in instant bans.",
                            "Service is currently free; we will notify you of future billing changes."
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-emerald-800 dark:text-emerald-100 font-medium text-sm">
                                <CheckCircle2 size={18} className="shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* 1. ACCEPTABLE USE */}
            <section id="use" className="scroll-mt-32">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-900 dark:text-white transition-colors"><ShieldCheck size={18} /></div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest transition-colors">1. Acceptable Use</h2>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 lg:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">
                    <p className="mb-6">
                        By creating a store on <span className="font-bold text-slate-900 dark:text-white">ShopLink.vi</span>, you agree to operate with integrity. We act as a technology provider. We strictly prohibit the sale of:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {['Illegal Drugs', 'Weapons', 'Stolen Goods', 'Ponzi Schemes', 'Adult Content', 'Counterfeit Brands'].map((item) => (
                            <div key={item} className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-500/5 rounded-xl border border-red-100 dark:border-red-900/30 transition-colors">
                                <Ban size={16} className="text-red-500 shrink-0" />
                                <span className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wide">{item}</span>
                            </div>
                        ))}
                    </div>
                    <p className="mt-6 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        * Violation results in immediate termination without warning.
                    </p>
                </div>
            </section>

            {/* 2. PAYMENTS */}
            <section id="payments" className="scroll-mt-32">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-900 dark:text-white transition-colors"><CreditCard size={18} /></div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest transition-colors">2. Payments & Fees</h2>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 lg:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">
                    <div className="mb-8">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-2">Platform Access</h3>
                        <p className="text-sm">ShopLink is currently in a free-to-use growth phase. You can list products and manage inventory at no cost. We reserve the right to introduce premium tiers in the future.</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-2 transition-colors">Zero Transaction Fees</h3>
                        <p className="text-sm">We never charge transaction fees. All payments happen directly between you and your customer via WhatsApp (Bank Transfer, POS, or Cash).</p>
                    </div>
                </div>
            </section>

            {/* 3. LIABILITY */}
            <section id="liability" className="scroll-mt-32">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-900 dark:text-white transition-colors"><AlertCircle size={18} /></div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest transition-colors">3. Limitation of Liability</h2>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 lg:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">
                    <p className="mb-4">
                        <span className="font-bold text-slate-900 dark:text-white transition-colors">ShopLink.vi</span> is provided "as is". We are not responsible for:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-sm font-medium pl-2">
                        <li>Loss of profits due to technical downtime.</li>
                        <li>Disputes between vendors and customers.</li>
                        <li>Incorrect pricing or product info input by vendors.</li>
                        <li>Issues arising from WhatsApp service outages.</li>
                    </ul>
                </div>
            </section>

          </main>
        </div>

        {/* FOOTER CTA */}
        <div className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800 text-center transition-colors">
            <p className="text-slate-400 dark:text-slate-500 font-medium text-sm mb-6 transition-colors">Have questions about these terms?</p>
            <a href="mailto:legal@shoplinkvi.com" className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest hover:underline transition-colors">
                <Mail size={16} /> Contact Legal Team
            </a>
        </div>
      </div>
      <Footer className="pt-[100px]" />
    </div>
  );
}