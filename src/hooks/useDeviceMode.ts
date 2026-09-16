import { useState, useEffect } from 'react';
import { useCrmStore } from '../store/useCrmStore';

export function useDeviceMode() {
  const { deviceMode, setDeviceMode } = useCrmStore();
  
  const [autoDetectedMobile, setAutoDetectedMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isNarrow = window.innerWidth < 768;
    return isMobileUA || isNarrow;
  });

  const [windowWidth, setWindowWidth] = useState<number>(() => 
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isNarrow = width < 768;
      setAutoDetectedMobile(isMobileUA || isNarrow);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = deviceMode === 'mobile' ? true : deviceMode === 'desktop' ? false : autoDetectedMobile;
  const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  return {
    isMobile,
    isDesktop: !isMobile,
    deviceMode,
    setDeviceMode,
    autoDetectedMobile,
    isTouch,
    windowWidth
  };
}
