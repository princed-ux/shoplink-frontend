import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { ThemeProvider } from './context/ThemeContext';
import { toast, Toaster } from 'react-hot-toast';

import LandingPage     from './pages/LandingPage';
import Login           from './pages/Login';
import Register        from './pages/Register';
import ForgotPassword  from './pages/ForgotPassword';
import Onboarding      from './pages/Onboarding';

import DashboardLayout   from './layouts/DashboardLayout';
import DashboardOverview from './pages/DashboardOverview';
import ProductManager    from './pages/ProductManager';
import BrandSettings     from './pages/BrandSettings';
import Analytics         from './pages/Analytics';
import ShareStore        from './pages/ShareStore';
import Orders            from './pages/Orders';
import StaffManager      from './pages/StaffManager';
import DomainManager     from './pages/DomainManager';
import AccountSettings   from './pages/AccountSettings';
import HelpCenter        from './pages/HelpCenter';
import BillingSettings   from './pages/BillingSettings';

import Storefront        from './pages/Storefront';
import StaffPortal       from './pages/StaffPortal';
import AdminDashboard  from './pages/AdminDashboard';
import Unauthorized    from './pages/Unauthorized';
import NotFound        from './pages/NotFound';

function RootHandler() {
  const host = window.location.hostname;
  const isOwnDomain =
    host === 'shoplinkvi.com' ||
    host.endsWith('.shoplinkvi.com') ||   // www. and any future subdomains
    host === 'localhost' ||
    host.includes('127.0.0.1') ||
    host.endsWith('.netlify.app') ||       // Netlify preview URLs
    host.endsWith('.vercel.app');          // Vercel preview URLs
  if (!isOwnDomain) return <Storefront />;
  return <LandingPage />;
}
import Maintenance     from './pages/Maintenance';
import Suspended       from './pages/Suspended';
import PrivacyPolicy   from './pages/PrivacyPolicy';
import TermsOfService  from './pages/TermsOfService';
import Support         from './pages/Support';
import ContactUs       from './pages/ContactUs';
import About           from './pages/About';
// import Blog            from './pages/Blog';
import WhatsappIntegration from './pages/WhatsappIntegration';
import Features        from './pages/Features';
import PricingPage     from './pages/PricingPage';
import Community       from './pages/Community';
import HowItWorks      from './pages/HowItWorks';
// import BlogPost from './pages/BlogPost';

// ADMIN IMPORTS
import AdminLayout from './pages/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSupport from './pages/admin/AdminSupport';
import SystemHealthView from './pages/admin/SystemHealthView';
import AdminBroadcasts from './pages/admin/AdminBroadcasts';
import AdminSettings from './pages/admin/AdminSettings';
import AdminAudit from './pages/admin/AdminAudit';
import AdminBilling from './pages/admin/AdminBilling';
import AdminGiftUsers from './pages/admin/AdminGiftUsers';

// GLOBAL COMPONENTS
import NetworkHandler  from './components/NetworkHandler';
import ScrollToTop     from './components/ScrollToTop';
import PlatformTracker from './components/PlatformTracker';
import ViChatWidget    from './components/ViChatWidget';
import PublicNavbar    from './components/PublicNavbar';

// ── GLOBAL ERROR SANITIZER (Web) ──
const originalToastError = toast.error;
toast.error = (message, options) => {
  let safeMessage = message;
  
  // Extract string if an Error object was passed by mistake
  const textToCheck = typeof message === 'string' ? message : (message?.message || '');
  const lowerMsg = textToCheck.toLowerCase();

  // Catch ugly Google errors, Supabase fetch errors, timeouts, etc.
  if (
    lowerMsg.includes('network') ||
    lowerMsg.includes('aborted') ||
    lowerMsg.includes('ee_') || 
    lowerMsg.includes('timeout') ||
    lowerMsg.includes('failed to fetch')
  ) {
    safeMessage = 'Unstable Network 📡 Please check your connection and try again.';
  }

  return originalToastError(safeMessage, options);
};
// ────────────────────────────────────────────────────────

// ── THE PUBLIC LAYOUT WRAPPER ──
const PublicLayout = () => {
  return (
    <>
      <PublicNavbar />
      <Outlet />
    </>
  );
};

function AdminPlaceholder({ title, desc }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-in fade-in zoom-in-95">
      <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl">
        <div className="w-8 h-8 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
      <h2 className="text-3xl font-black text-white tracking-tighter mb-2">{title}</h2>
      <p className="text-slate-500 font-medium">{desc}</p>
      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mt-8">Module under construction</p>
    </div>
  );
}

export default function App() {
  const [user, setUser]                 = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [isMaintenance, setIsMaintenance] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let vendorChannel;

    const fetchSettings = async () => {
      try {
        const { data } = await supabase.from('platform_settings').select('maintenance_mode').eq('id', 1).single();
        if (data && isMounted) setIsMaintenance(data.maintenance_mode);
      } catch (err) {
        // Silently handled for production
      }
    };

    const fetchUserAndVendor = async (session) => {
      if (!session) {
        if (isMounted) setUser(null);
        if (vendorChannel) supabase.removeChannel(vendorChannel);
        return;
      }

      try {
        let { data: vendorProfile, error } = await supabase
          .from('vendors')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          return;
        }

        // ── CLIENT-SIDE SUBSCRIPTION EXPIRY ENFORCEMENT ──────────────────────
        // If the paid plan has expired and the DB hasn't been swept yet,
        // downgrade immediately so the user doesn't see premium features.
        if (
          vendorProfile &&
          vendorProfile.plan_expires_at &&
          new Date(vendorProfile.plan_expires_at) < new Date() &&
          ['pro', 'premium', 'Pro', 'Premium'].includes(vendorProfile.plan_type)
        ) {
          const downgrade = {
            plan_type:              'free',
            plan_status:            'expired',
            plan_expires_at:        null,
            plan_started_at:        null,
            billing_cycle:          null,
            storefront_theme:       'minimal',
            custom_domain_verified: false,
            custom_domain:          null,
          };
          await supabase.from('vendors').update(downgrade).eq('id', session.user.id);
          vendorProfile = { ...vendorProfile, ...downgrade };
        }
        // ─────────────────────────────────────────────────────────────────────

        if (vendorProfile) {
          const now = new Date().toISOString();
          const provider = session.user.app_metadata?.provider || 'email';
          const updates = { last_seen_at: now };
          if (!vendorProfile.auth_provider) updates.auth_provider = provider;
          supabase.from('vendors').update(updates).eq('id', session.user.id);
          if (!vendorProfile.auth_provider) vendorProfile.auth_provider = provider;
        }

        if (isMounted) {
          setUser({ ...session.user, vendor: vendorProfile || null });

          if (vendorChannel) supabase.removeChannel(vendorChannel);

          vendorChannel = supabase.channel(`public:vendors:id=eq.${session.user.id}`)
            .on(
              'postgres_changes',
              {
                event: 'UPDATE',
                schema: 'public',
                table: 'vendors',
                filter: `id=eq.${session.user.id}`
              },
              (payload) => {
                if (isMounted) {
                  setUser(prevUser => {
                    if (!prevUser) return prevUser;
                    // Strip `theme` from the realtime payload before merging into state.
                    // The ThemeContext owns theme — letting the realtime listener
                    // overwrite it causes the toggle to reset on every DB update.
                    const { theme: _ignoredTheme, ...vendorUpdates } = payload.new;
                    return {
                      ...prevUser,
                      vendor: { ...prevUser.vendor, ...vendorUpdates }
                    };
                  });
                }
              }
            )
            .on(
              'postgres_changes',
              {
                event: 'DELETE',
                schema: 'public',
                table: 'vendors',
                filter: `id=eq.${session.user.id}`
              },
              () => {
                if (isMounted) {
                  toast.error('Your account has been removed by an administrator.');
                  supabase.auth.signOut();
                }
              }
            )
            .subscribe();
        }
      } catch (err) {
        // Silently handled for production
      }
    };

    fetchSettings();
    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchUserAndVendor(session).finally(() => {
        if (isMounted) setInitializing(false);
      });
    });

    const settingsChannel = supabase.channel('public:platform_settings')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'platform_settings' },
        (payload) => {
          setIsMaintenance(payload.new.maintenance_mode);
        }
      )
      .subscribe();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'SIGNED_OUT') {
        fetchUserAndVendor(session);
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
      if (settingsChannel) supabase.removeChannel(settingsChannel);
      if (vendorChannel) supabase.removeChannel(vendorChannel);
    };
  }, []);

  const handleSetUser = (userData) => setUser(userData);
  const isAdmin       = user?.vendor?.is_admin;

  const getRedirectPath = () => {
    if (!user) return "/login";
    if (!user.vendor) return "/onboarding";
    if (isAdmin) return "/admin";
    return "/dashboard";
  };

  if (initializing) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center transition-colors duration-300">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 dark:text-slate-500 font-black text-xs uppercase tracking-widest animate-pulse">Loading Workspace...</p>
      </div>
    );
  }

  if (isMaintenance && !isAdmin) return <Maintenance />;
  if (user?.vendor?.is_suspended && !isAdmin) return <Suspended />;

  return (
    <ThemeProvider user={user} setUser={handleSetUser}>
      <Router>
        <NetworkHandler />
        <ScrollToTop />
        <PlatformTracker />
        <ViChatWidget />

        <Routes>

          {/* ── PUBLIC ROUTES WITH GLOBAL NAVBAR ── */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<RootHandler />} />
            <Route path="/about"    element={<About />} />
            <Route path="/support"  element={<Support />} />
            <Route path="/contact"  element={<ContactUs />} />
            <Route path="/privacy"  element={<PrivacyPolicy />} />
            <Route path="/terms"    element={<TermsOfService />} />
            <Route path="/whatsapp-integration" element={<WhatsappIntegration />} />
            <Route path="/features" element={<Features />} />
            {/* <Route path="/blog"     element={<Blog />} /> */}
            {/* <Route path="/blog/:slug" element={<BlogPost />} /> */}
            <Route path="/community" element={<Community />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/pricing" element={<PricingPage />} />
          </Route>

          {/* ── AUTH ROUTES (No Navbar) ── */}
          <Route path="/login"
            element={!user ? <Login setUser={handleSetUser} /> : <Navigate to={getRedirectPath()} />} />
          <Route path="/register"
            element={!user ? <Register setUser={handleSetUser} /> : <Navigate to={getRedirectPath()} />} />
          <Route path="/forgot-password"
            element={!user ? <ForgotPassword /> : <Navigate to={getRedirectPath()} />} />

          <Route path="/onboarding"
            element={
              !user ? <Navigate to="/register" />
              : user.vendor ? <Navigate to={getRedirectPath()} />
              : <Onboarding user={user} setUser={handleSetUser} />
            }
          />

          {/* ── DASHBOARD ROUTES ── */}
          <Route path="/dashboard"
            element={
              !user ? <Navigate to="/login" />
              : !user.vendor ? <Navigate to="/onboarding" />
              : isAdmin ? <Navigate to="/admin" />
              : <DashboardLayout user={user} setUser={handleSetUser} />
            }
          >
            <Route index           element={<DashboardOverview user={user} />} />
            <Route path="products" element={<ProductManager user={user} setUser={handleSetUser} />} />
            <Route path="settings" element={<BrandSettings user={user} setUser={handleSetUser} />} />
            <Route path="analytics"element={<Analytics user={user} />} />
            <Route path="share"    element={<ShareStore user={user} />} />
            <Route path="orders"   element={<Orders user={user} />} />
            <Route path="staff"    element={<StaffManager user={user} />} />
            <Route path="domain"   element={<DomainManager user={user} setUser={handleSetUser} />} />
            <Route path="account"  element={<AccountSettings user={user} setUser={handleSetUser} />} />
            <Route path="billing"  element={<BillingSettings user={user} setUser={handleSetUser} />} />
            <Route path="help"     element={<HelpCenter user={user} />} />
          </Route>

          {/* ── ADMIN COMMAND CENTER ── */}
          <Route path="/admin"
            element={
              !user ? <Navigate to="/login" />
              : isAdmin ? <AdminLayout user={user} setUser={handleSetUser} />
              : <Unauthorized />
            }
          >
            <Route index element={<AdminOverview user={user} />} />
            <Route path="users" element={<AdminUsers user={user} />} />
            <Route path="support" element={<AdminSupport />} />
            <Route path="system" element={<SystemHealthView />} />
            <Route path="broadcasts" element={<AdminBroadcasts user={user} />} />
            <Route path="settings" element={<AdminSettings user={user} />} />
            <Route path="audit" element={<AdminAudit />} />
            <Route path="billing" element={<AdminBilling />} />
            <Route path="gifts"   element={<AdminGiftUsers />} />
          </Route>

          {/* ── STAFF PORTAL ── */}
          <Route path="/staff/:slug" element={<StaffPortal />} />

          {/* ── STOREFRONT & 404 ── */}
          <Route path="/shop.vi/:slug" element={<Storefront />} />
          <Route path="*"         element={<NotFound />} />

        </Routes>
      </Router>
    </ThemeProvider>
  );
}