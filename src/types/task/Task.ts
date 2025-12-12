export interface TaskFailure {
    attemptedDate: Date;
    failureReason: "forgot" | "too-hard" | "overwhelmed" | "no-time" | "other";
    context?: string;
}

export interface TaskRetryOptions {
    splitIntoSubtasks: boolean;
    temporarySuspend: boolean;
    difficultyAdjust: boolean;
    compassionateReminder?: string;
}

export interface Task {
    id: string;
    userId: string;
    title: string;
    description?: string;

    // Urgency + Priority Matrix (2.1)
    priority: 1 | 2 | 3 | 4 | 5;
    urgency: 1 | 2 | 3 | 4 | 5;
    dueDate?: Date;
    timeRequired?: "quick" | "15min" | "30min" | "1hr" | "2hr+";
    energyRequirement?: "low" | "medium" | "high" | "variable";
    optimalTimeWindow?: {
        startHour: number;
        endHour: number;
        reason: "peak-focus" | "afternoon-slump" | "evening-wind-down";
    };

    // Task Failure + Compassionate Retry System (2.2)
    failureHistory: TaskFailure[];
    failureStreak: number;
    retryBonus?: number; // Increased XP/coins
    learningNote?: string;

    // Status
    isCompleted: boolean;
    completedAt?: Date;
}
