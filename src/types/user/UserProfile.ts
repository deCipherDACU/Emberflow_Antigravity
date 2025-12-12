import {
    LearningStyle,
    MotivationType,
    FocusStrength,
    DailyAvailability,
    ExperienceLevel,
    BurnoutRisk,
} from '../../features/onboarding/constants';

export interface OnboardingProfile {
    learningStyle: LearningStyle;
    motivationType: MotivationType;
    focusStrength: FocusStrength;
    dailyAvailability: DailyAvailability;
    experienceLevel: ExperienceLevel;
    painPoints: string[];
    preferredRewardType: string;
}

export interface WellnessProfile {
    mentalHealthCheck?: {
        baselineMood: number; // 1-10 scale
        stressLevel: 'low' | 'moderate' | 'high';
    };
    supportingConditions: string[]; // e.g., 'anxiety', 'ADHD'
    motivationalTriggers: string[];
    burnoutThreshold: number; // Number of tasks/days before suggesting break
}

export interface PerformanceMetrics {
    recentCompletionRate: number; // Percentage
    avgTasksPerDay: number;
    burnoutRisk: BurnoutRisk;
    recommendedDailyLoad: number;
    streakVulnerability: number; // How fragile is the current streak
}

export interface UserProfile {
    id: string;
    displayName: string;
    email: string;
    avatarUrl?: string;

    // New Segmentation & Wellness Sections
    onboarding: OnboardingProfile;
    wellness: WellnessProfile;
    performance: PerformanceMetrics;

    // Legacy/Standard fields (placeholders for now)
    level: number;
    currentXp: number;
    currency: {
        coins: number;
        gems: number;
    };
    createdAt: Date;
    lastLogin: Date;
}
