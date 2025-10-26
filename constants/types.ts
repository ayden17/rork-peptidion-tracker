export type UserGoal = 'muscle_gain' | 'fat_loss' | 'longevity' | 'recovery' | 'energy' | 'cognitive' | 'skin';

export type UserRole = 'user' | 'coach' | 'doctor';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type PeptideCategory = 'growth' | 'recovery' | 'fat_loss' | 'longevity' | 'cognitive' | 'skin';

export interface UserProfile {
  id: string;
  name?: string;
  role: UserRole;
  age?: number;
  weight?: number;
  height?: number;
  bodyFat?: number;
  activityLevel?: string;
  goals: UserGoal[];
  experienceLevel: ExperienceLevel;
  hasCompletedOnboarding: boolean;
  hasAcceptedDisclaimer: boolean;
  level?: number;
  experiencePoints?: number;
  gender?: 'male' | 'female' | 'other';
  hasUsedPeptidesBefore?: 'yes' | 'no' | 'researched';
  expectedResults?: '1-3' | '3-6' | 'long-term';
  wantsTracking?: boolean;
  wantsCoaching?: boolean;
  openAIApiKey?: string;
  calendlyLink?: string;
  specialty?: string;
  bio?: string;
  hourlyRate?: number;
  instagramHandle?: string;
  twitterHandle?: string;
  linkedinHandle?: string;
}

export interface Peptide {
  id: string;
  name: string;
  category: PeptideCategory;
  shortDescription: string;
  fullDescription: string;
  benefits: string[];
  risks: string[];
  dosageExample: string;
  cycleLength: string;
  experienceLevel: ExperienceLevel[];
  goals: UserGoal[];
  isFavorite?: boolean;
}

export interface ProgressPhoto {
  id: string;
  uri: string;
  type: 'face' | 'front' | 'side' | 'back';
  date: string;
  weight?: number;
  bodyFat?: number;
  notes?: string;
  rating?: {
    leanness?: number;
    debloatedness?: number;
    clearSkin?: number;
    jawline?: number;
    overall?: number;
    analysis?: string;
  };
}

export interface BodyStats {
  date: string;
  weight?: number;
  bodyFat?: number;
  muscleMass?: number;
  notes?: string;
}

export interface Cycle {
  id: string;
  peptideId: string;
  peptideName: string;
  startDate: string;
  endDate?: string;
  dosage: string;
  frequency: string;
  notes?: string;
  sideEffects?: string[];
  isActive: boolean;
}

export interface Coach {
  id: string;
  name: string;
  role: 'coach' | 'doctor';
  specialty: string;
  rating: number;
  hourlyRate: number;
  experience: number;
  patientsCount: number;
  avatar?: string;
  bio?: string;
  availability?: AvailabilitySlot[];
  calendlyLink?: string;
}

export interface AvailabilitySlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface Appointment {
  id: string;
  coachId: string;
  coachName: string;
  userId: string;
  userName?: string;
  date: string;
  time: string;
  duration: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
  type: 'consultation' | 'follow-up' | 'initial';
}
