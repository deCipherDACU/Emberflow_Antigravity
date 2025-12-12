import { Router } from 'express';
import { AuthService } from '../../infrastructure/auth/AuthService';
import { PasswordHasher } from '../../infrastructure/auth/PasswordHasher';
import { TokenManager } from '../../infrastructure/auth/TokenManager';
import { InMemoryUserRepository } from '../../infrastructure/database/repositories/UserRepository';
import { OnboardingService } from '../../features/onboarding/OnboardingService';
import { validateResource } from '../middleware/validateResource';
import { loginSchema, registerSchema } from '../validators/auth.schema';

const router = Router();

// DI Container (Manual for now)
const userRepo = new InMemoryUserRepository();
const hasher = new PasswordHasher();
const tokenManager = new TokenManager();
const onboardingService = new OnboardingService();
const authService = new AuthService(userRepo, hasher, tokenManager, onboardingService);

router.post('/register', validateResource(registerSchema), async (req, res, next) => {
    try {
        const { email, password, displayName } = req.body;
        const result = await authService.register(email, password, displayName);
        res.status(201).json({ status: 'success', data: result });
    } catch (err) {
        next(err);
    }
});

router.post('/login', validateResource(loginSchema), async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.status(200).json({ status: 'success', data: result });
    } catch (err) {
        next(err);
    }
});

export default router;
