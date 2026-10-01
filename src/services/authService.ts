import { AuthSession, UserAccount, UserProfile } from '../types';
import { extractDriverChips } from './mathEngine';
import { loadProfiles, saveProfiles } from './profileStorage';

const ACCOUNTS_STORAGE_KEY = 'maxxloop_accounts_v2';
const SESSION_STORAGE_KEY = 'maxxloop_session_v2';

export const SEEDED_ACCOUNTS: (UserAccount & { passwordHash: string })[] = [
  {
    id: 'usr_aarav_sharma',
    email: 'aarav.sharma@campus.edu',
    name: 'Aarav Sharma',
    role: '3rd Year B.Tech Computer Science',
    institution: 'BITS Pilani / Computer Engineering',
    createdAt: '2026-09-01T08:00:00Z',
    lastLoginAt: '2026-09-30T10:00:00Z',
    profileId: 'demo-aarav',
    avatarInitials: 'AS',
    passwordHash: 'student2026',
  },
  {
    id: 'usr_meera_patel',
    email: 'meera.patel@techscale.io',
    name: 'Meera Patel',
    role: 'Staff Product Manager & MS Student',
    institution: 'TechScale / Part-time MS AI',
    createdAt: '2026-09-10T14:30:00Z',
    lastLoginAt: '2026-09-30T11:15:00Z',
    profileId: 'demo-meera',
    avatarInitials: 'MP',
    passwordHash: 'product2026',
  },
  {
    id: 'usr_demo_student',
    email: 'alex.chen@university.edu',
    name: 'Alex Chen',
    role: 'Pre-Med & Neuroscience Undergraduate',
    institution: 'University College of Health Sciences',
    createdAt: '2026-09-15T09:00:00Z',
    lastLoginAt: '2026-09-30T09:45:00Z',
    profileId: 'my-space',
    avatarInitials: 'AC',
    passwordHash: 'focus123',
  },
];

export function getStoredAccounts(): (UserAccount & { passwordHash: string })[] {
  if (typeof window === 'undefined') return SEEDED_ACCOUNTS;
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(SEEDED_ACCOUNTS));
      return SEEDED_ACCOUNTS;
    }
    return JSON.parse(raw);
  } catch {
    return SEEDED_ACCOUNTS;
  }
}

export function saveStoredAccounts(accounts: (UserAccount & { passwordHash: string })[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.error('Failed to save accounts to localStorage:', err);
  }
}

export function getActiveSession(): AuthSession {
  if (typeof window === 'undefined') {
    return { user: null, isAuthenticated: false };
  }
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      // Default to Aarav logged in for instant seamless demo testing, or null
      return { user: SEEDED_ACCOUNTS[0], isAuthenticated: true };
    }
    const session = JSON.parse(raw);
    return session;
  } catch {
    return { user: SEEDED_ACCOUNTS[0], isAuthenticated: true };
  }
}

export function saveActiveSession(session: AuthSession): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Failed to save session to localStorage:', err);
  }
}

export function login(email: string, password: string): { success: boolean; error?: string; user?: UserAccount } {
  const accounts = getStoredAccounts();
  const cleanEmail = email.trim().toLowerCase();
  const account = accounts.find((acc) => acc.email.toLowerCase() === cleanEmail);

  if (!account) {
    return { success: false, error: 'No account found with this email address.' };
  }

  // Simple validation for local-first system
  if (account.passwordHash && account.passwordHash !== password) {
    return { success: false, error: 'Incorrect password. Check your credentials.' };
  }

  const updatedUser: UserAccount = {
    ...account,
    lastLoginAt: new Date().toISOString(),
  };

  // Update in stored accounts
  const updatedAccounts = accounts.map((acc) => (acc.id === updatedUser.id ? { ...acc, ...updatedUser } : acc));
  saveStoredAccounts(updatedAccounts);

  const session: AuthSession = { user: updatedUser, isAuthenticated: true };
  saveActiveSession(session);

  return { success: true, user: updatedUser };
}

export function signup(
  name: string,
  email: string,
  password: string,
  role: string,
  institution?: string
): { success: boolean; error?: string; user?: UserAccount } {
  const accounts = getStoredAccounts();
  const cleanEmail = email.trim().toLowerCase();

  if (accounts.some((acc) => acc.email.toLowerCase() === cleanEmail)) {
    return { success: false, error: 'An account with this email already exists. Please log in.' };
  }

  const id = `usr_${Math.random().toString(36).substring(2, 9)}`;
  const profileId = `profile_${id}`;

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || 'U';

  const newAccount: UserAccount & { passwordHash: string } = {
    id,
    email: cleanEmail,
    name: name.trim(),
    role: role.trim() || 'Student Researcher',
    institution: institution?.trim() || 'Academic Institution',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    profileId,
    avatarInitials: initials,
    passwordHash: password,
  };

  // Create isolated profile in profile storage for this new user
  const profiles = loadProfiles();
  const freshTelemetry = {
    tabSwitchesPerHour: 10,
    continuousWorkMinutes: 25,
    meetingMinutesToday: 45,
    sleepHoursLastNight: 7.2,
    activeFocusStreak: 25,
    lastCheckInMinutesAgo: 2,
  };
  const analysis = extractDriverChips(freshTelemetry, 82, 5.0);

  const newProfile: UserProfile = {
    id: profileId,
    email: cleanEmail,
    name: name.trim(),
    role: role.trim() || 'Student Researcher',
    scenario: 'Personal Workspace',
    isAnonymous: false,
    baselineCapacityMAD: 82,
    madSpread: 5.0,
    currentCapacity: analysis.computedCapacity,
    robustZScore: analysis.robustZScore,
    telemetry: freshTelemetry,
    drivers: analysis.drivers,
    priors: {
      'box-breathing-4x4': { id: 'box-breathing-4x4', name: '4x4 Box Breathing', alpha: 3, beta: 1, weightModifier: 1 },
      'physio-sigh-2min': { id: 'physio-sigh-2min', name: 'Cyclic Physiological Sigh', alpha: 3, beta: 1, weightModifier: 1 },
      'nsdr-somatic-reset': { id: 'nsdr-somatic-reset', name: '5-Min NSDR Somatic Decoupling', alpha: 2, beta: 1, weightModifier: 1 },
      'visual-convergence-reset': { id: 'visual-convergence-reset', name: '20-20-20 Visual Convergence Reset', alpha: 2, beta: 1, weightModifier: 1 },
    },
    history: [],
    checkIns: [],
    activeStage: 1,
  };

  profiles[profileId] = newProfile;
  saveProfiles(profiles);

  accounts.push(newAccount);
  saveStoredAccounts(accounts);

  const session: AuthSession = { user: newAccount, isAuthenticated: true };
  saveActiveSession(session);

  return { success: true, user: newAccount };
}

export function logout(): void {
  saveActiveSession({ user: null, isAuthenticated: false });
}

export function quickDemoLogin(demoPreset: 'aarav' | 'meera' | 'alex'): UserAccount {
  const emailMap = {
    aarav: 'aarav.sharma@campus.edu',
    meera: 'meera.patel@techscale.io',
    alex: 'alex.chen@university.edu',
  };
  const accounts = getStoredAccounts();
  const target = accounts.find((a) => a.email === emailMap[demoPreset]) || SEEDED_ACCOUNTS[0];

  const session: AuthSession = { user: target, isAuthenticated: true };
  saveActiveSession(session);
  return target;
}
