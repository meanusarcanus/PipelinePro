import React from 'react';
import { useCrmStore } from '../../store/useCrmStore';
import { CheckCircle, AlertTriangle, Info, Bell, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useCrmStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-16 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = 'border-l-4 border-blue-500 bg-white text-slate-800';
        let Icon = Info;
        let iconColor = 'text-blue-500';

        if (toast.type === 'success') {
          borderClass = 'border-l-4 border-emerald-500 bg-white text-slate-800';
          Icon = CheckCircle;
          iconColor = 'text-emerald-500';
        } else if (toast.type === 'warning') {
          borderClass = 'border-l-4 border-amber-500 bg-white text-slate-800';
          Icon = AlertTriangle;
          iconColor = 'text-amber-500';
        } else if (toast.type === 'alert') {
          borderClass = 'border-l-4 border-rose-500 bg-white text-slate-800';
          Icon = Bell;
          iconColor = 'text-rose-500';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg shadow-xl ring-1 ring-black/5 animate-in slide-in-from-top-2 duration-200 transition-all ${borderClass}`}
            role="alert"
          >
            <div className="shrink-0 mt-0.5">
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <p className="text-xs font-semibold text-slate-900 tracking-tight">{toast.title}</p>
              <p className="text-xs text-slate-600 mt-0.5 leading-snug">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
