import { IRepository } from './IRepository';
import { Guild } from '../../../types/social/Guild';

export interface IGuildRepository extends IRepository<Guild> {
    findByName(name: string): Promise<Guild | null>;
    findByMemberId(userId: string): Promise<Guild | null>;
}
