import React, { useState } from 'react';
import { X, Check, Heart, Shield, Sparkles } from 'lucide-react';
import { CheckInRecord } from '../types';
import { scanTextForCrisis, sanitizeTextForStorage } from '../services/safetyScanner';

interface CheckInModalProps {
  onSave: (record: CheckInRecord) => void;
  onCrisisTriggered: (lang: 'english' | 'hindi' | 'kannada') => void;
  onClose: () => void;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({
  onSave,
  onCrisisTriggered,
  onClose,
}) => {
  const [energy, setEnergy] = useState(6);
  const [focus, setFocus] = useState(5);
  const [tension, setTension] = useState(6);
  const [mood, setMood] = useState(6);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clinical Safety Scan on submitted note
    const scan = scanTextForCrisis(notes);
    if (scan.triggered) {
      onCrisisTriggered(scan.detectedLanguage || 'english');
      return;
    }

    const record: CheckInRecord = {
      id: `ci-${Date.now()}`,
      timestamp: 'Just now',
      energy,
      focus,
      tension,
      mood,
      notes: sanitizeTextForStorage(notes.trim()),
    };

    onSave(record);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100">10-Second State Check-In</h3>
            <p className="text-xs text-slate-400">Zero fluff · Instant neuro-somatic calibration</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
              <span>Mental Focus</span>
              <span className="font-mono text-teal-400 font-bold">{focus}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={focus}
              onChange={(e) => setFocus(parseInt(e.target.value))}
              className="w-full accent-teal-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
              <span>Physical Energy</span>
              <span className="font-mono text-teal-400 font-bold">{energy}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={energy}
              onChange={(e) => setEnergy(parseInt(e.target.value))}
              className="w-full accent-teal-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
              <span>Body Tension / Neck &amp; Jaw Strain</span>
              <span className="font-mono text-amber-400 font-bold">{tension}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={tension}
              onChange={(e) => setTension(parseInt(e.target.value))}
              className="w-full accent-amber-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
              <span>Mood Valence</span>
              <span className="font-mono text-teal-400 font-bold">{mood}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={mood}
              onChange={(e) => setMood(parseInt(e.target.value))}
              className="w-full accent-teal-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Quick Reflection Note (Protected by Offline Scanner)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Trying to finish assignment before midnight, eyes stinging..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-800/80 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-500 transition-colors resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Deterministic offline privacy
            </span>
            <button
              type="submit"
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-teal-500/20 active:scale-[0.98]"
            >
              Record &amp; Recalibrate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
