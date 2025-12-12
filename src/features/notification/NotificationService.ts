import {
    NotificationType,
    NotificationTone,
    NotificationConfig,
    NotificationState
} from '../../types/notification/SmartNotification';
import { UserProfile } from '../../types/user/UserProfile';
import { BurnoutRisk } from '../onboarding/constants';

export class NotificationService {

    /**
     * gatekeeper: Determines if a notification should be sent based on user context.
     */
    public shouldSend(
        profile: UserProfile,
        config: NotificationConfig,
        state: NotificationState,
        type: NotificationType,
        isFocusMode: boolean
    ): boolean {

        // Rule 1: Quiet Hours
        const now = new Date();
        const currentHour = now.getHours();
        // Check Quiet Hours
        // Case 1: Day Window (e.g. 13 to 17) -> Start < End
        if (config.quietHours.startHour < config.quietHours.endHour) {
            if (currentHour >= config.quietHours.startHour && currentHour < config.quietHours.endHour) {
                return false; // Silence!
            }
        }
        // Case 2: Overnight Window (e.g. 22 to 07) -> Start >= End
        else {
            if (currentHour >= config.quietHours.startHour || currentHour < config.quietHours.endHour) {
                return false; // Silence!
            }
        }

        // Rule 2: Focus Mode (Only allow 'system' or critical alerts, blocking normal reminders)
        if (isFocusMode && type !== 'system') {
            return false; // Don't break flow
        }

        // Rule 3: Daily Limit
        if (state.dailyCount >= config.maxPerDay) {
            // Allow 'encouragement' or critical updates to bypass, but block generic reminders
            if (type === 'reminder') return false;
        }

        // Rule 4: Burnout Protection (Compassionate Logic)
        if (profile.performance.burnoutRisk === BurnoutRisk.High) {
            // If burned out, ONLY allow compassionate messages or achievements.
            // Block pressure-inducing reminders.
            if (type === 'reminder') return false;
        }

        return true;
    }

    /**
     * Personalize: Adapts the message to the user's preferred tone.
     */
    public personalizeMessage(
        baseMessage: string,
        tone: NotificationTone,
        type: NotificationType
    ): string {

        switch (tone) {
            case 'anime':
                return this.animeTranslator(baseMessage, type);
            case 'direct':
                return baseMessage; // No fluff
            case 'motivational':
                return `🚀 ${baseMessage} You got this!`;
            case 'compassionate':
                return `🌿 ${baseMessage} Remember to breathe.`;
            default:
                return baseMessage;
        }
    }

    private animeTranslator(msg: string, type: NotificationType): string {
        if (type === 'encouragement') return `Ganbatte! ${msg} ✨`;
        if (type === 'reminder') return `Hey! ${msg} Don't slack off! 💢`;
        if (type === 'achievement') return `Sugoi! ${msg} 🎉`;
        return msg;
    }
}
