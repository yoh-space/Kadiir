import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../screens/SettingScreen';
import { decode } from 'he';
import { useFavorites } from './FavoritesContext';

function getFeaturedImage(post) {
  try {
    return post?._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null;
  } catch {
    return null;
  }
}

export default function BlogPostItem({
  post,
  categoryNames = [],
  onPress,
  isFavorite: isFavoriteProp,
  onToggleFavorite: onToggleFavoriteProp,
  isBookmarked: isBookmarkedProp,
  onToggleBookmark: onToggleBookmarkProp,
}) {
  const { isDark } = useTheme();
  const { favoriteIds, toggleFavorite, bookmarkedPosts, toggleBookmark } = useFavorites();
  const imageUrl = useMemo(() => getFeaturedImage(post), [post]);

  // Determine favorite/bookmark state from context if not provided
  const isFavorite = typeof isFavoriteProp === 'boolean' ? isFavoriteProp : favoriteIds.includes(post.id);
  const isBookmarked = typeof isBookmarkedProp === 'boolean' ? isBookmarkedProp : bookmarkedPosts.some(p => p.id === post.id);

  // Memoize processed text to avoid recomputing on every render
  const processedTitle = useMemo(() => {
    if (!post?.title?.rendered) return '';
    try {
      return decode(post.title.rendered);
    } catch {
      return post.title.rendered;
    }
  }, [post]);

  const processedExcerpt = useMemo(() => {
    if (!post?.excerpt?.rendered) return '';
    try {
      const noTags = post.excerpt.rendered.replace(/<[^>]+>/g, '');
      return decode(noTags).replace(/\s+/g, ' ').trim();
    } catch {
      return post.excerpt.rendered;
    }
  }, [post]);

  const formattedDate = useMemo(() => {
    try {
      return new Date(post.date).toLocaleDateString();
    } catch {
      return '';
    }
  }, [post.date]);

  return (
    <View style={[styles.card, { backgroundColor: isDark ? '#181a20' : 'whitesmoke' }]}>
      {imageUrl && (
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.image} 
          resizeMode="cover"
          onError={() => console.warn('Failed to load image')}
        />
      )}
      
      <View style={styles.topRightBtns}>
        <TouchableOpacity
          style={[
            styles.iconBtn,
            { backgroundColor: isDark ? 'rgba(30,30,30,0.85)' : 'rgba(255,255,255,0.85)' },
          ]}
          onPress={() => (onToggleFavoriteProp ? onToggleFavoriteProp(post) : toggleFavorite(post))}
          accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          accessibilityRole="button"
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={26}
            color={isFavorite ? '#e74c3c' : '#bbb'}
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.iconBtn,
            { backgroundColor: isDark ? 'rgba(30,30,30,0.85)' : 'rgba(255,255,255,0.85)' },
          ]}
          onPress={() => (onToggleBookmarkProp ? onToggleBookmarkProp(post) : toggleBookmark(post))}
          accessibilityLabel={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          accessibilityRole="button"
        >
          <MaterialCommunityIcons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={26}
            color={isBookmarked ? '#1db954' : '#bbb'}
          />
        </TouchableOpacity>
      </View>

      <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
        {processedTitle}
      </Text>

      <Text style={[styles.meta, { color: isDark ? '#aaa' : '#888' }]}>
        {formattedDate} • {categoryNames.join(', ')}
      </Text>

      <Text 
        style={[styles.excerpt, { color: isDark ? '#eee' : '#444' }]} 
        numberOfLines={3}
      >
        {processedExcerpt}
      </Text>

      <TouchableOpacity
        style={[styles.readMoreBtn, { backgroundColor: isDark ? '#1db954' : 'darkgreen' }]}
        onPress={onPress}
        accessibilityLabel="Read more"
        accessibilityRole="button"
      >
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
    minHeight: 200, // Ensure consistent height
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
  iconBtn: {
    borderRadius: 20,
    padding: 8,
    marginLeft: 8,
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 8,
  },
  meta: {
    fontSize: 13,
    marginBottom: 12,
  },
  excerpt: {
    fontSize: 15,
    marginBottom: 16,
    lineHeight: 22,
  },
  readMoreBtn: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  readMoreText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.5,
  },
});