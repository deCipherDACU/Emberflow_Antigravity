import { Task, TaskFailure, TaskRetryOptions } from '../../types/task/Task';

export class TaskFailureService {

    /**
     * Records a failure for a task and updates the failure streak.
     */
    public recordFailure(task: Task, reason: TaskFailure['failureReason'], context?: string): Task {
        const failure: TaskFailure = {
            attemptedDate: new Date(),
            failureReason: reason,
            context: context
        };

        task.failureHistory.push(failure);
        task.failureStreak += 1;

        // Reset learning note to encourage new reflection
        task.learningNote = undefined;

        return task;
    }

    /**
     * Determines the compassionate retry options based on the failure history and streak.
     */
    public getRetryOptions(task: Task): TaskRetryOptions {
        const streak = task.failureStreak;

        const options: TaskRetryOptions = {
            splitIntoSubtasks: false,
            temporarySuspend: false,
            difficultyAdjust: false,
            compassionateReminder: undefined
        };

        if (streak >= 2) {
            options.splitIntoSubtasks = true;
            options.compassionateReminder = this.generateCompassionateMessage(task);
        }

        if (streak >= 3) {
            options.temporarySuspend = true;
            options.difficultyAdjust = true;
        }

        return options;
    }

    /**
     * Calculates the retry bonus (XP/coins) to encourage the user to try again.
     */
    public calculateRetryBonus(task: Task): number {
        // Example logic: +10% bonus per failure, capped at 50%
        const bonusPercentage = Math.min(task.failureStreak * 0.10, 0.50);
        const baseReward = 100; // Assuming a base reward, this should ideally come from the task or config
        return Math.floor(baseReward * bonusPercentage);
    }

    private generateCompassionateMessage(task: Task): string {
        const recentFailure = task.failureHistory[task.failureHistory.length - 1];
        const reason = recentFailure?.failureReason;

        switch (reason) {
            case 'too-hard':
                return "This looks like a tough one. Want to break it down into smaller pieces?";
            case 'overwhelmed':
                return "It's okay to feel overwhelmed. Let's just focus on the first tiny step.";
            case 'no-time':
                return "Time got away from you? Maybe we can schedule a specific 15-min block for this.";
            case 'forgot':
                return "No worries! It happens. Let's set a reminder for next time.";
            default:
                return "Struggling with this task? That's part of the process. Let's try a different approach.";
        }
    }
}
