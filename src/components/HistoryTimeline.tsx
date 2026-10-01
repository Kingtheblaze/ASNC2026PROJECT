import React from 'react';
import { LoopRecord } from '../types';
import { ArrowRight, CheckCircle2, Clock, History, Sparkles } from 'lucide-react';

interface HistoryTimelineProps {
  loops: LoopRecord[];
  onSelectLoop: (loop: LoopRecord) => void;
}

export const HistoryTimeline: React.FC<HistoryTimelineProps> = ({
  loops,
  onSelectLoop,
}) => {
  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-1">
            <History className="w-4 h-4 text-teal-400" />
            <span>Closed-Loop History</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Past Action Loops ({loops.length})
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-500">
          Chronological Evidence Log
        </span>
      </div>

      <div className="space-y-3">
        {loops.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-400">
            No loops recorded yet.
          </div>
        ) : (
          loops.map((loop) => {
            const lift = (loop.after_score || 0) - loop.before_score;
            const isPositive = lift > 0;

            return (
              <div
                key={loop.id}
                onClick={() => onSelectLoop(loop)}
                className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-teal-500/40 cursor-pointer transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="font-semibold text-teal-300 bg-teal-950/40 border border-teal-500/20 px-2.5 py-0.5 rounded-md">
                      {loop.context}
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">{loop.created_at}</span>
                  </div>

                  <div className="flex items-center gap-3 font-mono">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <span className="text-slate-400">{loop.before_score}/5</span>
                      <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
                      <span className="font-bold text-teal-300">{loop.after_score || '?'}/5</span>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        isPositive
                          ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isPositive ? `+${lift} Lift` : `${lift} Lift`}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-300 font-medium">
                  <strong>Action:</strong> {loop.action}
                </div>

                {loop.explanation && (
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {loop.explanation}
                  </p>
                )}

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 font-mono">
                  <span>{loop.success_rate_text || 'Closed-loop verified'}</span>
                  <span className="text-teal-400 font-sans hover:underline">View Proof Card →</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
