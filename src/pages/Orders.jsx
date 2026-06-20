import { useState, useEffect } from 'react';
import {
  ShoppingBag, Clock, CheckCircle2, XCircle, RotateCw,
  TrendingUp, Package, ChevronDown, ChevronUp,
  Calendar, Phone, Hash
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import { toast } from 'react-hot-toast';
import { getCurrency } from '../data/countries';
import { getCurrencySymbol } from '../data/plans';

// ── WhatsApp icon ─────────────────────────────────────────────
const WhatsAppIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd"
      d="M16 2C8.268 2 2 8.268 2 16c0 2.444.658 4.731 1.806 6.7L2 30l7.497-1.776A13.93 13.93 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.44 11.44 0 01-5.834-1.597l-.418-.248-4.332 1.026 1.07-4.217-.272-.433A11.45 11.45 0 014.5 16C4.5 9.596 9.596 4.5 16 4.5S27.5 9.596 27.5 16 22.404 27.5 16 27.5zm6.29-8.617c-.344-.172-2.036-1.004-2.352-1.118-.316-.115-.546-.172-.776.172-.23.344-.89 1.118-1.09 1.348-.2.23-.4.258-.744.086-.344-.172-1.452-.535-2.766-1.707-1.022-.912-1.712-2.038-1.912-2.382-.2-.344-.021-.53.15-.701.155-.154.344-.402.516-.603.172-.2.23-.344.344-.573.115-.23.058-.43-.029-.603-.086-.172-.776-1.87-1.063-2.56-.28-.672-.564-.58-.776-.591l-.66-.011c-.23 0-.603.086-.918.43-.316.344-1.206 1.177-1.206 2.87s1.235 3.328 1.407 3.558c.172.23 2.43 3.71 5.888 5.203.823.355 1.465.567 1.965.726.826.263 1.578.226 2.172.137.662-.099 2.036-.832 2.323-1.635.287-.803.287-1.491.2-1.635-.086-.143-.316-.23-.66-.402z"
    />
  </svg>
);

// STRIPPED OUT THE USELESS "SENT" STATUS
const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: 'text-amber-600 dark:text-amber-400',   bg: 'bg-amber-50 dark:bg-amber-500/10',   border: 'border-amber-200 dark:border-amber-500/20',   Icon: Clock },
  fulfilled: { label: 'Fulfilled', color: 'text-emerald-600 dark:text-emerald-400',  bg: 'bg-emerald-50 dark:bg-emerald-500/10',  border: 'border-emerald-200 dark:border-emerald-500/20',  Icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'text-red-500 dark:text-red-400',       bg: 'bg-red-50 dark:bg-red-500/10',       border: 'border-red-200 dark:border-red-500/20',       Icon: XCircle },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
      <cfg.Icon size={10} />
      {cfg.label}
    </span>
  );
}

function OrderCard({ order, onStatusChange, ordSymbol }) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);
  const items = Array.isArray(order.items) ? order.items : [];
  const date  = new Date(order.created_at);

  const handleStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('orders').update({ status: newStatus }).eq('id', order.id);
      if (error) throw error;
      // Decrement stock for each product when fulfilled
      if (newStatus === 'fulfilled' && items.length > 0) {
        for (const item of items) {
          const { data: prod } = await supabase
            .from('products').select('stock').eq('id', item.id).single();
          if (prod && prod.stock > 0) {
            const newStock = Math.max(0, prod.stock - item.qty);
            await supabase.from('products').update({ stock: newStock }).eq('id', item.id);
          }
        }
      }
      onStatusChange(order.id, newStatus);
      toast.success(`Order marked as ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const openWhatsApp = () => {
    const phone = order.customer_phone?.replace(/[^0-9]/g, '');
    if (!phone) return toast.error('No phone number on this order');
    window.open(`https://wa.me/${phone.startsWith('0') ? '234' + phone.slice(1) : phone}`, '_blank');
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden transition-all duration-200">
      {/* Header row */}
      <div className="flex items-center justify-between p-5 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Hash size={16} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="min-w-0">
            <p className="font-black text-slate-900 dark:text-white text-sm">{order.order_number}</p>
            <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
              <Calendar size={10} />
              {date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              {' · '}
              {date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusBadge status={order.status} />
          <p className="font-black text-slate-900 dark:text-white text-sm hidden sm:block">
            {ordSymbol}{Number(order.total).toLocaleString()}
          </p>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 bg-slate-50 dark:bg-slate-700 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-slate-100 dark:border-slate-700 p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">

          {/* Total (mobile) */}
          <div className="sm:hidden">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
            <p className="font-black text-slate-900 dark:text-white text-lg">{ordSymbol}{Number(order.total).toLocaleString()}</p>
          </div>

          {/* Items */}
          {items.length > 0 && (
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Items Ordered</p>
              <div className="space-y-2">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package size={12} className="text-emerald-500" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">{item.name}</p>
                        {item.variants && Object.keys(item.variants).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {Object.entries(item.variants).map(([group, opt]) => (
                              <span key={group} className="text-[9px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded-md">
                                {group}: {opt}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-[10px] text-slate-400">Qty: {item.qty}</p>
                      </div>
                    </div>
                    <p className="font-black text-emerald-600 dark:text-emerald-400 text-xs">{ordSymbol}{Number(item.subtotal).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer info */}
          {(order.customer_name || order.customer_phone) && (
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Customer</p>
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <div className="w-9 h-9 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 font-black text-sm flex-shrink-0">
                  {order.customer_name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{order.customer_name || 'Unknown'}</p>
                  {order.customer_phone && (
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Phone size={9} /> {order.customer_phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-2">
            {order.customer_phone && (
              <button onClick={openWhatsApp}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-white transition active:scale-95"
                style={{ background: '#25D366' }}>
                <WhatsAppIcon size={14} /> Message Customer
              </button>
            )}
            {order.status !== 'fulfilled' && (
              <button onClick={() => handleStatus('fulfilled')} disabled={updating}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-100 transition active:scale-95 disabled:opacity-50">
                <CheckCircle2 size={13} /> Mark Fulfilled
              </button>
            )}
            {order.status !== 'cancelled' && order.status !== 'fulfilled' && (
              <button onClick={() => handleStatus('cancelled')} disabled={updating}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-500 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-red-100 transition active:scale-95 disabled:opacity-50">
                <XCircle size={13} /> Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Orders({ user }) {
  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter]       = useState('all');
  const ordCurrency = getCurrency(user?.vendor?.country || 'NG');
  const ordSymbol = getCurrencySymbol(ordCurrency);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async (showToast = false) => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('vendor_id', user.vendor.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      // We filter out 'sent' on the client side just in case old DB records have it
      const cleanOrders = (data || []).map(o => o.status === 'sent' ? { ...o, status: 'pending' } : o);
      setOrders(cleanOrders);
      if (showToast) toast.success('Orders refreshed!');
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  // Stats
  const totalRevenue  = orders.filter(o => o.status === 'fulfilled').reduce((s, o) => s + Number(o.total), 0);
  const pendingCount  = orders.filter(o => o.status === 'pending').length;
  const fulfilledCount = orders.filter(o => o.status === 'fulfilled').length;

  const FILTERS = [
    { id: 'all',       label: 'All' },
    { id: 'pending',   label: 'Pending' },
    { id: 'fulfilled', label: 'Fulfilled' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-20 pt-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Orders</h1>
          <p className="text-slate-400 font-medium text-sm mt-1">Track and manage your incoming orders.</p>
        </div>
        <button onClick={() => fetchOrders(true)} disabled={refreshing}
          className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition active:scale-95 disabled:opacity-50 shadow-sm">
          <RotateCw size={14} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Syncing' : 'Refresh'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue',  value: `${ordSymbol}${totalRevenue.toLocaleString()}`,  icon: TrendingUp,   color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
          { label: 'Pending',        value: pendingCount,                          icon: Clock,        color: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' },
          { label: 'Fulfilled',      value: fulfilledCount,                        icon: CheckCircle2, color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm p-5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon size={16} />
            </div>
            <p className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate">{s.value}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition active:scale-95 ${
              filter === f.id
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300'
            }`}>
            {f.label}
            {f.id !== 'all' && (
              <span className="ml-1.5 opacity-70">
                ({orders.filter(o => o.status === f.id).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 h-20 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-16 text-center">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={28} className="text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="font-black text-slate-900 dark:text-white mb-2">
            {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
          </h3>
          <p className="text-slate-400 text-sm font-medium max-w-xs mx-auto">
            {filter === 'all'
              ? 'When customers order from your store, they will appear here.'
              : `No orders with "${filter}" status found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} ordSymbol={ordSymbol} />
          ))}
        </div>
      )}

      {/* How orders get here — shown when empty */}
      {orders.length === 0 && !loading && (
        <div className="bg-slate-900 dark:bg-slate-800 rounded-[2.5rem] p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.08)_0%,transparent_70%)]" />
          <div className="relative z-10">
            <WhatsAppIcon size={28} className="text-emerald-400 mx-auto mb-4" />
            <h3 className="font-black text-white text-lg mb-2">How orders work</h3>
            <p className="text-slate-400 text-sm font-medium max-w-md mx-auto leading-relaxed">
              When a customer taps "Order on WhatsApp" on your store, their order is saved here automatically before WhatsApp opens. You can track, manage and mark orders from this page.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}