import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MainTabNavigator from './MainTabNavigator';
import SettingScreen from '../screens/SettingScreen';
import AboutScreen from '../screens/AboutScreen';
import ContactScreen from '../screens/ContactScreen';
import Rateus from '../screens/Rateus';

const Drawer = createDrawerNavigator();

export default function AppDrawerNavigator() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="HomeTabs" component={MainTabNavigator} options={{ title: 'Home' }} />
      <Drawer.Screen name="Settings" component={SettingScreen} options={{ title: 'Settings' }} />
      {/* Add more screens as needed */}
      <Drawer.Screen name="About" component={AboutScreen} options={{ title: 'About' }} />
      <Drawer.Screen name="Contact us" component={ContactScreen} options={{ title: 'Contact us' }} />
      <Drawer.Screen name="Rate us" component={Rateus} options={{ title: 'Rate us' }} />
    </Drawer.Navigator>
  );
}
