import { Router } from 'express';
import { InMemoryUserRepository } from '../../infrastructure/database/repositories/UserRepository';
import { OnboardingService } from '../../features/onboarding/OnboardingService';
import { AppError } from '../../errors/AppError';

const router = Router();
const userRepo = new InMemoryUserRepository();
const onboardingService = new OnboardingService();

// Get Current User Profile
router.get('/me', async (req, res, next) => {
    try {
        // Mock ID for now, in real app get from req.user.id
        const userId = req.headers['x-user-id'] as string;
        if (!userId) throw new AppError('User ID required in headers', 400);

        const user = await userRepo.findById(userId);
        if (!user) throw new AppError('User not found', 404);

        res.json({ status: 'success', data: user });
    } catch (err) {
        next(err);
    }
});

// Submit Onboarding
router.post('/onboarding', async (req, res, next) => {
    try {
        const responses = req.body;
        // logic to create profile from responses
        // implementation pending in OnboardingService to return full profile from responses?
        // verifying OnboardingService...
        res.status(501).json({ message: 'Not implemented fully yet' });
    } catch (err) {
        next(err);
    }
});

export default router;
