import { useState, useEffect } from "react";
import { 
  Settings, AlertTriangle, Power, Lock, 
  Save, RefreshCw, ShieldAlert, Globe, MessageCircle, ShieldCheck, Tag
} from "lucide-react";
import { toast } from "react-hot-toast";
import { supabase } from "../../supabaseClient";

// 1. ADD THE USER PROP HERE
export default function AdminSettings({ user }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("platform_settings")
        .select("*")
        .eq("id", 1)
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (err) {
      toast.error("Failed to load platform settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Save the actual settings to the database
      const { error } = await supabase
        .from("platform_settings")
        .update({
          maintenance_mode: settings.maintenance_mode,
          maintenance_message: settings.maintenance_message,
          allow_new_signups: settings.allow_new_signups,
          enable_live_chat: settings.enable_live_chat,
          force_store_watermark: settings.force_store_watermark,
          require_email_verification: settings.require_email_verification,
          updated_at: new Date().toISOString(),
        })
        .eq("id", 1);

      if (error) throw error;

      // 2. THE AUDIT LOG: Record exactly who did this!
      await supabase.from('audit_logs').insert([{
        action_type: 'system',
        description: `Updated global settings. Maintenance Mode: ${settings.maintenance_mode ? 'ON' : 'OFF'}`,
        admin_id: user?.id 
      }]);

      toast.success("Global configurations deployed to all servers.");
    } catch (err) {
      toast.error("Failed to deploy settings.");
    } finally {
      setSaving(false);
    }
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading || !settings) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-slate-800 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Accessing Core Variables...</p>
      </div>
    );
  }

  // Helper component for the cool toggle switches
  const ToggleSwitch = ({ checked, onClick, danger = false }) => (
    <button 
      onClick={onClick}
      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors outline-none focus:ring-4 ${
        checked 
          ? (danger ? 'bg-red-500 focus:ring-red-500/20' : 'bg-emerald-500 focus:ring-emerald-500/20') 
          : 'bg-slate-800 border border-slate-700 focus:ring-slate-500/20'
      }`}
    >
      <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
        checked ? 'translate-x-7' : 'translate-x-1'
      }`} />
    </button>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full pb-10">
      
      {/* ── HEADER & SAVE STRIP ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-slate-900/50 p-6 rounded-[2rem] border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
            <Settings className="text-emerald-500" /> Global Parameters
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Master configurations affecting all vendors and users.</p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest hidden xl:flex items-center gap-2">
            <RefreshCw size={12} /> Last deploy: {new Date(settings.updated_at).toLocaleString()}
          </p>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-[0.98] shadow-xl shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-3 outline-none"
          >
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save size={16} />}
            Deploy Changes
          </button>
        </div>
      </div>

      <div className="grid xl:grid-cols-2 gap-8">
        
        {/* ── SECTOR 1: CORE INFRASTRUCTURE (KILL SWITCHES) ── */}
        <div className="space-y-6">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-4">Core Infrastructure</h3>
          
          <div className={`border rounded-[2.5rem] p-8 shadow-xl transition-all duration-500 relative overflow-hidden ${
            settings.maintenance_mode ? "bg-red-950/20 border-red-500/30" : "bg-slate-900/50 border-slate-800"
          }`}>
            {settings.maintenance_mode && <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl rounded-full pointer-events-none"></div>}
            
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className={`p-4 rounded-2xl ${settings.maintenance_mode ? "bg-red-500/20 text-red-500" : "bg-slate-800 text-slate-400"}`}>
                <Power size={28} />
              </div>
              <ToggleSwitch checked={settings.maintenance_mode} onClick={() => toggleSetting('maintenance_mode')} danger={true} />
            </div>
            <h3 className={`text-2xl font-black mb-2 tracking-tight ${settings.maintenance_mode ? "text-red-400" : "text-white"}`}>
              System Kill Switch (Maintenance)
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Instantly terminates all active vendor sessions and locks down public storefronts. Real-time WebSocket override.
            </p>
            
            {settings.maintenance_mode && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label className="block text-[10px] font-black text-red-400 uppercase tracking-widest mb-2">Public Intercept Message</label>
                <textarea 
                  value={settings.maintenance_message}
                  onChange={(e) => setSettings({...settings, maintenance_message: e.target.value})}
                  className="w-full bg-red-950/40 border border-red-500/20 focus:border-red-500 rounded-2xl p-4 text-sm text-red-200 placeholder:text-red-500/50 outline-none resize-none min-h-[100px] transition-colors"
                />
              </div>
            )}
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 shadow-xl">
            <div className="flex items-start justify-between mb-6">
              <div className={`p-3 rounded-2xl ${!settings.allow_new_signups ? "bg-amber-500/20 text-amber-500" : "bg-emerald-500/20 text-emerald-500"}`}>
                {settings.allow_new_signups ? <Globe size={24} /> : <Lock size={24} />}
              </div>
              <ToggleSwitch checked={settings.allow_new_signups} onClick={() => toggleSetting('allow_new_signups')} />
            </div>
            <h3 className="text-xl font-black text-white mb-2 tracking-tight">Allow New Registrations</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Toggle the `/register` endpoint. Disable this to enforce an invite-only beta or throttle server load.
            </p>
          </div>
        </div>

        {/* ── SECTOR 2: STOREFRONT & SECURITY RULES ── */}
        <div className="space-y-6">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-4">Platform & Security Rules</h3>

          {/* Storefront Watermark */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 shadow-xl">
            <div className="flex items-start justify-between mb-6">
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                <Tag size={24} />
              </div>
              <ToggleSwitch checked={settings.force_store_watermark} onClick={() => toggleSetting('force_store_watermark')} />
            </div>
            <h3 className="text-xl font-black text-white mb-2 tracking-tight">Force Platform Watermark</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Enforces the "Powered by ShopLinkVi" badge on the footer of all vendor storefronts. Crucial for viral growth on the free tier.
            </p>
          </div>

          {/* Global Support Chat */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 shadow-xl">
            <div className="flex items-start justify-between mb-6">
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500">
                <MessageCircle size={24} />
              </div>
              <ToggleSwitch checked={settings.enable_live_chat} onClick={() => toggleSetting('enable_live_chat')} />
            </div>
            <h3 className="text-xl font-black text-white mb-2 tracking-tight">Global Support Widget</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Toggles the floating ViChat/Support widget across the entire platform (Admin, Vendor Dashboard, and Public pages).
            </p>
          </div>

          {/* Strict Verification */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 shadow-xl">
            <div className="flex items-start justify-between mb-6">
              <div className={`p-3 rounded-2xl ${settings.require_email_verification ? "bg-emerald-500/20 text-emerald-500" : "bg-slate-800 text-slate-500"}`}>
                <ShieldCheck size={24} />
              </div>
              <ToggleSwitch checked={settings.require_email_verification} onClick={() => toggleSetting('require_email_verification')} />
            </div>
            <h3 className="text-xl font-black text-white mb-2 tracking-tight">Strict Email Verification</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Blocks vendors from publishing their storefront until their email address is verified via OTP or link.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}