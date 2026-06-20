import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function PlatformTracker() {
  const location = useLocation();

  useEffect(() => {
    const trackPageVisit = async () => {
      try {
        // 1. Identify the ghost (visitor)
        let visitorId = localStorage.getItem('shoplink_visitor_id');
        if (!visitorId) {
          visitorId = crypto.randomUUID();
          localStorage.setItem('shoplink_visitor_id', visitorId);
        }

        // 2. Do not track the admin dashboard itself to avoid skewing data
        if (location.pathname.startsWith('/admin')) return;

        // 3. Send the ping to Supabase
        await supabase.from('platform_traffic').insert([
          {
            path: location.pathname,
            visitor_device_id: visitorId,
            referrer: document.referrer || 'Direct'
          }
        ]);
      } catch (error) {
        // Fail silently so it never breaks the app for the user
        console.error("Tracking error:", error);
      }
    };

    trackPageVisit();
  }, [location.pathname]); // Fires every time the URL changes

  return null; // This component renders nothing, it just watches.
}