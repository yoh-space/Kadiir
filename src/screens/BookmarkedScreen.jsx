import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, RefreshControl, ScrollView, Platform } from 'react-native';
import BlogPostItem from '../components/BlogPostItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from './SettingScreen';
import { useFavorites } from '../components/FavoritesContext';
import { StatusBar } from 'expo-status-bar';

function BookmarkedScreen() {
  const navigation = useNavigation();
  const { isDark, theme } = useTheme();
  const { bookmarkedPosts } = useFavorites();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Optionally reload from AsyncStorage if needed
    setTimeout(() => setRefreshing(false), 600);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <Text style={[styles.header, { color: theme.text }]}>Bookmarked Posts</Text>
      {bookmarkedPosts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="bookmark-outline" size={60} color={isDark ? '#555' : '#bbb'} style={{ marginBottom: 16 }} />
          <Text style={[styles.empty, { color: theme.text }]}>No bookmarked posts yet.</Text>
        </View>
      ) : (
        <FlatList
          data={bookmarkedPosts}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <BlogPostItem
              post={item}
              categoryNames={item.categories || []}
              onPress={() => navigation.navigate('Post', { post: item })}
              isBookmarked={true}
              style={styles.bookmarkedCard}
            />
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          ListHeaderComponent={<Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 8 }]}>All Bookmarked Posts</Text>}
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
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
  bookmarkedCard: {
    marginBottom: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(76,108,247,0.07)',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#4a6cf7',
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

export default BookmarkedScreen;
