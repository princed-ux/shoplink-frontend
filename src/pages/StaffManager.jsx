import { useState, useEffect } from 'react';
import { Plus, Loader2, Users, X, Copy, Trash2, UserPlus, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../supabaseClient';

export default function StaffManager({ user }) {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchStaff(); }, []);

  const fetchStaff = async () => {
    setLoading(true);
    const { data } = await supabase.from('staff_members').select('*').eq('vendor_id', user.vendor.id).order('created_at', { ascending: false });
    setStaff(data || []);
    setLoading(false);
  };

  const addStaff = async () => {
    if (!name || !pin) return toast.error('Name and PIN are required');
    if (pin.length < 4 || pin.length > 6) return toast.error('PIN must be 4-6 digits');
    if (!/^\d+$/.test(pin)) return toast.error('PIN must be numbers only');
    setSaving(true);
    const { error } = await supabase.from('staff_members').insert({
      vendor_id: user.vendor.id, name: name.trim(), email: email.trim() || null, pin,
    });
    if (error) { toast.error(error.message); setSaving(false); return; }
    toast.success(`${name} added as staff`);
    setName(''); setEmail(''); setPin('');
    setShowAdd(false);
    fetchStaff();
    setSaving(false);
  };

  const removeStaff = async (id, name) => {
    if (!window.confirm(`Remove ${name} from staff?`)) return;
    await supabase.from('staff_members').delete().eq('id', id);
    setStaff(prev => prev.filter(s => s.id !== id));
    toast.success(`${name} removed`);
  };

  const staffUrl = `https://shoplinkvi.com/staff/${user.vendor.slug}`;

  return (
    <div className="relative min-h-full transition-colors duration-300">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 dark:from-slate-950 dark:via-slate-950 dark:to-emerald-950/10"></div>
      </div>

      <div className="max-w-3xl mx-auto pb-20 px-4 sm:px-6 pt-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Staff</h2>
            <p className="text-sm text-slate-400 font-medium mt-0.5">Give employees access to manage orders</p>
          </div>
          <button onClick={() => setShowAdd(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20">
            <UserPlus size={16} /> Add Staff
          </button>
        </div>

        {/* Staff portal URL */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 border border-slate-100 dark:border-slate-800 mb-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Staff Login URL</p>
          <div className="flex items-center gap-2">
            <input readOnly value={staffUrl} className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-300 outline-none" />
            <button onClick={() => { navigator.clipboard.writeText(staffUrl); toast.success('Copied!'); }}
              className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 hover:text-emerald-500 transition-all border border-slate-200 dark:border-slate-700">
              <Copy size={16} />
            </button>
          </div>
        </div>

        {/* Staff list */}
        {loading ? (
          <div className="py-24 text-center"><Loader2 size={32} className="animate-spin text-emerald-500 mx-auto" /></div>
        ) : staff.length > 0 ? (
          <div className="space-y-3">
            {staff.map(s => (
              <div key={s.id} className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 border border-slate-100 dark:border-slate-800 flex items-center justify-between transition-all hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center">
                    <Users size={18} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 dark:text-white text-sm">{s.name}</p>
                    <p className="text-[11px] text-slate-400 font-medium">{s.email || 'No email'} · PIN: {s.pin.replace(/\d/g, '•')}</p>
                  </div>
                </div>
                <button onClick={() => removeStaff(s.id, s.name)}
                  className="p-2 bg-red-50 dark:bg-red-500/10 rounded-xl text-red-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] bg-slate-50/50 dark:bg-slate-900/50">
            <div className="w-20 h-20 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
              <Users size={32} className="text-slate-300 dark:text-slate-600" />
            </div>
            <h4 className="font-black text-slate-900 dark:text-white text-xl mb-2">No staff yet</h4>
            <p className="text-slate-400 text-sm font-medium">Add employees to help manage orders.</p>
          </div>
        )}
      </div>

      {/* Add staff modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => { if (!saving) setShowAdd(false); }}>
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] max-w-md w-full p-6 shadow-2xl border border-white/20 dark:border-slate-800" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-slate-900 dark:text-white text-lg">Add Staff Member</h3>
              <button onClick={() => setShowAdd(false)} className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1 block">Name</label>
                <input className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-emerald-500 font-bold text-sm" placeholder="e.g. Jane" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1 block">Email <span className="font-normal normal-case text-slate-300">(optional)</span></label>
                <input className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-emerald-500 font-bold text-sm" placeholder="jane@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1 block">PIN <span className="text-amber-500 font-normal normal-case">4-6 digits</span></label>
                <input type="password" maxLength={6} inputMode="numeric" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-emerald-500 font-bold text-sm" placeholder="1234" value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ''))} />
              </div>
              <button onClick={addStaff} disabled={saving}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50">
                {saving ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                {saving ? 'Adding...' : 'Add Staff'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
