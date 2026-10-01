import React, { useState } from 'react';
import { PhoneCall, ShieldAlert, Heart, X, Check, ExternalLink } from 'lucide-react';
import { CRISIS_RESOURCES } from '../services/safetyScanner';

interface SafetyCrisisModalProps {
  detectedLanguage?: 'english' | 'hindi' | 'kannada';
  onClose: () => void;
}

export const SafetyCrisisModal: React.FC<SafetyCrisisModalProps> = ({
  detectedLanguage = 'english',
  onClose,
}) => {
  const [groundingStep, setGroundingStep] = useState(0);

  const groundingExercises = [
    { title: '5 Things you can see', desc: 'Look around your room. Notice 5 distinct objects, colors, or shadows.' },
    { title: '4 Things you can touch', desc: 'Feel your desk, the fabric of your clothes, the floor under your feet.' },
    { title: '3 Things you can hear', desc: 'Notice the hum of a computer fan, distant street noise, or your own breath.' },
    { title: '2 Things you can smell', desc: 'Notice the scent of air in the room, paper, or fresh air.' },
    { title: '1 Deep, slow exhale', desc: 'Release your breath completely through your mouth. You are safe here in this moment.' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-rose-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">
                You Are Not Alone · Help Is Right Here
              </h2>
              <p className="text-xs text-rose-400 font-medium">
                {detectedLanguage === 'hindi' && 'आप अकेले नहीं हैं · सहायता 24/7 उपलब्ध है'}
                {detectedLanguage === 'kannada' && 'ನೀವು ಒಬ್ಬಂಟಿಯಾಗಿಲ್ಲ · ಬೆಂಬಲ ಲಭ್ಯವಿದೆ'}
                {detectedLanguage === 'english' && 'Clinical-Grade Safety Interceptor Triggered (Zero Data Retained)'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-300 mt-4 leading-relaxed">
          MaxxLoop detected indicators of severe emotional distress or self-harm. Academic pressure and fatigue can feel completely overwhelming, but you do not have to carry this alone. Free, confidential support is available 24/7.
        </p>

        {/* Immediate Emergency Contacts */}
        <div className="mt-6 space-y-3">
          {CRISIS_RESOURCES.slice(0, 3).map((resource, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 hover:border-teal-500/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-teal-300">{resource.name}</span>
                <span className="text-[11px] font-mono text-slate-400">{resource.type}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-base font-bold font-mono text-slate-100 tracking-wide">{resource.contact}</span>
                <a
                  href={`tel:${resource.contact.replace(/[^\d+]/g, '')}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  Call Now
                </a>
              </div>
              <p className="text-xs text-slate-400 mt-1.5 leading-normal">{resource.description}</p>
            </div>
          ))}
        </div>

        {/* 5-4-3-2-1 Sensory Grounding Tool */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Emergency Somatic Grounding (5-4-3-2-1)
            </span>
            <span className="text-xs font-mono text-teal-400">Step {groundingStep + 1} of 5</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <h4 className="text-sm font-semibold text-teal-200">
              {groundingExercises[groundingStep].title}
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              {groundingExercises[groundingStep].desc}
            </p>
          </div>

          <div className="flex justify-between items-center mt-3">
            <button
              disabled={groundingStep === 0}
              onClick={() => setGroundingStep((s) => Math.max(0, s - 1))}
              className="text-xs text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => {
                if (groundingStep < 4) {
                  setGroundingStep((s) => s + 1);
                } else {
                  onClose();
                }
              }}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold rounded-lg transition-colors border border-slate-700"
            >
              {groundingStep < 4 ? 'Next Grounding Cue' : 'I Feel Centered Now'}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-[11px] text-slate-500">
          Privacy guarantee: Your text was scrubbed from system memory before writing to storage. MaxxLoop never stores sensitive distress records.
        </div>
      </div>
    </div>
  );
};
