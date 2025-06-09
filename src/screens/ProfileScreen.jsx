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
        <Animated.View style={[
          styles.headerBg, 
          { 
            height: headerHeight,
            backgroundColor: isDark ? '#181a20' : '#FF6B6B' 
          }
        ]}>
          <LinearGradient
            colors={isDark ? ['#181a20', '#23262b'] : ['#FF6B6B', '#FF8E8E']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <Animated.View style={[
            styles.avatarContainer,
            { 
              transform: [{ scale: avatarScale }],
              marginTop: avatarMarginTop 
            }
          ]}>
            <Image 
              source={require('../../assets/icon.png')} 
              style={styles.avatar} 
            />
            <View style={styles.onlineBadge} />
          </Animated.View>
          <Text style={[styles.name, { color: 'white' }]}>Welcome, Reader!</Text>
          <Text style={[styles.memberSince, { color: 'rgba(255,255,255,0.8)' }]}>
            Member since 2023
          </Text>
        </Animated.View>

        <View style={[styles.card, { backgroundColor: isDark ? '#23262b' : '#fff' }]}>
          <View style={styles.sectionHeader}>
            <Icon name="person" size={20} color={isDark ? '#FF6B6B' : '#FF6B6B'} />
            <Text style={[styles.sectionTitle, { color: isDark ? '#FF6B6B' : '#FF6B6B' }]}>
              Profile Information
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: isDark ? '#A0A0A0' : '#888' }]}>
              Username
            </Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>Guest</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: isDark ? '#A0A0A0' : '#888' }]}>
              Bio
            </Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              Enjoying the best of Kadiir Blog. Bookmark and favorite your top reads!
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: isDark ? '#23262b' : '#fff' }]}>
            <Icon name="favorite" size={24} color="#FF6B6B" />
            <Text style={[styles.statNumber, { color: '#FF6B6B' }]}>--</Text>
            <Text style={[styles.statLabel, { color: isDark ? '#A0A0A0' : '#888' }]}>
              Favorites
            </Text>
          </View>
          
          <View style={[styles.statBox, { backgroundColor: isDark ? '#23262b' : '#fff' }]}>
            <Icon name="bookmark" size={24} color="#FF6B6B" />
            <Text style={[styles.statNumber, { color: '#FF6B6B' }]}>--</Text>
            <Text style={[styles.statLabel, { color: isDark ? '#A0A0A0' : '#888' }]}>
              Bookmarks
            </Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: '#FF6B6B' }]} 
            activeOpacity={0.85}
          >
            <Text style={styles.actionBtnText}>Edit Profile</Text>
            <Icon name="edit" size={18} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.secondaryBtn, { 
              backgroundColor: isDark ? '#2a2d33' : '#f0f0f0',
              borderColor: isDark ? '#3a3d43' : '#e0e0e0'
            }]} 
            activeOpacity={0.85}
          >
            <Text style={[styles.secondaryBtnText, { color: isDark ? '#A0A0A0' : '#555' }]}>
              Settings
            </Text>
            <Icon 
              name="settings" 
              size={18} 
              color={isDark ? '#A0A0A0' : '#555'} 
            />
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
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
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
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: 'white',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  memberSince: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
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
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '45%',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
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
    shadowColor: '#FF6B6B',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
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
    borderWidth: 1,
  },
  secondaryBtnText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginRight: 8,
  },
});