import { BattlePass, Season, RewardTier, SeasonReward } from '../../types/seasonal/Season';

export class SeasonService {

    /**
     * Adds XP to a user's Battle Pass and updates their Tier.
     */
    public addSeasonXp(pass: BattlePass, season: Season, amount: number): BattlePass {
        pass.totalSeasonXp += amount;

        // Check if new tier(s) reached
        while (pass.currentTier < season.tiers.length) {
            const nextTierConfig = season.tiers[pass.currentTier]; // 0-indexed matches tier order
            if (pass.totalSeasonXp >= nextTierConfig.requiredXp) {
                pass.currentTier += 1;
            } else {
                break; // Not enough XP for next tier
            }
        }

        return pass;
    }

    /**
     * Identifies claimable rewards based on unlocked tier + premium status.
     */
    public getClaimableRewards(pass: BattlePass, season: Season): SeasonReward[] {
        const rewards: SeasonReward[] = [];

        // Iterate through all unlocked tiers
        for (let i = 0; i < pass.currentTier; i++) {
            // Skip if already claimed
            // In a real app we'd check pass.claimedTiers.includes(i+1)

            const tier = season.tiers[i];

            if (tier.freeReward) {
                rewards.push(tier.freeReward);
            }

            if (pass.isPremium && tier.premiumReward) {
                rewards.push(tier.premiumReward);
            }
        }

        return rewards;
    }
}
