import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GameStart() {
    const { players, secretWord, hint, category, imposterIndex } = useLocalSearchParams();

    // Parse the players array from the stringified parameter
    const playerArray = players ? JSON.parse(players) : [];

    // Game State
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    // Animation Value: 0 is front, 180 is back
    const rotateValue = useSharedValue(0);

    const handleCardPress = () => {
        if (!isFlipped) {
            // Reveal secret
            setIsFlipped(true);
            rotateValue.value = withTiming(180, { duration: 500 });
        } else {
            // Already revealed, move to next player
            nextPlayer();
        }
    };

    const frontAnimatedStyle = useAnimatedStyle(() => {
        const spinValue = interpolate(rotateValue.value, [0, 180], [0, 180]);
        return {
            transform: [{ rotateY: `${spinValue}deg` }],
            opacity: rotateValue.value > 90 ? 0 : 1, // Hide when face away
        };
    });

    const backAnimatedStyle = useAnimatedStyle(() => {
        const spinValue = interpolate(rotateValue.value, [0, 180], [180, 360]); // Starts at 180deg
        return {
            transform: [{ rotateY: `${spinValue}deg` }],
            opacity: rotateValue.value > 90 ? 1 : 0, // Show when face forward
        };
    });

    const playerName = playerArray[currentPlayerIndex];

    const nextPlayer = () => {
        if (currentPlayerIndex < playerArray.length - 1) {
            // 1. Reset card to front
            rotateValue.value = withTiming(0, { duration: 300 });
            setIsFlipped(false);

            // 2. Move to next index after unflip animation
            setTimeout(() => {
                setCurrentPlayerIndex(prev => prev + 1);
            }, 300);
        } else {
            router.push({
                pathname: '/GameLive',
                params: {
                    players: players,
                    imposterIndex: imposterIndex
                }
            });
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require("@/assets/images/backgroundImage.jpg")}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.content}>
                        <Pressable
                            style={styles.cardContainer}
                            onPress={handleCardPress}
                        >
                            {/* FRONT SIDE */}
                            <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
                                <MaterialCommunityIcons name="account-circle" size={80} color="white" />
                                <Text style={styles.playerName}>{playerName}</Text>
                                <Text style={styles.instruction}>Tap to see your secret...</Text>
                            </Animated.View>

                            {/* BACK SIDE */}
                            <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
                                <Text style={styles.roleTitle}>YOUR ROLE</Text>
                                {currentPlayerIndex === Number(imposterIndex) ? (
                                    <View style={styles.imposterContainer}>
                                        <Text style={styles.imposterText}>YOU ARE THE IMPOSTER!</Text>

                                        <View style={styles.hintBox}>
                                            <MaterialCommunityIcons name="lightbulb-on" size={24} color="#ffff00" style={{ marginBottom: 8 }} />

                                            <Text style={styles.hintLabel}>Category:</Text>
                                            <Text style={styles.categoryInfoText}>{category}</Text>

                                            <View style={styles.hintDivider} />

                                            <Text style={styles.hintLabel}>Your Hint:</Text>
                                            <Text style={styles.hintText}>{hint}</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View style={styles.secretContainer}>
                                        <Text style={styles.categoryLabel}>Category: {category}</Text>
                                        <Text style={styles.secretLabel}>The Secret Word is:</Text>
                                        <Text style={styles.secretWord}>{secretWord}</Text>
                                    </View>
                                )}
                                <Text style={styles.instruction}>
                                    {currentPlayerIndex < playerArray.length - 1
                                        ? "Tap to pass to next player"
                                        : "Tap to start discussing!"}
                                </Text>
                            </Animated.View>
                        </Pressable>

                        <Text style={styles.playerCount}>
                            Player {currentPlayerIndex + 1} of {playerArray.length}
                        </Text>
                    </View>
                </SafeAreaView>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
    },
    safeArea: {
        flex: 1,
        padding: '10%',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContainer: {
        width: '85%',
        aspectRatio: 0.7,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backfaceVisibility: 'hidden', // Required for Reanimated flip
    },
    cardFront: {
        zIndex: 2,
    },
    cardBack: {
        zIndex: 1,
    },
    playerName: {
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 20,
    },
    instruction: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 16,
        marginTop: 40,
        fontStyle: 'italic',
    },
    roleTitle: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 18,
        letterSpacing: 2,
        marginBottom: 30,
    },
    imposterContainer: {
        alignItems: 'center',
        width: '100%',
    },
    imposterText: {
        color: '#ff0000',
        fontSize: 32,
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: 20,
    },
    hintLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    hintBox: {
        marginTop: 10,
        padding: 20,
        backgroundColor: 'rgba(255, 255, 0, 0.1)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 0, 0.3)',
        width: '100%',
        alignItems: 'center',
    },
    hintText: {
        color: '#ffff00',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    categoryInfoText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    hintDivider: {
        width: '40%',
        height: 1,
        backgroundColor: 'rgba(255, 255, 0, 0.2)',
        marginVertical: 12,
    },
    categoryLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    secretContainer: {
        alignItems: 'center',
    },
    secretLabel: {
        color: 'white',
        fontSize: 20,
        marginBottom: 10,
    },
    secretWord: {
        color: '#ffff00',
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    playerCount: {
        color: 'rgba(255, 255, 255, 0.4)',
        marginTop: 30,
        fontSize: 16,
    },
    nextButton: {
        backgroundColor: '#ff4d4d',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 25,
        marginTop: 40,
        shadowColor: '#ff4d4d',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    nextButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
