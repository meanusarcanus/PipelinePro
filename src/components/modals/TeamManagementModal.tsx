import React, { useState } from 'react';
import { 
  X, 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Trash2, 
  Check, 
  Sparkles, 
  AlertCircle,
  Mail,
  Briefcase,
  User,
  ArrowRight,
  Crown
} from 'lucide-react';
import { useCrmStore } from '../../store/useCrmStore';
import { Avatar } from '../common/Avatar';
import { TeamMember } from '../../types/crm';

const ROLES = [
  'Account Executive',
  'Senior Enterprise AE',
  'VP of Sales',
  'Commercial Sales Lead',
  'Lead Solutions Architect',
  'Customer Success Manager',
  'Deal Desk & Legal Counsel',
  'Sales Development Rep (SDR)'
];

const BRAND_COLORS = [
  '#00c875', // Monday Emerald
  '#579bfc', // Monday Electric Blue
  '#a25ddc', // Monday Purple
  '#fdab3d', // Monday Amber
  '#e2445c', // Rose
  '#6366f1', // Indigo
  '#06b6d4', // Cyan
  '#ec4899'  // Pink
];

export const TeamManagementModal: React.FC = () => {
  const { 
    isTeamModalOpen, 
    setTeamModalOpen, 
    team, 
    currentUser, 
    switchUser, 
    addTeamMember, 
    removeTeamMember 
  } = useCrmStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(ROLES[0]);
  const [selectedColor, setSelectedColor] = useState(BRAND_COLORS[0]);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isTeamModalOpen) return null;

  const MAX_SEATS = 10;
  const usedSeats = team.length;
  const remainingSeats = Math.max(0, MAX_SEATS - usedSeats);
  const isFull = usedSeats >= MAX_SEATS;
  const percentage = Math.min(100, Math.round((usedSeats / MAX_SEATS) * 100));

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter the team member full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid corporate email address.');
      return;
    }

    setIsSubmitting(true);
    const result = addTeamMember({
      name: name.trim(),
      email: email.trim(),
      role,
      color: selectedColor
    });

    setIsSubmitting(false);

    if (result.success) {
      setName('');
      setEmail('');
      setRole(ROLES[0]);
      setErrorMsg('');
    } else {
      setErrorMsg(result.message);
    }
  };

  const handleRemoveUser = (member: TeamMember) => {
    if (confirm(`Remove ${member.name} (${member.role}) from commercial seats? This will free up 1 license seat.`)) {
      removeTeamMember(member.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn select-none">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Team & Commercial Seats
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Commercial License
                </span>
              </div>
              <p className="text-xs text-slate-400">Manage user personas, license seat allocations, and rep permissions.</p>
            </div>
          </div>

          <button 
            onClick={() => setTeamModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Seat Meter Banner */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Commercial Plan Quota: 10 Seats
                </span>
              </div>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                isFull 
                  ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                  : remainingSeats <= 2 
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}>
                {usedSeats} / {MAX_SEATS} Seats Used ({remainingSeats} Available)
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  isFull ? 'bg-rose-500' : remainingSeats <= 2 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            
            <p className="text-[11px] text-slate-500 mt-2">
              {isFull 
                ? '⚠️ You have utilized all 10 commercial seats. Remove an existing user to invite a new member.' 
                : `You can add ${remainingSeats} more team member${remainingSeats > 1 ? 's' : ''} under your current commercial license.`}
            </p>
          </div>

          {/* Add Team Member Form */}
          <div className="p-4 rounded-xl border border-slate-200/90 bg-white shadow-2xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <UserPlus className="w-4 h-4 text-blue-600" />
              Add New User to Commercial Roster
            </h3>

            {errorMsg && (
              <div className="mb-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleAddUser} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Name */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      disabled={isFull}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Gabriel Reyes"
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Work Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      disabled={isFull}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. gabriel.reyes@pipelinepro.io"
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                {/* Role */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Job Role / Persona *
                  </label>
                  <div className="relative">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      disabled={isFull}
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50 appearance-none"
                    >
                      {ROLES.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Color Swatch & Add Button */}
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Theme Color
                    </label>
                    <div className="flex items-center gap-1.5">
                      {BRAND_COLORS.slice(0, 5).map(c => (
                        <button
                          key={c}
                          type="button"
                          disabled={isFull}
                          onClick={() => setSelectedColor(c)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                            selectedColor === c ? 'ring-2 ring-offset-1 ring-slate-900 scale-110' : 'opacity-80 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: c }}
                        >
                          {selectedColor === c && <Check className="w-3 h-3 text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isFull || isSubmitting}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg shadow-sm transition-all active:scale-95 shrink-0 flex items-center gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Assign Seat</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Active Team Roster */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-500" />
                Active Team Roster ({usedSeats}/10)
              </h3>
              <span className="text-[11px] text-slate-400">Click persona to test as that user</span>
            </div>

            <div className="space-y-2">
              {team.map((member) => {
                const isCurrent = currentUser.id === member.id;

                return (
                  <div
                    key={member.id}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isCurrent 
                        ? 'bg-blue-50/60 border-blue-200' 
                        : 'bg-white border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar user={member} size="md" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {member.name}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white">
                              Active Session
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate flex items-center gap-2 mt-0.5">
                          <span className="truncate">{member.email}</span>
                          <span className="text-slate-300">•</span>
                          <span className="font-medium text-slate-600 truncate">{member.role}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {!isCurrent && (
                        <button
                          onClick={() => switchUser(member)}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-white hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                          title="Switch to this persona for testing"
                        >
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>Switch</span>
                        </button>
                      )}

                      {!isCurrent && team.length > 1 && (
                        <button
                          onClick={() => handleRemoveUser(member)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Remove user and free up 1 license seat"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Commercial Single-Tenant License • 10 Seats Maximum</span>
          </div>

          <button
            onClick={() => setTeamModalOpen(false)}
            className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
