import jwt from 'jsonwebtoken';
import { config } from '../../config';

export interface TokenPayload {
    userId: string;
    email: string;
    role?: string;
}

export class TokenManager {
    private secret: string;
    private expiresIn: string;

    constructor() {
        this.secret = config.jwtSecret;
        this.expiresIn = '1d';
    }

    generateToken(payload: TokenPayload): string {
        return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn as any });
    }

    verifyToken(token: string): TokenPayload {
        return jwt.verify(token, this.secret) as TokenPayload;
    }
}
