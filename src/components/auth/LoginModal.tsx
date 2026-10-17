import React, { useState } from 'react';
import { X, Lock, Mail, ArrowRight, UserCheck, ShieldCheck, Sparkles, UserPlus } from 'lucide-react';
import { useCrmStore } from '../../store/useCrmStore';
import { Avatar } from '../common/Avatar';
import { Logo } from '../common/Logo';
import { TeamMember } from '../../types/crm';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setLoginModalOpen, team, login, setTeamModalOpen } = useCrmStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isLoginModalOpen) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = team.find(m => m.email.toLowerCase() === email.toLowerCase()) || team[0];
    login(matched);
  };

  const handlePersonaSelect = (member: TeamMember) => {
    login(member);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn select-none">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-tr from-[#1e2238] to-[#2d325a] text-white relative">
          <button 
            onClick={() => setLoginModalOpen(false)}
            className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <Logo size="md" />
            <div>
              <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                PipelinePro Authentication
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  SSO & RBAC
                </span>
              </h2>
              <p className="text-xs text-slate-300">Sign in to access your sales workspace & operations desk.</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Quick 1-Click Persona Selector (Essential for testing all roles) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Quick 1-Click Persona Login
              </span>
              <span className="text-[11px] text-slate-400">Select any role to test</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {team.map((member) => (
                <button
                  key={member.id}
                  onClick={() => handlePersonaSelect(member)}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition-all group"
                >
                  <Avatar user={member} size="md" />
                  <div className="truncate flex-1">
                    <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600 truncate">
                      {member.name}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate font-medium">
                      {member.role}
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                </button>
              ))}

              {team.length < 10 ? (
                <button
                  type="button"
                  onClick={() => {
                    setLoginModalOpen(false);
                    setTeamModalOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-blue-300 bg-blue-50/50 hover:bg-blue-100/60 text-blue-700 transition-all text-xs font-semibold col-span-1 sm:col-span-2"
                >
                  <UserPlus className="w-4 h-4 text-blue-600" />
                  <span>+ Add New User / Manage Seats ({team.length}/10 seats)</span>
                </button>
              ) : (
                <div className="flex items-center justify-center p-2 rounded-xl bg-slate-100 text-slate-500 text-[11px] font-medium col-span-1 sm:col-span-2">
                  Commercial license capacity reached (10/10 seats utilized)
                </div>
              )}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase">Or sign in with email</span>
          </div>

          {/* Traditional login form */}
          <form onSubmit={handleCustomLogin} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="alex.morgan@pipelinepro.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              Sign In to PipelinePro
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
