import { useState, useRef } from "react";
import { Mail, Send, Phone, MapPin, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import Footer from "../components/Footer";

const WhatsAppIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      return toast.error("Please fill in all fields");
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
          subject: `ShopLinkVi Contact: ${formData.subject}`,
          message: formData.message,
          from_name: "ShopLinkVi Contact Form",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setFormData({ name: "", email: "", subject: "", message: "" });
        toast.success("Message sent successfully! We'll get back to you soon.");
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-700 dark:to-emerald-900 py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute -bottom-8 right-1/4 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter mb-6">
            Get in Touch
          </h1>
          <p className="text-lg sm:text-xl text-white/90 font-medium max-w-2xl mx-auto">
            Have a question or suggestion? We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-6">
                Contact Info
              </h2>
              <p className="text-slate-600 dark:text-slate-400 font-medium text-sm leading-relaxed mb-8">
                Reach out through any of these channels.
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex gap-4 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center">
                  <Mail size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-widest">
                    Email
                  </p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-bold">
                    <a href="mailto:support@shoplinkvi.com">
                      support@shoplinkvi.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-5 rounded-2xl bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
                  <WhatsAppIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-widest">
                    WhatsApp
                  </p>
                  <p className="text-green-600 dark:text-green-400 font-bold">
                    <a
                      href="https://wa.me/2347000000000"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      +234 700 000 0000
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-5 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                  <MapPin size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-widest">
                    Location
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 font-bold">
                    Lagos, Nigeria
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-5 bg-slate-50 dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg"
          >
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mb-6">
              Send Message
            </h3>

            <div>
              <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-sm focus:border-emerald-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-sm focus:border-emerald-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What is this about?"
                className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-sm focus:border-emerald-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us how we can help..."
                rows="5"
                className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-sm focus:border-emerald-500 outline-none transition-all resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-sm rounded-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
            >
              <Send size={16} />
              {isSubmitting ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
