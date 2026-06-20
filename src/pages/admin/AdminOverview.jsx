import { useState, useEffect } from "react";
import {
  Users,
  ShoppingBag,
  Eye,
  Database,
  HardDrive,
  Zap,
  Server,
  Activity,
  ArrowUpRight,
  UserCheck,
  Clock,
  Globe,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { supabase } from "../../supabaseClient";
import GeoMap from "../../components/GeoMap";

// ── SYSTEM LIMITS (Change these when you upgrade Supabase Plans!) ──
const SYSTEM_LIMITS = {
  MAU: 50000, // Free: 50K | Pro: 100,000
  DB_SIZE_MB: 500, // Free: 500MB | Pro: 8000MB (8GB)
  STORAGE_MB: 1024, // Free: 1GB | Pro: 100GB (102400MB)
};

export default function AdminOverview() {
  const [metrics, setMetrics] = useState({
    totalVendors: 0,
    totalProducts: 0,
    monthlyActive: 0,
    traffic: {
      total_views: 0,
      unique_visitors: 0,
      today_views: 0,
      returning_visitors: 0,
    },
    dbSizeBytes: 0,
    storageBytes: 0,
  });
  const [vendorMapData, setVendorMapData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGodModeData = async () => {
      try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const [vendorsRes, productsRes, trafficRes, dbSizeRes, storageRes, mauRes] =
          await Promise.all([
            supabase.from("vendors").select("id, country", { count: "exact" }),
            supabase.from("products").select("id", { count: "exact" }),
            supabase.rpc("get_traffic_metrics"),
            supabase.rpc("get_database_size_bytes"),
            supabase.rpc("get_storage_size_bytes"),
            supabase.from("storefront_views").select("vendor_id", { count: "exact", head: true }).gte("created_at", thirtyDaysAgo),
          ]);

        if (vendorsRes.error) throw vendorsRes.error;

        // Process vendor data for map
        const countryCount = {};
        if (vendorsRes.data) {
          vendorsRes.data.forEach((vendor) => {
            const country = vendor.country || "NG";
            countryCount[country] = (countryCount[country] || 0) + 1;
          });
        }

        // Import countries data to get lat/lng
        const { COUNTRIES } = await import("../../data/countries.js");
        const mapData = Object.entries(countryCount).map(([code, count]) => {
          const countryData = COUNTRIES.find((c) => c.code === code);
          return {
            name: countryData?.name || code,
            code: code,
            flag: countryData?.flag || "🌍",
            lat: countryData?.lat || 0,
            lng: countryData?.lng || 0,
            count: count,
            value: `${count} ${count === 1 ? "vendor" : "vendors"}`,
          };
        });

        setVendorMapData(mapData);

        setMetrics({
          totalVendors: vendorsRes.count || 0,
          totalProducts: productsRes.count || 0,
          monthlyActive: mauRes.count || 0,
          traffic: trafficRes.data || {
            total_views: 0,
            unique_visitors: 0,
            today_views: 0,
            returning_visitors: 0,
          },
          dbSizeBytes: dbSizeRes.data || 0,
          storageBytes: storageRes.data || 0,
        });
      } catch (err) {
        console.error("God Mode Fetch Error:", err);
        toast.error("Failed to sync HQ metrics.");
      } finally {
        setLoading(false);
      }
    };

    fetchGodModeData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-slate-800 border-t-emerald-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 border-4 border-transparent border-l-purple-500 rounded-full animate-spin direction-reverse"></div>
        </div>
        <p className="mt-6 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">
          Compiling HQ Data...
        </p>
      </div>
    );
  }

  // Conversion Helpers
  const dbSizeMB = (metrics.dbSizeBytes / (1024 * 1024)).toFixed(2);
  const storageMB = (metrics.storageBytes / (1024 * 1024)).toFixed(2);

  const authPct = Math.min(
    (metrics.totalVendors / SYSTEM_LIMITS.MAU) * 100,
    100,
  ).toFixed(1);
  const dbPct = Math.min(
    (dbSizeMB / SYSTEM_LIMITS.DB_SIZE_MB) * 100,
    100,
  ).toFixed(1);
  const storagePct = Math.min(
    (storageMB / SYSTEM_LIMITS.STORAGE_MB) * 100,
    100,
  ).toFixed(1);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full pb-10">
      {/* ── THE EYE: PLATFORM ENTITIES ── */}
      <div className="mb-2">
        <h2 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
          <Activity className="text-emerald-500" /> Platform Growth
        </h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
          Core active entities
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <MetricCard
          title="Registered Stores"
          value={metrics.totalVendors}
          icon={Users}
          color="emerald"
          sub="Total vendor accounts"
        />
        <MetricCard
          title="Monthly Active"
          value={metrics.monthlyActive}
          icon={Zap}
          color="blue"
          sub="Stores active in last 30 days"
        />
        <MetricCard
          title="Products Hosted"
          value={metrics.totalProducts}
          icon={ShoppingBag}
          color="purple"
          sub="Across all storefronts"
        />
      </div>

      {/* ── THE EYE: TRAFFIC & ANALYTICS ── */}
      <div className="mt-8 mb-2 pt-8 border-t border-slate-800">
        <h2 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
          <Globe className="text-blue-500" /> Traffic Control
        </h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
          Global visitor analytics
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="All-Time Page Views"
          value={metrics.traffic.total_views}
          icon={Eye}
          color="blue"
          sub="Every single click"
        />
        <MetricCard
          title="Today's Traffic"
          value={metrics.traffic.today_views}
          icon={Clock}
          color="amber"
          sub="Views in last 24h"
        />
        <MetricCard
          title="Total Unique Visitors"
          value={metrics.traffic.unique_visitors}
          icon={Server}
          color="slate"
          sub="Distinct devices tracked"
        />
        <MetricCard
          title="Returning Loyalists"
          value={metrics.traffic.returning_visitors}
          icon={UserCheck}
          color="emerald"
          sub="Visited on multiple days"
        />
      </div>

      {/* ── SUPABASE QUOTA RADAR ── */}
      <div className="mt-12 mb-2 pt-8 border-t border-slate-800">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
              <Database className="text-emerald-500" /> Infrastructure Quotas
            </h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
              Live limits monitoring
            </p>
          </div>
          {/* Quick note on upgrading */}
          <span className="text-[10px] font-bold text-slate-500 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 hidden sm:block">
            Update{" "}
            <span className="text-emerald-500 font-mono">SYSTEM_LIMITS</span> in
            code when upgrading plan.
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Database Size */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8 relative overflow-hidden group hover:border-slate-700 transition-colors shadow-xl">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center border text-blue-500 bg-blue-500/10 border-blue-500/20">
              <HardDrive size={24} />
            </div>
            <div className="px-3 py-1 bg-slate-950 rounded-full border border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {dbPct}% Used
            </div>
          </div>
          <h3 className="text-3xl font-black text-white tracking-tighter mb-1">
            {dbSizeMB} <span className="text-lg text-slate-500">MB</span>
          </h3>
          <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-6">
            Postgres Database / {SYSTEM_LIMITS.DB_SIZE_MB}MB
          </p>
          <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${dbPct > 80 ? "bg-red-500" : "bg-blue-500"}`}
              style={{ width: `${dbPct}%` }}
            ></div>
          </div>
        </div>

        {/* Object Storage */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8 relative overflow-hidden group hover:border-slate-700 transition-colors shadow-xl">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center border text-purple-500 bg-purple-500/10 border-purple-500/20">
              <Database size={24} />
            </div>
            <div className="px-3 py-1 bg-slate-950 rounded-full border border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {storagePct}% Used
            </div>
          </div>
          <h3 className="text-3xl font-black text-white tracking-tighter mb-1">
            {storageMB} <span className="text-lg text-slate-500">MB</span>
          </h3>
          <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-6">
            Image Storage / {SYSTEM_LIMITS.STORAGE_MB}MB
          </p>
          <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${storagePct > 80 ? "bg-red-500" : "bg-purple-500"}`}
              style={{ width: `${storagePct}%` }}
            ></div>
          </div>
        </div>

        {/* Auth Limits */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8 relative overflow-hidden group hover:border-slate-700 transition-colors shadow-xl">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center border text-emerald-500 bg-emerald-500/10 border-emerald-500/20">
              <Users size={24} />
            </div>
            <div className="px-3 py-1 bg-slate-950 rounded-full border border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {authPct}% Used
            </div>
          </div>
          <h3 className="text-3xl font-black text-white tracking-tighter mb-1">
            {metrics.totalVendors}{" "}
            <span className="text-lg text-slate-500">Users</span>
          </h3>
          <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-6">
            Active Auth / {SYSTEM_LIMITS.MAU.toLocaleString()}
          </p>
          <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${authPct > 80 ? "bg-red-500" : "bg-emerald-500"}`}
              style={{ width: `${authPct}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* ── VENDOR DISTRIBUTION MAP ── */}
      <div className="mt-12 mb-2 pt-8 border-t border-slate-800">
        <h2 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
          <Globe className="text-emerald-500" /> Global Vendor Distribution
        </h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
          Live vendor locations
        </p>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8 overflow-hidden">
        <GeoMap
          data={vendorMapData}
          title="Vendor Locations Worldwide"
          height="500px"
        />
      </div>
    </div>
  );
}

/* --- SUB-COMPONENTS --- */
function MetricCard({ title, value, icon: Icon, color, sub }) {
  const colorMap = {
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    purple: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    amber: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    slate: "text-slate-400 bg-slate-800 border-slate-700",
  };
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-slate-700 transition-colors shadow-xl flex flex-col justify-between">
      <div className="flex justify-between items-start mb-6">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${colorMap[color]} group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon size={24} />
        </div>
        <ArrowUpRight
          size={20}
          className="text-slate-700 group-hover:text-slate-400 transition-colors"
        />
      </div>
      <div>
        <h3 className="text-4xl font-black text-white tracking-tighter mb-1">
          {value.toLocaleString()}
        </h3>
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
          {title}
        </p>
        <p className="text-[9px] font-bold text-slate-600 mt-2">{sub}</p>
      </div>
    </div>
  );
}
