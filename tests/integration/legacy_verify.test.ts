import { OnboardingService, OnboardingQuizResponses } from '../../src/features/onboarding/OnboardingService';
import { AIService } from '../../src/features/ai/AIService';
import { GuildService } from '../../src/features/social/GuildService';
import { SeasonService } from '../../src/features/seasonal/SeasonService';
import { AccountabilityService } from '../../src/features/social/AccountabilityService';
import { SchedulingService } from '../../src/features/scheduling/SchedulingService';
import { NarrativeService } from '../../src/features/game/NarrativeService';
import { JournalService } from '../../src/features/journal/JournalService';
import { SocialGraphService } from '../../src/features/social/SocialGraphService';
import { SkillService } from '../../src/features/game/SkillService';
import { AchievementService } from '../../src/features/game/AchievementService';
import {
    LearningStyle,
    MotivationType,
    FocusStrength,
    DailyAvailability,
    ExperienceLevel,
    Mood
} from '../../src/features/onboarding/constants';
import { TaskDifficulty } from '../../src/types/pomodoro/PomodoroSession';
import { Season, BattlePass } from '../../src/types/seasonal/Season';

describe('Legacy Verification Integration Tests', () => {
    const onboardingService = new OnboardingService();
    const aiService = new AIService();
    const guildService = new GuildService();
    const seasonService = new SeasonService();
    const accountabilityService = new AccountabilityService();
    const schedulingService = new SchedulingService();
    const narrativeService = new NarrativeService();
    const journalService = new JournalService();
    const socialService = new SocialGraphService();
    const skillService = new SkillService();
    const achievementService = new AchievementService();

    // Setup Profile
    const mockResponses: OnboardingQuizResponses = {
        learningStyle: LearningStyle.Visual,
        motivationType: MotivationType.Intrinsic,
        focusStrength: FocusStrength.Moderate,
        dailyAvailability: DailyAvailability.High,
        experienceLevel: ExperienceLevel.Advanced,
        painPoints: ['overwhelm'],
        preferredRewardType: 'achievement'
    };
    const userProfile = onboardingService.processOnboarding('u1', 'AI_Tester', 'ai@test.com', mockResponses);
    userProfile.level = 6;

    test('AI Service - Pattern Recognition', () => {
        const insights1 = aiService.generateInsights(userProfile, [Mood.Bad], 8);
        const wellnessInsight = insights1.find(i => i.category === 'Wellness');
        const growthInsight = insights1.find(i => i.category === 'Growth');

        expect(wellnessInsight).toBeDefined();
        expect(growthInsight).toBeDefined();
    });

    test('Guild System - Raid Mechanics (Immutable)', () => {
        let guild = guildService.createGuild(userProfile, "Iron Focus");
        expect(guild.currentRaid).toBeNull();

        guild = guildService.startRaid(guild, "Procrastination Dragon", 200);
        expect(guild.currentRaid).not.toBeNull();
        expect(guild.currentRaid?.currentHp).toBe(200);

        const raidRes1 = guildService.contributeToRaid(guild, userProfile.id, 100);
        guild = raidRes1.guild;
        expect(raidRes1.damageDealt).toBe(100);
        expect(guild.currentRaid?.currentHp).toBe(100);

        const raidRes2 = guildService.contributeToRaid(guild, userProfile.id, 100);
        guild = raidRes2.guild;
        expect(guild.currentRaid?.currentHp).toBe(0);
        expect(raidRes2.bossDefeated).toBe(true);
    });

    test('Seasonal System - Battle Pass Multi-Tier', () => {
        const season1: Season = {
            id: "s1", name: "Season 1", startDate: new Date(), endDate: new Date(), themeColor: "#000",
            tiers: [
                { tierNumber: 1, requiredXp: 100, freeReward: { id: "c1", name: "Cyber Coin", type: "currency" }, premiumReward: { id: "p1", name: "Skin", type: "cosmetic" } },
                { tierNumber: 2, requiredXp: 500, freeReward: { id: "c2", name: "Gold", type: "currency" } }
            ]
        };

        let battlePass: BattlePass = {
            userId: userProfile.id, seasonId: "s1", isPremium: true, totalSeasonXp: 0, currentTier: 0, claimedTiers: []
        };

        battlePass = seasonService.addSeasonXp(battlePass, season1, 600);
        expect(battlePass.currentTier).toBe(2);

        const rewards = seasonService.getClaimableRewards(battlePass, season1);
        // Tier 1 (Free+Prem) + Tier 2 (Free) = 3
        expect(rewards.length).toBe(3);
    });

    test('Accountability System - Contracts', () => {
        const partnership = accountabilityService.createPartnership(userProfile.id, "u2");
        let contract = accountabilityService.startWeeklyContract(partnership.id);

        const res1 = accountabilityService.submitCheckIn(contract, userProfile.id, ["Task"], true);
        const res2 = accountabilityService.submitCheckIn(contract, "u2", ["Task"], true);

        expect(res1.isComplete).toBe(false);
        expect(res2.isComplete).toBe(true);
        expect(contract.status).toBe('Completed');
    });

    test('AI Scheduling', () => {
        const s1 = schedulingService.suggestOptimalTime("task-1", TaskDifficulty.Hard, userProfile);
        const s2 = schedulingService.suggestOptimalTime("task-2", TaskDifficulty.Easy, userProfile);

        expect(s1.suggestedSlot.startTime).toBe("09:00");
        expect(s2.suggestedSlot.startTime).toBe("14:00");
    });

    test('Boss Narrative', () => {
        const intro = narrativeService.getBossIntro("boss-1");
        expect(intro).toContain("slumbering beast");

        const narrativeProgress = { userId: userProfile.id, unlockedChapterIds: [], currentChapter: 0 };
        const result = narrativeService.handleBossDefeat(narrativeProgress, "boss-1");
        expect(result.unlockedChapter?.id).toBe("chap-1");
    });

    test('Journal Intelligence', () => {
        // Negative
        const entry1 = journalService.addEntry(userProfile.id, "tired and stressed", 3);
        const analysis1 = journalService.analyzeEntry(entry1);
        expect(analysis1.sentiment).toBe('Negative');

        // Positive
        journalService.addEntry(userProfile.id, "great day", 9);
        const summary = journalService.getWeeklySentiment(userProfile.id);
        // (3+9)/2 = 6
        expect(summary.averageMood).toBe(6);
    });

    test('Social Graph & Skill Tree', () => {
        // Social
        const duel = socialService.createDuel(userProfile.id, "u_friend", 'HighestXP', 100);
        const winner = socialService.resolveDuel(duel, 500, 300);
        expect(winner).toBe(userProfile.id);

        // Skills
        let userSkills = { userId: userProfile.id, availablePoints: 3, unlockedNodeIds: [] as string[] };
        const resFail = skillService.unlockNode(userSkills, "branch-1");
        expect(resFail.success).toBe(false);

        const resRoot = skillService.unlockNode(userSkills, "root-1");
        expect(resRoot.success).toBe(true);

        const resChild = skillService.unlockNode(userSkills, "branch-1");
        expect(resChild.success).toBe(true);

        const buff = skillService.getTotalBuff(userSkills, 'FocusXP');
        expect(buff).toBeGreaterThan(0);
    });

    test('Achievements', () => {
        let achStats = { userId: userProfile.id, unlockedAchievementIds: [] as string[], metrics: { "tasksCompleted": 0 } };
        const unlocks = achievementService.updateMetric(achStats, "tasksCompleted", 11);
        expect(unlocks.length).toBeGreaterThan(0);
        expect(achStats.unlockedAchievementIds).toContain("ach-1");
    });
});
