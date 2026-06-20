import { Link } from "react-router-dom";
import { Flag } from "lucide-react";
// Make sure to import your logo properly based on your file structure
import shopLink_logo from "../assets/logo.png"; // Update path if needed

export default function Footer({ className = "" }) {
  // Structured link data with actual route paths
  const footerLinks = {
    product: [
      { name: "Features", path: "/features" },
      { name: "How it Works", path: "/how-it-works" },
      { name: "Pricing", path: "/pricing" },
      { name: "WhatsApp Integration", path: "/whatsapp-integration" },
    ],
    company: [
      { name: "About Us", path: "/about" },
      { name: "Contact", path: "/contact" }, 
      // { name: "Blog", path: "/blog" },
    ],
    resources: [
      { name: "Support", path: "/support" }, 
      { name: "Vendor Community", path: "/community" },
      { name: "Terms of Service", path: "/terms" }, 
      { name: "Privacy Policy", path: "/privacy" }, 
    ],
  };

  // Custom SVGs with exact brand background colors
  const socials = [
    {
      name: "X",
      link: "https://x.com/ShopLink_vi",
      bgClass: "bg-black dark:bg-white hover:opacity-80",
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white dark:fill-black">
          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      link: "https://www.instagram.com/shoplink.vi",
      bgClass:
        "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-80",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ),
    },
    {
      name: "TikTok",
      link: "https://www.tiktok.com/@shoplink.vi",
      bgClass: "bg-black dark:bg-white hover:opacity-80",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white dark:fill-black">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.1z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      link: "https://youtube.com/@ShopLink_vi",
      bgClass: "bg-[#FF0000] hover:opacity-80",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
  ];

  return (
    <footer
      className={`bg-white dark:bg-[#0a0f1c] border-t border-slate-100 dark:border-slate-800/60 pb-10 mt-auto transition-colors duration-300 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* --- TOP SECTION: Brand & Columns --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16 pt-12">
          {/* Left: Brand, Description, Socials */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link
              to="/"
              className="flex items-center gap-3 mb-6 group outline-none"
            >
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
                <img
                  src={shopLink_logo}
                  className="w-6 h-6 brightness-0 invert"
                  alt="ShopLink"
                />
              </div>
              <span className="font-black text-2xl tracking-tighter uppercase italic text-slate-900 dark:text-white">
                ShopLink<span className="text-emerald-500 not-italic">.vi</span>
              </span>
            </Link>

            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-8 max-w-xs pr-4">
              The ultimate platform for vendors to build, manage, and scale
              their WhatsApp storefronts instantly.
            </p>

            {/* Added Socials Header Here */}
            <div className="mb-4">
              <h4 className="font-black text-slate-900 dark:text-white text-sm tracking-tight">
                Follow us on our socials
              </h4>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {socials.map((social, idx) => (
                <a
                  key={idx}
                  href={social.link}
                  target="_blank"
                  rel="noreferrer"
                  title={social.name}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 active:scale-95 outline-none shadow-sm ${social.bgClass}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Right: The 3 Link Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-10">
            {/* Column 1: Product */}
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-base mb-6 tracking-tight">
                Product
              </h3>
              <ul className="space-y-4">
                {footerLinks.product.map((item, i) => (
                  <li key={i}>
                    <Link
                      to={item.path}
                      className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors outline-none"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Company */}
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-base mb-6 tracking-tight">
                Company
              </h3>
              <ul className="space-y-4">
                {footerLinks.company.map((item, i) => (
                  <li key={i}>
                    <Link
                      to={item.path}
                      className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors outline-none"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-base mb-6 tracking-tight">
                Resources
              </h3>
              <ul className="space-y-4">
                {footerLinks.resources.map((item, i) => (
                  <li key={i}>
                    <Link
                      to={item.path}
                      className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors outline-none"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION: Copyright & Flag --- */}
        <div className="border-t border-slate-100 dark:border-slate-800/60 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <Flag size={14} className="text-emerald-500" />{" "}
            {new Date().getFullYear()} ShopLink.vi — Made in Nigeria
          </p>

          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs font-bold bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-800">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}