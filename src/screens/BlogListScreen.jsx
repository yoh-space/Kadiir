import React from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import useWordPressApi from '../hooks/useWordPressApi';
import BlogPostItem from '../components/BlogPostItem';
import { useTheme } from './SettingScreen';
import { StatusBar } from 'expo-status-bar';

export default function BlogListScreen({ navigation, route }) {
  const { posts, getCategoryNames, loading, refresh } = useWordPressApi();
  const { isDark, theme } = useTheme();
  const { category } = route.params || {};

  // Filter posts by category if provided
  const displayedPosts = category && category !== 'Latest'
    ? posts.filter(post => {
        const catNames = getCategoryNames(post.categories);
        return catNames.includes(category);
      })
    : posts;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>  
      <StatusBar style="light" />
      <Text style={[styles.header, { color: theme.text }]}>{category || 'All Blogs'}</Text>
      <FlatList
        data={displayedPosts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <BlogPostItem
            post={item}
            categoryNames={getCategoryNames(item.categories)}
            onPress={() => navigation.navigate('Post', { post: item })}
          />
        )}
        contentContainerStyle={{ padding: 10, paddingBottom: 24 }}
        ListEmptyComponent={<Text style={[styles.empty, { color: isDark ? '#aaa' : '#888' }]}>No posts found.</Text>}
        refreshing={loading}
        onRefresh={refresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
    alignSelf: 'center',
    letterSpacing: 1,
  },
  empty: {
    alignSelf: 'center',
    color: '#888',
    marginTop: 40,
    fontSize: 16,
  },
});
