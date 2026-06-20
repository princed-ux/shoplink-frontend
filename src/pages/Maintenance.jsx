import { Hammer, Clock, MessageCircle, RefreshCw } from 'lucide-react';
import logo from '../assets/logo.png';

export default function Maintenance() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6 text-center overflow-hidden relative transition-colors duration-300">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="absolute inset-0 z-0 opacity-20 dark:opacity-40 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[120px] animate-pulse"></div>
      
      <div className="max-w-xl w-full relative z-10">
        
        {/* Animated Icon Container */}
        <div className="mb-10 relative inline-block">
          <div className="w-24 h-24 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-[2rem] flex items-center justify-center mx-auto backdrop-blur-xl animate-in fade-in zoom-in duration-1000">
            <Hammer size={40} className="text-emerald-500 dark:text-emerald-400 animate-bounce" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-spin-slow">
            <RefreshCw size={14} className="text-white" />
          </div>
        </div>

        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both">
          <img src={logo} alt="ShopLink" className="h-12 mx-auto dark:brightness-0 dark:invert opacity-80 mb-4 transition-all" />
          
          <h1 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight transition-colors">
            Building something <span className="text-emerald-600 dark:text-emerald-400 italic">better.</span>
          </h1>
          
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed max-w-md mx-auto transition-colors">
            ShopLink is currently undergoing a scheduled upgrade to improve your store experience. We should be back soon.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <div className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-bold text-xs uppercase tracking-widest rounded-2xl shadow-sm transition-colors">
              <Clock size={16} className="text-emerald-600 dark:text-emerald-400" /> Back soon
            </div>
            
            <a 
              href="https://wa.me/2349043394263" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-emerald-600 hover:bg-black dark:hover:bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-slate-200 dark:shadow-emerald-900/20 active:scale-95"
            >
              <MessageCircle size={16} /> Contact Support
            </a>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-20 flex items-center justify-center gap-3 animate-in fade-in delay-700 fill-mode-both">
           <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
           <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] transition-colors">Systems Upgrading • Abeokuta, NG</p>
        </div>
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin 6s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}