import React from 'react';
import { View, StatusBar } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';

import MainTabNavigator from './src/components/MainTabNavigator';
import RootStackNavigator from './src/components/RootStackNavigator';
import { FavoritesProvider } from './src/components/FavoritesContext';

export default function App() {
  return (
    <FavoritesProvider>
      <NavigationContainer>
        <View style={{ flex: 1, marginTop: StatusBar.currentHeight || 0 }}>
          <RootStackNavigator />
          <ExpoStatusBar style="dark-content" />
        </View>
      </NavigationContainer>
    </FavoritesProvider>
  );
}
