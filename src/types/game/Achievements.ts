export type AchievementTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    tier: AchievementTier;
    criteriaMetric: string; // e.g. "tasksCompleted"
    criteriaValue: number; // e.g. 100
    xpReward: number;
}

export interface UserAchievements {
    userId: string;
    unlockedAchievementIds: string[];
    metrics: { [key: string]: number }; // e.g. { "tasksCompleted": 50 }
}
