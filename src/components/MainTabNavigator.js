import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CategoryTabNavigator from './CategoryTabNavigator';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BookmarkedScreen from '../screens/BookmarkedScreen';
import FeaturedScreen from '../screens/FeaturedScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'home-outline';
            } else if (route.name === 'Favorites') {
              iconName = 'heart-outline';
            } else if (route.name === 'Bookmarked') {
              iconName = 'bookmark-outline';
            } else if (route.name === 'Featured') {
              iconName = 'star-outline';
            } else if (route.name === 'Profile') {
              iconName = 'person-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4a90e2',
          tabBarInactiveTintColor: '#888',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={CategoryTabNavigator} />
        <Tab.Screen name="Featured" component={FeaturedScreen} />
        <Tab.Screen name="Bookmarked" component={BookmarkedScreen} />
        <Tab.Screen name="Favorites" component={FavoritesScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
  );
}
