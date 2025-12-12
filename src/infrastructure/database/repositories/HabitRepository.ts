import { IHabitRepository } from '../interfaces/IHabitRepository';
import { HabitTask } from '../../../types/habit/HabitTask';

export class InMemoryHabitRepository implements IHabitRepository {
    private habits: Map<string, HabitTask> = new Map();

    async findById(id: string): Promise<HabitTask | null> {
        return this.habits.get(id) || null;
    }

    async findAll(): Promise<HabitTask[]> {
        return Array.from(this.habits.values());
    }

    async create(data: HabitTask): Promise<HabitTask> {
        this.habits.set(data.id, data);
        return data;
    }

    async update(id: string, data: Partial<HabitTask>): Promise<HabitTask> {
        const habit = this.habits.get(id);
        if (!habit) throw new Error('Habit not found');
        const updated = { ...habit, ...data };
        this.habits.set(id, updated);
        return updated;
    }

    async delete(id: string): Promise<boolean> {
        return this.habits.delete(id);
    }

    async findByUserId(userId: string): Promise<HabitTask[]> {
        return Array.from(this.habits.values()).filter(h => h.userId === userId);
    }

    async findDueHabits(userId: string, date: Date): Promise<HabitTask[]> {
        // Simplified check: assume all habits are daily for now or checking frequency
        return this.findByUserId(userId);
    }
}
