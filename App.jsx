import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, StatusBar } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';

import RootStackNavigator from './src/components/RootStackNavigator';
import { FavoritesProvider } from './src/components/FavoritesContext';
import { ThemeProvider } from './src/screens/SettingScreen';
import SplashScreen from './src/screens/SplashScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    (async () => {
      const seen = await AsyncStorage.getItem('hasSeenSplash');
      if (seen) setShowSplash(false);
    })();
  }, []);

  const handleSplashDone = async () => {
    await AsyncStorage.setItem('hasSeenSplash', 'true');
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onDone={handleSplashDone} />;
  }

  return (
    <FavoritesProvider>
      <ThemeProvider>
        <NavigationContainer>
          <View style={{ flex: 1, marginTop: StatusBar.currentHeight || 0 }}>
            <RootStackNavigator />
            <ExpoStatusBar style="auto" />
          </View>
        </NavigationContainer>
      </ThemeProvider>
    </FavoritesProvider>
  );
}
