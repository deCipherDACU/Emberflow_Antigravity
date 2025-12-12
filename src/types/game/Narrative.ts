export interface StoryChapter {
    id: string;
    title: string;
    content: string;
    order: number;
    conditionBossId: string; // Defeating this boss unlocks the chapter
}

export interface BossNarrative {
    bossId: string;
    name: string;
    introText: string;
    defeatText: string;
    linkedChapterId: string;
}

export interface UserNarrativeProgress {
    userId: string;
    unlockedChapterIds: string[];
    currentChapter: number;
}
