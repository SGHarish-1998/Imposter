import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

interface SettingsModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Settings ⚙️</Text>
                    <Text style={styles.settingsDescription}>More options coming soon!</Text>

                    <Pressable style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>CLOSE</Text>
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
    settingsDescription: {
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 30,
        lineHeight: 24,
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
