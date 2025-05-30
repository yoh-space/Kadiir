import { View, Text, ScrollView, StyleSheet, Image, SafeAreaView } from 'react-native';

export default function PostScreen({ route }) {
  const { post } = route.params;

  // Get featured image if available
  let imageUrl = null;
  if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]?.source_url) {
    imageUrl = post._embedded['wp:featuredmedia'][0].source_url;
  }

  // Render full content (prefer content.rendered, fallback to excerpt)
  const content = post.content?.rendered || post.excerpt?.rendered || '';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {imageUrl && (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.image} 
              resizeMode="cover"
            />
            <View style={styles.imageOverlay} />
          </View>
        )}
        
        <View style={styles.textContent}>
          <Text style={styles.title}>{post.title.rendered}</Text>
          
          <View style={styles.metaContainer}>
            <Text style={styles.date}>{new Date(post.date).toLocaleDateString()}</Text>
            <View style={styles.dotSeparator} />
            <Text style={styles.readTime}>5 min read</Text>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.body}>
            {content.replace(/<p>|<\/p>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&[a-z]+;/gi, '').replace(/\n+/g, '\n').trim()}
          </Text>
        </View>

        {/* Comment Section */}
        <View style={styles.commentSection}>
          <Text style={styles.commentHeader}>Comments</Text>
          
          <View style={styles.commentBox}>
            <Text style={styles.commentAuthor}>Jane Doe</Text>
            <Text style={styles.commentMeta}>2 days ago</Text>
            <Text style={styles.commentText}>Great post! Really enjoyed the insights.</Text>
          </View>
          
          <View style={styles.commentBox}>
            <Text style={styles.commentAuthor}>John Smith</Text>
            <Text style={styles.commentMeta}>1 week ago</Text>
            <Text style={styles.commentText}>Thanks for sharing this valuable information.</Text>
          </View>
          
          <View style={styles.addCommentBox}>
            <Text style={styles.addCommentText}>Write a comment...</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  content: {
    paddingBottom: 5,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 250,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  textContent: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 15,
    lineHeight: 36,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'System',
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#999',
    marginHorizontal: 8,
  },
  readTime: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 2,
  },  body: {
    fontSize: 17,
    color: '#333',
    lineHeight: 28,
    letterSpacing: 0.2,
    marginBottom: 0,
    marginTop: 0,
    padding: 0,
  },
  commentSection: {
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
    backgroundColor: '#fff',
    paddingBottom: 10,
  },
  commentHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  commentBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  commentAuthor: {
    fontWeight: '600',
    color: '#1a1a1a',
    fontSize: 16,
    marginBottom: 4,
  },
  commentMeta: {
    color: '#888',
    fontSize: 13,
    marginBottom: 8,
  },
  commentText: {
    color: '#444',
    fontSize: 15,
    lineHeight: 22,
  },
  addCommentBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  addCommentText: {
    color: '#888',
    fontSize: 16,
  },
});