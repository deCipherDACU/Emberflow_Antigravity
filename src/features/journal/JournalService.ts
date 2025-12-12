import { JournalEntry, JournalAnalysis, Sentiment, WeeklyJournalSummary } from '../../types/journal/JournalEntry';

export class JournalService {

    private entries: JournalEntry[] = [];

    /**
     * Adds a new journal entry and returns it.
     */
    public addEntry(userId: string, content: string, moodScore: number): JournalEntry {
        const entry: JournalEntry = {
            id: `j-${Date.now()}`,
            userId,
            date: new Date(),
            content,
            moodScore,
            tags: []
        };
        this.entries.push(entry);
        return entry;
    }

    /**
     * Mocks AI analysis of the text content.
     */
    public analyzeEntry(entry: JournalEntry): JournalAnalysis {
        const text = entry.content.toLowerCase();
        let sentiment: Sentiment = 'Neutral';
        const keywords: string[] = [];

        // Simple heuristic analysis
        if (text.includes('tired') || text.includes('sad') || text.includes('stress')) {
            sentiment = 'Negative';
            keywords.push('fatigue');
        } else if (text.includes('happy') || text.includes('excited') || text.includes('great')) {
            sentiment = 'Positive';
            keywords.push('energy');
        }

        return {
            entryId: entry.id,
            sentiment,
            keywords,
            actionableInsight: sentiment === 'Negative' ? "Consider a 10 min meditation break." : "Capitalize on this energy!"
        };
    }

    /**
     * Calculates weekly stats from the stored (in-memory) entries.
     */
    public getWeeklySentiment(userId: string): WeeklyJournalSummary {
        const now = new Date();
        // Calculate start of week (Monday)
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        const weekStart = new Date(now.setDate(diff));
        weekStart.setHours(0, 0, 0, 0);

        const userEntries = this.entries.filter(e =>
            e.userId === userId &&
            e.date >= weekStart
        );

        if (userEntries.length === 0) {
            return {
                userId,
                weekStartDate: weekStart,
                averageMood: 0,
                totalEntries: 0,
                dominantSentiment: 'Neutral'
            };
        }

        const totalMood = userEntries.reduce((sum, e) => sum + e.moodScore, 0);
        const avgMood = Number((totalMood / userEntries.length).toFixed(1));

        // Determine Dominant Sentiment
        let posCount = 0, negCount = 0;
        userEntries.forEach(e => {
            const analysis = this.analyzeEntry(e);
            if (analysis.sentiment === 'Positive') posCount++;
            if (analysis.sentiment === 'Negative') negCount++;
        });

        let dominant: Sentiment = 'Neutral';
        if (posCount > negCount && posCount > 0) dominant = 'Positive';
        if (negCount > posCount && negCount > 0) dominant = 'Negative';

        return {
            userId,
            weekStartDate: weekStart,
            averageMood: avgMood,
            totalEntries: userEntries.length,
            dominantSentiment: dominant
        };
    }
}
