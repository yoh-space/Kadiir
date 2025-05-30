import React from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet, RefreshControl, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useWordPressApi from '../hooks/useWordPressApi';
import BlogPostItem from '../components/BlogPostItem';

export default function HomeScreen({ navigation }) {
  const {
    posts,
    loading,
    error,
    refresh,
    getCategoryNames,
  } = useWordPressApi();

  const [search, setSearch] = React.useState('');
  const [searching, setSearching] = React.useState(false);
  const [filteredPosts, setFilteredPosts] = React.useState(posts);

  React.useEffect(() => {
    if (!search) {
      setFilteredPosts(posts);
      setSearching(false);
    }
  }, [search, posts]);

  const handleSearch = () => {
    if (!search) {
      setFilteredPosts(posts);
      setSearching(false);
      return;
    }
    setSearching(true);
    const keyword = search.toLowerCase();
    setFilteredPosts(
      posts.filter(
        p =>
          p.title.rendered.toLowerCase().includes(keyword) ||
          p.excerpt.rendered.toLowerCase().includes(keyword)
      )
    );
  };

  const renderItem = ({ item }) => (
    <BlogPostItem
      post={item}
      categoryNames={getCategoryNames(item.categories)}
      onPress={() => navigation.navigate('Post', { post: item })}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Keyword"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchIcon}>
          <Ionicons name="search" size={22} color="#4a90e2" />
        </TouchableOpacity>
      </View>
      {loading && <ActivityIndicator size="large" color="#4a90e2" style={{ marginTop: 40 }} />}
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={filteredPosts}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={!loading && <Text style={styles.empty}>No posts found.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 17,
    color: '#222',
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  searchIcon: {
    paddingLeft: 8,
    paddingRight: 2,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
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
});
