import React from 'react';
import { Sprout, Flame, Star, Calendar, Target, Compass, Lock, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AchievementsView: React.FC = () => {
  const { achievements } = useApp();

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'sprout':
        return Sprout;
      case 'flame':
        return Flame;
      case 'star':
        return Star;
      case 'calendar':
        return Calendar;
      case 'target':
        return Target;
      case 'compass':
      default:
        return Compass;
    }
  };

  const earnedCount = achievements.filter(a => a.isEarned).length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
          Achievements
        </h2>
        <p className="text-xs md:text-sm text-slate-400">
          {earnedCount} of {achievements.length} badges earned — each one is a little milestone.
        </p>
      </div>

      {/* Grid of Badges matching Screenshot 6 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {achievements.map(ach => {
          const Icon = getAchievementIcon(ach.iconName);
          const isEarned = ach.isEarned;

          return (
            <div
              key={ach.id}
              className={`relative bg-[#151c2f] border rounded-2xl p-6 transition-all shadow-md flex flex-col justify-between space-y-4 ${
                isEarned
                  ? 'border-[#242f4c] hover:border-indigo-500/40'
                  : 'border-[#242f4c]/50 opacity-75'
              }`}
            >
              {/* Lock indicator for unearned */}
              {!isEarned && (
                <div className="absolute top-5 right-5 text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
              )}

              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform ${
                  isEarned
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'bg-slate-800/40 text-slate-500 border border-slate-700/40'
                }`}
              >
                <Icon className="w-6 h-6" />
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-100">
                  {ach.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {ach.description}
                </p>
              </div>

              {/* Status pill tag & Criteria */}
              <div className="pt-2 flex items-center justify-between">
                {isEarned ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-xs font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    Earned
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800/60 border border-slate-700/40 text-slate-400 text-xs font-medium">
                    Locked
                  </span>
                )}

                {ach.earnedDate && (
                  <span className="text-[11px] font-mono text-slate-500">
                    {ach.earnedDate}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
