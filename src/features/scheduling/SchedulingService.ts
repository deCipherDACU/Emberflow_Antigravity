import { ScheduleSuggestion, TimeSlot, EnergyLevel } from '../../types/scheduling/Scheduler';
import { UserProfile } from '../../types/user/UserProfile';
import { TaskDifficulty } from '../../types/pomodoro/PomodoroSession';

export class SchedulingService {

    /**
     * Suggests the optimal time for a task based on its difficulty and the user's profile.
     * Assumes 'Morning' people have high energy 09:00-11:00.
     */
    public suggestOptimalTime(taskId: string, taskDifficulty: TaskDifficulty, userProfile: UserProfile): ScheduleSuggestion {
        let suggestedSlot: TimeSlot;
        let reason = "";

        // Infer Peak Hours from Daily Availability (Mock Logic)
        // In a real app, 'userProfile.onboarding.dailyAvailability' (e.g. '09:00-17:00') would be parsed.
        // Here we treat 'Morning' people (or default) as having peak focus 09:00-11:00.

        // Rule 1: Deep Work (Hard/Epic) needs High Energy
        if (taskDifficulty === TaskDifficulty.Hard || taskDifficulty === TaskDifficulty.Epic) {
            suggestedSlot = { startTime: "09:00", endTime: "11:00", energyLevel: "High" };
            reason = "High focus required. Matched with morning peak energy.";
        }
        // Rule 2: Low Work (Easy) needs Low Energy (Siesta time)
        else {
            suggestedSlot = { startTime: "14:00", endTime: "15:00", energyLevel: "Low" };
            reason = "Routine task. Scheduled during afternoon dip.";
        }

        return {
            taskId: taskId,
            suggestedSlot,
            confidenceScore: 0.9,
            reason
        };
    }
}
