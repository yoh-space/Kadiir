import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import BlogPostItem from '../components/BlogPostItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from './SettingScreen';
import useWordPressApi from '../hooks/useWordPressApi';

function PopularScreen() {
  const navigation = useNavigation();
  const { isDark, theme } = useTheme();
  const { bookmarkedPosts, getCategoryNames, allPosts } = useWordPressApi();
  const [refreshing, setRefreshing] = useState(false);
  const [popularPosts, setPopularPosts] = useState([]);

  useEffect(() => {
    loadPopularPosts();
  }, []);

  const loadPopularPosts = async () => {
    // If your API provides a 'views' property, sort by it. Otherwise, fallback to bookmarks.
    let posts = allPosts && allPosts.length ? allPosts : bookmarkedPosts;
    if (posts && posts.length) {
      posts = posts.filter(p => p.views !== undefined);
      posts.sort((a, b) => (b.views || 0) - (a.views || 0));
      setPopularPosts(posts);
    } else {
      setPopularPosts([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPopularPosts();
    setRefreshing(false);
  };

  const mostViewed = popularPosts.slice(0, 3);
  const restPopular = popularPosts.slice(3);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>  
      <Text style={[styles.header, { color: theme.text }]}>Popular Posts</Text>
      {mostViewed.length > 0 && (
        <View style={styles.mostViewedSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Most Viewed</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {mostViewed.map(item => (
              <BlogPostItem
                key={item.id}
                post={item}
                categoryNames={getCategoryNames(item.categories)}
                onPress={() => navigation.navigate('Post', { post: item })}
                isBookmarked={false}
                style={styles.mostViewedCard}
              />
            ))}
          </ScrollView>
        </View>
      )}
      <FlatList
        data={restPopular}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <BlogPostItem
            post={item}
            categoryNames={getCategoryNames(item.categories)}
            onPress={() => navigation.navigate('Post', { post: item })}
            isBookmarked={false}
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
        ListHeaderComponent={restPopular.length > 0 ? (
          <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 8 }]}>All Popular Posts</Text>
        ) : null}
        ListEmptyComponent={<Text style={[styles.empty, { color: theme.text }]}>No popular posts yet.</Text>}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
    marginBottom: 8,
  },
  mostViewedSection: {
    marginBottom: 16,
  },
  mostViewedCard: {
    width: 260,
    marginRight: 12,
  },
  empty: {
    alignSelf: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});

export default PopularScreen;
