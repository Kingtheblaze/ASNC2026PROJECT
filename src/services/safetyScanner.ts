export interface SafetyScanResult {
  triggered: boolean;
  detectedLanguage?: 'english' | 'hindi' | 'kannada';
  matchedPattern?: string;
  emergencyResources: {
    name: string;
    contact: string;
    description: string;
    type: 'toll-free' | 'chat' | 'international';
  }[];
}

const ENGLISH_PATTERNS = [
  /\b(suicide|suicidal|kill\s*myself|end\s*my\s*life|want\s*to\s*die|wanna\s*die|hang\s*myself|slit\s*my\s*wrists?|take\s*all\s*my\s*pills|cut\s*myself|self\s*harm)\b/i,
  /\b(better\s*off\s*dead|no\s*reason\s*to\s*live|can'?t\s*go\s*on\s*anymore|ending\s*it\s*all)\b/i,
];

const HINDI_PATTERNS = [
  /\b(mar\s*jana|khudkushi|jaan\s*lena|marna\s*chahta|marna\s*chahti|khatam\s*kar\s*du|zindagi\s*khatam|apne\s*aap\s*ko\s*mar)\b/i,
  /\b(आत्महत्या|मरना|खुदकुशी|जान\s*देना)\b/u,
];

const KANNADA_PATTERNS = [
  /\b(savu|atmahatye|jeevana\s*mugisu|saayabeku|nanna\s*jeeva\s*tegedukolluvudu)\b/i,
  /\b(ಆತ್ಮಹತ್ಯೆ|ಸಾಯಲು|ಜೀವ\s*ತೆಗೆದುಕೊಳ್ಳಿ)\b/u,
];

export const CRISIS_RESOURCES = [
  {
    name: 'Tele-MANAS (National Mental Health Helpline)',
    contact: '14416 / 1800-891-4416',
    description: 'Government of India 24/7 Toll-Free, confidential crisis counseling in 20+ regional languages including Hindi, Kannada, Tamil, Telugu, and English.',
    type: 'toll-free' as const,
  },
  {
    name: 'Vandrevala Foundation Helpline',
    contact: '+91 9999 666 555',
    description: 'Free, professional 24/7 crisis intervention & psychological support via voice and WhatsApp.',
    type: 'toll-free' as const,
  },
  {
    name: 'KIRAN (Govt Helpline for De-addiction & Distress)',
    contact: '1800-599-0019',
    description: '24/7 Multi-lingual psychological first aid and anxiety triage.',
    type: 'toll-free' as const,
  },
  {
    name: 'International Suicide & Crisis Lifeline',
    contact: '988 (USA/Canada) or 112 (EU/India Emergency)',
    description: 'Immediate emergency support services wherever you are located.',
    type: 'international' as const,
  },
];

export function scanTextForCrisis(text: string): SafetyScanResult {
  if (!text || text.trim() === '') {
    return { triggered: false, emergencyResources: CRISIS_RESOURCES };
  }

  const clean = text.toLowerCase();

  for (const pattern of ENGLISH_PATTERNS) {
    if (pattern.test(clean)) {
      return {
        triggered: true,
        detectedLanguage: 'english',
        matchedPattern: 'Risk indicator detected in reflection text',
        emergencyResources: CRISIS_RESOURCES,
      };
    }
  }

  for (const pattern of HINDI_PATTERNS) {
    if (pattern.test(clean)) {
      return {
        triggered: true,
        detectedLanguage: 'hindi',
        matchedPattern: 'जोखिम संकेतक मिला (Risk indicator in Hindi)',
        emergencyResources: CRISIS_RESOURCES,
      };
    }
  }

  for (const pattern of KANNADA_PATTERNS) {
    if (pattern.test(clean)) {
      return {
        triggered: true,
        detectedLanguage: 'kannada',
        matchedPattern: 'ಅಪಾಯ ಸೂಚಕ ಪತ್ತೆಯಾಗಿದೆ (Risk indicator in Kannada)',
        emergencyResources: CRISIS_RESOURCES,
      };
    }
  }

  return {
    triggered: false,
    emergencyResources: CRISIS_RESOURCES,
  };
}

export function sanitizeTextForStorage(text: string): string {
  const scan = scanTextForCrisis(text);
  if (scan.triggered) {
    // Clinical-grade zero-retention guarantee: purge text completely
    return '[Text purged by MaxxLoop Privacy & Safety Interceptor: Crisis Protocol Activated]';
  }
  return text;
}
