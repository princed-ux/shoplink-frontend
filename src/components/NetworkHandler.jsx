import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Wifi, WifiOff } from 'lucide-react';

export default function NetworkHandler() {
  useEffect(() => {
    // 1. Handler for when internet is LOST
    const handleOffline = () => {
      toast.error(
        <div className="flex flex-col gap-1">
          <span className="font-bold">No Internet Connection</span>
          <span className="text-xs font-medium opacity-90">Check your network settings.</span>
        </div>,
        {
          id: 'network-status', // 'id' prevents duplicate toasts
          duration: Infinity,   // Stays visible until connection returns
          position: 'bottom-center',
          icon: <WifiOff size={24} className="text-red-500" />,
          style: {
            border: '2px solid #fee2e2', // Red border
            padding: '16px',
            color: '#991b1b',
          },
        }
      );
    };

    // 2. Handler for when internet RETURNS
    const handleOnline = () => {
      // Dismiss the "Offline" toast immediately
      toast.dismiss('network-status');
      
      // Show success message
      toast.success(
        <span className="font-bold">Back Online!</span>, 
        {
          id: 'network-back',
          duration: 4000,
          position: 'bottom-center',
          icon: <Wifi size={24} className="text-emerald-500" />,
          style: {
            border: '2px solid #d1fae5', // Green border
            padding: '16px',
            color: '#065f46',
          },
        }
      );
    };

    // 3. Add Event Listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 4. Cleanup on Unmount
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return null; // This component is invisible
}