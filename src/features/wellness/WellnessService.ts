import {
    BurnoutRisk,
    Mood
} from '../onboarding/constants';
import { UserProfile } from '../../types/user/UserProfile';

export interface MoodLog {
    date: Date;
    score: Mood;
    tags: string[];
    note?: string;
}

export class WellnessService {

    /**
     * Updates the user's burnout risk based on recent activity and mood.
     * This is the core of the "Compassionate Productivity" engine.
     */
    public calculateBurnoutRisk(
        profile: UserProfile,
        recentMoods: MoodLog[],
        recentTaskCompletion: number // Percentage 0-100
    ): BurnoutRisk {

        let riskScore = 0;

        // factor 1: Low Mood trend
        const recentMoodAvg = this.getAverageMood(recentMoods);
        if (recentMoodAvg < 3) riskScore += 3; // High impact
        else if (recentMoodAvg < 4) riskScore += 1;

        // factor 2: Overworking (Completion rate indicates load, but here we assume high load if checking)
        // In a real scenario, we'd check actual work hours vs available hours
        const tasksPerDay = profile.performance.avgTasksPerDay;
        if (tasksPerDay > profile.wellness.burnoutThreshold) {
            riskScore += 2;
        }

        // factor 3: Streak Stress
        // If user is struggling to complete tasks (low completion) but keeping high volume
        if (recentTaskCompletion < 60 && tasksPerDay > 3) {
            riskScore += 2; // "Grinding" behavior
        }

        if (riskScore >= 4) return BurnoutRisk.High;
        if (riskScore >= 2) return BurnoutRisk.Moderate;
        return BurnoutRisk.Low;
    }

    public shouldSuggestBreak(profile: UserProfile): boolean {
        return profile.performance.burnoutRisk === BurnoutRisk.High;
    }

    public getCompassionateMessage(risk: BurnoutRisk): string {
        switch (risk) {
            case BurnoutRisk.High:
                return "You've been pushing hard. It's okay to take a rest day. Your streak will be paused, not broken.";
            case BurnoutRisk.Moderate:
                return "Feeling a bit drained? Consider a lighter load today to recharge.";
            default:
                return "You're in a good flow! Keep it up, but listen to your body.";
        }
    }

    private getAverageMood(logs: MoodLog[]): number {
        if (!logs || logs.length === 0) return 4; // Default to 'Good'
        const sum = logs.reduce((acc, log) => acc + log.score, 0);
        return sum / logs.length;
    }
}
