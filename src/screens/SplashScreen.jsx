import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, StatusBar, Dimensions, Animated, Easing } from 'react-native';
import { useEffect, useRef } from 'react';

export default function SplashScreen({ onDone }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Animation sequence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handlePress = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start(onDone);
    });
  };

  return (
    <View style={[styles.container]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ImageBackground
        source={require('../assets/image.png')}
        style={styles.bg}
        resizeMode="cover"
        blurRadius={2}
      >
        <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
          <Text style={styles.title}>Kadiir Blogs</Text>
        </Animated.View>

        <Animated.View style={[
          styles.bottomSheet,
          { 
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ]
          }
        ]}>
          <Text style={styles.headline}>Stay Informed, Stay Ahead</Text>
          <Text style={styles.desc}>
            Get personalized news updates tailored just for you. 
            Simple, fast, and always up-to-date.
          </Text>
          
          <View style={styles.dotsRow}>
            {[1, 2, 3].map((i) => (
              <View 
                key={i} 
                style={[
                  styles.dot, 
                  i === 2 && styles.dotActive
                ]} 
              />
            ))}
          </View>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={handlePress}
            activeOpacity={0.9}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
          
          <Text style={styles.footerText}>© 2023 Kadirr Inc.</Text>
        </Animated.View>
      </ImageBackground>
    </View>
  );
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    marginTop: StatusBar.currentHeight || 0,
  },
  bg: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  logoContainer: {
    position: 'absolute',
    top: height * 0.15,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  bottomSheet: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  headline: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
  },
  desc: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 6,
  },
  dotActive: {
    backgroundColor: '#4a6cf7',
    width: 24,
  },
  button: {
    backgroundColor: '#4a6cf7',
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 48,
    width: '100%',
    maxWidth: 300,
    shadowColor: '#4a6cf7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  footerText: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 24,
  },
});