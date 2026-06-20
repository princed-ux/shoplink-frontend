import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Loader2, ArrowRight, Eye, EyeOff,
  CheckCircle2, KeyRound, Mail, Inbox, XCircle, ShieldCheck
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { supabase } from '../supabaseClient';
import logo from '../assets/logo.png';

// ── Step config ───────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Email',     icon: Mail },
  { id: 2, label: 'Verify',    icon: Inbox },
  { id: 3, label: 'Password', icon: KeyRound },
];

// ── Right panel content ───────────────────────────────────────
const PANELS = [
  {
    icon: Mail,
    title: 'Forgot your\npassword?',
    sub: "No worries. Enter your email and we'll send you a recovery code instantly.",
    points: ['Works with your registered email', 'Code expires after 1 hour', 'Secure — powered by Supabase Auth'],
  },
  {
    icon: Inbox,
    title: 'Check your\ninbox.',
    sub: "We sent a verification code to your email. Check your spam folder if you don't see it.",
    points: ['6-8 digit code from Supabase', 'Check spam if not found', 'Request a new one if it expires'],
  },
  {
    icon: ShieldCheck,
    title: 'Almost\nthere.',
    sub: 'Create a strong new password. You\'ll be back in your dashboard in seconds.',
    points: ['Minimum 8 characters', 'Use letters, numbers and symbols', 'You\'ll be signed in automatically'],
  },
];

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep]               = useState(1);
  const [email, setEmail]             = useState('');
  const [otp, setOtp]                 = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]         = useState(false);

  // STEP 1 — Send reset email
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email.trim().includes('@')) return toast.error('Enter a valid email address');
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase());
      if (error) throw error;
      toast.success('Code sent! Check your email.');
      setStep(2);
    } catch (err) {
      toast.error(err.message || 'Failed to send code.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2 — Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length < 6) return toast.error('Enter the verification code');
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: otp,
        type: 'recovery',
      });
      if (error) throw error;
      if (!data.session) throw new Error('Verification failed. Please try again.');
      toast.success('Verified! Set your new password.');
      setStep(3);
    } catch (err) {
      toast.error(err.message || 'Invalid or expired code.');
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  // STEP 3 — Update password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) return toast.error('Password must be at least 8 characters.');
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match.');
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success('Password updated! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1400);
    } catch (err) {
      toast.error(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = confirmPassword && newPassword === confirmPassword;
  const passwordsMismatch = confirmPassword && newPassword !== confirmPassword;

  const panel = PANELS[step - 1];
  const PanelIcon = panel.icon;

  const inputCls = `block w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl outline-none font-bold text-slate-800 dark:text-white placeholder-slate-300 dark:placeholder-slate-600 focus:border-emerald-500 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 transition-all`;

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950 font-sans overflow-hidden transition-colors duration-300">
      <Toaster position="top-center" />

      {/* ── LEFT: Form ── */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-14 lg:px-20 py-12 relative min-h-screen">
        
        <div className="absolute inset-0 pointer-events-none opacity-[0.015] dark:opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="absolute top-8 left-8 sm:left-14">
          <Link to="/login" className="flex items-center gap-2 group text-slate-400 hover:text-emerald-500 transition-colors">
            <ArrowLeft size={17} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-black text-xs uppercase tracking-widest">Back to Login</span>
          </Link>
        </div>

        <div className="relative z-10 w-full max-w-sm mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <img src={logo} alt="ShopLink" className="w-5 h-5 object-contain brightness-0 invert" />
            </div>
            <span className="font-black text-base tracking-tighter text-slate-900 dark:text-white italic">
              ShopLink<span className="text-emerald-600 not-italic">.vi</span>
            </span>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-10">
            {STEPS.map((s, i) => {
              const done    = step > s.id;
              const current = step === s.id;
              return (
                <div key={s.id} className="flex items-center gap-2">
                  <div className={`flex items-center justify-center rounded-full transition-all duration-300 ${
                    done    ? 'w-6 h-6 bg-emerald-500'
                    : current ? 'w-6 h-6 bg-emerald-500 ring-4 ring-emerald-500/20'
                    : 'w-6 h-6 bg-slate-100 dark:bg-slate-800'
                  }`}>
                    {done
                      ? <CheckCircle2 size={12} className="text-white" />
                      : <span className={`text-[10px] font-black ${current ? 'text-white' : 'text-slate-400 dark:text-slate-600'}`}>{s.id}</span>
                    }
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`h-0.5 w-8 rounded-full transition-all duration-500 ${
                      step > s.id ? 'bg-emerald-500' : 'bg-slate-100 dark:bg-slate-800'
                    }`} />
                  )}
                </div>
              );
            })}
            <span className="ml-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Step {step} of 3
            </span>
          </div>

          {/* ── STEP 1: Email ── */}
          {step === 1 && (
            <div key={1} className="animate-in fade-in slide-in-from-right-4 duration-400">
              <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-5 border border-emerald-100 dark:border-emerald-500/20">
                <Mail size={11} /> Reset Password
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.1] mb-3">
                Forgot your<br />password?
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-8 leading-relaxed">
                Enter your email and we'll send you a recovery code right away.
              </p>
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" />
                    <input type="email" required autoFocus placeholder="you@example.com" value={email} className={`${inputCls} pl-11`} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2 py-4 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/25 transition-all active:scale-95 disabled:opacity-60">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <>Send Code <ArrowRight size={16} strokeWidth={3} /></>}
                </button>
              </form>
            </div>
          )}

          {/* ── STEP 2: OTP ── */}
          {step === 2 && (
            <div key={2} className="animate-in fade-in slide-in-from-right-4 duration-400">
              <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-5 border border-blue-100 dark:border-blue-500/20">
                <Inbox size={11} /> Check Your Email
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.1] mb-3">Enter the code<br />we sent you.</h1>
              <p className="font-black text-slate-900 dark:text-white text-sm mb-8">{email}</p>
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Code</label>
                    <button type="button" onClick={() => { setStep(1); setOtp(''); }} className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest hover:underline">Wrong email?</button>
                  </div>
                  <input type="text" required autoFocus placeholder="••••••••" maxLength={8} value={otp} className={`${inputCls} text-center text-2xl tracking-[0.5em]`} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8))} />
                </div>
                <button type="submit" disabled={otp.length < 6 || loading} className="w-full flex justify-center items-center gap-2 py-4 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/25 transition-all active:scale-95 disabled:opacity-60">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <>Verify Code <ArrowRight size={16} strokeWidth={3} /></>}
                </button>
              </form>
            </div>
          )}

          {/* ── STEP 3: Password ── */}
          {step === 3 && (
            <div key={3} className="animate-in fade-in slide-in-from-right-4 duration-400">
              <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-5 border border-emerald-100 dark:border-emerald-500/20">
                <KeyRound size={11} /> New Password
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.1] mb-3">Set a strong<br />new password.</h1>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="relative">
                  <input type={showNew ? 'text' : 'password'} required placeholder="New Password" value={newPassword} className={`${inputCls} pr-12`} onChange={(e) => setNewPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600">
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="relative">
                  <input type={showConfirm ? 'text' : 'password'} required placeholder="Repeat Password" value={confirmPassword} className={`${inputCls} pr-12 ${passwordsMismatch ? 'border-red-300 focus:border-red-400' : passwordsMatch ? 'border-emerald-400' : ''}`} onChange={(e) => setConfirmPassword(e.target.value)} />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    {passwordsMatch && <CheckCircle2 size={15} className="text-emerald-500" />}
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-slate-300 dark:text-slate-600">{showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                </div>
                <button type="submit" disabled={loading || newPassword.length < 8 || !passwordsMatch} className="w-full py-4 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/25 transition-all active:scale-95 disabled:opacity-50">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : 'Save New Password'}
                </button>
              </form>
            </div>
          )}

          <p className="text-center text-[11px] text-slate-300 dark:text-slate-700 font-bold uppercase tracking-widest mt-10">
            Remember your password? <Link to="/login" className="text-emerald-500 hover:text-emerald-600">Sign In</Link>
          </p>
        </div>
      </div>

      {/* ── RIGHT: Info panel ── */}
      <div className="hidden lg:flex w-[440px] flex-shrink-0 bg-slate-50 dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative z-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
            <PanelIcon size={28} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.15] mb-4 whitespace-pre-line">{panel.title}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-8">{panel.sub}</p>
          <ul className="space-y-3">
            {panel.points.map((pt, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}