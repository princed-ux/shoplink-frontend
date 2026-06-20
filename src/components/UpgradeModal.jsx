import { useState } from 'react';
import { X, Check, Zap, Crown, ArrowRight, Lock } from 'lucide-react';
import { SUBSCRIPTION_PLANS, formatPrice, getPricing, getChargeAmountNGN, isSubscriptionActive, PLAN_LEVELS } from '../data/plans';
import { supabase } from '../supabaseClient';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { usePaystackPayment } from 'react-paystack';
import PaymentSuccess from './PaymentSuccess';

// Shared plan activation — called from onSuccess OR from callback URL handler
export async function activatePlan(plan, user, billingCycle = 'monthly') {
  try {
    const now      = new Date();
    const expires  = new Date(now);
    if (billingCycle === 'yearly') {
      expires.setFullYear(expires.getFullYear() + 1);
    } else {
      expires.setMonth(expires.getMonth() + 1);
    }

    const updatePayload = {
      plan_type:       plan.id,
      plan_status:     'active',
      plan_started_at: now.toISOString(),
      plan_expires_at: expires.toISOString(),
      billing_cycle:   billingCycle,
    };

    await supabase
      .from('vendors')
      .update(updatePayload)
      .eq('id', user.vendor.id);

    const saved   = JSON.parse(localStorage.getItem('quickshop_user') || '{}');
    const updated = {
      ...saved,
      vendor: { ...(saved.vendor || {}), ...updatePayload },
    };
    localStorage.setItem('quickshop_user', JSON.stringify(updated));
    sessionStorage.removeItem('shoplink_pending_plan');

    return updatePayload;
  } catch (err) {
    console.error('activatePlan error:', err);
    return null;
  }
}

export default function UpgradeModal({ open, onClose, user, highlight = 'pro' }) {
  const [yearly, setYearly]         = useState(false);
  const [loading, setLoading]       = useState({});
  const [successPlan, setSuccessPlan] = useState(null);
  const navigate                    = useNavigate();

  const initializePayment = usePaystackPayment({
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
  });

  if (!open && !successPlan) return null;

  const currentPlan = isSubscriptionActive(user?.vendor)
    ? (user?.vendor?.plan_type?.toLowerCase() || 'free')
    : 'free';

  const handleUpgrade = async (plan) => {
    if (!user) { onClose(); navigate('/register'); return; }

    const isNG      = user?.vendor?.country === 'NG';
    // NGN users get a recurring plan code; international users get a one-time NGN charge (Option A)
    const planCode  = isNG
      ? (yearly ? plan.paystackYearlyPlanCode : plan.paystackMonthlyPlanCode)
      : null;
    const displayAmount  = yearly ? plan.yearlyPrice : plan.monthlyPrice;
    const chargeAmount   = getChargeAmountNGN(displayAmount, isNG);

    if (isNG && !planCode) {
      toast.error('Payment setup in progress. Contact support to upgrade.');
      return;
    }

    setLoading(prev => ({ ...prev, [plan.id]: true }));

    sessionStorage.setItem('shoplink_pending_plan', JSON.stringify({
      id:            plan.id,
      name:          plan.name,
      features:      plan.features,
      vendor_id:     user.vendor.id,
      badge_color:   plan.badgeColor,
      billing_cycle: yearly ? 'yearly' : 'monthly',
    }));

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
        const cycle = yearly ? 'yearly' : 'monthly';
        try {
          await activatePlan(plan, user, cycle);
        } catch (e) { console.error('plan update:', e); }
        sessionStorage.removeItem('shoplink_pending_plan');
        setSuccessPlan(plan);
      },
      onClose: () => {
        setLoading(prev => ({ ...prev, [plan.id]: false }));
      },
      config,
    });
  };

  const { prices, currency, isNG: vendorIsNG } = getPricing(user?.vendor);
  const paystackCurrency = 'NGN';
  const paidPlans = SUBSCRIPTION_PLANS.filter(p => !p.isFree).map(plan => ({
    ...plan,
    monthlyPrice: prices[plan.id]?.monthly || plan.monthlyPrice,
    yearlyPrice: prices[plan.id]?.yearly || plan.yearlyPrice,
  }));

  return (
    <>
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm ${!open ? 'hidden' : ''}`}
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-slate-900 p-8 pb-6 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="absolute top-4 right-4 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 transition border border-white/20 shadow-lg"
            title="Close"
          >
            <X size={18} className="text-white" />
          </button>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2">ShopLink.vi</p>
            <h2 className="text-3xl font-black tracking-tighter mb-2">Upgrade your store</h2>
            <p className="text-slate-400 text-sm font-medium">
              The app is <span className="text-white font-black">100% free</span> to use. Upgrade only if you want extra features.
            </p>
          </div>

          {/* Monthly / Yearly toggle */}
          <div className="relative z-10 flex items-center gap-4 mt-5">
            <span className={`text-xs font-black transition-colors ${!yearly ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
            <button
              onClick={() => setYearly(v => !v)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${yearly ? 'bg-emerald-500' : 'bg-slate-700'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${yearly ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <span className={`text-xs font-black transition-colors ${yearly ? 'text-white' : 'text-slate-500'}`}>
              Yearly
              <span className="ml-2 text-[9px] bg-emerald-500/30 text-emerald-400 px-1.5 py-0.5 rounded-full font-black uppercase tracking-widest">Save 15%</span>
            </span>
          </div>
        </div>

        {/* Plan cards */}
        <div className="p-6 grid sm:grid-cols-2 gap-4">
          {paidPlans.map(plan => {
            const isHighlight  = plan.id === highlight;
            const isCurrent    = currentPlan === plan.id;
            const isLowerTier  = PLAN_LEVELS[currentPlan] > (PLAN_LEVELS[plan.id] ?? 0);
            const isLoading    = loading[plan.id];
            const isDisabled   = isCurrent || isLowerTier || isLoading;
            const Icon         = plan.id === 'premium' ? Crown : Zap;

            return (
              <div
                key={plan.id}
                className={`relative rounded-[2rem] border-2 p-6 transition-all ${
                  isLowerTier
                    ? 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 opacity-70'
                    : isHighlight
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/5 shadow-xl shadow-emerald-500/10'
                    : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800'
                }`}
              >
                {isHighlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap">
                    Recommended
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${plan.id === 'premium' ? 'bg-purple-100 dark:bg-purple-500/20' : 'bg-amber-100 dark:bg-amber-500/20'}`}>
                    <Icon size={16} fill="currentColor" className={plan.id === 'premium' ? 'text-purple-600 dark:text-purple-400' : 'text-amber-600 dark:text-amber-400'} />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 dark:text-white text-sm">{plan.name}</p>
                    {isCurrent   && <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Current plan</p>}
                    {isLowerTier && <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Included in your plan</p>}
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    {formatPrice(yearly ? plan.yearlyPrice : plan.monthlyPrice, currency)}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {yearly ? '/year' : '/month'}
                  </span>
                  {yearly && (
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                      Save {plan.yearlyDiscount}% · charged once, valid 365 days
                    </p>
                  )}
                  {!vendorIsNG && (
                    <p className="text-[9px] text-slate-400 font-medium mt-1">
                      International cards accepted · Charged in NGN equivalent
                    </p>
                  )}
                </div>

                <ul className="space-y-2 mb-5">
                  {plan.features.slice(0, 5).map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                      <Check size={12} strokeWidth={3} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                      {feat}
                    </li>
                  ))}
                  {plan.features.length > 5 && (
                    <li className="text-[10px] text-slate-400 font-bold pl-5">+ {plan.features.length - 5} more features</li>
                  )}
                </ul>

                <button
                  onClick={() => handleUpgrade(plan)}
                  disabled={isDisabled}
                  className={`w-full py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:cursor-default flex items-center justify-center gap-2 ${
                    isLowerTier
                      ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                      : isHighlight
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20'
                      : plan.id === 'premium'
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900'
                  }`}
                >
                  {isLoading
                    ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    : isLowerTier
                    ? <><Check size={12} strokeWidth={3} /> Already included</>
                    : isCurrent
                    ? 'Current plan'
                    : <>{`Upgrade to ${plan.name}`} <ArrowRight size={12} /></>
                  }
                </button>
              </div>
            );
          })}
        </div>

        {/* Free note */}
        <div className="px-6 pb-6 text-center">
          <p className="text-xs text-slate-400 font-medium">
            <Lock size={11} className="inline mr-1 mb-0.5" />
            Not upgrading? No problem — the app stays{' '}
            <span className="font-black text-slate-600 dark:text-slate-300">completely free</span> forever.
          </p>
        </div>
      </div>
    </div>

    {/* Confetti success screen */}
    {successPlan && (
      <PaymentSuccess
        plan={successPlan}
        onClose={() => { setSuccessPlan(null); onClose(); }}
      />
    )}
  </>
  );
}
