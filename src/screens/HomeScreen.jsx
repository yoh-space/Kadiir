import React, { useState, useRef } from 'react';
import { 
  Text,
  View, 
  FlatList, 
  ActivityIndicator, 
  StyleSheet, 
  RefreshControl, 
  SafeAreaView, 
  Animated,
  Easing,
  Platform,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from './SettingScreen';
import useWordPressApi from '../hooks/useWordPressApi';
import HomeHeader from '../components/home/HomeHeader';
import HomeSearchBar from '../components/home/HomeSearchBar';
import HomeCategoryPills from '../components/home/HomeCategoryPills';
import HomeBreakingNews from '../components/home/HomeBreakingNews';
import HomeOnlyForYou from '../components/home/HomeOnlyForYou';
import BlogPostItem from '../components/BlogPostItem';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const {
    posts,
    loading,
    error,
    refresh,
    getCategoryNames,
    categories,
  } = useWordPressApi();
  const { isDark, theme } = useTheme();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categoryPillY, setCategoryPillY] = useState(0);
  const [isCategorySticky, setIsCategorySticky] = useState(false);
  const [searchText, setSearchText] = useState('');
  const flatListRef = useRef();
  // Animation values
  const headerScale = useRef(new Animated.Value(1)).current;
  const categoryPillAnim = useRef(new Animated.Value(0)).current;

  // Compute filtered posts based on search and category
  const filteredPosts = React.useMemo(() => {
    let filtered = posts;
    if (searchText) {
      const keyword = searchText.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.title.rendered.toLowerCase().includes(keyword) ||
          p.excerpt.rendered.toLowerCase().includes(keyword)
      );
    }
    if (selectedCategory !== 'All') {
      const cat = categories.find(c => c.name === selectedCategory);
      if (cat) {
        filtered = filtered.filter(post => post.categories.includes(cat.id));
      } else {
        // If subcategory, try to match by name
        filtered = filtered.filter(post => {
          const postCatNames = getCategoryNames(post.categories);
          return postCatNames.includes(selectedCategory);
        });
      }
    }
    return filtered;
  }, [posts, searchText, selectedCategory, categories, getCategoryNames]);

  const displayedPosts = filteredPosts;
  const breakingNews = posts.slice(0, 3);
  const onlyForYou = posts.slice(3, 5);
  const categoryTree = [
    { name: 'All', subs: [] },
    { name: 'Academics', subs: ['Agriculture', 'Custom', 'Education', 'Gada'] },
    { name: 'Folklore', subs: ['Mythology', 'Proverbs'] },
    { name: 'Health', subs: ['Disease', 'Food', 'Medicine'] },
    { name: 'Literature', subs: ['Fiction', 'History', 'Poem'] },
    { name: 'News', subs: ['Africa', 'Ethiopia', 'World'] },
    { name: 'Shop', subs: ['Books', 'Cloths', 'Food Shop'] },
    { name: 'Technology', subs: ['ICT/IT'] },
    { name: 'Entertainment', subs: [] },
  ];

  const handleScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    if (categoryPillY && y >= categoryPillY - 10) {
      setIsCategorySticky(true);
      Animated.spring(headerScale, {
        toValue: 0.9,
        useNativeDriver: true,
      }).start();
    } else {
      setIsCategorySticky(false);
      Animated.spring(headerScale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  const animateCategoryPill = (category) => {
    setSelectedCategory(category);
    categoryPillAnim.setValue(0);
    Animated.timing(categoryPillAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.elastic(1.5),
      useNativeDriver: true,
    }).start();
  };

  const renderCategoryPill = (name, isSub = false) => {
    const isActive = selectedCategory === name;
    const scale = isActive ? 
      categoryPillAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1.2, 1]
      }) : 1;
    return (
      <Animated.View style={{ transform: [{ scale }] }} key={name}>
        <TouchableOpacity
          style={[
            styles.categoryPill,
            isSub && styles.subCategoryPill,
            isActive && styles.categoryPillActive,
            isSub && isActive && styles.subCategoryPillActive
          ]}
          onPress={() => animateCategoryPill(name)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.categoryPillText,
            isSub && styles.subCategoryPillText,
            isActive && styles.categoryPillTextActive,
            isSub && isActive && styles.subCategoryPillTextActive
          ]}>
            {name}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}> 
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <HomeHeader navigation={navigation} theme={theme} isDark={isDark} />
      <HomeSearchBar searchAnim={new Animated.Value(1)} theme={theme} searchText={searchText} setSearchText={setSearchText} />
      <HomeCategoryPills 
        isSticky={isCategorySticky} 
        headerScale={headerScale} 
        theme={theme} 
        categoryTree={categoryTree} 
        renderCategoryPill={renderCategoryPill} 
        setCategoryPillY={setCategoryPillY} 
      />
      <FlatList
        ref={flatListRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <>
            <HomeBreakingNews breakingNews={breakingNews} getCategoryNames={getCategoryNames} navigation={navigation} theme={theme} styles={styles} />
            <HomeOnlyForYou onlyForYou={onlyForYou} navigation={navigation} theme={theme} styles={styles} selectedCategory={selectedCategory} />
          </>
        }
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
        refreshControl={
          <RefreshControl 
            refreshing={loading} 
            onRefresh={refresh}
            colors={['#FF3A44', '#FF9500', '#FFCC00']}
            tintColor="#FF3A44"
          />
        }
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    marginTop: StatusBar.currentHeight,
    shadowColor: '#FF3A44',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: 'transparent',
    zIndex: 100,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF3A44',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FF9500',
    shadowColor: '#FF3A44',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10,
  },
  avatarImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    tintColor: '#FFF',
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  greeting: {
    fontSize: 12,
    color: '#008000',
    fontWeight: '800',
    letterSpacing: 1,
  },
  username: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(255,58,68,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  headerIconBtn: {
    marginLeft: 12,
    backgroundColor: 'rgba(255,58,68,0.2)',
    borderRadius: 20,
    padding: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3A44',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
    marginHorizontal: 20,
    marginBottom: 15,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,58,68,0.3)',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 0,
    backgroundColor: 'transparent',
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAll: {
    color: '#FF3A44',
    fontWeight: '800',
    fontSize: 14,
    marginRight: 5,
    letterSpacing: 0.5,
  },
  breakingNewsContainer: {
    marginBottom: 20,
  },
  breakingNewsContent: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  breakingCard: {
    width: 280,
    height: 180,
    borderRadius: 20,
    marginRight: 15,
    overflow: 'hidden',
    backgroundColor: '#222',
    position: 'relative',
    shadowColor: '#FF3A44',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10,
  },
  breakingImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  breakingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  breakingContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  breakingTitle: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 18,
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  breakingPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#FF3A44',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  breakingPillText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  categoryPillsRow: {
    backgroundColor: 'transparent',
    marginBottom: 20,
  },
  categoryPillsContent: {
    paddingHorizontal: 15,
  },
  categoryPill: {
    backgroundColor: 'rgba(255,58,68,0.2)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,58,68,0.3)',
  },
  subCategoryPill: {
    backgroundColor: 'rgba(0,255,200,0.2)',
    borderColor: 'rgba(0,255,200,0.3)',
    marginLeft: -5,
  },
  categoryPillActive: {
    backgroundColor: '#FF3A44',
    borderColor: '#FF3A44',
  },
  subCategoryPillActive: {
    backgroundColor: '#00FFC8',
    borderColor: '#00FFC8',
  },
  categoryPillText: {
    color: '#FF3A44',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  subCategoryPillText: {
    color: '#00FFC8',
  },
  categoryPillTextActive: {
    color: '#FFF',
    fontWeight: '900',
  },
  subCategoryPillTextActive: {
    color: '#000',
  },
  stickyCategoryPills: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,58,68,0.2)',
  },
  forYouContainer: {
    paddingHorizontal: 20,
  },
  forYouCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,58,68,0.2)',
    shadowColor: '#FF3A44',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  forYouImage: {
    width: 80,
    height: 80,
    borderRadius: 15,
    backgroundColor: '#333',
  },
  forYouTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  forYouCategory: {
    color: '#00FFC8',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  forYouTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFF',
    marginBottom: 5,
  },
  forYouMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  forYouMeta: {
    color: '#FF9500',
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 5,
    letterSpacing: 0.5,
  },
  flatListContent: {
    paddingBottom: 30,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  empty: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    color: '#FF3A44',
  },
  blogPostItem: {
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,58,68,0.2)',
  },
});