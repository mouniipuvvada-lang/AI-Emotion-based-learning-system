import React from 'react';
import { Home, BarChart2, Award, Settings, LogOut, Brain } from 'lucide-react';
import { ActiveTab, useApp } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, user, logout } = useApp();

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'progress', label: 'My Progress', icon: BarChart2 },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getInitials = (name?: string) => {
    if (!name) return 'MP';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between bg-[#101626] border-r border-[#242f4c] h-screen sticky top-0 p-5 select-none">
      <div className="space-y-8">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-500/25">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100 tracking-tight flex items-center gap-1.5">
              MindGrow
            </h1>
            <p className="text-xs text-slate-400">Learn with emotion</p>
          </div>
        </div>

        {/* Primary Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#1e263d] text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#161e33]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Profile Section */}
      <div className="pt-4 border-t border-[#242f4c]/70 space-y-3">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-[#151c2f] border border-[#242f4c]">
          {/* Avatar / Initials */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 text-indigo-300 border border-indigo-500/40 font-semibold text-xs flex items-center justify-center shrink-0">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getInitials(user?.name)
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'Mounica Puvvada'}</p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email || 'mouniipuvvada@gmail.com'}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-300 hover:bg-rose-950/20 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};
