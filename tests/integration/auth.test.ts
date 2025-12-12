import request from 'supertest';
import app from '../../src/api/server';
import { InMemoryUserRepository } from '../../src/infrastructure/database/repositories/UserRepository';

// Mock DI manually if needed, but integration tests usually hit the app
// Since our server initializes its own dependencies (bad for testing DI), we might need to mock within the module system or just test the flow using the in-memory state.
// Note: server.ts creates new instances, so state is reset on restart but per-request it persists while app is running.
// Jest resets modules between test files usually.

describe('Auth Integration Tests', () => {

    // We'll trust the in-memory persistence within the app instance for this test scope

    const newUser = {
        email: 'test@example.com',
        password: 'password123',
        displayName: 'Test User'
    };

    let token: string;

    test('POST /api/v1/auth/register - Should create user and return token', async () => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .send(newUser);

        expect(res.status).toBe(201);
        expect(res.body.status).toBe('success');
        expect(res.body.data).toHaveProperty('token');
        expect(res.body.data.user).toHaveProperty('id');
        expect(res.body.data.user.email).toBe(newUser.email);

        token = res.body.data.token;
    });

    test('POST /api/v1/auth/login - Should return token for valid credentials', async () => {
        // Use the created user
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: newUser.email,
                password: newUser.password
            });

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty('token');
        expect(res.body.data.user.email).toBe(newUser.email);
    });

    test('POST /api/v1/auth/login - Should fail for invalid password', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: newUser.email,
                password: 'wrongpassword'
            });

        expect(res.status).toBe(401); // 401 Unauthorized
    });

    test('POST /api/v1/auth/register - Should fail for duplicate email', async () => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .send(newUser);

        expect(res.status).toBe(400);
    });

});
