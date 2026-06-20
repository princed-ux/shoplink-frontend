import { useState, useEffect } from "react";
import { Database, Cpu, HardDrive, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "../../supabaseClient";

export default function SystemHealthView() {
  // 'checking' | 'operational' | 'degraded'
  const [health, setHealth] = useState({
    database: 'checking',
    auth: 'checking',
    storage: 'checking',
    edge: 'operational', // Edge functions usually share DB uptime, hard to ping directly without a dummy function
    realtime: 'checking'
  });

  useEffect(() => {
    let isMounted = true;

    const runDiagnostics = async () => {
      // 1. Check Database (Ping a lightweight table)
      const { error: dbError } = await supabase.from('platform_settings').select('id').limit(1);
      
      // 2. Check Auth Service (Ping session)
      const { error: authError } = await supabase.auth.getSession();
      
      // 3. Check Storage (Ping buckets)
      const { error: storageError } = await supabase.storage.listBuckets();

      // 4. Check Realtime (Check WebSocket connection status)
      const realtimeStatus = supabase.realtime.isConnected() ? null : new Error("Disconnected");

      if (isMounted) {
        setHealth({
          database: dbError ? 'degraded' : 'operational',
          auth: authError ? 'degraded' : 'operational',
          storage: storageError ? 'degraded' : 'operational',
          edge: 'operational', // Assuming operational if DB is up
          realtime: realtimeStatus ? 'degraded' : 'operational'
        });
      }
    };

    // Run immediately
    runDiagnostics();

    // Ping the servers every 30 seconds to keep the dashboard live
    const interval = setInterval(runDiagnostics, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const getStatusBadge = (status) => {
    if (status === 'checking') {
      return (
        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-400 px-3 py-1.5 bg-blue-500/10 rounded-full border border-blue-500/20">
          <Loader2 size={12} className="animate-spin" /> Pinging...
        </span>
      );
    }
    if (status === 'degraded') {
      return (
        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-400 px-3 py-1.5 bg-red-500/10 rounded-full border border-red-500/20">
          <AlertTriangle size={12} /> Outage
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-400 px-3 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
        <CheckCircle2 size={12} /> Operational
      </span>
    );
  };

  const getStatusColor = (status) => {
    if (status === 'checking') return 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]';
    if (status === 'degraded') return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse';
    return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]';
  };

  // Determine overall system status for the Radar
  const isAllGood = Object.values(health).every(s => s === 'operational');
  const isChecking = Object.values(health).some(s => s === 'checking');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full pb-10">
      
      <div className="mb-8">
        <h2 className="text-2xl font-black text-white tracking-tighter">System Metrics</h2>
        <p className="text-slate-500 text-sm font-medium mt-1">Live telemetry and infrastructure ping test.</p>
      </div>

      <div className="grid xl:grid-cols-2 gap-8">
        
        {/* Supabase Services Card */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-10 shadow-xl">
          <h4 className="text-white font-black uppercase tracking-widest text-sm mb-8 flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Database size={18} className="text-emerald-500" />
            </div>
            Supabase Microservices
          </h4>
          <div className="space-y-4">
            
            <div className="flex items-center justify-between p-5 bg-slate-950 rounded-2xl border border-slate-800 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(health.database)}`}></div>
                <span className="text-sm font-bold text-slate-300">PostgreSQL Database</span>
              </div>
              {getStatusBadge(health.database)}
            </div>

            <div className="flex items-center justify-between p-5 bg-slate-950 rounded-2xl border border-slate-800 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(health.storage)}`}></div>
                <span className="text-sm font-bold text-slate-300">Object Storage</span>
              </div>
              {getStatusBadge(health.storage)}
            </div>

            <div className="flex items-center justify-between p-5 bg-slate-950 rounded-2xl border border-slate-800 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(health.auth)}`}></div>
                <span className="text-sm font-bold text-slate-300">Auth Service</span>
              </div>
              {getStatusBadge(health.auth)}
            </div>

            <div className="flex items-center justify-between p-5 bg-slate-950 rounded-2xl border border-slate-800 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(health.realtime)}`}></div>
                <span className="text-sm font-bold text-slate-300">Realtime WebSockets</span>
              </div>
              {getStatusBadge(health.realtime)}
            </div>

          </div>
        </div>
        
        {/* System Status Radar Card */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-10 shadow-xl flex flex-col">
          <h4 className="text-white font-black uppercase tracking-widest text-sm mb-8 flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Cpu size={18} className="text-purple-500" />
            </div>
            Server Radar
          </h4>
          <div className="flex-1 relative min-h-[300px] bg-slate-950 rounded-3xl border border-slate-800 flex items-center justify-center overflow-hidden">
            
            {/* Radar Sweep Effect */}
            <div className="absolute inset-0 border-[0.5px] border-emerald-500/10 rounded-full w-[150%] h-[150%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute inset-0 border-[0.5px] border-emerald-500/10 rounded-full w-[100%] h-[100%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute inset-0 border-[0.5px] border-emerald-500/10 rounded-full w-[50%] h-[50%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

            <div className="text-center relative z-10 bg-slate-950/80 p-6 rounded-3xl backdrop-blur-sm">
              <HardDrive size={56} className={`mx-auto mb-6 ${isAllGood ? 'text-emerald-500' : isChecking ? 'text-blue-500 animate-pulse' : 'text-red-500'}`} />
              <p className={`text-sm font-black uppercase tracking-widest ${isAllGood ? 'text-slate-300' : 'text-red-400'}`}>
                {isChecking ? 'Running Diagnostics...' : isAllGood ? 'All Systems Operational' : 'System Outage Detected'}
              </p>
              <p className="text-slate-500 font-bold text-xs mt-2 uppercase tracking-widest">Network Telemetry Active</p>
            </div>
            
            {/* Decorative pinging nodes simulating server activity */}
            <div className={`absolute top-12 left-12 w-3 h-3 rounded-full animate-ping ${isAllGood ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
            <div className={`absolute bottom-24 right-24 w-2 h-2 rounded-full animate-ping delay-700 ${isAllGood ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
            <div className={`absolute top-1/2 left-1/4 w-2 h-2 rounded-full animate-ping delay-300 ${isAllGood ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
          </div>
        </div>

      </div>
    </div>
  );
}