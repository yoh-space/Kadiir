import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [favoritePosts, setFavoritePosts] = useState([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);

  // Load favorites, favorite posts, and bookmarks from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      const ids = await AsyncStorage.getItem('favorites');
      if (ids) setFavoriteIds(JSON.parse(ids));
      const posts = await AsyncStorage.getItem('favoritePosts');
      if (posts) setFavoritePosts(JSON.parse(posts));
      const bookmarks = await AsyncStorage.getItem('bookmarkedPosts');
      if (bookmarks) setBookmarkedPosts(JSON.parse(bookmarks));
    })();
  }, []);

  // Save favoriteIds, favoritePosts, and bookmarkedPosts to AsyncStorage whenever they change
  useEffect(() => {
    AsyncStorage.setItem('favorites', JSON.stringify(favoriteIds));
    AsyncStorage.setItem('favoritePosts', JSON.stringify(favoritePosts));
    AsyncStorage.setItem('bookmarkedPosts', JSON.stringify(bookmarkedPosts));
  }, [favoriteIds, favoritePosts, bookmarkedPosts]);

  // Add or remove favorite, and cache the post data
  const toggleFavorite = async (post) => {
    let newFavorites, newFavoritePosts;
    if (favoriteIds.includes(post.id)) {
      newFavorites = favoriteIds.filter(id => id !== post.id);
      newFavoritePosts = favoritePosts.filter(p => p.id !== post.id);
    } else {
      newFavorites = [...favoriteIds, post.id];
      // Only cache minimal post data for offline
      newFavoritePosts = [...favoritePosts.filter(p => p.id !== post.id), post];
    }
    setFavoriteIds(newFavorites);
    setFavoritePosts(newFavoritePosts);
    await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    await AsyncStorage.setItem('favoritePosts', JSON.stringify(newFavoritePosts));
  };

  // Add or remove bookmark
  const toggleBookmark = async (post) => {
    let newBookmarkedPosts;
    if (bookmarkedPosts.some(p => p.id === post.id)) {
      newBookmarkedPosts = bookmarkedPosts.filter(p => p.id !== post.id);
    } else {
      newBookmarkedPosts = [...bookmarkedPosts, post];
    }
    setBookmarkedPosts(newBookmarkedPosts);
    await AsyncStorage.setItem('bookmarkedPosts', JSON.stringify(newBookmarkedPosts));
  };

  // Ensure favoritePosts is always in sync with favoriteIds (remove stale posts)
  useEffect(() => {
    if (favoritePosts.length > 0) {
      const filtered = favoritePosts.filter(p => favoriteIds.includes(p.id));
      if (filtered.length !== favoritePosts.length) {
        setFavoritePosts(filtered);
        AsyncStorage.setItem('favoritePosts', JSON.stringify(filtered));
      }
    }
  }, [favoriteIds]);

  return (
    <FavoritesContext.Provider value={{ favoriteIds, favoritePosts, toggleFavorite, bookmarkedPosts, toggleBookmark }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
