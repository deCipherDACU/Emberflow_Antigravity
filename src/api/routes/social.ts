import { Router } from 'express';
import { InMemoryGuildRepository } from '../../infrastructure/database/repositories/GuildRepository';
import { GuildService } from '../../features/social/GuildService';
import { InMemoryUserRepository } from '../../infrastructure/database/repositories/UserRepository';
import { AppError } from '../../errors/AppError';

import { validateResource } from '../middleware/validateResource';
import { createGuildSchema, startRaidSchema } from '../validators/guild.schema';

const router = Router();
const guildRepo = new InMemoryGuildRepository();
const userRepo = new InMemoryUserRepository();
const guildService = new GuildService();

// Create Guild
router.post('/guilds', validateResource(createGuildSchema), async (req, res, next) => {
    try {
        const { name, founderId } = req.body;
        const founder = await userRepo.findById(founderId);
        if (!founder) throw new AppError('Founder not found', 404);

        const newGuild = guildService.createGuild(founder, name);
        await guildRepo.create(newGuild);

        res.status(201).json({ status: 'success', data: newGuild });
    } catch (err) {
        next(err);
    }
});

// Start Raid
router.post('/guilds/:id/raid', validateResource(startRaidSchema), async (req, res, next) => {
    try {
        const { id } = req.params;
        const { bossName, hp } = req.body;

        const guild = await guildRepo.findById(id);
        if (!guild) throw new AppError('Guild not found', 404);

        const updatedGuild = guildService.startRaid(guild, bossName, hp);
        await guildRepo.update(id, updatedGuild);

        res.json({ status: 'success', data: updatedGuild });
    } catch (err) {
        next(err);
    }
});

export default router;
