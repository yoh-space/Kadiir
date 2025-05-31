import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from './SettingScreen'; // Adjust the import path as necessary
import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'react-native';
export default function Rateus() {
    const { isDark, theme } = useTheme();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Rate Us</Text>
        <Ionicons 
            name="star" 
            size={50} 
            color={isDark ? '#1db954' : '#4a90e2'} 
            onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=com.kaddir')} // Replace with your rating link
        />
        <Text style={{ marginTop: 10 }}>We would love to hear your feedback!</Text>
        {/* Add your rating component here */}
        </View>
    );
    }