import React, { useState } from 'react';
import { User as UserIcon, Sun, Moon, Palette, Camera, Bell, Check, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ThemeMode } from '../../types';

export const SettingsView: React.FC = () => {
  const { user, updateProfile, theme, setTheme, brightness, setBrightness } = useApp();

  const [name, setName] = useState<string>(user?.name || 'Mounica Puvvada');
  const [email, setEmail] = useState<string>(user?.email || 'mouniipuvvada@gmail.com');
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatarUrl || '');
  const [cameraCheckin, setCameraCheckin] = useState<boolean>(user?.cameraCheckinEnabled ?? true);
  const [studyReminders, setStudyReminders] = useState<boolean>(user?.studyRemindersEnabled ?? true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      avatarUrl,
      cameraCheckinEnabled: cameraCheckin,
      studyRemindersEnabled: studyReminders,
    });
    showToast('Profile and preferences saved successfully!');
  };

  const themes: {
    id: ThemeMode;
    label: string;
    colors: string[];
    desc: string;
  }[] = [
    {
      id: 'light',
      label: 'Light',
      colors: ['#ffffff', '#818cf8', '#bae6fd'],
      desc: 'White, lavender, and soft blue',
    },
    {
      id: 'pastel',
      label: 'Pastel',
      colors: ['#f472b6', '#c084fc', '#bae6fd'],
      desc: 'Pink, lavender, and baby blue',
    },
    {
      id: 'dark',
      label: 'Dark',
      colors: ['#0f172a', '#818cf8', '#38bdf8'],
      desc: 'Dark navy with purple accents',
    },
    {
      id: 'nature',
      label: 'Nature',
      colors: ['#f0fdf4', '#10b981', '#fef08a'],
      desc: 'Mint green and soft cream',
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-950 border border-emerald-500 text-emerald-200 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
          Settings
        </h2>
        <p className="text-xs md:text-sm text-slate-400">
          Make MindGrow feel like yours.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-[#151c2f] border border-[#242f4c] rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#242f4c]/60">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <UserIcon className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-100">Profile</h3>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#101626] border border-[#242f4c] text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="Your full name"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#101626] border border-[#242f4c] text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Profile image URL</label>
            <input
              type="url"
              value={avatarUrl}
              onChange={e => setAvatarUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#101626] border border-[#242f4c] text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="https://.../photo.jpg"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-purple-600/25 cursor-pointer"
          >
            Save profile
          </button>
        </form>
      </div>

      {/* Appearance & Themes Card */}
      <div className="bg-[#151c2f] border border-[#242f4c] rounded-2xl p-6 shadow-xl space-y-6">
        <div className="space-y-1 pb-3 border-b border-[#242f4c]/60">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-400" />
            Appearance
          </h3>
          <p className="text-xs text-slate-400">
            Choose a theme — it is saved to your profile.
          </p>
        </div>

        {/* 4 Theme Option Buttons with Color Swatches */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {themes.map(t => {
            const isSelected = theme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTheme(t.id);
                  showToast(`Theme changed to ${t.label}!`);
                }}
                className={`p-3.5 rounded-2xl border text-left space-y-2.5 transition-all ${
                  isSelected
                    ? 'bg-[#1e263d] border-indigo-500 ring-2 ring-indigo-500/30'
                    : 'bg-[#101626] border-[#242f4c] hover:border-slate-700'
                }`}
              >
                {/* 3 Color swatch pills */}
                <div className="flex items-center gap-1.5">
                  {t.colors.map((c, i) => (
                    <div
                      key={i}
                      className="w-5 h-4 rounded-full border border-black/20"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-indigo-400 ml-auto" />
                  )}
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-200">{t.label}</p>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{t.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Brightness / Intensity Slider */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              Brightness
            </span>
            <span className="font-mono text-slate-400">{brightness}%</span>
          </div>

          <input
            type="range"
            min="70"
            max="120"
            step="2"
            value={brightness}
            onChange={e => setBrightness(parseInt(e.target.value, 10))}
            className="w-full accent-indigo-500 cursor-pointer"
          />

          <p className="text-[11px] text-slate-500 leading-normal">
            Dims the app for comfortable viewing. This changes the app's appearance, not your physical screen.
          </p>
        </div>
      </div>

      {/* Camera & Notifications Settings Card */}
      <div className="bg-[#151c2f] border border-[#242f4c] rounded-2xl p-6 shadow-xl space-y-5">
        <div className="pb-3 border-b border-[#242f4c]/60">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-400" />
            Camera & notifications
          </h3>
        </div>

        <div className="space-y-4">
          {/* Allow emotion check-ins toggle */}
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-slate-200">
                Allow emotion check-ins
              </p>
              <p className="text-[11px] text-slate-400 leading-normal max-w-lg">
                MindGrow asks before using your camera, and you can turn it off during any quiz.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const nextVal = !cameraCheckin;
                setCameraCheckin(nextVal);
                updateProfile({ cameraCheckinEnabled: nextVal });
                showToast(`Emotion check-ins ${nextVal ? 'enabled' : 'disabled'}`);
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                cameraCheckin ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  cameraCheckin ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Study reminders toggle */}
          <div className="flex items-center justify-between gap-4 pt-3 border-t border-[#242f4c]/50">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-slate-200">
                Study reminders
              </p>
              <p className="text-[11px] text-slate-400 leading-normal max-w-lg">
                Gentle nudges to keep your streak going.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const nextVal = !studyReminders;
                setStudyReminders(nextVal);
                updateProfile({ studyRemindersEnabled: nextVal });
                showToast(`Study reminders ${nextVal ? 'enabled' : 'disabled'}`);
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                studyReminders ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  studyReminders ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
