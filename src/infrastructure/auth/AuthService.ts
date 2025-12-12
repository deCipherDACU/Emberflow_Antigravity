import { IUserRepository } from '../database/interfaces/IUserRepository';
import { PasswordHasher } from './PasswordHasher';
import { TokenManager } from './TokenManager';
import { AuthenticationError, ValidationError } from '../../errors/AppError';
import { UserProfile } from '../../types/user/UserProfile';
import { OnboardingService } from '../../features/onboarding/OnboardingService';
import {
    LearningStyle, MotivationType, FocusStrength,
    DailyAvailability, ExperienceLevel, BurnoutRisk
} from '../../features/onboarding/constants';

export class AuthService {
    constructor(
        private userRepo: IUserRepository,
        private passwordHasher: PasswordHasher,
        private tokenManager: TokenManager,
        private onboardingService: OnboardingService // To initialize profile
    ) { }

    async register(email: string, password: string, displayName: string): Promise<{ user: UserProfile, token: string }> {
        const existing = await this.userRepo.findByEmail(email);
        if (existing) throw new ValidationError('Email already exists');

        const hashedPassword = await this.passwordHasher.hash(password);

        // Create default profile (User would typically update this via Onboarding later)
        // For now, initializing with defaults or "Empty" onboarding
        const profile: UserProfile = {
            id: `u-${Date.now()}`,
            email,
            displayName,
            avatarUrl: 'default_avatar.png',
            onboarding: {
                learningStyle: LearningStyle.Visual, // Defaults
                motivationType: MotivationType.Intrinsic,
                focusStrength: FocusStrength.Moderate,
                dailyAvailability: DailyAvailability.Moderate,
                experienceLevel: ExperienceLevel.Newbie,
                painPoints: [],
                preferredRewardType: 'xp'
            },
            wellness: {
                mentalHealthCheck: { baselineMood: 5, stressLevel: 'moderate' },
                supportingConditions: [],
                motivationalTriggers: [],
                burnoutThreshold: 5
            },
            performance: {
                recentCompletionRate: 0,
                avgTasksPerDay: 0,
                burnoutRisk: BurnoutRisk.Low,
                recommendedDailyLoad: 3,
                streakVulnerability: 0
            },
            level: 1,
            currentXp: 0,
            currency: { coins: 0, gems: 0 },
            createdAt: new Date(),
            lastLogin: new Date()
        };

        // TODO: Store password hash. 
        // Hack for InMemoryRepo: Determine where to store hash if UserProfile doesn't have it.
        // For this prototype, we'll attach it to the object but cast it avoiding TS errors in Repo if needed, 
        // OR we update UserProfile to optional passwordHash, 
        // OR we enforce InMemoryUserRepository to handle a separate "AuthStore".

        // Let's assume userRepo.create accepts generic or we extend the repo to 'createWithAuth'
        // For simplicity in this turn, I will assume the repo can store it if I attach it, 
        // but strictly I should update the Type or Repo.

        // BETTER: Extend `create` in `AuthService` to store credentials separately 
        // but `InMemoryUserRepository` is our only storage.
        // I will add `passwordHash` to the `UserProfile` type as optional for now to unblock.
        (profile as any).passwordHash = hashedPassword;

        await this.userRepo.create(profile);

        const token = this.tokenManager.generateToken({ userId: profile.id, email: profile.email });
        return { user: profile, token };
    }

    async login(email: string, password: string): Promise<{ user: UserProfile, token: string }> {
        const user = await this.userRepo.findByEmail(email);
        if (!user) throw new AuthenticationError('Invalid credentials');

        // Retrieve hash (casted from our hack above)
        const storedHash = (user as any).passwordHash;
        if (!storedHash) throw new AuthenticationError('Invalid credentials (no hash)');

        const isValid = await this.passwordHasher.compare(password, storedHash);
        if (!isValid) throw new AuthenticationError('Invalid credentials');

        const token = this.tokenManager.generateToken({ userId: user.id, email: user.email });
        return { user, token };
    }
}
