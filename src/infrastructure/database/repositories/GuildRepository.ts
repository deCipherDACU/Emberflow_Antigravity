import { IGuildRepository } from '../interfaces/IGuildRepository';
import { Guild } from '../../../types/social/Guild';

export class InMemoryGuildRepository implements IGuildRepository {
    private guilds: Map<string, Guild> = new Map();

    async findById(id: string): Promise<Guild | null> {
        return this.guilds.get(id) || null;
    }

    async findAll(): Promise<Guild[]> {
        return Array.from(this.guilds.values());
    }

    async create(data: Guild): Promise<Guild> {
        this.guilds.set(data.id, data);
        return data;
    }

    async update(id: string, data: Partial<Guild>): Promise<Guild> {
        const guild = this.guilds.get(id);
        if (!guild) throw new Error('Guild not found');
        const updated = { ...guild, ...data };
        this.guilds.set(id, updated);
        return updated;
    }

    async delete(id: string): Promise<boolean> {
        return this.guilds.delete(id);
    }

    async findByName(name: string): Promise<Guild | null> {
        return Array.from(this.guilds.values()).find(g => g.name === name) || null;
    }

    async findByMemberId(userId: string): Promise<Guild | null> {
        return Array.from(this.guilds.values()).find(g =>
            g.members.some(m => m.userId === userId)
        ) || null;
    }
}
