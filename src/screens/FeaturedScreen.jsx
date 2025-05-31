import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, RefreshControl } from 'react-native';
import BlogPostItem from '../components/BlogPostItem';
import useWordPressApi from '../hooks/useWordPressApi';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from './SettingScreen';

export default function FeaturedScreen() {
  const navigation = useNavigation();
  const { posts, loading, getCategoryNames } = useWordPressApi();
  const { theme } = useTheme();
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Example: Mark posts with tag 'featured' as featured
    // You can adjust this logic as needed
    const featured = posts.filter(
      post =>
        (post.tags && post.tags.length > 0 && post.tags.some(tagId => {
          // You can use a specific tag ID or name for 'featured'
          // For now, treat the first 1-2 posts as featured for demo
          return post.id === posts[0]?.id || post.id === posts[1]?.id;
        }))
    );
    // Fallback: just show the first 3 posts if no tag
    setFeaturedPosts(featured.length ? featured : posts.slice(0, 3));
  }, [posts]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>Featured Posts</Text>
      <FlatList
        data={featuredPosts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <BlogPostItem
            post={item}
            categoryNames={getCategoryNames(item.categories)}
            onPress={() => navigation.navigate('Post', { post: item })}
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
        ListEmptyComponent={<Text style={styles.empty}>No featured posts yet.</Text>}
      />
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
  },
  empty: {
    alignSelf: 'center',
    color: '#888',
    marginTop: 40,
    fontSize: 16,
  },
});
