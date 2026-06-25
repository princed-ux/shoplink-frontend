import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ShoppingBag, Minus, Plus, Info, Search, X, Check,
  Store, Copy, MessageCircle, Maximize2, AlignLeft, Zap, BadgeCheck,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { supabase } from "../supabaseClient";
import { getCurrency } from '../data/countries';
import { getCurrencySymbol } from '../data/plans';
import { resolveColor } from '../data/colors';
import ThemeBackground from '../themes/ThemeBackground';

// ── WhatsApp Icon ─────────────────────────────────────────────
const WhatsAppIcon = ({ className, size = 24 }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} fill="currentColor" className={className}>
    <path fillRule="evenodd" clipRule="evenodd"
      d="M16 2C8.268 2 2 8.268 2 16c0 2.444.658 4.731 1.806 6.7L2 30l7.497-1.776A13.93 13.93 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.44 11.44 0 01-5.834-1.597l-.418-.248-4.332 1.026 1.07-4.217-.272-.433A11.45 11.45 0 014.5 16C4.5 9.596 9.596 4.5 16 4.5S27.5 9.596 27.5 16 22.404 27.5 16 27.5zm6.29-8.617c-.344-.172-2.036-1.004-2.352-1.118-.316-.115-.546-.172-.776.172-.23.344-.89 1.118-1.09 1.348-.2.23-.4.258-.744.086-.344-.172-1.452-.535-2.766-1.707-1.022-.912-1.712-2.038-1.912-2.382-.2-.344-.021-.53.15-.701.155-.154.344-.402.516-.603.172-.2.23-.344.344-.573.115-.23.058-.43-.029-.603-.086-.172-.776-1.87-1.063-2.56-.28-.672-.564-.58-.776-.591l-.66-.011c-.23 0-.603.086-.918.43-.316.344-1.206 1.177-1.206 2.87s1.235 3.328 1.407 3.558c.172.23 2.43 3.71 5.888 5.203.823.355 1.465.567 1.965.726.826.263 1.578.226 2.172.137.662-.099 2.036-.832 2.323-1.635.287-.803.287-1.491.2-1.635-.086-.143-.316-.23-.66-.402z"
    />
  </svg>
);

// ── Verified badge (custom filled SVG) ───────────────────────
// The Lucide BadgeCheck is stroke-only. We build our own so the
// badge body can carry a real fill (gold gradient / solid blue)
// with a white checkmark drawn on top.
const BADGE_BODY = "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z";
const CHECK_PATH = "m9 12 2 2 4-4";

function VerifiedBadge({ plan, size = 20 }) {
  const p = plan?.toLowerCase();

  if (p === 'premium') {
    return (
      <span
        className="flex-shrink-0 badge-gold"
        style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 0, verticalAlign: 'middle', marginTop: '2px' }}
        title="Verified Premium Store"
      >
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
          <defs>
            <linearGradient id="vb-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#F5D060" />
              <stop offset="30%"  stopColor="#C9A227" />
              <stop offset="65%"  stopColor="#8B6914" />
              <stop offset="100%" stopColor="#C9A227" />
            </linearGradient>
          </defs>
          {/* Filled badge body — dark metallic gold gradient */}
          <path d={BADGE_BODY} fill="url(#vb-gold)" />
          {/* Subtle inner shine */}
          <path d={BADGE_BODY} fill="none" stroke="rgba(255,220,80,0.35)" strokeWidth="0.6" />
          {/* White checkmark */}
          <path d={CHECK_PATH} stroke="white" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }

  if (p === 'pro') {
    return (
      <span
        className="flex-shrink-0"
        style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 0, verticalAlign: 'middle', marginTop: '2px' }}
        title="Verified Pro Store"
      >
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
          {/* Filled badge body — platform blue */}
          <path d={BADGE_BODY} fill="#1d9bf0" />
          {/* Subtle top gloss */}
          <path d={BADGE_BODY} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
          {/* White checkmark */}
          <path d={CHECK_PATH} stroke="white" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }

  return null;
}

// ── Theme backgrounds are in src/themes/ ─────────────────────

// ── Theme-aware text/card colors ─────────────────────────────
function getThemeStyles(theme) {
  const darkThemes = ['dark', 'aurora', 'neon', 'ocean', 'midnight', 'forest', 'royal', 'diamond', 'galaxy', 'cybercity', 'goldenempire', 'volcano', 'luxuryblack'];
  const isDark = darkThemes.includes(theme);
  const isCustom = theme === 'custom'; 

  return {
    isDark: isDark || isCustom,
    navBg: isDark || isCustom ? 'bg-slate-900/80' : 'bg-white/90',
    navBorder: isDark || isCustom ? 'border-white/10' : 'border-slate-100',
    navText: isDark || isCustom ? 'text-white' : 'text-slate-900',
    navSubtext: isDark || isCustom ? 'text-white/60' : 'text-slate-500',
    cardBg: isDark || isCustom ? 'bg-slate-900/80 border-white/10' : 'bg-white border-slate-100',
    cardText: isDark || isCustom ? 'text-white' : 'text-slate-900', 
    cardSubtext: isDark || isCustom ? 'text-white/60' : 'text-slate-500',
    searchBg: isDark || isCustom ? 'bg-white/10 border-white/20 text-white placeholder-white/40 focus:bg-white/15' : 'bg-slate-50 border-slate-100 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500',
    infoBg: isDark || isCustom ? 'bg-slate-900/90' : 'bg-white/95',
    addBtnBg: isDark || isCustom ? 'bg-white/10 hover:bg-emerald-500 text-white' : 'bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-900',
    headerBg: isDark || isCustom ? 'bg-slate-900' : 'bg-slate-900',
  };
}

// ── Skeleton ──────────────────────────────────────────────────
const SkeletonLoader = () => (
  <div className="min-h-screen bg-slate-50 pt-32 px-6">
    <div className="max-w-3xl mx-auto space-y-8 animate-pulse">
      <div className="h-40 bg-slate-200 rounded-[2.5rem] w-full" />
      <div className="h-12 bg-slate-200 rounded-2xl w-full max-w-md mx-auto" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="bg-white rounded-[2rem] p-4 h-64 border border-slate-100">
            <div className="w-full h-32 bg-slate-100 rounded-xl mb-4" />
            <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
            <div className="h-4 bg-slate-100 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── Sticky navbar ─────────────────────────────────────────────
function StickyNavbar({ vendor, totalItems, styles, effectivePlan }) {
  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${styles.navBg} backdrop-blur-md border-b ${styles.navBorder} shadow-sm animate-in fade-in slide-in-from-top-4 duration-300`}>
      <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 bg-slate-100 rounded-full overflow-hidden border-2 border-white/20 flex-shrink-0">
            {vendor.logo_url
              ? <img src={vendor.logo_url} className="w-full h-full object-cover" />
              : <div className={`w-full h-full flex items-center justify-center font-black text-xl ${styles.navText}`}>{vendor.shop_name[0].toUpperCase()}</div>
            }
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <h1 className={`text-lg font-black tracking-tight truncate ${styles.navText}`}>{vendor.shop_name}</h1>
            <span className="inline-flex translate-y-[0.5px]">
              <VerifiedBadge plan={effectivePlan} size={17} />
            </span>
          </div>
        </div>
        {totalItems > 0 && (
          <div className="bg-emerald-500 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg flex-shrink-0">
            <span className="font-black text-sm">{totalItems}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
export default function Storefront() {
  const { slug }  = useParams();
  const [vendor, setVendor]     = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart]                       = useState({});
  const [variantSelections, setVariantSelections] = useState({});
  const [loading, setLoading]   = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInfo, setShowInfo]       = useState(false);
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showStickyNav, setShowStickyNav]     = useState(false);
  const [openVariantDropdown, setOpenVariantDropdown] = useState(null);
  const headerRef  = useRef(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    const fetchShop = async () => {
      try {
        const host = window.location.hostname;
        const isOwnDomain =
          host === 'shoplinkvi.com' ||
          host === 'www.shoplinkvi.com' ||
          host === 'localhost' ||
          host.includes('127.0.0.1') ||
          host.endsWith('.netlify.app') ||
          host.endsWith('.vercel.app');
        const isSubdomain = !isOwnDomain && host.endsWith('.shoplinkvi.com');
        const isCustomDomain = !isOwnDomain && !isSubdomain;
        let vendorData;
        if (isSubdomain) {
          const subdomainSlug = host.split('.')[0];
          const { data } = await supabase
            .from('vendors').select('*').eq('slug', subdomainSlug).maybeSingle();
          vendorData = data;
        } else if (isCustomDomain) {
          const { data } = await supabase
            .from('vendors').select('*').eq('custom_domain', host).eq('custom_domain_verified', true).neq('plan_type', 'free').maybeSingle();
          vendorData = data;
        } else {
          const { data } = await supabase
            .from('vendors').select('*').eq('slug', slug).maybeSingle();
          vendorData = data;
        }
        if (!vendorData) { setLoading(false); return; }
        setVendor(vendorData);
        const { data: productsData } = await supabase
          .from('products').select('*').eq('vendor_id', vendorData.id).order('created_at', { ascending: false });
        setProducts(productsData || []);
        
        // 24hr view cooldown for Storefront Views
        const viewKey = `shop_view_${slug}`;
        const lastView = localStorage.getItem(viewKey);
        const now = Date.now();
        if (!lastView || now - parseInt(lastView) > 86400000) {
          await supabase.rpc('increment_views', { row_id: vendorData.id });
          localStorage.setItem(viewKey, now.toString());
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchShop();
  }, [slug]);

  // ── DYNAMIC PAGE TITLE + OG TAGS ──
  useEffect(() => {
    const setMeta = (selector, attr, value) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const m = selector.match(/\[([^=]+)=['"](.*?)['"]\]/);
        if (m) el.setAttribute(m[1], m[2]);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    if (vendor) {
      const title = `${vendor.shop_name} — Shop on ShopLink.vi`;
      const desc  = `Browse and order from ${vendor.shop_name}. Orders go straight to WhatsApp.`;
      const img   = vendor.logo_url || 'https://shoplinkvi.com/og-default.png';
      const url   = window.location.href;

      document.title = `${vendor.shop_name} | ShopLink.vi`;
      setMeta('meta[property="og:title"]',       'content', title);
      setMeta('meta[property="og:description"]', 'content', desc);
      setMeta('meta[property="og:image"]',       'content', img);
      setMeta('meta[property="og:url"]',         'content', url);
      setMeta('meta[name="twitter:title"]',      'content', title);
      setMeta('meta[name="twitter:image"]',      'content', img);
      setMeta('meta[name="description"]',        'content', desc);
    } else {
      document.title = "Storefront | ShopLink.vi";
    }

    return () => { document.title = "ShopLink.vi"; };
  }, [vendor]);

  // Cart persistence
  const cartKey = vendor?.slug || 'storefront';
  useEffect(() => {
    const saved = localStorage.getItem(`shoplink_cart_${cartKey}`);
    if (saved) setCart(JSON.parse(saved));
  }, [cartKey]);

  useEffect(() => {
    if (Object.keys(cart).length > 0) localStorage.setItem(`shoplink_cart_${cartKey}`, JSON.stringify(cart));
    else localStorage.removeItem(`shoplink_cart_${cartKey}`);
  }, [cart, cartKey]);

  useEffect(() => {
    const onScroll = () => {
      if (headerRef.current) setShowStickyNav(headerRef.current.getBoundingClientRect().bottom < 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = () => setOpenVariantDropdown(null);
    document.addEventListener('click', onClick, { passive: true });
    return () => document.removeEventListener('click', onClick);
  }, []);

  // Reset image index when product modal opens
  useEffect(() => { setActiveImageIndex(0); }, [selectedProduct]);

  const getProductImages = (p) =>
    p?.image_urls?.length ? p.image_urls : p?.image_url ? [p.image_url] : [];

  const updateCart = (id, delta) => {
    setCart(prev => {
      const qty = (prev[id] || 0) + delta;
      if (qty <= 0) { const n = { ...prev }; delete n[id]; return n; }
      return { ...prev, [id]: qty };
    });
  };

  // ── HANDLE PRODUCT CLICKS (Tracks Data to DB) ──
  const handleProductClick = async (product) => {
    setSelectedProduct(product); // Open Modal immediately

    // 1 Hour cooldown so one person doesn't generate 100 fake clicks
    const viewKey = `prod_view_${product.id}`;
    const lastView = localStorage.getItem(viewKey);
    const now = Date.now();

    if (!lastView || now - parseInt(lastView) > 3600000) {
      localStorage.setItem(viewKey, now.toString());
      try {
        await supabase.rpc('increment_product_views', { product_id: product.id });
      } catch (err) {
        console.error("Failed to track click", err);
      }
    }
  };

  // ── DATABASE-CONNECTED CHECKOUT LOGIC (Dynamic WhatsApp Receipt) ──
  const checkout = async () => {
    if (!vendor) return;

    // 1. Prepare Order Data
    const orderItems = [];
    let total = 0;

    products.forEach((p) => {
      if (cart[p.id]) {
        const qty = cart[p.id];
        const subtotal = p.price * qty;
        const variants = variantSelections[p.id] || {};
        const variantLabel = Object.keys(variants).length > 0
          ? ' (' + Object.values(variants).join(', ') + ')'
          : '';
        orderItems.push({
          id: p.id,
          name: p.name + variantLabel,
          price: p.price,
          qty: qty,
          subtotal: subtotal,
          variants: Object.keys(variants).length > 0 ? variants : null,
        });
        total += subtotal;
      }
    });

    if (orderItems.length === 0) return;

    // Show loading toast
    const toastId = toast.loading('Processing your order...');

    // 2. Generate a professional Order ID (e.g., ORD-73921)
    const orderNum = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

    try {
      // 3. Save order to Supabase — no .select() so anon users aren't blocked by SELECT RLS
      const orderPayload = {
        vendor_id:    vendor.id,
        order_number: orderNum,
        items:        orderItems,
        total:        total,
      };
      const { error } = await supabase.from('orders').insert(orderPayload);

      if (error) throw error;

      // 4a. Trigger WhatsApp automation for Pro/Premium vendors (fire and forget)
      supabase.functions.invoke('send-whatsapp-notification', {
        body: { order: orderPayload },
      }).catch(e => console.warn('WhatsApp notification skipped:', e.message));

      // 4b. Format Dynamic WhatsApp Message for customer to send
      const date = new Date().toLocaleDateString('en-GB');
      let message = `*NEW ORDER RECEIVED*\n\n`;
      message += `*Store:* ${vendor.shop_name.toUpperCase()}\n`;
      message += `*Order ID:* ${orderNum}\n`;
      message += `*Date:* ${date}\n\n`;
      message += `*ORDER ITEMS:*\n`;
      message += `━━━━━━━━━━━━━━━━━\n`;
      
      orderItems.forEach((item) => {
        message += `> *${item.qty}x ${item.name}*\n`;
        message += `> ${currencySymbol}${item.subtotal.toLocaleString()}\n\n`;
      });
      
      message += `━━━━━━━━━━━━━━━━━\n`;
      message += `*TOTAL DUE: ${currencySymbol}${total.toLocaleString()}*\n\n`;
      const closingMsg = isPremium && vendor.checkout_message?.trim()
        ? vendor.checkout_message.trim()
        : `Hello! I would like to place this order. Please let me know how to proceed with payment.`;
      message += `_${closingMsg}_`;

      let phone = vendor.phone.replace(/[^0-9]/g, '');
      if (phone.startsWith('0')) phone = phone.substring(1);

      toast.success('Order placed successfully!', { id: toastId });

      // 5. Clear cart and Redirect to WhatsApp
      setCart({});
      setTimeout(() => { 
        window.location.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`; 
      }, 1000);

    } catch (err) {
      console.error('Checkout error:', err);
      toast.error('Failed to process order. Please try again.', { id: toastId });
    }
  };

  if (loading) return <SkeletonLoader />;
  if (!vendor) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-400 p-6 text-center">
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
        <Store size={32} className="text-slate-300" />
      </div>
      <h2 className="text-xl font-black text-slate-800 mb-2">Store Not Found</h2>
      <Link to="/" className="bg-slate-900 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition mt-4">
        Create your own store
      </Link>
    </div>
  );

  // Treat the plan as free if the subscription has expired
  const subActive     = !vendor.plan_expires_at || new Date(vendor.plan_expires_at) > new Date();
  const effectivePlan = subActive ? (vendor.plan_type?.toLowerCase() || 'free') : 'free';
  const isPro         = effectivePlan === 'pro' || effectivePlan === 'premium';
  const isPremium     = effectivePlan === 'premium';

  // Theme and background only apply on paid plans — free plan always gets minimal
  const theme         = isPro ? (vendor.storefront_theme || 'minimal') : 'minimal';
  const bgUrl         = isPro ? (vendor.storefront_bg_url || null) : null;

  const vendorCountry = vendor?.country || 'NG';
  const vendorCurrency = getCurrency(vendorCountry);
  const currencySymbol = getCurrencySymbol(vendorCurrency);
  const styles   = getThemeStyles(theme);
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = products.reduce((sum, p) => sum + p.price * (cart[p.id] || 0), 0);

  return (
    <div className="min-h-screen font-sans pb-32 relative overflow-x-hidden">
      <Toaster position="top-center" />

      {/* Background */}
      <ThemeBackground theme={theme} bgUrl={bgUrl} />

      {/* Sticky nav */}
      {showStickyNav && <StickyNavbar vendor={vendor} totalItems={totalItems} styles={styles} effectivePlan={effectivePlan} />}

      {/* ── HEADER ── */}
      <div ref={headerRef} className="relative h-72 bg-slate-900 overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent z-10" />
        {vendor.logo_url ? (
          <img src={vendor.logo_url} className="w-full h-full object-cover opacity-70 blur-[2px] scale-105" />
        ) : (
          <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)' }}>
            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          </div>
        )}
        <button onClick={() => setShowInfo(true)}
          className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/20 transition border border-white/10">
          <Info size={20} />
        </button>
      </div>

      {/* ── SHOP INFO CARD ── */}
      <div className="relative z-20 -mt-24 px-4 max-w-3xl mx-auto">
        <div className={`${styles.infoBg} backdrop-blur-xl rounded-[2.5rem] shadow-2xl border ${styles.isDark ? 'border-white/10' : 'border-white'} p-1`}>
          <div className={`rounded-[2.2rem] pt-20 pb-8 px-6 relative ${styles.isDark ? 'bg-transparent' : 'bg-white'}`}>
            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-t-[2.2rem]" />
            {/* Avatar */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-30">
              <div className="w-32 h-32 bg-white rounded-full p-1.5 shadow-2xl cursor-pointer active:scale-95 transition-transform"
                onClick={() => vendor.logo_url && setShowLogoModal(true)}>
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-slate-50 bg-slate-50">
                  {vendor.logo_url
                    ? <img src={vendor.logo_url} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-slate-400 font-black text-5xl">{vendor.shop_name[0].toUpperCase()}</div>
                  }
                </div>
              </div>
            </div>
            <div className={`flex items-center justify-center gap-2 flex-wrap mb-1`}>
              <h1 className={`text-3xl font-black tracking-tight leading-tight text-center ${styles.cardText}`}>
                {vendor.shop_name}
              </h1>
              <span className="inline-flex translate-y-[1px]">
                <VerifiedBadge plan={effectivePlan} size={27} />
              </span>
            </div>
            {vendor.bio && (
              <p className={`text-sm font-medium text-center mb-4 max-w-xs mx-auto ${styles.cardSubtext}`}>{vendor.bio}</p>
            )}
            {/* Search */}
            <div className="relative max-w-md mx-auto mt-4">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text" placeholder="Search products..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className={`w-full border rounded-2xl py-3.5 pl-12 pr-10 text-sm font-bold outline-none transition-all ${styles.searchBg}`}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── PRODUCTS ── */}
      <main className="px-4 mt-10 max-w-4xl mx-auto relative z-10 flex flex-col min-h-[50vh]">
        {products.length === 0 ? (
          <div className={`text-center py-24 ${styles.isDark ? 'bg-white/5 border-white/10' : 'bg-white/50 border-slate-100'} backdrop-blur-sm rounded-[2.5rem] border border-dashed mx-2`}>
            <Store size={32} className={`mx-auto mb-4 ${styles.isDark ? 'text-white/20' : 'text-slate-300'}`} />
            <h2 className={`text-xl font-black mb-2 ${styles.cardText}`}>Store is empty</h2>
            <p className={`text-sm font-medium ${styles.cardSubtext}`}>No products yet. Check back soon!</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6 px-2">
              <h2 className={`text-xl font-black tracking-tight flex items-center gap-2 ${styles.cardText}`}>
                Latest Arrivals
                <span className={`text-[10px] px-2 py-1 rounded-full shadow-sm border ${styles.isDark ? 'bg-white/10 border-white/10 text-white/60' : 'bg-white text-slate-500 border-slate-100'}`}>
                  {filtered.length}
                </span>
              </h2>
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5 flex-grow">
                {filtered.map(product => {
                  const qty = cart[product.id] || 0;
                  return (
                    <div key={product.id}
                      className={`rounded-[2rem] p-3 sm:p-4 flex flex-col h-full hover:-translate-y-1 transition-all duration-300 group border backdrop-blur-sm ${
                        styles.isDark
                          ? 'bg-slate-900/70 border-white/10 hover:bg-slate-900/90'
                          : 'bg-white border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-100/40'
                      }`}
                    >
                      <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden mb-4 relative cursor-pointer"
                        onClick={() => handleProductClick(product)}>
                        {product.image_url ? (
                          <>
                            <img src={product.image_url} alt={product.name} loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                              <span className="bg-white/90 text-slate-900 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-1">
                                <Maximize2 size={11} /> View
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag size={32} className="text-slate-300" />
                          </div>
                        )}
                        {isPro && product.stock === 0 && (
                          <div className="absolute top-3 right-3 bg-red-500 text-white px-2.5 py-1 rounded-full text-[9px] font-black shadow-lg shadow-black/20 z-10 border-2 border-white/80 uppercase tracking-wider">
                            Out of stock
                          </div>
                        )}
                        {qty > 0 && (
                          <div className="absolute top-3 right-3 bg-emerald-500 text-white w-8 h-8 flex items-center justify-center rounded-full text-xs font-black shadow-lg shadow-black/20 z-10 border-2 border-white/80">
                            {qty}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col px-1">
                        {/* Updated to line-clamp-2 for better handling of long names on mobile */}
                        <h3 className={`font-bold text-sm leading-snug line-clamp-2 mb-1 ${styles.cardText}`}>{product.name}</h3>
                        {product.description && (
                          <p className={`text-[11px] font-medium line-clamp-2 mb-3 leading-relaxed ${styles.cardSubtext}`}>{product.description}</p>
                        )}
                        {Array.isArray(product.variants) && product.variants.length > 0 && (
                          <div className="space-y-1.5 mb-2">
                            {product.variants.map((group, gi) => {
                              const ddKey = `${product.id}-${gi}`;
                              const isOpen = openVariantDropdown === ddKey;
                              const selected = variantSelections[product.id]?.[group.name] || '';
                              return (
                                <div key={gi} className="relative">
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setOpenVariantDropdown(isOpen ? null : ddKey); }}
                                    className={`w-full text-[11px] font-bold px-3 py-2.5 rounded-xl border outline-none cursor-pointer transition-all flex items-center justify-between ${styles.isDark ? 'bg-white/[0.07] border-white/[0.12] text-white hover:bg-white/[0.12]' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'}`}
                                  >
                                    <span className={`flex items-center gap-1.5 ${selected ? '' : 'opacity-50'}`}>
                                      {selected && resolveColor(selected) && <span className="w-3 h-3 rounded-full border border-black/10 flex-shrink-0" style={{ backgroundColor: resolveColor(selected) }} />}
                                      {selected || `Select ${group.name}`}
                                    </span>
                                    <svg className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="m6 9 6 6 6-6" />
                                    </svg>
                                  </button>
                                  {isOpen && (
                                    <div className={`absolute left-0 right-0 top-full mt-1 z-20 rounded-xl border overflow-hidden shadow-xl ${styles.isDark ? 'bg-slate-800 border-white/[0.12]' : 'bg-white border-slate-200'}`}>
                                      {group.options.filter(o => o.trim()).map((opt, oi) => {
                                        const isSelected = selected === opt;
                                        const c = resolveColor(opt);
                                        return (
                                          <button
                                            key={oi}
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setVariantSelections(prev => ({
                                                ...prev,
                                                [product.id]: { ...prev[product.id], [group.name]: opt }
                                              }));
                                              setOpenVariantDropdown(null);
                                            }}
                                            className={`w-full text-left text-[11px] font-bold px-3 py-2.5 transition-all flex items-center gap-1.5 ${isSelected ? (styles.isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600') : (styles.isDark ? 'text-white/70 hover:bg-white/[0.07]' : 'text-slate-600 hover:bg-slate-50')}`}
                                          >
                                            {c && <span className="w-3 h-3 rounded-full border border-black/10 flex-shrink-0" style={{ backgroundColor: c }} />}
                                            {opt}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                        <div className="mt-auto pt-2 flex flex-col gap-2.5">
                          <div className="flex items-center justify-between">
                            <p className={`font-black text-lg ${styles.cardText}`}>{currencySymbol}{Number(product.price).toLocaleString()}</p>
                            {isPro && product.stock > 0 && (
                              <span className="text-[9px] font-bold text-slate-400">{product.stock} left</span>
                            )}
                          </div>
                          {isPro && product.stock === 0 ? (
                            <div className="w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider bg-red-50 text-red-400 text-center border border-red-200">
                              Out of stock
                            </div>
                          ) : qty === 0 ? (
                            <button onClick={e => { e.stopPropagation(); updateCart(product.id, 1); }}
                              className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2 ${styles.addBtnBg}`}>
                              <Plus size={13} strokeWidth={3} /> Add
                            </button>
                          ) : (
                            <div className="flex items-center justify-between bg-emerald-500 text-white rounded-xl p-1 shadow-lg">
                              <button onClick={e => { e.stopPropagation(); updateCart(product.id, -1); }}
                                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/20 transition active:scale-90">
                                <Minus size={14} strokeWidth={3} />
                              </button>
                              <span className="text-sm font-black">{qty}</span>
                              {isPro && product.stock > 0 && qty >= product.stock ? (
                                <div className="w-9 h-9 flex items-center justify-center rounded-lg opacity-40">
                                  <Plus size={14} strokeWidth={3} />
                                </div>
                              ) : (
                                <button onClick={e => { e.stopPropagation(); updateCart(product.id, 1); }}
                                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/20 transition active:scale-90">
                                  <Plus size={14} strokeWidth={3} />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={`text-center py-20 flex-grow ${styles.isDark ? 'bg-white/5 border-white/10' : 'bg-white/50 border-slate-100'} backdrop-blur-sm rounded-[2.5rem] border border-dashed`}>
                <Search size={28} className={`mx-auto mb-3 ${styles.isDark ? 'text-white/20' : 'text-slate-300'}`} />
                <p className={`font-bold text-sm ${styles.cardSubtext}`}>No results for "{searchQuery}"</p>
                <button onClick={() => setSearchQuery('')} className="mt-3 text-emerald-500 text-xs font-black uppercase tracking-widest hover:underline">View All</button>
              </div>
            )}
          </>
        )}

      </main>

      {/* ── POWERED BY BAR — full-width bottom strip, hidden when checkout bar is open ── */}
      {!(isPro || isPremium) && totalItems === 0 && (
        <div className="fixed left-0 right-0 z-30 bottom-0">
          <Link to="/"
            className={`flex items-center justify-center gap-2 w-full py-3 text-[10px] font-black uppercase tracking-widest border-t backdrop-blur-md transition-colors
              ${styles.isDark ? 'bg-slate-900/90 border-white/10 text-white/50 hover:text-white/70' : 'bg-white/95 border-slate-200/80 text-slate-400 hover:text-slate-600'}`}>
            <Zap size={11} className="text-emerald-500 flex-shrink-0" />
            Powered by ShopLink.vi
          </Link>
        </div>
      )}

      {/* ── CHECKOUT BAR ── */}
      {totalItems > 0 && (
        <div className="fixed bottom-6 left-4 right-4 z-40 max-w-md mx-auto animate-in slide-in-from-bottom-6 duration-500">
          <button onClick={checkout}
            className="w-full bg-[#25D366] text-white p-2.5 pr-3 rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(37,211,102,0.5)] flex items-center justify-between hover:brightness-105 active:scale-[0.98] transition-all border-4 border-white">
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg">
                <span className="font-black text-sm">{totalItems}</span>
              </div>
              <div className="text-left flex flex-col leading-none">
                <span className="text-[9px] font-bold uppercase tracking-wider text-green-100 opacity-80 mb-0.5">Total</span>
                <span className="font-black text-lg">{currencySymbol}{totalPrice.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/20 pl-4 pr-2 py-2 rounded-full backdrop-blur-sm">
              <span className="font-bold text-xs uppercase tracking-wide">Order</span>
              <div className="bg-white w-7 h-7 rounded-full flex items-center justify-center text-[#25D366]">
                <WhatsAppIcon size={16} />
              </div>
            </div>
          </button>
        </div>
      )}

      {/* ── INFO MODAL ── */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-md"
          onClick={() => setShowInfo(false)}>
          <div className={`relative ${styles.isDark ? 'bg-slate-900 border border-white/10' : 'bg-white'} rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300`}
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowInfo(false)}
              className={`absolute top-5 right-5 p-2 rounded-full transition active:scale-95 ${styles.isDark ? 'bg-white/10 text-white/60 hover:text-white hover:bg-white/20' : 'bg-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50'}`}>
              <X size={18} />
            </button>
            <div className="text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto mb-5 border-4 border-white shadow-xl overflow-hidden">
                {vendor.logo_url
                  ? <img src={vendor.logo_url} className="w-full h-full object-cover" />
                  : <div className={`w-full h-full flex items-center justify-center font-bold text-3xl ${styles.cardText}`}>{vendor.shop_name[0]}</div>
                }
              </div>
              <div className="flex items-center justify-center gap-2 flex-wrap mb-1">
                <h2 className={`text-2xl font-black ${styles.cardText}`}>{vendor.shop_name}</h2>
                <span className="inline-flex translate-y-[1px]">
                  <VerifiedBadge plan={effectivePlan} size={22} />
                </span>
              </div>
              {vendor.bio && <p className={`text-sm font-medium mb-5 leading-relaxed ${styles.cardSubtext}`}>{vendor.bio}</p>}

              {/* Verification status section */}
              {(isPro || isPremium) && (
                <div className={`mt-4 mb-1 px-4 py-3.5 rounded-2xl border text-left ${
                  isPremium
                    ? styles.isDark ? 'bg-yellow-900/10 border-yellow-700/20' : 'bg-yellow-50/60 border-yellow-200/80'
                    : styles.isDark ? 'bg-blue-900/10 border-blue-700/20'   : 'bg-blue-50/60 border-blue-200/80'
                }`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <VerifiedBadge plan={effectivePlan} size={15} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isPremium ? 'text-yellow-700' : 'text-blue-600'}`}>
                      {isPremium ? 'Verified Premium Store' : 'Verified Pro Store'}
                    </span>
                  </div>
                  <p className={`text-xs font-medium leading-relaxed ${styles.cardSubtext}`}>
                    {isPremium
                      ? 'This store is a Premium verified business with advanced branding and verification status.'
                      : 'This store has completed additional verification and is recognised as a trusted seller.'}
                  </p>
                </div>
              )}

              <div className="space-y-3 text-left mt-4">
                <div className={`flex items-center gap-4 p-4 ${styles.isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'} rounded-2xl border`}>
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 text-[#25D366]">
                    <WhatsAppIcon size={20} />
                  </div>
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${styles.cardSubtext}`}>Orders via</p>
                    <p className={`font-bold text-sm ${styles.cardText}`}>WhatsApp Checkout</p>
                  </div>
                </div>
                <button
                  onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); setShowInfo(false); }}
                  className={`flex items-center gap-4 p-4 ${styles.isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'} rounded-2xl border w-full text-left transition group`}>
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors flex-shrink-0">
                    <Copy size={18} />
                  </div>
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${styles.cardSubtext}`}>Share</p>
                    <p className={`font-bold text-sm ${styles.cardText}`}>Copy Store Link</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PRODUCT DETAIL MODAL (near-fullscreen split) ── */}
      {selectedProduct && (() => {
        const images = getProductImages(selectedProduct);
        const hasMultiple = images.length > 1;
        const currentImg = images[activeImageIndex] ?? null;
        return (
          <div className="fixed inset-0 z-[60] flex items-end lg:items-center justify-center lg:p-4 bg-slate-900/80 backdrop-blur-md"
            onClick={() => setSelectedProduct(null)}>
            <div
              className={`${styles.isDark ? 'bg-slate-900 border border-white/10' : 'bg-white'} relative w-full lg:w-[95vw] lg:max-w-6xl rounded-t-[2.5rem] lg:rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 lg:zoom-in-95 duration-300 flex flex-col lg:flex-row h-[93vh] lg:h-[88vh]`}
              onClick={e => e.stopPropagation()}>

              {/* Close button — top of whole modal */}
              <button onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 z-20 p-2 bg-black/40 text-white backdrop-blur-md rounded-full hover:bg-black/60 transition active:scale-95">
                <X size={18} />
              </button>

              {/* ── LEFT: IMAGE PANEL ── */}
              <div className="relative flex-shrink-0 lg:flex-shrink lg:w-[55%] h-[44vh] lg:h-auto bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                {currentImg ? (
                  <img
                    key={currentImg}
                    src={currentImg}
                    className="w-full h-full object-contain"
                    alt={selectedProduct.name}
                  />
                ) : (
                  <div className="text-slate-300"><ShoppingBag size={48} /></div>
                )}

                {/* Counter */}
                {hasMultiple && (
                  <div className="absolute top-3 left-3 px-2 py-1 bg-black/40 backdrop-blur-md rounded-full text-white text-[10px] font-black">
                    {activeImageIndex + 1} / {images.length}
                  </div>
                )}

                {/* Arrows */}
                {hasMultiple && (
                  <>
                    <button
                      onClick={e => { e.stopPropagation(); setActiveImageIndex(i => (i - 1 + images.length) % images.length); }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-white backdrop-blur-md rounded-full hover:bg-black/60 transition active:scale-90">
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); setActiveImageIndex(i => (i + 1) % images.length); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-white backdrop-blur-md rounded-full hover:bg-black/60 transition active:scale-90">
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Thumbnail rail */}
                {hasMultiple && (
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto no-scrollbar">
                    {images.map((img, i) => (
                      <button key={i}
                        onClick={e => { e.stopPropagation(); setActiveImageIndex(i); }}
                        className={`w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${i === activeImageIndex ? 'border-emerald-500 ring-2 ring-white/60' : 'border-white/40 opacity-70 hover:opacity-100'}`}>
                        <img src={img} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ── RIGHT: DETAILS PANEL ── */}
              <div className="flex-1 lg:w-[45%] flex flex-col overflow-y-auto p-6 sm:p-8">
                  <div className="flex justify-between items-start mb-4 gap-3">
                    <h2 className={`text-2xl lg:text-3xl font-black leading-tight ${styles.cardText}`}>{selectedProduct.name}</h2>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-xl font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-lg">
                        {currencySymbol}{Number(selectedProduct.price).toLocaleString()}
                      </span>
                      {isPro && selectedProduct.stock > 0 && (
                        <span className="text-[10px] font-bold text-slate-400">{selectedProduct.stock} in stock</span>
                      )}
                      {isPro && selectedProduct.stock === 0 && (
                        <span className="text-[10px] font-bold text-red-500">Out of stock</span>
                      )}
                    </div>
                  </div>

                  {selectedProduct.description && (
                    <div className="mb-6 pr-1">
                      <h4 className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-2 ${styles.cardSubtext}`}>
                        <AlignLeft size={11} /> Description
                      </h4>
                      <p className={`text-sm font-medium leading-relaxed ${styles.cardSubtext}`}>{selectedProduct.description}</p>
                    </div>
                  )}

                  {/* Variant selector (with colour swatches) */}
                  {isPro && Array.isArray(selectedProduct.variants) && selectedProduct.variants.length > 0 && (
                    <div className="mb-6 space-y-3">
                      {selectedProduct.variants.map((group, gi) => {
                        const selected = variantSelections[selectedProduct.id]?.[group.name] || '';
                        return (
                          <div key={gi}>
                            <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${styles.cardSubtext}`}>{group.name}</p>
                            <div className="flex flex-wrap gap-2">
                              {group.options.filter(o => o.trim()).map((opt, oi) => {
                                const c = resolveColor(opt);
                                return (
                                  <button key={oi}
                                    onClick={() => setVariantSelections(prev => ({
                                      ...prev,
                                      [selectedProduct.id]: { ...(prev[selectedProduct.id] || {}), [group.name]: opt }
                                    }))}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all ${selected === opt ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : `border-slate-200 dark:border-slate-700 ${styles.cardSubtext}`}`}>
                                    {c && <span className="w-3.5 h-3.5 rounded-full border border-black/10 flex-shrink-0" style={{ backgroundColor: c }} />}
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Add to order controls */}
                  <div className="mt-auto pt-2">
                  {isPro && selectedProduct.stock === 0 ? (
                    <div className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-center bg-red-50 dark:bg-red-500/10 text-red-400 border-2 border-red-200 dark:border-red-500/20">
                      Out of stock
                    </div>
                  ) : cart[selectedProduct.id] ? (
                    <div className="flex items-center justify-between bg-emerald-500 text-white rounded-2xl p-2 shadow-lg">
                      <button onClick={() => updateCart(selectedProduct.id, -1)}
                        className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/20 transition active:scale-90">
                        <Minus size={18} strokeWidth={3} />
                      </button>
                      <span className="text-lg font-black">{cart[selectedProduct.id]} in cart</span>
                      {isPro && selectedProduct.stock > 0 && cart[selectedProduct.id] >= selectedProduct.stock ? (
                        <div className="w-12 h-12 flex items-center justify-center rounded-xl opacity-40">
                          <Plus size={18} strokeWidth={3} />
                        </div>
                      ) : (
                        <button onClick={() => updateCart(selectedProduct.id, 1)}
                          className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/20 transition active:scale-90">
                          <Plus size={18} strokeWidth={3} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <button onClick={() => updateCart(selectedProduct.id, 1)}
                      className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-emerald-500 dark:hover:bg-emerald-500 dark:hover:text-white transition-colors flex items-center justify-center gap-2 active:scale-95">
                      <Plus size={16} strokeWidth={3} /> Add to Order
                    </button>
                  )}
                  </div>
                </div>
            </div>
          </div>
        );
      })()}

      {/* ── LOGO LIGHTBOX — simple centered profile picture view ── */}
      {showLogoModal && vendor.logo_url && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowLogoModal(false)}>
          <button onClick={() => setShowLogoModal(false)}
            className="absolute top-4 right-4 p-2.5 bg-white/10 text-white backdrop-blur-md rounded-full hover:bg-white/20 transition active:scale-95">
            <X size={20} />
          </button>
          <img
            src={vendor.logo_url}
            alt={vendor.shop_name}
            className="max-w-[72vw] max-h-[72vh] w-auto h-auto object-contain rounded-full shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        /* ── Verified badge animations ── */
        .badge-gold {
          animation: badge-gold-pulse 3.5s ease-in-out infinite;
        }
        @keyframes badge-gold-pulse {
          0%,100% { filter: drop-shadow(0 0 3px rgba(201,162,39,0.40)); }
          50%     { filter: drop-shadow(0 0 9px rgba(201,162,39,0.80)); }
        }
      `}</style>
    </div>
  );
}