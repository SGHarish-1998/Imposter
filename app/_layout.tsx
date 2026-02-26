import { cancelReminders, scheduleDailyReminders } from '@/utils/notifications';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Configure how notifications behave when the app is in the foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
    }),
});

export default function RootLayout() {
    useEffect(() => {
        // 1. Request permissions on launch
        async function requestPermissions() {
            await Notifications.requestPermissionsAsync();
        }
        requestPermissions();

        // 2. Lifecycle Listener: Schedule daily reminders when app is closed, cancel when opened
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            if (nextAppState === 'background') {
                scheduleDailyReminders();
            } else if (nextAppState === 'active') {
                cancelReminders();
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, []);

    return (
        <SafeAreaProvider>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)/index" />
            </Stack>
        </SafeAreaProvider>
    );
}
