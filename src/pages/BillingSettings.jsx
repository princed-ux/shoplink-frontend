import { useState, useEffect } from 'react';
import { Link, useOutletContext, useLocation } from 'react-router-dom';
import { CreditCard, Zap, Crown, Check, ArrowRight, Calendar, AlertCircle, X } from 'lucide-react';
import { SUBSCRIPTION_PLANS, formatPrice, getPricing } from '../data/plans';
import { supabase } from '../supabaseClient';
import { toast } from 'react-hot-toast';
import PaymentSuccess from '../components/PaymentSuccess';
import { activatePlan } from '../components/UpgradeModal';

const PLAN_META = {
  free:    { label: 'Free',    icon: null,  color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800' },
  pro:     { label: 'Pro',     icon: Zap,   color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  premium: { label: 'Premium', icon: Crown, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-500/10' },
};

const CANCEL_REASONS = [
  'Too expensive',
  'Not using it enough',
  'Missing a feature I need',
  'Switching to another service',
  'Store is on pause / temporary',
  'Other',
];

export default function BillingSettings({ user, setUser }) {
  const { openUpgradeModal } = useOutletContext() || {};
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [successPlan, setSuccessPlan] = useState(null);
  const { currency } = getPricing(user?.vendor);

  const location = useLocation();

  // Handle Paystack redirect callback — fires when Paystack redirects back here
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const reference = params.get('reference') || params.get('trxref');
    if (!reference) return;

    const pendingRaw = sessionStorage.getItem('shoplink_pending_plan');
    if (!pendingRaw) return;

    const pending = JSON.parse(pendingRaw);
    if (!pending?.id || !user?.vendor?.id) return;

    // Activate the plan and show success
    const plan  = SUBSCRIPTION_PLANS.find(p => p.id === pending.id) || pending;
    const cycle = pending.billing_cycle || 'monthly';
    activatePlan(plan, user, cycle).then((update) => {
      if (update) {
        setUser(prev => ({ ...prev, vendor: { ...prev.vendor, ...update } }));
      }
      setSuccessPlan(plan);
      window.history.replaceState({}, '', '/dashboard/billing');
    });
  }, [location.search]);

  const planType        = user?.vendor?.plan_type?.toLowerCase() || 'free';
  const planStatus      = user?.vendor?.plan_status || 'active';
  const expiresAt       = user?.vendor?.plan_expires_at;
  const startedAt       = user?.vendor?.plan_started_at;
  const billingCycle    = user?.vendor?.billing_cycle || 'monthly';
  const meta            = PLAN_META[planType] || PLAN_META.free;
  const Icon            = meta.icon;
  const currentPlanData = SUBSCRIPTION_PLANS.find(p => p.id === planType);

  const { prices } = getPricing(user?.vendor);
  const actualPrice = planType !== 'free'
    ? (billingCycle === 'yearly' ? prices[planType]?.yearly : prices[planType]?.monthly) ?? 0
    : 0;
  const billingLabel = billingCycle === 'yearly' ? '/year' : '/month';

  const handleCancelConfirm = async () => {
    if (!selectedReason) { toast.error('Please select a reason'); return; }
    setCancelling(true);
    try {
      // Reason is NOT saved — just for UX friction
      const { error } = await supabase.functions.invoke('cancel-subscription', {
        body: { vendor_id: user.vendor.id },
      });
      if (error) throw error;
      setShowCancelModal(false);
      setUser({ ...user, vendor: { ...user.vendor, plan_status: 'cancelling' } });
      toast.success('Subscription cancelled. You keep access until your billing period ends.');
    } catch {
      toast.error('Could not cancel. Please email support@shoplinkvi.com');
    } finally {
      setCancelling(false);
    }
  };

  const cardCls = 'bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm p-8';

  return (
    <div className="max-w-3xl mx-auto pb-20 pt-6 space-y-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Billing</h1>
        <p className="text-slate-400 font-medium text-sm mt-2">Your current plan and subscription details.</p>
      </div>

      {/* Current plan */}
      <div className={cardCls}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 ${meta.bg} rounded-xl flex items-center justify-center`}>
            {Icon ? <Icon size={18} className={meta.color} fill="currentColor" /> : <CreditCard size={18} className="text-slate-400" />}
          </div>
          <div>
            <h3 className="font-black text-slate-900 dark:text-white">Current Plan</h3>
            <p className="text-xs text-slate-400 font-medium">Your active subscription</p>
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{meta.label}</span>
              <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                planStatus === 'active'       ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                : planStatus === 'past_due'   ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                : planStatus === 'cancelling' ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
              }`}>{planStatus}</span>
              {billingCycle === 'yearly' && planType !== 'free' && (
                <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400">Yearly</span>
              )}
            </div>
            {startedAt && planType !== 'free' && (
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
                <Calendar size={13} />
                Subscribed: {new Date(startedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            )}
            {expiresAt && planType !== 'free' && (
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <Calendar size={13} />
                {planStatus === 'cancelling'
                  ? `Access until: ${new Date(expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`
                  : `Next billing: ${new Date(expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`
                }
              </div>
            )}
            {planType === 'free' && <p className="text-xs text-slate-400 font-medium">No billing — free forever</p>}
          </div>
          {planType !== 'free' && actualPrice > 0 && (
            <p className="text-sm font-black text-slate-700 dark:text-slate-200">{formatPrice(actualPrice, currency)}{billingLabel}</p>
          )}
        </div>

        {planType === 'free' && (
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={() => openUpgradeModal?.()}
              className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg"
            >
              <Zap size={13} fill="currentColor" /> Upgrade your plan <ArrowRight size={13} />
            </button>
          </div>
        )}
      </div>

      {/* What's included */}
      {currentPlanData && planType !== 'free' && (
        <div className={cardCls}>
          <h3 className="font-black text-slate-900 dark:text-white mb-5">What's included in {meta.label}</h3>
          <ul className="space-y-3">
            {currentPlanData.features.map((feat, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
                <div className="w-5 h-5 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check size={11} strokeWidth={4} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                {feat}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Pro → Premium upsell */}
      {planType === 'pro' && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-500/10 dark:to-indigo-500/10 rounded-[2rem] border border-purple-100 dark:border-purple-500/20 p-6 flex items-center gap-4">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Crown size={18} className="text-purple-600 dark:text-purple-400" fill="currentColor" />
          </div>
          <div className="flex-1">
            <p className="font-black text-slate-900 dark:text-white text-sm">Unlock Premium</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Auto WhatsApp replies to customers + priority support.
            </p>
          </div>
          <button onClick={() => openUpgradeModal?.()} className="flex-shrink-0 text-[10px] font-black bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl uppercase tracking-widest transition-all active:scale-95">
            Upgrade
          </button>
        </div>
      )}

      {/* Cancel subscription */}
      {planType !== 'free' && planStatus !== 'cancelling' && (
        <div className={`${cardCls} !border-red-100 dark:!border-red-500/20`}>
          <div className="flex items-start gap-3 mb-5">
            <div className="w-10 h-10 bg-red-50 dark:bg-red-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle size={18} className="text-red-500" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white">Cancel Subscription</h3>
              <p className="text-xs text-slate-400 font-medium mt-1">
                You keep full access until the end of your current billing period. After that your plan reverts to Free.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCancelModal(true)}
            className="px-6 py-3 border-2 border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-500/10 transition-all active:scale-95"
          >
            Cancel Subscription
          </button>
        </div>
      )}

      {/* Cancelling message */}
      {planType !== 'free' && planStatus === 'cancelling' && (
        <div className={`${cardCls} !border-amber-100 dark:!border-amber-500/20`}>
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle size={18} className="text-amber-500" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-sm">Cancellation Scheduled</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 leading-relaxed">
                Your {meta.label} plan stays active until{' '}
                {expiresAt ? new Date(expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'the next billing date'}.
                You will not be charged again.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Support */}
      <div className="text-center text-xs text-slate-400 font-medium">
        Questions about billing?{' '}
        <Link to="/support" className="text-emerald-600 hover:underline font-black">Contact support</Link>
        {' '}or{' '}
        <a href="mailto:support@shoplinkvi.com" className="text-emerald-600 hover:underline font-black">email us</a>
      </div>

      {/* ── CANCEL REASON MODAL ── */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowCancelModal(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-md shadow-2xl p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Before you go...</h3>
                <p className="text-sm text-slate-400 font-medium mt-1">What's the reason for cancelling?</p>
              </div>
              <button onClick={() => setShowCancelModal(false)} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition">
                <X size={15} className="text-slate-500" />
              </button>
            </div>

            <div className="space-y-2 mb-6">
              {CANCEL_REASONS.map(reason => (
                <button
                  key={reason}
                  onClick={() => setSelectedReason(reason)}
                  className={`w-full text-left px-4 py-3.5 rounded-2xl border-2 font-bold text-sm transition-all ${
                    selectedReason === reason
                      ? 'border-red-400 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                      : 'border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <p className="text-[10px] text-slate-400 font-medium text-center mb-4">
              Your reason is only used to help us improve. We do not store it.
            </p>

            <button
              onClick={handleCancelConfirm}
              disabled={!selectedReason || cancelling}
              className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-40 disabled:cursor-default shadow-lg"
            >
              {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </div>
        </div>
      )}

      {/* Payment success screen */}
      {successPlan && (
        <PaymentSuccess
          plan={successPlan}
          onClose={() => setSuccessPlan(null)}
        />
      )}
    </div>
  );
}
