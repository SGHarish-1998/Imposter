import { router } from 'expo-router';
import { useEffect } from 'react';
import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';


export default function HomeScreen() {
  const scale = useSharedValue(1);

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
        <View style={styles.glassContainer}>
          <Pressable>
            <Text style={styles.text}>Who is the Imposter?</Text>
          </Pressable>
          <Image source={require("@/assets/images/imposterlogo.png")} style={styles.imagelogo} />
        </View>
        <View style={styles.findCrewmate}>
          <Image source={require("@/assets/images/mysterious_eye.png")} style={styles.eye} />
          <Text style={styles.text}>Silent Suspect!!</Text>
        </View>
        <Pressable onPress={() => router.push('/GameScreen')}>
          <Animated.View style={[styles.startButton, animatedButtonStyle]}>
            <Text style={styles.buttonText}>START GAME</Text>
          </Animated.View>
        </Pressable>
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
    marginTop: '20%',
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
  eye: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: '10%'
  },
  startButton: {
    backgroundColor: '#ff0000',
    padding: 20,
    borderRadius: 10,
    marginTop: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
  },
});
