import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Brain,
  Check,
  CheckCircle2,
  Clock,
  Loader2,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-react';
import { LoopRecord } from '../types';
import { detectAndExplainLoop, getActionSuccessRateText } from '../services/loopService';

interface CheckInFlowProps {
  userId: string;
  userName: string;
  personalHistory: LoopRecord[];
  onCompleteLoop: (loop: LoopRecord) => void;
  onLaunchPacer?: () => void;
}

const CONTEXT_TAGS = [
  'After lecture',
  'Late-night work',
  'Post social media',
  'Low sleep',
  'Back-to-back classes',
  'Other',
];

export const CheckInFlow: React.FC<CheckInFlowProps> = ({
  userId,
  userName,
  personalHistory,
  onCompleteLoop,
  onLaunchPacer,
}) => {
  // Flow steps: 'checkin' | 'detecting' | 'action' | 'measuring'
  const [step, setStep] = useState<'checkin' | 'detecting' | 'action' | 'measuring'>('checkin');

  // Step 1: Check-in inputs
  const [beforeScore, setBeforeScore] = useState<number>(2);
  const [context, setContext] = useState<string>('After lecture');
  const [note, setNote] = useState<string>('');

  // Step 2: Detected Explanation & Micro-Action (from Gemini)
  const [explanation, setExplanation] = useState<string>('');
  const [action, setAction] = useState<string>('');
  const [actionStartTime, setActionStartTime] = useState<number | null>(null);
  const [actionSecondsLeft, setActionSecondsLeft] = useState<number>(180); // 3 mins default
  const [timerRunning, setTimerRunning] = useState<boolean>(true);

  // Step 3: Measurement after action
  const [afterScore, setAfterScore] = useState<number>(4);
  const [afterNote, setAfterNote] = useState<string>('');

  // Timer countdown during action
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (step === 'action' && timerRunning && actionSecondsLeft > 0) {
      interval = setInterval(() => {
        setActionSecondsLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timerRunning, actionSecondsLeft]);

  // Handle Initial Check-in Submit -> Triggers Drop Detection & Gemini
  const handleCheckInSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setStep('detecting');

    const result = await detectAndExplainLoop(
      beforeScore,
      context,
      note,
      personalHistory,
      userName
    );

    setExplanation(result.explanation);
    setAction(result.action);
    setActionStartTime(Date.now());
    setActionSecondsLeft(180);
    setTimerRunning(true);
    setStep('action');
  };

  // Handle Action "Done" -> Move to Measurement
  const handleActionDone = () => {
    setTimerRunning(false);
    // Suggest a default positive after score based on before score
    setAfterScore(Math.min(5, beforeScore + 2));
    setStep('measuring');
  };

  // Handle Measurement Submit -> Seal Loop & Generate Proof Card
  const handleMeasurementSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const lift = afterScore - beforeScore;
    const isSuccess = lift > 0;
    const successRateText = getActionSuccessRateText(action, lift, personalHistory);

    const newLoop: LoopRecord = {
      id: `loop_${Date.now()}`,
      user_id: userId,
      before_score: beforeScore,
      after_score: afterScore,
      context,
      note: note.trim() || undefined,
      explanation,
      action,
      success: isSuccess,
      created_at: 'Just now',
      personal_lift: lift,
      success_rate_text: successRateText,
      after_note: afterNote.trim() || undefined,
    };

    onCompleteLoop(newLoop);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      {/* Step 1: Check-in Screen */}
      {step === 'checkin' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Step 1 of 3: Fast State Check-In</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              How is your energy &amp; focus right now?
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Detects cognitive drops and searches your Personal Action Memory for the proven antidote.
            </p>
          </div>

          <form onSubmit={handleCheckInSubmit} className="space-y-6">
            {/* Score Selector (1-5) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Current Focus / Energy Score (1 = Drained, 5 = Peak Flow)
              </label>
              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {[
                  { val: 1, label: 'Exhausted' },
                  { val: 2, label: 'Heavy / Low' },
                  { val: 3, label: 'Moderate' },
                  { val: 4, label: 'Good' },
                  { val: 5, label: 'Peak Flow' },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setBeforeScore(item.val)}
                    className={`py-3 sm:py-4 px-2 rounded-2xl border text-center transition-all ${
                      beforeScore === item.val
                        ? 'bg-teal-500/20 border-teal-500 text-teal-200 ring-2 ring-teal-500/30 font-bold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xl sm:text-2xl font-mono font-bold">{item.val}</div>
                    <div className="text-[10px] mt-1 truncate">{item.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Context Tags */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                Quick Context (What triggered this state?)
              </label>
              <div className="flex flex-wrap gap-2">
                {CONTEXT_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setContext(tag)}
                    className={`px-3.5 py-2 text-xs font-medium rounded-xl border transition-colors ${
                      context === tag
                        ? 'bg-teal-400 text-slate-950 font-bold border-teal-400 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Short Note */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Optional Note (What were you working on?)
              </label>
              <input
                type="text"
                placeholder="e.g. Debugging segfault for 3 hours, eyes stinging..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-teal-400/20 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Detect Drop &amp; Recommend Action</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Step 2: Detecting Loader (Calling Gemini) */}
      {step === 'detecting' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 shadow-xl flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-12 h-12 border-2 border-teal-500/20 border-t-teal-400 rounded-full animate-spin" />
          <div>
            <h3 className="text-base font-bold text-white">Analyzing Capacity Signals...</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Cross-referencing your context ({context}) with your Personal Action Memory to isolate exactly one micro-action.
            </p>
          </div>
        </div>
      )}

      {/* Step 3: Active Action + Timer Screen */}
      {step === 'action' && (
        <div className="bg-slate-900 border-2 border-teal-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Header */}
          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 mb-1">
                <Clock className="w-4 h-4" />
                <span>Step 2 of 3: Take Your Micro-Action (≤ 5 min)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                One Action to Take Now
              </h2>
            </div>

            {/* Countdown Badge */}
            <div className="text-right font-mono">
              <span className="text-xs text-slate-400 block">Timer</span>
              <span className="text-xl font-bold text-teal-300 tabular-nums">
                {formatTimer(actionSecondsLeft)}
              </span>
            </div>
          </div>

          {/* Explanation Box */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1 text-left">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
              Why this happened:
            </span>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {explanation}
            </p>
          </div>

          {/* Hero Micro-Action Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-950/40 via-slate-950 to-slate-950 border border-teal-500/50 space-y-3 text-left">
            <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-widest block">
              ⚡ Prescribed Micro-Action
            </span>
            <h3 className="text-2xl font-extrabold text-white leading-snug">
              {action}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Strict $n=1$ UX. Do this single physical action now. When finished, tap &apos;Done&apos; to measure and verify recovery.
            </p>

            {onLaunchPacer && (action.toLowerCase().includes('breath') || action.toLowerCase().includes('box')) && (
              <button
                type="button"
                onClick={onLaunchPacer}
                className="mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Launch Interactive 432Hz Somatic Pacer</span>
              </button>
            )}
          </div>

          {/* Done CTA */}
          <div className="pt-2 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setStep('checkin')}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleActionDone}
              className="px-8 py-3.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-teal-400/20 active:scale-[0.98] flex items-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Mark Done &amp; Measure Score</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Measuring (After-Score) Screen */}
      {step === 'measuring' && (
        <div className="bg-slate-900 border border-teal-500/40 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Step 3 of 3: Prove Counterfactual Recovery</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              How do you feel after this action?
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Logged before: <strong className="text-slate-200 font-mono">{beforeScore}/5</strong>. Rate your current state now.
            </p>
          </div>

          <form onSubmit={handleMeasurementSubmit} className="space-y-6">
            {/* Score Selector (1-5) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Verified After Score (1 = Still Drained, 5 = Clear &amp; Ready)
              </label>
              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAfterScore(val)}
                    className={`py-3.5 px-2 rounded-2xl border text-center transition-all ${
                      afterScore === val
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/30 font-bold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-2xl font-mono font-bold">{val}</div>
                    <div className="text-[10px] mt-1 font-mono">
                      {val > beforeScore ? `+${val - beforeScore} Lift` : val === beforeScore ? 'Same' : `${val - beforeScore}`}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Reflection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Optional Reflection Note
              </label>
              <input
                type="text"
                placeholder="e.g. Brain fog cleared, breathing helped break the stress lock..."
                value={afterNote}
                onChange={(e) => setAfterNote(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-400/20 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Seal Loop &amp; Generate Proof Card</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
