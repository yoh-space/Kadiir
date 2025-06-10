import React from 'react';
import { View, Text, TouchableOpacity, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';

export default function HomeHeader({ navigation, theme, isDark, showSearch, toggleSearch }) {
  return (
    <Animated.View style={[{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 15, paddingBottom: 10, backgroundColor: 'transparent', zIndex: 100 }]}> 
      <TouchableOpacity 
        style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#FF3A44', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FF9500', shadowColor: '#FF3A44', shadowOpacity: 0.5, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 10 }}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      >
        <Image 
          source={require('../../assets/image.png')} 
          style={{ width: 30, height: 30, resizeMode: 'contain', tintColor: '#FFF' }} 
        />
      </TouchableOpacity>
      <View style={{ flex: 1, marginLeft: 15 }}>
        <Text style={{ fontSize: 12, color: theme.text, fontWeight: '800', letterSpacing: 1 }}>KADIIR BLOG</Text>
        <Text style={{ fontSize: 10, fontWeight: '900', color: theme.text, letterSpacing: 0.5, textShadowColor: 'rgba(255,58,68,0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 5 }}>Get Latest info.</Text>
      </View>
      <TouchableOpacity 
        style={{ marginLeft: 12, backgroundColor: 'rgba(255,58,68,0.2)', borderRadius: 20, padding: 8, position: 'relative' }} 
        onPress={() => navigation.navigate('Notification')}
      >
        <Ionicons 
          name="notifications-outline" 
          size={24} 
          color={theme.text} 
        />
        <View style={{ position: 'absolute', top: 5, right: 5, width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF3A44' }} />
      </TouchableOpacity>
    </Animated.View>
  );
}
