export type ConnectionStatus = 'Pending' | 'Accepted' | 'Blocked';
export type DuelType = 'HighestXP' | 'FocusMarathon' | 'HabitStreak';

export interface Friendship {
    id: string;
    requesterId: string;
    receiverId: string;
    status: ConnectionStatus;
    since: Date;
}

export interface DuelChallenge {
    id: string;
    challengerId: string;
    opponentId: string;
    type: DuelType;
    stakeAmount: number; // Coins
    startDate: Date;
    endDate: Date;
    status: 'Active' | 'Completed' | 'Declined';
    winnerId?: string;
}
