import { BossNarrative, StoryChapter, UserNarrativeProgress } from '../../types/game/Narrative';

export class NarrativeService {

    private bosses: BossNarrative[] = [
        {
            bossId: "boss-1",
            name: "The Procrastination Dragon",
            introText: "A slumbering beast that feeds on delayed dreams...",
            defeatText: "The beast roars and dissolves into mist. Your path is clear.",
            linkedChapterId: "chap-1"
        }
    ];

    private chapters: StoryChapter[] = [
        {
            id: "chap-1",
            title: "The Awakening",
            content: "With the dragon defeated, you recall your true purpose...",
            order: 1,
            conditionBossId: "boss-1"
        }
    ];

    /**
     * Returns the narrative intro for a specific boss.
     */
    public getBossIntro(bossId: string): string {
        const boss = this.bosses.find(b => b.bossId === bossId);
        return boss ? boss.introText : "...";
    }

    /**
     * Processes a boss defeat event.
     * Unlocks the relevant chapter if condition is met.
     */
    public handleBossDefeat(progress: UserNarrativeProgress, bossId: string): { unlockedChapter?: StoryChapter, progress: UserNarrativeProgress } {
        const boss = this.bosses.find(b => b.bossId === bossId);
        if (!boss) return { progress };

        // Check if chapter is already unlocked
        if (progress.unlockedChapterIds.includes(boss.linkedChapterId)) {
            return { progress };
        }

        // Unlock
        const chapter = this.chapters.find(c => c.id === boss.linkedChapterId);
        if (chapter) {
            progress.unlockedChapterIds.push(chapter.id);
            progress.currentChapter = Math.max(progress.currentChapter, chapter.order);
            return { unlockedChapter: chapter, progress };
        }

        return { progress };
    }
}
