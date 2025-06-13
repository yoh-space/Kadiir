import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { View, Text, Switch, StyleSheet, SafeAreaView, ScrollView, Appearance,TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  // Load saved theme preference from storage or use system preference
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themePreference');
        if (savedTheme !== null) {
          setIsDark(savedTheme === 'dark');
        } else {
          // Use system preference if no saved preference exists
          const systemPrefersDark = Appearance.getColorScheme() === 'dark';
          setIsDark(systemPrefersDark);
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };
    
    loadThemePreference();

    // Listen for system theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (colorScheme) {
        setIsDark(colorScheme === 'dark');
      }
    });

    return () => subscription.remove();
  }, []);

  // Save theme preference to storage
  const toggleTheme = useCallback(async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    try {
      await AsyncStorage.setItem('themePreference', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  }, [isDark]);

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, theme, toggleTheme }}>
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Settings Screen Component
export default function SettingScreen() {
  const navigation = useNavigation();
  const { isDark, toggleTheme, theme } = useTheme();

  // Section data for rendering with proper theme colors
  const generalSettings = [
    {
      icon: <Ionicons name="notifications-outline" size={22} color={theme.text} />,
      bg: '#f4b400',
      label: 'Get Notifications',
      type: 'switch',
      value: false
    },
    {
      icon: <Ionicons name="sunny-outline" size={22} color={theme.text} />,
      bg: '#5f6368',
      label: 'Dark Mode',
      type: 'switch',
      value: isDark,
      onToggle: toggleTheme
    },
    {
      icon: <Ionicons name="language-outline" size={22} color={theme.text} />,
      bg: '#a142f4',
      label: 'Language',
      type: 'link'
    },
  ];

  const aboutApp = [
    {
      icon: <Ionicons name="lock-closed-outline" size={22} color={theme.text} />,
      bg: '#4285f4',
      label: 'Privacy Policy',
      type: 'link'
    },
    {
      icon: <Ionicons name="star-outline" size={22} color={theme.text} />,
      bg: '#ea4335',
      label: 'Rate this app',
      type: 'link'
    },
  ];

  const socialSettings = [
    {
      icon: <Ionicons name="mail-outline" size={22} color={theme.text} />,
      bg: '#ff6f61',
      label: 'Contact Us',
      type: 'link'
    },
    {
      icon: <Ionicons name="link-outline" size={22} color={theme.text}/>,
      bg: '#f4b400',
      label: 'Our Website',
      type: 'link'
    },
  ];

  const handleItemPress = (item) => {
    if (item.label === 'Our Website') {
      Linking.openURL('https://kadiir.com/');
    } else if (item.label === 'Contact Us') {
      Linking.openURL('mailto:support@kadiir.com');
    } else if (item.label === 'Privacy Policy') {
      Linking.openURL('https://kadiir.com/privacy');
    } else if (item.label === 'Rate this app') {
      // Example: open Play Store or App Store
      Linking.openURL('https://play.google.com/store/apps/details?id=com.kadiir.app');
    } else if (item.label === 'Language') {
      // Add language change logic here
    }
  };

  const renderItem = (item, idx, arr) => (
    <TouchableOpacity
      key={item.label}
      activeOpacity={0.7}
      onPress={() => item.type === 'link' ? handleItemPress(item) : undefined}
      style={[
        styles.settingRow,
        { backgroundColor: theme.cardBackground, borderBottomColor: theme.divider },
        idx === arr.length - 1 && { borderBottomWidth: 0 }
      ]}
    >
      <View style={[styles.settingIconCircle, { backgroundColor: item.bg }]}>
        {item.icon}
      </View>
      <Text style={[styles.settingLabel, { color: theme.text }]}>{item.label}</Text>
      {item.type === 'switch' ? (
        <Switch
          value={item.value}
          onValueChange={item.onToggle}
          thumbColor={isDark ? theme.primary : '#fff'}
          trackColor={{ false: theme.switchInactive, true: theme.switchActive }}
        />
      ) : (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.iconColor}
          style={{ marginLeft: 'auto' }}
        />
      )}
    </TouchableOpacity>
  );

  const renderSection = (title, data) => (
    <View style={styles.sectionBox}>
      <Text style={[styles.sectionTitle, { color: theme.sectionTitle }]}>{title}</Text>
      <View style={[
        styles.sectionCard, 
        { 
          backgroundColor: theme.cardBackground,
          shadowColor: theme.shadowColor
        }
      ]}>
        {data.map((item, idx, arr) => renderItem(item, idx, arr))}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#181a20' : 'whitesmoke' }}>
      <StatusBar backgroundColor={isDark ? '#181a20' : 'whitesmoke'} barStyle={isDark ? 'light-content' : 'dark-content'} animated={true} />
      <View style={[styles.headerBox, { backgroundColor: theme.header.background }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.primary + '22', // subtle tint
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16,
            shadowColor: theme.primary,
            shadowOpacity: 0.15,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }}
        >
          <Ionicons name="arrow-back" size={24} color={theme.header.tint} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: theme.header.text }]}>Settings</Text>
      </View>
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 40 }} 
        showsVerticalScrollIndicator={false}
      >
        {renderSection('General Settings', generalSettings)}
        {renderSection('About App', aboutApp)}
        {renderSection('Social Settings', socialSettings)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBox: {
    paddingTop: 40,
    paddingBottom: 24,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerText: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sectionBox: {
    marginTop: 24,
    marginHorizontal: 0,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
    marginLeft: 20,
  },
  sectionCard: {
    borderRadius: 12,
    marginHorizontal: 12,
    paddingVertical: 2,
    paddingHorizontal: 0,
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
  },
  settingLabel: {
    fontSize: 17,
    fontWeight: '500',
    flex: 1,
  },
});

// Enhanced theme definitions
const lightTheme = {
  primary: '#1db954',
  primaryLight: '#d1f5dc',
  background: '#f6f8fa',
  cardBackground: '#fff',
  text: '#222',
  sectionTitle: '#555',
  iconColor: '#bbb',
  divider: 'rgba(0,0,0,0.1)',
  shadowColor: '#000',
  switchActive: '#b2f2d7',
  switchInactive: '#d1d1d1',
  tabBar: {
    activeTint: '#1db954',
    inactiveTint: '#888',
    background: '#fff',
    border: '#e0e0e0',
  },
  header: {
    background: 'whitesmoke',
    text: 'black',
    tint: '#1db954',
  },
  statusBar: 'dark',
};

const darkTheme = {
  primary: '#1db954',
  primaryLight: '#1a3a26',
  background: '#181a20',
  cardBackground: '#23262b',
  text: '#fff',
  sectionTitle: '#aaa',
  iconColor: '#666',
  divider: 'rgba(255,255,255,0.1)',
  shadowColor: '#fff',
  switchActive: '#1a3a26',
  switchInactive: '#444',
  tabBar: {
    activeTint: '#1db954',
    inactiveTint: '#aaa',
    background: '#23262b',
    border: '#23262b',
  },
  header: {
    background: '#1a1a1a',
    text: '#fff',
    tint: '#1db954',
  },
  statusBar: 'light',
};