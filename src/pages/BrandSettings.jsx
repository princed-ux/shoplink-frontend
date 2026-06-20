import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  Store, Camera, Loader2, Globe, CheckCircle2,
  FileText, Phone, Mail, Save, Palette, ImageIcon,
  X, Link as LinkIcon, XCircle, Check, Lock, Zap, MessageSquare
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import { PRO_THEMES, hasPlan, PREMIUM_EXCLUSIVE_THEMES } from '../data/plans';
import { COUNTRIES, getDialCode, formatPhone } from '../data/countries';
import { Link, useOutletContext } from 'react-router-dom';

// ── Theme definitions (exported so Storefront can import) ─────
export const STOREFRONT_THEMES = [
  // Free
  { id: 'minimal',      label: 'Minimal',        desc: 'Clean & simple',          previewStyle: { background: '#f8fafc' } },
  { id: 'dark',         label: 'Dark',           desc: 'Sleek dark mode',         previewStyle: { background: '#020617' } },
  { id: 'gradient',     label: 'Gradient',       desc: 'Soft colour mesh',        previewStyle: { background: 'linear-gradient(135deg,#ecfdf5,#eff6ff,#fdf4ff)' } },
  // Pro
  { id: 'bubbles',      label: 'Bubbles',        desc: 'Animated green spheres',  previewStyle: { background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)' } },
  { id: 'aurora',       label: 'Aurora',         desc: 'Northern lights sky',     previewStyle: { background: 'linear-gradient(135deg,#000814,#064e3b,#0f172a)' } },
  { id: 'neon',         label: 'Neon',           desc: 'Cyberpunk grid glow',     previewStyle: { background: 'linear-gradient(135deg,#030712,#052e16)' } },
  { id: 'sunset',       label: 'Sunset',         desc: 'Warm golden sky',         previewStyle: { background: 'linear-gradient(135deg,#fbbf24,#f97316,#ec4899)' } },
  { id: 'ocean',        label: 'Ocean',          desc: 'Animated deep water',     previewStyle: { background: 'linear-gradient(135deg,#001233,#023e8a,#0096c7)' } },
  { id: 'candy',        label: 'Candy',          desc: 'Playful pastel shapes',   previewStyle: { background: 'linear-gradient(135deg,#fce7f3,#dbeafe,#fef3c7)' } },
  { id: 'midnight',     label: 'Midnight',       desc: 'Moon & starfield',        previewStyle: { background: 'linear-gradient(135deg,#000814,#001233,#023e8a)' } },
  { id: 'forest',       label: 'Forest',         desc: 'Fireflies & mist',        previewStyle: { background: 'linear-gradient(135deg,#052e16,#14532d,#166534)' } },
  { id: 'lavender',     label: 'Lavender',       desc: 'Drifting petals & mist',  previewStyle: { background: 'linear-gradient(135deg,#faf5ff,#e9d5ff,#a78bfa)' } },
  // Premium
  { id: 'royal',        label: 'Royal',          desc: 'Luxury gold & crimson',   previewStyle: { background: 'linear-gradient(135deg,#1a0a00,#3b0d00,#7c2d12)' }, premiumOnly: true },
  { id: 'diamond',      label: 'Diamond',        desc: 'Crystal prism shimmer',   previewStyle: { background: 'linear-gradient(135deg,#0a0e1a,#0f1729,#1a2540)' }, premiumOnly: true },
  { id: 'galaxy',       label: 'Galaxy',         desc: 'Cosmic stars & nebulae',  previewStyle: { background: 'linear-gradient(135deg,#000000,#0a0015,#07001f)' }, premiumOnly: true },
  { id: 'cybercity',    label: 'Cyber City',     desc: 'Neon futuristic skyline', previewStyle: { background: 'linear-gradient(135deg,#020409,#060b1a,#0a1228)' }, premiumOnly: true },
  { id: 'goldenempire', label: 'Golden Empire',  desc: 'Imperial palace & gold',  previewStyle: { background: 'linear-gradient(135deg,#1c0a00,#2d1400,#3d1a00)' }, premiumOnly: true },
  { id: 'arcticcrystal',label: 'Arctic Crystal', desc: 'Ice & falling snow',      previewStyle: { background: 'linear-gradient(135deg,#c8e6f5,#dbeffe,#eef7ff)' }, premiumOnly: true },
  { id: 'volcano',      label: 'Volcano',        desc: 'Lava, embers & smoke',    previewStyle: { background: 'linear-gradient(135deg,#0a0200,#1a0500,#2d0a00)' }, premiumOnly: true },
  { id: 'luxuryblack',  label: 'Luxury Black',   desc: 'Black marble & gold',     previewStyle: { background: 'linear-gradient(135deg,#000000,#0d0b06,#1a1500)' }, premiumOnly: true },
  // Custom (always last)
  { id: 'custom',       label: 'Custom Image',   desc: 'Your own background',     previewStyle: { background: 'linear-gradient(135deg,#1e293b,#334155)' }, isCustom: true },
];

export default function BrandSettings({ user, setUser }) {
  const { openUpgradeModal } = useOutletContext() || {};
  const isPro     = hasPlan(user?.vendor, 'pro');
  const isPremium = hasPlan(user?.vendor, 'premium');

  const [shopName, setShopName]         = useState(user?.vendor?.shop_name || '');
  const [slug, setSlug]                 = useState(user?.vendor?.slug || '');
  const [slugStatus, setSlugStatus]     = useState('idle'); // idle | checking | available | taken | unchanged
  const [bio, setBio]                   = useState(user?.vendor?.bio || '');
  const brandCountry = user?.vendor?.country || 'NG';
  const brandDial = getDialCode(brandCountry);
  const initialWhatsapp = (() => {
    const p = user?.vendor?.phone || '';
    return p.startsWith(brandDial) ? p.slice(brandDial.length) : p.replace(/^\+/, '');
  })();
  const [whatsapp, setWhatsapp]         = useState(initialWhatsapp);
  const [logoFile, setLogoFile]         = useState(null);
  const [logoPreview, setLogoPreview]   = useState(user?.vendor?.logo_url || null);
  const [selectedTheme, setSelectedTheme] = useState(user?.vendor?.storefront_theme || 'minimal');
  const [bgFile, setBgFile]             = useState(null);
  const [bgPreview, setBgPreview]       = useState(user?.vendor?.storefront_bg_url || null);
  const [checkoutMsg, setCheckoutMsg]   = useState(user?.vendor?.checkout_message || '');
  const [loading, setLoading]           = useState(false);

  const logoInputRef = useRef(null);
  const bgInputRef   = useRef(null);
  const originalSlug = user?.vendor?.slug || '';

  useEffect(() => {
    if (user?.vendor) {
      setShopName(user.vendor.shop_name || '');
      setSlug(user.vendor.slug || '');
      setBio(user.vendor.bio || '');
      setWhatsapp(user.vendor.phone || '');
      setLogoPreview(user.vendor.logo_url || null);
      setSelectedTheme(user.vendor.storefront_theme || 'minimal');
      setBgPreview(user.vendor.storefront_bg_url || null);
      setCheckoutMsg(user.vendor.checkout_message || '');
    }
  }, [user?.vendor?.id]);

  // Slug availability check
  useEffect(() => {
    if (!slug || slug === originalSlug) { setSlugStatus(slug === originalSlug ? 'unchanged' : 'idle'); return; }
    if (slug.length < 3) { setSlugStatus('idle'); return; }
    setSlugStatus('checking');
    const t = setTimeout(async () => {
      const { data } = await supabase
        .from('vendors').select('slug').eq('slug', slug).maybeSingle();
      setSlugStatus(data ? 'taken' : 'available');
    }, 500);
    return () => clearTimeout(t);
  }, [slug]);

  const handleSlugChange = (e) => {
    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 24));
  };

  const handleLogoSelect = (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) return toast.error('Logo too large (max 3MB)');
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleBgSelect = (e) => {
    if (!isPro) { openUpgradeModal?.(); return; }
    const file = e?.target?.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error('Image too large (max 5MB)');
    setBgFile(file);
    setBgPreview(URL.createObjectURL(file));
    setSelectedTheme('custom');
  };

  const handleSave = async () => {
    if (!shopName.trim()) return toast.error('Shop name cannot be empty');
    if (slug !== originalSlug && slugStatus === 'taken') return toast.error('That link is already taken');
    if (slug !== originalSlug && slugStatus === 'checking') return toast.error('Still checking slug availability');
    if (slug.length < 3) return toast.error('Store link must be at least 3 characters');

    setLoading(true);
    try {
      let logoUrl = user.vendor.logo_url;
      let bgUrl   = user.vendor.storefront_bg_url || null;

      if (logoFile) {
        const ext = logoFile.name.split('.').pop();
        const fileName = `logos/${user.vendor.id}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from('product-images').upload(fileName, logoFile, { upsert: true });
        if (upErr) throw upErr;
        const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
        logoUrl = urlData.publicUrl;
      }

      if (bgFile) {
        const ext = bgFile.name.split('.').pop();
        const fileName = `backgrounds/${user.vendor.id}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from('product-images').upload(fileName, bgFile, { upsert: true });
        if (upErr) throw upErr;
        const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
        bgUrl = urlData.publicUrl;
      }

      // Enforce plan — strip locked values if user doesn't have the required plan
      const isPremiumTheme = PREMIUM_EXCLUSIVE_THEMES.includes(selectedTheme);
      const isProTheme     = PRO_THEMES.includes(selectedTheme);
      const allowedTheme   = (isPremiumTheme && !isPremium) || (isProTheme && !isPro)
        ? 'minimal'
        : selectedTheme;
      const allowedBgUrl   = allowedTheme === 'custom' && isPro ? bgUrl : null;

      const updates = {
        shop_name:         shopName.trim(),
        slug:              slug.trim(),
        logo_url:          logoUrl,
        bio:               bio.trim() || null,
        storefront_theme:  allowedTheme,
        storefront_bg_url: allowedBgUrl,
        ...(isPremium && { checkout_message: checkoutMsg.trim() || null }),
      };

      if (allowedTheme !== selectedTheme) {
        toast.error('Theme requires a paid plan — reverted to Minimal.');
        setSelectedTheme('minimal');
      }

      if (whatsapp.trim() && whatsapp !== user.vendor.phone) {
        const formatted = formatPhone(whatsapp, brandCountry);
        const { data: existing } = await supabase
          .from('vendors').select('id').eq('phone', formatted).maybeSingle();
        if (existing && existing.id !== user.vendor.id)
          throw new Error('This phone number is already linked to another store.');
        updates.phone = formatted;
      }

      const { data, error } = await supabase
        .from('vendors').update(updates).eq('id', user.vendor.id).select().single();
      if (error) throw error;

      setUser({ ...user, vendor: data });
      setLogoPreview(data.logo_url);
      setBgPreview(data.storefront_bg_url);
      setLogoFile(null);
      setBgFile(null);
      setSlugStatus('unchanged');
      toast.success('Branding saved!');
    } catch (err) {
      toast.error(err.message || 'Failed to save.');
    } finally {
      setLoading(false);
    }
  };

  const origShopName     = user?.vendor?.shop_name || '';
  const origSlug         = user?.vendor?.slug || '';
  const origBio          = user?.vendor?.bio || '';
  const origTheme        = user?.vendor?.storefront_theme || 'minimal';
  const origLogo         = user?.vendor?.logo_url || null;
  const origBg           = user?.vendor?.storefront_bg_url || null;
  const origCheckoutMsg  = user?.vendor?.checkout_message || '';
  const hasChanges =
    shopName !== origShopName ||
    slug !== origSlug ||
    bio !== origBio ||
    whatsapp !== initialWhatsapp ||
    selectedTheme !== origTheme ||
    logoFile !== null ||
    logoPreview !== origLogo ||
    bgFile !== null ||
    bgPreview !== origBg ||
    (isPremium && checkoutMsg !== origCheckoutMsg);

  const inputCls = `w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/60 border-2 border-slate-100
    dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-white
    placeholder-slate-300 dark:placeholder-slate-600 outline-none
    focus:border-emerald-500 dark:focus:border-emerald-500
    focus:bg-white dark:focus:bg-slate-800 transition-all`;

  const cardCls = `bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm p-8`;

  return (
    <div className="max-w-4xl mx-auto pb-20 pt-6 space-y-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Branding</h1>
        <p className="text-slate-400 font-medium text-sm mt-2">Customize how your store looks to customers.</p>
      </div>

      {/* ── ROW 1: Logo + Shop Name ── */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Logo */}
        <div className={cardCls}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <Camera size={18} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white">Store Logo</h3>
              <p className="text-xs text-slate-400 font-medium">PNG, JPG · Max 3MB · Square</p>
            </div>
          </div>
          <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoSelect} />
          <div className="flex items-center gap-5">
            <div onClick={() => logoInputRef.current?.click()} className="relative group cursor-pointer flex-shrink-0">
              <div className="w-20 h-20 rounded-[1.25rem] bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center hover:border-emerald-500 transition-all group-hover:scale-105 shadow-sm">
                {logoPreview
                  ? <img src={logoPreview} className="w-full h-full object-cover" alt="logo" />
                  : <Store size={28} className="text-slate-300 dark:text-slate-600" />
                }
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-[1.25rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={18} className="text-white" />
              </div>
              {logoPreview && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle2 size={10} className="text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <button onClick={() => logoInputRef.current?.click()}
                className="w-full py-3 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-black text-slate-500 dark:text-slate-400 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/5 transition-all">
                {logoPreview ? 'Change Logo' : 'Upload Logo'}
              </button>
              {logoPreview && (
                <button onClick={() => { setLogoPreview(null); setLogoFile(null); }}
                  className="w-full py-2 text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors">
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Shop Name */}
        <div className={cardCls}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <Store size={18} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white">Business Name</h3>
              <p className="text-xs text-slate-400 font-medium">Shown on storefront and orders</p>
            </div>
          </div>
          <input type="text" maxLength={50} placeholder="e.g. Amaka's Fashion House"
            value={shopName} className={inputCls} onChange={(e) => setShopName(e.target.value)} />
          <p className="text-[11px] text-slate-400 font-medium mt-2 ml-1">{shopName.length}/50</p>
        </div>
      </div>

      {/* ── STORE LINK (editable slug) ── */}
      <div className={cardCls}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center">
            <LinkIcon size={18} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 dark:text-white">Store Link</h3>
            <p className="text-xs text-slate-400 font-medium">You can change this — we'll check availability first</p>
          </div>
        </div>
        <div className={`flex items-center rounded-2xl border-2 overflow-hidden transition-all ${
          slugStatus === 'taken'     ? 'border-red-400 dark:border-red-500/50 bg-red-50 dark:bg-red-500/5'
          : slugStatus === 'available' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/5'
          : slugStatus === 'unchanged' ? 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60'
          : 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60'
        }`}>
          <span className="flex-shrink-0 pl-4 pr-3 py-4 text-slate-400 dark:text-slate-500 text-sm font-black border-r border-slate-100 dark:border-slate-700">
            shop.vi/
          </span>
          <input
            type="text" placeholder="your-store"
            value={slug} maxLength={24}
            className={`flex-1 px-3 py-4 bg-transparent outline-none font-black text-base lowercase min-w-0 ${
              slugStatus === 'taken'     ? 'text-red-600 dark:text-red-400'
              : slugStatus === 'available' ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-900 dark:text-white'
            }`}
            onChange={handleSlugChange}
          />
          <div className="pr-4 flex-shrink-0 flex items-center">
            {slugStatus === 'checking'  && <Loader2 size={16} className="animate-spin text-slate-400" />}
            {slugStatus === 'available' && <CheckCircle2 size={16} className="text-emerald-500" />}
            {slugStatus === 'taken'     && <XCircle size={16} className="text-red-400" />}
            {slugStatus === 'unchanged' && <CheckCircle2 size={16} className="text-slate-300 dark:text-slate-600" />}
          </div>
        </div>
        {slugStatus === 'available' && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-2 ml-1 flex items-center gap-1">
            <CheckCircle2 size={11} /> shop.vi/{slug} is available!
          </p>
        )}
        {slugStatus === 'taken' && (
          <p className="text-xs text-red-500 font-bold mt-2 ml-1">That link is taken. Try something different.</p>
        )}
        {slugStatus === 'unchanged' && (
          <p className="text-[11px] text-slate-400 font-medium mt-2 ml-1">Current link — edit to change it</p>
        )}
        <p className="text-[11px] text-slate-400 font-medium mt-1 ml-1">Letters, numbers and hyphens · Max 24 characters</p>
      </div>

      {/* ── BIO ── */}
      <div className={cardCls}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-50 dark:bg-purple-500/10 rounded-xl flex items-center justify-center">
            <FileText size={18} className="text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 dark:text-white">Store Description</h3>
            <p className="text-xs text-slate-400 font-medium">Short tagline on your store page</p>
          </div>
        </div>
        <textarea rows={3} maxLength={160}
          placeholder="e.g. Affordable fashion for every occasion. Lagos delivery available."
          value={bio} className={`${inputCls} resize-none`} onChange={(e) => setBio(e.target.value)} />
        <p className="text-[11px] text-slate-400 font-medium mt-2 ml-1">{bio.length}/160</p>
      </div>

      {/* ── WHATSAPP ── */}
      <div className={cardCls}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#25D36615' }}>
            <Phone size={18} style={{ color: '#25D366' }} />
          </div>
          <div>
            <h3 className="font-black text-slate-900 dark:text-white">WhatsApp Number</h3>
            <p className="text-xs text-slate-400 font-medium">Orders are sent here</p>
          </div>
        </div>
        {/* Country — read-only */}
        {(() => {
          const c = COUNTRIES.find(c => c.code === brandCountry);
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
        <div className="flex items-center gap-2">
          <input type="tel" placeholder={brandCountry === 'NG' ? '802 345 6789' : '712 345 6789'} value={whatsapp}
            className={`flex-1 ${inputCls}`} onChange={(e) => setWhatsapp(e.target.value.replace(/[^0-9\s]/g, ''))} />
        </div>
        {whatsapp && (whatsapp !== user?.vendor?.phone?.replace(/^\+/, '').replace(/^\d+/, '')) && (
          <div className="flex items-center gap-2 mt-3 px-4 py-2.5 rounded-xl" style={{ background: '#25D36610', border: '1px solid #25D36625' }}>
            <CheckCircle2 size={13} style={{ color: '#25D366' }} />
            <span className="text-xs font-bold" style={{ color: '#25D366' }}>Will update to: {formatPhone(whatsapp, brandCountry)}</span>
          </div>
        )}
      </div>

      {/* ── CUSTOM CHECKOUT MESSAGE (Premium only) ── */}
      {isPremium && (
        <div className={cardCls}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-500/10 rounded-xl flex items-center justify-center">
              <MessageSquare size={18} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white">Custom Checkout Message</h3>
              <p className="text-xs text-slate-400 font-medium">Shown to customers at the end of their WhatsApp order</p>
            </div>
          </div>
          <textarea rows={3} maxLength={200}
            placeholder="e.g. Thank you for ordering! We'll confirm delivery within 30 minutes."
            value={checkoutMsg} className={`${inputCls} resize-none`}
            onChange={e => setCheckoutMsg(e.target.value)} />
          <p className="text-[11px] text-slate-400 font-medium mt-2 ml-1">{checkoutMsg.length}/200</p>
        </div>
      )}

      {/* ── STOREFRONT THEME PICKER ── */}
      <div className={cardCls}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center">
            <Palette size={18} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 dark:text-white">Storefront Theme</h3>
            <p className="text-xs text-slate-400 font-medium">Choose the look of your public store</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {STOREFRONT_THEMES.map((t) => {
            const isSelected  = selectedTheme === t.id;
            const premiumLock = PREMIUM_EXCLUSIVE_THEMES.includes(t.id) && !isPremium;
            const proLock     = PRO_THEMES.includes(t.id) && !isPro;
            const locked      = premiumLock || proLock;
            const lockLabel   = premiumLock ? 'GOLD' : 'PRO';
            return (
              <button
                key={t.id}
                onClick={() => {
                  if (locked) { openUpgradeModal?.(); return; }
                  setSelectedTheme(t.id);
                  if (t.id !== 'custom') setBgFile(null);
                }}
                className={`relative flex flex-col rounded-[1.5rem] overflow-hidden border-2 transition-all ${
                  locked ? 'opacity-70 cursor-pointer' : 'active:scale-95'
                } ${
                  isSelected ? 'border-emerald-500 shadow-xl shadow-emerald-500/20' : 'border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                {/* Preview swatch */}
                <div className="h-16 w-full relative overflow-hidden" style={t.previewStyle}>
                  {t.id === 'custom' && bgPreview && (
                    <img src={bgPreview} className="w-full h-full object-cover opacity-70" alt="bg" />
                  )}
                  {t.id === 'custom' && !bgPreview && (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={20} className="text-slate-400" />
                    </div>
                  )}
                  {/* Mini product cards */}
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 flex gap-1">
                    {[0,1].map(i => (
                      <div key={i} className="flex-1 h-4 rounded bg-white/25 backdrop-blur-sm" />
                    ))}
                  </div>
                  {/* Lock overlay */}
                  {locked && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Lock size={16} className="text-white drop-shadow" />
                    </div>
                  )}
                </div>
                {/* Label */}
                <div className={`px-2.5 py-2 ${isSelected ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-white dark:bg-slate-800'}`}>
                  <p className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>
                    {t.label}
                    {locked && (
                      <span className={`text-[8px] px-1 py-0.5 rounded font-black ${premiumLock ? 'bg-yellow-100 text-yellow-700' : 'bg-amber-100 text-amber-700'}`}>
                        {lockLabel}
                      </span>
                    )}
                  </p>
                  <p className="text-[9px] text-slate-400">{t.desc}</p>
                </div>
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-md border border-white dark:border-slate-800">
                    <Check size={12} strokeWidth={3} className="text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Pro upgrade prompt if free user */}
        {!isPro && (
          <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-2xl">
            <Zap size={16} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <p className="text-xs font-bold text-amber-700 dark:text-amber-400 flex-1">
              6 exclusive themes are locked. <button onClick={() => openUpgradeModal?.()} className="underline hover:no-underline font-black">Upgrade to Pro</button> to unlock all themes and custom backgrounds.
            </p>
          </div>
        )}

        {/* Custom bg upload — Pro+ only */}
        {selectedTheme === 'custom' && isPro && (
          <div className="p-5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
            <input type="file" ref={bgInputRef} className="hidden" accept="image/*" onChange={handleBgSelect} />
            <div className="flex items-center gap-4">
              {bgPreview ? (
                <div className="relative flex-shrink-0">
                  <img src={bgPreview} className="w-20 h-14 object-cover rounded-xl border border-slate-200 dark:border-slate-700" alt="bg" />
                  <button onClick={() => { setBgPreview(null); setBgFile(null); }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg">
                    <X size={10} />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-14 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ImageIcon size={20} className="text-slate-400" />
                </div>
              )}
              <div className="flex-1">
                <p className="font-black text-slate-900 dark:text-white text-sm mb-1">{bgPreview ? 'Background uploaded' : 'Upload your background'}</p>
                <p className="text-xs text-slate-400 font-medium mb-3">JPG, PNG · Max 5MB · Landscape works best</p>
                <button onClick={() => bgInputRef.current?.click()}
                  className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black text-slate-600 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 transition-all">
                  {bgPreview ? 'Change Image' : 'Choose Image'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── CURRENT PLAN ── */}
      <div className={cardCls}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isPro ? 'bg-amber-50 dark:bg-amber-500/10' : 'bg-slate-50 dark:bg-slate-900'
          }`}>
            {user?.vendor?.plan_type === 'premium'
              ? <Zap size={18} className="text-purple-600 dark:text-purple-400" fill="currentColor" />
              : isPro
              ? <Zap size={18} className="text-amber-600 dark:text-amber-400" fill="currentColor" />
              : <Lock size={18} className="text-slate-400" />
            }
          </div>
          <div className="flex-1">
            <h3 className="font-black text-slate-900 dark:text-white">Your Plan</h3>
            <p className="text-xs text-slate-400 font-medium capitalize">
              {user?.vendor?.plan_type || 'Free'} · {isPro ? 'All features unlocked' : '6 features locked'}
            </p>
          </div>
          {!isPro && (
            <button
              onClick={() => openUpgradeModal?.()}
              className="flex-shrink-0 flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95"
            >
              <Zap size={12} fill="currentColor" /> Upgrade
            </button>
          )}
        </div>
      </div>

      {/* ── EMAIL read-only ── */}
      {user?.email && (
        <div className={cardCls}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Mail size={18} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white">Account Email</h3>
              <p className="text-xs text-slate-400 font-medium">This Cannot be changed</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl select-none">
            <Mail size={15} className="text-slate-400 flex-shrink-0" />
            <span className="font-bold text-slate-600 dark:text-slate-300 text-sm truncate">{user.email}</span>
          </div>
        </div>
      )}

      {/* ── SAVE ── */}
      <button
        onClick={handleSave}
        disabled={!hasChanges || loading || slugStatus === 'taken' || slugStatus === 'checking'}
        className="w-full flex items-center justify-center gap-3 py-5 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:shadow-none shadow-xl shadow-emerald-500/25"
      >
        {loading ? <Loader2 size={20} className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
      </button>

    </div>
  );
}