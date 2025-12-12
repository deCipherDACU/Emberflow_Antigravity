import { DailyInsight, InsightType, InsightCategory } from '../../types/ai/DailyInsight';
import { UserProfile } from '../../types/user/UserProfile';
import { Mood } from '../onboarding/constants';

export class AIService {

    /**
     * Mock AI Analysis: Looks for hardcoded patterns to simulate intelligence.
     * In a real app, this would send a prompt to an LLM.
     */
    public generateInsights(
        profile: UserProfile,
        recentMoods: Mood[],
        tasksCompletedToday: number
    ): DailyInsight[] {
        const insights: DailyInsight[] = [];
        const today = new Date();

        // Pattern 1: High Stress Correlation (Wellness)
        // If mood is bad AND user worked a lot    // Calculate Average Mood (Map Mood Enum to Values)
        const moodValues: { [key: string]: number } = {
            [Mood.Great]: 5,
            [Mood.Good]: 4,
            [Mood.Okay]: 3,
            [Mood.Bad]: 2,
            [Mood.Terrible]: 1
        };

        let averageMoodScore = 3; // Default Okay
        if (recentMoods.length > 0) {
            const total = recentMoods.reduce((sum, m) => sum + (moodValues[m] || 3), 0);
            averageMoodScore = total / recentMoods.length;
        } // Simplified check

        if (averageMoodScore <= 2 && tasksCompletedToday > 5) { // Assuming averageMoodScore <= 2 means "Bad" or "Terrible"
            insights.push({
                id: 'ins-1',
                date: today,
                type: 'Pattern',
                category: 'Wellness',
                message: 'You tend to report lower mood on days with high task volume.',
                actionableStep: 'Try capping tomorrow\'s task list to 3 major items.',
                confidenceScore: 0.85,
                relatedDataPoints: ['mood_bad', 'high_volume']
            });
        }

        // Pattern 1: High Workload + Low Mood
        if (tasksCompletedToday > 5 && averageMoodScore < 3) { // Below 'Okay'
            insights.push({
                id: 'ins-2',
                date: today,
                type: 'Prediction',
                category: 'Productivity',
                message: 'Zero tasks completed today usually leads to a "catch-up" spike tomorrow.',
                actionableStep: 'Complete just ONE small task now to break the seal.',
                confidenceScore: 0.92,
                relatedDataPoints: ['zero_progress']
            });
        }

        // Pattern 3: Growth (Mock LLM Output)
        if (profile.level > 5) {
            insights.push({
                id: 'ins-3',
                date: today,
                type: 'Recommendation',
                category: 'Growth',
                message: 'Your consistency has improved by 15% this week.',
                actionableStep: 'Consider increasing your Pomodoro base duration to 30m.',
                confidenceScore: 0.75,
                relatedDataPoints: ['consistency_up']
            });
        }

        return insights;
    }
}
