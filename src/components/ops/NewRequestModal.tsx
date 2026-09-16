import React, { useState } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';
import { useCrmStore } from '../../store/useCrmStore';
import { OpsRequestType, DealPriority } from '../../types/crm';

export const NewRequestModal: React.FC = () => {
  const { isNewOpsModalOpen, setNewOpsModalOpen, addOpsRequest, deals } = useCrmStore();

  const [title, setTitle] = useState('');
  const [dealId, setDealId] = useState(deals[0]?.id || '');
  const [type, setType] = useState<OpsRequestType>('discount_approval');
  const [urgency, setUrgency] = useState<DealPriority>('high');
  const [discountPercent, setDiscountPercent] = useState('15');
  const [amount, setAmount] = useState('25000');
  const [notes, setNotes] = useState('');

  if (!isNewOpsModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedDeal = deals.find(d => d.id === dealId);

    addOpsRequest({
      title: title.trim(),
      dealId: selectedDeal?.id,
      dealName: selectedDeal?.name,
      company: selectedDeal?.company || 'Enterprise Prospect',
      type,
      urgency,
      discountPercent: type === 'discount_approval' ? Number(discountPercent) : undefined,
      amount: type === 'discount_approval' ? Number(amount) : undefined,
      notes: notes.trim() || 'Urgent review requested for executive pipeline deal.'
    });

    setTitle('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">New Operational / Approval Request</h3>
            <p className="text-xs text-slate-500">Route approval tickets to sales ops, legal, or security teams.</p>
          </div>
          <button 
            onClick={() => setNewOpsModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Request Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 20% Year-1 Enterprise Discount Approval"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Request Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="discount_approval">Discount Approval</option>
                <option value="legal_msa">Legal MSA / Redlines</option>
                <option value="security_soc2">SOC 2 / Security Review</option>
                <option value="sandbox_provisioning">Sandbox Provisioning</option>
                <option value="custom_integration">Custom Integration</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Urgency / Priority
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="critical">Critical (4h SLA)</option>
                <option value="high">High (12h SLA)</option>
                <option value="medium">Medium (24h SLA)</option>
                <option value="low">Low (48h SLA)</option>
              </select>
            </div>
          </div>

          {/* Linked Deal */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Associated Opportunity / Deal
            </label>
            <select
              value={dealId}
              onChange={(e) => setDealId(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {deals.map(d => (
                <option key={d.id} value={d.id}>{d.name} (₱{d.value.toLocaleString()})</option>
              ))}
            </select>
          </div>

          {type === 'discount_approval' && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-purple-50/60 rounded-lg border border-purple-200">
              <div>
                <label className="block text-xs font-semibold text-purple-900 mb-1">
                  Discount %
                </label>
                <input
                  type="number"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-purple-300 rounded bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-purple-900 mb-1">
                  Value Impact (₱)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-purple-300 rounded bg-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Context / Notes for Approvers
            </label>
            <textarea
              rows={3}
              placeholder="Explain business justification, client timeline, and commercial terms..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setNewOpsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
