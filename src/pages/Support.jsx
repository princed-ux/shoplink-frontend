import { useState, useEffect, useRef } from 'react';
import { 
  HelpCircle, Menu, X, ChevronDown, Mail, Send, ArrowRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Footer from '../components/Footer';

// Official WhatsApp SVG Icon
const WhatsAppIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

const SUPPORT_CATEGORIES = [
  "Payment & Billing",
  "Account Access & Suspension",
  "Storefront & Domains",
  "Technical Bug / Glitch",
  "Feature Request",
  "General Inquiry"
];

export default function Support() {
  const [user, setUser] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    category: '', 
    message: '' 
  });

  // Ref for the dropdown container — used to detect outside clicks
  const dropdownRef = useRef(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('sb-xofnbiypfsjyfdwrkgam-auth-token');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed?.user) setUser(parsed.user);
      } catch (e) {}
    }
  }, []);

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

  const faqs = [
    { q: "How do I receive payments?", a: "ShopLink generates professional order receipts. Customers send these to your WhatsApp, where you can share your bank details or payment links to finalize the transaction." },
    { q: "Is ShopLink actually free?", a: "Yes! We are currently in our growth phase. You can list unlimited products and handle unlimited orders for free while we scale the platform." },
    { q: "Can I use my own domain?", a: "Currently, we provide high-authority shop.vi/yourname links. These are optimized for fast loading and look great in social media bios." }
  ];

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
          access_key: "761fea19-1274-4563-b404-00985d84532d", 
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
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] font-sans text-slate-900 dark:text-slate-200 overflow-x-hidden transition-colors duration-300 relative">

      <main className="max-w-5xl mx-auto px-6 pt-40 pb-20 text-center relative z-10">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold tracking-widest uppercase mb-10">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          Support Center
        </div>

        <h1 className="text-6xl lg:text-8xl font-black tracking-tighter mb-8 text-slate-900 dark:text-white transition-colors">
          We are here to <span className="text-emerald-600 dark:text-emerald-500 italic">help.</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xl font-medium mb-20 max-w-2xl mx-auto leading-relaxed transition-colors">
          Get fast, direct support from the team building your infrastructure. 
        </p>

        {/* Contact Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-32">
          
          <a 
            href="https://wa.me/2349043394263" 
            target="_blank" 
            rel="noreferrer"
            className="group p-12 rounded-[2rem] md:rounded-[3rem] bg-[#25D366] text-white hover:bg-[#20bd5a] transition-all shadow-[0_20px_60px_-15px_rgba(37,211,102,0.4)] flex flex-col items-center gap-6 active:scale-[0.98]"
          >
            <div className="w-24 h-24 bg-white/20 rounded-[2rem] flex items-center justify-center group-hover:scale-110 transition-transform backdrop-blur-md">
                <WhatsAppIcon className="w-12 h-12 text-white" />
            </div>
            <div>
              <h3 className="text-4xl font-black tracking-tight mb-2">Live Chat</h3>
              <p className="font-bold text-emerald-50 opacity-90 text-sm">Fastest Response Time</p>
            </div>
          </a>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full group p-12 rounded-[2rem] md:rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-none flex flex-col items-center gap-6 active:scale-[0.98] outline-none"
          >
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-[2rem] flex items-center justify-center group-hover:scale-110 transition-transform border border-slate-100 dark:border-slate-700">
                <Mail size={40} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-4xl font-black tracking-tight mb-2">Email Us</h3>
              <p className="font-bold text-slate-500 dark:text-slate-400 text-sm">support@shoplinkvi.com</p>
            </div>
          </button>
        </div>

        {/* --- FAQ SECTION --- */}
        <section className="text-left bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-8 md:p-10 lg:p-16 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-8 md:mb-12 text-slate-900 dark:text-white">
                Frequently Asked
            </h2>
            <div className="space-y-2">
                {faqs.map((faq, i) => (
                    <div key={i} className="border-b border-slate-100 dark:border-slate-800/80 last:border-0">
                        <button 
                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                            className="w-full py-6 md:py-8 flex items-center justify-between text-left group outline-none"
                        >
                            <span className="font-bold text-base md:text-lg text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors pr-6">{faq.q}</span>
                            <ChevronDown size={24} className={`flex-shrink-0 text-slate-300 dark:text-slate-600 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-emerald-500' : ''}`} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40 pb-6 md:pb-8' : 'max-h-0'}`}>
                            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed font-medium">{faq.a}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
      </main>

      {/* ─── PROPERLY SIZED CONTACT FORM MODAL ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">

          {/* Standard Wide Wrapper: Fits mobile cleanly, expands nicely on desktop but not too massive */}
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
                      className="w-full bg-slate-50 dark:bg-slate-900/80 rounded-2xl md:rounded-[1.5rem] px-5 py-4 text-base md:text-lg font-bold text-slate-900 dark:text-white border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all shadow-inner"
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
                      className="w-full bg-slate-50 dark:bg-slate-900/80 rounded-2xl md:rounded-[1.5rem] px-5 py-4 text-base md:text-lg font-bold text-slate-900 dark:text-white border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all shadow-inner"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                {/* Custom UI Dropdown — Working perfectly, just styled for mobile */}
                <div className="relative" ref={dropdownRef}>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 md:mb-3">Support Category</label>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-full flex items-center justify-between rounded-2xl md:rounded-[1.5rem] px-5 py-4 text-base md:text-lg font-bold transition-all shadow-inner border outline-none ${
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
                    <div className="absolute top-full left-0 w-full mt-2 md:mt-3 bg-white dark:bg-slate-800 rounded-2xl md:rounded-[1.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-slate-700 overflow-hidden z-50">
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
                    className="w-full h-full min-h-[120px] md:min-h-[160px] bg-slate-50 dark:bg-slate-900/80 rounded-2xl md:rounded-[1.5rem] px-5 py-4 text-base md:text-lg font-bold text-slate-900 dark:text-white border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 outline-none resize-none transition-all shadow-inner"
                    placeholder="Tell us exactly what you need..."
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 md:py-5 mt-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-2xl md:rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3 outline-none shadow-xl"
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

      <Footer className="pt-[100px]" />
    </div>
  );
}