export type PartnershipStatus = 'Pending' | 'Active' | 'Dissolved';

export interface Partnership {
    id: string;
    user1Id: string;
    user2Id: string;
    startDate: Date;
    status: PartnershipStatus;
    currentStreak: number; // Weeks in a row with successful syncs
}

export interface WeeklyCheckIn {
    userId: string;
    weekEnding: Date;
    wins: string[];
    struggles: string[];
    commitmentMet: boolean;
}

export interface WeeklyContract {
    id: string;
    partnershipId: string;
    weekEnding: Date;
    checkIns: WeeklyCheckIn[]; // Max 2
    status: 'Open' | 'Completed' | 'Failed';
}
