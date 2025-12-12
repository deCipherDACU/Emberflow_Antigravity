import { TaskFailureService } from '../../../src/features/task/TaskFailureService';
import { Task } from '../../../src/types/task/Task';

describe('TaskFailureService', () => {
    let service: TaskFailureService;
    let mockTask: Task;

    beforeEach(() => {
        service = new TaskFailureService();
        mockTask = {
            id: 'task-123',
            userId: 'user-456',
            title: 'Complete Project',
            description: 'Finish the Emberflow core logic',
            priority: 5,
            urgency: 4,
            failureHistory: [],
            failureStreak: 0,
            isCompleted: false
        };
    });

    test('should record a failure correctly', () => {
        const updatedTask = service.recordFailure(mockTask, 'too-hard', 'Late night attempt');

        expect(updatedTask.failureHistory).toHaveLength(1);
        expect(updatedTask.failureHistory[0].failureReason).toBe('too-hard');
        expect(updatedTask.failureHistory[0].context).toBe('Late night attempt');
        expect(updatedTask.failureStreak).toBe(1);
    });

    test('should suggest splitting subtasks after 2 failures', () => {
        service.recordFailure(mockTask, 'too-hard');
        service.recordFailure(mockTask, 'too-hard');

        const options = service.getRetryOptions(mockTask);

        expect(options.splitIntoSubtasks).toBe(true);
        expect(options.compassionateReminder).toBe("This looks like a tough one. Want to break it down into smaller pieces?");
    });

    test('should suggest temporary suspend and difficulty adjust after 3 failures', () => {
        service.recordFailure(mockTask, 'overwhelmed');
        service.recordFailure(mockTask, 'overwhelmed');
        service.recordFailure(mockTask, 'overwhelmed');

        const options = service.getRetryOptions(mockTask);

        expect(options.splitIntoSubtasks).toBe(true); // Still true as it is > 2
        expect(options.temporarySuspend).toBe(true);
        expect(options.difficultyAdjust).toBe(true);
        expect(options.compassionateReminder).toBe("It's okay to feel overwhelmed. Let's just focus on the first tiny step.");
    });

    test('should calculate retry bonus correctly', () => {
        service.recordFailure(mockTask, 'forgot'); // Streak 1
        let bonus = service.calculateRetryBonus(mockTask);
        expect(bonus).toBe(10); // 10% of 100

        service.recordFailure(mockTask, 'forgot'); // Streak 2
        bonus = service.calculateRetryBonus(mockTask);
        expect(bonus).toBe(20); // 20% of 100

        // Simulate many failures to test cap
        for(let i=0; i<10; i++) {
             service.recordFailure(mockTask, 'forgot');
        }
        bonus = service.calculateRetryBonus(mockTask);
        expect(bonus).toBe(50); // Capped at 50%
    });
});
