import React, { useState } from 'react';
import {
  Flame,
  Trophy,
  Target,
  Sparkles,
  ArrowRight,
  Code,
  Binary,
  Globe,
  Brain,
  Database,
  Lightbulb,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Domain, DomainId } from '../../types';
import { QuizStartModal } from '../quiz/QuizStartModal';

export const DashboardView: React.FC = () => {
  const { user, domains, setActiveTab } = useApp();
  const [selectedDomainForQuiz, setSelectedDomainForQuiz] = useState<Domain | null>(null);

  const getDomainIcon = (iconName: string) => {
    switch (iconName) {
      case 'code':
        return Code;
      case 'binary':
        return Binary;
      case 'globe':
        return Globe;
      case 'brain':
        return Brain;
      case 'database':
        return Database;
      case 'lightbulb':
      default:
        return Lightbulb;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#171f36] via-[#1a233d] to-[#161d31] border border-[#242f4c] p-6 md:p-8 shadow-xl">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <p className="text-xs md:text-sm font-medium text-indigo-300 flex items-center gap-1.5">
            Welcome back, {user?.name || 'Mounica Puvvada'}! 👋
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Ready to grow your mind today?
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Pick a domain, answer a few questions, and let MindGrow adapt hints to how you learn.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setSelectedDomainForQuiz(domains[0])}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs md:text-sm shadow-lg shadow-purple-600/25 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Start a quiz</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('progress')}
              className="px-4 py-2.5 rounded-xl bg-[#1c263f]/70 hover:bg-[#232f4e] text-slate-200 border border-[#2c3a5c] font-medium text-xs md:text-sm transition-all cursor-pointer"
            >
              See my progress
            </button>
          </div>
        </div>
      </div>

      {/* 4 Bento Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Day streak */}
        <div className="bg-[#151c2f] border border-[#242f4c] rounded-2xl p-5 space-y-3 shadow-md">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold font-mono text-slate-100 tabular-nums">
              {user?.streakDays ?? 0}
            </div>
            <p className="text-xs text-slate-400 font-medium">Day streak</p>
          </div>
        </div>

        {/* Quizzes done */}
        <div className="bg-[#151c2f] border border-[#242f4c] rounded-2xl p-5 space-y-3 shadow-md">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold font-mono text-slate-100 tabular-nums">
              {user?.totalQuizzes ?? 6}
            </div>
            <p className="text-xs text-slate-400 font-medium">Quizzes done</p>
          </div>
        </div>

        {/* Avg. score */}
        <div className="bg-[#151c2f] border border-[#242f4c] rounded-2xl p-5 space-y-3 shadow-md">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold font-mono text-slate-100 tabular-nums">
              {user?.avgScore ?? 70}%
            </div>
            <p className="text-xs text-slate-400 font-medium">Avg. score</p>
          </div>
        </div>

        {/* Overall progress */}
        <div className="bg-[#151c2f] border border-[#242f4c] rounded-2xl p-5 space-y-3 shadow-md">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold font-mono text-slate-100 tabular-nums">
              {user?.overallProgress ?? 83}%
            </div>
            <p className="text-xs text-slate-400 font-medium">Overall progress</p>
          </div>
        </div>
      </div>

      {/* Learning Domains Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-100 tracking-tight">
            Learning domains
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {domains.length} domains
          </span>
        </div>

        {/* 3x2 Grid of Domains matching Screenshots */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {domains.map(domain => {
            const Icon = getDomainIcon(domain.iconName);
            return (
              <div
                key={domain.id}
                onClick={() => setSelectedDomainForQuiz(domain)}
                className="group relative bg-[#151c2f] hover:bg-[#1a233b] border border-[#242f4c] hover:border-indigo-500/40 rounded-2xl p-5 transition-all shadow-md flex flex-col justify-between cursor-pointer space-y-4"
              >
                {/* Top header inside card */}
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#1d2742] border border-[#2d3a5e] flex items-center justify-center text-indigo-300 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium px-2 py-0.5 rounded-full bg-[#1c253d] border border-[#283556]">
                    {domain.levelBadge}
                  </span>
                </div>

                {/* Domain details */}
                <div className="space-y-1.5 flex-1">
                  <h4 className="text-base font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                    {domain.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {domain.description}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 text-[11px]">Mastery</span>
                    <span className="font-mono font-medium text-slate-300 text-[11px]">
                      {domain.progress}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#0e1424] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
                      style={{ width: `${domain.progress}%` }}
                    />
                  </div>
                </div>

                {/* Start Learning Link */}
                <div className="pt-2 border-t border-[#242f4c]/50 flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                  <span className="flex items-center gap-1">
                    Start learning
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[11px] font-normal text-slate-500 group-hover:text-slate-400">
                    Adaptive hints
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quiz Start Configuration Modal */}
      {selectedDomainForQuiz && (
        <QuizStartModal
          domain={selectedDomainForQuiz}
          onClose={() => setSelectedDomainForQuiz(null)}
        />
      )}
    </div>
  );
};
