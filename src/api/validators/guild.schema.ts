import { z } from 'zod';

export const createGuildSchema = z.object({
    body: z.object({
        name: z.string().min(3, 'Name must be at least 3 chars'),
        founderId: z.string().min(1, 'Founder ID is required')
    })
});

export const startRaidSchema = z.object({
    body: z.object({
        bossName: z.string().min(1, 'Boss name is required'),
        hp: z.number().int().positive('HP must be positive')
    }),
    params: z.object({
        id: z.string().min(1, 'Guild ID is required')
    })
});
