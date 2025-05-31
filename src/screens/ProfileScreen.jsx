import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from './SettingScreen';

export default function ProfileScreen() {
  const { isDark, theme } = useTheme();
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}> 
      <View style={[styles.headerBg, { backgroundColor: isDark ? '#181a20' : '#1db954' }]}> 
        <Image source={require('../../assets/icon.png')} style={styles.avatar} />
        <Text style={[styles.name, { color: theme.text }]}>Welcome, Reader!</Text>
      </View>
      <View style={[styles.card, { backgroundColor: isDark ? '#23262b' : '#fff' }]}> 
        <Text style={[styles.sectionTitle, { color: isDark ? '#1db954' : '#1db954' }]}>Profile</Text>
        <Text style={[styles.infoLabel, { color: isDark ? '#aaa' : '#888' }]}>Username</Text>
        <Text style={[styles.infoValue, { color: theme.text }]}>Guest</Text>
        <Text style={[styles.infoLabel, { color: isDark ? '#aaa' : '#888' }]}>Bio</Text>
        <Text style={[styles.infoValue, { color: theme.text }]}>Enjoying the best of Kadiir Blog. Bookmark and favorite your top reads!</Text>
      </View>
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: isDark ? '#23262b' : '#fff' }]}> 
          <Text style={[styles.statNumber, { color: '#1db954' }]}>--</Text>
          <Text style={[styles.statLabel, { color: isDark ? '#aaa' : '#888' }]}>Favorites</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: isDark ? '#23262b' : '#fff' }]}> 
          <Text style={[styles.statNumber, { color: '#1db954' }]}>--</Text>
          <Text style={[styles.statLabel, { color: isDark ? '#aaa' : '#888' }]}>Bookmarks</Text>
        </View>
      </View>
      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#1db954' }]} activeOpacity={0.85}>
        <Text style={styles.actionBtnText}>Edit Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#f6f8fa',
    paddingBottom: 32,
  },
  headerBg: {
    width: '100%',
    backgroundColor: '#1db954',
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1db954',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 13,
    color: '#888',
    marginTop: 8,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: '#222',
    marginBottom: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '90%',
    marginBottom: 18,
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1db954',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 13,
    color: '#888',
  },
  actionBtn: {
    backgroundColor: '#1db954',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginTop: 8,
    elevation: 2,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
