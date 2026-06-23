import { useState, useEffect } from "react";
import {
  CreditCard, TrendingUp, Users, Zap, Crown,
  ShieldCheck, Download, Loader2, ArrowUp, DollarSign, BarChart3
} from "lucide-react";
import { supabase } from "../../supabaseClient";

export default function AdminBilling() {
  const [loading, setLoading] = useState(true);
  const [billing, setBilling] = useState({ total: 0, free: 0, pro: 0, premium: 0, ng: 0, usd: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: vendors } = await supabase.from("vendors").select("plan_type, country, gifted_by_admin");
        if (!vendors) return;
        const total   = vendors.length;
        const free    = vendors.filter(v => !v.plan_type || v.plan_type === 'free').length;
        const paid    = vendors.filter(v => !v.gifted_by_admin);
        const pro     = paid.filter(v => v.plan_type === 'pro').length;
        const premium = paid.filter(v => v.plan_type === 'premium').length;
        const ng      = vendors.filter(v => v.country === 'NG').length;
        const usd     = vendors.filter(v => v.country !== 'NG').length;
        setBilling({ total, free, pro, premium, ng, usd });
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const ngPro      = billing.total > 0 ? 12000 * Math.round(billing.pro     * (billing.ng / billing.total)) : 0;
  const ngPremium  = billing.total > 0 ? 30000 * Math.round(billing.premium * (billing.ng / billing.total)) : 0;
  const usdPro     = billing.total > 0 ? 15    * Math.round(billing.pro     * (billing.usd / billing.total)) : 0;
  const usdPremium = billing.total > 0 ? 40    * Math.round(billing.premium * (billing.usd / billing.total)) : 0;
  const ngMRR      = ngPro + ngPremium;
  const usdMRR     = usdPro + usdPremium;
  const activeSubs = billing.pro + billing.premium;
  const upgradeRate = billing.total > 0 ? ((activeSubs / billing.total) * 100).toFixed(1) : '0.0';

  const planRows = [
    {
      label:    'Free',
      count:    billing.free,
      icon:     ShieldCheck,
      color:    'text-slate-400',
      bg:       'bg-slate-500/10',
      border:   'border-slate-500/20',
      ngRev:    0,
      usdRev:   0,
    },
    {
      label:    'Pro',
      count:    billing.pro,
      icon:     Zap,
      color:    'text-amber-400',
      bg:       'bg-amber-500/10',
      border:   'border-amber-500/20',
      ngRev:    ngPro,
      usdRev:   usdPro,
    },
    {
      label:    'Premium',
      count:    billing.premium,
      icon:     Crown,
      color:    'text-purple-400',
      bg:       'bg-purple-500/10',
      border:   'border-purple-500/20',
      ngRev:    ngPremium,
      usdRev:   usdPremium,
    },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <Loader2 size={24} className="animate-spin text-emerald-500" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full pb-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-slate-900/50 p-6 rounded-[2rem] border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 px-8 py-1.5 bg-emerald-500/10 text-emerald-500 border-b border-l border-emerald-500/20 rounded-bl-3xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Zap size={12} /> Live · Estimates
        </div>
        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
            <CreditCard className="text-emerald-500" /> Revenue Engine
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Financial overview and subscription breakdown.</p>
        </div>
        <button disabled className="px-6 py-3 bg-slate-800 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 opacity-50 cursor-not-allowed border border-slate-700">
          <Download size={14} /> Export Report
        </button>
      </div>

      {/* Top metric row */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* Total Vendors */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-6 shadow-xl flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-700/50 border border-slate-700 flex items-center justify-center">
            <Users size={18} className="text-slate-300" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Total Stores</p>
            <p className="text-4xl font-black text-white tracking-tighter">{billing.total}</p>
          </div>
          <p className="text-[10px] text-slate-600 font-medium">{billing.ng} NG · {billing.usd} Intl</p>
        </div>

        {/* Active Subscriptions */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-6 shadow-xl flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <TrendingUp size={18} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Active Subs</p>
            <p className="text-4xl font-black text-white tracking-tighter">{activeSubs}</p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-400">
            <ArrowUp size={11} /> {upgradeRate}% upgrade rate
          </div>
          <p className="text-[9px] text-slate-600 font-medium">Excludes gifted plans</p>
        </div>

        {/* NGN MRR */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-6 shadow-xl flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <BarChart3 size={18} className="text-blue-400" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Est. NGN MRR</p>
            <p className="text-3xl font-black text-white tracking-tighter">₦{ngMRR.toLocaleString()}</p>
          </div>
          <p className="text-[10px] text-slate-600 font-medium">Pro ₦{ngPro.toLocaleString()} · Premium ₦{ngPremium.toLocaleString()}</p>
        </div>

        {/* USD MRR */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-6 shadow-xl flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <DollarSign size={18} className="text-amber-400" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Est. USD MRR</p>
            <p className="text-3xl font-black text-white tracking-tighter">${usdMRR.toLocaleString()}</p>
          </div>
          <p className="text-[10px] text-slate-600 font-medium">Pro ${usdPro.toLocaleString()} · Premium ${usdPremium.toLocaleString()}</p>
        </div>
      </div>

      {/* Plan Distribution */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 bg-slate-950/30 flex items-center justify-between">
          <h2 className="text-white font-black text-lg tracking-tight flex items-center gap-2">
            <BarChart3 size={18} className="text-emerald-500" /> Plan Distribution
          </h2>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{billing.total} total stores</span>
        </div>

        {/* Progress bars */}
        <div className="p-6 space-y-4 border-b border-slate-800">
          {planRows.map(row => {
            const pct = billing.total > 0 ? ((row.count / billing.total) * 100).toFixed(1) : 0;
            const Icon = row.icon;
            return (
              <div key={row.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-lg ${row.bg} border ${row.border} flex items-center justify-center`}>
                      <Icon size={11} fill="currentColor" className={row.color} />
                    </div>
                    <span className={`text-xs font-black uppercase tracking-widest ${row.color}`}>{row.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-500">{pct}%</span>
                    <span className="text-sm font-black text-white w-8 text-right">{row.count}</span>
                  </div>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-700 ${
                      row.label === 'Premium' ? 'bg-purple-500' : row.label === 'Pro' ? 'bg-amber-500' : 'bg-slate-600'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Revenue contribution table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[500px]">
            <thead className="bg-slate-950/30 border-b border-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Users</th>
                <th className="px-6 py-4">% of Total</th>
                <th className="px-6 py-4">Est. NGN/mo</th>
                <th className="px-6 py-4">Est. USD/mo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {planRows.map(row => {
                const pct = billing.total > 0 ? ((row.count / billing.total) * 100).toFixed(1) : '0.0';
                const Icon = row.icon;
                return (
                  <tr key={row.label} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-xl ${row.bg} border ${row.border} flex items-center justify-center`}>
                          <Icon size={12} fill="currentColor" className={row.color} />
                        </div>
                        <span className={`text-xs font-black uppercase tracking-widest ${row.color}`}>{row.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white font-black text-sm">{row.count}</td>
                    <td className="px-6 py-4 text-slate-400 font-bold text-xs">{pct}%</td>
                    <td className="px-6 py-4 text-slate-300 font-bold text-xs">
                      {row.ngRev > 0 ? `₦${row.ngRev.toLocaleString()}` : '—'}
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-bold text-xs">
                      {row.usdRev > 0 ? `$${row.usdRev.toLocaleString()}` : '—'}
                    </td>
                  </tr>
                );
              })}
              {/* Totals row */}
              <tr className="bg-slate-950/30 border-t border-slate-700">
                <td className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</td>
                <td className="px-6 py-4 text-white font-black text-sm">{billing.total}</td>
                <td className="px-6 py-4 text-slate-400 font-bold text-xs">100%</td>
                <td className="px-6 py-4 text-emerald-400 font-black text-sm">₦{ngMRR.toLocaleString()}</td>
                <td className="px-6 py-4 text-emerald-400 font-black text-sm">${usdMRR.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
