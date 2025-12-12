export type NotificationType = 'reminder' | 'encouragement' | 'achievement' | 'system';

export type NotificationTone = 'motivational' | 'anime' | 'direct' | 'compassionate';

export interface TimeWindow {
    startHour: number; // 0-23
    endHour: number;   // 0-23
}

export interface NotificationConfig {
    quietHours: TimeWindow;
    maxPerDay: number;
    preferredTone: NotificationTone;
}

export interface SmartNotification {
    id: string;
    type: NotificationType;
    title: string;
    body: string;
    timestamp: Date;
    metadata?: any;
}

export interface NotificationState {
    dailyCount: number;
    lastNotificationTime: Date | null;
}
