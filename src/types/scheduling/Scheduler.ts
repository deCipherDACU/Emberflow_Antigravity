export type EnergyLevel = 'High' | 'Medium' | 'Low';

export interface TimeSlot {
    startTime: string; // "09:00"
    endTime: string; // "10:30"
    energyLevel: EnergyLevel;
}

export interface ScheduleSuggestion {
    taskId: string;
    suggestedSlot: TimeSlot;
    confidenceScore: number;
    reason: string; // e.g. "High difficulty task matches your morning peak energy."
}
