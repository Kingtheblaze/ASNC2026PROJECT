import React from 'react';
import { ActionStat, LoopRecord } from '../types';
import { calculateActionStats } from '../services/loopService';
import { ArrowUpRight, Brain, CheckCircle2, History, Sparkles, TrendingUp, Zap } from 'lucide-react';

interface ActionMemoryViewProps {
  loops: LoopRecord[];
  onTriggerCheckIn: () => void;
}

export const ActionMemoryView: React.FC<ActionMemoryViewProps> = ({
  loops,
  onTriggerCheckIn,
}) => {
  const stats = calculateActionStats(loops);
  const totalCompleted = loops.filter((l) => l.after_score !== null).length;

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-teal-400 font-semibold mb-1">
            <Brain className="w-4 h-4 text-teal-400" />
            <span>Personal Action Memory</span>
            <span aria-hidden="true">·</span>
            <span>Empirical Learning Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            What Works For You (Learned Patterns)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Grounded in {totalCompleted} completed recovery loops. MaxxLoop feeds these exact patterns into Gemini.
          </p>
        </div>

        <button
          onClick={onTriggerCheckIn}
          className="px-4 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs transition-all shadow-md shadow-teal-400/20 active:scale-[0.98] shrink-0"
        >
          Check In Now (+ Prove Next Action)
        </button>
      </div>

      {/* Ranked Action Cards */}
      <div className="space-y-3">
        {stats.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-400">
            No completed loops yet. Complete your first micro-action to build your personalized memory.
          </div>
        ) : (
          stats.map((stat, i) => (
            <div
              key={stat.action}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-xs font-bold text-teal-400">
                    Rank #{i + 1}
                  </span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {stat.successes} / {stat.total_attempts} verified wins
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-100">
                  {stat.action}
                </h4>
              </div>

              {/* Stat Indicators */}
              <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">Success Rate</span>
                  <span className="text-base font-bold text-teal-300">
                    {stat.success_rate}%
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">Avg Score Lift</span>
                  <span className="text-base font-bold text-emerald-400">
                    +{stat.avg_lift} pts
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Memory Callout Banner */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-300 leading-relaxed">
        <Sparkles className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-teal-300 font-semibold">How Memory Guides Recommendations: </strong>
          Whenever capacity drops, MaxxLoop inspects your highest-scoring micro-actions for that specific situation. No generic tips, no motivational fluff—only proven counterfactual recovery.
        </div>
      </div>
    </div>
  );
};
