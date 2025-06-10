import React, { useState } from 'react';
import { View, Text, StyleSheet, RefreshControl, Platform, TouchableOpacity, Animated, FlatList as RNFlatList } from 'react-native';
import { useFavorites } from '../components/FavoritesContext';
import BlogPostItem from '../components/BlogPostItem';
import { useTheme } from './SettingScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const AnimatedFlatList = Animated.createAnimatedComponent(RNFlatList);

export default function FavoritesScreen({ navigation: propNavigation }) {
  const navigation = propNavigation || useNavigation();
  const { favoritePosts, favoriteIds, toggleFavorite } = useFavorites();
  const { isDark, theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = new Animated.Value(0);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, -20],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }, { marginTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0 }]}>
      <Animated.View style={[
        styles.headerContainer,
        {
          backgroundColor: theme.background,
          opacity: headerOpacity,
          transform: [{ translateY: headerTranslateY }]
        }
      ]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={28} color={theme.primary || '#1db954'} />
        </TouchableOpacity>
        <Animated.Text style={[styles.header, { color: theme.text }]}>⭐ Your Favorites</Animated.Text>
      </Animated.View>

      <AnimatedFlatList
        data={favoritePosts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[
            styles.card, 
            { 
              backgroundColor: isDark ? '#2a2a2a' : '#fff',
              borderColor: isDark ? '#444' : '#eee'
            }
          ]}>
            <BlogPostItem
              post={item}
              categoryNames={item.categories ? item.categories.map(String) : []}
              onPress={() => navigation.navigate('Post', { post: item })}
              isFavorite={favoriteIds.includes(item.id)}
              onToggleFavorite={() => toggleFavorite(item)}
            />
          </View>
        )}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.primary || '#1db954']}
            tintColor={theme.primary || '#1db954'}
            progressBackgroundColor={theme.background}
          />
        }
        contentContainerStyle={favoritePosts.length === 0 ? styles.emptyContainer : styles.content}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons 
              name="heart-outline" 
              size={64} 
              color={isDark ? '#555' : '#ccc'} 
              style={styles.emptyIcon}
            />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              No favorites yet
            </Text>
            <Text style={[styles.emptyText, { color: isDark ? '#aaa' : '#888' }]}>
              Tap the heart icon on posts to save them here
            </Text>
          </View>
        }
        ListHeaderComponent={<View style={styles.listHeader} />}
        ListFooterComponent={<View style={styles.listFooter} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 16,
    padding: 8,
    borderRadius: 20,
    zIndex: 11,
  },
  header: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginLeft: 24, // compensate for back button
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  content: {
    paddingTop: 80,
    paddingBottom: 32,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.8,
  },
  listHeader: {
    height: 80,
  },
  listFooter: {
    height: 32,
  },
});