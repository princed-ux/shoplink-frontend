import { useState, useEffect, useRef } from 'react';
import { 
  ChevronDown, Mail, ExternalLink, BookOpen, Zap, ShoppingBag, 
  Link as LinkIcon, Settings, HelpCircle, Search, Camera, 
  PenTool, TrendingUp, Smartphone, Loader2, Sparkles, X, Send, ArrowRight
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import { toast } from 'react-hot-toast';

// --- CUSTOM WHATSAPP ICON ---
function WhatsAppIcon({ size = 24, color = "currentColor", className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

const SUPPORT_CATEGORIES = [
  "Payment & Billing",
  "Account Access & Suspension",
  "Storefront & Domains",
  "Technical Bug / Glitch",
  "Feature Request",
  "General Inquiry"
];

const FAQS = [
  {
    category: 'Getting Started',
    icon: Zap,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    border: 'border-emerald-100 dark:border-emerald-500/20',
    items: [
      { q: 'How do I share my store?', a: 'Go to Share Store in your dashboard. Copy your shop.vi link and paste it in your Instagram bio, WhatsApp Status, TikTok bio, or anywhere you want. Customers click the link and can browse your store and order.' },
      { q: 'How do customers place orders?', a: 'Customers browse your store, add items they want, then tap "Order on WhatsApp". Their order is automatically formatted and sent to your WhatsApp number as a message — ready for you to confirm.' },
      { q: 'Is ShopLink really free?', a: 'Yes — completely free. No credit card, no hidden fees, no expiry. Create your store, upload products, and receive orders at zero cost.' },
    ]
  },
  {
    category: 'Products',
    icon: ShoppingBag,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    border: 'border-blue-100 dark:border-blue-500/20',
    items: [
      { q: 'How many products can I add?', a: 'Unlimited. There is no product cap on your store. Add as many items as your business needs.' },
      { q: 'What image size should I use?', a: 'Use square images (1:1 ratio) for the best look. Minimum 500x500px, maximum 3MB file size. JPG, PNG and WEBP are all supported.' },
      { q: 'Can I edit a product after uploading?', a: 'Yes. Go to Inventory, find the product, tap the edit (pencil) icon, make your changes and save. Updates are live instantly.' },
    ]
  },
  {
    category: 'Store & Link',
    icon: LinkIcon,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-500/10',
    border: 'border-purple-100 dark:border-purple-500/20',
    items: [
      { q: 'Can I change my store link?', a: 'Your shop.vi/slug is permanent once chosen. This is by design — changing it would break any links you\'ve already shared. Choose a good one from the start!' },
      { q: 'Can I change my shop name?', a: 'Yes. Go to Branding in your dashboard, update your shop name and save. Your link stays the same.' },
      { q: 'Can I add a logo?', a: 'Yes. Go to Branding → upload your logo. It appears on your store and in the dashboard.' },
    ]
  },
  {
    category: 'Account',
    icon: Settings,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    border: 'border-amber-100 dark:border-amber-500/20',
    items: [
      { q: 'How do I change my WhatsApp number?', a: 'Go to Account Settings → WhatsApp Number → enter your new number and save. Orders will immediately start going to the new number.' },
      { q: 'How do I delete my account?', a: 'Go to Account Settings → scroll to Danger Zone → Delete Account. Enter your password to confirm. This is permanent and cannot be undone.' },
      { q: 'I signed in with Google — can I change my email?', a: 'Your email is managed by your Google account. To change it, update it in your Google account settings. Your ShopLink login will reflect the change automatically.' },
    ]
  },
];

const GUIDES = [
  { icon: Camera, title: 'Take better product photos', desc: 'Natural light, clean background, multiple angles.' },
  { icon: PenTool, title: 'Write product descriptions that sell', desc: 'Include size, material, colour and what makes it special.' },
  { icon: TrendingUp, title: 'Grow your store on Instagram', desc: 'Post daily Stories with your link in bio strategy.' },
  { icon: Smartphone, title: 'Handle WhatsApp orders like a pro', desc: 'Quick replies, payment confirmation, delivery updates.' },
];

export default function HelpCenter({ user }) {
  const [openFaq, setOpenFaq] = useState(null);
  
  // AI Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [aiResponse, setAiResponse] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    category: '', 
    message: '' 
  });
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside of it
  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const handleAISearch = async (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (!searchQuery.trim()) return;
      
      setIsSearching(true);
      setAiResponse('');

      try {
        const { data, error } = await supabase.functions.invoke('chat-vi-ai', {
          body: { query: searchQuery }
        });

        if (error) throw error;
        if (data?.error) throw new Error(data.error);

        setAiResponse(data.answer);

      } catch (error) {
        console.error("Vi AI Error:", error);
        setAiResponse("Network error. Please check your connection or reach out to support.");
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.category || !formData.message) {
      return toast.error("Please fill in all fields and select a category.");
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "e3a027ea-2dec-4524-bd70-191712f776b1", // Updated Key
          name: formData.name,
          email: formData.email,
          subject: `ShopLinkVi Ticket: [${formData.category}] from ${formData.name}`,
          message: formData.message,
          from_name: "ShopLinkVi Contact Form",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsModalOpen(false);
        setFormData({ name: '', email: '', category: '', message: '' });
        toast.success("Message sent! Check your email shortly.");
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      toast.error("Network error. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 pt-6 space-y-10 transition-colors duration-300">

      {/* --- Header & AI Search --- */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 transition-colors">
          Help Center
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-base mb-8 transition-colors">
          Answers, guides and support — all in one place.
        </p>

        {/* Integrated Vi AI Search */}
        <div className="max-w-2xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-[2rem] blur opacity-10 group-focus-within:opacity-30 transition duration-500" />
          <div className="relative">
            <Search className="absolute left-5 top-6 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition-colors group-focus-within:text-emerald-500" size={20} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleAISearch}
              placeholder="Ask anything... (Powered by Vi AI)" 
              className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[1.5rem] py-5 pl-14 pr-[100px] text-base font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none shadow-sm" 
            />
            <button 
              onClick={handleAISearch}
              className="absolute right-3 top-3 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              Ask Vi AI
            </button>
          </div>
          
          {/* AI Response Box */}
          {(isSearching || aiResponse) && (
            <div className="mt-4 p-6 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl text-left transition-all duration-300 animate-in fade-in slide-in-from-top-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">Vi AI Answer</span>
              </div>
              {isSearching ? (
                <div className="flex items-center gap-3 text-emerald-600/70 dark:text-emerald-400/70 font-medium">
                  <Loader2 size={18} className="animate-spin" />
                  Vi AI is thinking...
                </div>
              ) : (
                <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed text-sm md:text-base">
                  {aiResponse}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --- Quick Contact Cards --- */}
      <div className="grid sm:grid-cols-2 gap-5">
        <a
          href="https://wa.me/2349043394263?text=Hi%20ShopLink%20Support%2C%20I%20need%20help%20with..."
          target="_blank" rel="noreferrer"
          className="flex items-center gap-5 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] hover:border-[#25D366] dark:hover:border-[#25D366] hover:shadow-xl hover:shadow-[#25D366]/10 transition-all duration-300 group active:scale-95 outline-none"
        >
          <div className="w-14 h-14 bg-[#25D366]/10 dark:bg-[#25D366]/20 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-[#25D366] group-hover:scale-110 duration-300">
            <WhatsAppIcon size={26} className="text-[#25D366] group-hover:text-white transition-colors" />
          </div>
          <div className="text-left">
            <p className="font-black text-slate-900 dark:text-white text-lg transition-colors">Chat on WhatsApp</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium transition-colors">Fast response from our team</p>
          </div>
          <ExternalLink size={18} className="ml-auto text-slate-300 dark:text-slate-600 group-hover:text-[#25D366] transition-colors" />
        </a>

        {/* TRIGGER MODAL INSTEAD OF MAILTO */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center gap-5 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group active:scale-95 outline-none"
        >
          <div className="w-14 h-14 bg-blue-500/10 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-blue-500 group-hover:scale-110 duration-300">
            <Mail size={24} className="text-blue-500 group-hover:text-white transition-colors" />
          </div>
          <div className="text-left">
            <p className="font-black text-slate-900 dark:text-white text-lg transition-colors">Email Support</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium transition-colors">support@shoplinkvi.com</p>
          </div>
          {/* <ExternalLink size={18} className="ml-auto text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors" /> */}
        </button>
      </div>

      {/* --- Guides Section --- */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 transition-colors duration-300">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
            <BookOpen size={18} className="text-slate-600 dark:text-slate-400" />
          </div>
          <h3 className="font-black text-slate-900 dark:text-white text-xl">Quick Guides</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {GUIDES.map((g, i) => (
            <div key={i} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[1.5rem] hover:bg-emerald-50 dark:hover:bg-emerald-500/10 border border-transparent hover:border-emerald-100 dark:hover:border-emerald-500/20 transition-all duration-300 cursor-default group">
              <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:bg-emerald-500 transition-colors">
                <g.icon size={18} className="text-slate-400 dark:text-slate-500 group-hover:text-white transition-colors" />
              </div>
              <p className="font-black text-slate-900 dark:text-white text-base mb-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{g.title}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{g.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* --- FAQs by Category --- */}
      {FAQS.map((section, si) => (
        <div key={si} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 transition-colors duration-300">
          <div className="flex items-center gap-4 mb-8">
            <div className={`w-12 h-12 ${section.bg} border ${section.border} rounded-2xl flex items-center justify-center transition-colors`}>
              <section.icon size={20} className={section.color} />
            </div>
            <h3 className="font-black text-slate-900 dark:text-white text-xl transition-colors">{section.category}</h3>
          </div>
          
          <div className="space-y-4">
            {section.items.map((faq, fi) => {
              const key = `${si}-${fi}`;
              const isOpen = openFaq === key;
              return (
                <div key={fi} className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen 
                    ? 'border-emerald-500 shadow-md dark:shadow-none' 
                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                }`}>
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : key)}
                    className={`w-full flex items-center justify-between p-5 transition-colors text-left outline-none ${
                      isOpen ? 'bg-white dark:bg-slate-900' : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <span className={`font-black text-sm pr-4 transition-colors ${
                      isOpen ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'
                    }`}>
                      {faq.q}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                      isOpen ? 'bg-emerald-50 dark:bg-emerald-500/20' : 'bg-slate-50 dark:bg-slate-800'
                    }`}>
                      <ChevronDown size={16} className={`transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
                      }`} />
                    </div>
                  </button>
                  
                  <div className={`transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="px-5 pb-5 bg-white dark:bg-slate-900">
                      <div className="h-px w-full bg-slate-100 dark:bg-slate-800 mb-4" />
                      <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* --- Still Stuck Banner --- */}
      <div className="bg-slate-900 dark:bg-slate-950 border border-slate-800 rounded-[2.5rem] p-10 text-center relative overflow-hidden shadow-2xl transition-colors duration-300">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.15)_0%,transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.05]" 
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        
        <div className="relative z-10">
          <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <HelpCircle size={28} className="text-emerald-400" />
          </div>
          <h3 className="font-black text-white text-3xl tracking-tighter mb-4">Still stuck?</h3>
          <p className="text-slate-400 text-base font-medium mb-8 max-w-md mx-auto leading-relaxed">
            We're a small team and we respond fast. Reach out and we'll sort it out together.
          </p>
          <a
            href="https://wa.me/2349043394263?text=Hi%20ShopLink%20Support%2C%20I%20need%20help%20with..."
            target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-emerald-500/20 border border-emerald-400"
          >
            <WhatsAppIcon size={18} /> Message Us on WhatsApp
          </a>
        </div>
      </div>

      {/* ─── CONTACT FORM MODAL ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">

          <div className="bg-white dark:bg-[#0B1120] w-full max-w-[1100px] max-h-[95vh] rounded-[2rem] md:rounded-[3rem] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.6)] relative animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col md:flex-row border border-slate-200/50 dark:border-slate-800/80 z-[105]">
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 md:top-8 md:right-8 p-3 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors outline-none z-50"
            >
              <X size={20} className="md:w-6 md:h-6" />
            </button>

            {/* Left Side: 40% Width (Hidden on Mobile) */}
            <div className="md:w-[40%] p-8 lg:p-16 bg-slate-50 dark:bg-slate-900/40 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-slate-100 dark:border-slate-700">
                  <Mail size={28} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-6 leading-tight">Let's sort it out.</h3>
                <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed pr-4">
                  Fill out the form and our support team will reach out directly to your inbox to resolve your issue.
                </p>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Direct Contact</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">support@shoplinkvi.com</p>
              </div>
            </div>

            {/* Right Side: 60% Width (Form Area) */}
            <div className="w-full md:w-[60%] p-6 sm:p-10 lg:p-16 overflow-y-auto custom-scrollbar relative flex flex-col bg-white dark:bg-[#0B1120]">
              
              <div className="md:hidden mb-6 mt-6">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1">Send a message.</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">support@shoplinkvi.com</p>
              </div>

              <form onSubmit={handleSendEmail} className="flex-grow flex flex-col justify-between space-y-6 md:space-y-8">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 md:mb-3">Your Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-900/80 rounded-[1.5rem] px-5 py-4 text-base md:text-lg font-bold text-slate-900 dark:text-white border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all shadow-inner placeholder-slate-400 dark:placeholder-slate-500"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 md:mb-3">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-900/80 rounded-[1.5rem] px-5 py-4 text-base md:text-lg font-bold text-slate-900 dark:text-white border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all shadow-inner placeholder-slate-400 dark:placeholder-slate-500"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                {/* Custom UI Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 md:mb-3">Support Category</label>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-full flex items-center justify-between rounded-[1.5rem] px-5 py-4 text-base md:text-lg font-bold transition-all shadow-inner border outline-none ${
                      isDropdownOpen 
                        ? 'bg-white dark:bg-slate-900 border-emerald-500 text-slate-900 dark:text-white' 
                        : 'bg-slate-50 dark:bg-slate-900/80 border-transparent text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                    }`}
                  >
                    <span className={formData.category ? '' : 'text-slate-400 dark:text-slate-500 font-medium truncate pr-4'}>
                      {formData.category || "What do you need help with?"}
                    </span>
                    <ChevronDown size={20} className={`text-slate-400 flex-shrink-0 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-emerald-500' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 w-full mt-2 md:mt-3 bg-white dark:bg-slate-800 rounded-[1.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-slate-700 overflow-hidden z-50">
                      {SUPPORT_CATEGORIES.map((cat, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setFormData({ ...formData, category: cat });
                            setIsDropdownOpen(false);
                          }}
                          className="w-full text-left px-5 py-4 md:px-6 md:py-4 text-base md:text-lg font-bold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-white transition-colors border-b border-slate-50 dark:border-slate-700/50 last:border-0 outline-none block"
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex-grow pb-4 md:pb-6">
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 md:mb-3">Message</label>
                  <textarea 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full h-full min-h-[120px] md:min-h-[160px] bg-slate-50 dark:bg-slate-900/80 rounded-[1.5rem] px-5 py-4 text-base md:text-lg font-bold text-slate-900 dark:text-white border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 outline-none resize-none transition-all shadow-inner placeholder-slate-400 dark:placeholder-slate-500"
                    placeholder="Tell us exactly what you need..."
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 md:py-5 mt-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3 outline-none shadow-xl"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-4 border-slate-300 dark:border-slate-600 border-t-current rounded-full animate-spin"></div>
                  ) : (
                    <>Transmit Message <ArrowRight size={20} /></>
                  )}
                </button>
              </form>

            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}