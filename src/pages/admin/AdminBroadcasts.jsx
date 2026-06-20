import { useState, useEffect } from "react";
import {
  Radio,
  Send,
  AlertTriangle,
  Info,
  CheckCircle,
  Power,
  Trash2,
  Megaphone,
  Clock,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { supabase } from "../../supabaseClient";

export default function AdminBroadcasts({ user }) {
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [broadcastToDelete, setBroadcastToDelete] = useState(null);

  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "announcement",
  });

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  const fetchBroadcasts = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("broadcasts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setBroadcasts(data || []);
    } catch (err) {
      console.error("[Broadcast] Fetch history error:", err);
      toast.error("Failed to load broadcast history.");
    } finally {
      setLoading(false);
    }
  };

  const sendExpoBroadcastPush = async ({ title, message, type }) => {
    const { data, error } = await supabase.rpc(
      "send_broadcast_push_notification",
      {
        p_title: title,
        p_message: message,
        p_type: type,
      }
    );

    if (error) throw error;

    console.log("[Broadcast Push] Supabase RPC response:", data);

    return {
      totalTokens: Number(data?.totalTokens || 0),
      successCount: Number(data?.successCount || 0),
      errorCount: Number(data?.errorCount || 0),
    };
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();

    const title = form.title.trim();
    const message = form.message.trim();
    const type = form.type;

    if (!title || !message) {
      toast.error("Title and message are required.");
      return;
    }

    setSubmitting(true);

    try {
      const { data: newBroadcast, error } = await supabase
        .from("broadcasts")
        .insert([
          {
            title,
            message,
            type,
            is_active: true,
            author_id: user?.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const pushResult = await sendExpoBroadcastPush({
        title,
        message,
        type,
      });

      await supabase.from("audit_logs").insert([
        {
          action_type: "broadcast",
          description: `Transmitted a new ${type}: "${title}". Push success: ${pushResult.successCount}, failed: ${pushResult.errorCount}, tokens: ${pushResult.totalTokens}`,
          admin_id: user?.id,
          metadata: {
            title,
            type,
            push_total_tokens: pushResult.totalTokens,
            push_success_count: pushResult.successCount,
            push_error_count: pushResult.errorCount,
          },
        },
      ]);

      setBroadcasts((prev) => [newBroadcast, ...prev]);
      setForm({ title: "", message: "", type: "announcement" });

      if (pushResult.totalTokens === 0) {
        toast.error(
          "Broadcast saved, but no devices are registered for push yet. Open the updated mobile app and log in once."
        );
      } else if (pushResult.errorCount > 0) {
        toast.success(
          `Broadcast saved. Push sent to ${pushResult.successCount}, failed for ${pushResult.errorCount}.`
        );
      } else {
        toast.success(
          `Broadcast sent to ${pushResult.successCount} vendor device(s).`
        );
      }
    } catch (err) {
      console.error("[Broadcast] Error:", err);
      toast.error(err.message || "Failed to send broadcast.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (id, currentStatus, title) => {
    try {
      const { error } = await supabase
        .from("broadcasts")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      await supabase.from("audit_logs").insert([
        {
          action_type: "broadcast",
          description: `${
            !currentStatus ? "Reactivated" : "Deactivated"
          } broadcast: "${title}"`,
          admin_id: user?.id,
        },
      ]);

      setBroadcasts((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, is_active: !currentStatus } : b
        )
      );

      toast.success(
        `Broadcast ${!currentStatus ? "activated" : "deactivated"}.`
      );
    } catch (err) {
      console.error("[Broadcast] Toggle error:", err);
      toast.error("Failed to update status.");
    }
  };

  const confirmDelete = (broadcast) => {
    setBroadcastToDelete(broadcast);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!broadcastToDelete) return;

    try {
      const { error } = await supabase
        .from("broadcasts")
        .delete()
        .eq("id", broadcastToDelete.id);

      if (error) throw error;

      await supabase.from("audit_logs").insert([
        {
          action_type: "broadcast",
          description: `Permanently deleted broadcast: "${broadcastToDelete.title}"`,
          admin_id: user?.id,
        },
      ]);

      setBroadcasts((prev) =>
        prev.filter((b) => b.id !== broadcastToDelete.id)
      );

      toast.success("Broadcast deleted.");
    } catch (err) {
      console.error("[Broadcast] Delete error:", err);
      toast.error("Failed to delete broadcast.");
    } finally {
      setDeleteModalOpen(false);
      setBroadcastToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-slate-800 border-t-emerald-500 rounded-full animate-spin" />
        <p className="mt-4 text-slate-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
          Loading Transmitter...
        </p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 w-full relative">
      <div className="mb-6 shrink-0">
        <h2 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
          <Radio className="text-emerald-500" /> Global Transmitter
        </h2>
        <p className="text-slate-500 text-sm font-medium mt-1">
          Beam announcements directly to every vendor&apos;s dashboard and
          device.
        </p>
      </div>

      <div className="flex-1 grid xl:grid-cols-12 gap-8 min-h-0">
        <div className="xl:col-span-5 bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 shadow-xl flex flex-col shrink-0 h-max">
          <h3 className="text-white font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-3">
            <Megaphone size={16} className="text-emerald-500" /> Compose
            Message
          </h3>

          <form onSubmit={handleBroadcast} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
                Broadcast Type
              </label>

              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    id: "announcement",
                    icon: Megaphone,
                    color: "text-emerald-500",
                    bg: "bg-emerald-500/10 border-emerald-500/20",
                  },
                  {
                    id: "info",
                    icon: Info,
                    color: "text-blue-500",
                    bg: "bg-blue-500/10 border-blue-500/20",
                  },
                  {
                    id: "success",
                    icon: CheckCircle,
                    color: "text-purple-500",
                    bg: "bg-purple-500/10 border-purple-500/20",
                  },
                  {
                    id: "warning",
                    icon: AlertTriangle,
                    color: "text-amber-500",
                    bg: "bg-amber-500/10 border-amber-500/20",
                  },
                ].map((typeOption) => (
                  <button
                    key={typeOption.id}
                    type="button"
                    onClick={() =>
                      setForm({ ...form, type: typeOption.id })
                    }
                    className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-2 border transition-all outline-none ${
                      form.type === typeOption.id
                        ? `${typeOption.bg} border-opacity-50 shadow-lg`
                        : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700"
                    }`}
                  >
                    <typeOption.icon
                      size={18}
                      className={form.type === typeOption.id ? typeOption.color : ""}
                    />

                    <span
                      className={`text-[10px] font-black uppercase tracking-widest ${
                        form.type === typeOption.id ? "text-white" : ""
                      }`}
                    >
                      {typeOption.id}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                Headline
              </label>

              <input
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                placeholder="e.g. ShopLinkVi Mobile App is Live!"
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-2xl p-4 text-sm font-bold text-white placeholder:text-slate-600 outline-none transition-colors"
                maxLength={60}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                Full Message
              </label>

              <textarea
                value={form.message}
                onChange={(e) =>
                  setForm({ ...form, message: e.target.value })
                }
                placeholder="Type your transmission here..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-2xl p-4 text-sm text-slate-300 placeholder:text-slate-600 outline-none resize-none min-h-[120px] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-[0.98] shadow-xl shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-3 outline-none"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={16} /> Transmit to all vendors
                </>
              )}
            </button>
          </form>
        </div>

        <div className="xl:col-span-7 bg-slate-900/50 border border-slate-800 rounded-[2.5rem] overflow-hidden flex flex-col shadow-xl">
          <div className="p-6 border-b border-slate-800 shrink-0 bg-slate-950/30 flex justify-between items-center">
            <h2 className="text-white font-black text-lg tracking-tight">
              Transmission Log
            </h2>

            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
              {broadcasts.length} Total
            </span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
            {broadcasts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                <Radio size={48} className="text-slate-700 mb-4" />
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                  No broadcasts sent yet
                </p>
              </div>
            ) : (
              broadcasts.map((b) => (
                <div
                  key={b.id}
                  className={`p-6 rounded-3xl border transition-all ${
                    b.is_active
                      ? "bg-slate-800/40 border-slate-700"
                      : "bg-slate-950/50 border-slate-800/50 opacity-60"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      {b.type === "announcement" && (
                        <Megaphone size={16} className="text-emerald-500" />
                      )}
                      {b.type === "info" && (
                        <Info size={16} className="text-blue-500" />
                      )}
                      {b.type === "success" && (
                        <CheckCircle size={16} className="text-purple-500" />
                      )}
                      {b.type === "warning" && (
                        <AlertTriangle size={16} className="text-amber-500" />
                      )}

                      <h4 className="text-white font-black text-base">
                        {b.title}
                      </h4>
                    </div>

                    <span
                      className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded border ${
                        b.is_active
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : "bg-slate-800 text-slate-500 border-slate-700"
                      }`}
                    >
                      {b.is_active ? "Live" : "Offline"}
                    </span>
                  </div>

                  <p className="text-sm text-slate-400 leading-relaxed mb-6 whitespace-pre-wrap">
                    {b.message}
                  </p>

                  <div className="flex justify-between items-center pt-4 border-t border-slate-800/50">
                    <div className="flex items-center gap-2 text-slate-500 text-[10px] font-mono">
                      <Clock size={12} />{" "}
                      {b.created_at
                        ? new Date(b.created_at).toLocaleString()
                        : "Unknown date"}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          toggleActive(b.id, b.is_active, b.title)
                        }
                        className={`p-2 rounded-xl border transition-colors outline-none ${
                          b.is_active
                            ? "bg-slate-800 border-slate-700 text-amber-500 hover:bg-amber-500/10 hover:border-amber-500/30"
                            : "bg-slate-800 border-slate-700 text-emerald-500 hover:bg-emerald-500/10 hover:border-emerald-500/30"
                        }`}
                        title={b.is_active ? "Deactivate" : "Reactivate"}
                      >
                        <Power size={14} />
                      </button>

                      <button
                        onClick={() => confirmDelete(b)}
                        className="p-2 bg-slate-800 border border-slate-700 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 rounded-xl transition-colors outline-none"
                        title="Delete Permanently"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {deleteModalOpen && broadcastToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0B1120]/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0F172A] border border-slate-800 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative zoom-in-95 animate-in duration-200 text-center overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-red-500/10 blur-3xl rounded-full pointer-events-none" />

            <button
              onClick={() => {
                setDeleteModalOpen(false);
                setBroadcastToDelete(null);
              }}
              className="absolute top-6 right-6 text-slate-500 hover:text-white bg-slate-800 p-2 rounded-full transition-colors outline-none z-10"
            >
              <X size={16} />
            </button>

            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <AlertTriangle size={28} className="text-red-500" />
            </div>

            <h3 className="text-2xl font-black text-white tracking-tighter mb-2 relative z-10">
              Delete Broadcast?
            </h3>

            <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed relative z-10">
              This transmission will be permanently erased from the server. This
              action cannot be undone.
            </p>

            <div className="flex gap-4 relative z-10">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setBroadcastToDelete(null);
                }}
                className="flex-1 p-4 rounded-2xl font-bold text-xs uppercase tracking-widest text-slate-400 bg-slate-800/50 hover:bg-slate-800 hover:text-white transition-colors outline-none"
              >
                Cancel
              </button>

              <button
                onClick={executeDelete}
                className="flex-1 p-4 rounded-2xl font-bold text-xs uppercase tracking-widest text-white bg-red-500 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 outline-none flex items-center justify-center"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}