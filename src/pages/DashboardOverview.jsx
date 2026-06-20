import { useState, useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import {
  Copy, ShoppingBag, ArrowRight, Globe,
  CheckCircle2, Share2, Eye, RotateCw, TrendingUp,
  ExternalLink, Package, Zap, Crown, Users
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import confetti from 'canvas-confetti';
import PaymentSuccess from '../components/PaymentSuccess';
import { SUBSCRIPTION_PLANS, hasPlan } from '../data/plans';
import { activatePlan } from '../components/UpgradeModal';

// ── Real WhatsApp SVG icon ────────────────────────────────────────────────────
const WhatsAppIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd"
      d="M16 2C8.268 2 2 8.268 2 16c0 2.444.658 4.731 1.806 6.7L2 30l7.497-1.776A13.93 13.93 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.44 11.44 0 01-5.834-1.597l-.418-.248-4.332 1.026 1.07-4.217-.272-.433A11.45 11.45 0 014.5 16C4.5 9.596 9.596 4.5 16 4.5S27.5 9.596 27.5 16 22.404 27.5 16 27.5zm6.29-8.617c-.344-.172-2.036-1.004-2.352-1.118-.316-.115-.546-.172-.776.172-.23.344-.89 1.118-1.09 1.348-.2.23-.4.258-.744.086-.344-.172-1.452-.535-2.766-1.707-1.022-.912-1.712-2.038-1.912-2.382-.2-.344-.021-.53.15-.701.155-.154.344-.402.516-.603.172-.2.23-.344.344-.573.115-.23.058-.43-.029-.603-.086-.172-.776-1.87-1.063-2.56-.28-.672-.564-.58-.776-.591l-.66-.011c-.23 0-.603.086-.918.43-.316.344-1.206 1.177-1.206 2.87s1.235 3.328 1.407 3.558c.172.23 2.43 3.71 5.888 5.203.823.355 1.465.567 1.965.726.826.263 1.578.226 2.172.137.662-.099 2.036-.832 2.323-1.635.287-.803.287-1.491.2-1.635-.086-.143-.316-.23-.66-.402z"
      fill="currentColor"
    />
  </svg>
);

// ── Platform logos ────────────────────────────────────────────────────────────
const InstagramMini = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
    <defs>
      <linearGradient id="ig-ov" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f09433"/><stop offset="50%" stopColor="#dc2743"/><stop offset="100%" stopColor="#bc1888"/>
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5.5" fill="url(#ig-ov)"/>
    <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.8" fill="none"/>
    <circle cx="17.3" cy="6.7" r="1.2" fill="white"/>
  </svg>
);

const TikTokMini = () => (
  <svg viewBox="0 0 24 24" width="14" height="14">
    <rect width="24" height="24" rx="5" fill="#010101"/>
    <path d="M13.5 3h-2v11.5a2.5 2.5 0 01-2.5 2.5 2.5 2.5 0 01-2.5-2.5 2.5 2.5 0 012.5-2.5c.24 0 .47.03.69.09V9.55a6 6 0 00-.69-.05 6 6 0 00-6 6 6 6 0 006 6 6 6 0 006-6V8.5a7.46 7.46 0 004 1.16V7.18a5.48 5.48 0 01-3.5-1.68V3z"
      fill="white"/>
  </svg>
);

const XMini = () => (
  <svg viewBox="0 0 24 24" width="14" height="14">
    <rect width="24" height="24" rx="5" fill="#000"/>
    <path d="M17.75 4h-2.5l-3.25 4.5L8.75 4H4l5.5 7.5L4 20h2.5l3.5-5 3.5 5H18l-5.75-8L17.75 4z" fill="white"/>
  </svg>
);

export default function DashboardOverview({ user }) {
  const outletContext = useOutletContext();
  const { showAnimations = true, openUpgradeModal } = outletContext || {};
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [greeting, setGreeting]       = useState('');
  const [liveViews, setLiveViews]     = useState(user?.vendor?.views || 0);
  const [refreshing, setRefreshing]   = useState(false);
  const [copied, setCopied]           = useState(false);
  const [upgradedPlan, setUpgradedPlan] = useState(null);

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening');
  }, []);

  // Detect post-payment redirect: /dashboard?upgraded=pro  OR  ?reference=xxx (Paystack callback)
  useEffect(() => {
    const upgraded = searchParams.get('upgraded');
    const reference = searchParams.get('reference') || searchParams.get('trxref');

    if (upgraded) {
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === upgraded);
      if (!plan) return;
      const fire = (ratio, opts) => confetti({ origin: { y: 1.2 }, particleCount: Math.floor(200 * ratio), ...opts });
      fire(0.25, { spread: 26, startVelocity: 55, colors: ['#10b981','#f59e0b','#3b82f6'] });
      fire(0.2,  { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1,  { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      setUpgradedPlan(plan);
      navigate('/dashboard', { replace: true });
      return;
    }

    // Handle Paystack redirect callback — Paystack may redirect here with ?reference=xxx
    if (reference) {
      const pendingRaw = sessionStorage.getItem('shoplink_pending_plan');
      if (!pendingRaw) return;
      try {
        const pending = JSON.parse(pendingRaw);
        if (!pending?.id) return;
        const plan = SUBSCRIPTION_PLANS.find(p => p.id === pending.id) || pending;
        activatePlan(plan, user).then(() => {
          setUpgradedPlan(plan);
          navigate('/dashboard', { replace: true });
        });
      } catch (e) {
        console.error('Failed to process Paystack callback:', e);
      }
    }
  }, [searchParams]);

  const fetchFreshViews = async (showToast = false) => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase
        .from('vendors').select('views').eq('id', user.vendor.id).single();
      if (error) throw error;
      setLiveViews(data.views ?? 0);
      if (showToast) toast.success('Stats refreshed!');
    } catch (e) {
      console.error('Failed to refresh stats', e);
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  const baseUrl = window.location.origin.includes('localhost')
    ? 'http://localhost:5173'
    : 'https://shoplinkvi.com';
  const storeUrl = `${baseUrl}/shop.vi/${user?.vendor?.slug}`;
  const shortUrl = `shop.vi/${user?.vendor?.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(storeUrl);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: user.vendor.shop_name, text: 'Check out my store!', url: storeUrl });
      } catch { handleCopyLink(); }
    } else {
      handleCopyLink();
    }
  };

  const uploadedCount = user?.vendor?.uploaded_count ?? 0;

  if (!user?.vendor) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">{greeting}</p>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2 flex-wrap">
            {user.vendor.shop_name}
            {user.vendor.is_admin && (
              <span className="text-[10px] font-black bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-500/20 uppercase tracking-widest">
                Admin
              </span>
            )}
            {hasPlan(user.vendor, 'premium') && (
              <span className="text-[10px] font-black bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-2.5 py-1 rounded-full border border-yellow-100 dark:border-yellow-500/20 uppercase tracking-widest flex items-center gap-1">
                <Crown size={10} fill="currentColor" /> Premium
              </span>
            )}
            {hasPlan(user.vendor, 'pro') && !hasPlan(user.vendor, 'premium') && (
              <span className="text-[10px] font-black bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full border border-blue-100 dark:border-blue-500/20 uppercase tracking-widest flex items-center gap-1">
                <Zap size={10} fill="currentColor" /> Pro
              </span>
            )}
            {!hasPlan(user.vendor, 'pro') && (
              <Link to="/pricing" className="text-[10px] font-black bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 uppercase tracking-widest hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all">
                Free · Upgrade
              </Link>
            )}
          </h1>
          <p className="text-slate-400 dark:text-slate-500 font-medium text-sm mt-1">
            Here's what's happening with your store today.
          </p>
        </div>
        <button
          onClick={handleShare}
          className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-colors flex items-center gap-2 w-fit active:scale-95"
        >
          <Share2 size={15} /> Share Store
        </button>
      </div>

      {/* ── BENTO GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

        {/* ── 1. HERO LINK CARD (full width) ── */}
        <div className="lg:col-span-3 bg-slate-900 dark:bg-slate-800 rounded-[2.5rem] p-8 lg:p-10 text-white shadow-2xl relative overflow-hidden group">
          {/* Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -mr-20 -mt-20 group-hover:bg-emerald-500/15 transition-all duration-1000 pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
            {/* Left: copy */}
            <div>
              {/* THE ANIMATED LIVE BUTTON */}
              <div className="inline-flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full mb-5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Your Store Is Live</span>
              </div>

              <h2 className="text-3xl lg:text-4xl font-black tracking-tighter mb-3 leading-[1.1]">
                Your store link.<br />
                <span className="text-emerald-400">Share it everywhere.</span>
              </h2>
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6 max-w-sm">
                Drop your <span className="text-white font-black">{shortUrl}</span> link in your social media bios, WhatsApp Status, stories, captions — anywhere your customers are.
              </p>

              {/* Platform row */}
              <div className="flex items-center gap-2 mb-6 flex-wrap">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">Works on</span>
                {[
                  { label: 'Instagram', Logo: InstagramMini },
                  { label: 'TikTok',    Logo: TikTokMini },
                  { label: 'X',         Logo: XMini },
                  { label: 'WhatsApp',  isWA: true },
                ].map((p, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-white/6 border border-white/8 px-2.5 py-1.5 rounded-xl">
                    {p.isWA
                      ? <WhatsAppIcon size={14} />
                      : <p.Logo />
                    }
                    <span className="text-[10px] font-black text-white/70">{p.label}</span>
                  </div>
                ))}
                <div className="flex items-center gap-1.5 bg-white/6 border border-white/8 px-2.5 py-1.5 rounded-xl">
                  <Globe size={12} className="text-white/50" />
                  <span className="text-[10px] font-black text-white/70">+ More</span>
                </div>
              </div>
            </div>

            {/* Right: link box + actions */}
            <div className="space-y-3">
              {/* Link display */}
              <div className="bg-black/25 dark:bg-black/40 backdrop-blur-md border border-white/10 p-2 pl-5 rounded-2xl flex items-center justify-between gap-3">
                <span className="font-mono font-bold text-emerald-400 text-sm truncate">{shortUrl}</span>
                <button
                  onClick={handleCopyLink}
                  className={`px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex-shrink-0 flex items-center gap-2 transition-all active:scale-95 shadow-lg ${
                    copied
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white hover:bg-slate-200 text-slate-900'
                  }`}
                >
                  <Copy size={12} /> {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={storeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-3.5 bg-white/8 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/14 transition-all active:scale-95"
                >
                  <ExternalLink size={13} /> Preview
                </a>
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 py-3.5 bg-emerald-500 hover:bg-emerald-600 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white transition-all active:scale-95 shadow-lg shadow-emerald-500/25"
                >
                  <Share2 size={13} /> Share
                </button>
              </div>

              {/* WhatsApp direct link */}
              <a
                href={`https://wa.me/?text=Shop%20at%20${encodeURIComponent(storeUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2.5 py-3.5 bg-[#25D366]/15 border border-[#25D366]/25 rounded-2xl text-[11px] font-black uppercase tracking-widest text-[#25D366] hover:bg-[#25D366]/25 transition-all active:scale-95 w-full"
              >
                <WhatsAppIcon size={15} /> Share via WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* ── 2. TOTAL VIEWS ── */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:shadow-slate-900 hover:shadow-blue-50 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Eye size={80} className="text-blue-500" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Eye size={15} className="text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">Store Views</p>
              </div>
              <button
                onClick={() => fetchFreshViews(true)}
                disabled={refreshing}
                className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2.5 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 transition active:scale-95 disabled:opacity-50 border border-slate-100 dark:border-slate-700"
              >
                <RotateCw size={11} className={refreshing ? 'animate-spin' : ''} />
                {refreshing ? 'Syncing' : 'Sync'}
              </button>
            </div>
            <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-1">
              {liveViews.toLocaleString()}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">All-time store visits</p>
          </div>
          <div className="mt-6 flex items-end gap-1 h-10">
            {[30, 50, 40, 70, 55, 80, 100].map((h, i) => (
              <div key={i}
                className="flex-1 rounded-t-sm transition-all duration-500 bg-blue-500"
                style={{ height: `${h}%`, opacity: 0.15 + (i * 0.12) }}
              />
            ))}
          </div>
        </div>

        {/* ── 3. INVENTORY ── */}
        <Link
          to="/dashboard/products"
          className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-emerald-50 dark:hover:shadow-slate-900 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShoppingBag size={80} className="text-emerald-500" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <ShoppingBag size={15} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">Inventory</p>
            </div>
            <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-1">
              {uploadedCount}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Products listed</p>
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs font-black text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
            Manage Products <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* ── 4. WHATSAPP ORDERS CARD ── */}
        <div className="bg-[#075E54] p-8 rounded-[2.5rem] text-white shadow-xl shadow-[#075E54]/20 relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:opacity-15 transition-opacity duration-700">
            <WhatsAppIcon size={140} />
          </div>
          <div className="relative z-10">
            <div className="w-11 h-11 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-5 border border-white/20">
              <WhatsAppIcon size={22} />
            </div>
            <h3 className="text-xl font-black mb-2 leading-tight">WhatsApp<br />Checkout</h3>
            <p className="text-[#dcf8c6]/80 text-xs font-medium leading-relaxed mb-5">
              Every order from your store is auto-formatted and sent straight to your WhatsApp — name, items, total, address.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Auto-formatted', 'Instant', 'No setup'].map((tag, i) => (
                <div key={i} className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest bg-black/15 px-2.5 py-1.5 rounded-xl border border-white/10">
                  <CheckCircle2 size={9} /> {tag}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 5. QUICK ACTIONS ── */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-5">Quick Actions</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { to: '/dashboard/products', icon: Package,   label: 'Add Product',   color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20' },
              { to: '/dashboard/share',    icon: Share2,    label: 'Share Store',   color: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20' },
              { to: '/dashboard/analytics',icon: TrendingUp,label: 'Analytics',     color: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-500/20' },
              { to: '/dashboard/settings', icon: Users,     label: 'Branding',      color: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20' },
            ].map((action, i) => (
              <Link
                key={i}
                to={action.to}
                className={`flex flex-col items-center gap-3 p-5 rounded-2xl transition-all active:scale-95 group ${action.color}`}
              >
                <div className="w-10 h-10 bg-white/60 dark:bg-white/5 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <action.icon size={18} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-center leading-tight">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── 6. STORE PERFORMANCE TEASER ── */}
        <div className="bg-slate-900 dark:bg-slate-800 p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.08)_0%,transparent_70%)] pointer-events-none" />
          <div className="relative z-10">
            <div className="w-11 h-11 bg-emerald-500/15 rounded-2xl flex items-center justify-center mb-5 border border-emerald-500/20">
              <TrendingUp size={20} className="text-emerald-400" />
            </div>
            <h3 className="text-lg font-black mb-2">Store Analytics</h3>
            <p className="text-slate-400 text-xs font-medium leading-relaxed mb-5">
              Track your store views, product performance and customer activity over time.
            </p>
            <Link
              to="/dashboard/analytics"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-emerald-500/25"
            >
              View Analytics <ArrowRight size={12} strokeWidth={3} />
            </Link>
          </div>
        </div>

      </div>

      {/* Payment success celebration */}
      {upgradedPlan && (
        <PaymentSuccess
          plan={upgradedPlan}
          onClose={() => setUpgradedPlan(null)}
        />
      )}
    </div>
  );
}