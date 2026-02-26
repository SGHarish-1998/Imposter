import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, ImageBackground, PanResponder, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GameLive() {
    const { players, imposterIndex } = useLocalSearchParams();
    const navigation = useNavigation();
    const playerArray = players ? JSON.parse(players) : [];

    // Disable native back gesture for this screen to let PanResponder take over
    useEffect(() => {
        navigation.setOptions({
            gestureEnabled: false,
        });
    }, [navigation]);

    // Swipe Guard: Show quit dialog when user swipes left-to-right
    const confirmQuit = () => {
        Alert.alert(
            'Quit Game?',
            'Are you sure you want to end the current game?',
            [
                { text: 'Stay', style: 'cancel' },
                { text: 'Quit', style: 'destructive', onPress: () => router.replace('/GameScreen') },
            ]
        );
    };

    const panResponder = useMemo(() => PanResponder.create({
        // use Capture to intercept the gesture before the ScrollView or System sees it
        onMoveShouldSetPanResponderCapture: (_, gestureState) => {
            // Activate if swipe starts moving right (dx > 20) and is mostly horizontal
            return gestureState.dx > 20 && Math.abs(gestureState.dy) < 30;
        },
        onPanResponderRelease: (_, gestureState) => {
            // Trigger if swipe was fast (vx) or reached a certain distance (dx)
            if (gestureState.dx > 60 || gestureState.vx > 0.4) {
                confirmQuit();
            }
        },
    }), []);

    const [timeLeft, setTimeLeft] = useState(60);

    useEffect(() => {
        if (timeLeft === 0) return;

        // Set up the interval timer
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        // Clean up the timer when the component unmounts
        return () => clearInterval(timer);
    }, [timeLeft]);

    // Format time to MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleVote = (selectedIndex) => {
        const isImposter = selectedIndex === Number(imposterIndex);
        const resultTitle = isImposter ? "VICTORY!" : "DEFEAT!";
        const message = isImposter
            ? "You caught the Imposter! Well done crewmates."
            : `${playerArray[selectedIndex]} was innocent! The Imposter wins.`;

        Alert.alert(
            resultTitle,
            message,
            [
                {
                    text: "Rematch",
                    onPress: () => router.replace('/GameScreen'),
                    style: "default"
                },
                {
                    text: "Main Menu",
                    onPress: () => router.replace('/'),
                    style: "cancel"
                }
            ]
        );
    };

    return (
        <View style={{ flex: 1 }} {...panResponder.panHandlers}>
            <ImageBackground
                source={require("@/assets/images/backgroundImage.jpg")}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <SafeAreaView style={styles.safeArea}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.container}>
                            <Text style={styles.headerText}>TIME TO DISCUSS</Text>

                            <View style={styles.timerCircle}>
                                <Text style={[
                                    styles.timerText,
                                    timeLeft <= 10 && { color: '#ff4d4d' }
                                ]}>
                                    {formatTime(timeLeft)}
                                </Text>
                            </View>

                            <Text style={styles.instructionText}>
                                {timeLeft > 0 ? "Find the Imposter!" : "TIME UP! VOTE NOW!"}
                            </Text>

                            <View style={styles.voteContainer}>
                                <Text style={styles.voteHeader}>Cast your vote:</Text>
                                <View style={styles.playerGrid}>
                                    {playerArray.map((player, index) => (
                                        <Pressable
                                            key={index}
                                            style={styles.voteCard}
                                            onPress={() => handleVote(index)}
                                        >
                                            <View style={styles.playerIconContainer}>
                                                <MaterialCommunityIcons name="account-search" size={24} color="white" />
                                            </View>
                                            <Text style={styles.voteText}>{player}</Text>
                                            <View style={styles.accuseBadge}>
                                                <Text style={styles.accuseText}>ACCUSE</Text>
                                            </View>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        width: '100%',
        height: '100%',
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: '15%',
    },
    headerText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 3,
        marginBottom: 25,
        textTransform: 'uppercase',
    },
    timerCircle: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 4,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'white',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
    },
    timerText: {
        fontSize: 48,
        fontWeight: '900',
        color: 'white',
        fontVariant: ['tabular-nums'],
    },
    instructionText: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 14,
        marginTop: 25,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    voteContainer: {
        marginTop: 30,
        width: '100%',
        paddingHorizontal: 20,
    },
    voteHeader: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 15,
        textAlign: 'center',
    },
    playerGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
    },
    voteCard: {
        width: '45%',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playerIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    voteText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 6,
    },
    accuseBadge: {
        backgroundColor: 'rgba(255, 77, 77, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 77, 77, 0.4)',
    },
    accuseText: {
        color: '#ff4d4d',
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 1,
    },
});