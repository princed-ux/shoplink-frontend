import { useState } from "react";
import { Mail, ArrowLeft, X, Send, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { supabase } from "../supabaseClient";

const SHOPLINK_LOGO_URL = 'https://xofnbiypfsjyfdwrkgam.supabase.co/storage/v1/object/public/product-images/logos/shoplink.png';

export default function Suspended() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const handleAppealSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      return toast.error("Please fill out all fields.");
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "e3a027ea-2dec-4524-bd70-191712f776b1", // Your Web3Forms Key
          name: formData.name,
          email: formData.email,
          subject: `Store Appeal Request from ${formData.name}`,
          message: formData.message,
          from_name: "ShopLinkVi Web App",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      toast.error("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = "w-full bg-[#0B1120] border-2 border-slate-800 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-emerald-500 focus:bg-[#0B1120] focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder-slate-600 shadow-inner";

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-6 text-center font-sans selection:bg-emerald-500 selection:text-white relative">
      
      {/* Friendly Logo */}
      <div className="relative mb-8 shadow-2xl shadow-black/20 animate-in zoom-in duration-500">
        <img 
          src={SHOPLINK_LOGO_URL} 
          alt="ShopLink" 
          className="w-24 h-24 rounded-3xl bg-white object-contain border border-slate-200" 
        />
      </div>

      {/* Headline */}
      <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        Access Paused
      </h1>

      <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto leading-relaxed mb-10 font-medium animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
        Your dashboard has been temporarily paused for review. Don't worry—our team is here to help you sort this out quickly.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col w-full max-w-xs gap-4 mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-emerald-500/20 outline-none"
        >
          <Mail size={16} /> Contact Support
        </button>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 outline-none"
        >
          <ArrowLeft size={16} /> Sign Out
        </button>
      </div>

      {/* ── APPEAL MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#0f172a]/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#1e293b] w-full max-w-[500px] rounded-[2rem] shadow-2xl relative animate-in zoom-in-95 duration-300 overflow-hidden border border-slate-800 flex flex-col text-left">
            
            {/* Top Emerald Accent Bar */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500" />

            <button 
              onClick={() => {
                setIsModalOpen(false);
                setTimeout(() => setIsSubmitted(false), 300); // Reset after close animation
              }}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-800/50 text-slate-400 hover:text-white transition-colors outline-none z-50"
            >
              <X size={20} />
            </button>

            <div className="p-8 sm:p-10">
              {isSubmitted ? (
                <div className="py-10 text-center animate-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight mb-3 text-white">Appeal Received</h3>
                  <p className="text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">
                    We have logged your request securely. Our team will review your case and contact you via your registered email shortly.
                  </p>
                  <button 
                    onClick={() => {
                      setIsModalOpen(false);
                      setTimeout(() => setIsSubmitted(false), 300);
                    }}
                    className="mt-8 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all outline-none"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h3 className="text-3xl font-black text-white mb-2 tracking-tight">Request Review</h3>
                    <p className="text-slate-400 text-sm font-medium">Please provide your details so we can help.</p>
                  </div>

                  <form onSubmit={handleAppealSubmit} className="space-y-5">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2">Registered Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className={inputCls}
                        placeholder="e.g. John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2">Registered Email</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className={inputCls}
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2">How can we help?</label>
                      <textarea 
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className={`${inputCls} min-h-[120px] resize-none`}
                        placeholder="Please explain the situation..."
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-5 mt-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20 outline-none"
                    >
                      {isSubmitting ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <>Transmit Message <Send size={16} /></>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}