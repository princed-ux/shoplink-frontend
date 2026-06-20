import { useRef } from 'react';
import { Star, Quote } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Amaka Osei',
    handle: '@amaka_styles',
    store: 'Fashion & Clothing',
    avatar: 'AO',
    color: '#ec4899', // Pink
    rating: 5,
    text: "Before ShopLink I was sending voice notes and 40 pictures to every customer. Now I just drop one link in my bio and orders come in while I sleep. Game changer for real.",
  },
  {
    name: 'Emeka Nwosu',
    handle: '@emeka_gadgets',
    store: 'Phones & Gadgets',
    avatar: 'EN',
    color: '#3b82f6', // Blue
    rating: 5,
    text: "My customers now send me perfectly formatted orders — name, item, quantity, address. No more back-and-forth. I've doubled my daily orders since I set this up.",
  },
  {
    name: 'Blessing Adeyemi',
    handle: '@blessingskitchen',
    store: 'Food & Catering',
    avatar: 'BA',
    color: '#f97316', // Orange
    rating: 5,
    text: "I run a food tray business. ShopLink lets my customers pick their meals and send me a clean receipt. My WhatsApp is now just orders, no stress.",
  },
  {
    name: 'Tunde Fashola',
    handle: '@tunde_sneakers',
    store: 'Footwear & Accessories',
    avatar: 'TF',
    color: '#10b981', // Emerald
    rating: 5,
    text: "Set up my store in like 10 minutes. Put the link in my TikTok bio and Instagram bio same night. Woke up to 3 orders. This thing actually works.",
  },
  {
    name: 'Chioma Eze',
    handle: '@chioma_beauty',
    store: 'Beauty & Skincare',
    avatar: 'CE',
    color: '#a855f7', // Purple
    rating: 5,
    text: "The store looks so professional. My customers always ask which website I'm using. I tell them ShopLink and they're always surprised it's free.",
  },
  {
    name: 'Adekunle Bello',
    handle: '@kunle_electronics',
    store: 'Electronics',
    avatar: 'AB',
    color: '#06b6d4', // Cyan
    rating: 5,
    text: "I was skeptical at first but after the first week I had 12 WhatsApp orders from people I've never met. All from my Instagram bio link. It's incredible.",
  },
  {
    name: 'Ngozi Okafor',
    handle: '@ngozi_fabrics',
    store: 'Fabrics & Textiles',
    avatar: 'NO',
    color: '#f59e0b', // Amber
    rating: 5,
    text: "Running a fabric store, people always want to see many options. Now I upload everything, they browse, pick what they like and the order comes straight to my WhatsApp.",
  },
  {
    name: 'Seun Akinwande',
    handle: '@seun_foodtray',
    store: 'Food Delivery',
    avatar: 'SA',
    color: '#ef4444', // Red
    rating: 5,
    text: "My daily orders have tripled. I share my ShopLink on my WhatsApp status every morning and the orders just flow in. Completely free and it works better than paid tools.",
  },
];

function ReviewCard({ review }) {
  return (
    <div className="flex-shrink-0 w-[320px] bg-white dark:bg-slate-800 rounded-[2rem] p-7 border border-slate-100 dark:border-slate-700/50 shadow-sm dark:shadow-none hover:shadow-xl dark:hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.1)] hover:border-emerald-100 dark:hover:border-emerald-500/30 transition-all duration-500 hover:-translate-y-1 group mx-3">
      {/* Quote icon */}
      <div className="mb-5">
        <Quote size={24} className="text-emerald-500 opacity-60 dark:opacity-40" fill="currentColor" />
      </div>

      {/* Review text */}
      <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium mb-6 transition-colors">
        "{review.text}"
      </p>

      {/* Stars */}
      <div className="flex gap-1 mb-5">
        {Array.from({ length: review.rating }).map((_, i) => (
          <Star key={i} size={14} className="text-amber-400" fill="currentColor" />
        ))}
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 pt-5 border-t border-slate-50 dark:border-slate-700/50 transition-colors">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-inner"
          style={{ background: `linear-gradient(135deg, ${review.color}cc, ${review.color})` }}
        >
          {review.avatar}
        </div>
        <div>
          <p className="font-black text-slate-900 dark:text-white text-sm leading-tight transition-colors">{review.name}</p>
          <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mt-0.5 transition-colors">{review.store}</p>
        </div>
        <div
          className="ml-auto px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest"
          style={{ background: `${review.color}15`, color: review.color }}
        >
          Verified
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const track1Ref = useRef(null);
  const track2Ref = useRef(null);

  // Pause on hover
  const pause = (ref) => { if (ref.current) ref.current.style.animationPlayState = 'paused'; };
  const resume = (ref) => { if (ref.current) ref.current.style.animationPlayState = 'running'; };

  const row1 = [...REVIEWS.slice(0, 4), ...REVIEWS.slice(0, 4)];
  const row2 = [...REVIEWS.slice(4, 8), ...REVIEWS.slice(4, 8)];

  return (
    // Added 'relative' here so the edge fades anchor properly to this section
    <section className="relative py-24 overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      
      <div className="max-w-7xl mx-auto px-6 mb-14 text-center relative z-20">
        <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 px-5 py-2 rounded-full mb-6 transition-colors">
          <Star size={14} fill="currentColor" className="text-amber-500" />
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">Real Vendors. Real Results.</span>
        </div>
        <h2 className="text-4xl lg:text-6xl font-black tracking-tighter text-slate-900 dark:text-white mb-4 leading-[1.0] transition-colors">
          Nigerian vendors<br />
          <span className="text-emerald-600 dark:text-emerald-500">love ShopLink.</span>
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-lg mx-auto transition-colors">
          From Lagos to Abuja to Port Harcourt — vendors everywhere are selling smarter.
        </p>
      </div>

      {/* Row 1 — scrolls left */}
      <div className="relative mb-6 z-10">
        <div
          ref={track1Ref}
          className="flex"
          style={{ animation: 'scroll-left 40s linear infinite', width: 'max-content' }}
          onMouseEnter={() => pause(track1Ref)}
          onMouseLeave={() => resume(track1Ref)}
        >
          {row1.map((r, i) => <ReviewCard key={i} review={r} />)}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className="relative z-10">
        <div
          ref={track2Ref}
          className="flex"
          style={{ animation: 'scroll-right 45s linear infinite', width: 'max-content' }}
          onMouseEnter={() => pause(track2Ref)}
          onMouseLeave={() => resume(track2Ref)}
        >
          {row2.map((r, i) => <ReviewCard key={i} review={r} />)}
        </div>
      </div>

      {/* Edge fades - Updated with dark mode gradients */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-40 bg-gradient-to-r from-slate-50 dark:from-slate-900 to-transparent z-20 transition-colors duration-300" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-40 bg-gradient-to-l from-slate-50 dark:from-slate-900 to-transparent z-20 transition-colors duration-300" />

      <style>{`
        @keyframes scroll-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}