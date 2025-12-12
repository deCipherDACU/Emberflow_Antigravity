import { HabitTask, HabitStage, MilestoneEvent } from '../../types/habit/HabitTask';

export class HabitService {

    private readonly FORMATION_TARGET_DAYS = 23; // "Magic number" for initial automaticity

    /**
     * Calculates the psychological stage of habit formation based on consistency.
     */
    public calculateProgress(streakDays: number): { progress: number; stage: HabitStage } {
        const progress = Math.min(100, Math.floor((streakDays / this.FORMATION_TARGET_DAYS) * 100));

        let stage: HabitStage = 'Awareness';

        if (streakDays < 3) stage = 'Awareness';
        else if (streakDays < 7) stage = 'Formation';
        else if (streakDays < 21) stage = 'Resistance'; // The "Dip" usually happens here
        else if (streakDays < 66) stage = 'Automatic';
        else stage = 'Mastery';

        return { progress, stage };
    }

    /**
     * Checks if completion triggers a special celebration.
     */
    public checkMilestone(task: HabitTask): MilestoneEvent | null {
        const days = task.habit.consecutiveDays;

        if (days === 3) return { message: "Starting Strong! That's 3 days!", bonusXp: 20, isUnlocked: true };
        if (days === 7) return { message: "One Week Down! Awesome consistency.", bonusXp: 50, isUnlocked: true };
        if (days === 23) return { message: "Habit Locked In! It's becoming automatic.", bonusXp: 200, isUnlocked: true };
        if (days === 66) return { message: "True Mastery. You are a new person.", bonusXp: 500, isUnlocked: true };

        return null;
    }

    /**
     * Updates habit state after completion. (Mock logic for demonstration)
     */
    public processCompletion(task: HabitTask): HabitTask {
        const updated = { ...task };
        updated.habit.consecutiveDays += 1;
        updated.habit.totalCompletions += 1;
        updated.habit.lastCompletedDate = new Date();

        const calculation = this.calculateProgress(updated.habit.consecutiveDays);
        updated.habit.formationProgress = calculation.progress;
        updated.habit.currentStage = calculation.stage;

        updated.habit.twoDayRuleActive = false; // Reset if they completed it

        return updated;
    }
}
