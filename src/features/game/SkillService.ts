import { SkillNode, UserSkills, BuffType } from '../../types/game/SkillTree';

export class SkillService {

    // Mock Skill Tree Configuration
    private skillTree: SkillNode[] = [
        {
            id: "root-1",
            name: "Focus Novice",
            description: "+10% XP from Pomodoros",
            cost: 1,
            buffType: 'FocusXP',
            buffValue: 0.1
        },
        {
            id: "branch-1",
            name: "Iron Will",
            description: "Reduce Burnout gain by 20%",
            cost: 2,
            buffType: 'BurnoutResistance',
            buffValue: 0.2,
            requiredParentId: "root-1"
        }
    ];

    /**
     * Attempts to unlock a skill node for a user.
     */
    public unlockNode(userSkills: UserSkills, nodeId: string): { success: boolean, reason?: string } {
        if (userSkills.unlockedNodeIds.includes(nodeId)) {
            return { success: false, reason: "Already unlocked." };
        }

        const node = this.skillTree.find(n => n.id === nodeId);
        if (!node) return { success: false, reason: "Node not found." };

        // Check Cost
        if (userSkills.availablePoints < node.cost) {
            return { success: false, reason: "Insufficient points." };
        }

        // Check Parent Prerequisite
        if (node.requiredParentId && !userSkills.unlockedNodeIds.includes(node.requiredParentId)) {
            return { success: false, reason: "Parent skill locked." };
        }

        // Unlock
        userSkills.availablePoints -= node.cost;
        userSkills.unlockedNodeIds.push(nodeId);
        return { success: true };
    }

    /**
     * Calculates the total bonus for a specific buff type.
     */
    public getTotalBuff(userSkills: UserSkills, type: BuffType): number {
        let total = 0;
        for (const id of userSkills.unlockedNodeIds) {
            const node = this.skillTree.find(n => n.id === id);
            if (node && node.buffType === type) {
                total += node.buffValue;
            }
        }
        return total;
    }
}
