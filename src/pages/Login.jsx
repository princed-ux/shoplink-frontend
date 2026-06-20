import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, ArrowRight, Eye, EyeOff, Mail } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { supabase } from '../supabaseClient';
import logo from '../assets/logo.png';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function Login({ setUser }) {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  // Handle Google OAuth redirect
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: vendor } = await supabase
          .from('vendors').select('*').eq('id', session.user.id).maybeSingle();
        if (vendor) {
          setUser({ ...session.user, vendor });
          // THE FIX: Route to /admin if they are an admin
          navigate(vendor.is_admin ? '/admin' : '/dashboard');
        } else {
          setUser({ ...session.user, vendor: null });
          navigate('/onboarding');
        }
      }
    });
    return () => listener.subscription.unsubscribe();
  }, [navigate, setUser]);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const isLocal = window.location.hostname === 'localhost';
      const redirectTo = isLocal 
        ? 'http://localhost:5173/dashboard' 
        : 'https://shoplinkvi.com/dashboard';

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo },
      });
      if (error) throw error;
    } catch (err) {
      toast.error(err.message || 'Google sign in failed.');
      setGoogleLoading(false);
    }
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error('Enter your email address');
    if (password.length < 6) return toast.error('Enter your password');

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        if (error.message.toLowerCase().includes('invalid')) {
          throw new Error('Incorrect email or password.');
        }
        throw new Error(error.message);
      }

      // Fetch vendor profile
      const { data: vendorProfile, error: profileError } = await supabase
        .from('vendors').select('*').eq('id', data.user.id).maybeSingle();

      if (profileError || !vendorProfile) {
        setUser({ ...data.user, vendor: null });
        navigate('/onboarding');
        return;
      }

      toast.success('Welcome back! 👋');
      setUser({ ...data.user, vendor: vendorProfile });
      
      // THE FIX: Route to /admin if they are an admin
      setTimeout(() => {
        navigate(vendorProfile.is_admin ? '/admin' : '/dashboard');
      }, 800);

    } catch (err) {
      toast.error(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Shared input style for premium feel
  const inputCls = `block w-full pl-11 pr-14 py-4 rounded-2xl outline-none font-bold text-base
    bg-slate-50 dark:bg-slate-900/50
    border-2 border-slate-200 dark:border-slate-800
    text-slate-900 dark:text-white
    placeholder-slate-400 dark:placeholder-slate-500
    focus:border-emerald-500 dark:focus:border-emerald-500
    focus:bg-white dark:focus:bg-slate-900
    focus:ring-4 focus:ring-emerald-500/10
    transition-all duration-300 shadow-sm`;

  return (
    <div className="min-h-screen flex flex-col justify-center bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-200 px-6 py-12 relative overflow-hidden transition-colors duration-300">
      <Toaster position="top-center" toastOptions={{ className: 'dark:bg-slate-800 dark:text-white' }} />

      {/* Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/5 dark:bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Back Button */}
      <div className="absolute top-8 left-6 sm:left-12 z-20">
        <Link to="/" className="flex items-center gap-2 group text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-xs uppercase tracking-widest">Back</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="mb-6 transform hover:scale-105 transition-transform duration-300">
            {/* The invert class handles the logo switching perfectly in dark mode assuming it's black text originally */}
            <img src={logo} alt="ShopLinkVi Logo" className="w-20 h-20 object-contain dark:brightness-0 dark:invert" />
          </div>
          <h2 className="text-center text-4xl font-black text-slate-900 dark:text-white tracking-tighter transition-colors">Sign In</h2>
          <p className="mt-3 text-center text-slate-500 dark:text-slate-400 font-medium transition-colors">
            Welcome back to your store.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-900/80 dark:backdrop-blur-xl py-10 px-8 shadow-[0_20px_70px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_70px_-15px_rgba(0,0,0,0.5)] rounded-[2.5rem] border border-slate-100 dark:border-slate-800 sm:px-12 transition-all duration-300">

          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-black text-sm text-slate-800 dark:text-white hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all active:scale-[0.98] disabled:opacity-60 shadow-sm mb-6"
          >
            {googleLoading ? <Loader2 size={20} className="animate-spin text-slate-400 dark:text-slate-500" /> : <GoogleIcon />}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800 transition-colors" />
            <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800 transition-colors" />
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            {/* Email */}
            <div className="group">
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 ml-1 transition-colors group-focus-within:text-emerald-500">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition-colors group-focus-within:text-emerald-500" />
                <input
                  type="email" required placeholder="you@example.com"
                  className={inputCls}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="group">
              <div className="flex justify-between mb-3 ml-1">
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors group-focus-within:text-emerald-500">Password</label>
                <Link to="/forgot-password" className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest hover:underline transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} required placeholder="••••••••"
                  className={inputCls.replace('pl-11', 'pl-5')} // Password doesn't have left icon
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading || googleLoading}
              className="w-full flex justify-center items-center gap-3 py-4 mt-2 px-4 rounded-2xl shadow-xl shadow-emerald-500/20 text-xs font-black uppercase tracking-[0.2em] text-white bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-all active:scale-[0.98] disabled:opacity-70">
              {loading ? <Loader2 className="animate-spin" size={20} /> : <><span>Sign In</span><ArrowRight size={18} strokeWidth={3} /></>}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800/50 text-center transition-colors">
            <p className="text-sm font-bold text-slate-400 dark:text-slate-500">
              New to ShopLinkVi?{' '}
              <Link to="/register" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline underline-offset-4 decoration-2 transition-colors">
                Create free store
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 text-center relative z-10">
        <span className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest transition-colors">
          &copy; {new Date().getFullYear()} ShopLinkVi &bull; Secure Portal
        </span>
      </div>
    </div>
  );
}