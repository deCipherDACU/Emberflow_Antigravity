export type League = 'Beginner' | 'Intermediate' | 'Advanced' | 'Legendary';
export type LeaderboardType = 'Global' | 'HealthWarriors' | 'CareerClimbers' | 'ConsistencyKings';

export interface LeaderboardEntry {
    userId: string;
    displayName: string;
    avatarUrl?: string;
    score: number;
    rank: number;
    league: League;
    trend: 'up' | 'down' | 'stable'; // Comparison to previous rank
}

export interface Leaderboard {
    type: LeaderboardType;
    period: 'Weekly' | 'Monthly';
    entries: LeaderboardEntry[];
    lastUpdated: Date;
}
