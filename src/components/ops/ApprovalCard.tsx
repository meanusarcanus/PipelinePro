import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Building2, 
  AlertTriangle, 
  FileText, 
  Percent, 
  ShieldCheck, 
  Server,
  MessageSquare
} from 'lucide-react';
import { OpsRequest, OpsRequestStatus } from '../../types/crm';
import { useCrmStore } from '../../store/useCrmStore';
import { OpsStatusBadge, PriorityBadge } from '../common/Badge';
import { Avatar } from '../common/Avatar';

interface ApprovalCardProps {
  request: OpsRequest;
}

export const ApprovalCard: React.FC<ApprovalCardProps> = ({ request }) => {
  const { updateOpsRequestStatus, setSelectedDealId } = useCrmStore();
  const [decisionNote, setDecisionNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [pendingAction, setPendingAction] = useState<OpsRequestStatus | null>(null);

  const getTypeIcon = () => {
    switch (request.type) {
      case 'discount_approval':
        return <Percent className="w-4 h-4 text-purple-600" />;
      case 'legal_msa':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'security_soc2':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'sandbox_provisioning':
        return <Server className="w-4 h-4 text-amber-600" />;
      default:
        return <FileText className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleAction = (status: OpsRequestStatus) => {
    setPendingAction(status);
    setShowNoteInput(true);
  };

  const submitDecision = () => {
    if (pendingAction) {
      updateOpsRequestStatus(request.id, pendingAction, decisionNote);
      setShowNoteInput(false);
      setDecisionNote('');
      setPendingAction(null);
    }
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between">
      <div>
        {/* Top bar: Type, Status, Urgency */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-100 flex items-center justify-center">
              {getTypeIcon()}
            </div>
            <span className="text-xs font-bold text-slate-700 capitalize">
              {request.type.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <PriorityBadge priority={request.urgency} />
            <OpsStatusBadge status={request.status} />
          </div>
        </div>

        {/* Title & Company */}
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          {request.title}
        </h3>

        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
          <span className="flex items-center gap-1 font-medium text-slate-700">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            {request.company}
          </span>
          {request.dealName && (
            <>
              <span>•</span>
              <button
                onClick={() => request.dealId && setSelectedDealId(request.dealId)}
                className="text-blue-600 hover:underline truncate max-w-[200px]"
                title="View linked deal"
              >
                {request.dealName}
              </button>
            </>
          )}
        </div>

        {/* Notes description */}
        <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 mb-4 leading-relaxed border border-slate-100">
          {request.notes}
        </div>

        {/* Metric pills if discount or amount */}
        {(request.discountPercent || request.amount) && (
          <div className="flex items-center gap-3 mb-4 text-xs">
            {request.discountPercent && (
              <div className="bg-purple-50 border border-purple-200 text-purple-700 px-2.5 py-1 rounded-md font-semibold">
                Requested Discount: {request.discountPercent}%
              </div>
            )}
            {request.amount && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-1 rounded-md font-semibold">
                Contract Impact: ₱{request.amount.toLocaleString()}
              </div>
            )}
          </div>
        )}

        {/* SLA and requester info */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <Avatar user={request.requestedBy} size="sm" />
            <span>Requested by <strong className="text-slate-700">{request.requestedBy.name}</strong></span>
          </div>

          <div className="flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className={request.slaHoursLeft <= 8 && request.status === 'pending' ? 'text-rose-600 font-bold' : ''}>
              {request.status === 'pending' ? `${request.slaHoursLeft}h SLA left` : 'Completed'}
            </span>
          </div>
        </div>

        {/* Decision note display if already reviewed */}
        {request.approvalNote && (
          <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-md text-xs text-blue-900 mb-3">
            <span className="font-bold">Approver Note:</span> {request.approvalNote}
          </div>
        )}
      </div>

      {/* Action buttons (Approve / Reject / Review) */}
      <div>
        {showNoteInput ? (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <input
              type="text"
              placeholder={`Add an optional audit note for ${pendingAction}...`}
              value={decisionNote}
              onChange={(e) => setDecisionNote(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => setShowNoteInput(false)}
                className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={submitDecision}
                className={`px-3 py-1 text-xs font-semibold rounded text-white ${
                  pendingAction === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                Confirm {pendingAction}
              </button>
            </div>
          </div>
        ) : request.status === 'pending' || request.status === 'in_review' ? (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => handleAction('approved')}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Approve
            </button>
            <button
              onClick={() => handleAction('rejected')}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs"
            >
              <XCircle className="w-3.5 h-3.5" />
              Reject
            </button>
            {request.status === 'pending' && (
              <button
                onClick={() => updateOpsRequestStatus(request.id, 'in_review')}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
                title="Mark In Review"
              >
                In Review
              </button>
            )}
          </div>
        ) : (
          <div className="text-center text-xs text-slate-400 py-1 font-medium italic">
            Decision logged by {request.approver?.name || 'Admin'}
          </div>
        )}
      </div>
    </div>
  );
};
