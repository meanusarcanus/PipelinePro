import React from 'react';
import { DealItem, TeamMember } from '../../types/crm';
import { Avatar } from '../common/Avatar';
import { Trophy, Award } from 'lucide-react';

interface RepLeaderboardProps {
  deals: DealItem[];
  team: TeamMember[];
}

export const RepLeaderboard: React.FC<RepLeaderboardProps> = ({ deals, team }) => {
  const quotaTarget = 300000;

  const repPerformance = team.map(member => {
    const memberDeals = deals.filter(d => d.owner.id === member.id);
    const wonDeals = memberDeals.filter(d => d.stage === 'won');
    const closedArr = wonDeals.reduce((sum, d) => sum + d.value, 0);
    const activeArr = memberDeals.filter(d => d.stage !== 'won' && d.stage !== 'lost').reduce((sum, d) => sum + d.value, 0);
    const winRate = memberDeals.length ? Math.round((wonDeals.length / memberDeals.length) * 100) : 0;
    const attainment = Math.round((closedArr / quotaTarget) * 100);

    return {
      member,
      totalDeals: memberDeals.length,
      closedArr,
      activeArr,
      winRate,
      attainment
    };
  }).sort((a, b) => b.closedArr - a.closedArr);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500" />
            Account Executive Leaderboard
          </h3>
          <p className="text-xs text-slate-400">Quarterly quota attainment & win velocity</p>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
          Target: ₱300k
        </span>
      </div>

      <div className="space-y-3.5">
        {repPerformance.map((rep, idx) => (
          <div key={rep.member.id} className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                  idx === 0 ? 'bg-amber-400 text-slate-900' : idx === 1 ? 'bg-slate-300 text-slate-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  {idx + 1}
                </span>
                <Avatar user={rep.member} size="sm" />
                <div>
                  <div className="text-xs font-bold text-slate-800">{rep.member.name}</div>
                  <div className="text-[10px] text-slate-400">{rep.member.role}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-extrabold text-slate-900">
                  ₱{rep.closedArr.toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold">
                  {rep.attainment}% of quota
                </div>
              </div>
            </div>

            {/* Quota bar */}
            <div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    rep.attainment >= 100 ? 'bg-[#00c875]' : rep.attainment >= 50 ? 'bg-blue-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(100, rep.attainment)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>{rep.totalDeals} Total Deals</span>
                <span>Win Rate: <strong className="text-slate-700">{rep.winRate}%</strong></span>
                <span>In Flight: <strong className="text-slate-700">₱{(rep.activeArr / 1000).toFixed(0)}k</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
