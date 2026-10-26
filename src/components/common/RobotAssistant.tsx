import React, { useState } from 'react';
import { Sparkles, Lightbulb, HelpCircle, RefreshCw, BookOpen, ChevronRight, MessageSquare, Bot } from 'lucide-react';
import { EmotionType, Question } from '../../types';

interface RobotAssistantProps {
  question: Question;
  currentEmotion: EmotionType;
  onTryAgain?: () => void;
  onRevealExplanation?: () => void;
  isAnswerSubmitted?: boolean;
  isCorrect?: boolean;
}

export const RobotAssistant: React.FC<RobotAssistantProps> = ({
  question,
  currentEmotion,
  onTryAgain,
  onRevealExplanation,
  isAnswerSubmitted,
  isCorrect,
}) => {
  const [hintStage, setHintStage] = useState<number>(0); // 0 = none, 1 = nudge, 2 = concept clue, 3 = strong hint
  const [showSimpler, setShowSimpler] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(true);

  // Determine robot emotion/expression
  let robotMood: 'happy' | 'thinking' | 'encouraging' | 'cheering' = 'thinking';
  let speechBubbleText = "Hi! I'm Mindy, your AI learning buddy. Take your time, you've got this!";

  if (isAnswerSubmitted) {
    if (isCorrect) {
      robotMood = 'cheering';
      speechBubbleText = "Woohoo! Outstanding job! That's spot on! 🎉";
    } else {
      robotMood = 'encouraging';
      speechBubbleText = "Don't worry at all! Making mistakes is how the brain creates new neural pathways. Check out the hint below or try again!";
    }
  } else if (currentEmotion === 'confused') {
    robotMood = 'encouraging';
    speechBubbleText = "I noticed you might be pausing or feeling a bit confused. Would you like a small nudge to help get unstuck?";
  } else if (currentEmotion === 'frustrated') {
    robotMood = 'encouraging';
    speechBubbleText = "Deep breath! New concepts take a moment to click. Let's break this down into bite-sized pieces together.";
  } else if (currentEmotion === 'happy') {
    robotMood = 'happy';
    speechBubbleText = "Looking great and focused! Keep up that awesome flow!";
  } else if (hintStage === 1) {
    speechBubbleText = "Here's a gentle nudge: look closely at the keywords in the question.";
  } else if (hintStage === 2) {
    speechBubbleText = "Let's connect this with an example or core rule!";
  } else if (hintStage === 3) {
    speechBubbleText = "Almost there! This clue should make the solution crystal clear.";
  }

  return (
    <div className="bg-[#151c2f] border border-[#242f4c] rounded-2xl p-4 md:p-5 shadow-xl transition-all">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#242f4c]/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
              Mindy AI Assistant
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-indigo-900/40 text-indigo-300 border border-indigo-700/40">
                Staged Tutor
              </span>
            </h4>
            <p className="text-xs text-slate-400">Emotion-adaptive learning guide</p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs text-slate-400 hover:text-slate-200 transition-colors px-2 py-1 rounded hover:bg-[#1c253d]"
        >
          {isOpen ? 'Minimize' : 'Expand'}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 space-y-4">
          {/* Cute Robot Visual & Speech Bubble */}
          <div className="flex items-start gap-3.5">
            {/* Robot SVG Avatar */}
            <div className="shrink-0 relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-indigo-500/30 flex items-center justify-center p-1 relative overflow-hidden animate-robot">
                {/* Robot face SVG */}
                <svg viewBox="0 0 64 64" className="w-12 h-12">
                  {/* Antenna */}
                  <line x1="32" y1="12" x2="32" y2="4" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="32" cy="4" r="3.5" fill={robotMood === 'cheering' ? '#34d399' : '#818cf8'}>
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
                  </circle>

                  {/* Head */}
                  <rect x="14" y="12" width="36" height="32" rx="10" fill="#1e263d" stroke="#6366f1" strokeWidth="2" />
                  {/* Ear pods */}
                  <rect x="10" y="22" width="4" height="12" rx="2" fill="#818cf8" />
                  <rect x="50" y="22" width="4" height="12" rx="2" fill="#818cf8" />

                  {/* Face screen */}
                  <rect x="19" y="17" width="26" height="20" rx="6" fill="#0b0f19" />

                  {/* Eyes depending on mood */}
                  {robotMood === 'cheering' ? (
                    <>
                      {/* Happy curved eyes */}
                      <path d="M 23 27 Q 27 22 31 27" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
                      <path d="M 33 27 Q 37 22 41 27" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
                    </>
                  ) : robotMood === 'happy' ? (
                    <>
                      <circle cx="26" cy="26" r="3" fill="#38bdf8" />
                      <circle cx="38" cy="26" r="3" fill="#38bdf8" />
                    </>
                  ) : robotMood === 'encouraging' ? (
                    <>
                      <circle cx="26" cy="26" r="3" fill="#a78bfa" />
                      <circle cx="38" cy="26" r="3" fill="#a78bfa" />
                      <path d="M 27 33 Q 32 36 37 33" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
                    </>
                  ) : (
                    <>
                      {/* Thinking eyes blinking */}
                      <circle cx="26" cy="26" r="2.8" fill="#818cf8" />
                      <circle cx="38" cy="26" r="2.8" fill="#818cf8" />
                      <line x1="28" y1="33" x2="36" y2="33" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" />
                    </>
                  )}

                  {/* Cheeks */}
                  <circle cx="21" cy="30" r="1.5" fill="#f472b6" opacity="0.6" />
                  <circle cx="43" cy="30" r="1.5" fill="#f472b6" opacity="0.6" />
                </svg>
              </div>
            </div>

            {/* Speech bubble */}
            <div className="flex-1 bg-[#1c253d] border border-[#242f4c] rounded-xl p-3 text-xs text-slate-200 relative">
              <div className="absolute -left-2 top-3 w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-[#1c253d] border-b-[6px] border-b-transparent" />
              <p className="leading-relaxed">{speechBubbleText}</p>
            </div>
          </div>

          {/* Staged Hints Stepper */}
          <div className="bg-[#101626] border border-[#242f4c] rounded-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                Staged Intelligent Hints
              </span>
              <span className="text-[11px] text-slate-400">
                Stage {hintStage} of 3
              </span>
            </div>

            {/* Progress indicators for 3 stages */}
            <div className="grid grid-cols-3 gap-1.5">
              <div
                className={`h-1.5 rounded-full transition-colors ${
                  hintStage >= 1 ? 'bg-indigo-500' : 'bg-slate-700/60'
                }`}
              />
              <div
                className={`h-1.5 rounded-full transition-colors ${
                  hintStage >= 2 ? 'bg-indigo-500' : 'bg-slate-700/60'
                }`}
              />
              <div
                className={`h-1.5 rounded-full transition-colors ${
                  hintStage >= 3 ? 'bg-indigo-500' : 'bg-slate-700/60'
                }`}
              />
            </div>

            {/* Hint content per stage */}
            {hintStage === 0 && (
              <p className="text-xs text-slate-400 italic">
                Feeling unsure? Tap "Need a hint" below to reveal a gentle clue without spoiling the answer!
              </p>
            )}

            {hintStage >= 1 && (
              <div className="p-2.5 rounded-lg bg-[#151c2f] border border-indigo-500/30 text-xs text-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 text-indigo-400 font-medium">
                  <span>Level 1 · Gentle Nudge:</span>
                </div>
                <p>{question.hint1}</p>
              </div>
            )}

            {hintStage >= 2 && (
              <div className="p-2.5 rounded-lg bg-[#151c2f] border border-purple-500/30 text-xs text-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 text-purple-400 font-medium">
                  <span>Level 2 · Concept Clue:</span>
                </div>
                <p>{question.hint2}</p>
              </div>
            )}

            {hintStage >= 3 && (
              <div className="p-2.5 rounded-lg bg-[#151c2f] border border-amber-500/30 text-xs text-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                  <span>Level 3 · Key Pointer:</span>
                </div>
                <p>{question.hint3}</p>
              </div>
            )}

            {/* Hint Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {hintStage < 3 && !isAnswerSubmitted && (
                <button
                  type="button"
                  onClick={() => setHintStage(prev => Math.min(3, prev + 1))}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600/30 transition-all flex items-center gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  {hintStage === 0 ? 'Need a hint?' : `Reveal Level ${hintStage + 1} hint`}
                </button>
              )}

              {/* Explain More Simply Button */}
              <button
                type="button"
                onClick={() => setShowSimpler(!showSimpler)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/40 hover:bg-purple-600/30 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {showSimpler ? 'Hide simplified view' : 'Explain more simply'}
              </button>

              {/* Reset hints */}
              {hintStage > 0 && !isAnswerSubmitted && (
                <button
                  type="button"
                  onClick={() => setHintStage(0)}
                  className="text-xs text-slate-400 hover:text-slate-200 ml-auto px-2 py-1 rounded"
                >
                  Reset hints
                </button>
              )}
            </div>

            {/* Simplified Analogy Box */}
            {showSimpler && (
              <div className="mt-2.5 p-3 rounded-lg bg-purple-950/40 border border-purple-700/50 text-xs text-purple-200 space-y-1.5">
                <div className="font-semibold text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  Everyday Analogy & Simple Explanation:
                </div>
                <p className="leading-relaxed">{question.simplifiedExplanation}</p>
              </div>
            )}
          </div>

          {/* Post-Answer Controls */}
          {isAnswerSubmitted && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {!isCorrect && onTryAgain && (
                <button
                  type="button"
                  onClick={onTryAgain}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-600/20 text-amber-300 border border-amber-500/40 hover:bg-amber-600/30 transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Try Again
                </button>
              )}

              {onRevealExplanation && (
                <button
                  type="button"
                  onClick={onRevealExplanation}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-700/40 text-slate-200 border border-slate-600/40 hover:bg-slate-700/60 transition-all flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Show Full Explanation
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
