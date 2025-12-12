export type HabitStage = 'Awareness' | 'Formation' | 'Resistance' | 'Automatic' | 'Mastery';

export interface HabitInfo {
    // Science of Habit
    cue: string;     // Trigger (e.g., "After coffee")
    routine: string; // Action (e.g., "Read 5 pages")
    reward: string;  // Benefit (e.g., "Feeling smart + 5XP")

    // Progress
    consecutiveDays: number;
    totalCompletions: number;
    lastCompletedDate: Date | null;
    formationProgress: number; // 0-100%
    currentStage: HabitStage;

    // Compassionate Logic
    twoDayRuleActive: boolean; // True if user missed yesterday and MUST do today to save streak
}

export interface HabitTask {
    id: string;
    userId: string;
    title: string;
    habit: HabitInfo;
}

export interface MilestoneEvent {
    message: string;
    bonusXp: number;
    isUnlocked: boolean;
}
