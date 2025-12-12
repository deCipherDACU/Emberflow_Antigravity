import { Partnership, WeeklyContract, WeeklyCheckIn } from '../../types/social/Accountability';

export class AccountabilityService {

    /**
     * Links two users as accountability partners.
     */
    public createPartnership(user1Id: string, user2Id: string): Partnership {
        return {
            id: `p-${Date.now()}`,
            user1Id,
            user2Id,
            startDate: new Date(),
            status: 'Active',
            currentStreak: 0
        };
    }

    /**
     * Creates a new contract for the week (or retrieves existing).
     */
    public startWeeklyContract(partnershipId: string): WeeklyContract {
        const nextFriday = new Date();
        nextFriday.setDate(nextFriday.getDate() + (5 - nextFriday.getDay() + 7) % 7); // Next Friday

        return {
            id: `wc-${Date.now()}`,
            partnershipId,
            weekEnding: nextFriday,
            checkIns: [],
            status: 'Open'
        };
    }

    /**
     * Submits a review. If both partners submit, contract is Complete.
     */
    public submitCheckIn(contract: WeeklyContract, userId: string, wins: string[], metCommitment: boolean): { contract: WeeklyContract, isComplete: boolean } {
        const checkIn: WeeklyCheckIn = {
            userId,
            weekEnding: contract.weekEnding,
            wins,
            struggles: [],
            commitmentMet: metCommitment
        };

        contract.checkIns.push(checkIn);

        let isComplete = false;
        if (contract.checkIns.length === 2) {
            contract.status = 'Completed';
            isComplete = true; // Trigger rewards!
        }

        return { contract, isComplete };
    }
}
