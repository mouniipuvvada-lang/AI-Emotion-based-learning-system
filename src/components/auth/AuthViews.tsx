import React, { useState } from 'react';
import { Brain, LogIn, UserPlus, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuthViews: React.FC = () => {
  const { authView, setAuthView, login, loginWithGoogle, register, resetPasswordRequest, quickFillDemoUser } = useApp();

  // Login form state
  const [loginEmail, setLoginEmail] = useState<string>('mouniipuvvada@gmail.com');
  const [loginPass, setLoginPass] = useState<string>('password123');
  const [showLoginPass, setShowLoginPass] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register form state
  const [regName, setRegName] = useState<string>('Mounica Puvvada');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPass, setRegPass] = useState<string>('');
  const [regConfirmPass, setRegConfirmPass] = useState<string>('');
  const [showRegPass, setShowRegPass] = useState<boolean>(false);
  const [showRegConfirmPass, setShowRegConfirmPass] = useState<boolean>(false);
  const [regError, setRegError] = useState<string | null>(null);

  // Forgot password form state
  const [forgotEmail, setForgotEmail] = useState<string>('');
  const [forgotSuccess, setForgotSuccess] = useState<boolean>(false);

  // Reset password state
  const [resetTokenValid, setResetTokenValid] = useState<boolean>(false);
  const [newPass, setNewPass] = useState<string>('');
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPass) {
      setLoginError('Please enter both email and password.');
      return;
    }
    login(loginEmail, loginPass);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail.trim() || !regPass) {
      setRegError('Please provide an email and password.');
      return;
    }
    if (regPass.length < 6) {
      setRegError('Password must be at least 6 characters.');
      return;
    }
    if (regPass !== regConfirmPass) {
      setRegError('Passwords do not match.');
      return;
    }
    register(regName, regEmail, regPass);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    resetPasswordRequest(forgotEmail);
    setForgotSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#0c101d] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glow matching screenshots */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-purple-900/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[350px] h-[350px] bg-indigo-900/15 rounded-full blur-[100px] pointer-events-none" />

      {/* MindGrow Top Brand Lockup */}
      <div className="relative z-10 text-center space-y-2 mb-6">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 border border-purple-400/30 flex items-center justify-center text-white shadow-xl shadow-purple-600/30">
          <Brain className="w-7 h-7" />
        </div>
        <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
          MindGrow
        </h1>
        <p className="text-xs text-slate-400">
          Learn Smarter with Your Emotions
        </p>
      </div>

      {/* Main Authentication Card */}
      <div className="relative z-10 w-full max-w-md bg-[#151c2f] border border-[#242f4c] rounded-3xl p-6 md:p-8 shadow-2xl space-y-5">
        {/* ================= LOGIN VIEW ================= */}
        {authView === 'login' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center gap-3 pb-1">
              <div className="w-9 h-9 rounded-xl bg-[#1d2742] border border-[#2c3a5e] flex items-center justify-center text-indigo-400">
                <LogIn className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  Welcome back
                </h2>
                <p className="text-xs text-slate-400">Log in to keep growing</p>
              </div>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={loginWithGoogle}
              className="w-full py-2.5 px-4 rounded-xl bg-[#101626] hover:bg-[#182138] border border-[#242f4c] hover:border-slate-600 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              {/* Google SVG G mark */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* OR Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px bg-[#242f4c] flex-1" />
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">OR</span>
              <div className="h-px bg-[#242f4c] flex-1" />
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Email Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#101626] border border-[#242f4c] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => setAuthView('forgot_password')}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type={showLoginPass ? 'text' : 'password'}
                    value={loginPass}
                    onChange={e => setLoginPass(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#101626] border border-[#242f4c] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPass(!showLoginPass)}
                    className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
              >
                Login
              </button>
            </form>

            <div className="text-center pt-2 text-xs text-slate-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthView('register')}
                className="text-indigo-400 font-semibold hover:underline"
              >
                Sign up
              </button>
            </div>
          </div>
        )}

        {/* ================= REGISTER VIEW ================= */}
        {authView === 'register' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center gap-3 pb-1">
              <div className="w-9 h-9 rounded-xl bg-[#1d2742] border border-[#2c3a5e] flex items-center justify-center text-indigo-400">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  Create your account
                </h2>
                <p className="text-xs text-slate-400">Sign up to get started</p>
              </div>
            </div>

            <button
              type="button"
              onClick={loginWithGoogle}
              className="w-full py-2.5 px-4 rounded-xl bg-[#101626] hover:bg-[#182138] border border-[#242f4c] hover:border-slate-600 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="h-px bg-[#242f4c] flex-1" />
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">OR</span>
              <div className="h-px bg-[#242f4c] flex-1" />
            </div>

            {regError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{regError}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Name</label>
                <input
                  type="text"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#101626] border border-[#242f4c] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#101626] border border-[#242f4c] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type={showRegPass ? 'text' : 'password'}
                    value={regPass}
                    onChange={e => setRegPass(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#101626] border border-[#242f4c] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPass(!showRegPass)}
                    className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                  >
                    {showRegPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type={showRegConfirmPass ? 'text' : 'password'}
                    value={regConfirmPass}
                    onChange={e => setRegConfirmPass(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#101626] border border-[#242f4c] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegConfirmPass(!showRegConfirmPass)}
                    className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                  >
                    {showRegConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
              >
                Create account
              </button>
            </form>

            <div className="text-center pt-2 text-xs text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthView('login')}
                className="text-indigo-400 font-semibold hover:underline"
              >
                Log in
              </button>
            </div>
          </div>
        )}

        {/* ================= FORGOT PASSWORD VIEW ================= */}
        {authView === 'forgot_password' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center gap-3 pb-1">
              <div className="w-9 h-9 rounded-xl bg-[#1d2742] border border-[#2c3a5e] flex items-center justify-center text-indigo-400">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  Reset password
                </h2>
                <p className="text-xs text-slate-400">We'll send you a link to reset it</p>
              </div>
            </div>

            {forgotSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Password reset link sent!
                </div>
                <p className="text-[11px] leading-relaxed">
                  We sent instructions to <span className="font-mono">{forgotEmail}</span>.
                  You can also simulate clicking the reset link below:
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setResetTokenValid(true);
                    setAuthView('reset_password');
                  }}
                  className="mt-2 text-xs font-semibold text-emerald-300 underline"
                >
                  Click here to simulate opening password reset link →
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Email address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#101626] border border-[#242f4c] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                >
                  Send reset link
                </button>
              </form>
            )}

            <div className="pt-2 text-center space-y-2 text-xs">
              <button
                type="button"
                onClick={() => setAuthView('login')}
                className="text-indigo-400 font-semibold hover:underline block mx-auto"
              >
                ← Back to log in
              </button>
            </div>
          </div>
        )}

        {/* ================= RESET PASSWORD VIEW ================= */}
        {authView === 'reset_password' && (
          <div className="space-y-5 animate-fadeIn">
            {!resetTokenValid ? (
              // Missing/invalid reset link screen matching screenshot 4
              <div className="space-y-4 text-center">
                <div className="w-10 h-10 mx-auto rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Invalid reset link
                  </h3>
                  <p className="text-xs text-slate-400">
                    This password reset link is missing or invalid.
                  </p>
                </div>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  The link you used appears to be incomplete. Please request a new password reset email.
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setAuthView('forgot_password')}
                    className="text-xs font-semibold text-indigo-400 hover:underline"
                  >
                    Request a new link
                  </button>
                </div>
              </div>
            ) : (
              // Active reset password form
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Set a new password
                  </h3>
                  <p className="text-xs text-slate-400">
                    Enter your new secure password below.
                  </p>
                </div>

                {resetSuccess ? (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs">
                    Password updated successfully!
                    <button
                      type="button"
                      onClick={() => setAuthView('login')}
                      className="block mt-2 font-bold underline"
                    >
                      Log in now →
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      if (newPass.length < 6) return;
                      setResetSuccess(true);
                    }}
                    className="space-y-3"
                  >
                    <input
                      type="password"
                      value={newPass}
                      onChange={e => setNewPass(e.target.value)}
                      placeholder="New password (min 6 chars)"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#101626] border border-[#242f4c] text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs"
                    >
                      Save New Password
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        )}

        {/* Back to MindGrow shortcut link */}
        <div className="pt-2 border-t border-[#242f4c]/50 text-center">
          <button
            type="button"
            onClick={quickFillDemoUser}
            className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors inline-flex items-center gap-1"
          >
            ← Back to MindGrow (Quick Demo Login)
          </button>
        </div>
      </div>
    </div>
  );
};
