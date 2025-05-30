import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import CategoryScreen from '../screens/CategoryScreen';
import BookmarkedScreen from '../screens/BookmarkedScreen';
import { Ionicons } from '@expo/vector-icons';
const Tab = createMaterialTopTabNavigator();

export default function CategoryTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: 'white',
        tabBarLabelStyle: { fontWeight: 'bold', fontSize: 14, flexDirection: 'row', alignItems: 'center' },
        tabBarIndicatorStyle: { backgroundColor: 'whitesmoke' },
        tabBarScrollEnabled: true,
        tabBarStyle: { backgroundColor: 'green' },
        tabBarIcon: ({ color }) => {
          const iconMap = {
            Home: 'home',
            Folklore: 'book',
            Academics: 'school',
            Entertainment: 'film',
            Health: 'heart',
            Literature: 'book',
            Shop: 'cart',
            Technology: 'laptop',
            Bookmarked: 'bookmark',
          };
          const iconName = iconMap[route.name] || 'ellipse';
          return <Ionicons name={iconName} color={color} size={16} style={{ marginRight: 4, marginBottom: 0 }} />;
        },
        tabBarShowIcon: true,
        tabBarItemStyle: { flexDirection: 'row', alignItems: 'center' },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Folklore">
        {() => <CategoryScreen categoryName="Folklore" />}
      </Tab.Screen>
      <Tab.Screen name="Academics">
        {() => <CategoryScreen categoryName="Academics" />}
      </Tab.Screen>
      <Tab.Screen name="Entertainment">
        {() => <CategoryScreen categoryName="Entertainment" />}
      </Tab.Screen>
      <Tab.Screen name="Health">
        {() => <CategoryScreen categoryName="Health" />}
      </Tab.Screen>
      <Tab.Screen name="Literature">
        {() => <CategoryScreen categoryName="Literature" />}
      </Tab.Screen>
      <Tab.Screen name="Shop">
        {() => <CategoryScreen categoryName="Shop" />}
      </Tab.Screen>
      <Tab.Screen name="Technology">
        {() => <CategoryScreen categoryName="Technology" />}
      </Tab.Screen>
      <Tab.Screen name="Bookmarked" component={BookmarkedScreen} />
    </Tab.Navigator>
  );
}
