import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../screens/SettingScreen';

function getFeaturedImage(post) {
  if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]?.source_url) {
    return post._embedded['wp:featuredmedia'][0].source_url;
  }
  return null;
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/gi, '');
}

export default function BlogPostItem({ post, categoryNames, onPress, isFavorite, onToggleFavorite, isBookmarked, onToggleBookmark }) {
  const imageUrl = getFeaturedImage(post);
  const { isDark, theme } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: isDark ? '#181a20' : 'whitesmoke' }]}> 
      {imageUrl && (
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      )}
      <View style={styles.topRightBtns}>
        <TouchableOpacity
          style={[styles.favoriteBtn, { backgroundColor: isDark ? 'rgba(30,30,30,0.85)' : 'rgba(255,255,255,0.85)' }]}
          onPress={onToggleFavorite}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={26}
            color={isFavorite ? '#e74c3c' : '#bbb'}
          />
        </TouchableOpacity>
      </View>
      <Text style={[styles.title, { color: isDark ? '#fff' : '#222' }]}>{post.title.rendered}</Text>
      <Text style={[styles.meta, { color: isDark ? '#aaa' : '#888' }]}>{new Date(post.date).toLocaleDateString()} • {categoryNames.join(', ')}</Text>
      <Text style={[styles.excerpt, { color: isDark ? '#eee' : '#444' }]} numberOfLines={3}>{stripHtml(post.excerpt.rendered)}</Text>
      <TouchableOpacity style={[styles.readMoreBtn, { backgroundColor: isDark ? '#1db954' : 'darkgreen' }]} onPress={onPress}>
        <Text style={styles.readMoreText}>Read More</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
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
  topRightBtns: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    zIndex: 2,
  },
  favoriteBtn: {
    borderRadius: 20,
    padding: 4,
    marginRight: 4,
  },
  bookmarkBtn: {
    borderRadius: 20,
    padding: 4,
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
    marginBottom: 8,
  },
  excerpt: {
    fontSize: 15,
    marginBottom: 12,
  },
  readMoreBtn: {
    alignSelf: 'flex-start',
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
});
