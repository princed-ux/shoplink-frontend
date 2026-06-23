import { useState, useEffect, useMemo } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, Settings, LogOut, Menu, X, Globe,
  ExternalLink, ChevronDown, User, ShieldCheck, Sparkles,
  AlertCircle, Tag, Package, Star, Gift, ToggleLeft, ToggleRight,
  BarChart3, Share2, HelpCircle, UserCog, Megaphone, Info, CheckCircle,
  CreditCard, Zap, Crown
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { supabase } from '../supabaseClient';
import shopLink_logo from '../assets/logo.png';
import ViChatWidget from '../components/ViChatWidget';
import UpgradeModal from '../components/UpgradeModal';
import { hasPlan } from '../data/plans';

// ── Falling icons background ─────────────────────────────────────────────────
const FallingBackground = () => {
  const icons = useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    Icon: [ShoppingBag, Gift, Tag, Package, Star][Math.floor(Math.random() * 5)],
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    duration: `${8 + Math.random() * 10}s`,
    size: 15 + Math.random() * 20,
  })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <style>{`
        @keyframes fall {
          0%   { transform: translateY(-100%) rotate(0deg); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
      {icons.map((item) => (
        <div key={item.id}
          className="absolute text-emerald-500/10 dark:text-emerald-500/5"
          style={{ left: item.left, top: -50, animation: `fall ${item.duration} linear infinite`, animationDelay: item.delay }}>
          <item.Icon size={item.size} />
        </div>
      ))}
    </div>
  );
};

// ── Nav config ───────────────────────────────────────────────────────────────
const NAV_MAIN = [
  { to: '/dashboard',           label: 'Dashboard',   icon: LayoutDashboard, end: true },
  { to: '/dashboard/products',  label: 'Inventory',   icon: ShoppingBag },
  { to: '/dashboard/analytics', label: 'Analytics',   icon: BarChart3 },
  { to: '/dashboard/orders',    label: 'Orders',      icon: Package },
  { to: '/dashboard/share',     label: 'Share Store', icon: Share2 },
];

const NAV_SETTINGS = [
  { to: '/dashboard/settings',  label: 'Branding',    icon: Settings },

  { to: '/dashboard/domain',    label: 'Domain',      icon: Globe },
  { to: '/dashboard/account',   label: 'Account',     icon: UserCog },
  { to: '/dashboard/billing',   label: 'Billing',     icon: CreditCard },
  { to: '/dashboard/help',      label: 'Help',        icon: HelpCircle },
];

export default function DashboardLayout({ user, setUser }) {
  const [sidebarOpen, setSidebarOpen]         = useState(false);
  const [showUserMenu, setShowUserMenu]       = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // REALTIME BROADCAST STATE
  const [activeBroadcasts, setActiveBroadcasts] = useState([]);

  const [showAnimations, setShowAnimations] = useState(() => {
    const saved = localStorage.getItem('shoplink_anim');
    return saved !== 'false';
  });

  const navigate = useNavigate();

  // ── THE MAGIC REALTIME LISTENER ──
  useEffect(() => {
    const fetchInitialBroadcasts = async () => {
      const { data } = await supabase
        .from('broadcasts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
        
      if (data) {
        // 🔥 THE FIX: ALL broadcasts obey the dismissal list now.
        const dismissed = JSON.parse(localStorage.getItem('shoplink_dismissed_broadcasts') || '[]');
        const visibleBroadcasts = data.filter(b => !dismissed.includes(b.id));
        setActiveBroadcasts(visibleBroadcasts);
      }
    };

    fetchInitialBroadcasts();

    const broadcastChannel = supabase.channel('public:broadcasts')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'broadcasts' },
        (payload) => {
          fetchInitialBroadcasts(); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(broadcastChannel);
    };
  }, []);

  const dismissBroadcast = (id) => {
    // 1. Save to Hard Drive
    const dismissed = JSON.parse(localStorage.getItem('shoplink_dismissed_broadcasts') || '[]');
    if (!dismissed.includes(id)) {
      dismissed.push(id);
      localStorage.setItem('shoplink_dismissed_broadcasts', JSON.stringify(dismissed));
    }
    // 2. Remove from Screen
    setActiveBroadcasts(prev => prev.filter(b => b.id !== id));
  };

  const toggleAnimations = () => {
    const next = !showAnimations;
    setShowAnimations(next);
    localStorage.setItem('shoplink_anim', String(next));
    toast.success(next ? 'Designs enabled' : 'Designs disabled');
  };

  const confirmLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast.success('Signed out successfully');
      navigate('/login');
    } catch {
      toast.error('Error signing out.');
    }
  };

  const shopUrl = window.location.origin.includes('localhost')
    ? `http://localhost:5173/shop.vi/${user?.vendor?.slug}`
    : `https://shoplinkvi.com/shop.vi/${user?.vendor?.slug}`;

  if (!user) return null;

  const navLinkClass = ({ isActive }) =>
    `w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.12em] transition-all duration-300 border border-transparent ${
      isActive
        ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20 shadow-sm translate-x-1'
        : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-600 dark:hover:text-slate-300'
    }`;

  // Dynamic Styles for the Premium Banner
  const getBannerStyles = (type) => {
    switch (type) {
      case 'warning':
        return { 
          wrapper: 'bg-red-50 dark:bg-gradient-to-r dark:from-red-950 dark:via-amber-950 dark:to-red-950 border-red-200 dark:border-red-500/40 text-red-900 dark:text-white', 
          iconBg: 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-red-200 dark:border-white/10', 
          glow: 'bg-red-500/20',
          textSub: 'text-red-700/80 dark:text-white/70'
        };
      case 'announcement':
        return { 
          wrapper: 'bg-emerald-50 dark:bg-gradient-to-r dark:from-emerald-950 dark:via-teal-950 dark:to-emerald-950 border-emerald-200 dark:border-emerald-500/40 text-emerald-900 dark:text-white', 
          iconBg: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-white/10', 
          glow: 'bg-emerald-500/20',
          textSub: 'text-emerald-700/80 dark:text-white/70'
        };
      case 'success':
        return { 
          wrapper: 'bg-purple-50 dark:bg-gradient-to-r dark:from-purple-950 dark:via-fuchsia-950 dark:to-purple-950 border-purple-200 dark:border-purple-500/40 text-purple-900 dark:text-white', 
          iconBg: 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-white/10', 
          glow: 'bg-purple-500/20',
          textSub: 'text-purple-700/80 dark:text-white/70'
        };
      case 'info':
      default:
        return { 
          wrapper: 'bg-blue-50 dark:bg-gradient-to-r dark:from-blue-950 dark:via-indigo-950 dark:to-blue-950 border-blue-200 dark:border-blue-500/40 text-blue-900 dark:text-white', 
          iconBg: 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-white/10', 
          glow: 'bg-blue-500/20',
          textSub: 'text-blue-700/80 dark:text-white/70'
        };
    }
  };

  const topBroadcast = activeBroadcasts[0];
  const bannerStyles = topBroadcast ? getBannerStyles(topBroadcast.type) : null;

  const giftedKey = `shoplink_gifted_seen_${user?.vendor?.id}`;
  const showGiftedBanner =
    user?.vendor?.gifted_by_admin === true &&
    user?.vendor?.plan_type &&
    user.vendor.plan_type !== 'free' &&
    !localStorage.getItem(giftedKey);

  const dismissGiftedBanner = async () => {
    localStorage.setItem(giftedKey, '1');
    await supabase.from('vendors').update({ gifted_by_admin: false }).eq('id', user.vendor.id);
    if (setUser) setUser(prev => ({ ...prev, vendor: { ...prev.vendor, gifted_by_admin: false } }));
  };

  const expiryDaysLeft = user?.vendor?.plan_expires_at && user?.vendor?.plan_type !== 'free'
    ? Math.ceil((new Date(user.vendor.plan_expires_at) - Date.now()) / 86400000)
    : null;
  const showExpiryStrip = expiryDaysLeft !== null && expiryDaysLeft > 0 && expiryDaysLeft <= 3;

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-white flex overflow-hidden transition-colors duration-300 relative">
      <Toaster position="top-right" toastOptions={{
        className: 'dark:bg-slate-800 dark:text-white dark:border dark:border-slate-700',
      }} />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-opacity" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex-shrink-0 bg-white dark:bg-slate-900/80 dark:backdrop-blur-xl border-r border-slate-100 dark:border-slate-800/80 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
        style={{ width: 280 }}
      >
        {showAnimations && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <FallingBackground />
          </div>
        )}

        <div className="h-full flex flex-col relative z-10">
          <div className="flex items-center gap-3 px-7 pt-8 pb-6 flex-shrink-0">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:rotate-12 transition-transform flex-shrink-0">
              <img src={shopLink_logo} alt="ShopLinkVi" className="w-6 h-6 object-contain brightness-0 invert" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white italic">
              ShopLink<span className="text-emerald-500 not-italic">.vi</span>
            </span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden ml-auto p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-red-500 transition active:scale-95 border border-slate-100 dark:border-slate-700"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar px-5 pb-6">
            <div className="mb-8">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.25em] mb-3 px-3">Store Management</p>
              <nav className="space-y-1.5">
                {NAV_MAIN.map((item) => (
                  <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass} onClick={() => setSidebarOpen(false)}>
                    <item.icon size={18} /> {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.25em] mb-3 px-3">Settings & Support</p>
              <nav className="space-y-1.5">
                {NAV_SETTINGS.map((item) => (
                  <NavLink key={item.to} to={item.to} className={navLinkClass} onClick={() => setSidebarOpen(false)}>
                    <item.icon size={18} /> {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>

          <div className="px-5 pb-6 pt-4 flex-shrink-0 bg-white dark:bg-transparent">
            <div className="mb-4 bg-slate-900 dark:bg-slate-950 rounded-[2rem] p-6 text-white relative overflow-hidden group border border-transparent dark:border-slate-800 shadow-xl">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Plan</p>
                    {hasPlan(user?.vendor, 'premium') ? (
                      <h3 className="font-black text-sm uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                        <Crown size={14} fill="currentColor" /> Premium
                      </h3>
                    ) : hasPlan(user?.vendor, 'pro') ? (
                      <h3 className="font-black text-sm uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <Zap size={14} fill="currentColor" /> Pro
                      </h3>
                    ) : (
                      <h3 className="font-black text-sm uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <ShieldCheck size={14} /> Free
                      </h3>
                    )}
                  </div>
                  {!hasPlan(user?.vendor, 'pro') ? (
                    <button onClick={() => setShowUpgradeModal(true)} className="bg-amber-500/20 hover:bg-amber-500/30 px-2.5 py-1 rounded-xl border border-amber-500/30 transition-colors">
                      <span className="text-[10px] font-black text-amber-400">Upgrade</span>
                    </button>
                  ) : (
                    <div className="bg-emerald-500/20 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                      <span className="text-[10px] font-black text-emerald-400">Active ✓</span>
                    </div>
                  )}
                </div>
                <div className="w-full bg-emerald-500/10 rounded-xl py-2 mb-4 text-center border border-emerald-500/20 backdrop-blur-sm">
                  <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">
                    {user?.vendor?.uploaded_count ?? 0} Products Live
                  </p>
                </div>
                <a
                  href={shopUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-white dark:bg-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-600 text-slate-900 dark:text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98] shadow-md text-center block"
                >
                  View Store →
                </a>
              </div>
            </div>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-2xl font-black text-xs uppercase tracking-widest transition-all group"
            >
              <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">

        {/* ── REALTIME BROADCAST BANNER (LIGHT/DARK SUPPORTED) ── */}
        {topBroadcast && (
          <div className={`shrink-0 border-b relative z-40 shadow-sm dark:shadow-xl overflow-hidden animate-in slide-in-from-top-4 duration-500 ${bannerStyles.wrapper}`}>
            {/* Background Glow Effect */}
            <div className={`absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 blur-[100px] pointer-events-none rounded-full ${bannerStyles.glow}`}></div>
            
            <div className="px-5 py-3.5 relative z-10 flex items-start sm:items-center justify-between gap-4 max-w-[1600px] mx-auto">
              
              <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                <div className={`p-2 rounded-xl shrink-0 border shadow-inner ${bannerStyles.iconBg}`}>
                  {topBroadcast.type === 'announcement' && <Megaphone size={18} />}
                  {topBroadcast.type === 'warning' && <AlertCircle size={18} />}
                  {topBroadcast.type === 'success' && <CheckCircle size={18} />}
                  {topBroadcast.type === 'info' && <Info size={18} />}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-black tracking-tighter truncate">{topBroadcast.title}</h4>
                  <p className={`text-xs font-medium hidden sm:block truncate pr-4 ${bannerStyles.textSub}`}>{topBroadcast.message}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 shrink-0">
                {/* Optional Details button for mobile or long text */}
                {topBroadcast.message.length > 60 && (
                  <button 
                    onClick={() => alert(topBroadcast.message)} 
                    className="text-[10px] font-black uppercase tracking-widest shrink-0 border px-3 py-1.5 rounded-lg transition-all text-slate-600 border-slate-300 bg-white/50 hover:bg-white dark:text-white/70 dark:border-white/20 dark:bg-black/20 dark:hover:bg-black/40 dark:hover:text-white"
                  >
                    Details
                  </button>
                )}
                
                {/* ── CANCEL / X BUTTON (Always Visible) ── */}
                <button 
                  onClick={() => dismissBroadcast(topBroadcast.id)}
                  className="p-1.5 rounded-lg transition-colors text-slate-400 hover:text-slate-800 hover:bg-slate-200/50 dark:text-white/50 dark:hover:text-white dark:hover:bg-white/10"
                  title="Dismiss"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Mobile version of the message (stacks underneath) */}
            <p className={`text-xs font-medium sm:hidden mt-2 px-5 pb-3 relative z-10 ${bannerStyles.textSub}`}>{topBroadcast.message}</p>
          </div>
        )}

        {/* ── GIFTED BY ADMIN BANNER ── */}
        {showGiftedBanner && (
          <div className="shrink-0 border-b border-purple-200 dark:border-purple-500/30 bg-gradient-to-r from-purple-50 to-fuchsia-50 dark:from-purple-950/80 dark:to-fuchsia-950/80 relative overflow-hidden animate-in slide-in-from-top-4 duration-500 z-40">
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-purple-400/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="px-5 py-3.5 relative z-10 flex items-center justify-between gap-4 max-w-[1600px] mx-auto">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-purple-100 dark:bg-purple-500/20 rounded-xl flex items-center justify-center border border-purple-200 dark:border-purple-500/30 flex-shrink-0">
                  <Gift size={16} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-black text-purple-900 dark:text-white tracking-tight">
                    🎁 You've been gifted a{' '}
                    <span className={user?.vendor?.plan_type === 'premium' ? 'text-amber-600 dark:text-amber-400' : 'text-purple-600 dark:text-purple-300'}>
                      {user?.vendor?.plan_type?.charAt(0).toUpperCase() + user?.vendor?.plan_type?.slice(1)}
                    </span>
                    {' '}plan by the admin!
                  </p>
                  <p className="text-[10px] font-medium text-purple-700/70 dark:text-purple-300/70 hidden sm:block">
                    Your upgraded features are now active. Enjoy!
                  </p>
                </div>
              </div>
              <button
                onClick={dismissGiftedBanner}
                className="p-1.5 rounded-lg text-purple-400 hover:text-purple-700 dark:hover:text-white hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors flex-shrink-0"
                title="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── PLAN EXPIRY STRIP (≤3 days left) ── */}
        {showExpiryStrip && (
          <div className="shrink-0 border-b border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-950/80 z-40">
            <div className="px-5 py-2.5 flex items-center justify-between gap-4 max-w-[1600px] mx-auto">
              <div className="flex items-center gap-2.5">
                <AlertCircle size={15} className="text-amber-500 flex-shrink-0" />
                <p className="text-xs font-black text-amber-700 dark:text-amber-400">
                  Your {user?.vendor?.plan_type?.charAt(0).toUpperCase() + user?.vendor?.plan_type?.slice(1)} plan expires in{' '}
                  <strong>{expiryDaysLeft} day{expiryDaysLeft !== 1 ? 's' : ''}</strong> — renew to keep your features.
                </p>
              </div>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="flex-shrink-0 text-[10px] font-black bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-1.5 rounded-xl uppercase tracking-widest transition-all active:scale-95"
              >
                Renew
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <header
          className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between px-5 lg:px-8 shrink-0 z-30 sticky top-0 relative overflow-visible transition-colors duration-300"
          style={{ height: 72 }}
        >
          {showAnimations && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <FallingBackground />
            </div>
          )}

          <div className="flex items-center gap-4 relative z-10">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm active:scale-95 transition-all"
            >
              <Menu size={18} />
            </button>
            <h1 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] hidden sm:block">
              Store Manager
            </h1>
          </div>

          <div className="flex items-center gap-5 relative z-10">
            <a
              href={shopUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400 hover:text-white bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-600 dark:hover:bg-emerald-500 px-5 py-2.5 rounded-full border border-emerald-200 dark:border-emerald-500/20 transition-all duration-300 shadow-sm"
            >
              <ExternalLink size={14} /> My Store
            </a>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 pl-5 border-l border-slate-200 dark:border-slate-800 group outline-none"
              >
                <div className="text-right hidden md:block">
                  <div className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                    {user?.vendor?.shop_name || 'Loading...'}
                  </div>
                  <div className="flex items-center gap-1 justify-end text-[9px] font-black uppercase tracking-widest mt-0.5">
                    {hasPlan(user?.vendor, 'premium')
                      ? <><Crown size={10} className="text-purple-500" fill="currentColor" /><span className="text-purple-500">Premium</span></>
                      : hasPlan(user?.vendor, 'pro')
                      ? <><Zap size={10} className="text-amber-500" fill="currentColor" /><span className="text-amber-500">Pro</span></>
                      : <><ShieldCheck size={10} className="text-emerald-500" /><span className="text-emerald-500">Free</span></>
                    }
                  </div>
                </div>
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full border-2 border-white dark:border-slate-700 shadow-md overflow-hidden relative group-hover:scale-105 transition-transform">
                  {user?.vendor?.logo_url
                    ? <img src={user?.vendor?.logo_url} className="w-full h-full object-cover" alt="logo" />
                    : <User className="w-full h-full p-2 text-slate-400 dark:text-slate-500" />
                  }
                </div>
                <ChevronDown size={14} className={`text-slate-400 dark:text-slate-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 top-full mt-4 w-60 bg-white dark:bg-slate-900 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-slate-800 p-2.5 z-50 animate-in fade-in slide-in-from-top-2">
                    
                    <button
                      onClick={toggleAnimations}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800/50 mb-1"
                    >
                      <div className="flex items-center gap-2.5">
                        <Sparkles size={14} className="text-emerald-500" /> UI Designs
                      </div>
                      {showAnimations
                        ? <ToggleRight size={24} className="text-emerald-500" />
                        : <ToggleLeft size={24} className="text-slate-300 dark:text-slate-600" />
                      }
                    </button>

                    <button
                      onClick={() => { navigate('/dashboard/account'); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-left text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <UserCog size={14} /> Account Details
                    </button>
                    <button
                      onClick={() => { navigate('/dashboard/settings'); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-left text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Settings size={14} /> Store Branding
                    </button>
                    
                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-2" />

                    <button
                      onClick={() => { setShowLogoutModal(true); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-left text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-8 scroll-smooth bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
          <Outlet context={{ showAnimations, activeAccessLevel: 'Free', openUpgradeModal: () => setShowUpgradeModal(true) }} />
        </main>
      </div>

      {/* ── LOGOUT MODAL ── */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 max-w-sm w-full shadow-2xl text-center relative overflow-hidden animate-in zoom-in-95 duration-300 border border-transparent dark:border-slate-800">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500" />
            <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-red-100 dark:border-red-500/20">
              <AlertCircle size={32} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">Sign Out?</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 text-sm px-2">
              You'll need your email and password to sign back in.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={confirmLogout}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-red-500/20 transition active:scale-95"
              >
                Sign Out Now
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Stay Logged In
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.3);
          border-radius: 20px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(71, 85, 105, 0.5);
        }
      `}</style>
      <ViChatWidget />

      {/* ── UPGRADE MODAL ── */}
      <UpgradeModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        user={user}
        highlight="pro"
      />
    </div>
  );
}