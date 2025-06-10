import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useTheme } from './SettingScreen';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ProfileScreen() {
  const { isDark, theme } = useTheme();
  const scrollY = new Animated.Value(0);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [280, 180],
    extrapolate: 'clamp',
  });

  const avatarScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.7],
    extrapolate: 'clamp',
  });

  const avatarMarginTop = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -30],
    extrapolate: 'clamp',
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView 
        contentContainerStyle={styles.container}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <Animated.View style={[styles.headerBg, { height: headerHeight }]}>
          <LinearGradient
            colors={isDark ? ['#1c1c1c', '#2e2e2e'] : ['#00c6ff', '#0072ff']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <Animated.View style={[styles.avatarContainer, { transform: [{ scale: avatarScale }], marginTop: avatarMarginTop }]}>
            <Image source={require('../../assets/icon.png')} style={styles.avatar} />
            <View style={styles.onlineBadge} />
          </Animated.View>
          <Text style={styles.name}>Welcome, Reader!</Text>
          <Text style={styles.memberSince}>Member since 2023</Text>
        </Animated.View>

        <View style={[styles.card, { backgroundColor: isDark ? '#2a2d33' : '#ffffff' }]}>
          <View style={styles.sectionHeader}>
            <Icon name="person" size={20} color="#0072ff" />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Profile Information</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: theme.text }]}>Username</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>Guest</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: theme.text }]}>Bio</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>Enjoying the best of Kadiir Blog. Bookmark and favorite your top reads!</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: isDark ? '#2a2d33' : '#ffffff' }]}>
            <Icon name="favorite" size={24} color="#ff4757" />
            <Text style={[styles.statNumber, { color: theme.text }]}>--</Text>
            <Text style={[styles.statLabel, { color: theme.text }]}>Favorites</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: isDark ? '#2a2d33' : '#ffffff' }]}>
            <Icon name="bookmark" size={24} color="#ff4757" />
            <Text style={[styles.statNumber, { color: theme.text }]}>--</Text>
            <Text style={[styles.statLabel, { color: theme.text }]}>Bookmarks</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#0072ff' }]} activeOpacity={0.85}>
            <Text style={styles.actionBtnText}>Edit Profile</Text>
            <Icon name="edit" size={18} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.secondaryBtn, { backgroundColor: isDark ? '#2a2d33' : '#f5f5f5' }]} activeOpacity={0.85}>
            <Text style={[styles.secondaryBtnText, { color: isDark ? '#cfcfcf' : '#333' }]}>Settings</Text>
            <Icon name="settings" size={18} color={isDark ? '#cfcfcf' : '#333'} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 32,
  },
  headerBg: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 18,
    elevation: 10,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'white',
  },
  onlineBadge: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: 'white',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
    letterSpacing: 0.8,
  },
  memberSince: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 8,
  },
  card: {
    width: '90%',
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
  infoItem: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#888',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '90%',
    marginBottom: 18,
  },
  statBox: {
    alignItems: 'center',
    borderRadius: 16,
    padding: 20,
    width: '45%',
    elevation: 3,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  actionsContainer: {
    width: '90%',
    alignItems: 'center',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginBottom: 12,
    elevation: 6,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  secondaryBtnText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});