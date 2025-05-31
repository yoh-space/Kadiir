import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useFavorites } from '../components/FavoritesContext';
import BlogPostItem from '../components/BlogPostItem';
import { useTheme } from './SettingScreen';

export default function FavoritesScreen({ navigation }) {
  const { favoritePosts, favoriteIds, toggleFavorite } = useFavorites();
  const { isDark, theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>Favorites</Text>
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
        ListEmptyComponent={<Text style={[styles.empty, { color: isDark ? '#aaa' : '#888' }]}>No favorites yet.</Text>}
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
    fontSize: 28,
    fontWeight: 'bold',
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
