import { useState, useEffect, useMemo } from 'react';
import {
  Eye, TrendingUp, ShoppingBag, RotateCw, Wallet,
  MousePointerClick, Lock, Zap, Star, Target, Calendar
} from 'lucide-react';
import { supabase }            from '../supabaseClient';
import { toast }               from 'react-hot-toast';
import { hasPlan, getCurrencySymbol } from '../data/plans';
import { getCurrency }         from '../data/countries';
import { useOutletContext }     from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from 'recharts';

// ─── Custom tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, isCurrency, symbol = '₦' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl shadow-xl">
      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="font-black text-slate-900 dark:text-white text-lg">
        {isCurrency ? symbol : ''}{Number(payload[0].value).toLocaleString()}
      </p>
    </div>
  );
};

// ─── Date helpers ─────────────────────────────────────────────────────────────
function generateLastNDays(n) {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      date:      d.toISOString().split('T')[0],
      shortName: n <= 7
        ? d.toLocaleDateString('en-US', { weekday: 'short' })
        : `${d.getDate()}/${d.getMonth() + 1}`,
    });
  }
  return days;
}

function generateWeekBuckets(n) {
  const buckets = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const end = new Date(now);
    end.setDate(end.getDate() - i * 7);
    end.setHours(23, 59, 59, 999);
    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    buckets.push({
      start,
      end,
      name: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    });
  }
  return buckets;
}

function generateMonthBuckets(n) {
  const buckets = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      year:  d.getFullYear(),
      month: d.getMonth(),
      name:  d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    });
  }
  return buckets;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Analytics({ user }) {
  const { openUpgradeModal } = useOutletContext() || {};
  const [refreshing, setRefreshing] = useState(false);
  const [loading,    setLoading]    = useState(true);

  const isPro     = hasPlan(user?.vendor, 'pro');
  const isPremium = hasPlan(user?.vendor, 'premium');

  const analyticsCurrency = getCurrency(user?.vendor?.country || 'NG');
  const sym               = getCurrencySymbol(analyticsCurrency);

  const daysBack = isPremium ? 90 : isPro ? 30 : 7;

  const [stats,       setStats]       = useState({ views: 0, totalRevenue: 0, totalOrders: 0, fulfilledOrders: 0 });
  const [chartData,   setChartData]   = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [allOrders,   setAllOrders]   = useState([]);

  useEffect(() => {
    if (user?.vendor?.id) fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vendorRes, ordersRes, productsRes] = await Promise.all([
        supabase.from('vendors').select('views').eq('id', user.vendor.id).single(),
        supabase.from('orders').select('created_at, total, status').eq('vendor_id', user.vendor.id),
        supabase.from('products').select('id, name, price, image_url, views')
          .eq('vendor_id', user.vendor.id).order('views', { ascending: false }).limit(5),
      ]);

      const views    = vendorRes.data?.views || 0;
      const orders   = ordersRes.data   || [];
      const products = productsRes.data || [];

      const fulfilled     = orders.filter(o => o.status === 'fulfilled');
      const totalRevenue  = fulfilled.reduce((s, o) => s + (Number(o.total) || 0), 0);

      setStats({
        views,
        totalRevenue,
        totalOrders:     orders.length,
        fulfilledOrders: fulfilled.length,
      });
      setTopProducts(products);
      setAllOrders(orders);

      // ── Filter orders to the relevant date window ──────────────────────────
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - daysBack);
      const window = orders.filter(o => new Date(o.created_at) >= cutoff);

      if (isPremium) {
        // 90-day view → group by week (13 buckets)
        const weeks = generateWeekBuckets(13);
        setChartData(weeks.map(b => {
          const wo = window.filter(o => { const d = new Date(o.created_at); return d >= b.start && d <= b.end; });
          return {
            name:    b.name,
            revenue: wo.filter(o => o.status === 'fulfilled').reduce((s, o) => s + (Number(o.total) || 0), 0),
            orders:  wo.length,
          };
        }));

        // Monthly trend (6 months — uses ALL orders, not just 90-day window)
        const months = generateMonthBuckets(6);
        setMonthlyData(months.map(b => {
          const mo = orders.filter(o => {
            const d = new Date(o.created_at);
            return d.getFullYear() === b.year && d.getMonth() === b.month;
          });
          return {
            name:    b.name,
            revenue: mo.filter(o => o.status === 'fulfilled').reduce((s, o) => s + (Number(o.total) || 0), 0),
            orders:  mo.length,
          };
        }));
      } else {
        // 7 or 30-day view → daily buckets
        const days = generateLastNDays(daysBack);
        setChartData(days.map(b => {
          const do_ = window.filter(o => new Date(o.created_at).toISOString().split('T')[0] === b.date);
          return {
            name:    b.shortName,
            revenue: do_.filter(o => o.status === 'fulfilled').reduce((s, o) => s + (Number(o.total) || 0), 0),
            orders:  do_.length,
          };
        }));
      }
    } catch (err) {
      console.error('Analytics error:', err);
      toast.error('Failed to load analytics data.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setTimeout(() => setRefreshing(false), 600);
    toast.success('Analytics updated!');
  };

  // ── Premium computed insights ─────────────────────────────────────────────
  const premiumInsights = useMemo(() => {
    if (!isPremium || allOrders.length === 0) return null;
    const fulfilled = allOrders.filter(o => o.status === 'fulfilled');

    // Average order value
    const avg = fulfilled.length > 0
      ? fulfilled.reduce((s, o) => s + (Number(o.total) || 0), 0) / fulfilled.length
      : 0;

    // Best sales day (by total revenue)
    const dayTotals = [0,0,0,0,0,0,0];
    fulfilled.forEach(o => { dayTotals[new Date(o.created_at).getDay()] += Number(o.total) || 0; });
    const bestIdx  = dayTotals.indexOf(Math.max(...dayTotals));
    const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

    // 30-day revenue
    const cutoff30 = new Date(); cutoff30.setDate(cutoff30.getDate() - 30);
    const rev30 = fulfilled
      .filter(o => new Date(o.created_at) >= cutoff30)
      .reduce((s, o) => s + (Number(o.total) || 0), 0);

    // Fulfillment rate
    const rate = allOrders.length > 0 ? Math.round((fulfilled.length / allOrders.length) * 100) : 0;

    return { avg, bestDay: dayNames[bestIdx] || 'N/A', rev30, rate };
  }, [allOrders, isPremium]);

  // ── Pro computed insights ─────────────────────────────────────────────────
  const proInsights = useMemo(() => {
    if (!isPro || allOrders.length === 0) return null;
    const fulfilled = allOrders.filter(o => o.status === 'fulfilled');
    const dayTotals = [0,0,0,0,0,0,0];
    fulfilled.forEach(o => { dayTotals[new Date(o.created_at).getDay()] += Number(o.total) || 0; });
    const bestIdx  = dayTotals.indexOf(Math.max(...dayTotals));
    const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const rate     = allOrders.length > 0 ? Math.round((fulfilled.length / allOrders.length) * 100) : 0;
    return { bestDay: dayNames[bestIdx] || '—', rate };
  }, [allOrders, isPro]);

  // ── Misc ──────────────────────────────────────────────────────────────────
  const conversionRate = stats.views > 0 ? ((stats.totalOrders / stats.views) * 100).toFixed(1) : 0;

  const chartLabel = isPremium ? 'Past 90 days (weekly)' : isPro ? 'Past 30 days' : 'Past 7 days';
  const xInterval  = isPremium ? 2 : isPro ? 4 : 0;

  const planChip = isPremium
    ? { icon: Star,  text: '90-day (Premium)', cls: 'bg-amber-50  dark:bg-amber-500/10  border-amber-100  dark:border-amber-500/20  text-amber-700  dark:text-amber-400'  }
    : isPro
      ? { icon: Zap,   text: '30-day (Pro)',     cls: 'bg-purple-50 dark:bg-purple-500/10 border-purple-100 dark:border-purple-500/20 text-purple-700 dark:text-purple-400' }
      : null;

  const TOP_METRICS = [
    { label: 'Total Revenue',    value: `${sym}${stats.totalRevenue.toLocaleString()}`, icon: Wallet,          color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-100 dark:border-emerald-500/20' },
    { label: 'Orders Received',  value: stats.totalOrders.toLocaleString(),             icon: ShoppingBag,     color: 'text-blue-600    dark:text-blue-400',    bg: 'bg-blue-50    dark:bg-blue-500/10',    border: 'border-blue-100    dark:border-blue-500/20'    },
    { label: 'Storefront Views', value: stats.views.toLocaleString(),                  icon: Eye,             color: 'text-purple-600  dark:text-purple-400',  bg: 'bg-purple-50  dark:bg-purple-500/10',  border: 'border-purple-100  dark:border-purple-500/20'  },
    { label: 'Conversion Rate',  value: `${conversionRate}%`,                          icon: TrendingUp,      color: 'text-amber-600   dark:text-amber-400',   bg: 'bg-amber-50   dark:bg-amber-500/10',   border: 'border-amber-100   dark:border-amber-500/20'   },
  ];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto pb-20 pt-6 space-y-8 transition-colors duration-300">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tighter transition-colors">Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-2 transition-colors">
            Track revenue, orders, and product performance.
          </p>
        </div>
        <button onClick={handleRefresh} disabled={refreshing || loading}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 shadow-sm">
          <RotateCw size={14} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Syncing...' : 'Refresh Data'}
        </button>
      </div>

      {/* TOP METRICS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {TOP_METRICS.map((s, i) => (
          <div key={i} className={`bg-white dark:bg-slate-900 rounded-[2rem] p-6 border ${s.border} shadow-sm transition-all duration-300 hover:-translate-y-1`}>
            <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center mb-5`}>
              <s.icon size={22} className={s.color} />
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-1">
              {loading ? '...' : s.value}
            </p>
            <p className="font-black text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-widest">{s.label}</p>
          </div>
        ))}
      </div>

      {/* CHARTS ROW */}
      <div className="grid lg:grid-cols-3 gap-8">

        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-6 lg:p-8 transition-colors">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-xl transition-colors">Revenue Overview</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 transition-colors">{chartLabel} performance</p>
            </div>
            <div className="flex items-center gap-2">
              {!isPro && (
                <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 px-3 py-1.5 rounded-xl">
                  <Lock size={11} className="text-amber-600 dark:text-amber-400" />
                  <span className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest">7 days · </span>
                  <button onClick={() => openUpgradeModal?.()} className="text-[10px] font-black text-amber-600 dark:text-amber-400 underline hover:no-underline uppercase tracking-widest">Upgrade</button>
                </div>
              )}
              {planChip && (
                <div className={`flex items-center gap-1.5 border px-3 py-1.5 rounded-xl ${planChip.cls}`}>
                  <planChip.icon size={11} className="shrink-0" fill="currentColor" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{planChip.text}</span>
                </div>
              )}
              <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Live</span>
              </div>
            </div>
          </div>

          <div style={{ width: '100%', height: 300 }}>
            {loading ? (
              <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold animate-pulse">Loading Chart...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
                  <XAxis
                    dataKey="name" axisLine={false} tickLine={false}
                    interval={xInterval}
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false} tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                    tickFormatter={v => `${sym}${v >= 1000 ? (v/1000).toFixed(0) + 'k' : v}`}
                  />
                  <Tooltip content={<CustomTooltip isCurrency symbol={sym} />} cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={4}
                    fillOpacity={1} fill="url(#colorRevenue)"
                    activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Product Clicks */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-6 lg:p-8 flex flex-col transition-colors">
          <div className="mb-8">
            <h3 className="font-black text-slate-900 dark:text-white text-xl transition-colors">Product Clicks</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 transition-colors">Most viewed items</p>
          </div>
          <div className="flex-1 flex flex-col justify-between">
            {loading ? (
              <div className="text-center py-10 text-slate-400 font-bold animate-pulse">Loading Products...</div>
            ) : topProducts.length === 0 ? (
              <div className="text-center py-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
                  <MousePointerClick size={24} className="text-slate-300 dark:text-slate-600" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">No clicks yet.</p>
                <p className="text-xs text-slate-400 mt-1">Share your store to get views!</p>
              </div>
            ) : (
              <>
                <div style={{ width: '100%', height: 120 }} className="mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topProducts} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <Tooltip content={<CustomTooltip isCurrency={false} />} cursor={{ fill: 'transparent' }} />
                      <Bar dataKey="views" radius={[4, 4, 4, 4]}>
                        {topProducts.map((_, idx) => (
                          <Cell key={idx} fill={idx === 0 ? '#3b82f6' : '#cbd5e1'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  {topProducts.map((p, i) => (
                    <div key={p.id} className="flex items-center gap-4 group">
                      <p className="font-black text-slate-300 dark:text-slate-600 text-sm w-4">{i + 1}</p>
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex-shrink-0 transition-colors">
                        {p.image_url
                          ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                          : <ShoppingBag size={16} className="m-auto mt-3 text-slate-300 dark:text-slate-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-slate-900 dark:text-white text-xs truncate transition-colors">{p.name}</p>
                        <p className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px] mt-0.5">{sym}{Number(p.price).toLocaleString()}</p>
                      </div>
                      <div className="text-right flex-shrink-0 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors">
                        <p className="font-black text-slate-700 dark:text-slate-300 text-xs">{p.views || 0}</p>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Clicks</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── PRO INSIGHT CARDS (Pro + Premium) ──────────────────────────────── */}
      {isPro && (
        <div className="grid sm:grid-cols-3 gap-5">
          {/* Best Sales Day */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-500/10 rounded-2xl flex items-center justify-center mb-4">
              <Calendar size={18} className="text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mb-1">
              {loading ? '...' : (proInsights?.bestDay || '—')}
            </p>
            <p className="font-black text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-widest">Best Sales Day</p>
          </div>

          {/* Fulfillment Rate */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4">
              <Target size={18} className="text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mb-1">
              {loading ? '...' : `${proInsights?.rate ?? 0}%`}
            </p>
            <p className="font-black text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-widest">Fulfillment Rate</p>
          </div>

          {/* 30-Day Revenue — locked for Pro, shown for Premium */}
          <div className={`rounded-[2rem] p-6 border shadow-sm relative overflow-hidden transition-colors ${
            isPremium
              ? 'bg-gradient-to-br from-amber-50 to-amber-100/40 dark:from-amber-500/10 dark:to-amber-500/5 border-amber-100 dark:border-amber-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
          }`}>
            {!isPremium && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/75 dark:bg-slate-900/75 backdrop-blur-[2px] z-10 rounded-[2rem]">
                <Lock size={16} className="text-amber-500 mb-1.5" />
                <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Premium only</p>
                <button onClick={() => openUpgradeModal?.()}
                  className="mt-2 text-[10px] font-black text-amber-600 underline hover:no-underline">Upgrade</button>
              </div>
            )}
            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-500/10 rounded-2xl flex items-center justify-center mb-4">
              <TrendingUp size={18} className="text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mb-1">
              {loading ? '...' : isPremium && premiumInsights ? `${sym}${Math.round(premiumInsights.rev30).toLocaleString()}` : `${sym}—`}
            </p>
            <p className="font-black text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-widest">30-Day Revenue</p>
          </div>
        </div>
      )}

      {/* ── PREMIUM ANALYTICS SECTION ──────────────────────────────────────── */}
      {isPremium && premiumInsights && !loading && (
        <>
          {/* Premium Insight Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'Avg Order Value', value: `${sym}${Math.round(premiumInsights.avg).toLocaleString()}`, color: 'from-amber-50   to-amber-100/50   dark:from-amber-500/10   dark:to-amber-500/5   border-amber-100   dark:border-amber-500/20   text-amber-600   dark:text-amber-400'   },
              { label: 'Best Sales Day',  value: premiumInsights.bestDay,                                    color: 'from-emerald-50 to-emerald-100/50 dark:from-emerald-500/10 dark:to-emerald-500/5 border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400' },
              { label: 'Fulfillment Rate',value: `${premiumInsights.rate}%`,                                 color: 'from-blue-50    to-blue-100/50    dark:from-blue-500/10    dark:to-blue-500/5    border-blue-100    dark:border-blue-500/20    text-blue-600    dark:text-blue-400'    },
              { label: '30-Day Revenue',  value: `${sym}${Math.round(premiumInsights.rev30).toLocaleString()}`, color: 'from-purple-50  to-purple-100/50  dark:from-purple-500/10  dark:to-purple-500/5  border-purple-100  dark:border-purple-500/20  text-purple-600  dark:text-purple-400'  },
            ].map((item, i) => (
              <div key={i} className={`bg-gradient-to-br ${item.color} rounded-[2rem] p-6 border shadow-sm`}>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-3 ${item.color.split(' ').find(c => c.startsWith('text-'))}`}>{item.label}</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Monthly Revenue Trend */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-6 lg:p-8 transition-colors">
            <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-xl flex items-center gap-2 transition-colors">
                  Monthly Revenue Trend
                  <span className="text-[10px] bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-black uppercase tracking-widest px-2 py-1 rounded-lg">Premium</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 transition-colors">Revenue from fulfilled orders — last 6 months</p>
              </div>
            </div>
            <div style={{ width: '100%', height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGold" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#F5D060" />
                      <stop offset="100%" stopColor="#C9A227" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} tickFormatter={v => `${sym}${v >= 1000 ? (v/1000).toFixed(0) + 'k' : v}`} />
                  <Tooltip content={<CustomTooltip isCurrency symbol={sym} />} cursor={{ fill: 'rgba(201,162,39,0.08)' }} />
                  <Bar dataKey="revenue" fill="url(#barGold)" radius={[8, 8, 4, 4]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* ── PRO TEASER (free users) ─────────────────────────────────────────── */}
      {!isPro && (
        <div className="rounded-[2.5rem] border-2 border-dashed border-amber-200 dark:border-amber-500/30 bg-amber-50/60 dark:bg-amber-500/5 p-8 flex flex-col items-center text-center gap-5">
          <div className="w-14 h-14 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center">
            <Zap size={28} fill="currentColor" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 dark:text-white text-lg mb-1">Advanced Analytics</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">
              Best sales day, fulfillment rate, and 30-day revenue trends — all unlocked on Pro.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 w-full max-w-lg opacity-50 pointer-events-none select-none">
            {['Best Sales Day', 'Fulfillment Rate', '30-Day Revenue'].map((label, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{label}</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  {i === 0 ? 'Friday' : i === 1 ? '84%' : `${sym}58k`}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={() => openUpgradeModal?.()}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg"
          >
            <Zap size={13} fill="currentColor" /> Upgrade to Pro
          </button>
        </div>
      )}

      {/* ── PREMIUM TEASER (Pro users, not yet Premium) ─────────────────────── */}
      {isPro && !isPremium && (
        <div className="rounded-[2.5rem] border-2 border-dashed border-amber-300 dark:border-amber-500/40 bg-gradient-to-br from-amber-50/60 to-orange-50/40 dark:from-amber-500/5 dark:to-orange-500/5 p-8 flex flex-col items-center text-center gap-5">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-300 to-amber-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
            <Star size={26} fill="currentColor" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 dark:text-white text-lg mb-1">Premium Intelligence</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">
              90-day history, monthly revenue chart, avg order value, and deep store insights. Premium only.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 w-full max-w-lg opacity-50 pointer-events-none select-none">
            {['Avg Order Value', 'Monthly Trend', 'Revenue by Month'].map((label, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{label}</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  {i === 0 ? `${sym}4,200` : i === 1 ? '↑ 23%' : `${sym}120k`}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={() => openUpgradeModal?.()}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg"
          >
            <Star size={13} fill="currentColor" /> Upgrade to Premium
          </button>
        </div>
      )}

    </div>
  );
}
