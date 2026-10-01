import React, { useState } from 'react';
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock,
  ExternalLink,
  Flame,
  Heart,
  Layers,
  Play,
  RotateCcw,
  Shield,
  ShieldAlert,
  Sparkles,
  Volume2,
  Zap,
} from 'lucide-react';
import { AuthSession } from '../types';
import { audioEngine } from '../services/audioEngine';

interface LandingPageProps {
  session: AuthSession;
  onNavigateLogin: () => void;
  onNavigateSignup: () => void;
  onNavigateDashboard: () => void;
  onOpenAcademicModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  session,
  onNavigateLogin,
  onNavigateSignup,
  onNavigateDashboard,
  onOpenAcademicModal,
}) => {
  const [audioTesting, setAudioTesting] = useState(false);

  const handleTestChime = (phase: 'inhale' | 'hold' | 'exhale' | 'complete') => {
    audioEngine.playChime(phase);
    setAudioTesting(true);
    setTimeout(() => setAudioTesting(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500/30 selection:text-teal-200">
      {/* Top Bar Contract */}
      <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-xl font-bold tracking-tight text-white">MaxxLoop</span>
          </div>

          {/* Zone 2: 4-6 Clean text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <a href="#closed-loop" className="hover:text-slate-200 transition-colors">
              The Closed Loop
            </a>
            <a href="#hicks-law" className="hover:text-slate-200 transition-colors">
              Hick&apos;s Law (n=1)
            </a>
            <a href="#causal-inference" className="hover:text-slate-200 transition-colors">
              Causal Inference
            </a>
            <a href="#somatic-audio" className="hover:text-slate-200 transition-colors">
              432Hz Somatics
            </a>
            <button
              onClick={onOpenAcademicModal}
              className="hover:text-amber-300 text-slate-400 transition-colors"
            >
              26 Academic Papers
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-3">
            {session.isAuthenticated ? (
              <button
                onClick={onNavigateDashboard}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl transition-all shadow-md shadow-teal-500/20 active:scale-[0.98]"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button
                  onClick={onNavigateLogin}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={onNavigateSignup}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl transition-all shadow-md shadow-teal-500/20 active:scale-[0.98]"
                >
                  Get Started Free
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-teal-500/10 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          {/* Metadata Discipline: Clean unboxed text with separators */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-teal-400 mb-6">
            <span>Wellness &amp; Lifestyle Track</span>
            <span aria-hidden="true">·</span>
            <span>ASYNC 2026 Hackathon</span>
            <span aria-hidden="true">·</span>
            <span>Local-First Causal Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]" style={{ textWrap: 'balance' }}>
            The Closed-Loop AI Companion for Student Focus &amp; Recovery
          </h1>

          <p className="text-base sm:text-lg text-slate-300 mt-6 max-w-2xl mx-auto leading-relaxed">
            Eliminate cognitive choice paralysis and burnout despair. MaxxLoop replaces passive graphing with robust MAD statistics, Bayesian Thompson Sampling, and counterfactual recovery measurement.
          </p>

          {/* Single Dominant Primary CTA + Clean Demo Shortcut */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={session.isAuthenticated ? onNavigateDashboard : onNavigateSignup}
              className="w-full sm:w-auto px-7 py-3.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-teal-400/20 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>{session.isAuthenticated ? 'Go to Personal Dashboard' : 'Create Free Student Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onNavigateLogin}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <span>⚡ 1-Click Demo Sign In</span>
            </button>
          </div>

          {/* Academic Proof Adjacency */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 font-mono">
            <span>Hick&apos;s Law (n=1 UX)</span>
            <span aria-hidden="true">·</span>
            <span>Robust Rolling MAD (50% Breakdown)</span>
            <span aria-hidden="true">·</span>
            <span>Rubin Causal Inference</span>
            <span aria-hidden="true">·</span>
            <span>432Hz Web Audio</span>
          </div>

          {/* Hero Interactive Preview Card */}
          <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl text-left relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <span className="text-xs font-semibold text-teal-400 block mb-1">
                  Live Closed-Loop Telemetry Engine
                </span>
                <h3 className="text-xl font-bold text-white">
                  Capacity Calibration &amp; Driver Synthesis
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Audio Preview:</span>
                <button
                  onClick={() => handleTestChime('inhale')}
                  className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs font-medium text-teal-300 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>432Hz Inhale Chime</span>
                </button>
                <button
                  onClick={() => handleTestChime('complete')}
                  className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs font-medium text-teal-300 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <span>Harmonic Triad</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {/* Stat 1 */}
              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                <span className="text-xs font-medium text-slate-400 block">Current Capacity</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-bold font-mono text-rose-400">56</span>
                  <span className="text-xs font-mono text-slate-400">/ 100</span>
                </div>
                <span className="text-xs text-rose-400 font-semibold block mt-1">
                  -22.0 pts Deficit (MAD Z: -2.7)
                </span>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  Robust MAD baseline remains stable at 78/100, immune to cramming outliers.
                </p>
              </div>

              {/* Stat 2 */}
              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                <span className="text-xs font-medium text-slate-400 block">Z-Score Stressor Chip</span>
                <span className="text-base font-bold text-slate-100 block mt-1">
                  Context Switching 3.5x
                </span>
                <span className="text-xs font-mono text-amber-400 font-medium block mt-1">
                  42 tab switches / hour
                </span>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  Working memory buffer saturates, triggering sympathetic hyper-tone.
                </p>
              </div>

              {/* Stat 3 */}
              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                <span className="text-xs font-medium text-slate-400 block">Bandit Recommendation</span>
                <span className="text-base font-bold text-teal-300 block mt-1">
                  4x4 Box Breathing
                </span>
                <span className="text-xs font-mono text-teal-400 font-medium block mt-1">
                  Strict n=1 UX (2 Minutes)
                </span>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  Optimal vagal nerve deceleration sampled via Beta(9, 2) posterior.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: The Three Fatal Flaws of Open-Loop Wellness */}
      <section id="closed-loop" className="w-full py-16 sm:py-24 border-t border-slate-800/80 bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 block mb-1">
              The Open-Loop Problem
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Why Existing Wellness Apps Fail Students
            </h2>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">
              Most productivity apps are open loops: they passively record your exhaustion without mathematically curing it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold font-mono">
                01
              </div>
              <h3 className="text-base font-bold text-slate-100">Decision Paralysis (Hick&apos;s Law)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bombarding an exhausted brain with 50+ guided meditations causes decision latency to spike logarithmically, producing a <strong className="text-rose-300 font-semibold">67% abandonment rate</strong>.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold font-mono">
                02
              </div>
              <h3 className="text-base font-bold text-slate-100">Biometric Despair</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Displaying a bright red dashboard showing you got 4 hours of sleep without offering an immediate somatic antidote only increases pre-exam anxiety and helpless rumination.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold font-mono">
                03
              </div>
              <h3 className="text-base font-bold text-slate-100">No Causal Measurement</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Apps assume advice worked simply because time passed. They fail to subtract natural fatigue decay, confusing spontaneous rest with genuine intervention efficacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: The 5-Stage Closed-Loop Architecture */}
      <section className="w-full py-16 sm:py-24 border-t border-slate-800/80 bg-slate-900/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-400 block mb-1">
              The MaxxLoop Solution
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              The 5-Stage Closed-Loop Capacity Engine
            </h2>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">
              Every stage mathematically connects to the next, turning passive tracking into an active neuro-somatic reset.
            </p>
          </div>

          <div className="space-y-4">
            {/* Stage 1 */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
                  <span>STAGE 01</span>
                  <span aria-hidden="true">·</span>
                  <span>PASSIVE &amp; ACTIVE TELEMETRY</span>
                </div>
                <h3 className="text-lg font-bold text-white">1. Detect: Robust Rolling MAD Baselining</h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                  Ingests lightweight passive metrics (browser tab-switch frequency, continuous work minutes) plus a 10-second check-in. Uses Robust Median Absolute Deviation (50% breakdown point) so all-nighters never distort your biological baseline.
                </p>
              </div>
              <span className="font-mono text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg shrink-0">
                M_i = 0.6745(X_i - X̃) / MAD
              </span>
            </div>

            {/* Stage 2 */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
                  <span>STAGE 02</span>
                  <span aria-hidden="true">·</span>
                  <span>ROOT CAUSE EXPOSURE</span>
                </div>
                <h3 className="text-lg font-bold text-white">2. Explain: Explainable Z-Score Driver Chips</h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                  Isolates acute capacity drops into precise, readable chips: Context Switching (e.g. 42 tabs/hr vs 12 baseline), Circadian Debt, or Continuous Screen Strain. No black-box magic.
                </p>
              </div>
              <span className="font-mono text-xs text-cyan-400 bg-slate-800 px-3 py-1.5 rounded-lg shrink-0">
                Z-Score Driver Isolation
              </span>
            </div>

            {/* Stage 3 */}
            <div id="hicks-law" className="p-6 rounded-3xl bg-slate-900 border border-teal-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
                  <span>STAGE 03</span>
                  <span aria-hidden="true">·</span>
                  <span>HICK&apos;S LAW CONSTITUTION</span>
                </div>
                <h3 className="text-lg font-bold text-white">3. Act: Strict n=1 Thompson Sampling</h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                  Recommends exactly ONE high-leverage micro-intervention (1-5 min) using Bayesian Contextual Thompson Sampling with a 15% exploration window. Launch with a single tap.
                </p>
              </div>
              <span className="font-mono text-xs text-teal-300 bg-teal-950/50 border border-teal-500/30 px-3 py-1.5 rounded-lg shrink-0">
                θ_k ~ Beta(α_k, β_k)
              </span>
            </div>

            {/* Stage 4 */}
            <div id="causal-inference" className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <span>STAGE 04</span>
                  <span aria-hidden="true">·</span>
                  <span>RUBIN CAUSAL MODEL</span>
                </div>
                <h3 className="text-lg font-bold text-white">4. Measure: True Counterfactual Recovery</h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                  After 25 minutes, initiates a 2-tap micro re-check. Crucially subtracts expected continuous-work decay (Δ_control) from observed change (Δ_observed) to mathematically prove the Net Recovery Effect.
                </p>
              </div>
              <span className="font-mono text-xs text-emerald-400 bg-slate-800 px-3 py-1.5 rounded-lg shrink-0">
                Net = Δ_obs - Δ_control
              </span>
            </div>

            {/* Stage 5 */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                  <span>STAGE 05</span>
                  <span aria-hidden="true">·</span>
                  <span>CONTINUOUS REINFORCEMENT</span>
                </div>
                <h3 className="text-lg font-bold text-white">5. Learn: Bayesian Conjugate Beta Updates</h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                  Updates individual Beta posteriors based on confirmed causal recovery. The bandit continuously adapts to your changing academic load across midterms and finals.
                </p>
              </div>
              <span className="font-mono text-xs text-indigo-300 bg-slate-800 px-3 py-1.5 rounded-lg shrink-0">
                α_k ← α_k + weight
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Interactive 432Hz Somatic Pacer */}
      <section id="somatic-audio" className="w-full py-16 sm:py-24 border-t border-slate-800/80 bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-400 block">
                Pure Web Audio Synthesis
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Interactive Somatic Pacer &amp; 432Hz Harmonic Chimes
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                When an intervention triggers, the interface transforms into a mesmerizing, pulsing breathing guide synchronized with 432Hz harmonic acoustic chimes.
              </p>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Zero external MP3/audio files required (100% offline synthesis)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Synchronized phase cues: Inhale (432Hz), Hold (216Hz), Exhale (324Hz)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Optional 4Hz Theta binaural drone for deep prefrontal down-regulation</span>
                </li>
              </ul>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => handleTestChime('inhale')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-2"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Test Inhale Chime</span>
                </button>
                <button
                  onClick={() => handleTestChime('complete')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
                >
                  Test Completion Triad
                </button>
              </div>
            </div>

            {/* Glowing Orb Illustration Container */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-center shadow-xl">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-teal-500/15 blur-2xl animate-pulse" />
                <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-400 shadow-2xl flex flex-col items-center justify-center text-slate-950 p-4 animate-breath-glow">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Inhale Deeply</span>
                  <span className="text-3xl font-bold font-mono">4s</span>
                  <span className="text-[10px] font-semibold mt-1">432Hz Harmonic</span>
                </div>
              </div>
              <span className="text-xs font-medium text-slate-300 mt-6">
                4x4 Box Breathing &amp; Cyclic Physiological Sighing
              </span>
              <span className="text-[11px] text-slate-500 mt-1">
                Cell Reports Medicine (Balban, Spiegel &amp; Huberman, 2023)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Clinical-Grade Safety Commitment */}
      <section className="w-full py-14 border-t border-slate-800/80 bg-slate-900/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-rose-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Clinical-Grade Safety Interceptor Built-In
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-xl">
                  Wellness tools must be safe. MaxxLoop includes deterministic offline regex protection in English, Hindi, and Kannada. Any crisis indicator halts the algorithm, displays <strong>Tele-MANAS (14416)</strong> resources, and purges text before disk write.
                </p>
              </div>
            </div>

            <span className="text-xs font-mono text-rose-300 bg-rose-950/60 border border-rose-500/30 px-3.5 py-2 rounded-xl shrink-0">
              Tele-MANAS: 14416 (24/7)
            </span>
          </div>
        </div>
      </section>

      {/* Conversion Banner */}
      <section className="w-full py-16 sm:py-24 border-t border-slate-800/80 bg-gradient-to-b from-slate-950 to-slate-900 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight" style={{ textWrap: 'balance' }}>
            Transform Your Study Sessions from Open-Loop to Causal Recovery
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Join students and researchers managing their personal capacity with mathematical rigor, zero privacy leaks, and instant focus restoration.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={session.isAuthenticated ? onNavigateDashboard : onNavigateSignup}
              className="w-full sm:w-auto px-8 py-3.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-teal-400/20 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>{session.isAuthenticated ? 'Launch My Dashboard' : 'Create Free Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onNavigateLogin}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-sm rounded-xl transition-colors"
            >
              Sign In to Existing Space
            </button>
          </div>
        </div>
      </section>

      {/* Quiet Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-8 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">MaxxLoop</span>
            <span aria-hidden="true">·</span>
            <span>ASYNC 2026 Hackathon (Wellness &amp; Lifestyle)</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Local-First SQLite Guarantee</span>
            <span aria-hidden="true">·</span>
            <button onClick={onOpenAcademicModal} className="hover:text-amber-300 transition-colors">
              26 Academic Papers
            </button>
            <span aria-hidden="true">·</span>
            <span>Tele-MANAS: 14416</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
