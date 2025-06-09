import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, StatusBar } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';

import RootStackNavigator from './src/components/RootStackNavigator';
import FavoritesProvider from './src/components/FavoritesContext';
import { ThemeProvider, useTheme } from './src/screens/SettingScreen';
import SplashScreen from './src/screens/SplashScreen';

const CustomStatusBar = () => {
  const { theme } = useTheme();
  
  return (
    <>
      <StatusBar 
        barStyle={theme.statusBar === 'dark' ? 'dark-content' : 'light-content'}
        backgroundColor={theme.background}
      />
      <ExpoStatusBar style={theme.statusBar} />
    </>
  );
};

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
          <CustomStatusBar />
          <View style={{ flex: 1 }}>
            <RootStackNavigator />
          </View>
        </NavigationContainer>
      </ThemeProvider>
    </FavoritesProvider>
  );
}