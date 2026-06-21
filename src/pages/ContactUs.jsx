import { useState, useRef, useEffect } from "react";
import { Mail, MapPin, ChevronDown, Send } from "lucide-react";
import { toast } from "react-hot-toast";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet-async";

const WhatsAppIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

const SUBJECTS = [
  "Build an App or Website for Me",
  "Partnership or Collaboration",
  "Press & Media Inquiry",
  "Feedback or Suggestion",
  "General Inquiry",
  "Other",
];

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    if (!isDropdownOpen) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isDropdownOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      return toast.error("Please fill in all fields.");
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "761fea19-1274-4563-b404-00985d84532d",
          name: formData.name,
          email: formData.email,
          subject: `ShopLinkVi Contact: [${formData.subject}] from ${formData.name}`,
          message: formData.message,
          from_name: "ShopLinkVi Contact Form",
        }),
      });
      const result = await res.json();
      if (result.success) {
        setFormData({ name: "", email: "", subject: "", message: "" });
        toast.success("Message sent! We'll get back to you soon.");
      } else {
        toast.error("Failed to send. Please try again.");
      }
    } catch {
      toast.error("Network error. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <Helmet>
        <title>Contact Us — ShopLink.vi</title>
        <meta name="description" content="Get in touch with the ShopLink.vi team." />
      </Helmet>

      {/* Hero banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-700 dark:to-emerald-900 py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute -bottom-8 right-1/4 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-white/90 font-medium max-w-xl mx-auto">
            Have a question or idea? We'd love to hear from you.
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* Left — Contact info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-3">
                Contact Info
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed">
                Reach out through any of these channels and we'll respond within 24 hours.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center">
                  <Mail size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-widest mb-1">Email</p>
                  <a href="mailto:contact@shoplinkvi.com" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                    contact@shoplinkvi.com
                  </a>
                </div>
              </div>

              <div className="flex gap-4 p-5 rounded-2xl bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
                  <WhatsAppIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-widest mb-1">WhatsApp</p>
                  <a
                    href="https://wa.me/2349043394263?text=Hi%20ShopLink%2C%20I%20want%20to%20get%20in%20touch..."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 dark:text-green-400 font-bold hover:underline"
                  >
                    +234 904 339 4263
                  </a>
                </div>
              </div>

              <div className="flex gap-4 p-5 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                  <MapPin size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-widest mb-1">Location</p>
                  <p className="text-slate-600 dark:text-slate-300 font-bold">Lagos, Nigeria</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5 bg-slate-50 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-[0_8px_40px_-8px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.5)]"
          >
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">
              Send a Message
            </h3>

            <div>
              <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your Name"
                className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:border-emerald-500 dark:focus:border-emerald-500 outline-none transition-all shadow-sm focus:shadow-[0_0_0_4px_rgba(16,185,129,0.1)]"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:border-emerald-500 dark:focus:border-emerald-500 outline-none transition-all shadow-sm focus:shadow-[0_0_0_4px_rgba(16,185,129,0.1)]"
              />
            </div>

            {/* Subject dropdown */}
            <div className="relative" ref={dropdownRef}>
              <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Subject</label>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 font-bold text-sm transition-all shadow-sm outline-none ${
                  isDropdownOpen
                    ? "bg-white dark:bg-slate-800 border-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.1)]"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                <span className={formData.subject ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500 font-medium"}>
                  {formData.subject || "What is this about?"}
                </span>
                <ChevronDown size={18} className={`flex-shrink-0 transition-transform duration-200 ${isDropdownOpen ? "rotate-180 text-emerald-500" : "text-slate-400"}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_20px_40px_-8px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_40px_-8px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                  {SUBJECTS.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setFormData({ ...formData, subject: s });
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-5 py-3.5 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-white transition-colors border-b border-slate-100 dark:border-slate-700/50 last:border-0 outline-none"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Message</label>
              <textarea
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us how we can help..."
                className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:border-emerald-500 dark:focus:border-emerald-500 outline-none transition-all resize-none shadow-sm focus:shadow-[0_0_0_4px_rgba(16,185,129,0.1)]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-sm rounded-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
            >
              <Send size={16} />
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
