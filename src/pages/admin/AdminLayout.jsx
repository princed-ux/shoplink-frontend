import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Users, ShieldCheck,
  LogOut, Menu, X, Bell, Lock, MessageSquare, Activity,
  Settings, Radio, CreditCard, FileBox, AlertTriangle, Gift
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import { toast } from "react-hot-toast";

export default function AdminLayout({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const currentPath = location.pathname;

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate("/login");
    } catch (error) {
      toast.error("Failed to log out.");
      setLogoutLoading(false);
    }
  };

  return (
    // CRITICAL FIX: h-screen and overflow-hidden locks the entire app frame
    <div className="h-screen bg-[#0F172A] text-slate-300 flex overflow-hidden font-sans selection:bg-emerald-500 selection:text-white relative">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── SIDEBAR (Fixed) ── */}
      <aside className={`fixed lg:static z-50 w-72 h-full shrink-0 bg-[#0F172A] border-r border-slate-800 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-8 shrink-0">
          <div className="flex items-center justify-between mb-8">
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
        </div>

        {/* Sidebar Scrollable Area (In case menu gets long) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-8 pb-8 space-y-8">
          
          <nav className="space-y-2">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 pl-4">Core</p>
            <NavBtn active={currentPath === "/admin"} onClick={() => { navigate("/admin"); setSidebarOpen(false); }} icon={LayoutDashboard} label="Command Center" />
            <NavBtn active={currentPath === "/admin/users"} onClick={() => { navigate("/admin/users"); setSidebarOpen(false); }} icon={Users} label="User Registry" />
            {/* <NavBtn active={currentPath === "/admin/support"} onClick={() => { navigate("/admin/support"); setSidebarOpen(false); }} icon={MessageSquare} label="Support Desk" /> */}
          </nav>

          <nav className="space-y-2">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 pl-4">Operations</p>
            <NavBtn active={currentPath === "/admin/billing"} onClick={() => { navigate("/admin/billing"); setSidebarOpen(false); }} icon={CreditCard} label="Revenue / Billing" />
            <NavBtn active={currentPath === "/admin/gifts"}   onClick={() => { navigate("/admin/gifts");   setSidebarOpen(false); }} icon={Gift}      label="Gift Users" />
            <NavBtn active={currentPath === "/admin/broadcasts"} onClick={() => { navigate("/admin/broadcasts"); setSidebarOpen(false); }} icon={Radio} label="Broadcasts" />
            <NavBtn active={currentPath === "/admin/system"} onClick={() => { navigate("/admin/system"); setSidebarOpen(false); }} icon={Activity} label="System Metrics" />
          </nav>

          <nav className="space-y-2">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 pl-4">Security</p>
            <NavBtn active={currentPath === "/admin/audit"} onClick={() => { navigate("/admin/audit"); setSidebarOpen(false); }} icon={FileBox} label="Audit Logs" />
            <NavBtn active={currentPath === "/admin/settings"} onClick={() => { navigate("/admin/settings"); setSidebarOpen(false); }} icon={Settings} label="Global Settings" />
          </nav>

        </div>

        {/* Logout Button (Fixed at bottom of sidebar) */}
        <div className="shrink-0 p-8 border-t border-slate-800">
          <button 
            onClick={() => setShowLogoutModal(true)} 
            className="w-full flex items-center gap-3 px-4 py-4 text-red-400 hover:bg-red-500/10 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all group outline-none"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> Terminate Session
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA (Flex Column) ── */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0B1120]">
        
        {/* GLOBAL ADMIN HEADER (Fixed) */}
        <header className="shrink-0 z-30 bg-[#0B1120]/80 backdrop-blur-xl border-b border-slate-800 px-8 py-5 flex justify-between items-center">
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
            <button onClick={() => navigate('/admin/support')} className="relative group cursor-pointer outline-none">
              <Bell size={20} className="text-slate-400 group-hover:text-white transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>
            
            <div className="h-8 w-px bg-slate-800"></div>
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-white">Super Admin</div>
                <div className="text-[9px] font-mono text-slate-500">{user?.vendor?.shop_name || "HQ"}</div>
              </div>
              <div className="w-10 h-10 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center">
                <Lock size={16} className="text-slate-400" />
              </div>
            </div>
          </div>
        </header>

        {/* ── THE MAGIC OUTLET (Scrollable independent area) ── */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
            <Outlet />
          </div>
        </div>

      </main>

      {/* ── TERMINATE SESSION MODAL ── */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0B1120]/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0F172A] border border-slate-800 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative zoom-in-95 animate-in duration-200 text-center">
            
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={28} className="text-red-500" />
            </div>
            
            <h3 className="text-2xl font-black text-white tracking-tighter mb-2">Terminate Session?</h3>
            <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">
              You are about to log out of the Admin Command Center. Are you sure you want to proceed?
            </p>

            <div className="flex gap-4">
              <button 
                onClick={() => setShowLogoutModal(false)}
                disabled={logoutLoading}
                className="flex-1 p-4 rounded-2xl font-bold text-xs uppercase tracking-widest text-slate-400 bg-slate-800/50 hover:bg-slate-800 hover:text-white transition-colors outline-none"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout}
                disabled={logoutLoading}
                className="flex-1 p-4 rounded-2xl font-bold text-xs uppercase tracking-widest text-white bg-red-500 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 outline-none disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {logoutLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Log Out"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// Sidebar Button Component
function NavBtn({ active, onClick, icon: Icon, label }) {
  return (
    <button 
      onClick={onClick} 
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-300 group outline-none ${
        active 
          ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/20" 
          : "text-slate-500 hover:bg-slate-900 hover:text-white"
      }`}
    >
      <Icon size={18} className={`${active ? "text-white" : "text-slate-600 group-hover:text-white"} transition-colors`} />
      {label}
    </button>
  );
}