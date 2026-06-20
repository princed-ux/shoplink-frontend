import { useState } from 'react';
import { Copy, Check, Share2, ExternalLink, Download, ChevronDown, QrCode } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { QRCode } from 'react-qrcode-logo';

// ── Social Icons ──────────────────────────────────────────────
const WhatsAppIcon = ({ size = 20, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

const InstagramIcon = ({ size = 20, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TikTokIcon = ({ size = 20, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.61-5.44-.22-2.9 1.61-5.63 4.39-6.38 1.34-.36 2.76-.23 4.02.26v4.18c-.7-.27-1.48-.3-2.19-.07-.94.3-1.65 1.14-1.74 2.13-.1 1.07.41 2.12 1.33 2.61 1.02.55 2.29.39 3.12-.46.73-.75.97-1.85.96-2.89.03-5.74.02-11.48.02-17.22z" />
  </svg>
);

const XIcon = ({ size = 20, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.95H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const CAPTION_TEMPLATES = [
  {
    id: 'fashion',
    label: 'Fashion & Clothing',
    text: `NEW ARRIVALS JUST DROPPED\n\nBrowse the full collection and order securely in seconds.\n\nLink: {URL}\n\n- Easy checkout\n- Direct WhatsApp delivery\n- Reliable & fast\n\n#Fashion #ShopOnline #Nigeria`,
  },
  {
    id: 'food',
    label: 'Food & Kitchen',
    text: `ORDER YOUR MEAL TODAY\n\nBrowse our menu and place your order with one click.\n\nLink: {URL}\n\n- Fresh daily\n- Order via WhatsApp\n- Fast delivery\n\n#FoodInLagos #HomeMade #NigerianFood`,
  },
  {
    id: 'gadgets',
    label: 'Phones & Gadgets',
    text: `BEST DEALS ON GADGETS\n\nCheck out the full store — phones, accessories, and electronics.\n\nLink: {URL}\n\n- Genuine products\n- Competitive prices\n- Secure WhatsApp checkout\n\n#Gadgets #Tech #Nigeria`,
  },
  {
    id: 'general',
    label: 'General Business',
    text: `Shop {NAME} today.\n\nBrowse all our products and place your order directly on WhatsApp.\n\nLink: {URL}\n\n#Business #ShopOnline #Nigeria`,
  },
];

export default function ShareStore({ user }) {
  const [copied, setCopied] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(null);

  const safeSlug = user?.vendor?.slug || 'store';
  const shopName = user?.vendor?.shop_name || 'My Store';

  const shopUrl = window.location.origin.includes('localhost')
    ? `http://localhost:5173/shop.vi/${safeSlug}`
    : `https://shoplinkvi.com/shop.vi/${safeSlug}`;

  const shortUrl = `shop.vi/${safeSlug}`;

  const SHOPLINK_LOGO_URL = 'https://xofnbiypfsjyfdwrkgam.supabase.co/storage/v1/object/public/product-images/logos/shoplink.png';

  const copyLink = async (silent = false) => {
    await navigator.clipboard.writeText(shopUrl);
    setCopied(true);
    if (!silent) toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: shopName, text: `Check out ${shopName}`, url: shopUrl });
      } catch { copyLink(); }
    } else {
      copyLink();
    }
  };

  const handleSocialShare = async (platform) => {
    const shareText = `Check out my store ${shopName}: ${shopUrl}`;
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out my store ${shopName} - ${shopUrl}`)}`, '_blank');
        break;
      case 'instagram':
        await navigator.clipboard.writeText(shopUrl);
        setCopied(true);
        toast('Link copied! Paste it in your IG Bio.');
        setTimeout(() => setCopied(false), 2000);
        break;
      case 'tiktok':
        await navigator.clipboard.writeText(shopUrl);
        setCopied(true);
        toast('Link copied! Paste it in your TikTok Bio.');
        setTimeout(() => setCopied(false), 2000);
        break;
    }
  };

  const downloadQRCode = () => {
    try {
      const canvas = document.getElementById('store-qr-code');
      if (!canvas) {
        toast.error("QR Code not fully loaded yet.");
        return;
      }
      const padded = document.createElement('canvas');
      const ctx    = padded.getContext('2d');
      padded.width  = canvas.width  + 48;
      padded.height = canvas.height + 48;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, padded.width, padded.height);
      ctx.drawImage(canvas, 24, 24);
      const link = document.createElement('a');
      link.download = `${safeSlug}-qrcode.png`;
      link.href = padded.toDataURL('image/png');
      link.click();
      toast.success('QR Code saved successfully!');
    } catch (error) {
      console.error("QR Download Error:", error);
      toast.error('Failed to download image. Please try again.');
    }
  };

  const copyTemplate = async (templateText) => {
    const final = templateText.replace(/{URL}/g, shopUrl).replace(/{NAME}/g, shopName);
    await navigator.clipboard.writeText(final);
    toast.success('Caption copied. Ready to paste.');
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 pt-6 transition-colors duration-300">

      <div className="mb-10">
        <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Share Your Store</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-base mt-2">Distribute your link and watch the orders flow in.</p>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative">

        {/* Left Column (Content) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Main link card */}
          <div className="bg-slate-900 dark:bg-slate-950 rounded-[2.5rem] p-8 lg:p-10 text-white relative overflow-hidden border border-transparent dark:border-slate-800 shadow-2xl transition-colors">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.15)_0%,transparent_70%)]" />
            <div className="absolute inset-0 opacity-[0.05]" 
              style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Your Public Link</span>
              </div>
              <p className="font-mono font-black text-white text-2xl lg:text-3xl mb-8 break-all tracking-tight">{shortUrl}</p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => copyLink(false)}
                  className="flex items-center justify-center gap-2.5 px-8 py-4 bg-white dark:bg-emerald-500 text-slate-900 dark:text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-emerald-400 transition-all active:scale-95 shadow-xl shadow-black/10 dark:shadow-emerald-500/20"
                >
                  {copied ? <Check size={16} className="text-emerald-500 dark:text-white" /> : <Copy size={16} />}
                  {copied ? 'Copied' : 'Copy Link'}
                </button>
                <button
                  onClick={handleNativeShare}
                  className="flex items-center justify-center gap-2.5 px-8 py-4 bg-white/10 dark:bg-white/5 text-white border border-white/20 dark:border-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 dark:hover:bg-white/10 transition-all active:scale-95"
                >
                  <Share2 size={16} /> Share
                </button>
                <a
                  href={shopUrl} target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2.5 px-8 py-4 bg-emerald-600 dark:bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 dark:hover:bg-slate-700 transition-all active:scale-95 border border-transparent dark:border-slate-700"
                >
                  <ExternalLink size={16} /> Preview Store
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8">
            <h3 className="font-black text-slate-900 dark:text-white text-lg mb-6">Quick Share</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'WhatsApp', Icon: WhatsAppIcon, color: 'bg-[#25D366]/10 dark:bg-[#25D366]/10 border-[#25D366]/20 hover:bg-[#25D366]/20', text: 'text-[#25D366]', action: () => handleSocialShare('whatsapp') },
                { label: 'Instagram', Icon: InstagramIcon, color: 'bg-pink-50 dark:bg-pink-500/10 border-pink-100 dark:border-pink-500/20 hover:bg-pink-100 dark:hover:bg-pink-500/20', text: 'text-pink-600 dark:text-pink-400', action: () => handleSocialShare('instagram') },
                { label: 'TikTok', Icon: TikTokIcon, color: 'bg-slate-100 dark:bg-white/10 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/15', text: 'text-slate-900 dark:text-white', action: () => handleSocialShare('tiktok') },
                { label: 'Post on X', Icon: XIcon, color: 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10', text: 'text-slate-900 dark:text-slate-200', action: () => handleSocialShare('twitter') },
              ].map((item, i) => (
                <button key={i} onClick={item.action}
                  className={`flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all active:scale-95 group ${item.color}`}>
                  <item.Icon size={22} className={`${item.text} group-hover:scale-110 transition-transform`} />
                  <span className={`text-[9px] font-black uppercase tracking-widest text-center ${item.text}`}>{item.label}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 font-medium mt-5 text-center">
              Instagram & TikTok automatically copy your link to paste into your bio.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8">
            <h3 className="font-black text-slate-900 dark:text-white text-lg mb-2">Ready-Made Captions</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-6">Copy and paste into your social media posts.</p>
            <div className="space-y-3">
              {CAPTION_TEMPLATES.map((t) => {
                const isActive = activeTemplate === t.id;
                const safeCaption = t.text.replace(/{URL}/g, shopUrl).replace(/{NAME}/g, shopName);
                return (
                  <div key={t.id}
                    className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${isActive ? 'border-emerald-500' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'}`}>
                    <button
                      onClick={() => setActiveTemplate(isActive ? null : t.id)}
                      className="w-full flex items-center justify-between p-5 text-left bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <span className={`font-black text-sm ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>
                        {t.label}
                      </span>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${isActive ? 'bg-emerald-50 dark:bg-emerald-500/20' : 'bg-slate-50 dark:bg-slate-800'}`}>
                        <ChevronDown size={14} className={`transition-transform duration-300 ${isActive ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                      </div>
                    </button>
                    {isActive && (
                      <div className="px-5 pb-5 bg-white dark:bg-slate-900 animate-in fade-in duration-200">
                        <div className="h-px bg-slate-100 dark:bg-slate-800 mb-4" />
                        <pre className="whitespace-pre-wrap font-sans text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mb-4 leading-relaxed border border-slate-100 dark:border-slate-700">
                          {safeCaption}
                        </pre>
                        {/* FIX: Removed bg-brand-500 so this button is perfectly visible again */}
                        <button onClick={() => copyTemplate(t.text)}
                          className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95">
                          <Copy size={14} /> Copy Caption
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (QR Code) - FIX: Added h-max so it never stretches, and sticky top-8 so it doesn't jump */}
        <div className="lg:col-span-1 h-max lg:sticky lg:top-8 order-first lg:order-last mb-4 lg:mb-0">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 text-center">

            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <QrCode size={22} className="text-slate-600 dark:text-slate-400" />
            </div>

            <h3 className="font-black text-slate-900 dark:text-white text-lg mb-2">Store QR Code</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-7 leading-relaxed">
              Customers scan this to open your store instantly. Print it on flyers, packaging or business cards.
            </p>

            <div className="bg-white rounded-2xl border-2 border-slate-100 dark:border-slate-700 p-4 mb-6 flex items-center justify-center">
              <QRCode
                id="store-qr-code"
                value={shopUrl}
                size={210}
                bgColor="#ffffff"
                fgColor="#0f172a"
                level="H"
                qrStyle="dots"
                eyeRadius={10} 
                logoImage={SHOPLINK_LOGO_URL}
                logoWidth={44}
                logoPadding={3}
                logoPaddingStyle="circle"
                removeQrCodeBehindLogo={true}
                enableCORS={true}
              />
            </div>

            <button onClick={downloadQRCode}
              className="w-full flex items-center justify-center gap-2.5 py-4 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg">
              <Download size={15} /> Download QR Code
            </button>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-3">High Quality PNG</p>
          </div>
        </div>

      </div>
    </div>
  );
}