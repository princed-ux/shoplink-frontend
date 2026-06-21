import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PaymentSuccess from '../components/PaymentSuccess';
import {
  Check, X, Star, ArrowRight, Zap, Sparkles, ShieldCheck, Lock
} from 'lucide-react';
import { SUBSCRIPTION_PLANS, formatPrice, getPricing, getChargeAmountNGN, PLAN_LEVELS } from '../data/plans';
import { Helmet } from 'react-helmet-async';
import shopLink_logo from '../assets/logo.png';
import { supabase } from '../supabaseClient';
import { toast } from 'react-hot-toast';
import { usePaystackPayment } from 'react-paystack';

const PLAN_CODES_INTL = {
  pro:     { monthly: 'PLN_w7vdg84sydhpgng', yearly: 'PLN_hl43el1s4z27ji1' },
  premium: { monthly: 'PLN_0kvnzsm4kt4ul3e', yearly: 'PLN_zb35zn0dhc3fo9q' },
};

export default function PricingPage() {
  const [yearly, setYearly]           = useState(false);
  const [user, setUser]               = useState(null);
  const [loading, setLoading]         = useState({});
  const [successPlan, setSuccessPlan] = useState(null);
  const [ipCountry, setIpCountry]     = useState(null);
  const navigate                      = useNavigate();

  const initializePayment = usePaystackPayment({
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
  });

  // Detect visitor's country via IP (used only when not logged in)
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(d => setIpCountry(d.country_code || null))
      .catch(() => {});
  }, []);

  useEffect(() => {
    // Always load from live session, not stale localStorage cache
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      const { data: vendor } = await supabase
        .from('vendors').select('*').eq('id', session.user.id).maybeSingle();
      setUser({ ...session.user, vendor: vendor || null });
    });
  }, []);

  // Priority: vendor.country (logged-in) > IP detection > default USD
  const effectiveCountry  = user?.vendor?.country || ipCountry || null;
  const currentPlan       = user?.vendor?.plan_type?.toLowerCase() || 'free';
  const { prices, currency, isNG } = getPricing({ country: effectiveCountry });

  const handleUpgrade = async (plan) => {
    if (plan.isFree) return;
    if (!user) { navigate('/register'); return; }

    const planPricing   = prices[plan.id] || {};
    // NGN users: recurring NGN plan codes; international: recurring INTL NGN plan codes
    const planCode      = isNG
      ? (yearly ? plan.paystackYearlyPlanCode : plan.paystackMonthlyPlanCode)
      : (yearly ? PLAN_CODES_INTL[plan.id]?.yearly : PLAN_CODES_INTL[plan.id]?.monthly);
    const displayAmount = yearly ? (planPricing.yearly || plan.yearlyPrice) : (planPricing.monthly || plan.monthlyPrice);
    const chargeAmount  = getChargeAmountNGN(displayAmount, isNG);

    if (!planCode) {
      toast.error('Payment setup in progress. Contact support to upgrade.');
      return;
    }

    setLoading(prev => ({ ...prev, [plan.id]: true }));

    const config = {
      email:    user.email,
      amount:   chargeAmount * 100,
      currency: 'NGN',
      reference: `shoplink_${plan.id}_${Date.now()}`,
      metadata: {
        vendor_id:    user.vendor.id,
        plan:         plan.id,
        billing_cycle: yearly ? 'yearly' : 'monthly',
      },
    };
    if (planCode) config.plan = planCode;

    initializePayment({
      onSuccess: async () => {
        setLoading({});
        try {
          const cycle   = yearly ? 'yearly' : 'monthly';
          const now     = new Date();
          const expires = new Date(now);
          if (cycle === 'yearly') expires.setFullYear(expires.getFullYear() + 1);
          else                    expires.setMonth(expires.getMonth() + 1);

          const updatePayload = {
            plan_type:       plan.id,
            plan_status:     'active',
            plan_started_at: now.toISOString(),
            plan_expires_at: expires.toISOString(),
            billing_cycle:   cycle,
          };
          await supabase.from('vendors').update(updatePayload).eq('id', user.vendor.id);
          const updated = { ...user, vendor: { ...user.vendor, ...updatePayload } };
          setUser(updated);
          setSuccessPlan(plan);
        } catch {
          toast.success('Payment received! Redirecting...');
          setTimeout(() => navigate('/dashboard/billing'), 1500);
        }
      },
      onClose: () => {
        setLoading(prev => ({ ...prev, [plan.id]: false }));
      },
      config,
    });
  };

  const getButtonLabel = (plan) => {
    if (plan.isFree) return user ? 'Your current plan' : 'Get started free';
    if (currentPlan === plan.id) return 'Current plan';
    if (PLAN_LEVELS[currentPlan] > (PLAN_LEVELS[plan.id] ?? 0)) return 'Already included ✓';
    if (currentPlan !== 'free' && currentPlan !== plan.id) return 'Switch plan';
    return `Upgrade to ${plan.name}`;
  };

  const isCurrentPlan    = (plan) => currentPlan === plan.id;
  const isLowerTierPlan  = (plan) => !plan.isFree && PLAN_LEVELS[currentPlan] > (PLAN_LEVELS[plan.id] ?? 0);

  return (
    <>
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-600 selection:text-white overflow-x-hidden relative">
      <Helmet>
        <title>Pricing - ShopLink.vi</title>
        <meta name="description" content="Free forever, or upgrade to Pro and Premium for advanced features." />
      </Helmet>

      {/* Ambient gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none z-0" />

      <div className="pt-40 pb-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-emerald-100 text-emerald-700 px-5 py-2 rounded-full mb-8 shadow-sm">
              <Sparkles size={14} fill="currentColor" className="text-yellow-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">Free forever. Upgrade when you're ready.</span>
            </div>
            <h1 className="text-5xl lg:text-8xl font-black text-slate-900 tracking-tighter mb-6">
              Always Free.<br />
              <span className="text-emerald-600">Upgrade when ready.</span>
            </h1>
            <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              ShopLink.vi is <span className="font-black text-slate-900">completely free</span> — create your store, add unlimited products, and collect WhatsApp orders at no cost, ever. Pro and Premium are for those who want extra features on top.
            </p>

            {/* Monthly / Yearly toggle */}
            <div className="flex items-center justify-center gap-4 mt-10">
              <span className={`text-sm font-black transition-colors ${!yearly ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
              <button
                onClick={() => setYearly(v => !v)}
                className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none ${yearly ? 'bg-emerald-500' : 'bg-slate-200'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${yearly ? 'translate-x-7' : 'translate-x-0'}`} />
              </button>
              <span className={`text-sm font-black transition-colors ${yearly ? 'text-slate-900' : 'text-slate-400'}`}>
                Yearly
                <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Save 15%</span>
              </span>
            </div>
          </div>

          {/* Pricing cards */}
          <div className="flex flex-wrap justify-center gap-8 items-start">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`
                  relative w-full md:w-[48%] lg:w-[30%] max-w-sm flex flex-col
                  p-8 rounded-[2.5rem] border-2 transition-all duration-500
                  hover:-translate-y-2 hover:shadow-2xl
                  ${plan.isBestDeal
                    ? 'bg-slate-900 text-white border-slate-900 shadow-[0_30px_60px_-15px_rgba(15,23,42,0.3)] lg:scale-105 z-10'
                    : plan.isPopular
                    ? 'bg-white border-emerald-200 shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)]'
                    : 'bg-white border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:border-slate-100'}
                `}
              >
                {plan.isPopular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_10px_20px_-10px_rgba(16,185,129,0.8)] flex items-center gap-2 whitespace-nowrap z-20">
                    <Star size={12} fill="currentColor" /> Most Popular
                  </div>
                )}
                {plan.isBestDeal && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_10px_20px_-10px_rgba(139,92,246,0.8)] flex items-center gap-2 whitespace-nowrap z-20">
                    <Zap size={12} fill="currentColor" /> {plan.badge}
                  </div>
                )}

                {/* Plan name + badge */}
                <div className="flex justify-between items-start mb-6">
                  <div className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl ${plan.isBestDeal ? 'bg-white/10 text-purple-300' : plan.isPopular ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {plan.name}
                  </div>
                  {isCurrentPlan(plan) && (
                    <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full uppercase tracking-widest">
                      Active
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="mb-4">
                  {plan.isFree ? (
                    <div className="text-5xl font-black tracking-tighter mb-1">{formatPrice(0, currency)}</div>
                  ) : (
                    <div>
                      <div className="text-5xl font-black tracking-tighter mb-1">
                        {yearly
                          ? formatPrice((prices[plan.id]?.yearly || plan.yearlyPrice), currency)
                          : formatPrice((prices[plan.id]?.monthly || plan.monthlyPrice), currency)}
                      </div>
                      <div className={`text-xs font-bold ${plan.isBestDeal ? 'text-slate-400' : 'text-slate-400'}`}>
                        {yearly ? '/year · billed once' : '/month · billed monthly'}
                      </div>
                      {yearly && (
                        <div className="mt-1.5 inline-flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-black px-2.5 py-1 rounded-full">
                          Save {plan.yearlyDiscount}% — you save {formatPrice((prices[plan.id]?.monthly || plan.monthlyPrice) * 12 - (prices[plan.id]?.yearly || plan.yearlyPrice), currency)}/yr
                        </div>
                      )}
                      {!isNG && !plan.isFree && (
                        <p className="text-[10px] text-slate-400 font-medium mt-2">
                          International cards accepted · Charged in NGN equivalent
                        </p>
                      )}
                    </div>
                  )}
                  <p className={`text-sm font-medium mt-3 ${plan.isBestDeal ? 'text-slate-400' : 'text-slate-500'}`}>
                    {plan.tagline}
                  </p>
                </div>

                <div className={`h-px w-full mb-6 ${plan.isBestDeal ? 'bg-white/10' : 'bg-slate-100'}`} />

                {/* Included features */}
                <ul className="space-y-3 mb-6 flex-1">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs font-bold leading-relaxed">
                      <div className={`mt-0.5 rounded-full p-0.5 shrink-0 ${plan.isBestDeal ? 'bg-emerald-500/20 text-emerald-400' : plan.isPopular ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                        <Check size={11} strokeWidth={4} />
                      </div>
                      <span className={plan.isBestDeal ? 'text-slate-300' : 'text-slate-600'}>{feat}</span>
                    </li>
                  ))}
                  {plan.lockedFeatures?.map((feat, idx) => (
                    <li key={`locked-${idx}`} className="flex items-start gap-3 text-xs font-bold leading-relaxed opacity-40">
                      <div className="mt-0.5 rounded-full p-0.5 shrink-0 bg-slate-100 text-slate-400">
                        <Lock size={11} strokeWidth={3} />
                      </div>
                      <span className="text-slate-400 line-through">{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA button */}
                {plan.isFree ? (
                  <Link
                    to={user ? '/dashboard' : '/register'}
                    className={`w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] text-center transition-all flex items-center justify-center gap-2 ${plan.btnColor}`}
                  >
                    {user ? 'Go to Dashboard' : 'Get started free'} <ArrowRight size={13} />
                  </Link>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan)}
                    disabled={isCurrentPlan(plan) || isLowerTierPlan(plan) || loading[plan.id]}
                    className={`w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] text-center transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60 disabled:cursor-default shadow-lg ${plan.btnColor} ${plan.isBestDeal ? 'hover:shadow-purple-500/20' : 'hover:-translate-y-0.5'}`}
                  >
                    {loading[plan.id] ? (
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>{getButtonLabel(plan)} {!isCurrentPlan(plan) && !isLowerTierPlan(plan) && <ArrowRight size={13} />}</>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* FAQ / Reassurance */}
          <div className="mt-32 text-center bg-white p-12 rounded-[3rem] border border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] max-w-4xl mx-auto relative overflow-hidden group">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-50 rounded-full blur-3xl group-hover:bg-emerald-100 transition-colors duration-700 pointer-events-none" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">No risk. Cancel anytime.</h3>
              <p className="text-slate-500 font-medium max-w-md mx-auto mb-10 leading-relaxed text-lg">
                Your free tier stays free forever — no credit card required. Upgrade when your store grows and you're ready to unlock more. Subscriptions can be cancelled at any time.
              </p>
              <Link to="/register" className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition shadow-xl hover:-translate-y-1 active:scale-95">
                Create your store for free <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-20 px-6 bg-white border-t border-slate-100 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <img src={shopLink_logo} className="w-5 h-5 invert brightness-0" alt="ShopLink Logo" />
            </div>
            <span className="font-black text-xl tracking-tighter uppercase italic text-slate-900">
              ShopLink<span className="text-emerald-600 not-italic">.vi</span>
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 lg:gap-12 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Link to="/privacy" className="hover:text-emerald-600 transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-emerald-600 transition">Terms of Service</Link>
            <Link to="/contact" className="hover:text-emerald-600 transition">Contact Us</Link>
            <Link to="/support" className="hover:text-emerald-600 transition">Support</Link>
          </div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest text-center flex items-center gap-2">
            © {new Date().getFullYear()} ShopLink • Engineered with ❤️ in Nigeria
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Flag_of_Nigeria.svg/200px-Flag_of_Nigeria.svg.png"
              alt="Nigeria Flag"
              className="w-5 h-auto shadow-sm rounded-sm"
            />
          </p>
        </div>
      </footer>
    </div>

    {successPlan && (
      <PaymentSuccess
        plan={successPlan}
        onClose={() => { setSuccessPlan(null); navigate('/dashboard'); }}
      />
    )}
  </>
  );
}
