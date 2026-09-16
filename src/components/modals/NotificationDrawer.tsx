import React from 'react';
import { X, CheckCheck, Bell, Info, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useCrmStore } from '../../store/useCrmStore';

export const NotificationDrawer: React.FC = () => {
  const { 
    notifications, 
    isNotificationOpen, 
    setNotificationOpen, 
    markAllNotificationsRead,
    handleNotificationClick
  } = useCrmStore();

  if (!isNotificationOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fadeIn select-none">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs"
        onClick={() => setNotificationOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col z-50 animate-slideLeft border-l border-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Activity & Notifications</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              className="text-[11px] text-blue-600 hover:underline font-semibold flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
            <button
              onClick={() => setNotificationOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.map((notif) => {
            const getIcon = () => {
              switch (notif.type) {
                case 'success':
                  return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
                case 'alert':
                case 'warning':
                  return <AlertTriangle className="w-4 h-4 text-amber-500" />;
                default:
                  return <Info className="w-4 h-4 text-blue-500" />;
              }
            };

            const hasAction = !!(notif.dealId || notif.viewTarget);

            return (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer hover:shadow-md hover:border-blue-300 ${
                  notif.read
                    ? 'bg-slate-50/70 border-slate-200 text-slate-600'
                    : 'bg-blue-50/50 border-blue-200 text-slate-900 font-medium'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 shrink-0">{getIcon()}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-slate-800 truncate">{notif.title}</span>
                      <span className="text-[10px] text-slate-400 shrink-0">{notif.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.description}</p>
                    
                    {hasAction && (
                      <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700">
                        <span>View Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {notifications.length === 0 && (
            <div className="py-20 text-center text-xs text-slate-400">
              No notifications right now.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
