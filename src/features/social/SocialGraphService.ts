import { Friendship, DuelChallenge, DuelType } from '../../types/social/SocialGraph';

export class SocialGraphService {

    private friendships: Friendship[] = [];
    private duels: DuelChallenge[] = [];

    /**
     * Sends a friend request.
     */
    public sendFriendRequest(requesterId: string, receiverId: string): Friendship {
        const friendship: Friendship = {
            id: `f-${Date.now()}`,
            requesterId,
            receiverId,
            status: 'Pending',
            since: new Date()
        };
        this.friendships.push(friendship);
        return friendship;
    }

    /**
     * Accepts a friend request.
     */
    public acceptRequest(friendshipId: string): Friendship | undefined {
        const f = this.friendships.find(i => i.id === friendshipId);
        if (f) {
            f.status = 'Accepted';
            f.since = new Date();
        }
        return f;
    }

    /**
     * Creates a competitive duel.
     */
    public createDuel(challengerId: string, opponentId: string, type: DuelType, stake: number): DuelChallenge {
        const duel: DuelChallenge = {
            id: `d-${Date.now()}`,
            challengerId,
            opponentId,
            type,
            stakeAmount: stake,
            startDate: new Date(),
            endDate: new Date(), // Mock: ends immediately for test
            status: 'Active'
        };
        this.duels.push(duel);
        return duel;
    }

    /**
     * Resolves a duel by comparing scores.
     * Returns the winner ID.
     */
    public resolveDuel(duel: DuelChallenge, challengerScore: number, opponentScore: number): string {
        if (challengerScore > opponentScore) {
            duel.winnerId = duel.challengerId;
        } else if (opponentScore > challengerScore) {
            duel.winnerId = duel.opponentId;
        } else {
            duel.winnerId = 'Draw';
        }
        duel.status = 'Completed';
        return duel.winnerId;
    }
}
