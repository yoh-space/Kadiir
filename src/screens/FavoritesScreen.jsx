import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useFavorites } from '../components/FavoritesContext';
import BlogPostItem from '../components/BlogPostItem';

export default function FavoritesScreen({ navigation }) {
  const { favoritePosts, favoriteIds, toggleFavorite } = useFavorites();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Favorites</Text>
      <FlatList
        data={favoritePosts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <BlogPostItem
            post={item}
            categoryNames={item.categories ? item.categories.map(String) : []}
            onPress={() => navigation.navigate('Post', { post: item })}
            isFavorite={favoriteIds.includes(item.id)}
            onToggleFavorite={() => toggleFavorite(item)}
          />
        )}
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => {}} />}
        contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
        ListEmptyComponent={<Text style={styles.empty}>No favorites yet.</Text>}
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
