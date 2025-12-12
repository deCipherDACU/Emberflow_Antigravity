import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../../errors/AppError';

export const validateResource = (schema: ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (e: any) {
        if (e instanceof ZodError) {
            const details = (e as any).errors.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ');
            return next(new ValidationError(details));
        }
        next(e);
    }
};
