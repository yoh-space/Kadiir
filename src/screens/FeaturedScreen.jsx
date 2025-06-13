import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  Animated,
  View,
  FlatList,
  Text,
  StyleSheet,
  RefreshControl,
  Platform,
  StatusBar as RNStatusBar,
  Dimensions
} from 'react-native';
import BlogPostItem from '../components/BlogPostItem';
import useWordPressApi from '../hooks/useWordPressApi';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from './SettingScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function FeaturedScreen({ navigation: propNavigation }) {
  const navigation = propNavigation || useNavigation();
  const { posts, loading, getCategoryNames } = useWordPressApi();
  const { theme } = useTheme();
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = new Animated.Value(0);
  const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);


  // Enhanced header animation
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0.95],
    extrapolate: 'clamp',
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, -10],
    extrapolate: 'clamp',
  });

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [100, 70],
    extrapolate: 'clamp',
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0.9],
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}> 
      {/* Header with improved styling */}
      <Animated.View style={[
        styles.headerContainer,
        {
          backgroundColor: theme.headerBackground || theme.background,
          opacity: headerOpacity,
          transform: [{ translateY: headerTranslateY }],
          borderBottomColor: theme.borderColor || 'rgba(0,0,0,0.08)',
        }
      ]}>
        <LinearGradient
          colors={['rgba(255,255,255,0.8)', 'transparent']}
          style={styles.headerGradient}
          pointerEvents="none"
        />
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backButton, { backgroundColor: theme.cardBackground || 'rgba(255,255,255,0.9)' }]}
          activeOpacity={0.6}
        >
          <Ionicons name="arrow-back" size={24} color={theme.primary || '#1db954'} />
        </TouchableOpacity>
        <Animated.Text style={[
          styles.header,
          {
            color: theme.text,
            transform: [{ scale: titleScale }]
          }
        ]}>
          Featured Posts
        </Animated.Text>
      </Animated.View>

      {/* Loading indicator */}
      {loading || refreshing ? (
        <View style={styles.loadingContainer}>
          <Ionicons name="star-outline" size={48} color={theme.primary || '#1db954'} style={{ marginBottom: 12 }} />
          <Text style={[styles.loadingText, { color: theme.text }]}>Loading featured posts...</Text>
        </View>
      ) : (
        <AnimatedFlatList
          data={featuredPosts}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item, index }) => (
            <Animated.View style={[
              styles.card,
              {
                backgroundColor: theme.cardBackground || '#fff',
                opacity: scrollY.interpolate({
                  inputRange: [-1, 0, 100 * index, 100 * (index + 3)],
                  outputRange: [1, 1, 1, 0.7]
                }),
                transform: [
                  {
                    scale: scrollY.interpolate({
                      inputRange: [-1, 0, 100 * index, 100 * (index + 3)],
                      outputRange: [1, 1, 1, 0.98]
                    })
                  }
                ]
              }
            ]}>
              <BlogPostItem
                post={item}
                categoryNames={getCategoryNames(item.categories)}
                onPress={() => navigation.navigate('Post', { post: item })}
              />
            </Animated.View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.primary || '#1db954']}
              tintColor={theme.primary || '#1db954'}
              progressBackgroundColor={theme.background}
            />
          }
          contentContainerStyle={[
            styles.content,
            { paddingTop: 110 }
          ]}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="newspaper-outline" size={60} color={theme.textSecondary || '#aaa'} />
              <Text style={[styles.empty, { color: theme.textSecondary || '#888' }]}>No featured posts yet</Text>
            </View>
          }
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0,
    flex: 1,
  },
  headerContainer: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    minHeight: 70, // Use minHeight instead of height for static style
    width: '100%',
    zIndex: 10,
  },
  headerGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '150%',
  },
  header: {
    marginTop: Platform.OS === 'android' ? 15 : 0,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    marginHorizontal: 16,
  },
  content: {
    paddingBottom: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  empty: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '500',
  },
  backButton: {
    position: 'absolute',
    left: 24,
    bottom: 16,
    padding: 8,
    borderRadius: 12,
    zIndex: 11,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 120,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
    letterSpacing: 0.2,
  },
});