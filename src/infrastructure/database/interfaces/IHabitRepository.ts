import { IRepository } from './IRepository';
import { HabitTask } from '../../../types/habit/HabitTask';

export interface IHabitRepository extends IRepository<HabitTask> {
    findByUserId(userId: string): Promise<HabitTask[]>;
    findDueHabits(userId: string, date: Date): Promise<HabitTask[]>;
}
