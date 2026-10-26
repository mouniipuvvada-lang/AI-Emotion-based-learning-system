import React, { useState } from 'react';
import { X, Clock, HelpCircle, Sparkles, Brain, Code, Binary, Globe, Database, Lightbulb, Play } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DifficultyLevel, Domain } from '../../types';

interface QuizStartModalProps {
  domain: Domain;
  onClose: () => void;
}

export const QuizStartModal: React.FC<QuizStartModalProps> = ({ domain, onClose }) => {
  const { startQuiz } = useApp();
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(domain.defaultDifficulty);
  const [questionCount, setQuestionCount] = useState<number>(5);

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

  const Icon = getDomainIcon(domain.iconName);
  const estimatedMins = Math.ceil((questionCount * 1.5));

  const handleLaunch = () => {
    startQuiz({
      domainId: domain.id,
      difficulty,
      questionCount,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#151c2f] border border-[#242f4c] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header with animated gradient banner */}
        <div className="relative p-6 pb-8 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-[#151c2f] border-b border-[#242f4c]/70 text-center space-y-3">
          {/* Animated Domain Illustration */}
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 border border-purple-400/40 flex items-center justify-center text-white shadow-xl shadow-purple-600/30 animate-pulse">
            <Icon className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white tracking-tight">
              {domain.title}
            </h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              {domain.description}
            </p>
          </div>
        </div>

        {/* Modal Configuration Form */}
        <div className="p-6 space-y-6">
          {/* Difficulty Level Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Select Difficulty</span>
              <span className="text-[11px] font-normal text-indigo-400">Adaptive hint support</span>
            </label>

            <div className="grid grid-cols-3 gap-2">
              {(['beginner', 'intermediate', 'advanced'] as DifficultyLevel[]).map(level => {
                const isSelected = difficulty === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold capitalize border transition-all text-center ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/20'
                        : 'bg-[#101626] text-slate-400 border-[#242f4c] hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Number of Questions Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Question Count</span>
              <span className="text-[11px] font-normal text-slate-400 font-mono">Bite-sized sessions</span>
            </label>

            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 15].map(count => {
                const isSelected = questionCount === count;
                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setQuestionCount(count)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/20'
                        : 'bg-[#101626] text-slate-400 border-[#242f4c] hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {count} Questions
                  </button>
                );
              })}
            </div>
          </div>

          {/* Session Overview Stats */}
          <div className="p-3.5 rounded-xl bg-[#101626] border border-[#242f4c] grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400">Est. Duration</p>
                <p className="font-semibold text-slate-200">~{estimatedMins} minutes</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <p className="text-[11px] text-slate-400">AI Assistant</p>
                <p className="font-semibold text-slate-200">Emotion-Responsive</p>
              </div>
            </div>
          </div>

          {/* Start Quiz Action Button with glowing effect */}
          <button
            type="button"
            onClick={handleLaunch}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-600/35 border border-purple-400/40 flex items-center justify-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Quiz</span>
          </button>
        </div>
      </div>
    </div>
  );
};
