import { useState, useEffect, useMemo } from "react";
import {
  Search, ShieldCheck, Trash2, Globe, Zap, Crown,
  Settings2, Ban, Play, Activity, X, AlertTriangle, ExternalLink
} from "lucide-react";
import { toast } from "react-hot-toast";
import { supabase } from "../../supabaseClient";

export default function AdminUsers({ user }) {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  
  const [manageModalOpen, setManageModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Custom Delete Modal State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, [user]);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // CRITICAL FIX: Filter out the currently logged-in Admin so they don't see themselves
      const otherVendors = (data || []).filter(v => v.id !== user?.id);
      setVendors(otherVendors);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load vendor registry.");
    } finally {
      setLoading(false);
    }
  };

  // --- UPDATE VENDOR (suspension) ---
  const updateVendor = async (vendorId, updates) => {
    setActionLoading(true);
    try {
      const { data, error } = await supabase
        .from("vendors")
        .update(updates)
        .eq("id", vendorId)
        .select(); // <-- THIS IS THE FIX. It forces Supabase to return the updated data.

      if (error) throw error;
      
      // If data is empty, it means Row Level Security blocked the update!
      if (!data || data.length === 0) {
        throw new Error("Update blocked by Database Security. (Are you an Admin?)");
      }

      // Update local state
      setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, ...updates } : v));
      if (selectedVendor?.id === vendorId) {
        setSelectedVendor(prev => ({ ...prev, ...updates }));
      }

      // THE AUDIT LOG
      const actionDesc = updates.is_suspended 
        ? `Suspended store: ${selectedVendor.shop_name}` 
        : `Reactivated store: ${selectedVendor.shop_name}`;
        
      await supabase.from('audit_logs').insert([{
        action_type: 'security',
        description: actionDesc,
        admin_id: user?.id 
      }]);

      toast.success(updates.is_suspended ? "Store suspended." : "Store reactivated.");
    } catch (err) {
      toast.error(err.message || "Update failed.");
    } finally {
      setActionLoading(false);
    }
  };

  // --- EXECUTE DELETE VENDOR ---
  const executeDelete = async () => {
    if (!selectedVendor) return;
    
    setActionLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("delete-account", {
        body: { userId: selectedVendor.id, skipPasswordCheck: true },
      });
      
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      // THE AUDIT LOG: Record the deletion
      await supabase.from('audit_logs').insert([{
        action_type: 'security',
        description: `Permanently deleted store: ${selectedVendor.shop_name}`,
        admin_id: user?.id 
      }]);

      setVendors(prev => prev.filter(v => v.id !== selectedVendor.id));
      
      // Close everything
      setDeleteConfirmOpen(false);
      setManageModalOpen(false);
      setSelectedVendor(null);
      
      toast.success("Vendor deleted permanently.");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.message || "Failed to delete vendor.");
      setDeleteConfirmOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const openManageModal = (vendor) => {
    setSelectedVendor(vendor);
    setManageModalOpen(true);
  };

  // Plan + platform counts for filter chips
  const planCounts = useMemo(() => ({
    all:      vendors.length,
    free:     vendors.filter(v => !v.plan_type || v.plan_type === 'free').length,
    pro:      vendors.filter(v => v.plan_type === 'pro').length,
    premium:  vendors.filter(v => v.plan_type === 'premium').length,
    upgraded: vendors.filter(v => v.plan_type === 'pro' || v.plan_type === 'premium').length,
    web:      vendors.filter(v => !v.signup_platform || v.signup_platform === 'web').length,
    mobile:   vendors.filter(v => v.signup_platform === 'mobile').length,
    email:    vendors.filter(v => !v.auth_provider || v.auth_provider === 'email').length,
    google:   vendors.filter(v => v.auth_provider === 'google').length,
  }), [vendors]);

  const filteredVendors = useMemo(() => {
    const pt = (v) => (v.plan_type || 'free').toLowerCase();
    return vendors
      .filter(v => {
        if (filter === 'all')      return true;
        if (filter === 'free')     return pt(v) === 'free';
        if (filter === 'pro')      return pt(v) === 'pro';
        if (filter === 'premium')  return pt(v) === 'premium';
        if (filter === 'upgraded') return pt(v) === 'pro' || pt(v) === 'premium';
        if (filter === 'web')      return !v.signup_platform || v.signup_platform === 'web';
        if (filter === 'mobile')   return v.signup_platform === 'mobile';
        if (filter === 'email')    return !v.auth_provider || v.auth_provider === 'email';
        if (filter === 'google')   return v.auth_provider === 'google';
        return true;
      })
      .filter(v =>
        v.shop_name?.toLowerCase().includes(search.toLowerCase()) ||
        v.phone?.includes(search) ||
        v.slug?.toLowerCase().includes(search.toLowerCase()) ||
        v.email?.toLowerCase().includes(search.toLowerCase())
      );
  }, [vendors, search, filter]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-slate-800 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Loading Registry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full relative">
      
      {/* ── TOP CONTROLS (Search & Filters) ── */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-center bg-slate-900/50 p-4 rounded-[2rem] border border-slate-800 shadow-xl">
        <div className="relative w-full xl:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={16} />
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search by name, slug, email or phone..."
            className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm font-medium text-white outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600" 
          />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {/* Plan filters */}
          <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            {[
              { key: 'all',      label: 'All',      color: '' },
              { key: 'free',     label: 'Free',     color: '' },
              { key: 'pro',      label: 'Pro',      color: 'text-amber-400' },
              { key: 'premium',  label: 'Premium',  color: 'text-purple-400' },
              { key: 'upgraded', label: 'Upgraded', color: 'text-emerald-400' },
            ].map(({ key, label, color }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all outline-none flex items-center gap-1.5 ${
                  filter === key ? "bg-slate-800 text-white shadow-lg" : `text-slate-500 hover:text-slate-300 hover:bg-slate-900 ${color}`
                }`}
              >
                {label}
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${filter === key ? 'bg-slate-700 text-slate-300' : 'bg-slate-900 text-slate-600'}`}>
                  {planCounts[key]}
                </span>
              </button>
            ))}
          </div>
          {/* Platform filters */}
          <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            {[
              { key: 'web',    label: '🌐 Web',    color: 'text-slate-400' },
              { key: 'mobile', label: '📱 Mobile', color: 'text-blue-400'  },
            ].map(({ key, label, color }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all outline-none flex items-center gap-1.5 ${
                  filter === key ? "bg-slate-800 text-white shadow-lg" : `text-slate-500 hover:text-slate-300 hover:bg-slate-900 ${color}`
                }`}
              >
                {label}
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${filter === key ? 'bg-slate-700 text-slate-300' : 'bg-slate-900 text-slate-600'}`}>
                  {planCounts[key]}
                </span>
              </button>
            ))}
          </div>
          {/* Auth provider filters */}
          <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            {[
              { key: 'email',  label: '✉️ Email',  color: 'text-slate-400'  },
              { key: 'google', label: '🔵 Google', color: 'text-blue-400'   },
            ].map(({ key, label, color }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all outline-none flex items-center gap-1.5 ${
                  filter === key ? "bg-slate-800 text-white shadow-lg" : `text-slate-500 hover:text-slate-300 hover:bg-slate-900 ${color}`
                }`}
              >
                {label}
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${filter === key ? 'bg-slate-700 text-slate-300' : 'bg-slate-900 text-slate-600'}`}>
                  {planCounts[key]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── VENDOR DATA TABLE ── */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-6">Store details</th>
                <th className="px-8 py-6">Contact</th>
                <th className="px-8 py-6">Joined</th>
                <th className="px-8 py-6">Current Plan</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredVendors.map(v => (
                <tr key={v.id} className={`transition-colors group ${v.is_suspended ? "bg-red-950/10" : "hover:bg-slate-800/30"}`}>
                  
                  {/* Store Name & Logo */}
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-500 text-xs border border-slate-700 overflow-hidden shrink-0">
                        {v.logo_url 
                          ? <img src={v.logo_url} className="w-full h-full object-cover" alt="logo" /> 
                          : v.shop_name.substring(0, 2).toUpperCase()
                        }
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <div className={`font-bold text-sm ${v.is_suspended ? "text-red-400" : "text-white group-hover:text-emerald-400"} transition-colors truncate max-w-[200px]`}>
                            {v.shop_name}
                          </div>
                          {v.is_admin && (
                            <span className="bg-emerald-500/20 text-emerald-500 p-1 rounded-md" title="Super Admin">
                              <ShieldCheck size={12} />
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 mt-1 truncate max-w-[200px]">shop.vi/{v.slug}</div>
                      </div>
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td className="px-8 py-5">
                    <div className="text-xs font-medium text-slate-300 mb-1 truncate max-w-[180px]">
                      {v.email || "No Email"}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1.5">
                      <Globe size={10} className="text-slate-600" /> {v.phone || "No Phone"}
                    </div>
                  </td>

                  {/* Joined date + platform */}
                  <td className="px-8 py-5">
                    <div className="text-xs font-bold text-slate-300 mb-1">
                      {v.created_at
                        ? new Date(v.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '—'}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 mb-1.5">
                      {v.created_at
                        ? new Date(v.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })
                        : ''}
                    </div>
                    <div className="flex items-center gap-1 flex-wrap mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        v.signup_platform === 'mobile'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : 'bg-slate-700/50 text-slate-400 border-slate-600/30'
                      }`}>
                        {v.signup_platform === 'mobile' ? '📱 Mobile' : '🌐 Web'}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        v.auth_provider === 'google'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : 'bg-slate-700/50 text-slate-400 border-slate-600/30'
                      }`}>
                        {v.auth_provider === 'google' ? '🔵 Google' : '✉️ Email'}
                      </span>
                    </div>
                    {v.last_seen_at && (
                      <div className="text-[9px] font-mono text-slate-600 mt-1.5">
                        Last seen {new Date(v.last_seen_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · {new Date(v.last_seen_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })}
                      </div>
                    )}
                  </td>

                  {/* Plan Badge */}
                  <td className="px-8 py-5">
                    {(() => {
                      const pt = (v.plan_type || 'free').toLowerCase();
                      const cls = pt === 'premium'
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        : pt === 'pro'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-slate-800 text-slate-400 border-slate-700';
                      const Icon = pt === 'premium' ? Crown : Zap;
                      return (
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border ${cls}`}>
                          <Icon size={10} fill="currentColor" />
                          {pt === 'free' ? 'Free' : v.plan_type}
                        </span>
                      );
                    })()}
                  </td>

                  {/* Status */}
                  <td className="px-8 py-5">
                    {v.is_suspended 
                      ? <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-1.5"><Ban size={12}/> Suspended</span>
                      : <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1.5"><Activity size={12}/> Active</span>
                    }
                  </td>

                  {/* Actions */}
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`https://shoplinkvi.com/shop.vi/${v.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        title="View storefront"
                        className="p-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20 rounded-xl transition-all inline-flex items-center"
                      >
                        <ExternalLink size={14} />
                      </a>
                      <button
                        onClick={() => openManageModal(v)}
                        className="p-2 bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-white rounded-xl transition-all inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest outline-none shadow-sm"
                      >
                        <Settings2 size={14} /> Manage
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredVendors.length === 0 && (
          <div className="p-24 text-center text-slate-600 font-black uppercase tracking-widest text-xs">No vendors found matching your criteria</div>
        )}
      </div>

      {/* ── MANAGE VENDOR SLIDE-OVER DRAWER ── */}
      {manageModalOpen && selectedVendor && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[90] bg-[#0B1120]/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setManageModalOpen(false)}
          />
          
          {/* Sliding Drawer */}
          <div className="fixed inset-y-0 right-0 z-[95] w-full max-w-md bg-[#0F172A] border-l border-slate-800 shadow-2xl p-8 flex flex-col animate-in slide-in-from-right duration-300">
            
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest">Store Control</h3>
              <button 
                onClick={() => setManageModalOpen(false)} 
                className="text-slate-500 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-full transition-colors outline-none"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-10 bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-black text-white truncate">{selectedVendor.shop_name}</h3>
                {selectedVendor.is_admin && <ShieldCheck size={18} className="text-emerald-500 shrink-0" />}
              </div>
              <p className="text-emerald-500 font-mono text-xs mb-1">shop.vi/{selectedVendor.slug}</p>
              <p className="text-slate-400 font-mono text-[10px]">{selectedVendor.email}</p>
            </div>

            <div className="space-y-6 flex-1">
              
              {/* Suspend / Reactivate */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Store Status</label>
                
                {selectedVendor.is_suspended && (
                  <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3">
                    <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-400 font-medium leading-relaxed">
                      This store is currently suspended. The owner cannot access their dashboard and their public link is disabled.
                    </p>
                  </div>
                )}

                <button
                  onClick={() => updateVendor(selectedVendor.id, { is_suspended: !selectedVendor.is_suspended })}
                  disabled={actionLoading || selectedVendor.is_admin} 
                  className={`w-full p-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all outline-none ${
                    selectedVendor.is_suspended
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                      : "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {selectedVendor.is_suspended ? <><Play size={16}/> Reactivate Store</> : <><Ban size={16}/> Suspend Store</>}
                </button>
              </div>

              <hr className="border-slate-800 my-8" />

              {/* Nuclear Option Button */}
              <div>
                <label className="block text-[10px] font-black text-red-500/70 uppercase tracking-widest mb-3">Danger Zone</label>
                <button
                  onClick={() => setDeleteConfirmOpen(true)}
                  disabled={actionLoading || selectedVendor.is_admin}
                  className="w-full p-4 bg-red-600/10 text-red-500 border border-red-600/20 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 outline-none"
                >
                  <Trash2 size={16} /> Delete Permanently
                </button>
              </div>

            </div>
          </div>
        </>
      )}

      {/* ── CUSTOM DELETE CONFIRMATION MODAL ── */}
      {deleteConfirmOpen && selectedVendor && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0B1120]/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0F172A] border border-slate-800 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative zoom-in-95 animate-in duration-200 text-center overflow-hidden">
            
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-red-500/10 blur-3xl rounded-full pointer-events-none"></div>

            <button 
              onClick={() => setDeleteConfirmOpen(false)} 
              className="absolute top-6 right-6 text-slate-500 hover:text-white bg-slate-800 p-2 rounded-full transition-colors outline-none z-10"
              disabled={actionLoading}
            >
              <X size={16} />
            </button>

            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <AlertTriangle size={28} className="text-red-500" />
            </div>
            
            <h3 className="text-2xl font-black text-white tracking-tighter mb-2 relative z-10">Erase Data?</h3>
            <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed relative z-10">
              You are about to permanently delete <strong className="text-white">{selectedVendor.shop_name}</strong> and all associated products. This cannot be undone.
            </p>

            <div className="flex gap-4 relative z-10">
              <button 
                onClick={() => setDeleteConfirmOpen(false)}
                disabled={actionLoading}
                className="flex-1 p-4 rounded-2xl font-bold text-xs uppercase tracking-widest text-slate-400 bg-slate-800/50 hover:bg-slate-800 hover:text-white transition-colors outline-none disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={executeDelete}
                disabled={actionLoading}
                className="flex-1 p-4 rounded-2xl font-bold text-xs uppercase tracking-widest text-white bg-red-500 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 outline-none flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {actionLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Confirm"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}