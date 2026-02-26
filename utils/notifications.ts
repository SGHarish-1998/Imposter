import * as Notifications from 'expo-notifications';

/**
 * Schedules two daily reminders: one in the morning (9 AM) and one in the evening (6 PM).
 */
export async function scheduleDailyReminders() {
    // 1. Cancel existing to prevent duplicates
    await Notifications.cancelAllScheduledNotificationsAsync();

    // 2. Schedule Morning Reminder (9:00 AM)
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "🕵️‍♂️ Imposter: Morning Briefing!",
            body: "The group is gathering for a morning round. Can you spot the liar?",
            sound: true,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: 9,
            minute: 0,
        },
    });

    // 3. Schedule Evening Reminder (6:00 PM)
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "🕵️‍♂️ Imposter: Party Time!",
            body: "Evening is here! Perfect time for a round of Imposter. Who's sus?",
            sound: true,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: 18,
            minute: 0,
        },
    });
}

/**
 * Cancels all scheduled notifications.
 */
export async function cancelReminders() {
    await Notifications.cancelAllScheduledNotificationsAsync();
}
