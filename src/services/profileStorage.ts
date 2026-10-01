import { UserProfile } from '../types';
import { extractDriverChips } from './mathEngine';

const STORAGE_KEY = 'maxxloop_profiles_v1';
const ACTIVE_PROFILE_KEY = 'maxxloop_active_profile_id_v1';

// Seeded Anonymous ID Generator
export function generateAnonymousId(): string {
  const rand = Math.random().toString(36).substring(2, 8);
  return `usr_${rand}`;
}

const DEFAULT_PRIORS = {
  'box-breathing-4x4': { id: 'box-breathing-4x4', name: '4x4 Box Breathing', alpha: 3, beta: 1, weightModifier: 1 },
  'physio-sigh-2min': { id: 'physio-sigh-2min', name: 'Cyclic Physiological Sigh', alpha: 3, beta: 1, weightModifier: 1 },
  'nsdr-somatic-reset': { id: 'nsdr-somatic-reset', name: '5-Min NSDR Somatic Decoupling', alpha: 2, beta: 1, weightModifier: 1 },
  'visual-convergence-reset': { id: 'visual-convergence-reset', name: '20-20-20 Visual Convergence Reset', alpha: 2, beta: 1, weightModifier: 1 },
};

export function getInitialProfiles(): Record<string, UserProfile> {
  const anonId = generateAnonymousId();

  // Aarav's profile initial telemetry & calculations
  const aaravTelemetry = {
    tabSwitchesPerHour: 42,
    continuousWorkMinutes: 85,
    meetingMinutesToday: 45,
    sleepHoursLastNight: 4.5,
    activeFocusStreak: 11,
    lastCheckInMinutesAgo: 18,
  };
  const aaravAnalysis = extractDriverChips(aaravTelemetry, 78, 5.4);

  // Meera's profile initial telemetry & calculations
  const meeraTelemetry = {
    tabSwitchesPerHour: 14,
    continuousWorkMinutes: 120,
    meetingMinutesToday: 310,
    sleepHoursLastNight: 6.0,
    activeFocusStreak: 25,
    lastCheckInMinutesAgo: 42,
  };
  const meeraAnalysis = extractDriverChips(meeraTelemetry, 82, 4.8);

  // My Space telemetry
  const mySpaceTelemetry = {
    tabSwitchesPerHour: 9,
    continuousWorkMinutes: 32,
    meetingMinutesToday: 60,
    sleepHoursLastNight: 7.2,
    activeFocusStreak: 32,
    lastCheckInMinutesAgo: 5,
  };
  const mySpaceAnalysis = extractDriverChips(mySpaceTelemetry, 80, 5.0);

  return {
    'my-space': {
      id: anonId,
      name: 'My Space',
      role: 'Active User Space',
      scenario: 'Live Local Session (Privacy First)',
      isAnonymous: true,
      baselineCapacityMAD: 80,
      madSpread: 5.0,
      currentCapacity: mySpaceAnalysis.computedCapacity,
      robustZScore: mySpaceAnalysis.robustZScore,
      telemetry: mySpaceTelemetry,
      drivers: mySpaceAnalysis.drivers,
      priors: { ...DEFAULT_PRIORS },
      history: [
        {
          id: 'hist-ms-1',
          timestamp: 'Yesterday, 3:30 PM',
          interventionId: 'box-breathing-4x4',
          interventionName: '4x4 Box Breathing',
          capacityBefore: 62,
          capacityAfter: 76,
          observedDelta: 14,
          counterfactualDrift: -3.8,
          netRecoveryEffect: 17.8,
          isSuccess: true,
          notes: 'Focus restored before project review',
        },
      ],
      checkIns: [
        {
          id: 'ci-ms-1',
          timestamp: 'Today, 9:15 AM',
          energy: 7,
          focus: 8,
          tension: 3,
          mood: 8,
          notes: 'Feeling ready for deep work',
        },
      ],
      activeStage: 1,
    },
    'demo-aarav': {
      id: 'demo-aarav',
      name: 'Aarav Sharma',
      role: '3rd Year B.Tech Computer Science',
      scenario: 'Midterm Exam Crunch & Tab Thrashing',
      isAnonymous: false,
      baselineCapacityMAD: 78,
      madSpread: 5.4,
      currentCapacity: aaravAnalysis.computedCapacity,
      robustZScore: aaravAnalysis.robustZScore,
      telemetry: aaravTelemetry,
      drivers: aaravAnalysis.drivers,
      priors: {
        'box-breathing-4x4': { id: 'box-breathing-4x4', name: '4x4 Box Breathing', alpha: 9, beta: 2, weightModifier: 1.2 },
        'physio-sigh-2min': { id: 'physio-sigh-2min', name: 'Cyclic Physiological Sigh', alpha: 4, beta: 2, weightModifier: 1.0 },
        'nsdr-somatic-reset': { id: 'nsdr-somatic-reset', name: '5-Min NSDR Somatic Decoupling', alpha: 6, beta: 2, weightModifier: 1.1 },
        'visual-convergence-reset': { id: 'visual-convergence-reset', name: '20-20-20 Visual Convergence Reset', alpha: 2, beta: 2, weightModifier: 0.9 },
      },
      history: [
        {
          id: 'hist-ar-1',
          timestamp: 'Today, 11:20 AM',
          interventionId: 'box-breathing-4x4',
          interventionName: '4x4 Box Breathing',
          capacityBefore: 52,
          capacityAfter: 68,
          observedDelta: 16,
          counterfactualDrift: -4.2,
          netRecoveryEffect: 20.2,
          isSuccess: true,
          notes: 'Reduced compiler panic and tab thrashing',
        },
        {
          id: 'hist-ar-2',
          timestamp: 'Yesterday, 8:40 PM',
          interventionId: 'nsdr-somatic-reset',
          interventionName: '5-Min NSDR Somatic Decoupling',
          capacityBefore: 48,
          capacityAfter: 63,
          observedDelta: 15,
          counterfactualDrift: -3.6,
          netRecoveryEffect: 18.6,
          isSuccess: true,
        },
      ],
      checkIns: [
        {
          id: 'ci-ar-1',
          timestamp: 'Today, 10:00 AM',
          energy: 4,
          focus: 3,
          tension: 8,
          mood: 4,
          notes: 'Operating system exam in 2 days. 40 browser tabs open.',
        },
      ],
      activeStage: 2,
    },
    'demo-meera': {
      id: 'demo-meera',
      name: 'Meera Patel',
      role: 'Staff Product Manager & MS Student',
      scenario: 'Zoom Fatigue & Screen Saturation',
      isAnonymous: false,
      baselineCapacityMAD: 82,
      madSpread: 4.8,
      currentCapacity: meeraAnalysis.computedCapacity,
      robustZScore: meeraAnalysis.robustZScore,
      telemetry: meeraTelemetry,
      drivers: meeraAnalysis.drivers,
      priors: {
        'box-breathing-4x4': { id: 'box-breathing-4x4', name: '4x4 Box Breathing', alpha: 3, beta: 2, weightModifier: 1.0 },
        'physio-sigh-2min': { id: 'physio-sigh-2min', name: 'Cyclic Physiological Sigh', alpha: 8, beta: 1, weightModifier: 1.3 },
        'nsdr-somatic-reset': { id: 'nsdr-somatic-reset', name: '5-Min NSDR Somatic Decoupling', alpha: 7, beta: 2, weightModifier: 1.2 },
        'visual-convergence-reset': { id: 'visual-convergence-reset', name: '20-20-20 Visual Convergence Reset', alpha: 8, beta: 1, weightModifier: 1.3 },
      },
      history: [
        {
          id: 'hist-mp-1',
          timestamp: 'Today, 2:15 PM',
          interventionId: 'physio-sigh-2min',
          interventionName: 'Cyclic Physiological Sigh',
          capacityBefore: 60,
          capacityAfter: 75,
          observedDelta: 15,
          counterfactualDrift: -4.5,
          netRecoveryEffect: 19.5,
          isSuccess: true,
          notes: 'Headache receded following back-to-back roadmap sprint',
        },
      ],
      checkIns: [
        {
          id: 'ci-mp-1',
          timestamp: 'Today, 1:45 PM',
          energy: 4,
          focus: 5,
          tension: 7,
          mood: 5,
          notes: 'Headache from intense screen glare and non-stop video calls.',
        },
      ],
      activeStage: 3,
    },
  };
}

export function loadProfiles(): Record<string, UserProfile> {
  if (typeof window === 'undefined') return getInitialProfiles();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialProfiles();
      saveProfiles(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return getInitialProfiles();
  }
}

export function saveProfiles(profiles: Record<string, UserProfile>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  } catch (err) {
    console.error('Failed to save profiles to localStorage:', err);
  }
}

export function getActiveProfileKey(): string {
  if (typeof window === 'undefined') return 'my-space';
  try {
    return localStorage.getItem(ACTIVE_PROFILE_KEY) || 'demo-aarav'; // Default to Aarav for hackathon demo showcase!
  } catch {
    return 'demo-aarav';
  }
}

export function setActiveProfileKey(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACTIVE_PROFILE_KEY, key);
  } catch (err) {
    console.error('Failed to set active profile key:', err);
  }
}
