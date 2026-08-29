export interface NavItem {
  label: string;
  href: string;
}

export interface AffordabilityPreset {
  item: string;
  amount: number;
}

export interface TickerItem {
  id: string;
  text: string;
}

export interface UserGoalProof {
  id: string;
  initial: string;
  name: string;
  goal: string;
  progress: number;
  avatarColor: 'lime' | 'white' | 'dark';
}

export interface AffordabilityResult {
  amount: number;
  item: string;
  nowDelayWeeks: number;
  nowProgress: number;
  waitWeeks: number;
  waitProgress: number;
  advice: string;
  weeklyTargetDiff: number;
}

export interface CoachingMessage {
  id: string;
  sender: 'coach' | 'user';
  text: string;
  time?: string;
  highlight?: boolean;
}

export interface CoachingScenario {
  id: string;
  title: string;
  shortDesc: string;
  messages: CoachingMessage[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface WaitlistSubmission {
  email: string;
  goal?: string;
  position: number;
  refCode: string;
  invitesCount: number;
  targetInvites: number;
}
