import React from 'react';
import { FlatList, View, Text } from 'react-native';
import BlogPostItem from '../BlogPostItem';
import { Ionicons } from '@expo/vector-icons';

export default function HomeBlogPostList({
  displayedPosts,
  getCategoryNames,
  navigation,
  styles,
  loading,
  refresh,
  theme
}) {
  return (
    <FlatList
      data={displayedPosts}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <BlogPostItem
          post={item}
          categoryNames={getCategoryNames(item.categories)}
          onPress={() => navigation.navigate('Post', { post: item })}
          style={styles.blogPostItem}
        />
      )}
      refreshControl={null}
      contentContainerStyle={styles.flatListContent}
      ListEmptyComponent={
        !loading && (
          <View style={styles.emptyContainer}>
            <Ionicons name="sad-outline" size={48} color="#FF3A44" />
            <Text style={[styles.empty, { color: theme.text }]}>NO CRAZY POSTS FOUND!</Text>
          </View>
        )
      }
    />
  );
}
