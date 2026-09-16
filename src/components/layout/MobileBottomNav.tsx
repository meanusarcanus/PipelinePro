import React from 'react';
import { 
  LayoutGrid, 
  Kanban, 
  CheckSquare, 
  BarChart3, 
  MessageSquare
} from 'lucide-react';
import { useCrmStore } from '../../store/useCrmStore';
import { AppView } from '../../types/crm';

export const MobileBottomNav: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    opsRequests, 
    isMessengerOpen, 
    setMessengerOpen,
    channels
  } = useCrmStore();

  const pendingOpsCount = opsRequests.filter(r => r.status === 'pending').length;
  const unreadMessagesCount = channels.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const navItems: { id: AppView | 'chat'; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'table', label: 'Deals', icon: LayoutGrid },
    { id: 'kanban', label: 'Kanban', icon: Kanban },
    { id: 'ops', label: 'Ops Desk', icon: CheckSquare },
    { id: 'analytics', label: 'Reports', icon: BarChart3 },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
  ];

  const handleNavClick = (id: AppView | 'chat') => {
    if (id === 'chat') {
      setMessengerOpen(!isMessengerOpen);
    } else {
      setCurrentView(id);
      if (isMessengerOpen) setMessengerOpen(false);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 flex items-center justify-around select-none shadow-lg pb-[max(0.375rem,env(safe-area-inset-bottom))]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.id === 'chat' ? isMessengerOpen : currentView === item.id && !isMessengerOpen;

        return (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl transition-all relative ${
              isActive 
                ? 'text-blue-600 font-semibold' 
                : 'text-slate-500 hover:text-slate-900 active:scale-95'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              
              {/* Ops Desk Pending Badge */}
              {item.id === 'ops' && pendingOpsCount > 0 && (
                <span className="absolute -top-1 -right-2 px-1 min-w-[14px] h-[14px] bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {pendingOpsCount}
                </span>
              )}

              {/* Chat Unread Badge */}
              {item.id === 'chat' && unreadMessagesCount > 0 && (
                <span className="absolute -top-1 -right-2 px-1 min-w-[14px] h-[14px] bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadMessagesCount}
                </span>
              )}
            </div>

            <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'text-blue-600 font-bold' : 'text-slate-500'}`}>
              {item.label}
            </span>

            {/* Active Indicator Dot */}
            {isActive && (
              <span className="w-1 h-1 rounded-full bg-blue-600 mt-0.5" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
