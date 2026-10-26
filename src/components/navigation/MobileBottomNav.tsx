import React from 'react';
import { Home, BarChart2, Award, Settings } from 'lucide-react';
import { ActiveTab, useApp } from '../../context/AppContext';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'progress', label: 'Progress', icon: BarChart2 },
    { id: 'achievements', label: 'Badges', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#101626]/95 backdrop-blur-lg border-t border-[#242f4c] px-4 py-2 flex items-center justify-around">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium transition-colors ${
              isActive ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
