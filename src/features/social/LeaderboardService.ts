import {
    Leaderboard,
    LeaderboardEntry,
    LeaderboardType,
    League
} from '../../types/social/Leaderboard';
import { UserProfile } from '../../types/user/UserProfile';

export class LeaderboardService {

    /**
     * Assigns a user to a competing league based on their level.
     * Ensures fair play (Noobs don't fight Gods).
     */
    public determineLeague(level: number): League {
        if (level <= 15) return 'Beginner';
        if (level <= 40) return 'Intermediate';
        if (level <= 70) return 'Advanced';
        return 'Legendary';
    }

    /**
     * Generates a leaderboard from a list of users.
     * Filters by league and sorts by score.
     */
    public generateLeaderboard(
        type: LeaderboardType,
        users: UserProfile[],
        targetLeague: League
    ): Leaderboard {

        // 1. Filter: Only users in this league
        const leagueUsers = users.filter(u => this.determineLeague(u.level) === targetLeague);

        // 2. Map: Convert UserProfile to Entry with relevant score
        const entries: LeaderboardEntry[] = leagueUsers.map(user => {
            let score = 0;
            switch (type) {
                case 'Global': score = user.currentXp; break; // Total XP
                case 'ConsistencyKings': score = user.onboarding.dailyAvailability === '6+ hrs' ? 10 : 5; break; // Mock logic
                // ... other categories would pull from specific stats
                default: score = user.currentXp;
            }

            return {
                userId: user.id,
                displayName: user.displayName,
                league: targetLeague,
                score: score,
                rank: 0, // Calculated next
                trend: 'stable'
            };
        });

        // 3. Sort: Descending order
        entries.sort((a, b) => b.score - a.score);

        // 4. Rank: Assign indices
        entries.forEach((entry, index) => {
            entry.rank = index + 1;
        });

        return {
            type,
            period: 'Weekly',
            entries,
            lastUpdated: new Date()
        };
    }
}
