import { ActionStat, LoopRecord } from '../types';

const LOOPS_STORAGE_KEY = 'maxxloop_loops_v2';

export const SEEDED_LOOPS: LoopRecord[] = [
  {
    id: 'loop_seed_1',
    user_id: 'usr_aarav_sharma',
    before_score: 2,
    after_score: 4,
    context: 'Late-night work',
    note: 'Debugging pointer segmentation fault for 3 hours straight.',
    explanation: 'Sympathetic lock from intense screen glare and repetitive compiler failures drained your prefrontal working memory.',
    action: 'Do 2 minutes of box breathing, then close all tabs',
    success: true,
    created_at: 'Yesterday, 11:30 PM',
    personal_lift: 2,
    success_rate_text: 'This action improved your next window by +2. It has worked for you 4 out of 5 times in similar situations.',
    after_note: 'Brain feels calm, ready to fix the segfault with fresh eyes.',
  },
  {
    id: 'loop_seed_2',
    user_id: 'usr_aarav_sharma',
    before_score: 2,
    after_score: 4,
    context: 'After lecture',
    note: '2-hour non-stop algorithms theory class, head feels heavy.',
    explanation: 'Passive sitting reduced cerebral blood flow, causing acute postural fatigue rather than true mental depletion.',
    action: 'Stand up and walk for 4 minutes while drinking water',
    success: true,
    created_at: 'Yesterday, 3:15 PM',
    personal_lift: 2,
    success_rate_text: 'This action improved your next window by +2. It has worked for you 3 out of 3 times in similar situations.',
    after_note: 'Physical movement woke up my alertness immediately.',
  },
  {
    id: 'loop_seed_3',
    user_id: 'usr_aarav_sharma',
    before_score: 1,
    after_score: 3,
    context: 'Post social media',
    note: 'Got sucked into 45 mins of Reddit and YouTube shorts.',
    explanation: 'Rapid dopamine context shifts fragmented your attentional salience network, causing deep focus resistance.',
    action: 'Set a 25-minute single-tab focus block',
    success: true,
    created_at: '2 days ago, 4:20 PM',
    personal_lift: 2,
    success_rate_text: 'This action improved your next window by +2. It has worked for you 3 out of 4 times in similar situations.',
    after_note: 'Single-tab constraint stopped the browsing loop.',
  },
  {
    id: 'loop_seed_4',
    user_id: 'usr_aarav_sharma',
    before_score: 2,
    after_score: 4,
    context: 'Back-to-back classes',
    note: 'Operating systems followed immediately by Computer Networks.',
    explanation: 'Cognitive interference between overlapping technical domains saturated your hippocampal consolidation buffer.',
    action: 'Stretch for 5 minutes and step outside',
    success: true,
    created_at: '3 days ago, 1:45 PM',
    personal_lift: 2,
    success_rate_text: 'This action improved your next window by +2. It has worked for you 2 out of 2 times in similar situations.',
    after_note: 'Fresh air broke the mental fog completely.',
  },
  {
    id: 'loop_seed_5',
    user_id: 'usr_aarav_sharma',
    before_score: 2,
    after_score: 3,
    context: 'Low sleep',
    note: 'Slept 4 hours preparing for quiz.',
    explanation: 'Adenosine buildup in basal forebrain is impairing executive vigilance and working memory retention.',
    action: 'Drink a full glass of water + light protein snack if available',
    success: true,
    created_at: '4 days ago, 10:00 AM',
    personal_lift: 1,
    success_rate_text: 'This action improved your next window by +1. It has worked for you 2 out of 3 times in similar situations.',
    after_note: 'Hydration helped eliminate the dull headache.',
  },
  {
    id: 'loop_seed_6',
    user_id: 'usr_aarav_sharma',
    before_score: 2,
    after_score: 4,
    context: 'Late-night work',
    note: 'Stuck on lab report formatting and figures.',
    explanation: 'Context thrashing between LaTeX, terminal, and browser tabs depleted continuous attention.',
    action: 'Do 2 minutes of box breathing, then close all tabs',
    success: true,
    created_at: '5 days ago, 10:30 PM',
    personal_lift: 2,
    success_rate_text: 'This action improved your next window by +2. It has worked for you 4 out of 5 times in similar situations.',
    after_note: 'Closed 25 tabs, finished lab in one go.',
  },
];

export function getStoredLoops(userId?: string): LoopRecord[] {
  if (typeof window === 'undefined') return SEEDED_LOOPS;
  try {
    const raw = localStorage.getItem(LOOPS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOOPS_STORAGE_KEY, JSON.stringify(SEEDED_LOOPS));
      return userId ? SEEDED_LOOPS.filter((l) => l.user_id === userId || l.user_id === 'usr_aarav_sharma') : SEEDED_LOOPS;
    }
    const all: LoopRecord[] = JSON.parse(raw);
    if (userId) {
      const userLoops = all.filter((l) => l.user_id === userId);
      // If user has no loops yet, provide seed loops for seamless demonstration
      if (userLoops.length === 0) {
        return SEEDED_LOOPS.map((l) => ({ ...l, user_id: userId }));
      }
      return userLoops;
    }
    return all;
  } catch {
    return SEEDED_LOOPS;
  }
}

export function saveStoredLoops(loops: LoopRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOOPS_STORAGE_KEY, JSON.stringify(loops));
  } catch (err) {
    console.error('Failed to save loops to localStorage:', err);
  }
}

/**
 * Calculates Personal Action Memory Stats ("What Works For Me")
 */
export function calculateActionStats(loops: LoopRecord[]): ActionStat[] {
  const completed = loops.filter((l) => l.after_score !== null);
  const map: Record<string, { total: number; successes: number; totalLift: number }> = {};

  completed.forEach((loop) => {
    const act = loop.action;
    if (!map[act]) {
      map[act] = { total: 0, successes: 0, totalLift: 0 };
    }
    map[act].total += 1;
    if (loop.success) {
      map[act].successes += 1;
    }
    map[act].totalLift += (loop.personal_lift || 0);
  });

  const stats: ActionStat[] = Object.entries(map).map(([action, data]) => ({
    action,
    total_attempts: data.total,
    successes: data.successes,
    success_rate: Math.round((data.successes / data.total) * 100),
    avg_lift: Number((data.totalLift / data.total).toFixed(1)),
  }));

  // Sort by success rate desc, then total attempts desc
  return stats.sort((a, b) => b.success_rate - a.success_rate || b.total_attempts - a.total_attempts);
}

/**
 * Generates personal success rate text for proof card
 */
export function getActionSuccessRateText(action: string, lift: number, loops: LoopRecord[]): string {
  const matching = loops.filter((l) => l.action.toLowerCase().includes(action.slice(0, 15).toLowerCase()) && l.after_score !== null);
  const successes = matching.filter((l) => l.success).length;
  const total = matching.length;

  if (total === 0) {
    return `This action improved your next window by +${lift}. This was your first trial of this micro-action.`;
  }

  const timesWord = total === 1 ? 'time' : 'times';
  return `This action improved your next window by +${lift}. It has worked for you ${successes} out of ${total} ${timesWord} in similar situations.`;
}

/**
 * Invokes Gemini 3.8 Flash via our server endpoint
 */
export async function detectAndExplainLoop(
  score: number,
  context: string,
  note: string,
  personalHistory: LoopRecord[],
  userName: string
): Promise<{ explanation: string; action: string; source: string }> {
  try {
    const res = await fetch('/api/loop/detect-and-explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        score,
        context,
        note,
        personalHistory: personalHistory.slice(0, 10),
        userName,
      }),
    });

    if (!res.ok) {
      throw new Error('API request failed');
    }

    const data = await res.json();
    return {
      explanation: data.explanation,
      action: data.action,
      source: data.source || 'gemini_3.8_flash',
    };
  } catch (err) {
    console.warn('Using deterministic fallback for detect and explain:', err);
    // Deterministic fallback matching exact requirements
    let fallbackAction = 'Do 2 minutes of box breathing, then close all tabs';
    let fallbackExp = 'Your working memory buffer reached saturation from continuous high-frequency focus. A short physiological reset will restore prefrontal control.';

    if (context === 'After lecture' || context === 'Back-to-back classes') {
      fallbackAction = 'Stand up and walk for 4 minutes while drinking water';
      fallbackExp = 'Passive listening for over an hour drops blood flow and glucose delivery to your prefrontal cortex. That heaviness in your eyes is postural fatigue, not real mental exhaustion.';
    } else if (context === 'Post social media') {
      fallbackAction = 'Set a 25-minute single-tab focus block';
      fallbackExp = 'Dopamine spikes from rapid scrolling depleted your sustained attention circuits. Your brain is craving another stimulus jump instead of deep work.';
    } else if (context === 'Low sleep') {
      fallbackAction = 'Drink a full glass of water + light protein snack if available';
      fallbackExp = 'Adenosine buildup in your basal forebrain is impairing executive vigilance and working memory retention. Forcing heavy computation now causes mistakes.';
    }

    return {
      explanation: fallbackExp,
      action: fallbackAction,
      source: 'deterministic_fallback',
    };
  }
}
