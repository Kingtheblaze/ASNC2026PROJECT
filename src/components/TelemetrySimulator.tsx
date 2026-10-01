import React from 'react';
import { Sliders, X, RefreshCw, Zap, Shield, Sparkles } from 'lucide-react';
import { TelemetryData } from '../types';

interface TelemetrySimulatorProps {
  telemetry: TelemetryData;
  onUpdateTelemetry: (updated: Partial<TelemetryData>) => void;
  onResetDefaults: () => void;
  onSimulateStressor: (type: 'midterm-cram' | 'zoom-marathon' | 'healthy-flow') => void;
  onClose: () => void;
}

export const TelemetrySimulator: React.FC<TelemetrySimulatorProps> = ({
  telemetry,
  onUpdateTelemetry,
  onResetDefaults,
  onSimulateStressor,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/80 backdrop-blur-sm p-2 sm:p-4">
      <div className="relative w-full max-w-md h-full max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Telemetry & Stressor Simulator</h3>
              <p className="text-xs text-slate-400">Judge / Evaluator Interactive Sandbox</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Tap Stressor Presets */}
        <div className="py-4 border-b border-slate-800">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">
            Instant Scenario Injections
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onSimulateStressor('midterm-cram')}
              className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-amber-500/50 hover:bg-slate-800 text-left transition-colors"
            >
              <div className="text-xs font-bold text-amber-300">Exam Cram</div>
              <div className="text-[10px] text-slate-400 mt-1">42 tabs, 4.5h sleep</div>
            </button>
            <button
              onClick={() => onSimulateStressor('zoom-marathon')}
              className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-rose-500/50 hover:bg-slate-800 text-left transition-colors"
            >
              <div className="text-xs font-bold text-rose-300">Zoom Fatigue</div>
              <div className="text-[10px] text-slate-400 mt-1">320m meetings</div>
            </button>
            <button
              onClick={() => onSimulateStressor('healthy-flow')}
              className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-teal-500/50 hover:bg-slate-800 text-left transition-colors"
            >
              <div className="text-xs font-bold text-teal-300">Deep Flow</div>
              <div className="text-[10px] text-slate-400 mt-1">8 tabs, 7.5h sleep</div>
            </button>
          </div>
        </div>

        {/* Fine-Tuning Sliders */}
        <div className="flex-1 py-4 space-y-5">
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
              <span>Tab Switches / Hour (Context Thrash)</span>
              <span className="font-mono text-cyan-400 font-bold">{telemetry.tabSwitchesPerHour} /hr</span>
            </div>
            <input
              type="range"
              min="2"
              max="60"
              value={telemetry.tabSwitchesPerHour}
              onChange={(e) => onUpdateTelemetry({ tabSwitchesPerHour: parseInt(e.target.value) })}
              className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Healthy threshold: &lt; 15/hr. &gt; 25/hr triggers acute prefrontal context flushing.
            </span>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
              <span>Sleep Last Night (Circadian Debt)</span>
              <span className="font-mono text-cyan-400 font-bold">{telemetry.sleepHoursLastNight} hrs</span>
            </div>
            <input
              type="range"
              min="3"
              max="10"
              step="0.5"
              value={telemetry.sleepHoursLastNight}
              onChange={(e) => onUpdateTelemetry({ sleepHoursLastNight: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Rolling median: 7.5 hrs. &lt; 6.0h incurs acute adenosine pressure.
            </span>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
              <span>Continuous Work Minutes (Without Reset)</span>
              <span className="font-mono text-cyan-400 font-bold">{telemetry.continuousWorkMinutes} mins</span>
            </div>
            <input
              type="range"
              min="10"
              max="180"
              step="5"
              value={telemetry.continuousWorkMinutes}
              onChange={(e) => onUpdateTelemetry({ continuousWorkMinutes: parseInt(e.target.value) })}
              className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
              <span>Meeting & Screen Load Today</span>
              <span className="font-mono text-cyan-400 font-bold">{telemetry.meetingMinutesToday} mins</span>
            </div>
            <input
              type="range"
              min="0"
              max="420"
              step="15"
              value={telemetry.meetingMinutesToday}
              onChange={(e) => onUpdateTelemetry({ meetingMinutesToday: parseInt(e.target.value) })}
              className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onResetDefaults}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset to Profile Baseline
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-cyan-500/20"
          >
            Apply & View Loop
          </button>
        </div>
      </div>
    </div>
  );
};
