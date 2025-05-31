import { View, Text, StyleSheet, ImageBackground, TouchableOpacity,StatusBar } from 'react-native';

export default function SplashScreen({ onDone }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground
        source={require('../assets/splash1.png')} // Replace with your splash image
        style={styles.bg}
        resizeMode="cover"
      >
        <Text style={styles.title}>WACANA</Text>
        <View style={styles.bottomSheet}>
          <Text style={styles.headline}>Stay in the know with just one tap</Text>
          <Text style={styles.desc}>
            Easily stay informed and up-to-date on the latest news with just a tap.
          </Text>
          <View style={styles.dotsRow}>
            <View style={styles.dot} />
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
          </View>
          <TouchableOpacity style={styles.button} onPress={onDone}>
            <Text style={styles.buttonText}>Here We Go</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  bg: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  title: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  bottomSheet: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 32,
    alignItems: 'center',
  },
  headline: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#181a20',
    textAlign: 'center',
    marginBottom: 12,
  },
  desc: {
    color: '#888',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#4a6cf7',
    width: 18,
  },
  button: {
    backgroundColor: '#4a6cf7',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
});
