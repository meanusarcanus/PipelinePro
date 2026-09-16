import React, { useState } from 'react';
import { 
  Bell, 
  ChevronDown, 
  Zap, 
  Laptop, 
  Smartphone,
  Plus
} from 'lucide-react';
import { useCrmStore } from '../../store/useCrmStore';
import { Logo } from '../common/Logo';
import { Avatar } from '../common/Avatar';

export const MobileNavBar: React.FC = () => {
  const { 
    workspaces, 
    activeWorkspaceId, 
    setActiveWorkspaceId,
    notifications,
    isNotificationOpen,
    setNotificationOpen,
    currentUser,
    setLoginModalOpen,
    setNewDealModalOpen,
    triggerDemoAlert,
    deviceMode,
    setDeviceMode,
    deals
  } = useCrmStore();

  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0];
  const unreadCount = notifications.filter(n => !n.read).length;
  const workspaceDeals = deals.filter(d => (d.workspaceId || 'enterprise') === activeWorkspaceId);
  const totalPipeline = workspaceDeals.reduce((acc, d) => acc + d.value, 0);

  return (
    <header className="sticky top-0 z-30 bg-slate-900 text-white shadow-md select-none">
      {/* Top row */}
      <div className="px-3 py-2.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Logo size="sm" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-white">PipelinePro</span>
              <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                PWA
              </span>
            </div>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Quick Add Deal */}
          <button
            onClick={() => setNewDealModalOpen(true)}
            className="w-7 h-7 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-sm active:scale-95 transition-all"
            title="Add Deal"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Quick Alert Simulator */}
          <button
            onClick={triggerDemoAlert}
            className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center active:scale-95 transition-all"
            title="Simulate Deal Alert"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
          </button>

          {/* Notifications */}
          <button
            onClick={() => setNotificationOpen(!isNotificationOpen)}
            className="relative w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Persona Avatar */}
          <button
            onClick={() => setLoginModalOpen(true)}
            className="rounded-full ring-2 ring-blue-500/40 active:scale-95 transition-all"
            title="Switch User / Account"
          >
            <Avatar user={currentUser} size="sm" />
          </button>
        </div>
      </div>

      {/* Workspace & Device Mode Strip */}
      <div className="px-3 py-1.5 bg-slate-950/80 flex items-center justify-between text-xs">
        {/* Workspace Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
            className="flex items-center gap-1.5 font-medium text-slate-300 hover:text-white py-0.5 transition-colors"
          >
            <span 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: activeWorkspace.color }}
            />
            <span className="text-xs font-semibold truncate max-w-[170px]">{activeWorkspace.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isWorkspaceOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsWorkspaceOpen(false)} 
              />
              <div className="absolute top-full left-0 mt-1 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Select Workspace
                </div>
                {workspaces.map(ws => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      setActiveWorkspaceId(ws.id);
                      setIsWorkspaceOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      ws.id === activeWorkspaceId
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-300 hover:bg-slate-700/70'
                    }`}
                  >
                    <span 
                      className="w-2 h-2 rounded-full shrink-0" 
                      style={{ backgroundColor: ws.color }}
                    />
                    <span className="truncate text-left">{ws.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pipeline Badge & Desktop toggle */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            ₱{(totalPipeline / 1000).toLocaleString('en-US', { maximumFractionDigits: 0 })}k
          </span>

          {/* Desktop switch toggle */}
          <button
            onClick={() => setDeviceMode(deviceMode === 'desktop' ? 'auto' : 'desktop')}
            className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-200 px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
            title="Switch to desktop view layout"
          >
            <Laptop className="w-3 h-3" />
            <span>Desktop</span>
          </button>
        </div>
      </div>
    </header>
  );
};
