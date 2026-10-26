import React, { createContext, useContext, useEffect, useState } from 'react';
import { DOMAINS } from '../data/domains';
import { INITIAL_ACHIEVEMENTS, INITIAL_ATTEMPTS, INITIAL_USER } from '../data/initialState';
import { Achievement, DifficultyLevel, Domain, DomainId, QuizAttempt, ThemeMode, User } from '../types';

export type ActiveTab = 'home' | 'progress' | 'achievements' | 'settings';
export type AuthViewMode = 'login' | 'register' | 'forgot_password' | 'reset_password';

interface ActiveQuizConfig {
  domainId: DomainId;
  difficulty: DifficultyLevel;
  questionCount: number;
}

interface AppContextType {
  user: User | null;
  isLoggedIn: boolean;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  authView: AuthViewMode;
  setAuthView: (view: AuthViewMode) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  brightness: number;
  setBrightness: (val: number) => void;
  domains: Domain[];
  attempts: QuizAttempt[];
  achievements: Achievement[];
  activeQuizConfig: ActiveQuizConfig | null;
  startQuiz: (config: ActiveQuizConfig) => void;
  finishQuiz: (attempt: Omit<QuizAttempt, 'id' | 'date'>) => void;
  cancelQuiz: () => void;
  login: (email: string, pass: string) => boolean;
  loginWithGoogle: () => void;
  register: (name: string, email: string, pass: string) => boolean;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  resetPasswordRequest: (email: string) => boolean;
  quickFillDemoUser: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication & User
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('mindgrow_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_USER;
      }
    }
    return INITIAL_USER; // Default logged in as demo student
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('mindgrow_auth') !== 'false';
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [authView, setAuthView] = useState<AuthViewMode>('login');

  // Themes
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('mindgrow_theme') as ThemeMode) || user?.theme || 'dark';
  });

  const [brightness, setBrightnessState] = useState<number>(() => {
    const val = localStorage.getItem('mindgrow_brightness');
    return val ? parseInt(val, 10) : user?.brightness || 100;
  });

  // Domains progress
  const [domains, setDomains] = useState<Domain[]>(() => {
    const saved = localStorage.getItem('mindgrow_domains');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DOMAINS;
      }
    }
    return DOMAINS;
  });

  // Quiz history
  const [attempts, setAttempts] = useState<QuizAttempt[]>(() => {
    const saved = localStorage.getItem('mindgrow_attempts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ATTEMPTS;
      }
    }
    return INITIAL_ATTEMPTS;
  });

  // Achievements
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('mindgrow_achievements');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ACHIEVEMENTS;
      }
    }
    return INITIAL_ACHIEVEMENTS;
  });

  // Active Quiz
  const [activeQuizConfig, setActiveQuizConfig] = useState<ActiveQuizConfig | null>(null);

  // Apply theme & brightness to document
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('mindgrow_theme', theme);
  }, [theme]);

  useEffect(() => {
    const normalized = Math.max(60, Math.min(130, brightness)) / 100;
    document.documentElement.style.filter = `brightness(${normalized})`;
    localStorage.setItem('mindgrow_brightness', brightness.toString());
  }, [brightness]);

  // Sync user changes to storage
  useEffect(() => {
    if (user) {
      localStorage.setItem('mindgrow_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('mindgrow_user');
    }
  }, [user]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    if (user) {
      setUser({ ...user, theme: newTheme });
    }
  };

  const setBrightness = (newBrightness: number) => {
    setBrightnessState(newBrightness);
    if (user) {
      setUser({ ...user, brightness: newBrightness });
    }
  };

  const login = (email: string) => {
    const existing = user && user.email === email ? user : {
      ...INITIAL_USER,
      email,
      name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Learner',
    };
    setUser(existing);
    setIsLoggedIn(true);
    localStorage.setItem('mindgrow_auth', 'true');
    setActiveTab('home');
    return true;
  };

  const loginWithGoogle = () => {
    const googleUser: User = {
      ...INITIAL_USER,
      id: 'google_user_' + Date.now(),
      name: 'Mounica Puvvada',
      email: 'mouniipuvvada@gmail.com',
    };
    setUser(googleUser);
    setIsLoggedIn(true);
    localStorage.setItem('mindgrow_auth', 'true');
    setActiveTab('home');
  };

  const register = (name: string, email: string) => {
    const newUser: User = {
      id: 'user_' + Date.now(),
      name: name.trim() || 'MindGrow Learner',
      email: email.trim(),
      avatarUrl: '',
      streakDays: 1,
      totalQuizzes: 0,
      avgScore: 0,
      overallProgress: 0,
      cameraCheckinEnabled: true,
      studyRemindersEnabled: true,
      theme,
      brightness,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };
    setUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem('mindgrow_auth', 'true');
    setActiveTab('home');
    return true;
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('mindgrow_auth', 'false');
    setAuthView('login');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...updates });
  };

  const resetPasswordRequest = (_email: string) => {
    return true;
  };

  const quickFillDemoUser = () => {
    setUser(INITIAL_USER);
    setIsLoggedIn(true);
    localStorage.setItem('mindgrow_auth', 'true');
    setActiveTab('home');
  };

  const startQuiz = (config: ActiveQuizConfig) => {
    setActiveQuizConfig(config);
  };

  const cancelQuiz = () => {
    setActiveQuizConfig(null);
  };

  const finishQuiz = (attemptData: Omit<QuizAttempt, 'id' | 'date'>) => {
    const newAttempt: QuizAttempt = {
      ...attemptData,
      id: 'attempt-' + Date.now(),
      date: new Date().toLocaleDateString('en-US'),
    };

    const updatedAttempts = [newAttempt, ...attempts];
    setAttempts(updatedAttempts);
    localStorage.setItem('mindgrow_attempts', JSON.stringify(updatedAttempts));

    // Update domain progress
    const updatedDomains = domains.map(d => {
      if (d.id === attemptData.domainId) {
        const newScore = Math.max(d.progress, Math.min(100, Math.round(d.progress + (attemptData.scorePercentage * 0.25))));
        return { ...d, progress: newScore };
      }
      return d;
    });
    setDomains(updatedDomains);
    localStorage.setItem('mindgrow_domains', JSON.stringify(updatedDomains));

    // Update user stats
    if (user) {
      const totalQuizzes = user.totalQuizzes + 1;
      const totalScoreSum = updatedAttempts.reduce((sum, a) => sum + a.scorePercentage, 0);
      const avgScore = Math.round(totalScoreSum / updatedAttempts.length);
      const domainAvgProgress = Math.round(
        updatedDomains.reduce((acc, curr) => acc + curr.progress, 0) / updatedDomains.length
      );

      const updatedUser: User = {
        ...user,
        totalQuizzes,
        avgScore,
        overallProgress: domainAvgProgress,
        streakDays: Math.max(1, user.streakDays || 1),
      };
      setUser(updatedUser);

      // Check achievements
      const updatedAchievements = achievements.map(ach => {
        if (ach.id === 'first_steps') return { ...ach, isEarned: true, earnedDate: new Date().toLocaleDateString('en-US') };
        if (ach.id === 'high_five' && totalQuizzes >= 5) return { ...ach, isEarned: true, earnedDate: new Date().toLocaleDateString('en-US') };
        if (ach.id === 'perfect_round' && attemptData.scorePercentage === 100) return { ...ach, isEarned: true, earnedDate: new Date().toLocaleDateString('en-US') };
        if (ach.id === 'explorer') {
          const uniqueDomains = new Set(updatedAttempts.map(a => a.domainId));
          if (uniqueDomains.size >= 6) return { ...ach, isEarned: true, earnedDate: new Date().toLocaleDateString('en-US') };
        }
        return ach;
      });
      setAchievements(updatedAchievements);
      localStorage.setItem('mindgrow_achievements', JSON.stringify(updatedAchievements));
    }

    setActiveQuizConfig(null);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isLoggedIn,
        activeTab,
        setActiveTab,
        authView,
        setAuthView,
        theme,
        setTheme,
        brightness,
        setBrightness,
        domains,
        attempts,
        achievements,
        activeQuizConfig,
        startQuiz,
        finishQuiz,
        cancelQuiz,
        login,
        loginWithGoogle,
        register,
        logout,
        updateProfile,
        resetPasswordRequest,
        quickFillDemoUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
