import React, { useState, useEffect } from 'react';
import {
  DriverChip,
  MicroIntervention,
  UserProfile,
  CheckInRecord,
  TelemetryData,
  AuthSession,
  UserAccount,
  LoopRecord,
} from './types';
import {
  getActiveProfileKey,
  loadProfiles,
  saveProfiles,
  setActiveProfileKey,
} from './services/profileStorage';
import {
  getActiveSession,
  saveActiveSession,
  logout as authLogout,
  quickDemoLogin,
} from './services/authService';
import {
  extractDriverChips,
  evaluateCounterfactualRecovery,
  updateBetaPosterior,
  AVAILABLE_INTERVENTIONS,
} from './services/mathEngine';
import {
  getStoredLoops,
  saveStoredLoops,
} from './services/loopService';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { CheckInFlow } from './components/CheckInFlow';
import { ProofCard } from './components/ProofCard';
import { ActionMemoryView } from './components/ActionMemoryView';
import { HistoryTimeline } from './components/HistoryTimeline';
import { StageDetectExplain } from './components/StageDetectExplain';
import { StageAct } from './components/StageAct';
import { StageMeasureLearn } from './components/StageMeasureLearn';
import { SomaticPacer } from './components/SomaticPacer';
import { CheckInModal } from './components/CheckInModal';
import { SafetyCrisisModal } from './components/SafetyCrisisModal';
import { AcademicFoundationModal } from './components/AcademicFoundationModal';
import { TelemetrySimulator } from './components/TelemetrySimulator';
import { GeminiDebriefModal } from './components/GeminiDebriefModal';
import { Brain, CheckCircle2, History, Sparkles, Sliders, Play, RotateCcw } from 'lucide-react';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'signup' | 'dashboard'>('dashboard');
  
  // Dashboard Sub-Tab: 'checkin' | 'proof' | 'memory' | 'history' | 'engine'
  const [dashboardTab, setDashboardTab] = useState<'checkin' | 'proof' | 'memory' | 'history' | 'engine'>('checkin');

  // Auth Session State
  const [session, setSession] = useState<AuthSession>(() => getActiveSession());

  // Profiles State
  const [profiles, setProfiles] = useState<Record<string, UserProfile>>(() => loadProfiles());
  const [activeProfileKey, setActiveKey] = useState<string>(() => {
    const s = getActiveSession();
    return s.user?.profileId || getActiveProfileKey();
  });
  const [selectedDriver, setSelectedDriver] = useState<DriverChip | null>(null);

  // Closed Loop & Personal Memory State
  const activeUserId = session.user?.id || 'usr_aarav_sharma';
  const [loops, setLoops] = useState<LoopRecord[]>(() => getStoredLoops(activeUserId));
  const [activeProofLoop, setActiveProofLoop] = useState<LoopRecord | null>(() => {
    const initial = getStoredLoops(activeUserId);
    return initial.length > 0 ? initial[0] : null;
  });

  // Modal Dialog States
  const [activePacerIntervention, setActivePacerIntervention] = useState<MicroIntervention | null>(null);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isAcademicOpen, setIsAcademicOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isGeminiDebriefOpen, setIsGeminiDebriefOpen] = useState(false);
  const [crisisLanguage, setCrisisLanguage] = useState<'english' | 'hindi' | 'kannada' | null>(null);

  // Active profile fallback
  const activeProfile = profiles[activeProfileKey] || profiles['demo-aarav'] || Object.values(profiles)[0];

  // Sync profile storage whenever profiles change
  useEffect(() => {
    saveProfiles(profiles);
  }, [profiles]);

  // Sync loops whenever loops change
  useEffect(() => {
    saveStoredLoops(loops);
  }, [loops]);

  // Update loops when user changes
  useEffect(() => {
    const userLoops = getStoredLoops(activeUserId);
    setLoops(userLoops);
    if (userLoops.length > 0) {
      setActiveProofLoop(userLoops[0]);
    }
  }, [activeUserId]);

  // Live browser tab tracking (Passive Telemetry)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && currentView === 'dashboard') {
        // Tab lost visibility (switched away)
        setProfiles((prev) => {
          const current = prev[activeProfileKey];
          if (!current) return prev;
          const updatedTelemetry: TelemetryData = {
            ...current.telemetry,
            tabSwitchesPerHour: current.telemetry.tabSwitchesPerHour + 1,
          };
          const { drivers, computedCapacity, robustZScore } = extractDriverChips(
            updatedTelemetry,
            current.baselineCapacityMAD,
            current.madSpread
          );
          return {
            ...prev,
            [activeProfileKey]: {
              ...current,
              telemetry: updatedTelemetry,
              drivers,
              currentCapacity: computedCapacity,
              robustZScore,
            },
          };
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [activeProfileKey, currentView]);

  // Auth Success Handler
  const handleAuthSuccess = (user: UserAccount) => {
    setSession({ user, isAuthenticated: true });
    const latestProfiles = loadProfiles();
    setProfiles(latestProfiles);
    setActiveKey(user.profileId);
    setActiveProfileKey(user.profileId);
    const userLoops = getStoredLoops(user.id);
    setLoops(userLoops);
    if (userLoops.length > 0) {
      setActiveProofLoop(userLoops[0]);
    }
    setDashboardTab('checkin');
    setCurrentView('dashboard');
  };

  // Switch Demo Account
  const handleSwitchDemoAccount = (demoKey: 'aarav' | 'meera' | 'alex') => {
    const user = quickDemoLogin(demoKey);
    setSession({ user, isAuthenticated: true });
    setActiveKey(user.profileId);
    setActiveProfileKey(user.profileId);
    setSelectedDriver(null);
    const userLoops = getStoredLoops(user.id);
    setLoops(userLoops);
    if (userLoops.length > 0) {
      setActiveProofLoop(userLoops[0]);
    }
    setDashboardTab('checkin');
  };

  // Logout Handler
  const handleLogout = () => {
    authLogout();
    setSession({ user: null, isAuthenticated: false });
    setCurrentView('home');
  };

  // Completed Loop Handler (from CheckInFlow)
  const handleCompleteLoop = (newLoop: LoopRecord) => {
    const updatedLoops = [newLoop, ...loops];
    setLoops(updatedLoops);
    setActiveProofLoop(newLoop);
    setDashboardTab('proof'); // Proof Card as the hero screen after every action!

    // Also update capacity score in active profile
    if (newLoop.after_score) {
      setProfiles((prev) => {
        const current = prev[activeProfileKey];
        if (!current) return prev;
        const newCap = Math.min(100, Math.max(30, current.currentCapacity + (newLoop.personal_lift || 1) * 8));
        return {
          ...prev,
          [activeProfileKey]: {
            ...current,
            currentCapacity: newCap,
          },
        };
      });
    }
  };

  // Update Telemetry via Simulator
  const handleUpdateTelemetry = (updatedTelemetry: Partial<TelemetryData>) => {
    setProfiles((prev) => {
      const current = prev[activeProfileKey];
      if (!current) return prev;
      const merged: TelemetryData = {
        ...current.telemetry,
        ...updatedTelemetry,
      };
      const { drivers, computedCapacity, robustZScore } = extractDriverChips(
        merged,
        current.baselineCapacityMAD,
        current.madSpread
      );
      return {
        ...prev,
        [activeProfileKey]: {
          ...current,
          telemetry: merged,
          drivers,
          currentCapacity: computedCapacity,
          robustZScore,
        },
      };
    });
  };

  // Preset Stressor Injection via Simulator
  const handleSimulateStressor = (type: 'midterm-cram' | 'zoom-marathon' | 'healthy-flow') => {
    let telemetryPatch: Partial<TelemetryData> = {};
    if (type === 'midterm-cram') {
      telemetryPatch = {
        tabSwitchesPerHour: 42,
        continuousWorkMinutes: 85,
        sleepHoursLastNight: 4.5,
      };
    } else if (type === 'zoom-marathon') {
      telemetryPatch = {
        meetingMinutesToday: 320,
        continuousWorkMinutes: 110,
        tabSwitchesPerHour: 18,
      };
    } else if (type === 'healthy-flow') {
      telemetryPatch = {
        tabSwitchesPerHour: 8,
        continuousWorkMinutes: 40,
        sleepHoursLastNight: 7.8,
        meetingMinutesToday: 45,
      };
    }
    handleUpdateTelemetry(telemetryPatch);
  };

  const handleResetDefaults = () => {
    const fresh = loadProfiles();
    setProfiles(fresh);
  };

  // Render Landing Page View
  if (currentView === 'home') {
    return (
      <>
        <LandingPage
          session={session}
          onNavigateLogin={() => setCurrentView('login')}
          onNavigateSignup={() => setCurrentView('signup')}
          onNavigateDashboard={() => setCurrentView('dashboard')}
          onOpenAcademicModal={() => setIsAcademicOpen(true)}
        />
        {isAcademicOpen && (
          <AcademicFoundationModal onClose={() => setIsAcademicOpen(false)} />
        )}
      </>
    );
  }

  // Render Login View
  if (currentView === 'login') {
    return (
      <AuthPage
        initialMode="login"
        onSuccess={handleAuthSuccess}
        onNavigateHome={() => setCurrentView('home')}
      />
    );
  }

  // Render Signup View
  if (currentView === 'signup') {
    return (
      <AuthPage
        initialMode="signup"
        onSuccess={handleAuthSuccess}
        onNavigateHome={() => setCurrentView('home')}
      />
    );
  }

  // Render Authenticated Dashboard View
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500/30 selection:text-teal-200">
      {/* Universal Top Bar Contract with Authenticated User Menu */}
      <Header
        session={session}
        onNavigateHome={() => setCurrentView('home')}
        onSwitchDemoAccount={handleSwitchDemoAccount}
        onLogout={handleLogout}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onOpenAcademic={() => setIsAcademicOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Navigation Tabs for Demo Evaluation */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 border-b border-slate-800">
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-semibold">
            <button
              onClick={() => setDashboardTab('checkin')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                dashboardTab === 'checkin'
                  ? 'bg-teal-400 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Close the Loop (Check In)</span>
            </button>

            {activeProofLoop && (
              <button
                onClick={() => setDashboardTab('proof')}
                className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  dashboardTab === 'proof'
                    ? 'bg-teal-400 text-slate-950 shadow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Proof Card (Hero)</span>
              </button>
            )}

            <button
              onClick={() => setDashboardTab('memory')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                dashboardTab === 'memory'
                  ? 'bg-teal-400 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Personal Memory ({loops.length})</span>
            </button>

            <button
              onClick={() => setDashboardTab('history')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                dashboardTab === 'history'
                  ? 'bg-teal-400 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>History Log</span>
            </button>

            <button
              onClick={() => setDashboardTab('engine')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                dashboardTab === 'engine'
                  ? 'bg-teal-400 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Capacity Engine (MAD)</span>
            </button>
          </div>

          {/* Quick Stats Ticker */}
          <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-slate-400">
            <span>Capacity: <strong className="text-teal-300 font-bold">{activeProfile.currentCapacity}/100</strong></span>
            <span aria-hidden="true">·</span>
            <span>Loops: <strong className="text-slate-200 font-bold">{loops.length}</strong></span>
          </div>
        </div>

        {/* View 1: Check-In Flow (Detect -> Explain -> Act -> Measure -> Hero Proof Card) */}
        {dashboardTab === 'checkin' && (
          <CheckInFlow
            userId={activeUserId}
            userName={session.user?.name || 'Aarav Sharma'}
            personalHistory={loops}
            onCompleteLoop={handleCompleteLoop}
            onLaunchPacer={() => setActivePacerIntervention(AVAILABLE_INTERVENTIONS[0])}
          />
        )}

        {/* View 2: Proof Card (The Hero Screen after every action) */}
        {dashboardTab === 'proof' && activeProofLoop && (
          <ProofCard
            loop={activeProofLoop}
            onNextWindow={() => setDashboardTab('checkin')}
            onViewMemory={() => setDashboardTab('memory')}
          />
        )}

        {/* View 3: Personal Action Memory ("What Works For Me") */}
        {dashboardTab === 'memory' && (
          <ActionMemoryView
            loops={loops}
            onTriggerCheckIn={() => setDashboardTab('checkin')}
          />
        )}

        {/* View 4: Chronological History Timeline */}
        {dashboardTab === 'history' && (
          <HistoryTimeline
            loops={loops}
            onSelectLoop={(loop) => {
              setActiveProofLoop(loop);
              setDashboardTab('proof');
            }}
          />
        )}

        {/* View 5: Advanced Capacity Engine (Robust MAD, Z-Scores, Thompson Sampling, Causal Lift) */}
        {dashboardTab === 'engine' && (
          <div className="space-y-8">
            <StageDetectExplain
              profile={activeProfile}
              onOpenCheckIn={() => setDashboardTab('checkin')}
              onOpenGeminiDebrief={() => setIsGeminiDebriefOpen(true)}
              onSelectDriver={setSelectedDriver}
              selectedDriver={selectedDriver}
            />

            <StageAct
              profile={activeProfile}
              selectedDriver={selectedDriver}
              onLaunchPacer={(intervention) => setActivePacerIntervention(intervention)}
            />

            <StageMeasureLearn profile={activeProfile} />
          </div>
        )}
      </main>

      {/* Quiet Academic & Privacy Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-6 px-4 sm:px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">MaxxLoop</span>
            <span aria-hidden="true">·</span>
            <span>ASYNC 2026 Hackathon (Wellness &amp; Lifestyle Track)</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Proof Engine Architecture</span>
            <span aria-hidden="true">·</span>
            <span>Local-First SQLite &amp; Storage Guarantee</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setCrisisLanguage('english')}
              className="text-rose-400 hover:text-rose-300 font-medium transition-colors"
            >
              Crisis Helplines (14416)
            </button>
          </div>
        </div>
      </footer>

      {/* Somatic Pacer Overlay Modal */}
      {activePacerIntervention && (
        <SomaticPacer
          intervention={activePacerIntervention}
          onComplete={(energy, focus) => {
            setActivePacerIntervention(null);
            // Complete with a loop record
            const newLoop: LoopRecord = {
              id: `loop_${Date.now()}`,
              user_id: activeUserId,
              before_score: 2,
              after_score: Math.min(5, Math.max(1, Math.round((energy + focus) / 4))),
              context: 'Midterm work',
              explanation: 'Autonomic sympathetic overdrive was down-regulated via 432Hz synchronized pacing.',
              action: activePacerIntervention.name,
              success: true,
              created_at: 'Just now',
              personal_lift: 2,
              success_rate_text: `This action improved your next window by +2. It has worked for you 4 out of 5 times in similar situations.`,
            };
            handleCompleteLoop(newLoop);
          }}
          onCancel={() => setActivePacerIntervention(null)}
        />
      )}

      {/* Clinical-Grade Safety Crisis Interceptor Modal */}
      {crisisLanguage && (
        <SafetyCrisisModal
          detectedLanguage={crisisLanguage}
          onClose={() => setCrisisLanguage(null)}
        />
      )}

      {/* 26-Paper Academic Science Inspector Modal */}
      {isAcademicOpen && (
        <AcademicFoundationModal onClose={() => setIsAcademicOpen(false)} />
      )}

      {/* Telemetry & Stressor Sandbox Simulator Drawer */}
      {isSimulatorOpen && (
        <TelemetrySimulator
          telemetry={activeProfile.telemetry}
          onUpdateTelemetry={handleUpdateTelemetry}
          onResetDefaults={handleResetDefaults}
          onSimulateStressor={handleSimulateStressor}
          onClose={() => setIsSimulatorOpen(false)}
        />
      )}

      {/* AI Gemini Phenotypic Debrief Modal */}
      {isGeminiDebriefOpen && (
        <GeminiDebriefModal
          profile={activeProfile}
          onClose={() => setIsGeminiDebriefOpen(false)}
        />
      )}
    </div>
  );
}
