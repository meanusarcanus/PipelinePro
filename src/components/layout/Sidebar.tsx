import React, { useState } from 'react';
import { 
  LayoutGrid, 
  Kanban, 
  BarChart3, 
  CheckSquare, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  FolderGit2,
  Settings,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { useCrmStore } from '../../store/useCrmStore';
import { AppView } from '../../types/crm';
import { Logo } from '../common/Logo';

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { 
    currentView, 
    setCurrentView, 
    deals, 
    opsRequests,
    workspaces,
    activeWorkspaceId,
    setActiveWorkspaceId,
    team,
    setTeamModalOpen
  } = useCrmStore();

  const pendingOpsCount = opsRequests.filter(r => r.status === 'pending').length;
  const currentWorkspaceDeals = deals.filter(d => (d.workspaceId || 'enterprise') === activeWorkspaceId);

  const navItems: { id: AppView; label: string; icon: any; badge?: number; badgeColor?: string }[] = [
    { id: 'table', label: 'Main Board (Table)', icon: LayoutGrid, badge: currentWorkspaceDeals.length },
    { id: 'kanban', label: 'Pipeline Kanban', icon: Kanban },
    { id: 'ops', label: 'Operational Requests', icon: CheckSquare, badge: pendingOpsCount, badgeColor: 'bg-amber-500 text-white' },
    { id: 'analytics', label: 'Sales Analytics & Funnel', icon: BarChart3 },
  ];

  return (
    <aside 
      className={`bg-[#1e2238] text-slate-300 flex flex-col justify-between transition-all duration-300 ease-in-out border-r border-slate-800 select-none z-20 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top section: Workspaces */}
      <div>
        {/* Workspace Brand Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-800/80">
          {!collapsed && (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <Logo size="sm" />
              <div className="truncate">
                <h2 className="text-sm font-bold text-white tracking-wide truncate">PipelinePro CRM</h2>
                <p className="text-[11px] text-slate-400 truncate">SaaS Enterprise Suite</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="mx-auto flex items-center justify-center">
              <Logo size="sm" />
            </div>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-700/50 transition-colors hidden md:block"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <div className="p-3 space-y-1">
          {!collapsed && (
            <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Workspaces & Views
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30' 
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                } ${collapsed ? 'justify-center px-0' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {!collapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}
                {!collapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Monday style quick workspace list */}
        {!collapsed ? (
          <div className="p-3 mt-4 border-t border-slate-800/80 space-y-2">
            <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Active Workspaces</span>
              <FolderGit2 className="w-3.5 h-3.5 text-slate-500" />
            </div>

            <div className="space-y-1">
              {workspaces.map((ws) => {
                const isWsActive = activeWorkspaceId === ws.id;
                const wsDealsCount = deals.filter(d => (d.workspaceId || 'enterprise') === ws.id).length;
                return (
                  <button
                    key={ws.id}
                    onClick={() => setActiveWorkspaceId(ws.id)}
                    className={`w-full px-3 py-2 rounded-lg border transition-all flex items-center gap-2.5 text-xs text-left cursor-pointer ${
                      isWsActive 
                        ? 'bg-slate-800/90 border-blue-500/50 text-white font-semibold ring-1 ring-blue-500/30' 
                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                    title={ws.description}
                  >
                    <span 
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: ws.color }}
                    />
                    <span className="truncate flex-1">{ws.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isWsActive ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {wsDealsCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-2 mt-4 border-t border-slate-800/80 flex flex-col items-center gap-2">
            {workspaces.map((ws) => {
              const isWsActive = activeWorkspaceId === ws.id;
              return (
                <button
                  key={ws.id}
                  onClick={() => setActiveWorkspaceId(ws.id)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    isWsActive ? 'bg-slate-800 ring-2 ring-blue-500' : 'hover:bg-slate-800/50'
                  }`}
                  title={`${ws.name} (${ws.description})`}
                >
                  <span 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: ws.color }}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom section: Team Management & Help */}
      <div className="p-3 border-t border-slate-800/80 space-y-1">
        <button
          onClick={() => setTeamModalOpen(true)}
          className={`w-full flex items-center justify-between text-xs text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800/80 transition-colors ${collapsed ? 'justify-center px-0' : ''}`}
          title="Manage Team & Commercial Seats (Max 10)"
        >
          <div className="flex items-center gap-2.5">
            <Users className="w-4 h-4 text-blue-400" />
            {!collapsed && <span className="font-semibold">Team & Seats</span>}
          </div>
          {!collapsed && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              team.length >= 10 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
            }`}>
              {team.length}/10
            </span>
          )}
        </button>

        <div className={`flex items-center text-xs text-slate-400 px-3 py-2 ${collapsed ? 'justify-center px-0' : 'gap-2'}`}>
          <HelpCircle className="w-4 h-4 text-slate-400" />
          {!collapsed && <span>PipelinePro v1.2</span>}
        </div>
      </div>
    </aside>
  );
};
