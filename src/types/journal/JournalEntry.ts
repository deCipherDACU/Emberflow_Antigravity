export type Sentiment = 'Positive' | 'Negative' | 'Neutral';

export interface JournalEntry {
    id: string;
    userId: string;
    date: Date;
    content: string;
    moodScore: number; // 1-10
    tags: string[];
}

export interface JournalAnalysis {
    entryId: string;
    sentiment: Sentiment;
    keywords: string[];
    actionableInsight: string;
}

export interface WeeklyJournalSummary {
    userId: string;
    weekStartDate: Date;
    averageMood: number;
    totalEntries: number;
    dominantSentiment: Sentiment;
}
