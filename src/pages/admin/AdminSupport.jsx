import { useState, useEffect, useMemo } from "react";
import { 
  Search, Mail, Clock, CheckCircle, Send, Archive, 
  User, MessageSquare, AlertCircle
} from "lucide-react";
import { toast } from "react-hot-toast";
import { supabase } from "../../supabaseClient";

export default function AdminSupport() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'open', 'replied', 'closed'
  
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load support tickets.");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return toast.error("Enter a reply first.");
    setActionLoading(true);
    
    try {
      const { error } = await supabase
        .from("support_tickets")
        .update({ 
          admin_reply: replyText.trim(),
          status: 'replied' 
        })
        .eq("id", selectedTicket.id);

      if (error) throw error;

      // Update local state
      const updatedTicket = { ...selectedTicket, admin_reply: replyText.trim(), status: 'replied' };
      setTickets(prev => prev.map(t => t.id === selectedTicket.id ? updatedTicket : t));
      setSelectedTicket(updatedTicket);
      setReplyText("");
      
      toast.success("Reply saved! (Email integration pending)");
    } catch (err) {
      toast.error("Failed to send reply.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCloseTicket = async (ticketId) => {
    if (!window.confirm("Mark this ticket as closed?")) return;
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from("support_tickets")
        .update({ status: 'closed' })
        .eq("id", ticketId);

      if (error) throw error;

      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'closed' } : t));
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket(prev => ({ ...prev, status: 'closed' }));
      }
      toast.success("Ticket closed.");
    } catch (err) {
      toast.error("Failed to close ticket.");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredTickets = useMemo(() => {
    return tickets
      .filter(t => filter === "all" ? true : t.status === filter)
      .filter(t => 
        t.subject?.toLowerCase().includes(search.toLowerCase()) ||
        t.customer_email?.toLowerCase().includes(search.toLowerCase()) ||
        t.customer_name?.toLowerCase().includes(search.toLowerCase())
      );
  }, [tickets, search, filter]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-slate-800 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Loading Comm Link...</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      
      {/* HEADER & FILTERS */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-center bg-slate-900/50 p-4 rounded-[2rem] border border-slate-800 mb-6 shrink-0 shadow-xl">
        <div className="relative w-full xl:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={16} />
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search tickets..."
            className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm font-medium text-white outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600" 
          />
        </div>
        <div className="flex flex-wrap gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          {[
            { id: "all", label: "All Tickets", icon: MessageSquare },
            { id: "open", label: "Open", icon: AlertCircle },
            { id: "replied", label: "Replied", icon: CheckCircle },
            { id: "closed", label: "Closed", icon: Archive }
          ].map(f => (
            <button 
              key={f.id} 
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 transition-all outline-none ${
                filter === f.id 
                  ? "bg-slate-800 text-white shadow-lg" 
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <f.icon size={12} className={filter === f.id ? (f.id === 'open' ? 'text-amber-500' : f.id === 'replied' ? 'text-emerald-500' : 'text-slate-400') : ''} />
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN TWO-PANE LAYOUT */}
      <div className="flex-1 grid lg:grid-cols-12 gap-6 min-h-0">
        
        {/* ── LEFT PANE: TICKET LIST ── */}
        <div className="lg:col-span-4 bg-slate-900/50 border border-slate-800 rounded-[2.5rem] overflow-hidden flex flex-col shadow-xl">
          <div className="p-6 border-b border-slate-800 shrink-0">
            <h2 className="text-white font-black text-lg tracking-tight">Inbox</h2>
            <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-widest">{filteredTickets.length} messages</p>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {filteredTickets.length === 0 ? (
              <div className="text-center p-10 text-slate-600 font-black uppercase tracking-widest text-xs">No tickets found</div>
            ) : (
              <div className="space-y-2">
                {filteredTickets.map(ticket => (
                  <button 
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`w-full text-left p-5 rounded-[1.5rem] transition-all outline-none ${
                      selectedTicket?.id === ticket.id 
                        ? "bg-slate-800 border-emerald-500/30 border" 
                        : "bg-transparent border border-transparent hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-white font-bold text-sm truncate pr-2">{ticket.customer_name || 'Anonymous'}</span>
                      <StatusBadge status={ticket.status} />
                    </div>
                    <div className="text-slate-300 font-medium text-xs truncate mb-2">{ticket.subject}</div>
                    <div className="flex justify-between items-center text-slate-500">
                      <span className="text-[10px] font-mono truncate max-w-[120px]">{ticket.customer_email}</span>
                      <span className="text-[9px] font-black uppercase tracking-widest">
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT PANE: TICKET DETAILS & REPLY ── */}
        <div className="lg:col-span-8 bg-slate-900/50 border border-slate-800 rounded-[2.5rem] overflow-hidden flex flex-col shadow-xl relative">
          {!selectedTicket ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-700">
                <Mail size={24} className="text-slate-500" />
              </div>
              <h3 className="text-white font-black text-xl tracking-tight mb-2">Select a Ticket</h3>
              <p className="text-slate-500 text-sm font-medium max-w-xs">
                Choose a message from the inbox to view details and send a reply.
              </p>
            </div>
          ) : (
            <>
              {/* Ticket Header */}
              <div className="p-8 border-b border-slate-800 shrink-0 bg-slate-950/30 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tighter mb-4">{selectedTicket.subject}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-slate-500" /> {selectedTicket.customer_name || 'Anonymous'}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-slate-500" /> {selectedTicket.customer_email}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock size={14} /> {new Date(selectedTicket.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={selectedTicket.status} />
                  {selectedTicket.status !== 'closed' && (
                    <button 
                      onClick={() => handleCloseTicket(selectedTicket.id)}
                      disabled={actionLoading}
                      className="p-2.5 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/30 rounded-xl transition-all outline-none"
                      title="Close Ticket"
                    >
                      <Archive size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                
                {/* Customer Message */}
                <div className="flex gap-4 max-w-3xl">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                    <User size={16} className="text-slate-400" />
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl rounded-tl-sm p-5 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedTicket.message}
                  </div>
                </div>

                {/* Admin Reply (If exists) */}
                {selectedTicket.admin_reply && (
                  <div className="flex gap-4 max-w-3xl ml-auto flex-row-reverse">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30">
                      <ShieldCheck size={16} className="text-emerald-500" />
                    </div>
                    <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-2xl rounded-tr-sm p-5 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedTicket.admin_reply}
                    </div>
                  </div>
                )}
              </div>

              {/* Reply Box */}
              {selectedTicket.status !== 'closed' ? (
                <div className="p-6 border-t border-slate-800 shrink-0 bg-slate-950/50">
                  <div className="relative">
                    <textarea 
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Type your reply here..."
                      className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-2xl p-5 pr-16 text-sm text-white placeholder:text-slate-500 outline-none resize-none min-h-[120px] transition-colors"
                    />
                    <button 
                      onClick={handleReply}
                      disabled={actionLoading || !replyText.trim()}
                      className="absolute bottom-4 right-4 w-10 h-10 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl flex items-center justify-center transition-colors outline-none shadow-lg shadow-emerald-500/20"
                    >
                      <Send size={16} className="ml-1" />
                    </button>
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-3 ml-2 flex items-center gap-2">
                    <CheckCircle size={12} className="text-emerald-500"/> Message will be saved to secure database
                  </p>
                </div>
              ) : (
                <div className="p-6 border-t border-slate-800 shrink-0 bg-slate-950/50 flex items-center justify-center">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <Archive size={14} /> This ticket has been closed
                  </p>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}

// Small helper component for the status tags
function StatusBadge({ status }) {
  switch (status) {
    case 'open':
      return <span className="px-2.5 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-lg text-[9px] font-black uppercase tracking-widest">Open</span>;
    case 'replied':
      return <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[9px] font-black uppercase tracking-widest">Replied</span>;
    case 'closed':
      return <span className="px-2.5 py-1 bg-slate-800 text-slate-400 border border-slate-700 rounded-lg text-[9px] font-black uppercase tracking-widest">Closed</span>;
    default:
      return null;
  }
}