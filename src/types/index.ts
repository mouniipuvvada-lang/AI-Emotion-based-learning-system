export type ThemeMode = 'dark' | 'light' | 'pastel' | 'nature';

export type DomainId = 'python' | 'dsa' | 'web' | 'ai' | 'dbms' | 'gk';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type EmotionType = 'neutral' | 'confused' | 'frustrated' | 'happy' | 'focused';

export interface EmotionConfidence {
  neutral: number;
  confused: number;
  frustrated: number;
  happy: number;
  focused: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  streakDays: number;
  totalQuizzes: number;
  avgScore: number;
  overallProgress: number;
  cameraCheckinEnabled: boolean;
  studyRemindersEnabled: boolean;
  theme: ThemeMode;
  brightness: number; // percentage, e.g. 100
  joinedDate: string;
}

export interface Domain {
  id: DomainId;
  title: string;
  tag: string;
  description: string;
  levelBadge: string;
  defaultDifficulty: DifficultyLevel;
  progress: number;
  accentColor: string;
  iconName: string;
}

export interface Question {
  id: string;
  domainId: DomainId;
  difficulty: DifficultyLevel;
  prompt: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  simplifiedExplanation: string;
  hint1: string; // gentle nudge
  hint2: string; // concept clue / example
  hint3: string; // strong hint
  learningTip: string;
}

export interface QuizAttempt {
  id: string;
  domainId: DomainId;
  domainTitle: string;
  date: string;
  difficulty: DifficultyLevel;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  scorePercentage: number;
  durationSeconds: number;
  emotionsDetected: EmotionType[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  isEarned: boolean;
  earnedDate?: string;
  criteria: string;
}
