import React from 'react';
import { DealStage, DealPriority, OpsRequestStatus } from '../../types/crm';

interface StageBadgeProps {
  stage: DealStage;
  className?: string;
  onClick?: () => void;
}

export const StageBadge: React.FC<StageBadgeProps> = ({ stage, className = '', onClick }) => {
  const getStageConfig = () => {
    switch (stage) {
      case 'won':
        return { label: 'Closed Won', bg: 'bg-[#00c875]', text: 'text-white' };
      case 'negotiation':
        return { label: 'Negotiation', bg: 'bg-[#a25ddc]', text: 'text-white' };
      case 'proposal':
        return { label: 'Proposal Sent', bg: 'bg-[#579bfc]', text: 'text-white' };
      case 'contacted':
        return { label: 'Contacted', bg: 'bg-[#fdab3d]', text: 'text-white' };
      case 'lead':
        return { label: 'Lead In', bg: 'bg-indigo-500', text: 'text-white' };
      case 'lost':
        return { label: 'Closed Lost', bg: 'bg-[#e2445c]', text: 'text-white' };
      default:
        return { label: stage, bg: 'bg-slate-500', text: 'text-white' };
    }
  };

  const config = getStageConfig();

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center justify-center font-medium text-xs px-2.5 py-1 rounded shadow-sm transition-all duration-150 select-none ${config.bg} ${config.text} ${onClick ? 'cursor-pointer hover:brightness-105 active:scale-95' : ''} ${className}`}
    >
      {config.label}
    </span>
  );
};

interface PriorityBadgeProps {
  priority: DealPriority;
  className?: string;
  onClick?: () => void;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className = '', onClick }) => {
  const getConfig = () => {
    switch (priority) {
      case 'critical':
        return { label: 'Critical', bg: 'bg-[#333333]', text: 'text-white', dot: 'bg-red-400' };
      case 'high':
        return { label: 'High', bg: 'bg-[#e2445c]', text: 'text-white', dot: 'bg-red-200' };
      case 'medium':
        return { label: 'Medium', bg: 'bg-[#579bfc]', text: 'text-white', dot: 'bg-blue-200' };
      case 'low':
        return { label: 'Low', bg: 'bg-slate-300', text: 'text-slate-800', dot: 'bg-slate-500' };
    }
  };

  const config = getConfig();

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 justify-center font-medium text-xs px-2.5 py-1 rounded shadow-sm transition-all select-none ${config.bg} ${config.text} ${onClick ? 'cursor-pointer hover:brightness-105 active:scale-95' : ''} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

interface OpsStatusBadgeProps {
  status: OpsRequestStatus;
  className?: string;
}

export const OpsStatusBadge: React.FC<OpsStatusBadgeProps> = ({ status, className = '' }) => {
  const getConfig = () => {
    switch (status) {
      case 'approved':
        return { label: 'Approved', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'rejected':
        return { label: 'Rejected', bg: 'bg-rose-100 text-rose-800 border-rose-300' };
      case 'in_review':
        return { label: 'In Review', bg: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'pending':
        return { label: 'Pending Approval', bg: 'bg-blue-100 text-blue-800 border-blue-300' };
    }
  };

  const config = getConfig();

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg} ${className}`}>
      {config.label}
    </span>
  );
};
