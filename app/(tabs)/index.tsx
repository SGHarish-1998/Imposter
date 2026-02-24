import HowToPlayModal from '@/components/HowToPlayModal';
import SettingsModal from '@/components/SettingsModal';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';


export default function HomeScreen() {
  const scale = useSharedValue(1);
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    scale.value = withRepeat(withTiming(1.2, { duration: 1000 }), -1, true);
  }, []);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.gemaContainer}>
      <ImageBackground
        source={require("@/assets/images/backgroundImage.jpg")}
        style={styles.image}
        resizeMode='cover'>

        {/* Settings Icon */}
        <Pressable
          style={styles.settingsIcon}
          onPress={() => setShowSettings(true)}
        >
          <MaterialCommunityIcons name="cog" size={32} color="rgba(255,255,255,0.7)" />
        </Pressable>

        <View style={styles.glassContainer}>
          <Pressable>
            <Text style={styles.text}>Who is the Imposter?</Text>
          </Pressable>
          <Image source={require("@/assets/images/imposterlogo.png")} style={styles.imagelogo} />
        </View>
        <View style={styles.findCrewmate}>
          <Image source={require("@/assets/images/mysterious_eye.png")} style={styles.eye} />
          <Text style={styles.tagline}>One Phone. Endless Cheers.</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable onPress={() => router.push('/GameScreen')}>
            <Animated.View style={[styles.startButton, animatedButtonStyle]}>
              <Text style={styles.buttonText}>START GAME</Text>
            </Animated.View>
          </Pressable>

          <Pressable
            style={styles.howToPlayButton}
            onPress={() => setShowHelp(true)}
          >
            <MaterialCommunityIcons name="help-circle-outline" size={20} color="white" />
            <Text style={styles.howToPlayText}>HOW TO PLAY</Text>
          </Pressable>
        </View>

        {/* HOW TO PLAY MODAL */}
        <HowToPlayModal
          visible={showHelp}
          onClose={() => setShowHelp(false)}
        />

        {/* SETTINGS MODAL */}
        <SettingsModal
          visible={showSettings}
          onClose={() => setShowSettings(false)}
        />

      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  gemaContainer: {
    flex: 1
  },
  image: {
    width: '100%',
    height: '100%',
    alignItems: 'center'
  },
  glassContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(63, 49, 49, 0.5)',
    padding: 20,
    borderRadius: 10,
    marginTop: '25%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
  },
  imagelogo: {
    width: 80,
    height: 80,
    marginLeft: 15,
    resizeMode: 'contain'
  },
  findCrewmate: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20%',
  },
  tagline: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 18,
    fontWeight: '600',
    fontStyle: 'italic',
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: -10,
  },
  eye: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: '10%'
  },
  settingsIcon: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  startButton: {
    backgroundColor: '#ff0000',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  buttonText: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: '25%',

  },
  howToPlayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '25%',
  },
  howToPlayText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
    textDecorationLine: 'underline',
  },
});
