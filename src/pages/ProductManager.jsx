import { useState, useRef, useEffect } from 'react';
import { Plus, Loader2, ShoppingBag, ImageIcon, Pencil, Trash2, UploadCloud, Lock, FileUp, X, CheckCircle2, AlertTriangle, Zap, Package2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Papa from 'papaparse';
import { supabase } from '../supabaseClient';
import { getCurrency } from '../data/countries';
import { getCurrencySymbol, hasPlan, MAX_PRODUCT_IMAGES, GIF_ENABLED } from '../data/plans';
import { resolveColor } from '../data/colors';

export default function ProductManager({ user, setUser }) {
  const isPaidUser    = hasPlan(user?.vendor, 'pro');
  const isPremiumUser = hasPlan(user?.vendor, 'premium');
  const effectivePlan = isPremiumUser ? 'premium' : isPaidUser ? 'pro' : 'free';
  const maxImages = MAX_PRODUCT_IMAGES[effectivePlan];
  const pmCurrency = getCurrency(user?.vendor?.country || 'NG');
  const pmSymbol = getCurrencySymbol(pmCurrency);

  const [name, setName]                     = useState('');
  const [price, setPrice]                   = useState('');
  const [stock, setStock]                   = useState('');
  const [description, setDescription]       = useState('');
  const [variants, setVariants]             = useState([]);
  // Each entry: { url: string (blob or Supabase URL), file: File|null }
  const [pendingImages, setPendingImages]   = useState([]);
  const [loading, setLoading]               = useState(false);
  const [editingId, setEditingId]           = useState(null);
  const [products, setProducts]             = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const fileInputRef = useRef(null);

  const uploadedCount  = user?.vendor?.uploaded_count ?? 0;

  // Inventory preview modal state
  const [previewProduct, setPreviewProduct] = useState(null);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteConfirming, setDeleteConfirming] = useState(false);

  // Quick restock state
  const [restockId, setRestockId] = useState(null);
  const [restockVal, setRestockVal] = useState('');

  // Bulk restock state
  const [selectionMode, setSelectionMode]   = useState(false);
  const [selectedIds, setSelectedIds]       = useState(new Set());
  const [bulkRestockVal, setBulkRestockVal] = useState('');
  const [bulkRestocking, setBulkRestocking] = useState(false);

  // CSV import state (Premium only)
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvRows, setCsvRows] = useState([]);
  const [csvLoading, setCsvLoading] = useState(false);
  const [csvImporting, setCsvImporting] = useState(false);
  const [csvResult, setCsvResult] = useState(null);

  // Quick Multi-Add state (Pro + Premium)
  const EMPTY_ROW = () => ({ name: '', price: '', stock: '', description: '', imageFile: null, imagePreview: null });
  const [showMultiAddModal, setShowMultiAddModal] = useState(false);
  const [multiRows, setMultiRows] = useState([EMPTY_ROW()]);
  const [multiSaving, setMultiSaving] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('vendor_id', user.vendor.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch {
      toast.error('Failed to load products.');
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e?.target?.files || []);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (files.length === 0) return;

    // Single-image plans (free): re-picking replaces the existing photo
    if (maxImages === 1) {
      const file = files[0];
      if (file.size > 2 * 1024 * 1024) return toast.error('File too large (Max 2MB)');
      setPendingImages([{ url: URL.createObjectURL(file), file }]);
      return;
    }

    const remaining = maxImages - pendingImages.length;
    if (remaining <= 0) {
      return toast.error(`Max ${maxImages} image${maxImages > 1 ? 's' : ''} on your plan`);
    }

    const accepted = [];
    let rejectedGif = false;
    let rejectedSize = false;

    for (const file of files) {
      if (accepted.length >= remaining) break;
      const isGif = file.type === 'image/gif';
      if (isGif && !GIF_ENABLED[effectivePlan]) { rejectedGif = true; continue; }
      const maxSize = isGif ? 5 * 1024 * 1024 : 2 * 1024 * 1024;
      if (file.size > maxSize) { rejectedSize = true; continue; }
      accepted.push({ url: URL.createObjectURL(file), file });
    }

    if (accepted.length > 0) {
      setPendingImages(prev => [...prev, ...accepted]);
    }
    if (files.length > remaining) {
      toast.error(`Only ${remaining} more image${remaining > 1 ? 's' : ''} allowed on your plan`);
    } else if (rejectedGif) {
      toast.error('GIF upload requires a Premium plan');
    } else if (rejectedSize) {
      toast.error('Some files were too large (Max 2MB photo / 5MB GIF)');
    }
  };

  const clearForm = () => {
    setPendingImages([]);
    setName('');
    setPrice('');
    setStock('');
    setDescription('');
    setVariants([]);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const uploadImage = async (file) => {
    const ext = file.name.split('.').pop();
    const uid = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const fileName = `${user.vendor.id}/${uid}.${ext}`;
    const { error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, { upsert: true });
    if (error) throw error;
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  const handleSaveProduct = async () => {
    if (!name || !price) return toast.error('Enter product details');
    if (!editingId && pendingImages.length === 0) return toast.error('Product image is mandatory!');

    setLoading(true);
    try {
      const finalUrls = await Promise.all(
        pendingImages.map(item => item.file ? uploadImage(item.file) : item.url)
      );
      const imageUrl = finalUrls[0] ?? null;
      const stockVal = isPaidUser && stock !== '' ? Number(stock) : -1;
      const variantsVal = variants.filter(v => v.name && v.options.some(o => o.trim()));

      if (editingId) {
        const { data, error } = await supabase
          .from('products')
          .update({ name, price: Number(price), stock: stockVal, description, variants: variantsVal, image_url: imageUrl, image_urls: finalUrls })
          .eq('id', editingId)
          .eq('vendor_id', user.vendor.id)
          .select()
          .single();
        if (error) throw error;
        setProducts(prev => prev.map(p => p.id === editingId ? data : p));
        toast.success('Product updated!');
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert({ vendor_id: user.vendor.id, name, price: Number(price), stock: stockVal, description, variants: variantsVal, image_url: imageUrl, image_urls: finalUrls })
          .select()
          .single();
        if (error) throw error;

        const newCount = uploadedCount + 1;
        await supabase.from('vendors').update({ uploaded_count: newCount }).eq('id', user.vendor.id);

        setProducts(prev => [data, ...prev]);
        setUser({ ...user, vendor: { ...user.vendor, uploaded_count: newCount } });
        toast.success('Product added to shelf!');
      }
      clearForm();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (pid) => setDeleteConfirmId(pid);

  const doDelete = async () => {
    const pid = deleteConfirmId;
    if (!pid) return;
    setDeleteConfirming(true);
    try {
      const { error } = await supabase
        .from('products').delete().eq('id', pid).eq('vendor_id', user.vendor.id);
      if (error) throw error;

      const newCount = Math.max(0, uploadedCount - 1);
      await supabase.from('vendors').update({ uploaded_count: newCount }).eq('id', user.vendor.id);

      setProducts(prev => prev.filter(p => p.id !== pid));
      setUser({ ...user, vendor: { ...user.vendor, uploaded_count: newCount } });
      toast.success('Product removed');
      setDeleteConfirmId(null);
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleteConfirming(false);
    }
  };

  const handleRestock = async (pid) => {
    const qty = parseInt(restockVal);
    if (isNaN(qty) || qty < 0) return toast.error('Enter a valid quantity');
    const { error } = await supabase.from('products').update({ stock: qty }).eq('id', pid).eq('vendor_id', user.vendor.id);
    if (error) { toast.error(error.message); return; }
    setProducts(prev => prev.map(p => p.id === pid ? { ...p, stock: qty } : p));
    setRestockId(null);
    setRestockVal('');
    toast.success('Stock updated');
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleBulkRestock = async (qty) => {
    if (selectedIds.size === 0) return;
    setBulkRestocking(true);
    try {
      const ids = [...selectedIds];
      const { error } = await supabase
        .from('products')
        .update({ stock: qty })
        .in('id', ids)
        .eq('vendor_id', user.vendor.id);
      if (error) throw error;
      setProducts(prev => prev.map(p => selectedIds.has(p.id) ? { ...p, stock: qty } : p));
      setSelectedIds(new Set());
      setSelectionMode(false);
      setBulkRestockVal('');
      const label = qty === -1 ? 'Set to unlimited' : `Restocked to ${qty}`;
      toast.success(`${label} — ${ids.length} product${ids.length > 1 ? 's' : ''} updated`);
    } catch (err) {
      toast.error(err.message || 'Bulk update failed');
    } finally {
      setBulkRestocking(false);
    }
  };

  const startEdit = (product) => {
    setName(product.name);
    setPrice(product.price);
    setStock(product.stock != null && product.stock >= 0 ? String(product.stock) : '');
    setDescription(product.description || '');
    setVariants(Array.isArray(product.variants) && product.variants.length > 0 ? product.variants : []);
    const existingUrls = product.image_urls?.length ? product.image_urls : product.image_url ? [product.image_url] : [];
    setPendingImages(existingUrls.map(url => ({ url, file: null })));
    setEditingId(product.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const inputCls = `w-full px-5 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-slate-800 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500`;

  const getImages = (p) =>
    p?.image_urls?.length ? p.image_urls : p?.image_url ? [p.image_url] : [];

  const openPreview = (p) => { setPreviewProduct(p); setPreviewIndex(0); };

  return (
    <div className="relative min-h-full transition-colors duration-300">
      
      {/* --- AMBIENT BACKGROUND --- */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 dark:from-slate-950 dark:via-slate-950 dark:to-emerald-950/10 transition-colors"></div>
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-200/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-[20%] right-[-5%] w-72 h-72 bg-emerald-200/20 dark:bg-emerald-500/10 rounded-full blur-3xl animate-float-medium"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-80 h-80 bg-amber-100/30 dark:bg-amber-500/10 rounded-full blur-3xl animate-float-fast"></div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto pb-20 px-4 sm:px-6 pt-4">

        {/* --- LEFT: FORM --- */}
        <div className="lg:col-span-1 order-1">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-[2.5rem] border border-white/50 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] lg:sticky lg:top-6 relative overflow-hidden transition-colors">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent opacity-50"></div>

            <h3 className="font-black text-slate-900 dark:text-white text-xl mb-6 tracking-tight flex items-center justify-between transition-colors">
              <span className="flex items-center gap-3">
                <div className={`p-2 rounded-xl shadow-sm transition-colors ${editingId ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'}`}>
                  {editingId ? <Pencil size={18} /> : <Plus size={18} strokeWidth={3} />}
                </div>
                {editingId ? 'Edit Item' : 'Add Item'}
              </span>
              {editingId && (
                <button onClick={clearForm} className="text-[10px] bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full text-slate-500 dark:text-slate-400 font-bold hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                  Cancel
                </button>
              )}
            </h3>

            {/* NORMAL FORM */}
            <div className="space-y-5">
              <div className="space-y-1.5 group">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2 transition-colors group-focus-within:text-emerald-500">Name</label>
                <input maxLength={60} className={inputCls} placeholder="e.g. Red Velvet Cake" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="space-y-1.5 group">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2 transition-colors group-focus-within:text-emerald-500">Price ({pmSymbol})</label>
                <input type="number" min="0" className={inputCls} placeholder="5000" value={price} onChange={e => setPrice(e.target.value)} />
              </div>
              {isPaidUser ? (
                <div className="space-y-1.5 group">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2 transition-colors group-focus-within:text-emerald-500">Stock / Quantity</label>
                  <input type="number" min="0" className={inputCls} placeholder="e.g. 50 (leave empty for unlimited)" value={stock} onChange={e => setStock(e.target.value)} />
                  <p className="text-[9px] text-slate-400 ml-2 font-medium">Set to 0 to show "Out of stock" on storefront</p>
                </div>
              ) : (
                <div className="space-y-1.5 group opacity-60 pointer-events-none">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2 transition-colors">Stock / Quantity <span className="text-amber-500">Pro only</span></label>
                  <div className="relative">
                    <input type="number" disabled className={inputCls} placeholder="Upgrade to Pro to track stock" />
                    <Lock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-500" />
                  </div>
                </div>
              )}
              <div className="space-y-1.5 group">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2 transition-colors group-focus-within:text-emerald-500">Description (Optional)</label>
                <textarea maxLength={250} className={`${inputCls} resize-none h-24`} placeholder="Describe your product..." value={description} onChange={e => setDescription(e.target.value)} />
              </div>

              {isPaidUser && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Variants <span className="text-amber-500 font-normal normal-case">optional</span></label>
                    {variants.length < 3 && (
                      <button onClick={() => setVariants(prev => [...prev, { name: '', options: [''] }])}
                        className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1">
                        <Plus size={12} /> Add group
                      </button>
                    )}
                  </div>
                  {variants.map((group, gi) => (
                    <div key={gi} className="p-3 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="flex items-center gap-2">
                        <input className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none focus:border-emerald-500 transition-all" placeholder="e.g. Color" value={group.name} onChange={e => {
                          const updated = [...variants]; updated[gi] = { ...updated[gi], name: e.target.value }; setVariants(updated);
                        }} />
                        <button onClick={() => { setVariants(prev => prev.filter((_, i) => i !== gi)); }} className="text-red-400 hover:text-red-500 p-1"><X size={14} /></button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {group.options.map((opt, oi) => (
                          <div key={oi} className="flex items-center gap-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <input className="w-20 px-2 py-1.5 text-[10px] font-bold outline-none bg-transparent" placeholder="Option" value={opt} onChange={e => {
                              const updated = [...variants]; updated[gi] = { ...updated[gi], options: updated[gi].options.map((o, i) => i === oi ? e.target.value : o) }; setVariants(updated);
                            }} />
                            <button onClick={() => { setVariants(prev => {
                              const updated = [...prev]; updated[gi] = { ...updated[gi], options: updated[gi].options.filter((_, i) => i !== oi) }; return updated;
                            }); }} className="text-red-300 hover:text-red-500 pr-1"><X size={12} /></button>
                          </div>
                        ))}
                        {group.options.length < 10 && (
                          <button onClick={() => { setVariants(prev => {
                            const updated = [...prev]; updated[gi] = { ...updated[gi], options: [...updated[gi].options, ''] }; return updated;
                          }); }} className="px-2 py-1.5 text-[10px] font-bold text-slate-400 hover:text-emerald-500 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg bg-white/50 dark:bg-slate-900/50">
                            + Add
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── IMAGE UPLOAD ── */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple={isPaidUser}
                accept={isPremiumUser ? 'image/*' : 'image/jpeg,image/jpg,image/png,image/webp'}
                onChange={handleFileSelect}
              />

              {!isPaidUser ? (
                /* FREE — original single big dropzone */
                <div onClick={() => fileInputRef.current?.click()} className={`h-40 border-4 border-dashed rounded-[2rem] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group relative overflow-hidden bg-slate-50 dark:bg-slate-900/50 ${pendingImages[0] ? 'border-emerald-500 dark:border-emerald-500' : 'border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:bg-emerald-50/30 dark:hover:bg-emerald-500/5'}`}>
                  {pendingImages[0] ? (
                    <>
                      <img src={pendingImages[0].url} className="w-full h-full object-cover rounded-[1.7rem] shadow-sm z-10" />
                      <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                        <span className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2"><ImageIcon size={16} /> Change Photo</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center z-10">
                      <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-110 group-hover:bg-emerald-500 transition-all text-slate-400 dark:text-slate-500 group-hover:text-white">
                        <UploadCloud size={20} />
                      </div>
                      <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                        Upload Photo{!editingId && <span className="text-red-500"> *</span>}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                /* PRO / PREMIUM — bulk gallery */
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">
                      Photos{!editingId && <span className="text-red-500"> *</span>}
                    </label>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500">
                      {pendingImages.length}/{maxImages}
                      {isPremiumUser && <span className="ml-1 text-purple-400">· GIF ok</span>}
                    </span>
                  </div>

                  {pendingImages.length === 0 ? (
                    /* Empty — big dropzone that opens multi-select */
                    <div onClick={() => fileInputRef.current?.click()} className="h-40 border-4 border-dashed border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:bg-emerald-50/30 dark:hover:bg-emerald-500/5 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group bg-slate-50 dark:bg-slate-900/50">
                      <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-3 shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-110 group-hover:bg-emerald-500 transition-all text-slate-400 dark:text-slate-500 group-hover:text-white">
                        <UploadCloud size={20} />
                      </div>
                      <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                        Select up to {maxImages} photos at once{!editingId && <span className="text-red-500"> *</span>}
                      </span>
                    </div>
                  ) : (
                    <>
                      {/* Primary large preview */}
                      <div className="relative h-40 rounded-[2rem] overflow-hidden border-2 border-emerald-500 group bg-slate-100 dark:bg-slate-800">
                        <img src={pendingImages[0].url} className="w-full h-full object-cover" />
                        <span className="absolute bottom-2 left-2 text-[8px] font-black text-white bg-emerald-500/90 px-2 py-0.5 rounded-full uppercase tracking-widest">Primary</span>
                        <button onClick={() => setPendingImages(prev => prev.filter((_, i) => i !== 0))}
                          className="absolute top-2 right-2 w-6 h-6 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition">
                          <X size={12} />
                        </button>
                      </div>
                      {/* Thumbnail grid of the rest + add tile */}
                      <div className="grid grid-cols-4 gap-2">
                        {pendingImages.slice(1).map((item, i) => {
                          const idx = i + 1;
                          return (
                            <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 group">
                              <img src={item.url} className="w-full h-full object-cover" />
                              <button onClick={() => setPendingImages(prev => prev.filter((_, j) => j !== idx))}
                                className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <X size={10} />
                              </button>
                            </div>
                          );
                        })}
                        {pendingImages.length < maxImages && (
                          <div onClick={() => fileInputRef.current?.click()}
                            className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/5 flex flex-col items-center justify-center cursor-pointer transition-all group">
                            <Plus size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 transition-colors" />
                            <span className="text-[7px] font-black text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 mt-0.5 uppercase">Add more</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {isPaidUser && !editingId && (
                <div className="pt-2">
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-3">
                    {/* Quick Multi-Add — Pro + Premium */}
                    <button onClick={() => { setMultiRows([EMPTY_ROW()]); setShowMultiAddModal(true); }}
                      className="w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-500/5 transition-all">
                      <Zap size={15} /> Quick Multi-Add
                    </button>
                    {/* CSV Bulk Import — Premium only */}
                    {isPremiumUser ? (
                      <button onClick={() => setShowCsvModal(true)} disabled={csvImporting}
                        className="w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/5 transition-all">
                        <FileUp size={15} /> Bulk Import via CSV
                      </button>
                    ) : (
                      <button disabled
                        className="w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 border-2 border-dashed border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-60 relative">
                        <Lock size={13} className="text-amber-400" /> CSV Import
                        <span className="absolute right-3 text-[9px] font-black text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded-md normal-case tracking-normal">Premium</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              <button onClick={handleSaveProduct} disabled={loading}
                className={`w-full text-white py-4 rounded-2xl font-black shadow-xl transition-all active:scale-95 text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 ${editingId ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' : 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 shadow-emerald-500/20 disabled:opacity-50'}`}>
                {loading ? <Loader2 className="animate-spin" size={18} /> : editingId ? 'Update Product' : 'Launch Product'}
              </button>
            </div>
          </div>
        </div>

        {/* --- RIGHT: PRODUCT LIST --- */}
        <div className="lg:col-span-2 order-2 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto custom-scrollbar pr-1">
          <div className="flex items-center justify-between mb-4 mt-8 lg:mt-0 px-2 transition-colors">
            <div className="flex items-center gap-2">
              <h3 className="font-black text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-[0.2em]">Your Inventory</h3>
              <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-md transition-colors">{products.length}</span>
            </div>
            {isPaidUser && products.length > 0 && (
              <button
                onClick={() => { setSelectionMode(v => !v); setSelectedIds(new Set()); setBulkRestockVal(''); setRestockId(null); setRestockVal(''); }}
                className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${selectionMode ? 'bg-red-100 dark:bg-red-500/10 text-red-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400'}`}>
                {selectionMode ? <><X size={11} /> Cancel</> : <><Package2 size={11} /> Manage Stock</>}
              </button>
            )}
          </div>
          {selectionMode && products.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4 px-2">
              <button
                onClick={() => setSelectedIds(new Set(products.map(p => p.id)))}
                className="text-[10px] font-black text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 px-2.5 py-1.5 rounded-lg transition-all">
                Select All ({products.length})
              </button>
              {products.some(p => p.stock === 0) && (
                <button
                  onClick={() => setSelectedIds(new Set(products.filter(p => p.stock === 0).map(p => p.id)))}
                  className="text-[10px] font-black text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 px-2.5 py-1.5 rounded-lg transition-all">
                  Select Out of Stock ({products.filter(p => p.stock === 0).length})
                </button>
              )}
              {selectedIds.size > 0 && (
                <button
                  onClick={() => setSelectedIds(new Set())}
                  className="text-[10px] font-black text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 px-2.5 py-1.5 rounded-lg transition-all">
                  Deselect All
                </button>
              )}
            </div>
          )}

          {loadingProducts ? (
            <div className="py-24 text-center">
              <Loader2 size={32} className="animate-spin text-emerald-500 mx-auto" />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-10">
              {products.map((p) => (
                <div key={p.id}
                  onClick={() => selectionMode && toggleSelect(p.id)}
                  className={`group bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-4 rounded-[2.5rem] border transition-all duration-500 relative flex flex-col ${selectionMode ? 'cursor-pointer select-none' : 'hover:-translate-y-1'} ${
                    selectionMode && selectedIds.has(p.id)
                      ? 'border-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-500/20 shadow-xl shadow-emerald-500/10'
                      : editingId === p.id
                      ? 'border-amber-400 ring-4 ring-amber-50 dark:ring-amber-500/10 shadow-xl'
                      : 'border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10'
                  }`}>
                  {selectionMode && (
                    <div className={`absolute top-3 left-3 z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedIds.has(p.id)
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'bg-white/90 dark:bg-slate-800 border-slate-300 dark:border-slate-600'
                    }`}>
                      {selectedIds.has(p.id) && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  )}
                  
                  <div
                    onClick={(e) => { if (!selectionMode) { e.stopPropagation(); openPreview(p); } }}
                    className={`aspect-square bg-slate-50 dark:bg-slate-800 rounded-[2rem] overflow-hidden mb-4 relative transition-colors ${!selectionMode ? 'cursor-pointer' : ''}`}>
                    {p.image_url ? (
                      <>
                        <img src={p.image_url} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-200 dark:text-slate-700"><ImageIcon size={40} /></div>
                    )}
                    {getImages(p).length > 1 && (
                      <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg shadow-sm flex items-center gap-1 text-white text-[9px] font-black">
                        <ImageIcon size={10} /> {getImages(p).length}
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2 py-1 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>

                  <div className="px-2 pb-1 flex-1 flex flex-col">
                    <h4 className="font-black text-slate-900 dark:text-white truncate text-base mb-1 transition-colors">{p.name}</h4>
                    {p.description && <p className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-1 mb-4 font-medium transition-colors">{p.description}</p>}
                    
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50 dark:border-slate-800/50 transition-colors">
                      <div className="flex flex-col">
                        <p className="text-emerald-600 dark:text-emerald-400 font-black text-lg transition-colors">{pmSymbol}{Number(p.price).toLocaleString()}</p>
                        {restockId === p.id ? (
                          <div className="flex items-center gap-1">
                            <input type="number" min="0" autoFocus
                              className="w-16 px-2 py-1 text-[9px] font-bold bg-white dark:bg-slate-800 border border-emerald-500 rounded-lg outline-none"
                              value={restockVal} onChange={e => setRestockVal(e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter') handleRestock(p.id); if (e.key === 'Escape') setRestockId(null); }} />
                            <button onClick={() => handleRestock(p.id)} className="text-[9px] font-black text-emerald-600 hover:text-emerald-700 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-1 rounded-lg">✓</button>
                            <button onClick={() => setRestockId(null)} className="text-[9px] text-slate-400 hover:text-slate-600 px-1">✕</button>
                          </div>
                        ) : p.stock >= 0 && (
                          <div className="flex items-center gap-1">
                            <span className={`text-[9px] font-bold ${p.stock === 0 ? 'text-red-500' : 'text-slate-400'}`}>
                              {p.stock === 0 ? 'Out of stock' : `${p.stock} left`}
                            </span>
                            {isPaidUser && !selectionMode && (
                              <button onClick={e => { e.stopPropagation(); setRestockId(p.id); setRestockVal(String(p.stock >= 0 ? p.stock : '')); }}
                                className="text-[9px] text-slate-400 hover:text-emerald-500 font-bold px-1 py-0.5 rounded hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all">
                                Restock
                              </button>
                            )}
                          </div>
                        ) || (isPaidUser && p.stock === -1 && (
                          <div className="flex items-center gap-1">
                            <span className="text-[9px] font-bold text-slate-400">In stock</span>
                          </div>
                        ))}
                      </div>
                      {!selectionMode && (
                        <div className="flex gap-2">
                          <button className="w-9 h-9 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-500 dark:hover:text-amber-400 transition-all border border-slate-100 dark:border-slate-700" onClick={() => startEdit(p)}>
                            <Pencil size={14} />
                          </button>
                          <button className="w-9 h-9 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 transition-all border border-slate-100 dark:border-slate-700" onClick={() => confirmDelete(p.id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm transition-colors">
              <div className="w-20 h-20 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm transition-colors">
                <ShoppingBag size={32} className="text-slate-300 dark:text-slate-600" />
              </div>
              <h4 className="font-black text-slate-900 dark:text-white text-xl mb-2 transition-colors">Your shelf is empty</h4>
              <p className="text-slate-400 dark:text-slate-500 text-sm font-medium transition-colors">Add your first product to start selling.</p>
            </div>
          )}
        </div>

        {/* --- CSV IMPORT MODAL --- */}
        {showCsvModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => { if (!csvImporting) { setShowCsvModal(false); setCsvRows([]); setCsvResult(null); }}}>
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl border border-white/20 dark:border-slate-800 overflow-hidden" onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-lg">Bulk Import Products</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Upload a CSV file with your product list</p>
                </div>
                <button onClick={() => { if (!csvImporting) { setShowCsvModal(false); setCsvRows([]); setCsvResult(null); }}} className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-all">
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto flex-1">
                {!csvResult ? (
                  <>
                    {/* CSV Format guide */}
                    <div className="mb-5 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Required columns</p>
                      <code className="text-xs text-slate-600 dark:text-slate-300 font-mono break-all">
                        name* , price* , description , image_url , stock
                      </code>
                      <p className="text-[10px] text-slate-400 mt-2">Only <strong className="text-slate-600 dark:text-slate-300">name</strong> and <strong className="text-slate-600 dark:text-slate-300">price</strong> are required. Maximum 50 products per import. For a photo gallery, put several image links in <strong className="text-slate-600 dark:text-slate-300">image_url</strong> separated by <strong className="text-slate-600 dark:text-slate-300">|</strong>.</p>
                    </div>

                    {/* File dropzone */}
                    {csvRows.length === 0 ? (
                      <label className="block h-48 border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 dark:hover:bg-emerald-500/5 transition-all">
                        <input type="file" accept=".csv" className="hidden" onChange={e => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          Papa.parse(file, {
                            header: true,
                            skipEmptyLines: true,
                            complete: (results) => {
                              const rows = results.data.slice(0, 50);
                              if (rows.length === 0) return toast.error('CSV file is empty');
                              setCsvRows(rows);
                            },
                            error: () => toast.error('Failed to parse CSV'),
                          });
                        }} />
                        <div className="flex flex-col items-center justify-center h-full text-center px-6">
                          <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-3 shadow-sm border border-slate-100 dark:border-slate-700 text-slate-400">
                            <FileUp size={20} />
                          </div>
                          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Click to select a CSV file</p>
                          <p className="text-[10px] text-slate-400 mt-1">or drag and drop</p>
                        </div>
                      </label>
                    ) : (
                      /* Preview */
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{csvRows.length} product{csvRows.length > 1 ? 's' : ''} found</p>
                          <button onClick={() => { setCsvRows([]); setCsvResult(null); }} className="text-xs text-red-500 hover:text-red-600 font-bold">
                            Choose different file
                          </button>
                        </div>
                        <div className="max-h-56 overflow-y-auto rounded-2xl border border-slate-100 dark:border-slate-800">
                          <table className="w-full text-left text-xs">
                            <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black uppercase tracking-wider">
                              <tr>
                                <th className="p-2">Image</th>
                                <th className="p-2">Name</th>
                                <th className="p-2">Price</th>
                                <th className="p-2">Stock</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                              {csvRows.map((row, i) => (
                                <tr key={i} className="text-slate-700 dark:text-slate-300">
                                  <td className="p-2">
                                    {row.image_url
                                      ? <img src={row.image_url} className="w-8 h-8 object-cover rounded-lg" onError={e => { e.target.style.display = 'none'; }} />
                                      : <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-300"><ImageIcon size={12} /></div>}
                                  </td>
                                  <td className="p-2 font-medium truncate max-w-32">{row.name || <span className="text-red-400 italic">missing</span>}</td>
                                  <td className="p-2">{row.price || <span className="text-red-400 italic">missing</span>}</td>
                                  <td className="p-2">{row.stock || '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Import errors summary */}
                    {csvRows.length > 0 && !csvResult && (
                      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-500/10 rounded-2xl border border-amber-200 dark:border-amber-500/20">
                        <div className="flex items-start gap-2">
                          <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                          <p className="text-[10px] text-amber-700 dark:text-amber-300 font-medium">
                            Products with missing <strong>name</strong> or <strong>price</strong> will be skipped.
                            Existing products with the same name will be updated.
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  /* Result summary */
                  <div className="text-center py-8">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${csvResult.success > 0 ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-500/20 text-red-500'}`}>
                      {csvResult.success > 0 ? <CheckCircle2 size={28} /> : <AlertTriangle size={28} />}
                    </div>
                    <h4 className="font-black text-slate-900 dark:text-white text-lg mb-1">Import Complete</h4>
                    <div className="flex items-center justify-center gap-6 mt-4">
                      <div>
                        <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{csvResult.success}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Imported</p>
                      </div>
                      {csvResult.skipped > 0 && (
                        <div>
                          <p className="text-2xl font-black text-amber-500">{csvResult.skipped}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Skipped</p>
                        </div>
                      )}
                    </div>
                    {csvResult.errors.length > 0 && (
                      <div className="mt-4 text-left max-h-24 overflow-y-auto p-3 bg-red-50 dark:bg-red-500/10 rounded-2xl">
                        {csvResult.errors.map((e, i) => (
                          <p key={i} className="text-[10px] text-red-600 dark:text-red-400 font-medium">• {e}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                {!csvResult ? (
                  <>
                    <button onClick={() => { setShowCsvModal(false); setCsvRows([]); setCsvResult(null); }} disabled={csvImporting}
                      className="flex-1 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-50">
                      Cancel
                    </button>
                    <button onClick={async () => {
                      if (csvRows.length === 0) return;
                      setCsvImporting(true);
                      let success = 0, skipped = 0, errors = [];
                      try {
                        for (const row of csvRows) {
                          if (!row.name || !row.price) { skipped++; continue; }
                          const stockVal = row.stock !== undefined && row.stock !== '' ? Number(row.stock) : -1;
                          const urls = (row.image_url?.trim() || '').split('|').map(u => u.trim()).filter(Boolean);
                          const { error } = await supabase.from('products').insert(
                            { vendor_id: user.vendor.id, name: row.name.trim(), price: Number(row.price), stock: stockVal, description: row.description?.trim() || '', image_url: urls[0] || '', image_urls: urls }
                          );
                          if (error) { errors.push(`${row.name}: ${error.message}`); skipped++; }
                          else success++;
                        }
                        if (success > 0) {
                          const newCount = uploadedCount + success;
                          await supabase.from('vendors').update({ uploaded_count: newCount }).eq('id', user.vendor.id);
                          setUser({ ...user, vendor: { ...user.vendor, uploaded_count: newCount } });
                          fetchProducts();
                        }
                        setCsvResult({ success, skipped, errors });
                      } catch (err) {
                        toast.error('Import failed');
                        setCsvResult({ success, skipped, errors: [...errors, err.message] });
                      } finally {
                        setCsvImporting(false);
                      }
                    }} disabled={csvRows.length === 0 || csvImporting}
                      className="flex-[2] py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-emerald-500/20">
                      {csvImporting ? <Loader2 className="animate-spin" size={16} /> : <UploadCloud size={16} />}
                      {csvImporting ? 'Importing...' : `Import ${csvRows.length > 0 ? `(${csvRows.length})` : ''}`}
                    </button>
                  </>
                ) : (
                  <button onClick={() => { setShowCsvModal(false); setCsvRows([]); setCsvResult(null); }}
                    className="flex-1 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all">
                    Done
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── QUICK MULTI-ADD MODAL ── */}
        {showMultiAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => { if (!multiSaving) setShowMultiAddModal(false); }}>
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-white/20 dark:border-slate-800 overflow-hidden"
              onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-lg flex items-center gap-2">
                    <Zap size={18} className="text-purple-500" fill="currentColor" /> Quick Multi-Add
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Add up to 10 products at once with image URLs</p>
                </div>
                <button onClick={() => setShowMultiAddModal(false)} disabled={multiSaving}
                  className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-all">
                  <X size={16} />
                </button>
              </div>
              {/* Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                {multiRows.map((row, i) => (
                  <div key={i} className="p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="grid grid-cols-[1fr_auto_auto_1fr_auto] gap-2 items-start">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1">Name *</p>
                        <input
                          maxLength={60}
                          className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition-all text-slate-800 dark:text-white placeholder-slate-400"
                          placeholder="Product name"
                          value={row.name}
                          onChange={e => setMultiRows(prev => prev.map((r, idx) => idx === i ? { ...r, name: e.target.value } : r))}
                        />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1">Price *</p>
                        <input
                          type="number" min="0"
                          className="w-28 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition-all text-slate-800 dark:text-white placeholder-slate-400"
                          placeholder={pmSymbol}
                          value={row.price}
                          onChange={e => setMultiRows(prev => prev.map((r, idx) => idx === i ? { ...r, price: e.target.value } : r))}
                        />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1">Stock</p>
                        <input
                          type="number" min="0"
                          className="w-20 px-3 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition-all text-slate-800 dark:text-white placeholder-slate-400"
                          placeholder="--"
                          value={row.stock}
                          onChange={e => setMultiRows(prev => prev.map((r, idx) => idx === i ? { ...r, stock: e.target.value } : r))}
                        />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1">Description</p>
                        <input
                          maxLength={120}
                          className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition-all text-slate-800 dark:text-white placeholder-slate-400"
                          placeholder="Optional description"
                          value={row.description}
                          onChange={e => setMultiRows(prev => prev.map((r, idx) => idx === i ? { ...r, description: e.target.value } : r))}
                        />
                      </div>
                      <button
                        onClick={() => setMultiRows(prev => prev.filter((_, idx) => idx !== i))}
                        disabled={multiRows.length === 1}
                        className="mt-5 w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                        <X size={15} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        id={`multi-file-${i}`}
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 2 * 1024 * 1024) return toast.error('File too large (Max 2MB)');
                            setMultiRows(prev => prev.map((r, idx) => idx === i ? { ...r, imageFile: file, imagePreview: URL.createObjectURL(file) } : r));
                          }
                          e.target.value = '';
                        }}
                      />
                      <label htmlFor={`multi-file-${i}`} className="flex items-center gap-2 cursor-pointer">
                        {row.imagePreview ? (
                          <>
                            <img src={row.imagePreview} className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700" />
                            <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest">Change</span>
                          </>
                        ) : (
                          <>
                            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-500/10 rounded-lg flex items-center justify-center">
                              <UploadCloud size={16} className="text-purple-500" />
                            </div>
                            <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest">Add Photo <span className="text-red-500">*</span></span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                ))}
                {multiRows.length < 10 && (
                  <button
                    onClick={() => setMultiRows(prev => [...prev, EMPTY_ROW()])}
                    className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-xs font-black text-slate-400 hover:border-purple-400 hover:text-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-500/5 transition-all flex items-center justify-center gap-2 mt-2">
                    <Plus size={14} /> Add another row ({multiRows.length}/10)
                  </button>
                )}
              </div>
              {/* Footer */}
              <div className="p-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                <button onClick={() => setShowMultiAddModal(false)} disabled={multiSaving}
                  className="flex-1 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-50">
                  Cancel
                </button>
                <button
                  disabled={multiSaving || multiRows.every(r => !r.name || !r.price)}
                  onClick={async () => {
                    const valid = multiRows.filter(r => r.name.trim() && r.price && r.imageFile);
                    if (valid.length === 0) return toast.error('Each product needs a name, a price, and a photo');
                    const missing = multiRows.filter(r => r.name.trim() && r.price && !r.imageFile);
                    if (missing.length > 0) return toast.error(`${missing.length} row(s) are missing photos`);
                    setMultiSaving(true);
                    try {
                      const inserts = await Promise.all(valid.map(async r => {
                        const url = await uploadImage(r.imageFile);
                        return {
                          vendor_id: user.vendor.id,
                          name: r.name.trim(),
                          price: Number(r.price),
                          description: r.description.trim() || '',
                          stock: r.stock !== '' ? Number(r.stock) : -1,
                          image_url: url,
                          image_urls: [url],
                        };
                      }));
                      const { data, error } = await supabase.from('products').insert(inserts).select();
                      if (error) throw error;
                      const newCount = uploadedCount + valid.length;
                      await supabase.from('vendors').update({ uploaded_count: newCount }).eq('id', user.vendor.id);
                      setProducts(prev => [...(data || []).reverse(), ...prev]);
                      setUser({ ...user, vendor: { ...user.vendor, uploaded_count: newCount } });
                      toast.success(`${valid.length} product${valid.length > 1 ? 's' : ''} added!`);
                      setShowMultiAddModal(false);
                    } catch (err) {
                      toast.error(err.message || 'Failed to add products');
                    } finally {
                      setMultiSaving(false);
                    }
                  }}
                  className="flex-[2] py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest bg-purple-600 hover:bg-purple-700 text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-purple-500/20">
                  {multiSaving ? <Loader2 className="animate-spin" size={16} /> : <Zap size={15} fill="currentColor" />}
                  {multiSaving ? 'Saving...' : `Add ${multiRows.filter(r => r.name && r.price).length || 'All'} to Shelf`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── INVENTORY PREVIEW MODAL ── */}
        {previewProduct && (() => {
          const imgs = getImages(previewProduct);
          const hasMany = imgs.length > 1;
          const cur = imgs[previewIndex] ?? null;
          return (
            <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center sm:p-4 bg-slate-900/80 backdrop-blur-md" onClick={() => setPreviewProduct(null)}>
              <div className="relative bg-white dark:bg-slate-900 w-full sm:w-[95vw] sm:max-w-4xl rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[92vh] lg:max-h-[85vh]" onClick={e => e.stopPropagation()}>
                {/* Close button — top of whole modal */}
                <button onClick={() => setPreviewProduct(null)} className="absolute top-3 right-3 z-20 p-2 bg-black/40 text-white backdrop-blur-md rounded-full hover:bg-black/60 transition active:scale-95">
                  <X size={18} />
                </button>
                {/* IMAGE PANEL */}
                <div className="relative lg:w-1/2 flex-shrink-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center" style={{ minHeight: '40vh' }}>
                  {cur
                    ? <img src={cur} className="w-full h-full object-contain max-h-[55vh] lg:max-h-[85vh]" alt={previewProduct.name} />
                    : <div className="py-24 text-slate-300"><ImageIcon size={48} /></div>}
                  {hasMany && (
                    <>
                      <button onClick={() => setPreviewIndex(i => (i - 1 + imgs.length) % imgs.length)} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-white backdrop-blur-md rounded-full hover:bg-black/60 transition active:scale-90"><ChevronLeft size={18} /></button>
                      <button onClick={() => setPreviewIndex(i => (i + 1) % imgs.length)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-white backdrop-blur-md rounded-full hover:bg-black/60 transition active:scale-90"><ChevronRight size={18} /></button>
                      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                        {imgs.map((_, i) => (
                          <button key={i} onClick={() => setPreviewIndex(i)} className={`rounded-full transition-all ${i === previewIndex ? 'bg-white w-5 h-2' : 'bg-white/50 w-2 h-2'}`} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
                {/* DETAILS PANEL */}
                <div className="lg:w-1/2 flex flex-col overflow-y-auto p-6 sm:p-8">
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{previewProduct.name}</h2>
                    <span className="text-lg font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-lg flex-shrink-0">{pmSymbol}{Number(previewProduct.price).toLocaleString()}</span>
                  </div>
                  {isPaidUser && previewProduct.stock >= 0 && (
                    <p className={`text-[11px] font-bold mb-4 ${previewProduct.stock === 0 ? 'text-red-500' : 'text-slate-400'}`}>
                      {previewProduct.stock === 0 ? 'Out of stock' : `${previewProduct.stock} in stock`}
                    </p>
                  )}
                  {previewProduct.description && (
                    <p className="text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400 mb-5">{previewProduct.description}</p>
                  )}
                  {Array.isArray(previewProduct.variants) && previewProduct.variants.length > 0 && (
                    <div className="space-y-3 mb-6">
                      {previewProduct.variants.map((group, gi) => (
                        <div key={gi}>
                          <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-slate-400 dark:text-slate-500">{group.name}</p>
                          <div className="flex flex-wrap gap-2">
                            {group.options.filter(o => o.trim()).map((opt, oi) => {
                              const c = resolveColor(opt);
                              return (
                                <span key={oi} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                                  {c && <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: c }} />}
                                  {opt}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-3 mt-auto pt-4">
                    <button onClick={() => { const p = previewProduct; setPreviewProduct(null); startEdit(p); }}
                      className="flex-1 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest bg-amber-500 hover:bg-amber-600 text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20">
                      <Pencil size={14} /> Edit
                    </button>
                    <button onClick={() => { const id = previewProduct.id; setPreviewProduct(null); confirmDelete(id); }}
                      className="px-5 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all flex items-center justify-center gap-2">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── BULK RESTOCK ACTION BAR ── */}
        {selectionMode && selectedIds.size > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-slate-900 dark:bg-slate-100 pl-4 pr-3 py-2.5 rounded-2xl shadow-2xl shadow-black/30 border border-white/10 dark:border-slate-200 whitespace-nowrap">
            <span className="text-xs font-black text-white dark:text-slate-900">{selectedIds.size} selected</span>
            <div className="w-px h-4 bg-white/20 dark:bg-slate-400/30" />
            <button
              onClick={() => handleBulkRestock(-1)}
              disabled={bulkRestocking}
              className="text-[11px] font-black text-emerald-400 dark:text-emerald-600 hover:text-emerald-300 dark:hover:text-emerald-500 disabled:opacity-50 transition-colors">
              ∞ Unlimited
            </button>
            <div className="w-px h-4 bg-white/20 dark:bg-slate-400/30" />
            <div className="flex items-center gap-1.5">
              <input
                type="number" min="0"
                placeholder="Qty"
                value={bulkRestockVal}
                onChange={e => setBulkRestockVal(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    const q = parseInt(bulkRestockVal);
                    if (!isNaN(q) && q >= 0) handleBulkRestock(q);
                    else toast.error('Enter a valid quantity (0 or more)');
                  }
                }}
                className="w-16 px-2 py-1.5 rounded-lg text-xs font-bold bg-white/10 dark:bg-slate-900/10 outline-none border border-white/20 dark:border-slate-300 text-white dark:text-slate-900 placeholder-white/40 dark:placeholder-slate-400 focus:border-emerald-500 transition-colors"
              />
              <button
                onClick={() => {
                  const q = parseInt(bulkRestockVal);
                  if (!isNaN(q) && q >= 0) handleBulkRestock(q);
                  else toast.error('Enter a valid quantity (0 or more)');
                }}
                disabled={bulkRestocking}
                className="text-[11px] font-black bg-emerald-500 hover:bg-emerald-400 text-white px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 flex items-center gap-1">
                {bulkRestocking && <Loader2 size={11} className="animate-spin" />}
                Restock
              </button>
            </div>
          </div>
        )}

        {/* ── DELETE CONFIRMATION MODAL ── */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => !deleteConfirming && setDeleteConfirmId(null)}>
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 max-w-xs w-full shadow-2xl text-center relative overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800" onClick={e => e.stopPropagation()}>
              <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500 rounded-t-full" />
              <div className="w-14 h-14 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-5 border border-red-100 dark:border-red-500/20">
                <Trash2 size={24} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Delete Product?</h3>
              <p className="text-sm text-slate-400 font-medium mb-7">This will permanently remove the product from your store. This cannot be undone.</p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={doDelete}
                  disabled={deleteConfirming}
                  className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.15em] shadow-lg shadow-red-500/20 transition active:scale-95"
                >
                  {deleteConfirming ? 'Deleting...' : 'Yes, Delete'}
                </button>
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  disabled={deleteConfirming}
                  className="w-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes float-slow { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(20px, 30px); } }
          @keyframes float-medium { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-20px, 20px); } }
          @keyframes float-fast { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(10px, -20px); } }
          .animate-float-slow { animation: float-slow 12s infinite ease-in-out; }
          .animate-float-medium { animation: float-medium 10s infinite ease-in-out; }
          .animate-float-fast { animation: float-fast 8s infinite ease-in-out; }
        `}</style>
      </div>
    </div>
  );
}