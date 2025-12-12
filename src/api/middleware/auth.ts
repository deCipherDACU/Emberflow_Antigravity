import { Request, Response, NextFunction } from 'express';
import { AuthenticationError } from '../../errors/AppError';
import { TokenManager } from '../../infrastructure/auth/TokenManager';

const tokenManager = new TokenManager();

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AuthenticationError('No token provided'));
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = tokenManager.verifyToken(token);
        // Attach user to req (Need to extend Request type, simplified here)
        (req as any).user = payload;
        next();
    } catch (err) {
        return next(new AuthenticationError('Invalid token'));
    }
};
