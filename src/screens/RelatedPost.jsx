import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import useWordPressApi from '../hooks/useWordPressApi';

export default function RelatedPost({ post, onPressPost }) {
  const { posts, getCategoryNames } = useWordPressApi();
  // Find related posts by category, excluding the current post
  const related = posts.filter(
    p =>
      p.id !== post.id &&
      p.categories.some(cat => post.categories.includes(cat))
  ).slice(0, 10); // Limit to 10 related posts

  if (!related.length) return null;

  return (
    <View style={{ marginTop: 24 }}>
      <Text style={styles.header}>Related Posts</Text>
      <FlatList
        data={related}
        keyExtractor={item => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 8, paddingRight: 8 }}
        renderItem={({ item }) => {
          let imageUrl = null;
          if (item._embedded && item._embedded['wp:featuredmedia'] && item._embedded['wp:featuredmedia'][0]?.source_url) {
            imageUrl = item._embedded['wp:featuredmedia'][0].source_url;
          }
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => onPressPost ? onPressPost(item) : null}
              activeOpacity={0.8}
            >
              {imageUrl && (
                <Image source={{ uri: imageUrl }} style={styles.image} />
              )}
              <Text numberOfLines={2} style={styles.title}>{item.title.rendered}</Text>
              <Text style={styles.category} numberOfLines={1}>{getCategoryNames(item.categories).join(', ')}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 10,
    color: '#1a1a1a',
  },
  card: {
    width: 160,
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    paddingBottom: 8,
  },
  image: {
    width: '100%',
    height: 90,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
    marginHorizontal: 8,
    color: '#222',
  },
  category: {
    fontSize: 12,
    color: '#888',
    marginHorizontal: 8,
    marginTop: 2,
  },
});
