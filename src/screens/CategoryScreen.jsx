import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator, RefreshControl, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useWordPressApi from '../hooks/useWordPressApi';
import BlogPostItem from '../components/BlogPostItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../components/FavoritesContext';
import { useTheme } from './SettingScreen';

// Define the category tree (should match HomeScreen)
const categoryTree = [
  { name: 'All', subs: [] },
  { name: 'Academics', subs: ['Agriculture', 'Custom', 'Education', 'Gada'] },
  { name: 'Folklore', subs: ['Mythology', 'Proverbs'] },
  { name: 'Health', subs: ['Disease', 'Food', 'Medicine'] },
  { name: 'Literature', subs: ['Fiction', 'History', 'Poem'] },
  { name: 'News', subs: ['Africa', 'Ethiopia', 'World'] },
  { name: 'Shop', subs: ['Books', 'Cloths', 'Food Shop'] },
  { name: 'Technology', subs: ['ICT/IT'] },
  { name: 'Entertainment', subs: [] },
];

// Helper to get all category names for a main category (including subs)
function getAllCategoryNames(selectedName) {
  if (selectedName === 'All') return null; // null means all posts
  const main = categoryTree.find(cat => cat.name === selectedName);
  if (main) {
    return [main.name, ...main.subs];
  }
  // If not a main, check if it's a subcategory
  const parent = categoryTree.find(cat => cat.subs.includes(selectedName));
  if (parent) {
    return [selectedName];
  }
  return [];
}

// Get all relevant category IDs for filtering
function getCategoryIdsForNames(names, categories) {
  if (!names) return null; // null means all
  return categories
    .filter(cat => names.includes(cat.name))
    .map(cat => cat.id);
}

function getFeaturedImage(post) {
  // Try to get the featured image from _embedded if available
  if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]?.source_url) {
    return post._embedded['wp:featuredmedia'][0].source_url;
  }
  // Fallback: no image
  return null;
}

export default function CategoryScreen({ categoryName }) {
  const navigation = useNavigation();
  const {
    posts,
    categories,
    loading,
    error,
    refresh,
    getCategoryNames,
  } = useWordPressApi();
  const { isDark, theme } = useTheme();
  const { favoriteIds, toggleFavorite, bookmarkedPosts, toggleBookmark } = useFavorites();

  // Determine which posts to show
  let filteredPosts;
  if (categoryName === 'All') {
    filteredPosts = posts;
  } else {
    const allNames = getAllCategoryNames(categoryName);
    if (!allNames) {
      filteredPosts = posts;
    } else {
      const catIds = getCategoryIdsForNames(allNames, categories);
      filteredPosts = posts.filter(post => post.categories.some(id => catIds.includes(id)));
    }
  }

  const renderItem = ({ item }) => {
    const isFavorite = favoriteIds.includes(item.id);
    const isBookmarked = bookmarkedPosts.some(p => p.id === item.id);
    return (
      <BlogPostItem
        post={item}
        categoryNames={getCategoryNames(item.categories)}
        onPress={() => navigation.navigate('Post', { post: item })}
        isFavorite={isFavorite}
        onToggleFavorite={() => toggleFavorite(item)}
        isBookmarked={isBookmarked}
        onToggleBookmark={() => toggleBookmark(item)}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      {loading && <ActivityIndicator size="large" color={isDark ? '#1db954' : '#4a90e2'} style={{ marginTop: 40 }} />}
      {error && <Text style={[styles.error, { color: isDark ? '#ff7675' : 'red' }]}>{error}</Text>}
      <FlatList
        data={filteredPosts}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
        contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
        ListEmptyComponent={!loading && <Text style={[styles.empty, { color: isDark ? '#aaa' : '#888' }]}>No posts found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#eaeaea',
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
  },
  excerpt: {
    fontSize: 15,
    color: '#444',
    marginBottom: 12,
  },
  readMoreBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#4a90e2',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  readMoreText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  error: {
    color: 'red',
    alignSelf: 'center',
    marginVertical: 16,
    fontSize: 16,
  },
  empty: {
    alignSelf: 'center',
    color: '#888',
    marginTop: 40,
    fontSize: 16,
  },
  favoriteBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 20,
    padding: 4,
  },
});
