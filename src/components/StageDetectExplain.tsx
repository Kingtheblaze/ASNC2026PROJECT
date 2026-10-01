import React, { useState } from 'react';
import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, Cpu, HelpCircle, Info, Sparkles } from 'lucide-react';
import { DriverChip, UserProfile } from '../types';

interface StageDetectExplainProps {
  profile: UserProfile;
  onOpenCheckIn: () => void;
  onOpenGeminiDebrief: () => void;
  onSelectDriver: (driver: DriverChip) => void;
  selectedDriver: DriverChip | null;
}

export const StageDetectExplain: React.FC<StageDetectExplainProps> = ({
  profile,
  onOpenCheckIn,
  onOpenGeminiDebrief,
  onSelectDriver,
  selectedDriver,
}) => {
  const deficit = Number((profile.baselineCapacityMAD - profile.currentCapacity).toFixed(1));
  const isDeficit = deficit > 0;

  // Percentage for the capacity gauge circle
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (profile.currentCapacity / 100) * circumference;

  return (
    <section className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="font-semibold text-teal-400">Stage 1 &amp; 2: Detect &amp; Explain</span>
            <span aria-hidden="true">·</span>
            <span>Robust Rolling MAD Baselining</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
            <span>{profile.name}</span>
            <span className="text-xs font-normal font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">
              {profile.scenario}
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenGeminiDebrief}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-teal-300 border border-teal-500/20 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>AI Neuro Debrief</span>
          </button>

          <button
            onClick={onOpenCheckIn}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-teal-500/20 active:scale-[0.98]"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>10-Sec State Check-In</span>
          </button>
        </div>
      </div>

      {/* Main Metric & Drivers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 items-center">
        {/* Left Column: Robust Capacity Circular Gauge */}
        <div className="lg:col-span-5 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              {/* Background Ring */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Capacity Ring */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={profile.currentCapacity < 60 ? '#f43f5e' : profile.currentCapacity < 75 ? '#f59e0b' : '#14b8a6'}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-bold font-mono text-slate-100 tabular-nums">
                {profile.currentCapacity}
              </span>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Capacity / 100
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-400">
              <span>Robust MAD Baseline:</span>
              <span className="font-mono text-slate-200 font-semibold">{profile.baselineCapacityMAD}/100</span>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-1.5">
              {isDeficit ? (
                <div className="inline-flex items-center gap-1 text-xs font-semibold text-rose-400 bg-rose-950/40 px-2.5 py-1 rounded-lg border border-rose-500/20">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  <span>-{deficit} pts Deficit (MAD Z: {profile.robustZScore})</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1 text-xs font-semibold text-teal-400 bg-teal-950/40 px-2.5 py-1 rounded-lg border border-teal-500/20">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+{Math.abs(deficit)} pts Above Baseline (MAD Z: {profile.robustZScore})</span>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Calculated using <span className="text-slate-300 font-medium">Robust Median Absolute Deviation (MAD)</span>. Outliers from all-nighters do not distort your true biological baseline (Leys et al., 2013).
            </p>
          </div>
        </div>

        {/* Right Column: Explainable Z-Score Driver Chips */}
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Explainable Z-Score Driver Chips (Tap to Inspect)
            </span>
            <span className="text-[11px] text-slate-500">Real-time root cause extraction</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profile.drivers.map((driver) => {
              const isSelected = selectedDriver?.id === driver.id;
              const isCritical = driver.severity === 'critical';
              const isWarning = driver.severity === 'warning';

              return (
                <button
                  key={driver.id}
                  onClick={() => onSelectDriver(driver)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-teal-500/80 shadow-md ring-1 ring-teal-500/30'
                      : isCritical
                      ? 'bg-rose-950/20 border-rose-500/30 hover:bg-rose-950/30'
                      : isWarning
                      ? 'bg-amber-950/20 border-amber-500/30 hover:bg-amber-950/30'
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-200">{driver.label}</span>
                    <span
                      className={`font-mono text-[11px] font-bold ${
                        isCritical ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-teal-400'
                      }`}
                    >
                      Z: {driver.zScore}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 font-mono truncate">{driver.metric}</div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                    {driver.academicExplanation}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Telemetry Summary Ticker Bar */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-slate-500 block">Tab Thrash Rate</span>
          <span className="font-mono text-slate-200 font-bold text-sm">
            {profile.telemetry.tabSwitchesPerHour} /hr
          </span>
          <span className="text-[10px] text-slate-400">Baseline &lt; 15/hr</span>
        </div>
        <div>
          <span className="text-slate-500 block">Continuous Work</span>
          <span className="font-mono text-slate-200 font-bold text-sm">
            {profile.telemetry.continuousWorkMinutes} mins
          </span>
          <span className="text-[10px] text-slate-400">Ultradian cap 90m</span>
        </div>
        <div>
          <span className="text-slate-500 block">Sleep Last Night</span>
          <span className="font-mono text-slate-200 font-bold text-sm">
            {profile.telemetry.sleepHoursLastNight} hrs
          </span>
          <span className="text-[10px] text-slate-400">Rolling median 7.5h</span>
        </div>
        <div>
          <span className="text-slate-500 block">Screen &amp; Zoom Load</span>
          <span className="font-mono text-slate-200 font-bold text-sm">
            {profile.telemetry.meetingMinutesToday} mins
          </span>
          <span className="text-[10px] text-slate-400">Today total</span>
        </div>
      </div>
    </section>
  );
};
