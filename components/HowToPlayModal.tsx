import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

interface HowToPlayModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function HowToPlayModal({ visible, onClose }: HowToPlayModalProps) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>How to Play 🕵️‍♂️</Text>
                    <ScrollView style={styles.modalScroll}>
                        <View style={styles.step}>
                            <Text style={styles.stepNum}>1</Text>
                            <Text style={styles.stepText}>Choose a category and add at least 3 players.</Text>
                        </View>
                        <View style={styles.step}>
                            <Text style={styles.stepNum}>2</Text>
                            <Text style={styles.stepText}>Each player flips the card. Civilians see the secret word; the Imposter gets a tricky hint!</Text>
                        </View>
                        <View style={styles.step}>
                            <Text style={styles.stepNum}>3</Text>
                            <Text style={styles.stepText}>Discuss! Describe the word without giving it away. The Imposter must pretend to know it.</Text>
                        </View>
                        <View style={styles.step}>
                            <Text style={styles.stepNum}>4</Text>
                            <Text style={styles.stepText}>Vote! At the end of the timer, everyone votes for the person they think is the Imposter.</Text>
                        </View>
                        <View style={styles.step}>
                            <Text style={styles.stepNum}>5</Text>
                            <Text style={styles.stepText}>Feeling lucky? Use "Surprise Me" to let the game pick a mystery category for you!</Text>
                        </View>
                    </ScrollView>
                    <Pressable style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>GOT IT!</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#1a1a1a',
        borderRadius: 20,
        padding: 25,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
    },
    modalTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalScroll: {
        width: '100%',
        maxHeight: 300,
    },
    step: {
        flexDirection: 'row',
        marginBottom: 15,
        alignItems: 'flex-start',
    },
    stepNum: {
        backgroundColor: '#ff0000',
        color: 'white',
        width: 28,
        height: 28,
        borderRadius: 14,
        textAlign: 'center',
        lineHeight: 28,
        fontWeight: 'bold',
        marginRight: 12,
    },
    stepText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 16,
        flex: 1,
        lineHeight: 22,
    },
    closeButton: {
        backgroundColor: '#ff0000',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25,
        marginTop: 20,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
