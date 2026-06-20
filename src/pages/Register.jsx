import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Loader2, ArrowLeft, CheckCircle2, XCircle, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { supabase } from '../supabaseClient';
import logo from '../assets/logo.png';

// Google SVG icon
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const formatPhone = (num) => {
  const n = num.trim().replace(/\s+/g, '');
  if (n.startsWith('0')) return '+234' + n.substring(1);
  if (n.startsWith('234') && !n.startsWith('+')) return '+' + n;
  if (!n.startsWith('+')) return '+234' + n;
  return n;
};

export default function Register({ setUser }) {
  const [method, setMethod] = useState('email'); // 'email' | 'google'
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  // Handle Google OAuth redirect callback
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Check if vendor profile exists
        const { data: vendor } = await supabase
          .from('vendors')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (vendor) {
          // Already registered — go to dashboard
          setUser({ ...session.user, vendor });
          navigate('/dashboard');
        } else {
          // New user — go to onboarding
          setUser({ ...session.user, vendor: null });
          navigate('/onboarding');
        }
      }
    });
    return () => listener.subscription.unsubscribe();
  }, [navigate, setUser]);

  // Google sign up
  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    try {
      // SMART REDIRECT: Checks if local or production
      const isLocal = window.location.hostname === 'localhost';
      const redirectTo = isLocal 
        ? 'http://localhost:5173/onboarding' 
        : 'https://shoplinkvi.com/onboarding';

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      });
      if (error) throw error;
    } catch (err) {
      toast.error(err.message || 'Google sign up failed.');
      setGoogleLoading(false);
    }
  };

  // Email + password sign up
  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    if (!form.email.trim()) return toast.error('Enter your email address');
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters');
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');

    setLoading(true);
    try {
      // SMART REDIRECT: For the confirmation link in their email
      const isLocal = window.location.hostname === 'localhost';
      const emailRedirectTo = isLocal 
        ? 'http://localhost:5173/onboarding' 
        : 'https://shoplinkvi.com/onboarding';

      const { data, error } = await supabase.auth.signUp({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        options: {
          emailRedirectTo,
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes('already registered')) {
          throw new Error('This email is already registered. Please sign in.');
        }
        throw error;
      }

      if (data.session) {
        setUser({ ...data.user, vendor: null });
        navigate('/onboarding');
      } else {
        toast.success('Account created! Check your email to confirm and start onboarding.');
      }
    } catch (err) {
      toast.error(err.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Shared premium input class
  const baseInputCls = `block w-full pl-11 pr-14 py-4 rounded-2xl outline-none font-bold text-base
    bg-slate-50 dark:bg-slate-900/50
    text-slate-900 dark:text-white
    placeholder-slate-400 dark:placeholder-slate-500
    border-2 transition-all duration-300 shadow-sm
    focus:bg-white dark:focus:bg-slate-900`;

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-200 overflow-x-hidden transition-colors duration-300">
      <Toaster position="top-center" toastOptions={{ className: 'dark:bg-slate-800 dark:text-white' }} />

      {/* Left — Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-32 bg-white dark:bg-slate-950 relative z-10 py-10 transition-colors duration-300">

        {/* Ambient Glows for Left Panel */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Back */}
        <div className="absolute top-8 left-6 sm:left-12 z-20">
          <Link to="/" className="flex items-center gap-2 group text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-xs uppercase tracking-widest">Back</span>
          </Link>
        </div>

        <div className="mx-auto w-full max-w-sm pt-10 lg:pt-0 relative z-10">

          {/* Header */}
          <div className="mb-8 text-center sm:text-left">
            <div className="mb-6 mx-auto sm:mx-0 w-fit transform hover:scale-105 transition-transform duration-300">
              <img src={logo} alt="ShopLinkVi Logo" className="w-14 h-14 object-contain dark:brightness-0 dark:invert transition-all" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter transition-colors">
              Create your free store
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400 font-medium leading-relaxed transition-colors">
              Your store. Your link. Your WhatsApp orders. All free.
            </p>
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogleSignUp}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-black text-sm text-slate-800 dark:text-white hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all active:scale-[0.98] disabled:opacity-60 shadow-sm mb-5"
          >
            {googleLoading
              ? <Loader2 size={20} className="animate-spin text-slate-400 dark:text-slate-500" />
              : <GoogleIcon />
            }
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800 transition-colors" />
            <span className="text-[11px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">or sign up with email</span>
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800 transition-colors" />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            {/* Email */}
            <div className="group">
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1 transition-colors group-focus-within:text-emerald-500">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition-colors group-focus-within:text-emerald-500" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  className={`${baseInputCls} border-slate-200 dark:border-slate-800 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10`}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password */}
            <div className="group">
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1 transition-colors group-focus-within:text-emerald-500">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition-colors group-focus-within:text-emerald-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="At least 8 characters"
                  value={form.password}
                  className={`${baseInputCls} border-slate-200 dark:border-slate-800 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10`}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div className="group">
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1 transition-colors group-focus-within:text-emerald-500">
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition-colors group-focus-within:text-emerald-500" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  className={`${baseInputCls} ${
                    form.confirmPassword && form.password !== form.confirmPassword
                      ? 'border-red-400 dark:border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                      : form.confirmPassword && form.password === form.confirmPassword
                      ? 'border-emerald-500 dark:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10'
                      : 'border-slate-200 dark:border-slate-800 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10'
                  }`}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                />
                
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {/* Match indicator */}
                  {form.confirmPassword && (
                    <div className="mr-1">
                      {form.password === form.confirmPassword
                        ? <CheckCircle2 size={16} className="text-emerald-500" />
                        : <XCircle size={16} className="text-red-500" />
                      }
                    </div>
                  )}
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full flex justify-center items-center gap-3 py-4 mt-2 px-4 bg-emerald-600 dark:bg-emerald-500 text-white rounded-2xl shadow-xl shadow-emerald-500/20 font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading
                ? <Loader2 className="animate-spin" size={20} />
                : <><span>Create Free Store</span><ArrowRight size={18} strokeWidth={3} /></>
              }
            </button>
          </form>

          {/* Terms note */}
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium text-center mt-5 leading-relaxed px-2 transition-colors">
            By signing up you agree to our{' '}
            <Link to="/terms" className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 underline underline-offset-2 transition-colors">Terms</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 underline underline-offset-2 transition-colors">Privacy Policy</Link>.
          </p>

          <div className="mt-6 text-center pb-10">
            <p className="text-sm font-bold text-slate-400 dark:text-slate-500 tracking-tight transition-colors">
              Already have a store?{' '}
              <Link to="/login" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline underline-offset-4 decoration-2 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right panel (Unchanged exactly as requested) */}
      <div className="hidden lg:flex flex-1 relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&auto=format&fit=crop&q=60')] bg-cover bg-center opacity-40 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/90 to-slate-900/80" />
        <div className="relative z-10 w-full flex flex-col justify-end p-20">
          <div className="max-w-md animate-in slide-in-from-right-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-6">
              <CheckCircle2 size={12} /> Free forever
            </div>
            <h1 className="text-5xl font-black text-white leading-[1.1] tracking-tighter mb-6">
              Your business deserves a home beyond DMs.
            </h1>
            <p className="text-slate-300 text-lg font-medium leading-relaxed">
              Join vendors using ShopLinkVi to receive WhatsApp orders while they sleep.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}