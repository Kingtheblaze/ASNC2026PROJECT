export interface LoopRecord {
  id: string;
  user_id: string;
  before_score: number; // 1-5
  after_score: number | null; // 1-5
  context: string;
  note?: string;
  explanation: string;
  action: string;
  success: boolean;
  created_at: string;
  personal_lift?: number;
  success_rate_text?: string;
  after_note?: string;
}

export interface ActionStat {
  action: string;
  total_attempts: number;
  successes: number;
  success_rate: number; // 0 - 100
  avg_lift: number;
}

export type DriverSeverity = 'critical' | 'warning' | 'normal';

export interface DriverChip {
  id: string;
  label: string;
  metric: string;
  zScore: number;
  severity: DriverSeverity;
  academicExplanation: string;
}

export interface TelemetryData {
  tabSwitchesPerHour: number;
  continuousWorkMinutes: number;
  meetingMinutesToday: number;
  sleepHoursLastNight: number;
  activeFocusStreak: number;
  lastCheckInMinutesAgo: number;
}

export interface MicroIntervention {
  id: string;
  name: string;
  type: 'breathing' | 'somatic' | 'visual' | 'movement';
  durationSeconds: number;
  tagline: string;
  description: string;
  cadenceDescription: string;
  primaryPacerType: 'box-breathing' | 'physiological-sigh' | 'relax-478' | 'nsdr-somatic';
  cycles: number;
  inSeconds: number;
  holdInSeconds: number;
  outSeconds: number;
  holdOutSeconds: number;
  soundCue: string;
}

export interface BetaPrior {
  id: string;
  name: string;
  alpha: number; // Success count + prior
  beta: number;  // Failure count + prior
  weightModifier: number;
  lastSelectedAt?: string;
}

export interface RecoveryEvent {
  id: string;
  timestamp: string;
  interventionId: string;
  interventionName: string;
  capacityBefore: number;
  capacityAfter: number;
  observedDelta: number;
  counterfactualDrift: number; // expected natural decline if skipped
  netRecoveryEffect: number; // observedDelta - counterfactualDrift
  isSuccess: boolean;
  notes?: string;
}

export interface CheckInRecord {
  id: string;
  timestamp: string;
  energy: number; // 1-10
  focus: number;  // 1-10
  tension: number;// 1-10
  mood: number;   // 1-10
  notes?: string;
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: string;
  institution?: string;
  createdAt: string;
  lastLoginAt: string;
  profileId: string;
  avatarInitials: string;
}

export interface AuthSession {
  user: UserAccount | null;
  isAuthenticated: boolean;
}

export interface UserProfile {
  id: string;
  email?: string;
  name: string;
  role: string;
  scenario: string;
  isAnonymous: boolean;
  baselineCapacityMAD: number; // robust median baseline
  madSpread: number; // median absolute deviation
  currentCapacity: number; // current calculated 0-100 score
  robustZScore: number; // modified z-score
  telemetry: TelemetryData;
  drivers: DriverChip[];
  priors: Record<string, BetaPrior>;
  history: RecoveryEvent[];
  checkIns: CheckInRecord[];
  activeStage: 1 | 2 | 3 | 4 | 5; // Detect (1) -> Explain (2) -> Act (3) -> Measure (4) -> Learn (5)
}
