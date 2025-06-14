import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, SafeAreaView, StatusBar, useWindowDimensions, ActivityIndicator, TouchableOpacity, Image as RNImage } from 'react-native';
import RelatedPost from './RelatedPost';
import { useTheme } from './SettingScreen';
import RenderHtml from 'react-native-render-html';
import useWordPressApi from '../hooks/useWordPressApi';
import { decode } from 'he';

export default function PostScreen({ route }) {
  const { post } = route.params;
  const { isDark, theme } = useTheme();
  const { width } = useWindowDimensions();
  const { getPostComments } = useWordPressApi();

  // Get featured image if available
  let imageUrl = null;
  if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]?.source_url) {
    imageUrl = post._embedded['wp:featuredmedia'][0].source_url;
  }

  // Render full content (prefer content.rendered, fallback to excerpt)
  const content = post.content?.rendered || post.excerpt?.rendered || '';

  // --- Comments State ---
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState(null);
  const [commentsPage, setCommentsPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(false);
  const COMMENTS_PER_PAGE = 10;

  const fetchComments = useCallback(async (page = 1, append = false) => {
    setCommentsLoading(true);
    setCommentsError(null);
    try {
      const { comments: newComments, hasMore } = await getPostComments(post.id, page, COMMENTS_PER_PAGE);
      console.log('Fetched comments for post', '1671', newComments);
      setComments(prev => append ? [...prev, ...newComments] : newComments);
      setHasMoreComments(hasMore);
      setCommentsPage(page);
    } catch (e) {
      setCommentsError('Failed to load comments.');
    } finally {
      setCommentsLoading(false);
    }
  }, [post.id, getPostComments]);

  useEffect(() => {
    fetchComments(1, false);
  }, [fetchComments]);

  // Theme styles
  const themeStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background || (isDark ? '#181A20' : '#F7F7F7'),
    },
    textContent: {
      backgroundColor: theme.card || (isDark ? '#23262F' : '#FFF'),
    },
    title: {
      color: theme.text || (isDark ? '#FFF' : '#181A20'),
    },
    metaText: {
      color: theme.secondaryText || (isDark ? '#A1A1AA' : '#6B7280'),
    },
    dotSeparator: {
      backgroundColor: theme.secondaryText || (isDark ? '#A1A1AA' : '#6B7280'),
    },
    divider: {
      backgroundColor: theme.divider || (isDark ? '#23262F' : '#E5E7EB'),
    },
    body: {
      color: theme.text || (isDark ? '#FFF' : '#181A20'),
    },
    commentSection: {
      backgroundColor: theme.card || (isDark ? '#23262F' : '#FFF'),
      borderTopColor: theme.divider || (isDark ? '#23262F' : '#E5E7EB'),
    },
    commentHeader: {
      color: theme.text || (isDark ? '#FFF' : '#181A20'),
    },
    commentBox: {
      backgroundColor: theme.surface || (isDark ? '#23262F' : '#F3F4F6'),
    },
    commentAuthor: {
      color: theme.text || (isDark ? '#FFF' : '#181A20'),
    },
    commentMeta: {
      color: theme.secondaryText || (isDark ? '#A1A1AA' : '#6B7280'),
    },
    commentText: {
      color: theme.secondaryText || (isDark ? '#A1A1AA' : '#6B7280'),
    },
    addCommentBox: {
      backgroundColor: theme.surface || (isDark ? '#23262F' : '#F3F4F6'),
      borderColor: theme.divider || (isDark ? '#23262F' : '#E5E7EB'),
    },
    addCommentText: {
      color: theme.secondaryText || (isDark ? '#A1A1AA' : '#6B7280'),
    },
  });

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#181a20' : 'whitesmoke' }}>
      <StatusBar backgroundColor={isDark ? '#181a20' : 'whitesmoke'} barStyle={isDark ? 'light-content' : 'dark-content'} animated={true} />
      <SafeAreaView style={themeStyles.container}>
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
              <View style={[styles.imageOverlay, { 
                backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)' 
              }]} />
            </View>
          )}
          <View style={[styles.textContent, themeStyles.textContent]}>
            <Text style={[styles.title, themeStyles.title]}>{post.title.rendered}</Text>
            <View style={styles.metaContainer}>
              <Text style={[styles.date, themeStyles.metaText]}>{new Date(post.date).toLocaleDateString()}</Text>
              <View style={[styles.dotSeparator, themeStyles.dotSeparator]} />
              <Text style={[styles.readTime, themeStyles.metaText]}>5 min read</Text>
            </View>
            <View style={[styles.divider, themeStyles.divider]} />
            <RenderHtml
              contentWidth={width}
              source={{ html: content }}
              baseStyle={{ color: themeStyles.body.color, fontSize: 17, lineHeight: 28 }}
              ignoredDomTags={['form']}
            />
          </View>

          {/* Related Posts Section */}
          <RelatedPost post={post} onPressPost={item => {
            if (item && item.id) {
              // Navigation logic here
            }
          }} />

          {/* Comment Section */}
          <View style={[styles.commentSection, themeStyles.commentSection]}>
            <Text style={[styles.commentHeader, themeStyles.commentHeader]}>Comments</Text>
            {commentsLoading && comments.length === 0 && (
              <ActivityIndicator size="small" color="#1db954" style={{ marginVertical: 16 }} />
            )}
            {commentsError && (
              <Text style={{ color: '#e74c3c', marginBottom: 12 }}>{commentsError}</Text>
            )}
            {!commentsLoading && comments.length === 0 && !commentsError && (
              <Text style={{ color: '#888', marginBottom: 12 }}>No comments yet.</Text>
            )}
            {comments.map(comment => (
              <View key={comment.id} style={[styles.commentBox, themeStyles.commentBox]}> 
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                  {comment.author_avatar_urls?.['48'] ? (
                    <RNImage source={{ uri: comment.author_avatar_urls['48'] }} style={{ width: 32, height: 32, borderRadius: 16, marginRight: 10 }} />
                  ) : null}
                  <View>
                    <Text style={[styles.commentAuthor, themeStyles.commentAuthor]}>{comment.author_name}</Text>
                    <Text style={[styles.commentMeta, themeStyles.commentMeta]}>{new Date(comment.date).toLocaleDateString()}</Text>
                  </View>
                </View>
                <Text style={[styles.commentText, themeStyles.commentText]}>{decode(comment.content?.rendered?.replace(/<[^>]+>/g, '') || '')}</Text>
              </View>
            ))}
            {hasMoreComments && !commentsLoading && (
              <TouchableOpacity
                style={{ alignSelf: 'center', marginTop: 8, backgroundColor: '#1db954', borderRadius: 6, paddingHorizontal: 18, paddingVertical: 8 }}
                onPress={() => fetchComments(commentsPage + 1, true)}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Load more comments</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// Base styles (layout-only, no colors)
const styles = StyleSheet.create({
  content: {
    paddingBottom: 30,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 0,
  },
  image: {
    width: '100%',
    height: 250,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  textContent: {
    padding: 20,
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 12,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    lineHeight: 36,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  date: {
    fontSize: 14,
    fontFamily: 'System',
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 8,
  },
  readTime: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginVertical: 20,
  },
  body: {
    fontSize: 17,
    lineHeight: 28,
    letterSpacing: 0.2,
  },
  commentSection: {
    marginTop: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    paddingBottom: 20,
  },
  commentHeader: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  commentBox: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  commentAuthor: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  commentMeta: {
    fontSize: 13,
    marginBottom: 8,
  },
  commentText: {
    fontSize: 15,
    lineHeight: 22,
  },
  addCommentBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  addCommentText: {
    fontSize: 16,
  },
});