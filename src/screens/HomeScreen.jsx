import React, { useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet, RefreshControl, SafeAreaView, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useTheme } from './SettingScreen';
import useWordPressApi from '../hooks/useWordPressApi';
import BlogPostItem from '../components/BlogPostItem';
import { Ionicons } from '@expo/vector-icons';
import Icons from 'react-native-vector-icons';

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

  const [filteredPosts, setFilteredPosts] = React.useState(posts);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [categoryPillY, setCategoryPillY] = useState(0);
  const [isCategorySticky, setIsCategorySticky] = useState(false);
  const flatListRef = React.useRef();

  React.useEffect(() => {
    if (!showSearch || !searchText) {
      setFilteredPosts(posts);
    } else {
      const keyword = searchText.toLowerCase();
      setFilteredPosts(
        posts.filter(
          p =>
            p.title.rendered.toLowerCase().includes(keyword) ||
            p.excerpt.rendered.toLowerCase().includes(keyword)
        )
      );
    }
  }, [searchText, posts, showSearch]);

  // Filter posts by selected category and search
  const displayedPosts = selectedCategory === 'All'
    ? filteredPosts
    : filteredPosts.filter(post => {
        const cat = categories.find(c => c.name === selectedCategory);
        return cat && post.categories.includes(cat.id);
      });

  // Featured (Breaking News) - first 3 posts
  const breakingNews = posts.slice(0, 3);

  // Only For You - next 2 posts
  const onlyForYou = posts.slice(3, 5);

  // Category pills
  const categoryNames = [
    'All',
    'Folklore',
    'Academics',
    'Entertainment',
    'Health',
    'Literature',
    'Shop',
    'Technology',
  ];

  // Handler for FlatList scroll
  const handleScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    if (categoryPillY && y >= categoryPillY - 10) {
      setIsCategorySticky(true);
    } else {
      setIsCategorySticky(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>         
      {/* Header */}
      <View style={[styles.headerRow, {marginTop: 15}]}>
        <TouchableOpacity size={28} style={{marginRight: 10}} color="#fff" onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={28} color="darkgreen"/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.avatarCircle} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person" size={28} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.greeting}>Good Morning,</Text>
          <Text style={styles.username}>Oh Haewon</Text>
        </View>
        <TouchableOpacity style={styles.headerIconBtn} onPress={() => setShowSearch(v => !v)}>
          <Ionicons name={showSearch ? 'close' : 'search'} size={22} color="#222" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerIconBtn}>
          <Ionicons name="notifications-outline" size={22} color="#222" />
        </TouchableOpacity>
      </View>

      {showSearch && (
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search articles..."
            placeholderTextColor="#bbb"
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
            clearButtonMode="while-editing"
          />
        </View>
      )}

      {/* Sticky Category Pills */}
      {isCategorySticky && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[styles.categoryPillsRow, styles.stickyCategoryPills]}
        >
          {categoryNames.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryPill, selectedCategory === cat && styles.categoryPillActive]}
              onPress={() => setSelectedCategory(cat)}
              activeOpacity={0.8}
            >
              <Text style={[styles.categoryPillText, selectedCategory === cat && styles.categoryPillTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <FlatList
        ref={flatListRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <>
            {/* Breaking News */}
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Breaking News</Text>
              <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
              {breakingNews.map((item, idx) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.breakingCard, idx === 0 && { marginLeft: 16 }]}
                  onPress={() => navigation.navigate('Post', { post: item })}
                  activeOpacity={0.85}
                >
                  {item._embedded && item._embedded['wp:featuredmedia'] && item._embedded['wp:featuredmedia'][0]?.source_url && (
                    <Image source={{ uri: item._embedded['wp:featuredmedia'][0].source_url }} style={styles.breakingImage} />
                  )}
                  <View style={styles.breakingOverlay} />
                  <View style={styles.breakingContent}>
                    <Text style={styles.breakingTitle} numberOfLines={2}>{item.title.rendered}</Text>
                    <View style={styles.breakingPill}>
                      <Text style={styles.breakingPillText}>
                        {getCategoryNames(item.categories)[0]}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Category Pills (non-sticky, measure position) */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryPillsRow}
              onLayout={e => setCategoryPillY(e.nativeEvent.layout.y)}
            >
              {categoryNames.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryPill, selectedCategory === cat && styles.categoryPillActive]}
                  onPress={() => setSelectedCategory(cat)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.categoryPillText, selectedCategory === cat && styles.categoryPillTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Only For You */}
            {selectedCategory === 'All' && (
              <>
                <View style={styles.sectionRow}>
                  <Text style={styles.sectionTitle}>Only For You</Text>
                  <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
                </View>
                <View style={{ paddingHorizontal: 16 }}>
                  {onlyForYou.map(item => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.forYouCard}
                      onPress={() => navigation.navigate('Post', { post: item })}
                      activeOpacity={0.85}
                    >
                      {item._embedded && item._embedded['wp:featuredmedia'] && item._embedded['wp:featuredmedia'][0]?.source_url && (
                        <Image source={{ uri: item._embedded['wp:featuredmedia'][0].source_url }} style={styles.forYouImage} />
                      )}
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.forYouCategory}>CeleBuzz</Text>
                        <Text style={styles.forYouTitle} numberOfLines={2}>{item.title.rendered}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                          <Ionicons name="person-circle" size={18} color="#bbb" />
                          <Text style={styles.forYouMeta}>John Doe - 3 hours ago</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </>
        }
        data={displayedPosts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <BlogPostItem
            post={item}
            categoryNames={getCategoryNames(item.categories)}
            onPress={() => navigation.navigate('Post', { post: item })}
          />
        )
        }
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={!loading && <Text style={[styles.empty, { color: isDark ? '#aaa' : '#888' }]}>No posts found.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 24,
    marginBottom: 10,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#bbb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 13,
    color: '#888',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  headerIconBtn: {
    marginLeft: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    padding: 8,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 18,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#181a20',
  },
  seeAll: {
    color: 'darkgreen',
    fontWeight: '500',
    fontSize: 14,
  },
  breakingCard: {
    width: 270,
    height: 160,
    borderRadius: 18,
    marginRight: 16,
    overflow: 'hidden',
    backgroundColor: '#eee',
    position: 'relative',
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
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  breakingContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  breakingSource: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 2,
  },
  breakingTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  breakingPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginTop: 2,
  },
  breakingPillText: {
    color: 'darkgreen',
    fontWeight: 'bold',
    fontSize: 12,
  },
  categoryPillsRow: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  categoryPill: {
    backgroundColor: '#f2f2f2',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 7,
    marginRight: 10,
  },
  categoryPillActive: {
    backgroundColor: 'darkgreen',
  },
  categoryPillText: {
    color: '#888',
    fontWeight: '500',
    fontSize: 15,
  },
  categoryPillTextActive: {
    color: '#fff',
  },
  forYouCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    padding: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  forYouImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  forYouCategory: {
    color: '#888',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
  },
  forYouTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  forYouMeta: {
    color: '#888',
    fontSize: 12,
    marginLeft: 4,
  },
  error: {
    color: 'red',
    alignSelf: 'center',
    marginVertical: 16,
    fontSize: 16,
  },
  empty: {
    alignSelf: 'center',
    color: '#888',
    marginTop: 40,
    fontSize: 16,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    paddingVertical: 4,
    backgroundColor: 'transparent',
  },
  stickyCategoryPills: {
    position: 'absolute',
    top: 84, // adjust based on header height
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#f6f8fa',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
});
