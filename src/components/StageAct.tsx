import React, { useState } from 'react';
import { Play, Sparkles, Shuffle, ShieldCheck, Flame, Clock, HeartHandshake } from 'lucide-react';
import { DriverChip, MicroIntervention, UserProfile } from '../types';
import { selectInterventionWithThompsonSampling } from '../services/mathEngine';

interface StageActProps {
  profile: UserProfile;
  selectedDriver: DriverChip | null;
  onLaunchPacer: (intervention: MicroIntervention) => void;
}

export const StageAct: React.FC<StageActProps> = ({
  profile,
  selectedDriver,
  onLaunchPacer,
}) => {
  const [forceExplore, setForceExplore] = useState(false);

  // Run Thompson Sampling
  const dominant = selectedDriver || profile.drivers[0];
  const { selectedIntervention, sampledScores, isExplorationChoice } =
    selectInterventionWithThompsonSampling(profile.priors, dominant, forceExplore);

  const selectedStats = sampledScores[selectedIntervention.id];

  return (
    <section className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
      {/* Background Accent */}
      <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Hick's Law Callout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="font-semibold text-cyan-400">Stage 3: Act · Strict n=1 UX</span>
            <span aria-hidden="true">·</span>
            <span>Hick&apos;s Law Compliant</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
            Bayesian Contextual Thompson Sampling
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setForceExplore(!forceExplore)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              forceExplore || isExplorationChoice
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Demonstrate 15% exploration window to prevent habituation"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>15% Exploration Mode {forceExplore ? '(Active)' : ''}</span>
          </button>
        </div>
      </div>

      {/* Hick's Law Educational Banner */}
      <div className="mt-5 p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 flex items-start gap-3 text-xs text-slate-300 leading-relaxed">
        <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-cyan-300">Why Exactly ONE Recommendation?</span> Overloading exhausted students with 50+ meditation choices causes a 67% rejection rate (Hick&apos;s Law: T = b · log₂(n + 1)). MaxxLoop samples your personalized Beta posterior to prescribe the single highest-leverage micro-intervention.
        </div>
      </div>

      {/* Primary Selected Intervention Card */}
      <div className="mt-6 p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-800/90 to-slate-800/40 border border-teal-500/40 relative shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2.5 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-teal-500/20 text-teal-300 font-bold uppercase tracking-wider">
                Optimal Leverage
              </span>
              <span className="text-slate-400 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {Math.round(selectedIntervention.durationSeconds / 60)} Minutes
              </span>
              {isExplorationChoice && (
                <span className="text-[11px] font-mono text-amber-400">
                  · (15% Exploratory Sample)
                </span>
              )}
            </div>

            <h3 className="text-2xl font-bold text-white tracking-tight">
              {selectedIntervention.name}
            </h3>

            <p className="text-sm font-medium text-teal-200">
              {selectedIntervention.tagline}
            </p>

            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              {selectedIntervention.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-2">
              <span>Cadence: <strong className="text-slate-200 font-semibold">{selectedIntervention.cadenceDescription}</strong></span>
              <span aria-hidden="true">·</span>
              <span>Audio: <strong className="text-teal-300 font-semibold">{selectedIntervention.soundCue}</strong></span>
            </div>
          </div>

          {/* Action Button & Posterior Win Rate */}
          <div className="flex flex-col sm:items-end justify-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <span className="text-[11px] text-slate-400 block">Posterior Win Probability</span>
              <span className="text-xl font-bold font-mono text-teal-400">
                {selectedStats?.winProbability}%
              </span>
              <span className="text-[10px] text-slate-500 block">Beta({selectedStats?.alpha}, {selectedStats?.beta})</span>
            </div>

            <button
              onClick={() => onLaunchPacer(selectedIntervention)}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-teal-400/25 active:scale-[0.98]"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Launch Somatic Reset ({Math.round(selectedIntervention.durationSeconds / 60)}m)</span>
            </button>
            <span className="text-[11px] text-slate-400 text-center sm:text-right">
              Synchronized 432Hz harmonic chimes
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
