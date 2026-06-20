import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, Package, Hash, Calendar, ChevronDown, ChevronUp, CheckCircle2, XCircle, MessageCircle } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { supabase } from '../supabaseClient';

const STATUS_STYLES = {
  pending:   { bg: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  fulfilled: { bg: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  cancelled: { bg: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${s.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

export default function StaffPortal() {
  const { slug } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [pin, setPin] = useState('');
  const [authError, setAuthError] = useState('');
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  useEffect(() => {
    const fetchVendor = async () => {
      const { data } = await supabase.from('vendors').select('*').eq('slug', slug).maybeSingle();
      if (data) setVendor(data);
      setLoading(false);
    };
    fetchVendor();
  }, [slug]);

  const handleLogin = async () => {
    if (!pin) { setAuthError('Enter your PIN'); return; }
    const { data } = await supabase
      .from('staff_members')
      .select('*')
      .eq('vendor_id', vendor.id)
      .eq('pin', pin)
      .eq('active', true)
      .maybeSingle();
    if (data) {
      setStaffName(data.name);
      setAuthenticated(true);
      setAuthError('');
      fetchOrders();
    } else {
      setAuthError('Invalid PIN');
    }
  };

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('vendor_id', vendor.id)
      .order('created_at', { ascending: false });
    setOrders(data || []);
  };

  const updateStatus = async (id, newStatus) => {
    setUpdatingOrder(id);
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    if (error) { toast.error('Failed to update'); setUpdatingOrder(null); return; }
    if (newStatus === 'fulfilled') {
      const order = orders.find(o => o.id === id);
      if (order?.items) {
        for (const item of order.items) {
          const { data: prod } = await supabase.from('products').select('stock').eq('id', item.id).single();
          if (prod && prod.stock > 0) {
            await supabase.from('products').update({ stock: Math.max(0, prod.stock - item.qty) }).eq('id', item.id);
          }
        }
      }
    }
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    toast.success(`Order ${newStatus}`);
    setUpdatingOrder(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 size={32} className="animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-400 p-6 text-center">
        <Package size={40} className="mb-4 text-slate-300" />
        <h2 className="font-black text-xl text-slate-700 mb-1">Store not found</h2>
        <p className="text-sm">This staff portal doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors pb-20">
      <Toaster position="top-right" />

      {!authenticated ? (
        /* Login screen */
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] max-w-sm w-full p-8 shadow-2xl border border-slate-100 dark:border-slate-800 text-center">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Package size={28} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="font-black text-xl text-slate-900 dark:text-white mb-1">{vendor.shop_name}</h2>
            <p className="text-sm text-slate-400 font-medium mb-8">Staff Login</p>
            <input type="password" maxLength={6} inputMode="numeric" placeholder="Enter PIN"
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-emerald-500 font-black text-lg text-center tracking-[0.5em] transition-all mb-2"
              value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
              onKeyDown={e => e.key === 'Enter' && handleLogin()} autoFocus />
            {authError && <p className="text-[11px] text-red-500 font-medium mb-3">{authError}</p>}
            <button onClick={handleLogin}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all active:scale-95 mt-2">
              Sign In
            </button>
          </div>
        </div>
      ) : (
        /* Orders dashboard */
        <div className="max-w-3xl mx-auto px-4 pt-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black tracking-tight">{vendor.shop_name}</h2>
              <p className="text-sm text-slate-400 font-medium">Welcome, {staffName}</p>
            </div>
            <button onClick={() => setAuthenticated(false)}
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 px-4 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-all">
              Sign Out
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total', value: orders.length, color: 'text-slate-900 dark:text-white', bg: 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800' },
              { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20' },
              { label: 'Revenue', value: `₦${orders.filter(o => o.status === 'fulfilled').reduce((s, o) => s + Number(o.total), 0).toLocaleString()}`, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20' },
            ].map((stat, i) => (
              <div key={i} className={`p-4 rounded-2xl border shadow-sm ${stat.bg}`}>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className={`text-xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Orders */}
          <div className="space-y-3">
            {orders.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem]">
                <Package size={32} className="mx-auto mb-4 text-slate-300" />
                <p className="font-bold text-slate-400">No orders yet</p>
              </div>
            ) : orders.map(order => (
              <div key={order.id} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center">
                      <Hash size={16} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-black text-sm">{order.order_number}</p>
                      <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={order.status} />
                    <p className="font-black text-sm hidden sm:block">₦{Number(order.total).toLocaleString()}</p>
                    <button onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)} className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-600 transition">
                      {expandedOrder === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div className="border-t border-slate-100 dark:border-slate-700 p-5 space-y-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Items</p>
                      <div className="space-y-2">
                        {(order.items || []).map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg flex items-center justify-center">
                                <Package size={12} className="text-emerald-500" />
                              </div>
                              <div>
                                <p className="font-bold text-xs">{item.name}</p>
                                {item.variants && Object.keys(item.variants).length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {Object.entries(item.variants).map(([group, opt]) => (
                                      <span key={group} className="text-[9px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded-md">
                                        {group}: {opt}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <p className="font-bold text-xs">{item.qty}x · ₦{Number(item.subtotal).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="font-black text-lg">₦{Number(order.total).toLocaleString()}</p>
                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <>
                            <button onClick={() => updateStatus(order.id, 'fulfilled')} disabled={updatingOrder === order.id}
                              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20">
                              {updatingOrder === order.id ? <Loader2 className="animate-spin" size={12} /> : <CheckCircle2 size={12} />}
                              Fulfill
                            </button>
                            <button onClick={() => updateStatus(order.id, 'cancelled')} disabled={updatingOrder === order.id}
                              className="px-4 py-2.5 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all disabled:opacity-50">
                              <XCircle size={12} /> Cancel
                            </button>
                          </>
                        )}
                        {order.status === 'fulfilled' && order.customer_phone && (
                          <a href={`https://wa.me/${order.customer_phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer"
                            className="px-4 py-2.5 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all">
                            <MessageCircle size={12} /> Message
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
