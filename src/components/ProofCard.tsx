import React, { useState } from 'react';
import { ArrowRight, Check, CheckCircle2, Copy, Sparkles, TrendingUp, Zap, Share2 } from 'lucide-react';
import { LoopRecord } from '../types';

interface ProofCardProps {
  loop: LoopRecord;
  onNextWindow: () => void;
  onViewMemory: () => void;
}

export const ProofCard: React.FC<ProofCardProps> = ({
  loop,
  onNextWindow,
  onViewMemory,
}) => {
  const [copied, setCopied] = useState(false);

  const lift = (loop.after_score || 0) - loop.before_score;
  const isPositive = lift > 0;

  const handleCopy = () => {
    const text = `🏆 MaxxLoop Proof Card\nContext: ${loop.context}\nAction: ${loop.action}\nBefore: ${loop.before_score}/5 ➔ After: ${loop.after_score}/5 (${isPositive ? '+' : ''}${lift})\nResult: ${loop.success_rate_text}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-teal-500/60 p-6 sm:p-8 shadow-2xl shadow-teal-500/10 overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-72 h-36 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header Badge */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400 font-mono">
              Action Proven · Closed Loop Verified
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            {loop.created_at}
          </span>
        </div>

        {/* Hero Score Comparison Banner */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-slate-800/80">
          <div className="flex items-center gap-5">
            {/* Before Score */}
            <div className="text-center sm:text-left">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
                Before Score
              </span>
              <div className="text-3xl font-extrabold font-mono text-slate-400 mt-0.5">
                {loop.before_score}<span className="text-sm font-normal text-slate-500">/5</span>
              </div>
            </div>

            {/* Transition Arrow */}
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-teal-400">
              <ArrowRight className="w-4 h-4" />
            </div>

            {/* After Score */}
            <div className="text-center sm:text-left">
              <span className="text-[10px] uppercase font-semibold text-teal-300 block tracking-wider">
                Verified After Score
              </span>
              <div className="text-4xl font-extrabold font-mono text-teal-300 mt-0.5">
                {loop.after_score}<span className="text-sm font-normal text-slate-500">/5</span>
              </div>
            </div>
          </div>

          {/* Lift Metric */}
          <div className="px-4 py-2.5 rounded-2xl bg-teal-950/40 border border-teal-500/40 text-center sm:text-right shrink-0">
            <span className="text-[10px] uppercase font-semibold text-teal-400 block tracking-wider">
              Empirical Net Lift
            </span>
            <div className="text-2xl font-bold font-mono text-teal-300">
              {isPositive ? `+${lift}` : lift} Points
            </div>
          </div>
        </div>

        {/* Loop Evidence Breakdown */}
        <div className="py-6 space-y-4 text-left">
          {/* Context */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Trigger Context:</span>
            <span className="text-slate-200 font-medium">{loop.context}</span>
            {loop.note && (
              <>
                <span aria-hidden="true">·</span>
                <span className="italic text-slate-400 truncate max-w-xs">&quot;{loop.note}&quot;</span>
              </>
            )}
          </div>

          {/* Explanation that was given */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Why this happened (Causal Diagnosis):
            </span>
            <p className="text-slate-200 leading-relaxed">
              {loop.explanation}
            </p>
          </div>

          {/* The Exact Action Taken */}
          <div className="p-4 rounded-2xl bg-teal-950/20 border border-teal-500/30 text-xs">
            <span className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider block mb-1">
              Exact Micro-Action Taken (≤ 5 min):
            </span>
            <p className="text-slate-100 font-semibold text-sm leading-snug">
              {loop.action}
            </p>
          </div>

          {/* Personal Success Rate Statement */}
          <div className="p-4 rounded-2xl bg-slate-800/90 border border-teal-500/30 flex items-start gap-3 text-xs leading-relaxed">
            <Sparkles className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-teal-300">Personal Action Memory Record:</span>
              <p className="text-slate-300 mt-0.5">
                {loop.success_rate_text || `This action improved your next window by +${lift}. It has worked consistently in similar situations.`}
              </p>
            </div>
          </div>

          {loop.after_note && (
            <div className="text-xs text-slate-400 italic">
              User Reflection: &quot;{loop.after_note}&quot;
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Proof' : 'Copy Proof Card'}</span>
            </button>
            <button
              onClick={onViewMemory}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
            >
              <span>Personal Memory</span>
            </button>
          </div>

          <button
            onClick={onNextWindow}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-teal-400/20 active:scale-[0.98]"
          >
            <span>Start Next Focus Window</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
