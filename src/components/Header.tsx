import React, { useState, useRef, useEffect } from 'react';
import {
  BookOpen,
  Check,
  ChevronDown,
  ExternalLink,
  Home,
  LogOut,
  Shield,
  Sliders,
  Sparkles,
  User,
  Users,
} from 'lucide-react';
import { AuthSession, UserAccount } from '../types';

interface HeaderProps {
  session: AuthSession;
  onNavigateHome: () => void;
  onSwitchDemoAccount: (demoKey: 'aarav' | 'meera' | 'alex') => void;
  onLogout: () => void;
  onOpenSimulator: () => void;
  onOpenAcademic: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  session,
  onNavigateHome,
  onSwitchDemoAccount,
  onLogout,
  onOpenSimulator,
  onOpenAcademic,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const user = session.user;

  // Click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onNavigateHome}
            className="text-xl font-bold tracking-tight text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
            title="Go to MaxxLoop Landing Page"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
            <span>MaxxLoop</span>
          </button>
          <button
            onClick={onNavigateHome}
            className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors ml-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
        </div>

        {/* Zone 2: Five-Stage Closed Loop Links / Indicators */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-slate-400">
          <span className="text-teal-400 font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            1. Detect
          </span>
          <span className="text-slate-600">→</span>
          <span className="text-teal-300">2. Explain</span>
          <span className="text-slate-600">→</span>
          <span className="text-cyan-400 font-semibold">3. Act (n=1)</span>
          <span className="text-slate-600">→</span>
          <span className="text-slate-300">4. Measure (Causal)</span>
          <span className="text-slate-600">→</span>
          <span className="text-slate-300">5. Learn (Bayesian)</span>
        </nav>

        {/* Zone 3: Actions & Authenticated User Profile Menu */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Telemetry Simulator Trigger */}
          <button
            onClick={onOpenSimulator}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors"
            title="Open Telemetry & Stressor Simulator"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Simulator</span>
          </button>

          {/* Academic Foundation Modal Trigger */}
          <button
            onClick={onOpenAcademic}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors"
            title="Inspect 26-Paper Academic Foundation"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">26 Papers</span>
          </button>

          {/* Authenticated User Avatar & Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 transition-colors text-xs text-left"
            >
              <div className="w-6 h-6 rounded-lg bg-teal-500/20 border border-teal-500/40 text-teal-300 font-bold font-mono text-[10px] flex items-center justify-center">
                {user?.avatarInitials || 'US'}
              </div>
              <div className="hidden sm:block">
                <span className="font-semibold text-slate-200 block truncate max-w-[110px]">
                  {user?.name || 'Student User'}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 text-xs space-y-3">
                {/* User Info Header */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="font-bold text-slate-100 text-sm">{user?.name}</div>
                  <div className="font-mono text-[11px] text-teal-400 truncate">{user?.email}</div>
                  <div className="text-[11px] text-slate-400 mt-1 truncate">{user?.role}</div>
                  {user?.institution && (
                    <div className="text-[10px] text-slate-500 mt-0.5">{user.institution}</div>
                  )}
                </div>

                {/* Quick Persona Switcher for Evaluation */}
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-1 mb-1 block">
                    ⚡ Quick Demo Accounts (Judges)
                  </span>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        onSwitchDemoAccount('aarav');
                        setMenuOpen(false);
                      }}
                      className={`w-full p-2 rounded-lg text-left transition-colors flex items-center justify-between ${
                        user?.email === 'aarav.sharma@campus.edu'
                          ? 'bg-slate-800 text-teal-300 font-semibold'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div>
                        <div>🎓 Aarav Sharma (CS)</div>
                        <div className="text-[10px] text-slate-400">Exam Crunch · 42 tabs/hr</div>
                      </div>
                      {user?.email === 'aarav.sharma@campus.edu' && <Check className="w-3.5 h-3.5 text-teal-400" />}
                    </button>

                    <button
                      onClick={() => {
                        onSwitchDemoAccount('meera');
                        setMenuOpen(false);
                      }}
                      className={`w-full p-2 rounded-lg text-left transition-colors flex items-center justify-between ${
                        user?.email === 'meera.patel@techscale.io'
                          ? 'bg-slate-800 text-teal-300 font-semibold'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div>
                        <div>💼 Meera Patel (PM)</div>
                        <div className="text-[10px] text-slate-400">Zoom Fatigue · 310m load</div>
                      </div>
                      {user?.email === 'meera.patel@techscale.io' && <Check className="w-3.5 h-3.5 text-teal-400" />}
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-slate-800 space-y-1">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onNavigateHome();
                    }}
                    className="w-full p-2 rounded-lg text-left hover:bg-slate-800 text-slate-300 transition-colors flex items-center gap-2"
                  >
                    <Home className="w-3.5 h-3.5 text-slate-400" />
                    <span>Return to Home Page</span>
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full p-2 rounded-lg text-left hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
