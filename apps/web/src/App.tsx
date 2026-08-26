import React, { useState, useEffect } from 'react';
import { DesktopLayout } from './components/desktop/DesktopLayout';
import { MobileLayout } from './components/mobile/MobileLayout';
import { MobileAuthBridge } from './components/auth/MobileAuthBridge';
import { DesktopAuthBridge } from './components/auth/DesktopAuthBridge';

export const App: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768;
  });

  const isMobileAuthFlow = typeof window !== 'undefined' && window.location.search.includes('mobile_login=1');
  const isDesktopAuthFlow = typeof window !== 'undefined' && window.location.search.includes('desktop_auth=1');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobileAuthFlow) {
    return <MobileAuthBridge />;
  }

  if (isDesktopAuthFlow) {
    return <DesktopAuthBridge />;
  }

  return isMobile ? <MobileLayout /> : <DesktopLayout />;
};
