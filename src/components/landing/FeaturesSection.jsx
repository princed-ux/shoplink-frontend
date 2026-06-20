import { ShoppingBag, Globe, MessageCircle, Zap, ShieldCheck, Smartphone } from 'lucide-react';

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-4">Why ShopLink?</h2>
          <h2 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter mb-6">More than just a link.</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">We built the tool Nigerian vendors actually need.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              icon: <Zap size={28} />, 
              title: "Instant Setup", 
              desc: "No technical skills needed. Create your store in 2 minutes flat." 
            },
            { 
              icon: <MessageCircle size={28} />, 
              title: "WhatsApp Checkout", 
              desc: "Orders come into your DM as a perfectly formatted receipt." 
            },
            { 
              icon: <ShieldCheck size={28} />, 
              title: "No Hidden Fees", 
              desc: "We don't touch your money. Customers pay you directly." 
            },
            { 
              icon: <Globe size={28} />, 
              title: "Custom Domain", 
              desc: "Get a professional shop.vi/yourname link for your bio." 
            },
            { 
              // --- CHANGED THIS SECTION ---
              icon: <Smartphone size={28} />, 
              title: "Mobile First", 
              desc: "Your store looks perfect on every phone. Fast, clean, and easy for customers." 
            },
            { 
              icon: <ShoppingBag size={28} />, 
              title: "Inventory Mgmt", 
              desc: "Easily toggle items in or out of stock with one tap." 
            }
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm text-emerald-600 group-hover:scale-110 transition-transform border border-slate-100">
                {feature.icon}
              </div>
              <h3 className="text-xl font-black mb-3 text-slate-900 tracking-tight">{feature.title}</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}