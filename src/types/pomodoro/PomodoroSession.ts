export enum TaskDifficulty {
    Easy = 'easy',
    Medium = 'medium',
    Hard = 'hard',
    Epic = 'epic',
}

export enum UserEnergy {
    Low = 'low',
    Medium = 'medium',
    High = 'high',
}

export interface PomodoroConfig {
    baseDuration: number; // default 25
    shortBreak: number;   // default 5
    longBreak: number;    // default 15
}

export interface PomodoroSession {
    id: string;
    userId: string;
    taskId?: string;

    // Planned vs Actual
    targetDuration: number;
    actualDuration: number;

    // Context
    taskDifficulty: TaskDifficulty;
    userEnergy: UserEnergy;

    // Outcome
    completed: boolean;
    interruptedCount: number;
    startTime: Date;
    endTime: Date;

    // Rewards
    xpEarned: number;
    coinsEarned: number;
}
