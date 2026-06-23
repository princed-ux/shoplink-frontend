import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  Phone, Trash2, Eye, EyeOff, Loader2,
  AlertTriangle, CheckCircle2, User, Shield,
  Sun, Moon, Monitor, Smartphone, Lock, KeyRound, ArrowRight
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useTheme } from '../context/ThemeContext';
import { COUNTRIES, getDialCode, formatPhone } from '../data/countries';

export default function AccountSettings({ user, setUser }) {
  const navigate = useNavigate();
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Contact State
  const storedPhone = user?.vendor?.phone || '';
  const dial = getDialCode(user?.vendor?.country || 'NG');
  const strippedInitial = storedPhone.startsWith(dial) ? storedPhone.slice(dial.length) : storedPhone.replace(/^\+/, '');
  const [newPhone, setNewPhone] = useState(strippedInitial);
  const phoneChanged = newPhone !== strippedInitial;
  const [phoneLoading, setPhoneLoading]       = useState(false);

  // Security / Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent]         = useState(false);
  const [showNew, setShowNew]                 = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  
  // Two-Step Flow State
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [verifyLoading, setVerifyLoading]           = useState(false);
  const [passwordLoading, setPasswordLoading]       = useState(false);

  // Delete State
  const [showDeleteModal, setShowDeleteModal]   = useState(false);
  const [deletePassword, setDeletePassword]     = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState(''); 
  const [showDeletePw, setShowDeletePw]         = useState(false);
  const [deleteLoading, setDeleteLoading]       = useState(false);

  const isGoogleUser = user?.app_metadata?.provider === 'google';
  const accCountry = user?.vendor?.country || 'NG';

  const handlePhoneUpdate = async (e) => {
    e.preventDefault();
    if (!newPhone.trim() || newPhone.length < 10) return toast.error('Enter a valid phone number');
    setPhoneLoading(true);
    try {
      const formatted = formatPhone(newPhone, accCountry);
      const { data: existing } = await supabase
        .from('vendors').select('id').eq('phone', formatted).maybeSingle();
      if (existing && existing.id !== user.id) throw new Error('This number is already linked to another store.');
      const { error } = await supabase.from('vendors').update({ phone: formatted }).eq('id', user.id);
      if (error) throw error;
      setUser({ ...user, vendor: { ...user.vendor, phone: formatted } });
      toast.success('WhatsApp number updated!');
      setNewPhone('');
    } catch (err) { toast.error(err.message || 'Failed to update phone.'); }
    finally { setPhoneLoading(false); }
  };

  // ── STEP 1: VERIFY CURRENT PASSWORD ──
  const handleVerifyPassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) return toast.error('Enter your current password');
    
    setVerifyLoading(true);
    try {
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (verifyError) throw new Error('Incorrect current password');

      setIsPasswordVerified(true);
      toast.success('Verified! You can now choose a new password.');
    } catch (err) { 
      toast.error(err.message || 'Verification failed.'); 
    } finally { 
      setVerifyLoading(false); 
    }
  };

  // ── STEP 2: UPDATE TO NEW PASSWORD ──
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) return toast.error('New password must be at least 8 characters');
    if (newPassword !== confirmPassword) return toast.error('New passwords do not match');

    setPasswordLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      toast.success('Password successfully updated!');
      
      // Reset entire flow
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
      setIsPasswordVerified(false);
    } catch (err) { 
      toast.error(err.message || 'Failed to update password.'); 
    } finally { 
      setPasswordLoading(false); 
    }
  };

  // ── DELETE LOGIC ──
  const handleDeleteAccount = async () => {
    if (!isGoogleUser && !deletePassword.trim()) return toast.error('Enter your password to confirm');
    if (isGoogleUser && deleteConfirmText !== 'DELETE') return toast.error('Type DELETE to confirm');
    
    setDeleteLoading(true);
    sessionStorage.setItem('shoplink_self_deleting', '1');
    try {
      const { data, error } = await supabase.functions.invoke('delete-account', {
        body: {
          userId: user.id,
          phone: user.vendor?.phone,
          password: isGoogleUser ? '' : deletePassword,
          skipPasswordCheck: isGoogleUser, 
        },
      });
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      
      await supabase.auth.signOut();
      setUser(null);
      toast.success('Account deleted.');
      navigate('/');
    } catch (err) {
      const msg = (err?.message || '').toLowerCase();
      if (msg.includes('incorrect')) {
        toast.error('Incorrect password. Enter the correct password to delete your account.');
      } else {
        toast.error('Something went wrong. Please try again or email support@shoplinkvi.com.');
      }
    } finally { 
      setDeleteLoading(false); 
    }
  };

  const THEMES = [
    { id: 'light',  label: 'Light',  Icon: Sun },
    { id: 'dark',   label: 'Dark',   Icon: Moon },
    { id: 'system', label: 'System', Icon: Monitor },
  ];

  const inputCls = `w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-slate-800 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500`;

  return (
    <div className="max-w-4xl mx-auto pb-20 pt-6 space-y-8 transition-colors duration-300">

      {/* --- HEADER --- */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tighter transition-colors">Account Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-base mt-2 transition-colors">Manage your security, preferences, and profile.</p>
      </div>

      {/* --- PROFILE BANNER --- */}
      <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-900 dark:bg-slate-950 border border-slate-800 shadow-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center sm:items-start gap-8 text-center sm:text-left transition-colors">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
        
        <div className="w-28 h-28 rounded-[2rem] bg-white dark:bg-slate-800 p-2 shadow-xl border border-slate-100 dark:border-slate-700 z-10 flex-shrink-0 flex items-center justify-center transition-colors">
          {user?.vendor?.logo_url
            ? <img src={user.vendor.logo_url} className="w-full h-full object-cover rounded-2xl" alt="logo" />
            : <User size={40} className="text-slate-300 dark:text-slate-600" />
          }
        </div>
        
        <div className="z-10 flex-1 flex flex-col justify-center">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">{user?.vendor?.shop_name || 'My Store'}</h2>
          <p className="text-slate-400 font-medium mb-5">{user?.email}</p>
          
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            {(() => {
              const pt = user?.vendor?.plan_type?.toLowerCase() || 'free';
              const isPremium = pt === 'premium';
              const isPro     = pt === 'pro';
              return (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                  isPremium ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                  : isPro   ? 'bg-amber-500/20  text-amber-400  border-amber-500/30'
                  :           'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                }`}>
                  <ShieldCircle size={12} />
                  {isPremium ? 'Premium' : isPro ? 'Pro' : 'Free'}
                </span>
              );
            })()}
            {isGoogleUser && (
              <span className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-500/30 shadow-sm">
                <Shield size={12} /> Google Auth
              </span>
            )}
            {user?.vendor?.phone && (
              <span className="inline-flex items-center gap-1.5 bg-[#25D366]/20 text-[#25D366] px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-[#25D366]/30 shadow-sm">
                <Phone size={12} /> {user.vendor.phone}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* --- APPEARANCE & THEME --- */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 transition-colors">
          <h3 className="font-black text-slate-900 dark:text-white text-xl mb-1 transition-colors">Appearance</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-6 transition-colors">Choose how ShopLink looks to you.</p>
          
          <div className="grid grid-cols-3 gap-4">
            {THEMES.map(({ id, label, Icon }) => {
            const isActive = theme === id;

            return (
              <button 
                key={id} 
                onClick={() => setTheme(id)}
                className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300 active:scale-95 ${
                  isActive 
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 shadow-md shadow-emerald-500/10 dark:shadow-none' 
                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-white dark:bg-slate-900/50'
                }`}
              >
                <Icon size={24} className={isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  {label}
                  {id === 'system' && theme === 'system' && (
                    <span className="block text-[9px] text-slate-400 mt-1">
                      ({resolvedTheme})
                    </span>
                  )}
                </span>
                {isActive && <CheckCircle2 size={14} className="absolute top-3 right-3 text-emerald-500 hidden sm:block" />}
              </button>
            );
            })}
          </div>
        </div>

        {/* --- CONTACT DETAILS --- */}
        <div className="md:col-span-1 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 transition-colors">
          <h3 className="font-black text-slate-900 dark:text-white text-xl mb-6 transition-colors">Business Contact</h3>
          
          <form onSubmit={handlePhoneUpdate} className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2 transition-colors">WhatsApp Number</label>
            {/* Country — read-only */}
            {(() => {
              const c = COUNTRIES.find(c => c.code === accCountry);
              return (
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700 rounded-2xl mb-2">
                  <img src={c?.flag} className="w-6 h-5 object-cover rounded-sm" />
                  <div className="flex-1">
                    <span className="font-bold text-slate-800 dark:text-white text-sm">{c?.dial}</span>
                    <span className="text-xs text-slate-400 ml-2">{c?.name}</span>
                  </div>
                  <Lock size={14} className="text-slate-400" />
                </div>
              );
            })()}
            <p className="text-xs text-slate-400 font-medium mb-3 ml-1">
              Country was set during setup and cannot be changed. You can only update your phone number.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <input type="tel" required placeholder={accCountry === 'NG' ? '802 345 6789' : '712 345 6789'} value={newPhone}
                className="flex-1 min-w-[140px] px-5 py-3.5 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500 transition-all font-bold text-sm text-slate-800 dark:text-white"
                onChange={(e) => setNewPhone(e.target.value.replace(/[^0-9\s]/g, ''))} />
              <button type="submit" disabled={!phoneChanged || phoneLoading} className="px-6 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-2xl font-black text-xs uppercase tracking-widest transition active:scale-95 disabled:opacity-50 flex items-center justify-center shadow-lg shadow-[#25D366]/20 outline-none">
                {phoneLoading ? <Loader2 size={16} className="animate-spin" /> : 'Save'}
              </button>
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-2 mt-2">
              Where your store orders will be sent.
            </p>
          </form>
        </div>

        {/* --- SECURITY & PASSWORD --- */}
        <div className="md:col-span-1 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 transition-colors">
          <h3 className="font-black text-slate-900 dark:text-white text-xl mb-6 transition-colors">Security</h3>
          
          {isGoogleUser ? (
            <div className="flex flex-col items-center justify-center text-center h-full pb-8">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 transition-colors">
                <Shield size={28} className="text-blue-500 dark:text-blue-400" />
              </div>
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed max-w-[250px] transition-colors">
                You signed in with Google. Your password is managed securely by your Google account.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {!isPasswordVerified ? (
                /* ── STEP 1: VERIFY FORM ── */
                <form onSubmit={handleVerifyPassword} className="space-y-4 animate-in fade-in duration-300">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2 transition-colors">Change Password</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                      <input 
                        type={showCurrent ? 'text' : 'password'} 
                        required 
                        placeholder="Enter current password to verify" 
                        value={currentPassword} 
                        className={`${inputCls} pl-11 pr-12 border-slate-200 dark:border-slate-700`} 
                        onChange={(e) => setCurrentPassword(e.target.value)} 
                      />
                      <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-emerald-500 transition-colors outline-none">
                        {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" disabled={verifyLoading} className="w-full py-4 mt-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-slate-200 dark:shadow-none outline-none">
                    {verifyLoading ? <Loader2 size={16} className="animate-spin" /> : <>Verify to Continue <ArrowRight size={16}/></>}
                  </button>
                </form>
              ) : (
                /* ── STEP 2: NEW PASSWORD FORM ── */
                <form onSubmit={handlePasswordUpdate} className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                  
                  <div className="flex items-center justify-between mb-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 px-4 py-3 rounded-2xl">
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                      <CheckCircle2 size={16}/> Identity Verified
                    </span>
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsPasswordVerified(false);
                        setCurrentPassword('');
                      }} 
                      className="text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 uppercase tracking-widest outline-none transition-colors"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2 transition-colors">New Password</label>
                    <div className="relative">
                      <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                      <input type={showNew ? 'text' : 'password'} required placeholder="Min 8 characters" value={newPassword} className={`${inputCls} pl-11 pr-12`} onChange={(e) => setNewPassword(e.target.value)} />
                      <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-emerald-500 transition-colors outline-none">
                        {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2 transition-colors">Confirm Password</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                      <input type={showConfirm ? 'text' : 'password'} required placeholder="Repeat new password" value={confirmPassword} className={`${inputCls} pl-11 pr-12 ${confirmPassword && newPassword !== confirmPassword ? 'border-red-300 dark:border-red-500/40 focus:border-red-500 focus:ring-red-500/10' : ''}`} onChange={(e) => setConfirmPassword(e.target.value)} />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-emerald-500 transition-colors outline-none">
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" disabled={passwordLoading} className="w-full py-4 mt-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 outline-none">
                    {passwordLoading ? <Loader2 size={16} className="animate-spin" /> : 'Confirm Update'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* --- DANGER ZONE --- */}
        <div className="md:col-span-2 bg-red-50 dark:bg-red-500/5 rounded-[2.5rem] border border-red-100 dark:border-red-500/20 p-8 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-500/15 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors">
                <AlertTriangle size={24} className="text-red-500 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-black text-red-600 dark:text-red-400 text-lg transition-colors">Danger Zone</h3>
                <p className="text-red-500/80 dark:text-red-400/70 font-medium text-sm mt-0.5 leading-relaxed max-w-sm transition-colors">
                  Permanently deletes your account, storefront, and all products. This cannot be undone.
                </p>
              </div>
            </div>
            <button onClick={() => setShowDeleteModal(true)} className="flex-shrink-0 flex items-center justify-center gap-2 px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition active:scale-95 shadow-lg shadow-red-500/20 w-full sm:w-auto outline-none">
              <Trash2 size={16} /> Delete Account
            </button>
          </div>
        </div>

      </div>

      {/* ── DELETE MODAL ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] p-10 shadow-2xl border border-transparent dark:border-slate-800 animate-in zoom-in-95 duration-300 transition-colors relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500" />
            
            <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
              <AlertTriangle size={32} className="text-red-500 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-2 transition-colors">Delete Account?</h2>

            <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-4 leading-relaxed transition-colors">
              This is <span className="font-black text-slate-900 dark:text-white">permanent</span> and cannot be undone.<br/>
              {isGoogleUser ? 'Type DELETE below to confirm.' : 'Enter your password to confirm.'}
            </p>

            {user?.vendor?.plan_type && user?.vendor?.plan_type !== 'free' && (
              <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl flex items-start gap-3">
                <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 leading-relaxed">
                  <span className="font-black uppercase tracking-wide block mb-0.5">
                    Active {user.vendor.plan_type.charAt(0).toUpperCase() + user.vendor.plan_type.slice(1)} Plan
                  </span>
                  Your subscription will be cancelled immediately. There is no refund for any unused paid period. You will lose access to all {user.vendor.plan_type} features forever.
                </p>
              </div>
            )}

            <div className="relative mb-6">
              {isGoogleUser ? (
                <>
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-red-400 dark:text-red-500/70">
                    <AlertTriangle size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="Type DELETE"
                    value={deleteConfirmText}
                    className="w-full pl-12 pr-12 py-4 bg-red-50 dark:bg-red-500/10 border-2 border-red-100 dark:border-red-500/20 rounded-2xl outline-none focus:border-red-400 dark:focus:border-red-500/50 font-bold text-slate-800 dark:text-white placeholder-red-300 dark:placeholder-red-500/50 transition-all uppercase"
                    onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && deleteConfirmText === 'DELETE' && handleDeleteAccount()}
                  />
                </>
              ) : (
                <>
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-red-400 dark:text-red-500/70">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showDeletePw ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={deletePassword}
                    className="w-full pl-12 pr-12 py-4 bg-red-50 dark:bg-red-500/10 border-2 border-red-100 dark:border-red-500/20 rounded-2xl outline-none focus:border-red-400 dark:focus:border-red-500/50 font-bold text-slate-800 dark:text-white placeholder-red-300 dark:placeholder-red-500/50 transition-all"
                    onChange={(e) => setDeletePassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleDeleteAccount()}
                  />
                  <button type="button" onClick={() => setShowDeletePw(!showDeletePw)} className="absolute right-5 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-600 dark:hover:text-red-400 transition-colors outline-none">
                    {showDeletePw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleDeleteAccount} 
                disabled={(isGoogleUser && deleteConfirmText !== 'DELETE') || (!isGoogleUser && !deletePassword.trim()) || deleteLoading} 
                className="w-full bg-red-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-600 transition disabled:opacity-40 flex items-center justify-center gap-2 active:scale-95 shadow-xl shadow-red-500/20 outline-none"
              >
                {deleteLoading ? <Loader2 size={16} className="animate-spin" /> : 'Delete Forever'}
              </button>
              <button 
                onClick={() => { setShowDeleteModal(false); setDeletePassword(''); setDeleteConfirmText(''); setShowDeletePw(false); }} 
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ShieldCircle(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  )
}