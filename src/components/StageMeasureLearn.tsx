import React from 'react';
import { ArrowUpRight, BarChart2, CheckCircle2, GitCommit, Layers, Sparkles, TrendingUp } from 'lucide-react';
import { UserProfile } from '../types';
import { AVAILABLE_INTERVENTIONS } from '../services/mathEngine';

interface StageMeasureLearnProps {
  profile: UserProfile;
}

export const StageMeasureLearn: React.FC<StageMeasureLearnProps> = ({ profile }) => {
  return (
    <section className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="font-semibold text-emerald-400">Stage 4 &amp; 5: Measure &amp; Learn</span>
            <span aria-hidden="true">·</span>
            <span>Rubin Causal Inference &amp; Beta Posteriors</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
            Counterfactual Recovery &amp; Continuous Learning
          </h2>
        </div>

        <div className="text-xs font-mono text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
          Formula: <span className="text-emerald-400 font-bold">Net = Δ_obs - Δ_control</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Left Column: Causal Counterfactual Recovery Log (Rubin Causal Model) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Stage 4: Causal Verification Log
            </span>
            <span className="text-[11px] text-slate-500">True counterfactual delta</span>
          </div>

          {profile.history.length === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 text-center text-xs text-slate-400">
              No interventions logged yet. Launch a somatic reset above to compute your first counterfactual recovery effect.
            </div>
          ) : (
            <div className="space-y-3">
              {profile.history.map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition-all"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-200">{event.interventionName}</span>
                    <span className="text-slate-400 text-[11px]">{event.timestamp}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-700/40 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Observed Δ</span>
                      <span className="text-slate-200 font-semibold">+{event.observedDelta} pts</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Control Drift</span>
                      <span className="text-rose-400 font-semibold">{event.counterfactualDrift} pts</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Net Causal Lift</span>
                      <span className="text-emerald-400 font-bold">+{event.netRecoveryEffect} pts</span>
                    </div>
                  </div>

                  {event.notes && (
                    <p className="text-[11px] text-slate-400 mt-2 italic">
                      &quot;{event.notes}&quot;
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40 text-[11px] text-slate-400 leading-relaxed">
            <strong className="text-slate-300">Why Counterfactual Control Matters:</strong> Conventional wellness apps assume all post-break recovery was caused by the app. MaxxLoop subtracts the expected continuous-work decay (Δ_control) to isolate true causal lift.
          </div>
        </div>

        {/* Right Column: Conjugate Beta Posteriors (Stage 5 Learn) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Stage 5: Live Bayesian Beta Posteriors
            </span>
            <span className="text-[11px] text-slate-500">Thompson Sampling bandit states</span>
          </div>

          <div className="space-y-3">
            {AVAILABLE_INTERVENTIONS.map((intervention) => {
              const prior = profile.priors[intervention.id] || { alpha: 2, beta: 1, name: intervention.name };
              const winProb = Math.round((prior.alpha / (prior.alpha + prior.beta)) * 100);

              return (
                <div
                  key={intervention.id}
                  className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-slate-200">{intervention.name}</span>
                    <span className="font-mono text-emerald-400 font-bold">{winProb}% Win Rate</span>
                  </div>

                  {/* Progress Bar for Beta Posterior Mean */}
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-700"
                      style={{ width: `${winProb}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>
                      Posterior: <strong className="text-slate-300">Beta(α={prior.alpha}, β={prior.beta})</strong>
                    </span>
                    <span>
                      Success Ratio: <strong className="text-slate-300">{prior.alpha - 1} / {(prior.alpha + prior.beta) - 2}</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40 text-[11px] text-slate-400 leading-relaxed">
            <strong className="text-slate-300">Continuous Beta-Binomial Adaptation:</strong> Every confirmed recovery updates α_k ← α_k + w. Failed or skipped resets update β_k ← β_k + 1. The 15% exploration window guarantees continuous adaptation over long academic semesters.
          </div>
        </div>
      </div>
    </section>
  );
};
