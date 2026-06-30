import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, ArrowLeft, Loader2, CheckCircle2, XCircle,
  Camera, Store, Link as LinkIcon, Phone, Sparkles, Check,
  ShoppingBag, TrendingUp, ShieldCheck, ChevronDown, Globe
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { supabase } from '../supabaseClient';
import { COUNTRIES, getDialCode, formatPhone } from '../data/countries';
import logo from '../assets/logo.png';

// --- CUSTOM WHATSAPP ICON ---
function WhatsAppIcon({ size = 24, color = "currentColor", className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

const STEPS = [
  { id: 1, label: 'Business',  icon: Store    },
  { id: 2, label: 'Link',      icon: LinkIcon },
  { id: 3, label: 'WhatsApp',  icon: Phone    },
  { id: 4, label: 'Logo',      icon: Camera   },
];

const PANELS = [
  {
    headline: 'Your store\nstarts here.',
    sub: 'Give your business an identity. The name customers will search for, remember and trust.',
    points: [
      { icon: Store,         text: 'Shown on your public storefront' },
      { icon: WhatsAppIcon,  text: 'Included in every WhatsApp order' },
      { icon: ShieldCheck,   text: 'Builds instant brand trust' },
    ],
  },
  {
    headline: 'One link.\nEvery platform.',
    sub: 'Your shop.vi link is permanent. Drop it in your bio, status, captions — and orders flow in.',
    points: [
      { icon: LinkIcon,      text: 'shop.vi/yourname — short & powerful' },
      { icon: TrendingUp,    text: 'Works on Instagram, TikTok, X, anywhere' },
      { icon: CheckCircle2,  text: 'Never expires, never changes' },
    ],
  },
  {
    headline: 'Orders go\nstraight to you.',
    sub: 'Every product your customers order gets auto-formatted and sent directly to your WhatsApp.',
    points: [
      { icon: WhatsAppIcon,  text: 'Clean receipt with items and total' },
      { icon: Phone,         text: 'Customer details included automatically' },
      { icon: ShoppingBag,   text: 'No extra apps — just your WhatsApp' },
    ],
  },
  {
    headline: 'Make it\nunmistakable.',
    sub: 'A strong logo builds trust fast. Customers are far more likely to order from stores that look legit.',
    points: [
      { icon: Camera,        text: 'Displayed on your storefront header' },
      { icon: Store,         text: 'Shown across your dashboard' },
      { icon: CheckCircle2,  text: 'Square format works best (1:1)' },
    ],
  },
];

// --- PREMIUM STORE PREVIEW MOCKUP ---
function StorePreviewCard({ shopName, slug, logoPreview, step }) {
  return (
    <div className="relative w-full max-w-[280px] mx-auto perspective-1000">
      {/* Phone Mockup Container */}
      <div className="bg-slate-900 border-[6px] border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden relative group">
        
        {/* Hardware Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-800 rounded-b-2xl z-20" />

        {/* Store Header */}
        <div className={`relative h-28 flex items-end p-4 transition-all duration-700 ${step === 4 ? 'bg-gradient-to-br from-emerald-500 to-emerald-700' : 'bg-gradient-to-br from-slate-700 to-slate-800'}`}>
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[length:12px_12px]" />
          
          <div className="flex items-center gap-3 relative z-10 w-full">
            {/* Logo Highlight on Step 4 */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/10 border border-white/20 overflow-hidden transition-all duration-500 ${step === 4 ? 'ring-4 ring-white/40 scale-110 shadow-xl' : ''}`}>
              {logoPreview
                ? <img src={logoPreview} className="w-full h-full object-cover" alt="logo" />
                : <Store size={20} className="text-white/60" />
              }
            </div>
            <div className="min-w-0 flex-1">
              <p className={`font-black text-white text-sm leading-tight truncate transition-all duration-500 ${step === 1 ? 'text-emerald-300' : ''}`}>
                {shopName || 'Your Store Name'}
              </p>
              <p className={`text-[10px] font-bold truncate transition-all duration-500 ${step === 2 ? 'text-emerald-300 bg-black/20 px-1.5 py-0.5 rounded inline-block mt-0.5' : 'text-white/60'}`}>
                shop.vi/{slug || 'yourstore'}
              </p>
            </div>
          </div>
        </div>

        {/* Product Grid Mock */}
        <div className="p-4 bg-slate-50 h-[300px]">
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { name: 'Product One',   price: '₦8,500'  },
              { name: 'Product Two',   price: '₦12,000' },
              { name: 'Product Three', price: '₦5,000'  },
              { name: 'Product Four',  price: '₦15,000' },
            ].map((p, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                <div className="h-20 bg-slate-100 flex items-center justify-center">
                  <ShoppingBag size={18} className="text-slate-300" />
                </div>
                <div className="p-2">
                  <p className="text-[9px] font-black text-slate-700 truncate">{p.name}</p>
                  <p className="text-[10px] font-black text-emerald-600">{p.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Order Button (Highlights on Step 3) */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className={`bg-emerald-500 rounded-xl py-3 text-center shadow-lg transition-all duration-500 ${step === 3 ? 'scale-105 ring-4 ring-emerald-500/30' : ''}`}>
            <p className="text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5">
              <WhatsAppIcon size={14} /> Order on WhatsApp
            </p>
          </div>
        </div>
      </div>

      {/* Floating badges */}
      <div className="absolute -top-4 -right-4 bg-emerald-500 text-white rounded-2xl px-3 py-2 shadow-xl shadow-emerald-500/30 animate-bounce-slow z-30">
        <p className="text-[8px] font-black uppercase tracking-widest text-emerald-100">New Order</p>
        <p className="text-[11px] font-black">₦15,000 received</p>
      </div>

      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 rounded-full px-4 py-1.5 shadow-xl flex items-center gap-2 z-30 whitespace-nowrap">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Store Live Preview</span>
      </div>
    </div>
  );
}

export default function Onboarding({ user, setUser }) {
  const navigate = useNavigate();
  const fileRef  = useRef(null);

  const [step, setStep]               = useState(1);
  const [loading, setLoading]         = useState(false);
  const [shopName, setShopName]       = useState('');
  const [slug, setSlug]               = useState('');
  const [country, setCountry]         = useState('NG');
  const [phone, setPhone]             = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [logoFile, setLogoFile]       = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [slugStatus, setSlugStatus]   = useState('idle');
  const [suggestions, setSuggestions] = useState([]);

  // IP geolocation to auto-detect country
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(data => {
        if (data?.country_code && COUNTRIES.some(c => c.code === data.country_code)) {
          setCountry(data.country_code);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (user?.user_metadata?.full_name && !shopName) {
      setShopName(user.user_metadata.full_name);
    }
  }, [user]);

  useEffect(() => {
    if (shopName) {
      const g = shopName.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '').trim()
        .replace(/\s+/g, '-').slice(0, 24);
      setSlug(g);
    }
  }, [shopName]);

  useEffect(() => {
    if (!slug || slug.length < 3) { setSlugStatus('idle'); return; }
    setSlugStatus('checking');
    const t = setTimeout(async () => {
      const { data } = await supabase.from('vendors').select('slug').eq('slug', slug).maybeSingle();
      setSlugStatus(data ? 'taken' : 'available');
    }, 500);
    return () => clearTimeout(t);
  }, [slug]);

  useEffect(() => {
    if (slugStatus !== 'taken' || !slug) { setSuggestions([]); return; }
    let cancelled = false;
    (async () => {
      const base = slug.replace(/-?\d+$/, '');
      const candidates = [
        `${base}1`, `${base}-store`, `${base}2`, `${base}-shop`, `${base}3`, `my-${base}`,
      ].filter(c => c.length >= 3 && c.length <= 24);
      const { data } = await supabase.from('vendors').select('slug').in('slug', candidates);
      if (cancelled) return;
      const takenSet = new Set((data || []).map(v => v.slug));
      setSuggestions(candidates.filter(c => !takenSet.has(c)).slice(0, 3));
    })();
    return () => { cancelled = true; };
  }, [slugStatus, slug]);

  const handleSlugChange = (e) =>
    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 24));

  // 🔥 THE FIX: Block bad file types instantly to prevent Supabase Policy Violation
  const handleLogoSelect = (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;

    if (!file.type.match(/(jpeg|jpg|png)$/i)) {
      return toast.error('Security Policy: Only JPG or PNG images are allowed.', { duration: 4000 });
    }
    
    if (file.size > 3 * 1024 * 1024) return toast.error('Logo too large (max 3MB)');
    
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const canStep1 = shopName.trim().length >= 2;
  const canStep2 = slug.length >= 3 && slugStatus === 'available';
  const canStep3 = phone.trim().length >= 5;

  const handleNext = () => {
    if (step === 1 && !canStep1) return toast.error('Enter your business name');
    if (step === 2 && !canStep2) return toast.error('Choose an available shop link');
    if (step === 3 && !canStep3) return toast.error('Enter a valid WhatsApp number');
    setStep(s => s + 1);
  };

  const handleFinish = async () => {
    if (!user) return toast.error('Session expired. Please sign in again.');
    setLoading(true);
    try {
      let logoUrl = null;
      if (logoFile) {
        const ext      = logoFile.name.split('.').pop();
        const fileName = `logos/${user.id}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from('product-images').upload(fileName, logoFile, { upsert: true });
        if (upErr) throw upErr;
        const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
        logoUrl = urlData.publicUrl;
      }

      const formattedPhone = formatPhone(phone, country);
      const vendorCurrency = country === 'NG' ? 'NGN' : 'USD';

      const { data: existingPhone } = await supabase
        .from('vendors').select('id').eq('phone', formattedPhone).maybeSingle();
      if (existingPhone) throw new Error('This phone number is already linked to another store.');

      const refCode = sessionStorage.getItem('shoplink_ref') || null;

      const { data: { user: authUser } } = await supabase.auth.getUser();
      const authProvider = authUser?.identities?.some(i => i.provider === 'google') ? 'google' : 'email';

      const { data: vendor, error: vendorError } = await supabase
        .from('vendors')
        .insert({
          id:              user.id,
          shop_name:       shopName.trim(),
          slug:            slug.trim(),
          email:           user.email || null,
          phone:           formattedPhone,
          logo_url:        logoUrl,
          plan_type:       'free',
          country:         country,
          currency:        vendorCurrency,
          uploaded_count:  0,
          views:           0,
          is_admin:        false,
          is_suspended:    false,
          signup_platform: 'web',
          referred_by:     refCode,
          auth_provider:   authProvider,
        })
        .select()
        .single();

      if (vendorError) {
        console.error('Vendor insert error:', vendorError);
        if (vendorError.code === '23505') throw new Error('That shop link is already taken. Choose another.');
        throw new Error(vendorError.message);
      }

      if (refCode) {
        // Write to immutable referral ledger.
        // Unique constraint on (referrer_slug, referred_email) silently blocks farming
        // if this email re-registers with the same referral code later.
        await supabase.from('referrals').insert({
          referrer_slug:    refCode,
          referred_user_id: vendor.id,
          referred_email:   user.email || vendor.id,
        });
        sessionStorage.removeItem('shoplink_ref');
      }
      setUser({ ...user, vendor });
      toast.success('Your store is live!');
      setTimeout(() => navigate('/dashboard'), 900);

    } catch (err) {
      console.error('Onboarding error:', err);
      toast.error(err.message || 'Setup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const panel    = PANELS[step - 1];
  const progress = (step / STEPS.length) * 100;

  // Polished premium input style
  const inputCls = `block w-full px-5 py-4 rounded-2xl outline-none font-bold text-lg
    bg-slate-50 dark:bg-slate-900/50
    border-2 border-slate-200 dark:border-slate-800
    text-slate-900 dark:text-white
    placeholder-slate-300 dark:placeholder-slate-600
    focus:border-emerald-500 dark:focus:border-emerald-500
    focus:bg-white dark:focus:bg-slate-900
    focus:ring-4 focus:ring-emerald-500/10
    transition-all duration-300 shadow-sm`;

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950 font-sans overflow-hidden transition-colors duration-300">
      <Toaster position="top-center" toastOptions={{ className: 'dark:bg-slate-800 dark:text-white' }} />

      {/* ── LEFT: Form Panel ── */}
      <div className="flex-1 flex flex-col min-h-screen relative z-10 bg-white dark:bg-slate-950">

        {/* Top bar */}
        <div className="flex items-center justify-between px-8 pt-8 pb-0 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <img src={logo} alt="ShopLink" className="w-5 h-5 object-contain brightness-0 invert" />
            </div>
            <span className="font-black text-base tracking-tighter text-slate-900 dark:text-white italic">
              ShopLink<span className="text-emerald-500 not-italic">.vi</span>
            </span>
          </div>
          
          {/* 🔥 THE FIX: High contrast Progress Indicators */}
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className={`flex items-center justify-center transition-all duration-500 ${
                  step > s.id
                    ? 'w-6 h-6 rounded-full bg-emerald-500 text-white'
                    : step === s.id
                      ? 'w-6 h-6 rounded-full bg-emerald-500 text-white ring-4 ring-emerald-500/20 shadow-lg shadow-emerald-500/30'
                      : 'w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600'
                }`}>
                  {step > s.id
                    ? <Check size={12} strokeWidth={3} />
                    : <span className={`text-[10px] font-black ${step === s.id ? 'text-white' : 'text-slate-500 dark:text-slate-300'}`}>{s.id}</span>
                  }
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-6 h-[3px] rounded-full transition-all duration-500 ${
                    step > s.id ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Thin progress line */}
        <div className="h-[2px] bg-slate-100 dark:bg-slate-800/50 mt-6 mx-8 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Form content */}
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-10">
          <div className="w-full max-w-md mx-auto">

            <div key={step} className="animate-in slide-in-from-right-4 fade-in duration-400">

              {/* STEP 1 */}
              {step === 1 && (
                <div>
                  <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
                    <Store size={11} /> Step 1 of 4
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.1] mb-3">
                    What's your<br />business called?
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-8 leading-relaxed">
                    This is the name your customers will see on your store. Make it memorable.
                  </p>
                  <div className="space-y-2 group">
                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-emerald-500">
                      Business Name
                    </label>
                    <input
                      type="text" autoFocus maxLength={50}
                      placeholder="e.g. Amaka's Fashion House"
                      value={shopName}
                      className={inputCls}
                      onChange={(e) => setShopName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && canStep1 && handleNext()}
                    />
                    <div className="flex justify-between items-center ml-1 mt-1">
                      <p className="text-[11px] text-slate-400 font-medium">{shopName.length}/50</p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div>
                  <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
                    <LinkIcon size={11} /> Step 2 of 4
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.1] mb-3">
                    Claim your<br />store link.
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-8 leading-relaxed">
                    Permanent. Share it everywhere. Choose wisely — you can't change this later.
                  </p>
                  <div className="space-y-3 group">
                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-emerald-500">
                      Your Store Link
                    </label>
                    <div className={`flex items-center rounded-2xl border-2 overflow-hidden transition-all duration-300 shadow-sm focus-within:ring-4 ${
                      slugStatus === 'taken'
                        ? 'border-red-400 bg-red-50 dark:bg-red-500/5 focus-within:ring-red-500/10'
                        : slugStatus === 'available'
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/5 focus-within:ring-emerald-500/10'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 focus-within:border-emerald-500 focus-within:ring-emerald-500/10'
                    }`}>
                      <span className="flex-shrink-0 pl-4 pr-2 py-4 text-slate-400 dark:text-slate-500 text-sm font-black border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-black/20">
                        shop.vi/
                      </span>
                      <input
                        type="text" autoFocus placeholder="your-store"
                        value={slug} maxLength={24}
                        className={`flex-1 px-3 py-4 bg-transparent outline-none font-black text-lg lowercase min-w-0 ${
                          slugStatus === 'taken'
                            ? 'text-red-600 dark:text-red-400'
                            : slugStatus === 'available'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-slate-900 dark:text-white'
                        }`}
                        onChange={handleSlugChange}
                        onKeyDown={(e) => e.key === 'Enter' && canStep2 && handleNext()}
                      />
                      <div className="pr-4 flex-shrink-0">
                        {slugStatus === 'checking'  && <Loader2 size={16} className="animate-spin text-slate-400" />}
                        {slugStatus === 'available' && <CheckCircle2 size={16} className="text-emerald-500" />}
                        {slugStatus === 'taken'     && <XCircle size={16} className="text-red-500" />}
                      </div>
                    </div>
                    {slugStatus === 'available' && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold ml-1 flex items-center gap-1.5 animate-in fade-in">
                        <CheckCircle2 size={12} /> shop.vi/{slug} is yours!
                      </p>
                    )}
                    {slugStatus === 'taken' && (
                      <p className="text-xs text-red-500 font-bold ml-1 animate-in fade-in">That link is taken. Try something else.</p>
                    )}
                    {slugStatus === 'taken' && suggestions.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 mt-1 animate-in fade-in">
                        <span className="text-xs text-slate-400 ml-1">Try:</span>
                        {suggestions.map(s => (
                          <button key={s} type="button"
                            onClick={() => { setSlug(s); setSuggestions([]); }}
                            className="px-3 py-1 text-xs bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors font-bold">
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium ml-1">Letters, numbers and hyphens · Max 24 characters</p>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div>
                  <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
                    <Phone size={11} /> Step 3 of 4
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.1] mb-3">
                    Where do orders<br />get delivered?
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-8 leading-relaxed">
                    Every order from your store lands directly in this WhatsApp number.
                  </p>
                  <div className="space-y-3 group">
                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-emerald-500">
                      Country
                    </label>
                    <div className="relative">
                      <button onClick={() => { setShowCountryDropdown(!showCountryDropdown); setCountrySearch(''); }}
                        className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl border-2 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-left outline-none focus:border-emerald-500 transition-all ${inputCls}`}>
                        <img src={COUNTRIES.find(c => c.code === country)?.flag} className="w-7 h-7 object-cover rounded-sm inline-block" />
                        <span className="flex-1 font-bold text-sm text-slate-900 dark:text-white">
                          {COUNTRIES.find(c => c.code === country)?.name}
                        </span>
                        <span className="text-sm font-black text-slate-400">{getDialCode(country)}</span>
                        <ChevronDown size={16} className="text-slate-400" />
                      </button>
                      {showCountryDropdown && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setShowCountryDropdown(false)} />
                          <div className="absolute z-20 top-full mt-2 left-0 right-0 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 rounded-2xl max-h-60 flex flex-col">
                            <div className="p-2 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 rounded-t-2xl">
                              <input type="text" value={countrySearch} autoFocus
                                onChange={(e) => setCountrySearch(e.target.value)}
                                placeholder="Search countries..."
                                className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold outline-none text-slate-700 dark:text-slate-300 placeholder:text-slate-400" />
                            </div>
                            <div className="overflow-y-auto flex-1">
                              {COUNTRIES.filter(c => {
                                const q = countrySearch.trim().toLowerCase();
                                if (!q) return true;
                                return (
                                  c.name.toLowerCase().includes(q) ||
                                  c.code.toLowerCase().includes(q) ||
                                  c.dial.includes(countrySearch.trim())
                                );
                              }).map(c => (
                                <button key={c.code} onClick={() => { setCountry(c.code); setShowCountryDropdown(false); }}
                                  className={`w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-all ${country === c.code ? 'bg-emerald-50 dark:bg-emerald-500/10' : ''}`}>
                                  <img src={c.flag} className="w-5 h-5 object-cover rounded-sm inline-block" />
                                  <span className="flex-1 font-bold text-xs text-slate-700 dark:text-slate-300">{c.name}</span>
                                  <span className="text-xs font-black text-slate-400">{c.dial}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3 group mt-4">
                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-emerald-500">
                      WhatsApp Number
                    </label>
                    <div className="flex items-center rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all overflow-hidden shadow-sm">
                      <span className="flex-shrink-0 pl-5 pr-3 py-4 text-sm font-black text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-black/20">
                        {getDialCode(country)}
                      </span>
                      <input
                        type="tel" autoFocus
                        placeholder="812 345 6789"
                        value={phone}
                        className="flex-1 px-4 py-4 bg-transparent outline-none font-bold text-lg text-slate-900 dark:text-white min-w-0"
                        onChange={(e) => setPhone(e.target.value.replace(/[^0-9\s]/g, ''))}
                        onKeyDown={(e) => e.key === 'Enter' && canStep3 && handleNext()}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium ml-1">
                      Enter your number without the country code — we add it automatically
                    </p>
                    {phone.trim().length >= 4 && (
                      <div className="flex items-center gap-2.5 px-4 py-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 animate-in fade-in slide-in-from-top-2">
                        <WhatsAppIcon size={16} className="text-emerald-500 flex-shrink-0" />
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                          Orders go to: {formatPhone(phone, country)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <div>
                  <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
                    <Camera size={11} /> Step 4 of 4
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.1] mb-3">
                    Add your<br />store logo.
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-8 leading-relaxed">
                    Optional but highly recommended. Makes your store look professional instantly.
                  </p>

                  {/* 🔥 THE FIX: Strict accept types passed to input */}
                  <input 
                    ref={fileRef} 
                    type="file" 
                    accept=".jpg,.jpeg,.png,image/jpeg,image/png" 
                    className="hidden" 
                    onChange={handleLogoSelect} 
                  />
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="relative group cursor-pointer mb-6"
                  >
                    {logoPreview ? (
                      <div className="relative w-36 h-36 mx-auto">
                        <img src={logoPreview} alt="logo"
                          className="w-full h-full rounded-[2rem] object-cover shadow-2xl shadow-emerald-500/20 border-4 border-white dark:border-slate-800 ring-4 ring-emerald-500/20 transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/50 rounded-[2rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                          <Camera size={24} className="text-white" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900">
                          <CheckCircle2 size={18} className="text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-36 h-36 mx-auto rounded-[2rem] border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all group-hover:scale-105 shadow-sm">
                        <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm mb-3 group-hover:bg-emerald-500 transition-colors border border-slate-100 dark:border-slate-700">
                          <Camera size={20} className="text-slate-400 dark:text-slate-500 group-hover:text-white transition-colors" />
                        </div>
                        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          Upload Logo
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 font-medium mb-6">PNG or JPG · Max 3MB · Square ratio best</p>

                </div>
              )}
            </div>

            {/* Nav buttons */}
            <div className="flex gap-3 mt-10">
              {step > 1 && (
                <button
                  onClick={() => setStep(s => s - 1)}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 dark:bg-slate-900 border border-transparent dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-40 shadow-sm"
                >
                  <ArrowLeft size={16} strokeWidth={2.5} />
                </button>
              )}

              {step < 4 ? (
                <button
                  onClick={handleNext}
                  disabled={(step===1&&!canStep1)||(step===2&&!canStep2)||(step===3&&!canStep3)}
                  className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-widest text-white bg-emerald-500 hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-30 shadow-xl shadow-emerald-500/30"
                >
                  Continue <ArrowRight size={18} strokeWidth={2.5} />
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-widest text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-emerald-500/30 relative overflow-hidden group"
                >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                  
                  {loading
                    ? <Loader2 size={18} className="animate-spin" />
                    : <><Sparkles size={16} /> Launch My Store</>
                  }
                </button>
              )}
            </div>

            {step === 4 && !loading && (
              <div className="text-center mt-6">
                <button
                  onClick={handleFinish}
                  className="text-[11px] font-black text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 uppercase tracking-widest transition-colors"
                >
                  Skip for now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-slate-300 dark:text-slate-600 font-bold uppercase tracking-widest pb-6">
          You can change everything in settings later
        </p>
      </div>

      {/* ── RIGHT: Deep Dark Premium Preview Panel (Desktop Only) ── */}
      <div className="hidden lg:flex w-[560px] flex-shrink-0 bg-slate-950 border-l border-slate-900 flex-col items-center justify-center p-12 relative overflow-hidden">

        {/* Immersive Background Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Subtle dot pattern grid */}
        <div className="absolute inset-0 opacity-[0.15]"
          style={{ backgroundImage: 'radial-gradient(circle, #475569 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative z-10 w-full max-w-[360px]">
          {/* Dynamic Copy */}
          <div key={step} className="animate-in fade-in slide-in-from-bottom-6 duration-500 mb-12">
            <h2 className="text-3xl font-black text-white tracking-tighter leading-[1.1] mb-4 whitespace-pre-line">
              {panel.headline}
            </h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">{panel.sub}</p>
            <ul className="space-y-4">
              {panel.points.map((pt, i) => (
                <li key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center flex-shrink-0 shadow-lg backdrop-blur-sm">
                    <pt.icon size={16} className="text-emerald-400" />
                  </div>
                  <span className="text-sm font-bold text-slate-300">{pt.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Upgraded Glassmorphic Store Preview */}
          <StorePreviewCard
            shopName={shopName}
            slug={slug}
            logoPreview={logoPreview}
            step={step}
          />
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}