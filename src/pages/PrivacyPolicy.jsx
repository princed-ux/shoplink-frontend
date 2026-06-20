import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, ShieldCheck, Lock, Eye, 
  FileText, Menu, X, LayoutDashboard, Database,
  UserCheck, Server, Mail, Trash2
} from 'lucide-react';
import shopLink_logo from "../assets/logo.png";
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Standardizing the auth key to match your recent Supabase updates
    const savedUser = localStorage.getItem('sb-xofnbiypfsjyfdwrkgam-auth-token');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed?.user) setUser(parsed.user);
      } catch (e) {}
    }
  }, []);

  const sections = [
    { id: 'promise', title: 'Our Promise', icon: UserCheck },
    { id: 'collection', title: 'Data Collection', icon: Database },
    { id: 'google-data', title: 'Google User Data', icon: ShieldCheck }, // Added Google Section
    { id: 'usage', title: 'Data Usage', icon: Eye },
    { id: 'security', title: 'Security', icon: Lock },
    { id: 'deletion', title: 'Data Deletion', icon: Trash2 },
    { id: 'cookies', title: 'Cookies & Storage', icon: FileText },
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
                Privacy <span className="text-emerald-600 italic">Policy</span>
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
                    Effective: May 2026
                </span>
                <span className="hidden sm:inline">•</span>
                <span>Transparency is our core value. Here is how we handle your data.</span>
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
                <a href="mailto:privacy@shoplinkvi.com" className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                    <Mail size={14} /> Data Privacy Officer
                </a>
              </div>
            </div>
          </aside>

          {/* RIGHT: MAIN CONTENT */}
          <main className="lg:col-span-9 space-y-16">
            
            {/* 0. OUR PROMISE */}
            <section id="promise" className="bg-emerald-600 dark:bg-emerald-500 rounded-[2.5rem] p-8 lg:p-12 border border-emerald-500 relative overflow-hidden group text-white">
                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <UserCheck size={140} className="text-white" />
                </div>
                <div className="relative z-10">
                    <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                        <ShieldCheck /> Your Data, Your Business.
                    </h2>
                    <p className="text-emerald-50 text-lg font-medium leading-relaxed max-w-2xl">
                        We are in the business of helping you sell, not selling your data. We do not sell, rent, or trade your customer lists or sales data to third-party advertisers. Ever.
                    </p>
                </div>
            </section>

            {/* 1. COLLECTION */}
            <section id="collection" className="scroll-mt-32">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-900 dark:text-white"><Database size={18} /></div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">1. Data Collection</h2>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 lg:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">
                    <p className="mb-6">
                        We practice data minimization. We only collect the specific data points required to make your store function:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            { title: 'Identity', desc: 'Shop name, Logo, WhatsApp number.' },
                            { title: 'Inventory', desc: 'Product names, prices, and images you upload.' },
                            { title: 'Security', desc: 'Encrypted passwords and recovery answers.' },
                            { title: 'Analytics', desc: 'Basic page view counts (Free for all users).' }
                        ].map((item, i) => (
                            <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <span className="block text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1">{item.title}</span>
                                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{item.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 2. GOOGLE USER DATA (NEW SECTION) */}
            <section id="google-data" className="scroll-mt-32">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-900 dark:text-white"><ShieldCheck size={18} /></div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">2. Google User Data</h2>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 lg:p-10 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-900/30 shadow-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-colors relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 dark:bg-emerald-500/10 rounded-bl-full -mr-16 -mt-16 z-0"></div>
                    <div className="relative z-10">
                      <p className="mb-4">
                          To comply with the Google API Services User Data Policy, we explicitly disclose how our application interacts with your Google account when you choose to use our "Continue with Google" feature:
                      </p>
                      <ul className="space-y-4">
                          <li>
                            <strong className="text-slate-900 dark:text-white">Data Accessed:</strong> We request access to your basic Google profile information, specifically your email address, name, and profile picture.
                          </li>
                          <li>
                            <strong className="text-slate-900 dark:text-white">Data Usage:</strong> This data is strictly used to authenticate you securely without a password, provision your ShopLink store account, and set up your initial vendor profile.
                          </li>
                          <li>
                            <strong className="text-slate-900 dark:text-white">Data Storage:</strong> Your Google email and profile information are securely stored in our Supabase database using industry-standard encryption. We do not have access to, nor do we store, your Google password.
                          </li>
                          <li>
                            <strong className="text-slate-900 dark:text-white">Data Sharing:</strong> We do not share, transfer, or sell your Google user data to any third-party services, advertisers, or data brokers.
                          </li>
                      </ul>
                    </div>
                </div>
            </section>

            {/* 3. USAGE */}
            <section id="usage" className="scroll-mt-32">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-900 dark:text-white"><Eye size={18} /></div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">3. How We Use Other Data</h2>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 lg:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">
                    <ul className="space-y-4">
                        <li className="flex gap-4">
                            <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">1</span>
                            <span>To generate your unique <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">shop.vi/name</span> storefront URL.</span>
                        </li>
                        <li className="flex gap-4">
                            <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">2</span>
                            <span>To format customer orders into clean WhatsApp messages.</span>
                        </li>
                        <li className="flex gap-4">
                            <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">3</span>
                            <span>To prevent fraud and ensure platform stability.</span>
                        </li>
                    </ul>
                </div>
            </section>

            {/* 4. SECURITY */}
            <section id="security" className="scroll-mt-32">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-900 dark:text-white"><Server size={18} /></div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">4. Infrastructure Security</h2>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 lg:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">
                    <p className="mb-4">
                        Your data is hosted on secure, enterprise-grade cloud infrastructure (Supabase & Google Cloud).
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700">SSL Encryption (HTTPS)</span>
                        <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700">Bcrypt Password Hashing</span>
                        <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700">Daily Database Backups</span>
                    </div>
                </div>
            </section>

            {/* 5. DATA DELETION */}
            <section id="deletion" className="scroll-mt-32">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-900 dark:text-white"><Trash2 size={18} /></div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">5. Your Right to Delete</h2>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 lg:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">
                    <p className="mb-4">
                        You have complete control over your data. If you decide to leave ShopLink, you can permanently delete your account and all associated data directly from your dashboard.
                    </p>
                    <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-2xl border border-red-100 dark:border-red-900/30 text-sm font-medium">
                        <strong>How to delete your data:</strong> Log into your dashboard, navigate to <em>Account Settings</em>, scroll down to the <em>Danger Zone</em>, and click <strong>Delete Account</strong>. This action is instantaneous and irreversible.
                    </div>
                </div>
            </section>

            {/* 6. COOKIES & STORAGE */}
            <section id="cookies" className="scroll-mt-32">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-900 dark:text-white"><FileText size={18} /></div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">6. Cookies & Local Storage</h2>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 lg:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">
                    <p>
                        We use minimal local storage on your device strictly for functional purposes. We do not use third-party tracking cookies.
                    </p>
                    <ul className="list-disc list-inside mt-4 space-y-2 ml-4">
                        <li><strong>Authentication:</strong> We store a secure token to keep you logged into your dashboard.</li>
                        <li><strong>Preferences:</strong> We store your chosen theme (Light/Dark/System) locally.</li>
                        <li><strong>Shopping Carts:</strong> We use local storage so your customers don't lose their cart items if they accidentally refresh the page.</li>
                    </ul>
                </div>
            </section>

          </main>
        </div>

        {/* FOOTER CTA */}
        <div className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-slate-400 dark:text-slate-500 font-medium text-sm mb-6">Concerns about your privacy?</p>
            <a href="mailto:privacy@shoplinkvi.com" className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest hover:underline">
                <Mail size={16} /> Contact Privacy Team
            </a>
        </div>
      </div>
      <Footer className="pt-[100px]" />
    </div>
  );
}