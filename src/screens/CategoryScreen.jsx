import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator, RefreshControl, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useWordPressApi from '../hooks/useWordPressApi';
import BlogPostItem from '../components/BlogPostItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../components/FavoritesContext';

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

  const { favoriteIds, toggleFavorite, bookmarkedPosts, toggleBookmark } = useFavorites();

  // Filter posts by category name, case-insensitive
  const category = categories.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
  const filteredPosts = category ? posts.filter(post => post.categories.includes(category.id)) : [];

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
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#4a90e2" style={{ marginTop: 40 }} />}
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={filteredPosts}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
        contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
        ListEmptyComponent={!loading && <Text style={styles.empty}>No posts found in this category.</Text>}
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
