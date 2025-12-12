import {
    OnboardingProfile,
    UserProfile,
    PerformanceMetrics,
    WellnessProfile
} from '../../types/user/UserProfile';
import {
    LearningStyle,
    MotivationType,
    FocusStrength,
    DailyAvailability,
    ExperienceLevel,
    BurnoutRisk
} from './constants';

export interface OnboardingQuizResponses {
    learningStyle: LearningStyle;
    motivationType: MotivationType;
    focusStrength: FocusStrength;
    dailyAvailability: DailyAvailability;
    experienceLevel: ExperienceLevel;
    painPoints: string[];
    preferredRewardType: string;
    mentalHealthBaseline?: {
        mood: number;
        stress: 'low' | 'moderate' | 'high';
    };
}

export class OnboardingService {

    /**
     * Processes the onboarding quiz responses and generates the initial UserProfile segments.
     */
    public processOnboarding(
        userId: string,
        displayName: string,
        email: string,
        responses: OnboardingQuizResponses
    ): UserProfile {

        const onboardingProfile: OnboardingProfile = {
            learningStyle: responses.learningStyle,
            motivationType: responses.motivationType,
            focusStrength: responses.focusStrength,
            dailyAvailability: responses.dailyAvailability,
            experienceLevel: responses.experienceLevel,
            painPoints: responses.painPoints,
            preferredRewardType: responses.preferredRewardType
        };

        const wellnessProfile: WellnessProfile = {
            mentalHealthCheck: responses.mentalHealthBaseline ? {
                baselineMood: responses.mentalHealthBaseline.mood,
                stressLevel: responses.mentalHealthBaseline.stress
            } : undefined,
            supportingConditions: [], // To be populated later or via optional questions
            motivationalTriggers: this.deriveMotivationalTriggers(responses.motivationType),
            burnoutThreshold: this.calculateInitialBurnoutThreshold(responses.dailyAvailability, responses.experienceLevel)
        };

        const initialPerformance: PerformanceMetrics = {
            recentCompletionRate: 100, // Start optimistic
            avgTasksPerDay: 0,
            burnoutRisk: BurnoutRisk.Low,
            recommendedDailyLoad: this.calculateRecommendedLoad(responses.dailyAvailability),
            streakVulnerability: 0
        };

        return {
            id: userId,
            displayName,
            email,
            onboarding: onboardingProfile,
            wellness: wellnessProfile,
            performance: initialPerformance,
            level: 1,
            currentXp: 0,
            currency: { coins: 0, gems: 0 },
            createdAt: new Date(),
            lastLogin: new Date()
        };
    }

    private deriveMotivationalTriggers(type: MotivationType): string[] {
        switch (type) {
            case MotivationType.Intrinsic: return ['mastery', 'personal_growth'];
            case MotivationType.Extrinsic: return ['rewards', 'tangible_gains'];
            case MotivationType.Social: return ['recognition', 'community_contribution'];
            case MotivationType.Competitive: return ['leaderboards', 'beating_rivals'];
            default: return ['progress'];
        }
    }

    private calculateInitialBurnoutThreshold(availability: DailyAvailability, experience: ExperienceLevel): number {
        // Simple heuristic: More availability + more experience = higher threshold
        let base = 5; // tasks per day

        if (availability === DailyAvailability.High || availability === DailyAvailability.Full) base += 3;
        if (experience === ExperienceLevel.Advanced || experience === ExperienceLevel.Expert) base += 2;

        return base;
    }

    private calculateRecommendedLoad(availability: DailyAvailability): number {
        switch (availability) {
            case DailyAvailability.Limited: return 2;
            case DailyAvailability.Moderate: return 4;
            case DailyAvailability.High: return 6;
            case DailyAvailability.Full: return 8;
            default: return 3;
        }
    }
}
