import React, { createContext, useContext, useState } from 'react';
import { View, Text, Switch, StyleSheet, SafeAreaView } from 'react-native';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? darkTheme : lightTheme;
  const toggleTheme = () => setIsDark((prev) => !prev);
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
      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.text }]}>Dark Mode</Text>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          thumbColor={isDark ? '#1db954' : '#eee'}
          trackColor={{ false: '#ccc', true: '#23262b' }}
        />
      </View>
      {/* New Settings Options */}
      <View style={styles.optionBox}>
        <Text style={[styles.option, { color: isDark ? '#1db954' : '#222' }]}>About Us</Text>
        <Text style={[styles.option, { color: isDark ? '#1db954' : '#222' }]}>Contact Us</Text>
        <Text style={[styles.option, { color: isDark ? '#1db954' : '#222' }]}>Services</Text>
        <Text style={[styles.option, { color: isDark ? '#1db954' : '#222' }]}>Privacy Policy</Text>
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
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
  },
  optionBox: {
    marginTop: 40,
    width: '80%',
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'flex-start',
  },
  option: {
    fontSize: 18,
    fontWeight: '500',
    paddingVertical: 12,
    paddingHorizontal: 8,
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
});

const lightTheme = {
  background: '#f6f8fa',
  text: '#222',
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
};
const darkTheme = {
  background: '#181a20',
  text: '#fff',
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
};
