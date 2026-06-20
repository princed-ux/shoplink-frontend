// src/components/PublicNavbar.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard, ArrowRight } from 'lucide-react';
import shopLink_logo from "../assets/logo.png";

export default function PublicNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  // Get the current URL path
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('sb-xofnbiypfsjyfdwrkgam-auth-token');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed?.user) setUser(parsed.user);
      } catch (e) {}
    }
  }, []);

  // Centralized navigation links for easy updating
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/pricing', label: 'Pricing' },
    { path: '/contact', label: 'Contact' },
    { path: '/support', label: 'Support' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:rotate-6 transition-all duration-300">
              <img src={shopLink_logo} alt="ShopLink" className="w-6 h-6 object-contain brightness-0 invert" />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
              ShopLink<span className="text-emerald-500 not-italic">.vi</span>
            </span>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xs font-black uppercase tracking-widest transition-colors ${
                    isActive
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : link.highlight
                      ? 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300'
                      : 'text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            
            {/* Desktop Auth Buttons */}
            {user ? (
              <Link to="/dashboard" className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.15em] hover:bg-emerald-500 dark:hover:bg-emerald-400 dark:hover:text-slate-900 transition shadow-xl flex items-center gap-2 ml-2">
                <LayoutDashboard size={15} /> Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition ml-2">Log in</Link>
                <Link to="/register" className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.15em] hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/25 flex items-center gap-2 hover:-translate-y-0.5">
                  Start Free <ArrowRight size={15} strokeWidth={3} />
                </Link>
              </>
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button className="md:hidden p-2 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 p-8 flex flex-col gap-6 shadow-2xl animate-in slide-in-from-top-4">
            
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className={`text-sm font-black uppercase tracking-widest ${
                    isActive 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-slate-700 dark:text-slate-300'
                  }`} 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}

            <hr className="border-slate-100 dark:border-slate-800 my-2" />
            
            {/* Mobile Auth Buttons */}
            {user ? (
              <Link to="/dashboard" className="bg-slate-900 dark:bg-emerald-500 dark:text-white text-white py-4 rounded-2xl font-black text-center text-xs uppercase tracking-widest shadow-lg flex items-center justify-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                <LayoutDashboard size={15} /> Dashboard
              </Link>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to="/login" className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white text-center py-2" onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
                <Link to="/register" className="bg-emerald-500 text-white py-4 rounded-2xl font-black text-center text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                  Start Free <ArrowRight size={15} strokeWidth={3} />
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
}