import { IRepository } from './IRepository';
import { Season, BattlePass } from '../../../types/seasonal/Season';

export interface ISeasonRepository extends IRepository<Season> {
    findActiveSeason(date: Date): Promise<Season | null>;
    findBattlePass(userId: string, seasonId: string): Promise<BattlePass | null>;
    saveBattlePass(pass: BattlePass): Promise<BattlePass>;
}
