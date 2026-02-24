import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, ImageBackground, Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CATEGORY_WORDS } from '../constants/Words';

const PLAYER_STORAGE_KEY = '@imposter_players_list';


export default function GameScreen() {
    const CATEGORIES = [
        { name: 'Movies', icon: 'movie-open' },
        { name: 'Celebrities', icon: 'star' },
        { name: 'Sports', icon: 'basketball' },
        { name: 'Animals', icon: 'paw' },
        { name: 'Food', icon: 'food-apple' },
        { name: 'Places', icon: 'map-marker' },
    ];

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [secretWord, setSecretWord] = useState('');
    const [hint, setHint] = useState('');

    // State for textinput and flatlist
    const [playerName, setPlayerName] = useState('');
    const [players, setPlayers] = useState([]);

    // 1. LOAD: On component mount
    useEffect(() => {
        loadPlayers();
    }, []);

    // 2. SAVE: Every time the players list changes
    useEffect(() => {
        savePlayers();
    }, [players]);

    const loadPlayers = async () => {
        try {
            const savedPlayers = await AsyncStorage.getItem(PLAYER_STORAGE_KEY);
            if (savedPlayers !== null) {
                setPlayers(JSON.parse(savedPlayers));
            }
        } catch (error) {
            console.error("Failed to load players:", error);
        }
    };

    const savePlayers = async () => {
        try {
            const stringifiedPlayers = JSON.stringify(players);
            await AsyncStorage.setItem(PLAYER_STORAGE_KEY, stringifiedPlayers);
        } catch (error) {
            console.error("Failed to save players:", error);
        }
    };

    const addPlayer = () => {
        const trimmedName = playerName.trim();

        // 1. Validation for Empty Name
        if (trimmedName.length === 0) return;
        // 2. Validation for Duplicates (The new part!)
        if (players.includes(trimmedName)) {
            alert("This player name is already taken! Try something else.");
            return; // This stops the code from adding the duplicate
        }
        // 3. Add Player if all checks pass
        setPlayers([...players, trimmedName]);
        setPlayerName('');
        Keyboard.dismiss();
    };

    const removePlayer = (index) => {
        const newPlayers = [...players];
        newPlayers.splice(index, 1);
        setPlayers(newPlayers);
    };

    const handleCategorySelect = (categoryName) => {
        const words = CATEGORY_WORDS[categoryName];
        if (words && words.length > 0) {
            const randomIndex = Math.floor(Math.random() * words.length);
            const selectedWordObj = words[randomIndex];
            setSecretWord(selectedWordObj.word);
            setHint(selectedWordObj.hint);
            setSelectedCategory(categoryName);
        }
    };

    const handleStartGame = () => {
        const imposterIndex = Math.floor(Math.random() * players.length);
        router.push({
            pathname: '/GameStart',
            params: {
                players: JSON.stringify(players),
                secretWord: secretWord,
                hint: hint,
                imposterIndex: imposterIndex
            }
        });
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require("@/assets/images/backgroundImage.jpg")}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <SafeAreaView style={styles.safeArea}>
                    {
                        selectedCategory && (
                            <Pressable onPress={() => setSelectedCategory(null)} style={styles.backButton}>
                                <Text style={styles.backButtonText}>← Choose Another Category</Text>
                            </Pressable>
                        )
                    }
                    <Text style={styles.title}>
                        {selectedCategory ? `Category: ${selectedCategory}` : 'Select Category'}
                    </Text>

                    {selectedCategory ? (
                        <View style={styles.playerSetupContainer}>
                            <Text style={styles.categoryText}>Now add your players!</Text>
                            <View style={styles.inputContainer}>
                                <TextInput style={styles.input} placeholder='Enter player name' placeholderTextColor='white' value={playerName} onChangeText={setPlayerName} />
                                <Pressable style={styles.addButton} onPress={addPlayer}>
                                    <Text style={styles.buttonText}>Add</Text>
                                </Pressable>
                            </View>
                            <FlatList
                                data={players}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.playerCard}>
                                        <View style={styles.playerInfo}>
                                            <MaterialCommunityIcons name="account-circle" size={24} color="#ff4d4d" />
                                            <Text style={styles.playerNameText}>{item}</Text>
                                        </View>

                                        <Pressable onPress={() => removePlayer(index)}>
                                            <MaterialCommunityIcons name="close-circle" size={22} color="rgba(255,255,255,0.5)" />
                                        </Pressable>
                                    </View>
                                )}
                                contentContainerStyle={{ paddingBottom: 20 }}
                            />

                            {players.length >= 3 && (
                                <Pressable onPress={handleStartGame} style={styles.finalStartButton} >
                                    <Text style={styles.finalStartText}>PRESS ME TO START</Text>
                                </Pressable>
                            )}

                        </View>
                    ) : (
                        <View style={styles.gridContainer}>
                            {CATEGORIES.map((category, index) => (
                                <Pressable
                                    key={index}
                                    style={styles.categoryBox}
                                    onPress={() => handleCategorySelect(category.name)}
                                >
                                    <MaterialCommunityIcons
                                        name={category.icon}
                                        size={32}
                                        color="white"
                                        style={styles.categoryIcon}
                                    />
                                    <Text style={styles.categoryText}>{category.name}</Text>
                                </Pressable>
                            ))}
                        </View>
                    )}
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
        marginTop: '10%',
    },
    title: {
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 40,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
    },
    categoryBox: {
        width: '47%',
        aspectRatio: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    categoryIcon: {
        marginBottom: 8,
    },
    categoryText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: '20%',
    },
    secretWordText: {
        color: '#ffff00',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginRight: 10,
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#ff0000',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    playerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    playerInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    playerNameText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    playerSetupContainer: {
        flex: 1,
    },
    finalStartButton: {
        backgroundColor: '#ff0000',
        padding: 20,
        borderRadius: 10,
        marginTop: '10%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    finalStartText: {
        color: 'white',
        fontSize: 26,
        fontWeight: 'bold',
    },
    backButton: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
