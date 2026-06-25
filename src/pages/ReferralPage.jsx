import { useState, useEffect, useCallback } from 'react';
import {
  Gift, Copy, Check, Users, CreditCard, Trophy,
  Zap, Crown, Share2, Info, ChevronRight,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../supabaseClient';

const TIERS = [
  {
    id: 1,
    label: 'Tier 1 — Kickoff',
    signupGoal: 50,
    payingGoal: 3,
    reward: '1 Month Pro Free',
    rewardPlan: 'pro',
    rewardMonths: 1,
    bgClass: 'bg-amber-50 dark:bg-amber-500/10',
    borderClass: 'border-amber-200 dark:border-amber-500/30',
    textClass: 'text-amber-600 dark:text-amber-400',
    barSignup: 'bg-amber-400',
    barPaying: 'bg-amber-500',
    Icon: Zap,
  },
  {
    id: 2,
    label: 'Tier 2 — Growth',
    signupGoal: 200,
    payingGoal: 10,
    reward: '2 Months Premium',
    rewardPlan: 'premium',
    rewardMonths: 2,
    bgClass: 'bg-purple-50 dark:bg-purple-500/10',
    borderClass: 'border-purple-200 dark:border-purple-500/30',
    textClass: 'text-purple-600 dark:text-purple-400',
    barSignup: 'bg-purple-400',
    barPaying: 'bg-purple-500',
    Icon: Crown,
  },
  {
    id: 3,
    label: 'Tier 3 — Champion',
    signupGoal: 500,
    payingGoal: 25,
    reward: '6 Months Premium',
    rewardPlan: 'premium',
    rewardMonths: 6,
    bgClass: 'bg-emerald-50 dark:bg-emerald-500/10',
    borderClass: 'border-emerald-200 dark:border-emerald-500/30',
    textClass: 'text-emerald-600 dark:text-emerald-400',
    barSignup: 'bg-emerald-400',
    barPaying: 'bg-emerald-500',
    Icon: Trophy,
  },
];

export default function ReferralPage({ user, setUser }) {
  const vendor = user?.vendor;
  const [loading, setLoading] = useState(true);
  const [stats, setStats]     = useState({ total: 0, paying: 0 });
  const [copied, setCopied]       = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const claimedTier  = vendor?.referral_claimed_tier ?? 0;
  const referralUrl  = `https://shoplinkvi.com/register?ref=${vendor?.slug || ''}`;

  // ── Apply any newly-earned tier rewards ──
  const applyRewards = useCallback(async (total, paying, currentClaimed, currentVendor) => {
    if (!currentVendor) return;
    let newClaimed        = currentClaimed;
    let planType          = currentVendor.plan_type || 'free';
    const originalPlan    = planType;
    let planExpiresAt     = currentVendor.plan_expires_at;
    let didClaim          = false;
    let lastTier          = null;

    for (const tier of TIERS) {
      if (newClaimed >= tier.id) continue;
      if (!(total >= tier.signupGoal || paying >= tier.payingGoal)) break;

      const now  = new Date();
      const base = planExpiresAt && new Date(planExpiresAt) > now
        ? new Date(planExpiresAt) : now;
      const newExpiry = new Date(base);
      newExpiry.setMonth(newExpiry.getMonth() + tier.rewardMonths);

      planType      = tier.rewardPlan === 'premium' ? 'premium'
        : (planType === 'premium' ? 'premium' : tier.rewardPlan);
      planExpiresAt = newExpiry.toISOString();
      newClaimed    = tier.id;
      lastTier      = tier;
      didClaim      = true;
    }

    if (!didClaim) return;

    const { error } = await supabase.from('vendors').update({
      plan_type:             planType,
      plan_expires_at:       planExpiresAt,
      plan_status:           'active',
      referral_claimed_tier: newClaimed,
    }).eq('id', currentVendor.id);

    if (!error) {
      setUser(prev => ({
        ...prev,
        vendor: { ...prev.vendor, plan_type: planType, plan_expires_at: planExpiresAt, referral_claimed_tier: newClaimed },
      }));
      const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
      const m   = lastTier.rewardMonths;
      const mo  = `${m} month${m > 1 ? 's' : ''}`;
      let msg;
      if (originalPlan === 'premium' && lastTier.rewardPlan === 'pro') {
        msg = `🎉 Tier ${newClaimed} unlocked! You're on Premium — the Pro reward was upgraded to ${mo} Premium and added to your expiry date.`;
      } else if (originalPlan === planType && originalPlan !== 'free') {
        msg = `🎉 Tier ${newClaimed} unlocked! ${mo} added to your ${cap(planType)} plan — your expiry date was extended.`;
      } else if (originalPlan === 'free') {
        msg = `🎉 Tier ${newClaimed} unlocked! You're now on ${cap(planType)} — ${mo} free added to your account!`;
      } else {
        msg = `🎉 Tier ${newClaimed} unlocked! Upgraded to ${cap(planType)} — ${mo} free added to your account!`;
      }
      toast.success(msg, { duration: 8000 });
    }
  }, [setUser]);

  useEffect(() => {
    const load = async () => {
      if (!vendor?.slug) { setLoading(false); return; }
      setLoading(true);
      try {
        const { data } = await supabase
          .from('vendors').select('id, plan_type')
          .eq('referred_by', vendor.slug);
        const total  = data?.length || 0;
        const paying = data?.filter(v => v.plan_type === 'pro' || v.plan_type === 'premium').length || 0;
        setStats({ total, paying });
        await applyRewards(total, paying, vendor?.referral_claimed_tier ?? 0, vendor);
      } finally {
        setLoading(false);
      }
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendor?.slug]);

  const handleCopy = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyCode = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(vendor?.slug || '');
    setCopiedCode(true);
    toast.success('Referral code copied!');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Shop at ${vendor?.shop_name}`,
        text: `Set up your free WhatsApp store using my link!`,
        url: referralUrl,
      }).catch(() => handleCopy());
    } else {
      handleCopy();
    }
  };

  if (!vendor) return null;

  const planType = vendor.plan_type?.toLowerCase() || 'free';
  const isPaid   = planType === 'pro' || planType === 'premium';

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-5">

      {/* ── Header ── */}
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 shadow-sm">
          <Gift size={26} className="text-emerald-500" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Referral Program</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1 leading-relaxed">
            Invite other vendors. Hit a milestone. Earn free months — automatically.
          </p>
        </div>
      </div>

      {/* ── Referral Link Card ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Your Referral Link</p>
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-2xl px-4 py-3 border border-slate-200 dark:border-slate-700 mb-4 overflow-hidden">
          <p className="flex-1 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 truncate font-mono">{referralUrl}</p>
          <button onClick={handleCopy} className="flex-shrink-0 p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition">
            {copied ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} className="text-slate-400" />}
          </button>
        </div>
        <div className="flex gap-3">
          <button onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-slate-600 transition active:scale-[0.98]">
            {copied ? <Check size={14} /> : <Copy size={14} />} Copy
          </button>
          <button onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition active:scale-[0.98] shadow-lg shadow-emerald-500/20">
            <Share2 size={14} /> Share
          </button>
        </div>
      </div>

      {/* ── Referral Code Card ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Your Referral Code</p>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
          On mobile, share this short code instead of the full link. Anyone who enters it during signup is counted as your referral — no link needed.
        </p>
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-2xl px-4 py-3 border border-slate-200 dark:border-slate-700 mb-4">
          <p className="flex-1 text-sm font-black text-slate-800 dark:text-white tracking-wide font-mono">{vendor?.slug || '—'}</p>
          <button onClick={handleCopyCode} className="flex-shrink-0 p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition">
            {copiedCode ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} className="text-slate-400" />}
          </button>
        </div>
        <button onClick={handleCopyCode}
          className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-slate-600 transition active:scale-[0.98]">
          {copiedCode ? <Check size={14} /> : <Copy size={14} />}
          {copiedCode ? 'Copied!' : 'Copy Code'}
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[
          { label: 'Total Referrals', value: loading ? '—' : stats.total,    Icon: Users,      color: 'text-blue-500',    bg: 'bg-blue-500/10' },
          { label: 'Paying Referrals', value: loading ? '—' : stats.paying,  Icon: CreditCard, color: 'text-purple-500',  bg: 'bg-purple-500/10' },
          { label: 'Tiers Claimed',    value: loading ? '—' : `${claimedTier}/3`, Icon: Trophy, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        ].map(({ label, value, Icon, color, bg }) => (
          <div key={label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 text-center shadow-sm">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 ${bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <Icon size={16} className={color} />
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-none mb-1">{value}</p>
            <p className="text-[8px] sm:text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-tight">{label}</p>
          </div>
        ))}
      </div>

      {/* ── How rewards work with your current plan ── */}
      {isPaid && (
        <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-2xl p-4 flex gap-3">
          <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-black text-blue-800 dark:text-blue-300 mb-1">You're on a paid plan — here's how rewards stack</p>
            <p className="text-xs font-medium text-blue-700 dark:text-blue-400 leading-relaxed">
              Referral rewards extend your plan <strong>from your current expiry date</strong>, never from today. So your paid months are fully protected — rewards just add extra free time on top. If you're on {planType === 'premium' ? 'Premium' : 'Pro'} and earn a lower-tier reward, it's applied at your current plan level (no downgrading ever).
            </p>
          </div>
        </div>
      )}

      {/* ── How It Works ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-5">How It Works</p>
        <div className="space-y-5">
          {[
            {
              step: '1',
              title: 'Share your referral link',
              text: 'Copy the link above and post it anywhere — WhatsApp status, Instagram bio, Facebook, TikTok. Anyone who clicks it and signs up is automatically linked to you.',
            },
            {
              step: '2',
              title: 'They set up their store',
              text: 'A signup only counts once they fully complete onboarding: business name, shop link, and WhatsApp number. This filters out empty or abandoned accounts so your count is real.',
            },
            {
              step: '3',
              title: 'Hit a milestone, get rewarded',
              text: 'Each tier unlocks automatically when you hit either the signup count or the paying count — whichever comes first. You don\'t need to do anything; the reward is added to your plan the moment you qualify.',
            },
          ].map(({ step, title, text }) => (
            <div key={step} className="flex gap-4">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400">{step}</span>
              </div>
              <div>
                <p className="font-black text-slate-800 dark:text-white text-sm mb-1">{title}</p>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">{text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-2xl flex gap-3">
          <Info size={15} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs font-medium text-amber-800 dark:text-amber-300 leading-relaxed">
            <strong>Tiers are permanent and cumulative.</strong> Once you earn Tier 1, you keep it forever and keep working toward Tier 2. Rewards also stack — if you're on Premium and earn a Pro reward, you get +1 month Premium, not Pro.
          </p>
        </div>
      </div>

      {/* ── Tier Cards ── */}
      <div>
        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Your Tier Progress</p>
        <div className="space-y-4">
          {TIERS.map((tier) => {
            const isClaimed  = claimedTier >= tier.id;
            const signupPct  = Math.min(100, (stats.total  / tier.signupGoal) * 100);
            const payingPct  = Math.min(100, (stats.paying / tier.payingGoal) * 100);

            return (
              <div key={tier.id}
                className={`bg-white dark:bg-slate-900 border rounded-3xl p-5 sm:p-6 shadow-sm ${
                  isClaimed
                    ? 'border-emerald-200 dark:border-emerald-500/40'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Tier header — stacks on small screens */}
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 mb-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isClaimed ? 'bg-emerald-500/10' : tier.bgClass}`}>
                      <tier.Icon size={18} className={isClaimed ? 'text-emerald-500' : tier.textClass} fill={isClaimed ? 'currentColor' : 'none'} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-slate-900 dark:text-white text-sm truncate">{tier.label}</p>
                      <p className={`text-xs font-bold mt-0.5 ${isClaimed ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`}>
                        {isClaimed ? '✓ Reward Applied' : 'In Progress'}
                      </p>
                    </div>
                  </div>
                  {/* Badge — sits on its own line on small screens */}
                  <div className={`self-start flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-wide flex-shrink-0 ${
                    isClaimed
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                      : `${tier.bgClass} ${tier.borderClass} ${tier.textClass}`
                  }`}>
                    <Gift size={9} />
                    {tier.reward}
                  </div>
                </div>

                {/* Progress — only for unclaimed tiers */}
                {!isClaimed && (
                  <div className="space-y-4">

                    {/* ── Signup Path ── */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide">Signup Path</p>
                          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                            Get {tier.signupGoal} vendors to sign up using your link. They just need to complete onboarding — no subscription needed.
                          </p>
                        </div>
                        <span className="text-sm font-black text-slate-700 dark:text-slate-300 flex-shrink-0 ml-3">
                          {loading ? '…' : `${stats.total}/${tier.signupGoal}`}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-700 ${signupPct >= 100 ? 'bg-emerald-500' : tier.barSignup}`}
                          style={{ width: loading ? '0%' : `${signupPct}%` }} />
                      </div>
                      {signupPct >= 100 && (
                        <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 mt-1.5 uppercase tracking-wider">Goal reached ✓</p>
                      )}
                    </div>

                    {/* OR divider */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
                      <span className="text-[11px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-100 dark:border-slate-700">
                        OR
                      </span>
                      <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
                    </div>

                    {/* ── Paying Path ── */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide">Paying Path</p>
                          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                            Get {tier.payingGoal} of your referred vendors to subscribe to a paid plan (Pro or Premium). Fewer people needed, but they must pay.
                          </p>
                        </div>
                        <span className="text-sm font-black text-slate-700 dark:text-slate-300 flex-shrink-0 ml-3">
                          {loading ? '…' : `${stats.paying}/${tier.payingGoal}`}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-700 ${payingPct >= 100 ? 'bg-emerald-500' : tier.barPaying}`}
                          style={{ width: loading ? '0%' : `${payingPct}%` }} />
                      </div>
                      {payingPct >= 100 && (
                        <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 mt-1.5 uppercase tracking-wider">Goal reached ✓</p>
                      )}
                    </div>

                  </div>
                )}

                {/* Claimed confirmation */}
                {isClaimed && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl">
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 text-center">
                      {tier.reward} has been applied to your account.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Fine print */}
      <p className="text-xs font-medium text-center text-slate-400 dark:text-slate-500 leading-relaxed pb-6 px-4">
        Referrals count once a store is fully set up (name + WhatsApp number).
        Rewards extend your plan from its current expiry — they stack and never interfere with paid subscriptions.
        Tiers are permanent once earned.
      </p>
    </div>
  );
}
