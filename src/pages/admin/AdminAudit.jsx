import { useState, useEffect, useMemo } from "react";
import { 
  FileBox, Search, ShieldAlert, Users, 
  Settings, Radio, MessageSquare, Activity 
} from "lucide-react";
import { toast } from "react-hot-toast";
import { supabase } from "../../supabaseClient";

export default function AdminAudit() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("audit_logs")
        .select(`
          *,
          vendors:admin_id ( shop_name, email )
        `)
        .order("created_at", { ascending: false })
        .limit(100); // Fetch last 100 actions for performance

      if (error) throw error;
      setLogs(data || []);
    } catch (err) {
      toast.error("Failed to load security ledger.");
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = useMemo(() => {
    return logs
      .filter(l => filter === "all" ? true : l.action_type === filter)
      .filter(l => 
        l.description.toLowerCase().includes(search.toLowerCase()) ||
        l.vendors?.shop_name?.toLowerCase().includes(search.toLowerCase())
      );
  }, [logs, search, filter]);

  const getActionIcon = (type) => {
    switch(type) {
      case 'system': return <Settings size={14} className="text-blue-500" />;
      case 'security': return <ShieldAlert size={14} className="text-red-500" />;
      case 'user_management': return <Users size={14} className="text-emerald-500" />;
      case 'broadcast': return <Radio size={14} className="text-purple-500" />;
      case 'support': return <MessageSquare size={14} className="text-amber-500" />;
      default: return <Activity size={14} className="text-slate-500" />;
    }
  };

  const getActionBadge = (type) => {
    const base = "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border flex items-center gap-1.5 w-max";
    switch(type) {
      case 'system': return <span className={`${base} bg-blue-500/10 text-blue-400 border-blue-500/20`}>{getActionIcon(type)} System</span>;
      case 'security': return <span className={`${base} bg-red-500/10 text-red-400 border-red-500/20`}>{getActionIcon(type)} Security</span>;
      case 'user_management': return <span className={`${base} bg-emerald-500/10 text-emerald-400 border-emerald-500/20`}>{getActionIcon(type)} Users</span>;
      case 'broadcast': return <span className={`${base} bg-purple-500/10 text-purple-400 border-purple-500/20`}>{getActionIcon(type)} Broadcast</span>;
      case 'support': return <span className={`${base} bg-amber-500/10 text-amber-400 border-amber-500/20`}>{getActionIcon(type)} Support</span>;
      default: return <span className={`${base} bg-slate-800 text-slate-400 border-slate-700`}>Unknown</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-slate-800 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Decrypting Ledger...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-center bg-slate-900/50 p-6 rounded-[2rem] border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
            <FileBox className="text-emerald-500" /> Security Audit Logs
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Immutable ledger of all administrative actions.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
          <div className="relative w-full sm:w-64 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={16} />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Search logs..."
              className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm font-medium text-white outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600" 
            />
          </div>
          <select 
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="px-4 py-3 bg-slate-950 border border-slate-800 text-slate-300 font-bold text-xs uppercase tracking-widest rounded-2xl outline-none focus:border-emerald-500"
          >
            <option value="all">All Events</option>
            <option value="system">System</option>
            <option value="security">Security</option>
            <option value="user_management">Users</option>
            <option value="broadcast">Broadcasts</option>
          </select>
        </div>
      </div>

      {/* LEDGER TABLE */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-6">Timestamp (UTC)</th>
                <th className="px-8 py-6">Admin Identity</th>
                <th className="px-8 py-6">Event Category</th>
                <th className="px-8 py-6 w-1/2">Action Record</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors group">
                  
                  <td className="px-8 py-5">
                    <div className="text-xs font-mono text-slate-400 group-hover:text-emerald-400 transition-colors">
                      {new Date(log.created_at).toISOString().replace('T', ' ').substring(0, 19)}
                    </div>
                    <div className="text-[9px] font-mono text-slate-600 mt-1">ID: {log.id.split('-')[0]}</div>
                  </td>

                  <td className="px-8 py-5">
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <ShieldAlert size={14} className="text-slate-500" />
                      {log.vendors?.shop_name || "System Automated"}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 mt-1">{log.vendors?.email || "root@shoplinkvi.com"}</div>
                  </td>

                  <td className="px-8 py-5">
                    {getActionBadge(log.action_type)}
                  </td>

                  <td className="px-8 py-5">
                    <div className="text-sm text-slate-300 font-medium">
                      {log.description}
                    </div>
                    {/* If there is extra JSON metadata, display it as a code block */}
                    {Object.keys(log.metadata).length > 0 && (
                      <div className="mt-2 p-2 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-500 overflow-x-auto">
                        {JSON.stringify(log.metadata)}
                      </div>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredLogs.length === 0 && (
          <div className="p-24 text-center flex flex-col items-center justify-center">
            <FileBox size={32} className="text-slate-700 mb-4" />
            <span className="text-slate-600 font-black uppercase tracking-widest text-xs">Ledger is empty or no matches found</span>
          </div>
        )}
      </div>

    </div>
  );
}