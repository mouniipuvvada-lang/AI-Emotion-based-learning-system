import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/navigation/Sidebar';
import { MobileBottomNav } from './components/navigation/MobileBottomNav';
import { DashboardView } from './components/dashboard/DashboardView';
import { ProgressView } from './components/progress/ProgressView';
import { AchievementsView } from './components/achievements/AchievementsView';
import { SettingsView } from './components/settings/SettingsView';
import { InteractiveQuizView } from './components/quiz/InteractiveQuizView';
import { AuthViews } from './components/auth/AuthViews';
import { Brain, Sparkles, Moon, Sun } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { isLoggedIn, activeTab, activeQuizConfig, theme, setTheme } = useApp();

  // If not logged in, render authentication screens
  if (!isLoggedIn) {
    return <AuthViews />;
  }

  // If quiz is actively in progress, present focused quiz stage
  if (activeQuizConfig) {
    return (
      <main className="min-h-screen bg-[#0c101d] text-slate-100 p-4 md:p-8 max-w-7xl mx-auto">
        <InteractiveQuizView />
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0c101d] text-slate-100">
      {/* Desktop Left Rail Navigation (Screenshot 1, 6, 7, 8, 9) */}
      <Sidebar />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        {/* Top Header Bar for Mobile / Secondary Utility */}
        <header className="flex md:hidden items-center justify-between px-5 py-4 bg-[#101626] border-b border-[#242f4c] sticky top-0 z-30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight">MindGrow</h1>
              <p className="text-[10px] text-slate-400">AI Emotion Learning</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-[#151c2f] border border-[#242f4c]"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>
        </header>

        {/* Dynamic Workspace Content Container */}
        <main className="flex-1 p-4 md:p-8 max-w-6xl w-full mx-auto">
          {activeTab === 'home' && <DashboardView />}
          {activeTab === 'progress' && <ProgressView />}
          {activeTab === 'achievements' && <AchievementsView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation for Thumb Reachability */}
      <MobileBottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
