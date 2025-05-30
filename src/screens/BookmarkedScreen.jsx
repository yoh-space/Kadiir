import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, RefreshControl } from 'react-native';
import BlogPostItem from '../components/BlogPostItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function BookmarkedScreen() {
  const navigation = useNavigation();
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    const data = await AsyncStorage.getItem('bookmarkedPosts');
    if (data) setBookmarkedPosts(JSON.parse(data));
    else setBookmarkedPosts([]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookmarks();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bookmarked Posts</Text>
      <FlatList
        data={bookmarkedPosts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <BlogPostItem
            post={item}
            categoryNames={item.categories ? item.categories.map(String) : []}
            onPress={() => navigation.navigate('Post', { post: item })}
            isBookmarked={true}
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
        ListEmptyComponent={<Text style={styles.empty}>No bookmarks yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 24,
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
