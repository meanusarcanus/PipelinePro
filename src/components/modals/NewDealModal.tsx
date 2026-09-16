import React, { useState } from 'react';
import { X, DollarSign, Building2 } from 'lucide-react';
import { useCrmStore } from '../../store/useCrmStore';
import { DealStage, DealPriority } from '../../types/crm';

export const NewDealModal: React.FC = () => {
  const { isNewDealModalOpen, setNewDealModalOpen, addDeal, team, groups } = useCrmStore();

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [value, setValue] = useState('75000');
  const [stage, setStage] = useState<DealStage>('lead');
  const [priority, setPriority] = useState<DealPriority>('medium');
  const [ownerId, setOwnerId] = useState(team[0]?.id || '');
  const [groupId, setGroupId] = useState(groups[0]?.id || '');
  const [industry, setIndustry] = useState('Technology & SaaS');
  const [closeDate, setCloseDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 45);
    return d.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('');

  if (!isNewDealModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !company.trim()) return;

    const selectedOwner = team.find(m => m.id === ownerId) || team[0];

    addDeal({
      name: name.trim(),
      company: company.trim(),
      contactName: contactName.trim() || 'Lead Contact',
      contactEmail: contactEmail.trim() || 'contact@client.com',
      value: Number(value) || 0,
      stage,
      priority,
      owner: selectedOwner,
      groupId: groupId || groups[0]?.id,
      industry,
      closeDate,
      notes: notes.trim(),
      probability: stage === 'won' ? 100 : stage === 'negotiation' ? 85 : stage === 'proposal' ? 65 : 35
    });

    setName('');
    setCompany('');
    setContactName('');
    setContactEmail('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn select-none">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Create New Opportunity</h3>
            <p className="text-xs text-slate-500">Track a new sales lead, enterprise deal, or customer expansion.</p>
          </div>
          <button 
            onClick={() => setNewDealModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company / Organization *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Global Corp"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Deal / Project Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Enterprise Cloud Platform"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Annual Recurring Value (₱) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₱</span>
                <input
                  type="number"
                  required
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full text-xs pl-7 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Close Date
              </label>
              <input
                type="date"
                value={closeDate}
                onChange={(e) => setCloseDate(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pipeline Stage
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as any)}
                className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="lead">Lead In</option>
                <option value="contacted">Contacted</option>
                <option value="proposal">Proposal Sent</option>
                <option value="negotiation">Negotiation</option>
                <option value="won">Closed Won</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Deal Owner
              </label>
              <select
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
                className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {team.map(m => (
                  <option key={m.id} value={m.id}>{m.name.split(' ')[0]}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Contact Name
              </label>
              <input
                type="text"
                placeholder="e.g. Sarah Jenkins"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                placeholder="s.jenkins@client.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Workspace Group
              </label>
              <select
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Industry Sector
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Technology & SaaS">Technology & SaaS</option>
                <option value="Financial Services">Financial Services</option>
                <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
                <option value="Retail & E-commerce">Retail & E-commerce</option>
                <option value="Renewables & Energy">Renewables & Energy</option>
                <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Internal Deal Notes
            </label>
            <textarea
              rows={2}
              placeholder="Key stakeholders, POC criteria, competitive situation..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setNewDealModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              Create Deal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
