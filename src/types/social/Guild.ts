export type GuildRole = 'Leader' | 'Elder' | 'Member';

export interface GuildMember {
    userId: string;
    displayName: string;
    role: GuildRole;
    contributionPoints: number; // Total damage dealt to raids
    joinedAt: Date;
}

export interface RaidRewards {
    xp: number;
    coins: number;
    specialItem?: string;
}

export interface RaidBoss {
    id: string;
    name: string;
    totalHp: number;
    currentHp: number;
    phase: number; // 1, 2, 3
    rewards: RaidRewards;
    isActive: boolean;
}

export interface Guild {
    id: string;
    name: string;
    level: number;
    description: string;
    members: GuildMember[];
    currentRaid: RaidBoss | null;
    treasury: {
        coins: number;
        gems: number;
    };
}
