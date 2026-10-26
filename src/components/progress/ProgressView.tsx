import React, { useState } from 'react';
import {
  Target,
  CheckCircle2,
  Trophy,
  Flame,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  BarChart,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Domain } from '../../types';
import { QuizStartModal } from '../quiz/QuizStartModal';

export const ProgressView: React.FC = () => {
  const { user, domains, attempts } = useApp();
  const [practiceDomain, setPracticeDomain] = useState<Domain | null>(null);

  // Compute answers breakdown
  const totalCorrect = attempts.reduce((sum, a) => sum + a.correctCount, 0);
  const totalIncorrect = attempts.reduce((sum, a) => sum + a.incorrectCount, 0);
  const totalSkipped = attempts.reduce((sum, a) => sum + a.skippedCount, 0);
  const totalAnswered = totalCorrect + totalIncorrect;
  const accuracyPct = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 82;

  // Find weakest domain needing practice
  const sortedByLowest = [...domains].sort((a, b) => a.progress - b.progress);
  const weakestDomain = sortedByLowest[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
          Your Progress
        </h2>
        <p className="text-xs md:text-sm text-slate-400">
          Every quiz grows your map a little further.
        </p>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall progress */}
        <div className="bg-[#151c2f] border border-[#242f4c] rounded-2xl p-5 space-y-2 shadow-md">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
          <div className="text-2xl md:text-3xl font-bold font-mono text-slate-100 tabular-nums">
            {user?.overallProgress ?? 83}%
          </div>
          <p className="text-xs text-slate-400 font-medium">Overall progress</p>
        </div>

        {/* Accuracy */}
        <div className="bg-[#151c2f] border border-[#242f4c] rounded-2xl p-5 space-y-2 shadow-md">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl md:text-3xl font-bold font-mono text-slate-100 tabular-nums">
            {accuracyPct}%
          </div>
          <p className="text-xs text-slate-400 font-medium">Accuracy</p>
        </div>

        {/* Quizzes done */}
        <div className="bg-[#151c2f] border border-[#242f4c] rounded-2xl p-5 space-y-2 shadow-md">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Trophy className="w-4 h-4" />
          </div>
          <div className="text-2xl md:text-3xl font-bold font-mono text-slate-100 tabular-nums">
            {attempts.length}
          </div>
          <p className="text-xs text-slate-400 font-medium">Quizzes done</p>
        </div>

        {/* Day streak */}
        <div className="bg-[#151c2f] border border-[#242f4c] rounded-2xl p-5 space-y-2 shadow-md">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Flame className="w-4 h-4" />
          </div>
          <div className="text-2xl md:text-3xl font-bold font-mono text-slate-100 tabular-nums">
            {user?.streakDays ?? 0}
          </div>
          <p className="text-xs text-slate-400 font-medium">Day streak</p>
        </div>
      </div>

      {/* Bento Grid: Chart + Breakdown & Needs Practice */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Domain-wise progress bar chart (8 cols on lg) */}
        <div className="lg:col-span-8 bg-[#151c2f] border border-[#242f4c] rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 tracking-tight">
              Domain-wise progress
            </h3>
            <span className="text-xs text-slate-400 font-mono">Mastery %</span>
          </div>

          {/* Interactive Chart Container */}
          <div className="h-64 flex items-end gap-4 md:gap-8 pt-8 pb-4 px-2 border-b border-[#242f4c]/70 relative">
            {/* Horizontal guide lines */}
            <div className="absolute inset-x-0 top-0 border-b border-dashed border-[#242f4c]/40 text-[10px] text-slate-500 pl-1">
              100%
            </div>
            <div className="absolute inset-x-0 top-1/4 border-b border-dashed border-[#242f4c]/40 text-[10px] text-slate-500 pl-1">
              75%
            </div>
            <div className="absolute inset-x-0 top-2/4 border-b border-dashed border-[#242f4c]/40 text-[10px] text-slate-500 pl-1">
              50%
            </div>
            <div className="absolute inset-x-0 top-3/4 border-b border-dashed border-[#242f4c]/40 text-[10px] text-slate-500 pl-1">
              25%
            </div>

            {/* Bars for each of the 6 domains */}
            {domains.map(d => {
              const barHeightPct = Math.max(d.progress, 4); // min 4% for zero so label aligns
              return (
                <div
                  key={d.id}
                  className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
                  onClick={() => setPracticeDomain(d)}
                >
                  {/* Floating tooltip on hover */}
                  <div className="absolute -top-9 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-700 text-white text-[11px] font-mono px-2 py-0.5 rounded shadow-lg pointer-events-none z-10 whitespace-nowrap">
                    {d.title}: {d.progress}%
                  </div>

                  {/* Vertical bar */}
                  <div
                    className="w-full max-w-[44px] rounded-t-lg transition-all duration-700 group-hover:brightness-110 relative overflow-hidden"
                    style={{
                      height: `${barHeightPct}%`,
                      backgroundColor: d.accentColor,
                    }}
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* X-axis domain tag label */}
                  <span className="text-[11px] text-slate-400 group-hover:text-slate-200 mt-2 truncate w-full text-center">
                    {d.tag}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Answer Breakdown & Needs Practice (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Answer Breakdown Card */}
          <div className="bg-[#151c2f] border border-[#242f4c] rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-slate-100 tracking-tight">
              Answer breakdown
            </h3>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#101626] border border-[#242f4c] text-xs">
                <span className="text-emerald-400 font-medium">Correct</span>
                <span className="font-mono font-bold text-emerald-400 text-sm tabular-nums">
                  {totalCorrect}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-[#101626] border border-[#242f4c] text-xs">
                <span className="text-rose-400 font-medium">Incorrect</span>
                <span className="font-mono font-bold text-rose-400 text-sm tabular-nums">
                  {totalIncorrect}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-[#101626] border border-[#242f4c] text-xs">
                <span className="text-slate-400 font-medium">Skipped</span>
                <span className="font-mono font-bold text-slate-400 text-sm tabular-nums">
                  {totalSkipped}
                </span>
              </div>
            </div>
          </div>

          {/* Needs Practice Highlight Card */}
          <div className="bg-[#151c2f] border border-[#242f4c] rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              Needs practice
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-100">{weakestDomain.title}</p>
                <p className="text-xs text-slate-400 font-mono">Current mastery: {weakestDomain.progress}%</p>
              </div>

              <button
                type="button"
                onClick={() => setPracticeDomain(weakestDomain)}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-semibold flex items-center gap-1 transition-all"
              >
                Practice
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Quizzes List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-100 tracking-tight">
          Recent quizzes
        </h3>

        <div className="bg-[#151c2f] border border-[#242f4c] rounded-2xl divide-y divide-[#242f4c]/60 shadow-xl overflow-hidden">
          {attempts.map(attempt => (
            <div
              key={attempt.id}
              className="p-4 md:px-6 flex items-center justify-between hover:bg-[#1a233b] transition-colors"
            >
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-100">
                  {attempt.domainTitle}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    {attempt.date}
                  </span>
                  <span>·</span>
                  <span className="capitalize">{attempt.difficulty}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono font-bold text-indigo-400 text-sm md:text-base tabular-nums">
                  {attempt.scorePercentage}%
                </span>
                <p className="text-[11px] text-slate-400">
                  {attempt.correctCount}/{attempt.totalQuestions} correct
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz Modal if user clicked Practice */}
      {practiceDomain && (
        <QuizStartModal
          domain={practiceDomain}
          onClose={() => setPracticeDomain(null)}
        />
      )}
    </div>
  );
};
