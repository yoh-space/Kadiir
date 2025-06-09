import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PopularScreen from '../screens/PopularScreen';
import FeaturedScreen from '../screens/FeaturedScreen';
import { useTheme } from '../screens/SettingScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const { isDark, theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home': iconName = 'home-outline'; break;
            case 'Favorites': iconName = 'heart-outline'; break;
            case 'Popular': iconName = 'flame-outline'; break;
            case 'Featured': iconName = 'star-outline'; break;
            case 'Profile': iconName = 'person-outline'; break;
            case 'Notification': iconName = 'notifications-outline'; break;
            case 'BlogList': iconName = 'newspaper-outline'; break;
            default: iconName = 'help-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.tabBar.activeTint,
        tabBarInactiveTintColor: theme.tabBar.inactiveTint,
        tabBarStyle: {
          backgroundColor: theme.tabBar.background,
          borderTopColor: theme.tabBar.border,
          borderTopWidth: 1,
          paddingBottom: 5,
          height: 100,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
        },
        headerShown: false,
        headerStyle: {
          backgroundColor: theme.header.background,
        },
        headerTitleStyle: {
          color: theme.header.text,
        },
        headerTintColor: theme.header.tint,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={require('../screens/HomeScreen').default}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Featured" 
        component={FeaturedScreen} 
        options={{ title: 'Featured' }}
      />
      <Tab.Screen 
        name="Popular" 
        component={PopularScreen} 
        options={{ title: 'Popular' }}
      />
      <Tab.Screen 
        name="Favorites" 
        component={FavoritesScreen} 
        options={{ title: 'Favorites' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;