export type BuffType = 'FocusXP' | 'BurnoutResistance' | 'LootChance';

export interface SkillNode {
    id: string;
    name: string;
    description: string;
    cost: number; // Skill Points
    buffType: BuffType;
    buffValue: number; // e.g. 0.1 for +10%
    requiredParentId?: string;
}

export interface UserSkills {
    userId: string;
    availablePoints: number;
    unlockedNodeIds: string[];
}
