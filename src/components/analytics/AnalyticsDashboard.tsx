import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  Clock, 
  PieChart as PieIcon,
  ShieldAlert,
  Download
} from 'lucide-react';
import { useCrmStore } from '../../store/useCrmStore';
import { MetricCard } from './MetricCard';
import { PipelineFunnel } from './PipelineFunnel';
import { RevenueChart } from './RevenueChart';
import { RepLeaderboard } from './RepLeaderboard';

export const AnalyticsDashboard: React.FC = () => {
  const { deals, team, opsRequests, exportCSV, workspaces, activeWorkspaceId } = useCrmStore();
  const [scope, setScope] = useState<'workspace' | 'all'>('workspace');

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0];
  const scopedDeals = scope === 'workspace' 
    ? deals.filter(d => (d.workspaceId || 'enterprise') === activeWorkspaceId) 
    : deals;

  const totalPipeline = scopedDeals.reduce((sum, d) => sum + d.value, 0);
  const wonDeals = scopedDeals.filter(d => d.stage === 'won');
  const closedWonRevenue = wonDeals.reduce((sum, d) => sum + d.value, 0);
  const winRate = scopedDeals.length ? Math.round((wonDeals.length / scopedDeals.length) * 100) : 0;
  const avgDealSize = scopedDeals.length ? Math.round(totalPipeline / scopedDeals.length) : 0;
  const pendingApprovals = opsRequests.filter(r => r.status === 'pending').length;

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 select-none">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{scope === 'workspace' ? activeWorkspace.name : 'All Workspaces'} Analytics</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {scopedDeals.length} deals
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time pipeline metrics, quota pacing, deal conversion, and operational throughput.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Scope Toggle */}
          <div className="bg-slate-100 p-0.5 rounded-lg flex items-center text-xs font-semibold">
            <button
              onClick={() => setScope('workspace')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                scope === 'workspace' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Current Workspace
            </button>
            <button
              onClick={() => setScope('all')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                scope === 'all' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All Workspaces
            </button>
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export Report (CSV)
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Pipeline ARR"
          value={`₱${totalPipeline.toLocaleString()}`}
          subtitle={`${deals.length} active enterprise deals`}
          trend={{ value: '+24.5%', isPositive: true }}
          icon={DollarSign}
          colorClass="text-blue-600 bg-blue-50"
        />

        <MetricCard
          title="Closed Won Revenue"
          value={`₱${closedWonRevenue.toLocaleString()}`}
          subtitle={`${wonDeals.length} deals closed this quarter`}
          trend={{ value: '+18.2%', isPositive: true }}
          icon={TrendingUp}
          colorClass="text-emerald-600 bg-emerald-50"
        />

        <MetricCard
          title="Average Deal Size"
          value={`₱${avgDealSize.toLocaleString()}`}
          subtitle="Across enterprise & commercial"
          trend={{ value: '+8.4%', isPositive: true }}
          icon={Target}
          colorClass="text-purple-600 bg-purple-50"
        />

        <MetricCard
          title="Win Rate & Ops"
          value={`${winRate}%`}
          subtitle={`${pendingApprovals} approval tickets open`}
          trend={{ value: '+3.1%', isPositive: true }}
          icon={Clock}
          colorClass="text-amber-600 bg-amber-50"
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart deals={scopedDeals} />
        <PipelineFunnel deals={scopedDeals} />
      </div>

      {/* Leaderboard and Operational Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RepLeaderboard deals={scopedDeals} team={team} />
        </div>

        {/* Industry Breakdown Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Deal Distribution by Sector</h3>
            <p className="text-xs text-slate-400 mb-4">ARR exposure by customer segment</p>

            <div className="space-y-3">
              {[
                { label: 'Retail & E-commerce', share: 32, val: '₱220k', color: '#a25ddc' },
                { label: 'Cloud Infrastructure', share: 26, val: '₱180k', color: '#579bfc' },
                { label: 'Healthcare & Life Sci', share: 20, val: '₱140k', color: '#fdab3d' },
                { label: 'Renewables & Energy', share: 12, val: '₱135k', color: '#00c875' },
                { label: 'FinTech & Security', share: 10, val: '₱95k', color: '#e2445c' }
              ].map(ind => (
                <div key={ind.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ind.color }} />
                      {ind.label}
                    </span>
                    <span className="font-bold text-slate-900">{ind.val}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ width: `${ind.share}%`, backgroundColor: ind.color }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>High Sector Concentration:</span>
            <span className="font-semibold text-slate-800">Enterprise Retail</span>
          </div>
        </div>
      </div>
    </div>
  );
};
