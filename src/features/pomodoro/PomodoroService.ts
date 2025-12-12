import {
    PomodoroSession,
    TaskDifficulty,
    UserEnergy
} from '../../types/pomodoro/PomodoroSession';

export class PomodoroService {

    private readonly BASE_XP_PER_MINUTE = 1;

    /**
     * Suggests an optimal focus duration based on task difficulty and user energy.
     * This implements the "Adaptive Focus" feature.
     */
    public suggestDuration(difficulty: TaskDifficulty, energy: UserEnergy): number {
        let baseTime = 25;

        // Adjust based on Difficulty (Harder tasks need deeper focus blocks)
        switch (difficulty) {
            case TaskDifficulty.Easy: baseTime = 15; break;
            case TaskDifficulty.Medium: baseTime = 25; break;
            case TaskDifficulty.Hard: baseTime = 45; break;
            case TaskDifficulty.Epic: baseTime = 50; break;
        }

        // Adjust based on Energy (Low energy = shorter sprints)
        switch (energy) {
            case UserEnergy.Low:
                return Math.max(10, baseTime - 10); // Reduce significantly
            case UserEnergy.Medium:
                return baseTime; // Standard
            case UserEnergy.High:
                return Math.min(60, baseTime + 10); // Boost capacity
        }
    }

    /**
     * Calculates XP and Coins for a completed session.
     * Rewards deep work and completion.
     */
    public calculateRewards(
        durationMinutes: number,
        completed: boolean,
        difficulty: TaskDifficulty
    ): { xp: number; coins: number } {

        if (!completed) {
            // Partial credit: 50% XP, 0 Coins
            return {
                xp: Math.floor((durationMinutes * this.BASE_XP_PER_MINUTE) * 0.5),
                coins: 0
            };
        }

        // Full XP
        let xp = durationMinutes * this.BASE_XP_PER_MINUTE;

        // Difficulty Multiplier
        let multiplier = 1;
        switch (difficulty) {
            case TaskDifficulty.Easy: multiplier = 1; break;
            case TaskDifficulty.Medium: multiplier = 1.2; break;
            case TaskDifficulty.Hard: multiplier = 1.5; break;
            case TaskDifficulty.Epic: multiplier = 2.0; break;
        }

        xp = Math.floor(xp * multiplier);

        // Coins = Approx 1 coin per 5 mins of effective focus
        const coins = Math.floor(xp / 5);

        return { xp, coins };
    }
}
