import React, { createContext, useContext, useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  // Load saved theme preference from storage
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themePreference');
        if (savedTheme !== null) {
          setIsDark(savedTheme === 'dark');
        }
      } catch (error) {
        console.log('Error loading theme preference:', error);
      }
    };
    
    loadThemePreference();
  }, []);

  // Save theme preference to storage
  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    try {
      await AsyncStorage.setItem('themePreference', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export default function SettingScreen() {
  const { isDark, toggleTheme, theme } = useTheme();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>  
      <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
      <View style={[styles.row, { borderColor: theme.divider }]}>
        <Text style={[styles.label, { color: theme.text }]}>Dark Mode</Text>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          thumbColor={isDark ? theme.primary : '#f4f3f4'}
          trackColor={{ false: '#767577', true: theme.primaryLight }}
        />
      </View>
      <View style={[styles.optionBox, { borderTopColor: theme.divider }]}>
        <Text style={[styles.option, { color: theme.text }]}>About Us</Text>
        <Text style={[styles.option, { color: theme.text }]}>Contact Us</Text>
        <Text style={[styles.option, { color: theme.text }]}>Services</Text>
        <Text style={[styles.option, { color: theme.text }]}>Privacy Policy</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
  },
  optionBox: {
    marginTop: 40,
    width: '80%',
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'flex-start',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  option: {
    fontSize: 18,
    fontWeight: '500',
    paddingVertical: 12,
    paddingHorizontal: 8,
    width: '100%',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

const lightTheme = {
  primary: '#1db954',
  primaryLight: '#d1f5dc',
  background: '#f6f8fa',
  text: '#222',
  divider: 'rgba(0,0,0,0.1)',
  tabBar: {
    activeTint: '#1db954',
    inactiveTint: '#888',
    background: '#fff',
    border: '#e0e0e0',
  },
  header: {
    background: '#fff',
    text: '#222',
    tint: '#1db954',
  },
  statusBar: 'dark',
};

const darkTheme = {
  primary: '#1db954',
  primaryLight: '#1a3a26',
  background: '#181a20',
  text: '#fff',
  divider: 'rgba(255,255,255,0.1)',
  tabBar: {
    activeTint: '#1db954',
    inactiveTint: '#aaa',
    background: '#23262b',
    border: '#23262b',
  },
  header: {
    background: '#181a20',
    text: '#fff',
    tint: '#1db954',
  },
  statusBar: 'light',
};