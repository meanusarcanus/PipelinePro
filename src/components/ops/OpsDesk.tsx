import React, { useState, useMemo } from 'react';
import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Filter, 
  Plus 
} from 'lucide-react';
import { useCrmStore } from '../../store/useCrmStore';
import { ApprovalCard } from './ApprovalCard';
import { OpsRequestStatus } from '../../types/crm';

export const OpsDesk: React.FC = () => {
  const { opsRequests, setNewOpsModalOpen } = useCrmStore();
  const [statusFilter, setStatusFilter] = useState<'all' | OpsRequestStatus>('all');

  const counts = useMemo(() => {
    return {
      all: opsRequests.length,
      pending: opsRequests.filter(r => r.status === 'pending').length,
      in_review: opsRequests.filter(r => r.status === 'in_review').length,
      approved: opsRequests.filter(r => r.status === 'approved').length,
      rejected: opsRequests.filter(r => r.status === 'rejected').length
    };
  }, [opsRequests]);

  const filteredRequests = useMemo(() => {
    if (statusFilter === 'all') return opsRequests;
    return opsRequests.filter(r => r.status === statusFilter);
  }, [opsRequests, statusFilter]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header & Stats Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Operational Requests & Approvals Desk
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              {counts.pending} Action Required
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Streamline sales ops, multi-year discount authorizations, legal master services agreements, and technical provisioning.
          </p>
        </div>

        <button
          onClick={() => setNewOpsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Raise Operational Request
        </button>
      </div>

      {/* SLA Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">Pending Approvals</div>
            <div className="text-2xl font-bold text-amber-600 mt-1">{counts.pending}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">In Legal / Sec Review</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">{counts.in_review}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">Approved This Month</div>
            <div className="text-2xl font-bold text-emerald-600 mt-1">{counts.approved}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">Average SLA Turnaround</div>
            <div className="text-2xl font-bold text-slate-800 mt-1">4.2 hrs</div>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6 select-none">
        <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" />
          Filter:
        </span>
        {[
          { id: 'all', label: 'All Requests', count: counts.all },
          { id: 'pending', label: 'Pending', count: counts.pending },
          { id: 'in_review', label: 'In Review', count: counts.in_review },
          { id: 'approved', label: 'Approved', count: counts.approved },
          { id: 'rejected', label: 'Rejected', count: counts.rejected },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id as any)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              statusFilter === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              statusFilter === tab.id ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRequests.map(req => (
          <ApprovalCard key={req.id} request={req} />
        ))}

        {filteredRequests.length === 0 && (
          <div className="col-span-full py-16 bg-white rounded-xl border border-dashed border-slate-300 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">Inbox Zero in this category</h4>
            <p className="text-xs text-slate-500 mt-1">No operational tickets currently match the selected status.</p>
          </div>
        )}
      </div>
    </div>
  );
};
