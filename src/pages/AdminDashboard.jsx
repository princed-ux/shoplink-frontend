import { useState, useEffect, useMemo } from "react";
import {
  LayoutDashboard, Users, ShoppingBag, ShieldCheck, Search,
  Trash2, LogOut, Wallet, Activity, Globe, Zap,
  Menu, X, Database, HardDrive, Cpu, Lock, Bell, Settings2, Ban, Play
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function AdminDashboard({ user, setUser }) {
  const navigate = useNavigate();

  const [activeTab, setActiveTab]         = useState("overview");
  const [stats, setStats]                 = useState({ totalVendors: 0, revenue: 0, totalProducts: 0 });
  const [vendors, setVendors]             = useState([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState("");
  const [filter, setFilter]               = useState("all");
  const [sidebarOpen, setSidebarOpen]     = useState(false);
  const [manageModalOpen, setManageModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor]   = useState(null);
  const [actionLoading, setActionLoading]     = useState(false);

  // --- AUTH GUARD ---
  useEffect(() => {
    if (!user) return navigate("/login");
    if (!user?.vendor?.is_admin) {
      toast.error("Access denied.");
      return navigate("/dashboard");
    }
    fetchData();
  }, []);

  // --- FETCH ALL DATA ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const [vendorsRes, productsRes] = await Promise.all([
        supabase.from("vendors").select("*").order("created_at", { ascending: false }),
        supabase.from("products").select("id"),
      ]);

      if (vendorsRes.error) throw vendorsRes.error;
      if (productsRes.error) throw productsRes.error;

      const allVendors = vendorsRes.data || [];
      setVendors(allVendors);
      setStats({
        totalVendors: allVendors.length,
        totalProducts: productsRes.data?.length || 0,
        revenue: 0, // you can wire this to payments table later
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  // --- UPDATE VENDOR (plan or suspension) ---
  const updateVendor = async (vendorId, updates) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from("vendors")
        .update(updates)
        .eq("id", vendorId);

      if (error) throw error;

      setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, ...updates } : v));
      if (selectedVendor?.id === vendorId) {
        setSelectedVendor(prev => ({ ...prev, ...updates }));
      }
      toast.success("Vendor updated.");
    } catch (err) {
      toast.error(err.message || "Update failed.");
    } finally {
      setActionLoading(false);
    }
  };

  // --- DELETE VENDOR ---
  const deleteVendor = async (id) => {
    if (!window.confirm("Delete this vendor and all their data permanently?")) return;
    setActionLoading(true);
    try {
      // Call delete-account edge function (handles auth user deletion too)
      const { data, error } = await supabase.functions.invoke("delete-account", {
        body: { userId: id, skipPasswordCheck: true },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setVendors(prev => prev.filter(v => v.id !== id));
      setStats(prev => ({ ...prev, totalVendors: Math.max(0, prev.totalVendors - 1) }));
      setManageModalOpen(false);
      toast.success("Vendor deleted.");
    } catch (err) {
      toast.error(err.message || "Delete failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/login");
  };

  const openManageModal = (vendor) => {
    setSelectedVendor(vendor);
    setManageModalOpen(true);
  };

  const filteredVendors = useMemo(() => {
    return vendors
      .filter(v => filter === "all" ? true : (v.plan_type || "Starter") === filter)
      .filter(v =>
        v.shop_name?.toLowerCase().includes(search.toLowerCase()) ||
        v.phone?.includes(search) ||
        v.slug?.toLowerCase().includes(search.toLowerCase())
      );
  }, [vendors, search, filter]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-300 flex overflow-hidden font-sans selection:bg-emerald-500 selection:text-white relative">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' } }} />

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed lg:relative z-50 w-72 h-full bg-[#0F172A] border-r border-slate-800 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <ShieldCheck size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-black text-white tracking-tighter uppercase italic leading-none">Admin<span className="text-emerald-500">.OS</span></h1>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">ShopLinkVi</p>
              </div>
            </div>
            <button className="lg:hidden p-2 text-slate-400 hover:text-white transition" onClick={() => setSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <nav className="space-y-2">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 pl-4">Main Menu</p>
            <NavBtn active={activeTab === "overview"}   onClick={() => { setActiveTab("overview");   setSidebarOpen(false); }} icon={LayoutDashboard} label="Command Center" />
            <NavBtn active={activeTab === "directory"}  onClick={() => { setActiveTab("directory");  setSidebarOpen(false); }} icon={Users}           label="User Registry" />
            <NavBtn active={activeTab === "system"}     onClick={() => { setActiveTab("system");     setSidebarOpen(false); }} icon={Activity}        label="System Metrics" />
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-4 text-red-400 hover:bg-red-500/10 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all group">
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> Terminate Session
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto relative bg-[#0B1120]">
        <header className="sticky top-0 z-30 bg-[#0B1120]/80 backdrop-blur-xl border-b border-slate-800 px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-slate-400 hover:text-white transition" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-900/50 rounded-full border border-slate-800">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-emerald-500">System Online</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative group cursor-pointer">
              <Bell size={20} className="text-slate-400 group-hover:text-white transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-white">Super Admin</div>
                <div className="text-[9px] font-mono text-slate-500">{user?.vendor?.phone}</div>
              </div>
              <div className="w-10 h-10 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center">
                <Lock size={16} className="text-slate-400" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-[1600px] mx-auto">

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid md:grid-cols-3 gap-6">
                <MetricCard title="Total Vendors"    value={stats.totalVendors}  icon={Users}        trend="Live" color="emerald" chartData={[20,30,25,40,35,50,45,60]} />
                <MetricCard title="Total Products"   value={stats.totalProducts} icon={ShoppingBag}  trend="Live" color="purple" chartData={[50,40,60,55,70,65,80,75]} />
                <MetricCard title="Revenue Tracked"  value="₦—"                 icon={Wallet}        trend="Soon" color="blue"   chartData={[40,60,45,70,50,80,65,90]} />
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8 relative overflow-hidden">
                  <h3 className="text-lg font-bold text-white mb-8">Vendor Registrations</h3>
                  <div className="h-64 flex items-end justify-between gap-2 px-2">
                    {[65,40,75,50,85,60,90,70,95,55,80,45,70,60,85].map((h, i) => (
                      <div key={i} className="w-full bg-slate-800 rounded-t-lg hover:bg-emerald-500 transition-all duration-300 group relative" style={{ height: `${h}%` }}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {h}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8">
                  <h3 className="text-lg font-bold text-white mb-6">Plan Distribution</h3>
                  <div className="space-y-4">
                    {["Trial", "Basic", "Growth", "Pro", "Business", "Unlimited"].map(plan => {
                      const count = vendors.filter(v => (v.plan_type || "Starter") === plan).length;
                      const pct = vendors.length ? Math.round((count / vendors.length) * 100) : 0;
                      return (
                        <div key={plan}>
                          <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 mb-1">
                            <span>{plan}</span><span className="text-white">{count}</span>
                          </div>
                          <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                            <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DIRECTORY */}
          {activeTab === "directory" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col xl:flex-row gap-4 justify-between items-center bg-slate-900/50 p-4 rounded-3xl border border-slate-800">
                <div className="relative w-full xl:w-96 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={16} />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, slug or phone..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm font-medium text-white outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600" />
                </div>
                <div className="flex flex-wrap gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
                  {["all","Trial","Basic","Growth","Pro","Business","Unlimited"].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${filter === f ? "bg-slate-800 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                      <tr>
                        <th className="px-8 py-6">Vendor</th>
                        <th className="px-8 py-6">Phone</th>
                        <th className="px-8 py-6">Plan</th>
                        <th className="px-8 py-6">Products</th>
                        <th className="px-8 py-6">Status</th>
                        <th className="px-8 py-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {filteredVendors.map(v => (
                        <tr key={v.id} className={`transition-colors group ${v.is_suspended ? "bg-red-950/20" : "hover:bg-slate-800/30"}`}>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-500 text-xs border border-slate-700 overflow-hidden">
                                {v.logo_url
                                  ? <img src={v.logo_url} className="w-full h-full object-cover" />
                                  : v.shop_name.substring(0,2).toUpperCase()}
                              </div>
                              <div>
                                <div className={`font-bold text-sm ${v.is_suspended ? "text-red-400" : "text-white group-hover:text-emerald-400"} transition-colors`}>
                                  {v.shop_name}
                                </div>
                                <div className="text-[10px] font-mono text-slate-500 mt-0.5">shop.vi/{v.slug}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="text-xs font-medium text-slate-400 flex items-center gap-2">
                              <Globe size={14} className="text-slate-600" /> {v.phone}
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase rounded-full border ${
                              v.plan_type === "Unlimited" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : v.plan_type === "Trial"   ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-slate-800 text-slate-400 border-slate-700"
                            }`}>
                              <Zap size={10} fill="currentColor" /> {v.plan_type || "Starter"}
                            </span>
                          </td>
                          <td className="px-8 py-5">
                            <span className="text-xs font-bold text-slate-400">{v.uploaded_count ?? 0}</span>
                          </td>
                          <td className="px-8 py-5">
                            {v.is_suspended
                              ? <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-1"><Ban size={12}/> Suspended</span>
                              : <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1"><Activity size={12}/> Active</span>
                            }
                          </td>
                          <td className="px-8 py-5 text-right">
                            <button onClick={() => openManageModal(v)}
                              className="p-2 bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-white rounded-xl transition-all inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                              <Settings2 size={14} /> Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredVendors.length === 0 && (
                  <div className="p-24 text-center text-slate-600 font-black uppercase tracking-widest text-xs">No vendors found</div>
                )}
              </div>
            </div>
          )}

          {activeTab === "system" && <SystemHealthView />}
        </div>
      </main>

      {/* MANAGE MODAL */}
      {manageModalOpen && selectedVendor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0B1120]/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0F172A] border border-slate-800 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
            <button onClick={() => setManageModalOpen(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white bg-slate-800 p-2 rounded-full">
              <X size={18} />
            </button>

            <div className="mb-6">
              <h3 className="text-2xl font-black text-white">{selectedVendor.shop_name}</h3>
              <p className="text-slate-500 font-mono text-xs mt-1">shop.vi/{selectedVendor.slug}</p>
              <p className="text-slate-600 font-mono text-xs mt-0.5">{selectedVendor.phone}</p>
            </div>

            <div className="space-y-6">
              {/* Plan Override */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Override Plan</label>
                <select
                  className="w-full bg-slate-950 border border-slate-800 text-white font-bold p-4 rounded-2xl outline-none focus:border-emerald-500 transition-colors"
                  value={selectedVendor.plan_type || "Starter"}
                  onChange={e => updateVendor(selectedVendor.id, { plan_type: e.target.value })}
                  disabled={actionLoading}
                >
                  {["Trial","Basic","Growth","Pro","Business","Unlimited"].map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Suspend / Reactivate */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Account Status</label>
                <button
                  onClick={() => updateVendor(selectedVendor.id, { is_suspended: !selectedVendor.is_suspended })}
                  disabled={actionLoading}
                  className={`w-full p-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    selectedVendor.is_suspended
                      ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                      : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                  }`}
                >
                  {selectedVendor.is_suspended ? <><Play size={16}/> Reactivate</> : <><Ban size={16}/> Suspend</>}
                </button>
              </div>

              <hr className="border-slate-800" />

              {/* Delete */}
              <button
                onClick={() => deleteVendor(selectedVendor.id)}
                disabled={actionLoading}
                className="w-full p-4 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
              >
                <Trash2 size={16} /> Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* --- SUB-COMPONENTS --- */
function NavBtn({ active, onClick, icon: Icon, label }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-300 group ${active ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/20" : "text-slate-500 hover:bg-white/5 hover:text-white"}`}>
      <Icon size={18} className={`${active ? "text-white" : "text-slate-600 group-hover:text-white"} transition-colors`} />
      {label}
    </button>
  );
}

function MetricCard({ title, value, icon: Icon, trend, color, chartData }) {
  const colorMap = {
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    blue:    "text-blue-500 bg-blue-500/10 border-blue-500/20",
    purple:  "text-purple-500 bg-purple-500/10 border-purple-500/20",
  };
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-slate-700 transition-colors">
      <div className="flex justify-between items-start mb-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${colorMap[color]}`}>
          <Icon size={24} />
        </div>
        <div className="px-3 py-1 bg-slate-950 rounded-full border border-slate-800 text-[10px] font-bold text-slate-400">{trend}</div>
      </div>
      <h3 className="text-4xl font-black text-white tracking-tighter mb-1">{value}</h3>
      <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{title}</p>
      <div className="absolute bottom-0 right-0 left-0 h-16 flex items-end gap-1 px-8 opacity-20">
        {chartData.map((h, i) => (
          <div key={i} className={`flex-1 rounded-t-sm ${color === "emerald" ? "bg-emerald-500" : color === "blue" ? "bg-blue-500" : "bg-purple-500"}`} style={{ height: `${h}%` }}></div>
        ))}
      </div>
    </div>
  );
}

function SystemHealthView() {
  return (
    <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-10">
        <h4 className="text-white font-black uppercase tracking-widest text-sm mb-8 flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg"><Database size={18} className="text-emerald-500" /></div>
          Supabase Services
        </h4>
        <div className="space-y-4">
          {["PostgreSQL Database","Storage Bucket","Auth Service","Edge Functions","Realtime"].map((s, i) => (
            <div key={s} className="flex items-center justify-between p-5 bg-slate-950 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-bold text-slate-300">{s}</span>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">Operational</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-10">
        <h4 className="text-white font-black uppercase tracking-widest text-sm mb-8 flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg"><Cpu size={18} className="text-purple-500" /></div>
          System Status
        </h4>
        <div className="relative h-64 bg-slate-950 rounded-3xl border border-slate-800 flex items-center justify-center overflow-hidden">
          <div className="text-center relative z-10">
            <HardDrive size={48} className="mx-auto text-slate-700 mb-4" />
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">All Systems Operational</p>
            <p className="text-emerald-500 font-bold text-sm mt-1">Powered by Supabase</p>
          </div>
          <div className="absolute top-10 left-10 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
          <div className="absolute bottom-20 right-20 w-2 h-2 bg-emerald-500 rounded-full animate-ping delay-700"></div>
          <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-purple-500 rounded-full animate-ping delay-300"></div>
        </div>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="h-screen bg-[#0F172A] flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-slate-800 border-t-emerald-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      </div>
      <p className="mt-8 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Initializing Admin Core...</p>
    </div>
  );
}