import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Clock,
  RotateCcw,
  Sparkles,
  Coffee,
  Award,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { QUESTIONS } from '../../data/domains';
import { EmotionConfidence, EmotionType, Question } from '../../types';
import { EmotionDetector } from './EmotionDetector';
import { RobotAssistant } from '../common/RobotAssistant';

export const InteractiveQuizView: React.FC = () => {
  const { activeQuizConfig, cancelQuiz, finishQuiz, domains } = useApp();

  // Find domain details
  const domain = domains.find(d => d.id === activeQuizConfig?.domainId) || domains[0];

  // Filter questions for this domain and difficulty (or fallback to domain questions)
  const [questions, setQuestions] = useState<Question[]>(() => {
    if (!activeQuizConfig) return [];
    let pool = QUESTIONS.filter(q => q.domainId === activeQuizConfig.domainId);
    if (pool.length === 0) pool = QUESTIONS;

    // Sort by chosen difficulty if available, otherwise include adjacent
    const matched = pool.filter(q => q.difficulty === activeQuizConfig.difficulty);
    const finalPool = matched.length >= activeQuizConfig.questionCount
      ? matched
      : [...matched, ...pool.filter(q => q.difficulty !== activeQuizConfig.difficulty)];

    return finalPool.slice(0, activeQuizConfig.questionCount);
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, { selected: number; isCorrect: boolean }>>({});
  const [emotionsHistory, setEmotionsHistory] = useState<EmotionType[]>([]);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionType>('focused');

  // Breather modal state
  const [isBreatherActive, setIsBreatherActive] = useState<boolean>(false);
  const [breatherSeconds, setBreatherSeconds] = useState<number>(30);

  // Results summary state
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [startTime] = useState<number>(Date.now());

  const currentQuestion = questions[currentIndex] || questions[0];
  const isLastQuestion = currentIndex === questions.length - 1;

  // Handle Breather countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBreatherActive && breatherSeconds > 0) {
      timer = setInterval(() => {
        setBreatherSeconds(prev => prev - 1);
      }, 1000);
    } else if (isBreatherActive && breatherSeconds === 0) {
      setIsBreatherActive(false);
      setBreatherSeconds(30);
    }
    return () => clearInterval(timer);
  }, [isBreatherActive, breatherSeconds]);

  // Handle emotion callbacks
  const handleEmotionDetected = (emotion: EmotionType, _conf: EmotionConfidence) => {
    setCurrentEmotion(emotion);
    setEmotionsHistory(prev => [...prev.slice(-20), emotion]);
  };

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return; // Prevent changing after submission until Try Again
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    const isCorrect = selectedOption === currentQuestion.correctIndex;
    setIsSubmitted(true);

    setUserAnswers(prev => ({
      ...prev,
      [currentIndex]: { selected: selectedOption, isCorrect },
    }));

    if (isCorrect) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  const handleTryAgain = () => {
    setIsSubmitted(false);
    setSelectedOption(null);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleCompleteQuiz();
    } else {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      // Restore answer state if previously answered
      if (userAnswers[nextIndex] !== undefined) {
        setSelectedOption(userAnswers[nextIndex].selected);
        setIsSubmitted(true);
      } else {
        setSelectedOption(null);
        setIsSubmitted(false);
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      if (userAnswers[prevIndex] !== undefined) {
        setSelectedOption(userAnswers[prevIndex].selected);
        setIsSubmitted(true);
      } else {
        setSelectedOption(null);
        setIsSubmitted(false);
      }
    }
  };

  const handleCompleteQuiz = () => {
    const total = questions.length;
    let correct = 0;
    let incorrect = 0;
    let skipped = 0;

    for (let i = 0; i < total; i++) {
      if (userAnswers[i] !== undefined) {
        if (userAnswers[i].isCorrect) correct++;
        else incorrect++;
      } else {
        skipped++;
      }
    }

    const scorePercentage = Math.round((correct / total) * 100);
    const duration = Math.round((Date.now() - startTime) / 1000);

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
    });

    setQuizCompleted(true);

    // Save attempt in context
    if (activeQuizConfig) {
      finishQuiz({
        domainId: activeQuizConfig.domainId,
        domainTitle: domain.title,
        difficulty: activeQuizConfig.difficulty,
        totalQuestions: total,
        correctCount: correct,
        incorrectCount: incorrect,
        skippedCount: skipped,
        scorePercentage,
        durationSeconds: duration,
        emotionsDetected: emotionsHistory.length > 0 ? emotionsHistory : ['focused', 'happy'],
      });
    }
  };

  if (!activeQuizConfig || questions.length === 0) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-slate-300">No active quiz found.</p>
        <button
          onClick={cancelQuiz}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Quiz Results Summary Screen
  if (quizCompleted) {
    const total = questions.length;
    const answeredCount = Object.keys(userAnswers).length;
    const correctCount = Object.values(userAnswers).filter(a => a.isCorrect).length;
    const scorePct = Math.round((correctCount / total) * 100);

    return (
      <div className="max-w-2xl mx-auto space-y-6 py-6 animate-fadeIn">
        <div className="bg-[#151c2f] border border-[#242f4c] rounded-3xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-purple-600/30">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">
              Quiz Completed!
            </h2>
            <p className="text-xs text-slate-300">
              Great effort on {domain.title}! Your progress has been updated.
            </p>
          </div>

          {/* Score breakdown metrics */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#101626] border border-[#242f4c]">
            <div>
              <p className="text-xs text-slate-400">Score</p>
              <p className="text-2xl font-bold font-mono text-indigo-400 tabular-nums">
                {scorePct}%
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Correct</p>
              <p className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                {correctCount} / {total}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Mastery Boost</p>
              <p className="text-2xl font-bold font-mono text-purple-400 tabular-nums">
                +{Math.round(scorePct * 0.25)}%
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={cancelQuiz}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs md:text-sm shadow-lg shadow-purple-600/30 hover:from-purple-500 hover:to-indigo-500 transition-all cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Answer states
  const isAnswered = isSubmitted;
  const isCurrentCorrect = isSubmitted && selectedOption === currentQuestion.correctIndex;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Quiz Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#151c2f] border border-[#242f4c] shadow-lg">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={cancelQuiz}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-[#1c253d] transition-colors"
            title="Exit quiz"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              {domain.title}
              <span className="text-[11px] font-mono text-indigo-300 font-medium px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-700/40 capitalize">
                {activeQuizConfig.difficulty}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Question {currentIndex + 1} of {questions.length}
            </p>
          </div>
        </div>

        {/* Linear Progress bar */}
        <div className="w-full md:w-64 space-y-1.5">
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>Progress</span>
            <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-[#0e1424] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main 2-Zone Workspace Split: Left (Question & Options) + Right (Emotion Tracker & AI Robot) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Zone: Question Stage (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Question Box */}
          <div className="bg-[#151c2f] border border-[#242f4c] rounded-2xl p-6 shadow-xl space-y-5">
            {/* Question prompt */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                Question {currentIndex + 1}
              </span>
              <h2 className="text-lg md:text-xl font-bold text-slate-100 leading-snug">
                {currentQuestion.prompt}
              </h2>
            </div>

            {/* Code snippet if question contains one */}
            {currentQuestion.codeSnippet && (
              <div className="rounded-xl bg-[#090d16] border border-[#232d4b] p-4 font-mono text-xs text-indigo-200 overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
                {currentQuestion.codeSnippet}
              </div>
            )}

            {/* 4 Multiple Choice Option Cards */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((optionText, idx) => {
                const optionLetter = String.fromCharCode(65 + idx);
                const isSelected = selectedOption === idx;
                const isCorrectOption = idx === currentQuestion.correctIndex;

                let optionStyles = 'bg-[#101626] border-[#242f4c] text-slate-300 hover:border-indigo-500/50 hover:bg-[#161f36]';

                if (isSubmitted) {
                  if (isCorrectOption) {
                    optionStyles = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500';
                  } else if (isSelected && !isCorrectOption) {
                    optionStyles = 'bg-rose-950/40 border-rose-500 text-rose-200 ring-1 ring-rose-500';
                  } else {
                    optionStyles = 'bg-[#101626]/50 border-[#242f4c]/50 text-slate-500 opacity-60';
                  }
                } else if (isSelected) {
                  optionStyles = 'bg-[#1e263d] border-indigo-500 text-indigo-200 ring-1 ring-indigo-500 shadow-md shadow-indigo-500/10';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isSubmitted}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-3 text-sm font-medium ${optionStyles} ${
                      !isSubmitted ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-[#182138] border border-[#2b3759] text-xs font-mono font-bold flex items-center justify-center text-slate-300 shrink-0">
                        {optionLetter}
                      </span>
                      <span>{optionText}</span>
                    </div>

                    {isSubmitted && isCorrectOption && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {isSubmitted && isSelected && !isCorrectOption && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Control Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#242f4c]/60">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={handlePrev}
                  className="px-3.5 py-2 rounded-xl bg-[#101626] text-slate-300 border border-[#242f4c] hover:bg-[#182138] disabled:opacity-40 disabled:pointer-events-none text-xs font-medium transition-all"
                >
                  Previous
                </button>

                {isSubmitted && !isCurrentCorrect && (
                  <button
                    type="button"
                    onClick={handleTryAgain}
                    className="px-3.5 py-2 rounded-xl bg-amber-600/20 text-amber-300 border border-amber-500/40 hover:bg-amber-600/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Try Again
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {!isSubmitted ? (
                  <button
                    type="button"
                    disabled={selectedOption === null}
                    onClick={handleSubmitAnswer}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs md:text-sm shadow-lg shadow-purple-600/30 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs md:text-sm shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-purple-500 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>{isLastQuestion ? 'Finish Quiz' : 'Next Question'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Immediate Answer Explanation Card */}
          {isSubmitted && (
            <div className={`p-5 rounded-2xl border transition-all animate-fadeIn space-y-3 ${
              isCurrentCorrect
                ? 'bg-emerald-950/30 border-emerald-500/40'
                : 'bg-[#151c2f] border-[#242f4c]'
            }`}>
              <div className="flex items-center gap-2">
                {isCurrentCorrect ? (
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    Correct! Fantastic deduction.
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                    <XCircle className="w-5 h-5" />
                    Not quite. Let’s learn from this!
                  </div>
                )}
              </div>

              <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                {currentQuestion.explanation}
              </p>

              {/* Learning Tip Box */}
              <div className="p-3 rounded-xl bg-[#101626] border border-[#242f4c] text-xs text-amber-200/90 flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-amber-300">Pro-Tip: </span>
                  {currentQuestion.learningTip}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Zone: AI Emotion & Mindy Assistant Deck (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Emotion Detector Module */}
          <EmotionDetector
            onEmotionDetected={handleEmotionDetected}
            onRequestHint={() => {
              // Scroll or highlight hints
            }}
            onTakeBreak={() => {
              setIsBreatherActive(true);
              setBreatherSeconds(30);
            }}
          />

          {/* Mindy Robot Assistant Module */}
          <RobotAssistant
            question={currentQuestion}
            currentEmotion={currentEmotion}
            onTryAgain={handleTryAgain}
            onRevealExplanation={() => setIsSubmitted(true)}
            isAnswerSubmitted={isSubmitted}
            isCorrect={isCurrentCorrect}
          />
        </div>
      </div>

      {/* 30-Second Breather Modal (when frustration triggered or requested) */}
      {isBreatherActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#151c2f] border border-[#242f4c] rounded-3xl p-6 md:p-8 max-w-sm w-full text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Coffee className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white tracking-tight">
                Quick 30s Mind Reset
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Inhale deeply... exhale slowly. Let your brain reset before tackling the next challenge.
              </p>
            </div>

            {/* Circular or big countdown */}
            <div className="text-4xl font-black font-mono text-indigo-400 tabular-nums">
              00:{breatherSeconds.toString().padStart(2, '0')}
            </div>

            <button
              type="button"
              onClick={() => setIsBreatherActive(false)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
            >
              I’m Ready to Resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
