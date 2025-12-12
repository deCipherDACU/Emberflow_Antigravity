import { Guild, GuildMember, RaidBoss } from '../../types/social/Guild';
import { UserProfile } from '../../types/user/UserProfile';

export class GuildService {

    /**
     * Creates a new guild with the founder as Leader.
     */
    public createGuild(founder: UserProfile, name: string): Guild {
        const leader: GuildMember = {
            userId: founder.id,
            displayName: founder.displayName,
            role: 'Leader',
            contributionPoints: 0,
            joinedAt: new Date()
        };

        return {
            id: `g-${Date.now()}`,
            name,
            level: 1,
            description: `Efficiency guild led by ${founder.displayName}`,
            members: [leader],
            currentRaid: null,
            treasury: { coins: 0, gems: 0 }
        };
    }

    /**
     * Starts a new Raid Boss for the guild.
     */
    public startRaid(guild: Guild, bossName: string, bossHp: number): Guild {
        const raidBoss: RaidBoss = {
            id: `rb-${Date.now()}`,
            name: bossName,
            totalHp: bossHp,
            currentHp: bossHp,
            rewards: { xp: 1000, coins: 500 },
            phase: 1,
            isActive: true
        };

        return {
            ...guild,
            currentRaid: raidBoss
        };
    }

    /**
     * User contributes damage to the raid boss.
     */
    public contributeToRaid(guild: Guild, memberId: string, damage: number): { guild: Guild, damageDealt: number; bossDefeated: boolean } {
        if (!guild.currentRaid || !guild.currentRaid.isActive) {
            return { guild, damageDealt: 0, bossDefeated: false };
        }

        // Update Boss HP (Immutable style)
        const newHp = Math.max(0, guild.currentRaid.currentHp - damage);

        const updatedRaid = {
            ...guild.currentRaid,
            currentHp: newHp,
            isActive: newHp > 0
        };

        // Update Member Contribution
        const updatedMembers = guild.members.map(m => {
            if (m.userId === memberId) {
                return { ...m, contributionPoints: m.contributionPoints + damage };
            }
            return m;
        });

        const updatedGuild = {
            ...guild,
            members: updatedMembers,
            currentRaid: updatedRaid
        };

        const bossDefeated = newHp === 0;

        return { guild: updatedGuild, damageDealt: damage, bossDefeated };
    }
}
