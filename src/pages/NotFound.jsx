import { Link, useNavigate } from 'react-router-dom';
import { SearchX, ArrowLeft, Sparkles, Store, MapPinOff } from 'lucide-react';
import logo from '../assets/logo.png';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-200 flex items-center justify-center p-6 overflow-hidden relative selection:bg-emerald-600 selection:text-white transition-colors duration-300">
      
      {/* --- GLOBAL AMBIENT GRADIENTS --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none z-0 animate-blob"></div>
      <div className="absolute bottom-[10%] -left-[200px] w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-500/10 blur-[150px] rounded-full pointer-events-none z-0 animate-blob animation-delay-2000"></div>

      {/* --- TOP BRANDING --- */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
         <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
            <img src={logo} className="w-4 h-4 invert brightness-0" alt="ShopLink Logo" />
         </div>
         <span className="font-black text-lg tracking-tighter uppercase italic text-slate-900 dark:text-white transition-colors">
            ShopLink<span className="text-emerald-600 not-italic">.vi</span>
         </span>
      </div>

      {/* --- MAIN CONTENT CARD --- */}
      <div className="max-w-lg w-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl rounded-[3rem] p-10 lg:p-14 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] dark:shadow-none border border-white dark:border-slate-800 relative z-10 text-center animate-in fade-in zoom-in-95 duration-700 transition-colors">
        
        {/* Animated Icon Section */}
        <div className="relative mb-10 group inline-block perspective-2000">
          <div className="w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center transition-all duration-700 group-hover:rotate-12 shadow-inner border-[8px] border-white dark:border-slate-900 relative z-10">
            <MapPinOff size={48} strokeWidth={2} className="text-slate-400 dark:text-slate-600 group-hover:text-emerald-500 transition-colors duration-500" />
          </div>
          
          {/* Floating Badges */}
          <div className="absolute -top-2 -right-4 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-2.5 rounded-2xl shadow-xl animate-float z-20 border border-emerald-100 dark:border-emerald-500/20">
            <Store size={18} />
          </div>
          <div className="absolute -bottom-4 -left-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-2.5 rounded-2xl shadow-xl animate-float-delayed z-20 transition-colors">
            <SearchX size={18} />
          </div>
        </div>

        {/* Text Section */}
        <div className="space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 px-4 py-1.5 rounded-full mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest">Error 404</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight transition-colors">
            Looks like you're <br/><span className="text-emerald-600 italic relative">lost.
               <svg className="absolute -bottom-1 left-0 w-full h-2 text-emerald-200 dark:text-emerald-900" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" fill="transparent" stroke="currentColor" strokeWidth="4"/></svg>
            </span>
          </h2>
          
          <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-sm mx-auto mt-4 text-sm transition-colors">
            We couldn't find the store you are looking for. The link might be broken, or the vendor has changed their shop ID.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <button 
            onClick={() => navigate(-1)} 
            className="flex-1 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] border-2 border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 active:scale-[0.97]"
          >
            <ArrowLeft size={16} /> Go Back
          </button>

          <Link 
            to="/" 
            className="flex-1 bg-slate-900 dark:bg-emerald-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] shadow-xl hover:bg-black dark:hover:bg-emerald-500 transition-all active:scale-[0.97] flex items-center justify-center gap-2 group"
          >
            <Sparkles size={14} className="text-emerald-400 dark:text-emerald-200 group-hover:rotate-12 transition-transform" /> 
            Build a Store
          </Link>
        </div>
      </div>

      <style>{`
        .perspective-2000 { perspective: 2000px; }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 10s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(10px) rotate(-5deg); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}