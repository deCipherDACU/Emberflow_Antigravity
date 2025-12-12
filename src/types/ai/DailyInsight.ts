export type InsightType = 'Trend' | 'Pattern' | 'Prediction' | 'Recommendation';
export type InsightCategory = 'Wellness' | 'Productivity' | 'Growth';

export interface DailyInsight {
    id: string;
    date: Date;
    type: InsightType;
    category: InsightCategory;
    message: string;
    actionableStep?: string; // Specific command, e.g., "Reduce goal by 10%"
    confidenceScore: number; // 0-1.0
    relatedDataPoints?: string[]; // e.g., ["mood_low", "workload_high"]
}

export interface WeeklyAnalysis {
    weekStartDate: Date;
    insights: DailyInsight[];
    summary: string;
    topPattern: string;
}
