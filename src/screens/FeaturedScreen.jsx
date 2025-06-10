import React, { useState, useEffect } from 'react';
import {TouchableOpacity,Animated, View, FlatList, Text, StyleSheet, RefreshControl, Platform, StatusBar as RNStatusBar } from 'react-native';
import BlogPostItem from '../components/BlogPostItem';
import useWordPressApi from '../hooks/useWordPressApi';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from './SettingScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';

export default function FeaturedScreen({navigation: propNavigation}) {
  const navigation = propNavigation || useNavigation();
  const { posts, loading, getCategoryNames } = useWordPressApi();
  const { theme } = useTheme();
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
    const scrollY = new Animated.Value(0);
  

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


  useEffect(() => {
    const featured = posts.filter(
      post =>
        post.tags &&
        post.tags.length > 0 &&
        post.tags.some(tagId => post.id === posts[0]?.id || post.id === posts[1]?.id)
    );
    setFeaturedPosts(featured.length ? featured : posts.slice(0, 3));
  }, [posts]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background, marginTop: RNStatusBar.currentHeight || 0 }]}>
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
        <Animated.Text style={[styles.header, { color: theme.text }]}> Featured Posts</Animated.Text>
      </Animated.View><FlatList
        data={featuredPosts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <BlogPostItem
              post={item}
              categoryNames={getCategoryNames(item.categories)}
              onPress={() => navigation.navigate('Post', { post: item })}
            />
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0af']}
            tintColor={theme.text}
          />
        }
        contentContainerStyle={styles.content}
        ListEmptyComponent={<Text style={styles.empty}>No featured posts yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    marginTop: 8,
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 8,
    elevation: 3, // Android
    shadowColor: '#000', // iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  empty: {
    alignSelf: 'center',
    color: '#888',
    marginTop: 40,
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 16,
    padding: 8,
    borderRadius: 20,
    zIndex: 11,
  },
});
