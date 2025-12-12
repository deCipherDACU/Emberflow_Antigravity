import { IUserRepository } from '../interfaces/IUserRepository';
import { UserProfile } from '../../../types/user/UserProfile';

export class InMemoryUserRepository implements IUserRepository {
    private users: Map<string, UserProfile> = new Map();

    async findById(id: string): Promise<UserProfile | null> {
        return this.users.get(id) || null;
    }

    async findAll(): Promise<UserProfile[]> {
        return Array.from(this.users.values());
    }

    async create(data: UserProfile): Promise<UserProfile> {
        this.users.set(data.id, data);
        return data;
    }

    async update(id: string, data: Partial<UserProfile>): Promise<UserProfile> {
        const user = this.users.get(id);
        if (!user) throw new Error('User not found');
        const updated = { ...user, ...data };
        this.users.set(id, updated);
        return updated;
    }

    async delete(id: string): Promise<boolean> {
        return this.users.delete(id);
    }

    async findByEmail(email: string): Promise<UserProfile | null> {
        return Array.from(this.users.values()).find(u => u.email === email) || null;
    }

    async updateMooStats(userId: string, moodScore: number): Promise<void> {
        const user = this.users.get(userId);
        if (user) {
            // Update logic here if mood stats were part of UserProfile
            // user.performance...
        }
    }
}
