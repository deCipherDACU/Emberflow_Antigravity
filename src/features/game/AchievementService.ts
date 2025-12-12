import { Achievement, UserAchievements } from '../../types/game/Achievements';

export class AchievementService {

    private achievements: Achievement[] = [
        {
            id: "ach-1",
            title: "Novice of Focus",
            description: "Complete 10 Tasks.",
            tier: 'Bronze',
            criteriaMetric: "tasksCompleted",
            criteriaValue: 10,
            xpReward: 50
        },
        {
            id: "ach-2",
            title: "Taskmaster",
            description: "Complete 100 Tasks.",
            tier: 'Gold',
            criteriaMetric: "tasksCompleted",
            criteriaValue: 100,
            xpReward: 500
        }
    ];

    /**
     * Updates a metric and checks for new unlocks.
     */
    public updateMetric(userData: UserAchievements, metric: string, amount: number): Achievement[] {
        // Update Metric
        const currentVal = userData.metrics[metric] || 0;
        userData.metrics[metric] = currentVal + amount;

        const newUnlocks: Achievement[] = [];

        // Check all achievements
        for (const ach of this.achievements) {
            // Skip if already unlocked
            if (userData.unlockedAchievementIds.includes(ach.id)) continue;

            // Skip if metric mismatch
            if (ach.criteriaMetric !== metric) continue;

            // Check condition
            if (userData.metrics[metric] >= ach.criteriaValue) {
                userData.unlockedAchievementIds.push(ach.id);
                newUnlocks.push(ach);
            }
        }

        return newUnlocks;
    }
}
