import React, { useState } from 'react';
import { View, Text, StyleSheet, RefreshControl, Platform, TouchableOpacity, Animated, FlatList as RNFlatList } from 'react-native';
import { useFavorites } from '../components/FavoritesContext';
import BlogPostItem from '../components/BlogPostItem';
import { useTheme } from './SettingScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const AnimatedFlatList = Animated.createAnimatedComponent(RNFlatList);

export default function FavoritesScreen({ navigation: propNavigation }) {
  const navigation = propNavigation || useNavigation();
  const { favoritePosts } = useFavorites();
  const { isDark, theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: theme.background },
      { marginTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0 }
    ]}>
      <Text style={[styles.header, { color: theme.text }]}>Favorite Posts</Text>
      {favoritePosts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={60} color={isDark ? '#e74c3c' : '#bbb'} style={{ marginBottom: 16 }} />
          <Text style={[styles.empty, { color: theme.text }]}>No favorite posts yet.</Text>
        </View>
      ) : (
        <AnimatedFlatList
          data={favoritePosts}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <BlogPostItem
              post={item}
              categoryNames={item.categories || []}
              onPress={() => navigation.navigate('Post', { post: item })}
              isFavorite={true}
              style={styles.favoriteCard}
            />
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          ListHeaderComponent={<Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 8 }]}>All Favorite Posts</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
    paddingHorizontal: 0,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'center',
    marginTop: 16,
    letterSpacing: 1.2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  favoriteCard: {
    marginBottom: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(231,76,60,0.07)',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#e74c3c',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  empty: {
    alignSelf: 'center',
    marginTop: 8,
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});