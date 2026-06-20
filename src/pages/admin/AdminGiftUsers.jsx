import { useState, useEffect, useMemo } from "react";
import {
  Gift, Search, Loader2, Zap, Crown, Check, X,
  ChevronDown, Store, Phone, Mail, ExternalLink
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import { toast } from "react-hot-toast";

const PLAN_OPTIONS = [
  {
    id:    'pro',
    label: 'Pro',
    icon:  Zap,
    color: 'text-amber-400',
    bg:    'bg-amber-500/10',
    border:'border-amber-500/30',
    ring:  'ring-amber-500',
  },
  {
    id:    'premium',
    label: 'Premium',
    icon:  Crown,
    color: 'text-purple-400',
    bg:    'bg-purple-500/10',
    border:'border-purple-500/30',
    ring:  'ring-purple-500',
  },
];

export default function AdminGiftUsers() {
  const [vendors,     setVendors]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState('');
  const [giftTarget,  setGiftTarget]  = useState(null);
  const [giftPlan,    setGiftPlan]    = useState('pro');
  const [giftUnit,    setGiftUnit]    = useState('months');
  const [giftAmount,  setGiftAmount]  = useState(1);
  const [gifting,     setGifting]     = useState(false);

  useEffect(() => { fetchFreeUsers(); }, []);

  const fetchFreeUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('id, shop_name, email, phone, slug, plan_type, country, created_at')
        .or('plan_type.eq.free,plan_type.is.null')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setVendors(data || []);
    } catch (err) {
      toast.error('Failed to load free users');
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return vendors;
    return vendors.filter(v =>
      (v.shop_name || '').toLowerCase().includes(q) ||
      (v.email     || '').toLowerCase().includes(q) ||
      (v.phone     || '').toLowerCase().includes(q)
    );
  }, [vendors, search]);

  const maxAmount = giftUnit === 'years' ? 3 : 24;

  const handleGift = async () => {
    if (!giftTarget) return;
    setGifting(true);
    try {
      const now     = new Date();
      const expires = new Date(now);
      if (giftUnit === 'years') {
        expires.setFullYear(expires.getFullYear() + giftAmount);
      } else {
        expires.setMonth(expires.getMonth() + giftAmount);
      }

      const { error } = await supabase.from('vendors').update({
        plan_type:       giftPlan,
        plan_status:     'active',
        plan_started_at: now.toISOString(),
        plan_expires_at: expires.toISOString(),
        gifted_by_admin: true,
      }).eq('id', giftTarget.id);

      if (error) throw error;

      toast.success(`🎁 Gifted ${giftPlan.charAt(0).toUpperCase() + giftPlan.slice(1)} to ${giftTarget.shop_name || giftTarget.email}!`);
      setGiftTarget(null);
      fetchFreeUsers();
    } catch (err) {
      toast.error('Failed to gift plan: ' + (err.message || ''));
    } finally {
      setGifting(false);
    }
  };

  const durationLabel = giftAmount === 1
    ? `1 ${giftUnit === 'years' ? 'Year' : 'Month'}`
    : `${giftAmount} ${giftUnit === 'years' ? 'Years' : 'Months'}`;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full pb-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-slate-900/50 p-6 rounded-[2rem] border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 px-8 py-1.5 bg-purple-500/10 text-purple-400 border-b border-l border-purple-500/20 rounded-bl-3xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Gift size={12} /> Admin Gift Panel
        </div>
        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
            <Gift className="text-purple-400" /> Gift Users
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Give free users a Pro or Premium plan for a limited time.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-3">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
          <span className="text-slate-300 font-black text-xs uppercase tracking-widest">
            {loading ? '...' : `${vendors.length} free user${vendors.length !== 1 ? 's' : ''}`}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search by store name, email or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-12 pr-5 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-white font-bold text-sm placeholder-slate-600 outline-none focus:border-purple-500/50 transition-colors"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 bg-slate-950/30 flex items-center justify-between">
          <h3 className="text-white font-black text-base tracking-tight flex items-center gap-2">
            <Store size={16} className="text-slate-400" />
            Free Stores
          </h3>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-purple-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
              <Gift size={22} className="text-slate-600" />
            </div>
            <p className="text-slate-400 font-black text-sm">
              {search ? 'No users match your search.' : 'All users are on paid plans.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-slate-950/30 border-b border-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Store</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Country</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filtered.map(v => (
                  <tr key={v.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700 flex-shrink-0">
                          <Store size={14} className="text-slate-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-black text-sm truncate max-w-[160px]">
                            {v.shop_name || 'Unnamed Store'}
                          </p>
                          {v.slug && (
                            <p className="text-slate-500 text-[10px] font-mono">shop.vi/{v.slug}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        {v.email && (
                          <p className="text-slate-300 text-xs font-bold truncate max-w-[180px]">{v.email}</p>
                        )}
                        {v.phone && (
                          <p className="text-slate-500 text-[10px] font-mono">{v.phone}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-400 text-xs font-bold">{v.country || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-500 text-xs font-bold">
                        {v.created_at ? new Date(v.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }) : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {v.slug && (
                          <a
                            href={`https://shoplinkvi.com/shop.vi/${v.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition border border-slate-700"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                        <button
                          onClick={() => { setGiftTarget(v); setGiftPlan('pro'); setGiftUnit('months'); setGiftAmount(1); }}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95"
                        >
                          <Gift size={12} /> Gift
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Gift Modal */}
      {giftTarget && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => !gifting && setGiftTarget(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="bg-slate-950/60 border-b border-slate-800 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Gift size={18} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-white font-black text-sm">Gift a Plan</p>
                  <p className="text-slate-500 text-[10px] font-bold truncate max-w-[200px]">
                    {giftTarget.shop_name || giftTarget.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setGiftTarget(null)}
                disabled={gifting}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-6">

              {/* Plan selector */}
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Choose Plan</p>
                <div className="grid grid-cols-2 gap-3">
                  {PLAN_OPTIONS.map(opt => {
                    const Icon = opt.icon;
                    const active = giftPlan === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setGiftPlan(opt.id)}
                        className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all font-black text-sm ${
                          active
                            ? `${opt.bg} ${opt.border} ${opt.color} ring-2 ${opt.ring}/30`
                            : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-300'
                        }`}
                      >
                        <Icon size={18} fill={active ? 'currentColor' : 'none'} />
                        {opt.label}
                        {active && <Check size={14} className="ml-auto" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Duration unit */}
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Duration Unit</p>
                <div className="grid grid-cols-2 gap-3">
                  {['months', 'years'].map(unit => (
                    <button
                      key={unit}
                      onClick={() => { setGiftUnit(unit); setGiftAmount(1); }}
                      className={`py-3 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all ${
                        giftUnit === unit
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 ring-2 ring-emerald-500/20'
                          : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-300'
                      }`}
                    >
                      {unit}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
                  How many {giftUnit}? <span className="text-white">{giftAmount}</span>
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setGiftAmount(a => Math.max(1, a - 1))}
                    className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-white font-black text-lg hover:bg-slate-700 transition active:scale-90 flex items-center justify-center flex-shrink-0"
                  >
                    −
                  </button>
                  <div className="flex-1">
                    <input
                      type="range"
                      min={1}
                      max={maxAmount}
                      value={giftAmount}
                      onChange={e => setGiftAmount(Number(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                    <div className="flex justify-between text-[9px] font-black text-slate-600 mt-1">
                      <span>1</span>
                      <span>{maxAmount}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setGiftAmount(a => Math.min(maxAmount, a + 1))}
                    className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-white font-black text-lg hover:bg-slate-700 transition active:scale-90 flex items-center justify-center flex-shrink-0"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Summary</p>
                <p className="text-white font-black text-sm">
                  Gift{' '}
                  <span className={giftPlan === 'premium' ? 'text-purple-400' : 'text-amber-400'}>
                    {giftPlan.charAt(0).toUpperCase() + giftPlan.slice(1)}
                  </span>
                  {' '}for{' '}
                  <span className="text-emerald-400">{durationLabel}</span>
                  {' '}to{' '}
                  <span className="text-white">{giftTarget.shop_name || giftTarget.email}</span>
                </p>
              </div>

              {/* Confirm button */}
              <button
                onClick={handleGift}
                disabled={gifting}
                className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
              >
                {gifting
                  ? <><Loader2 size={16} className="animate-spin" /> Gifting...</>
                  : <><Gift size={14} /> Confirm Gift</>
                }
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
