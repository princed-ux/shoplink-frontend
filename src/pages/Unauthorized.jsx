import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import logo from '../assets/logo.png';

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center overflow-hidden relative transition-colors duration-300">
      
      {/* --- ANIMATED BACKGROUND ELEMENTS --- */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 via-red-400 to-red-600 animate-pulse"></div>
      
      {/* Floating Decorative Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-red-500/5 dark:bg-red-500/10 rounded-full blur-[100px] animate-blob"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-slate-500/5 dark:bg-slate-500/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>

      {/* --- MAIN CONTENT CARD --- */}
      <div className="max-w-md w-full bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-[3.5rem] p-10 lg:p-14 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] dark:shadow-none border border-white dark:border-slate-800 relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 transition-colors">
        
        {/* Subtle Floating Logo Watermark */}
        <img 
          src={logo} 
          className="absolute -top-10 -right-10 w-48 h-48 opacity-[0.03] dark:opacity-[0.05] dark:invert rotate-12 animate-float" 
          alt="" 
        />

        {/* Animated Icon Container */}
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-red-200 dark:bg-red-500 rounded-3xl blur-2xl opacity-20 dark:opacity-10 animate-pulse"></div>
          <div className="w-24 h-24 bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 rounded-[2rem] flex items-center justify-center mx-auto relative shadow-inner group-hover:animate-shake transition-colors">
            <ShieldAlert size={48} strokeWidth={2.5} className="animate-bounce-short" />
          </div>
        </div>

        {/* Text Section */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 delay-300 fill-mode-both duration-700">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter transition-colors">
            Restricted Area
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10 transition-colors">
            It looks like you've reached a part of <span className="text-slate-900 dark:text-white font-bold italic text-sm">ShopLink.vi</span> that requires administrative keys. 
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 mt-10 animate-in fade-in slide-in-from-bottom-4 delay-500 fill-mode-both duration-700">
          <Link 
            to="/dashboard" 
            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 dark:shadow-none hover:bg-black dark:hover:bg-slate-100 transition-all active:scale-[0.97] flex items-center justify-center gap-3 group"
          >
            <Home size={18} className="group-hover:-translate-y-0.5 transition-transform" /> 
            Return to Dashboard
          </Link>
          
          <Link 
            to="/" 
            className="w-full bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-300 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border-2 border-slate-50 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-white transition-all flex items-center justify-center gap-3 active:scale-[0.97]"
          >
            <ArrowLeft size={18} /> 
            ShopLink Home
          </Link>
        </div>
      </div>

      {/* Bottom Label */}
      <div className="mt-10 animate-in fade-in delay-700 fill-mode-both">
        <p className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.4em] flex items-center gap-3 transition-colors">
          <span className="w-8 h-[1px] bg-slate-200 dark:bg-slate-800"></span>
          Error 403 • Access Forbidden
          <span className="w-8 h-[1px] bg-slate-200 dark:bg-slate-800"></span>
        </p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(12deg); }
          50% { transform: translateY(-20px) rotate(15deg); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        .animate-bounce-short { animation: bounce-short 2s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
      `}</style>
    </div>
  );
}