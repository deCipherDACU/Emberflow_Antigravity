export interface SeasonReward {
    id: string;
    name: string;
    type: 'cosmetic' | 'currency' | 'badge';
    value?: number;
}

export interface RewardTier {
    tierNumber: number;
    requiredXp: number;
    freeReward?: SeasonReward;
    premiumReward?: SeasonReward;
}

export interface Season {
    id: string;
    name: string; // e.g. "Season 1: Cyberpunk Focus"
    startDate: Date;
    endDate: Date;
    themeColor: string;
    tiers: RewardTier[];
}

export interface BattlePass {
    userId: string;
    seasonId: string;
    isPremium: boolean;
    totalSeasonXp: number;
    currentTier: number;
    claimedTiers: number[]; // Reward tracking
}
