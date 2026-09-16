import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Mail, 
  Calendar, 
  DollarSign, 
  MessageSquare, 
  History, 
  FileText,
  UserCheck,
  TrendingUp,
  ExternalLink
} from 'lucide-react';
import { useCrmStore } from '../../store/useCrmStore';
import { StageBadge, PriorityBadge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { UpdatesFeed } from './UpdatesFeed';
import { ActivityLog } from './ActivityLog';

export const ItemDetailDrawer: React.FC = () => {
  const { deals, selectedDealId, setSelectedDealId, updateDeal } = useCrmStore();
  const [activeTab, setActiveTab] = useState<'updates' | 'activity' | 'details'>('updates');

  const deal = deals.find(d => d.id === selectedDealId);

  if (!deal) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end animate-fadeIn select-none">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs transition-opacity"
        onClick={() => setSelectedDealId(null)}
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-full sm:max-w-xl bg-[#f8fafc] h-full shadow-2xl flex flex-col z-50 animate-slideLeft border-l border-slate-200">
        {/* Header */}
        <div className="p-6 bg-white border-b border-slate-200">
          <div className="flex items-center justify-between gap-4 mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-500" />
              {deal.company}
            </span>

            <button
              onClick={() => setSelectedDealId(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-lg font-bold text-slate-900 leading-snug mb-3">
            {deal.name}
          </h2>

          {/* Quick status badges & metrics */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <StageBadge stage={deal.stage} />
            <PriorityBadge priority={deal.priority} />
            <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded">
              ₱{deal.value.toLocaleString()} ARR
            </span>
            <span className="text-xs font-medium text-slate-600 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
              {deal.probability}% Win Confidence
            </span>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 px-6 bg-white border-b border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('updates')}
            className={`flex items-center gap-1.5 py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'updates'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Updates & Notes ({deal.updates.length})
          </button>

          <button
            onClick={() => setActiveTab('details')}
            className={`flex items-center gap-1.5 py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'details'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Deal Details
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`flex items-center gap-1.5 py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'activity'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Activity Log ({deal.activityLog.length})
          </button>
        </div>

        {/* Tab contents */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'updates' && <UpdatesFeed deal={deal} />}

          {activeTab === 'activity' && <ActivityLog deal={deal} />}

          {activeTab === 'details' && (
            <div className="p-6 space-y-6 overflow-y-auto h-full text-xs">
              <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Primary Contact</h4>
                <div className="space-y-1.5">
                  <div className="font-semibold text-slate-900 text-sm">{deal.contactName}</div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <a href={`mailto:${deal.contactEmail}`} className="text-blue-600 hover:underline">
                      {deal.contactEmail}
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Deal Metadata</h4>
                <div className="grid grid-cols-2 gap-3 text-slate-600">
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">Deal Owner</span>
                    <div className="flex items-center gap-1.5 mt-1 font-medium text-slate-800">
                      <Avatar user={deal.owner} size="sm" />
                      <span>{deal.owner.name}</span>
                    </div>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">Target Close Date</span>
                    <div className="flex items-center gap-1.5 mt-1 font-medium text-slate-800">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{deal.closeDate}</span>
                    </div>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">Industry Segment</span>
                    <span className="font-medium text-slate-800 mt-1 block">{deal.industry}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">Created Date</span>
                    <span className="font-medium text-slate-800 mt-1 block">{deal.createdAt}</span>
                  </div>
                </div>
              </div>

              {deal.notes && (
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">Executive Notes</h4>
                  <p className="text-slate-600 leading-relaxed">{deal.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
