import { ISeasonRepository } from '../interfaces/ISeasonRepository';
import { Season, BattlePass } from '../../../types/seasonal/Season';

export class InMemorySeasonRepository implements ISeasonRepository {
    private seasons: Map<string, Season> = new Map();
    private battlePasses: Map<string, BattlePass> = new Map(); // key: userId-seasonId

    async findById(id: string): Promise<Season | null> {
        return this.seasons.get(id) || null;
    }

    async findAll(): Promise<Season[]> {
        return Array.from(this.seasons.values());
    }

    async create(data: Season): Promise<Season> {
        this.seasons.set(data.id, data);
        return data;
    }

    async update(id: string, data: Partial<Season>): Promise<Season> {
        const season = this.seasons.get(id);
        if (!season) throw new Error('Season not found');
        const updated = { ...season, ...data };
        this.seasons.set(id, updated);
        return updated;
    }

    async delete(id: string): Promise<boolean> {
        return this.seasons.delete(id);
    }

    async findActiveSeason(date: Date): Promise<Season | null> {
        return Array.from(this.seasons.values()).find(s =>
            date >= s.startDate && date <= s.endDate
        ) || null;
    }

    async findBattlePass(userId: string, seasonId: string): Promise<BattlePass | null> {
        const key = `${userId}-${seasonId}`;
        return this.battlePasses.get(key) || null;
    }

    async saveBattlePass(pass: BattlePass): Promise<BattlePass> {
        const key = `${pass.userId}-${pass.seasonId}`;
        this.battlePasses.set(key, pass);
        return pass;
    }
}
