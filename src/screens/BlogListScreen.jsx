import React from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import useWordPressApi from '../hooks/useWordPressApi';
import BlogPostItem from '../components/BlogPostItem';
import { useTheme } from './SettingScreen';

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
    <View style={{ flex: 1, backgroundColor: isDark ? '#181a20' : 'whitesmoke' }}>
      <StatusBar backgroundColor={isDark ? '#181a20' : 'whitesmoke'} barStyle={isDark ? 'light-content' : 'dark-content'} animated={true} />
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
