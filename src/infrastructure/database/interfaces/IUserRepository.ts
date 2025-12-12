import { IRepository } from './IRepository';
import { UserProfile } from '../../../types/user/UserProfile';

export interface IUserRepository extends IRepository<UserProfile> {
    findByEmail(email: string): Promise<UserProfile | null>;
    updateMooStats(userId: string, moodScore: number): Promise<void>;
}
