import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles } from 'lucide-react';
import { useCrmStore } from '../../store/useCrmStore';

export const PwaInstallBanner: React.FC = () => {
  const { pwaInstallPrompt, setPwaInstallPrompt } = useCrmStore();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [dismissed, setDismissed] = useState<boolean>(() => {
    return localStorage.getItem('pipelinepro_pwa_dismissed') === 'true';
  });

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setPwaInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, [setPwaInstallPrompt]);

  const handleInstall = async () => {
    const promptEvent = deferredPrompt || pwaInstallPrompt;
    if (!promptEvent) {
      alert('To install PipelinePro on iOS Safari: tap Share (square with arrow) and select "Add to Home Screen".');
      return;
    }

    promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setPwaInstallPrompt(null);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('pipelinepro_pwa_dismissed', 'true');
  };

  // Only show if not dismissed and prompt is available OR on touch/mobile
  if (dismissed || (!deferredPrompt && !pwaInstallPrompt)) return null;

  return (
    <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white px-3 py-2 text-xs flex items-center justify-between shadow-md select-none relative z-40 animate-in slide-in-from-top-2">
      <div className="flex items-center gap-2 min-w-0 pr-2">
        <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
          <Smartphone className="w-4 h-4 text-emerald-300" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-white truncate text-xs flex items-center gap-1">
            Install PipelinePro App
            <Sparkles className="w-3 h-3 text-amber-300 inline" />
          </p>
          <p className="text-[11px] text-blue-100 truncate">
            Add to home screen for 1-tap mobile CRM access & offline mode
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleInstall}
          className="flex items-center gap-1 px-3 py-1 bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-lg shadow-sm text-xs transition-all active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install</span>
        </button>
        <button
          onClick={handleDismiss}
          className="p-1 text-white/70 hover:text-white rounded-lg transition-colors"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
