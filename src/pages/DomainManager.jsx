import { useState } from 'react';
import { Loader2, Globe, Copy, CheckCircle2, AlertTriangle, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../supabaseClient';
import { hasPlan } from '../data/plans';

export default function DomainManager({ user, setUser }) {
  const isPremium = hasPlan(user?.vendor, 'premium');
  const [domain, setDomain] = useState(user?.vendor?.custom_domain || '');
  const [verified, setVerified] = useState(user?.vendor?.custom_domain_verified || false);
  const [saving, setSaving] = useState(false);
  const [checking, setChecking] = useState(false);

  const slug = user?.vendor?.slug || '';

  const handleSave = async () => {
    const clean = domain.toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();
    if (!clean) return toast.error('Enter a domain name');
    setSaving(true);
    const { error } = await supabase.from('vendors').update({ custom_domain: clean, custom_domain_verified: false }).eq('id', user.vendor.id);
    if (error) { toast.error(error.message); setSaving(false); return; }
    setVerified(false);
    setUser({ ...user, vendor: { ...user.vendor, custom_domain: clean, custom_domain_verified: false } });
    toast.success('Domain saved! Add the DNS record below.');
    setSaving(false);
  };

  const verifyDomain = async () => {
    setChecking(true);
    try {
      // Resolve the shoplinkvi.com IP first
      const shopIpResp = await fetch('https://dns.google/resolve?name=shoplinkvi.com&type=A');
      const shopIpData = await shopIpResp.json();
      const shopIp = shopIpData.Answer?.[0]?.data;

      // Check CNAME
      const cnameResp = await fetch(`https://dns.google/resolve?name=${domain}&type=CNAME`);
      const cnameData = await cnameResp.json();
      const cnameMatch = cnameData.Answer?.some(a => {
        const target = a.data?.toLowerCase().replace(/\.$/, '');
        return target === 'shoplinkvi.com' || target.endsWith('.shoplinkvi.com');
      });

      // Check A record (apex domains)
      const aResp = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
      const aData = await aResp.json();
      const aMatch = shopIp && aData.Answer?.some(a => a.data === shopIp);

      // Check www subdomain CNAME
      let wwwCnameMatch = false;
      if (!cnameMatch && !aMatch) {
        const wwwResp = await fetch(`https://dns.google/resolve?name=www.${domain}&type=CNAME`);
        const wwwData = await wwwResp.json();
        wwwCnameMatch = wwwData.Answer?.some(a => {
          const target = a.data?.toLowerCase().replace(/\.$/, '');
          return target === 'shoplinkvi.com' || target.endsWith('.shoplinkvi.com');
        });
      }

      if (cnameMatch || aMatch || wwwCnameMatch) {
        await supabase.from('vendors').update({ custom_domain_verified: true }).eq('id', user.vendor.id);
        setVerified(true);
        setUser({ ...user, vendor: { ...user.vendor, custom_domain_verified: true } });
        toast.success('Domain verified!');
      } else {
        let details = [];
        if (cnameData.Answer?.length) details.push(`CNAME: ${cnameData.Answer.map(a => a.data).join(', ')}`);
        if (aData.Answer?.length) details.push(`A: ${aData.Answer.map(a => a.data).join(', ')}`);
        const msg = details.length
          ? `Found records: ${details.join(' | ')}. Make sure a CNAME points to shoplinkvi.com`
          : 'No DNS records found. Add a CNAME record pointing to shoplinkvi.com (or an A record to the server IP). Changes can take up to 48 hours.';
        toast.error(msg);
      }
    } catch {
      toast.error('Could not verify domain. Make sure the DNS record is set up correctly.');
    }
    setChecking(false);
  };

  if (!isPremium) {
    return (
      <div className="relative min-h-full flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
            <Globe size={32} className="text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="font-black text-2xl text-slate-900 dark:text-white mb-3">Custom Domain</h3>
          <p className="text-slate-400 font-medium mb-6">Use your own domain name (e.g. mystore.com) for your storefront. Available on the Premium plan.</p>
          <div className="inline-flex items-center gap-2 px-5 py-3 bg-amber-50 dark:bg-amber-500/10 rounded-2xl border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-black uppercase tracking-widest">
            <Lock size={14} /> Premium Feature
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-full transition-colors duration-300">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 dark:from-slate-950 dark:via-slate-950 dark:to-emerald-950/10"></div>
      </div>

      <div className="max-w-2xl mx-auto pb-20 px-4 sm:px-6 pt-4">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1">Domains</h2>
        <p className="text-sm text-slate-400 font-medium mb-8">Choose how customers reach your storefront.</p>

        {/* Current store URL */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 mb-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Default ShopLink URL</p>
          <div className="flex items-center gap-2">
            <input readOnly value={`shoplinkvi.com/shop.vi/${slug}`} className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-300 outline-none" />
            <button onClick={() => { navigator.clipboard.writeText(`shoplinkvi.com/shop.vi/${slug}`); toast.success('Copied!'); }}
              className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 hover:text-emerald-500 transition-all border border-slate-200 dark:border-slate-700">
              <Copy size={16} />
            </button>
          </div>
        </div>

        {/* Custom domain */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0">
              <Globe size={18} className="text-amber-500" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-sm">Your Own Domain</h3>
              <p className="text-xs text-slate-400 font-medium">Use a domain you already own (e.g. mystore.com)</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 font-medium mb-3 leading-relaxed">
            Point your domain to ShopLink by adding a CNAME record at your domain provider. 
            When someone visits your domain, they'll see your storefront — no ShopLink branding in the URL.
          </p>
          <div className="flex items-center gap-2 mb-4">
            <input placeholder="mystore.com" value={domain} onChange={e => setDomain(e.target.value)} 
              className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-emerald-500 font-bold text-sm" />
            <button onClick={handleSave} disabled={saving}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20">
              {saving ? <Loader2 className="animate-spin" size={14} /> : 'Save'}
            </button>
          </div>
          {verified && (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-bold mb-4">
              <CheckCircle2 size={16} /> Domain verified ✓
            </div>
          )}

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Option A: Subdomain (CNAME record)</p>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mb-2">Use if your domain is a subdomain (e.g. shop.mystore.com). Add at your DNS provider:</p>
              <div className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-700 space-y-1 text-xs font-mono">
                <p><span className="text-slate-400">Type:</span> <strong className="text-slate-800 dark:text-slate-200">CNAME</strong></p>
                <p><span className="text-slate-400">Name:</span> <strong className="text-slate-800 dark:text-slate-200">shop</strong></p>
                <p><span className="text-slate-400">Target:</span> <strong className="text-emerald-600">shoplinkvi.com</strong></p>
                <p className="text-[9px] text-slate-400 mt-1">Then enter <strong>{domain}</strong> above (e.g. shop.mystore.com)</p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Option B: Apex domain (A record)</p>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mb-2">Use for root domains (e.g. mystore.com). Add at your DNS provider:</p>
              <div className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-700 space-y-1 text-xs font-mono">
                <p><span className="text-slate-400">Type:</span> <strong className="text-slate-800 dark:text-slate-200">A</strong></p>
                <p><span className="text-slate-400">Name:</span> <strong className="text-slate-800 dark:text-slate-200">@</strong></p>
                <p><span className="text-slate-400">Value:</span> <strong className="text-emerald-600">76.76.21.21</strong></p>
                <p className="text-[9px] text-slate-400 mt-1">Or use an ALIAS/ANAME record pointing to shoplinkvi.com</p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Step 3: Verify</p>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mb-3">DNS changes can take up to 48 hours. Click verify to check.</p>
              <button onClick={verifyDomain} disabled={checking || !domain || verified}
                className="px-5 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-50 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-lg">
                {checking ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle2 size={14} />}
                {checking ? 'Checking...' : 'Verify Domain'}
              </button>
              {!verified && domain && (
                <p className="text-[10px] text-slate-400 font-medium mt-2">Checks CNAME, A, and www CNAME records. Shows what was found if verification fails.</p>
              )}
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="p-4 bg-amber-50 dark:bg-amber-500/10 rounded-2xl border border-amber-200 dark:border-amber-500/20">
          <div className="flex items-start gap-2">
            <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-[11px] text-amber-700 dark:text-amber-300 font-medium">
              All three URLs work simultaneously. Customers can reach you via any of them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
