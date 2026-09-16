import React from 'react';
import { 
  Bell, 
  RotateCcw, 
  ChevronRight,
  Zap,
  Building2,
  MessageSquare
} from 'lucide-react';
import { useCrmStore } from '../../store/useCrmStore';
import { Logo } from '../common/Logo';
import { UserMenu } from '../auth/UserMenu';

export const Navbar: React.FC = () => {
  const { 
    notifications, 
    isNotificationOpen, 
    setNotificationOpen, 
    resetToDemoData,
    deals,
    workspaces,
    activeWorkspaceId,
    isMessengerOpen,
    setMessengerOpen,
    triggerDemoAlert
  } = useCrmStore();

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0];
  const workspaceDeals = deals.filter(d => (d.workspaceId || 'enterprise') === activeWorkspaceId);
  const unreadCount = notifications.filter(n => !n.read).length;
  const totalPipeline = workspaceDeals.reduce((acc, d) => acc + d.value, 0);

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between z-10 sticky top-0">
      {/* Left: Logo & Active Workspace Context */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Logo size="md" />
          <span className="font-bold text-base tracking-tight text-slate-900 flex items-center gap-1.5">
            PipelinePro
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200">
              CRM OS
            </span>
          </span>
        </div>

        <ChevronRight className="w-4 h-4 text-slate-300 hidden md:block" />

        <div className="hidden md:flex items-center gap-2 text-sm text-slate-600">
          <Building2 className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
            <span 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: activeWorkspace.color }}
            />
            {activeWorkspace.name}
          </span>
          <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            ₱{(totalPipeline / 1000).toLocaleString('en-US', { maximumFractionDigits: 0 })}k Pipeline
          </span>
        </div>
      </div>

      {/* Right: Actions, Live Simulator, Chat, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Simulate Live Alert Button for Commercial Testing */}
        <button
          onClick={triggerDemoAlert}
          className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 hover:border-amber-300 transition-all shadow-sm active:scale-95"
          title="Simulate incoming live deal notification with audio chime"
        >
          <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
          <span className="hidden sm:inline">Simulate Alert</span>
        </button>

        {/* Team Messenger Button */}
        <button
          onClick={() => setMessengerOpen(!isMessengerOpen)}
          className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-all ${
            isMessengerOpen
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
          title="Toggle Team Collaboration Messenger"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Team Chat</span>
        </button>

        {/* Reset Demo Data */}
        <button
          onClick={() => {
            if (confirm('Reset all workspaces, deals, ops desk, and chat to original demo data?')) {
              resetToDemoData();
            }
          }}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 px-2 py-1.5 rounded-md transition-colors font-medium"
          title="Reset back to initial dataset"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden lg:inline">Reset</span>
        </button>

        {/* Notification Bell */}
        <button
          onClick={() => setNotificationOpen(!isNotificationOpen)}
          className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
          title="Notifications & Updates"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-sm">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile & Persona Switcher */}
        <UserMenu />
      </div>
    </header>
  );
};
