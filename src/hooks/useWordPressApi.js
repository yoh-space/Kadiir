import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE = 'https://kadiir.com/wp-json/wp/v2';

// Helper function to decode HTML entities
const decodeHtmlEntities = (text) => {
  if (!text) return '';
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8217;/g, "'")
    .replace(/&#[0-9]+;/g, '');
};

export default function useWordPressApi() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let allPosts = [];
      let page = 1;
      let totalPages = 1;
      const perPage = 25;
      do {
        const res = await axios.get(`${API_BASE}/posts`, {
          params: { 
            _embed: true,
            per_page: perPage,
            page,
            context: 'view'
          },
        });
        if (page === 1) {
          totalPages = parseInt(res.headers['x-wp-totalpages'] || '1', 10);
        }
        allPosts = allPosts.concat(res.data);
        page++;
      } while (page <= totalPages);
      // Only decode and set posts, do not fetch/sort by views here
      const processedPosts = allPosts.map(post => ({
        ...post,
        title: {
          rendered: decodeHtmlEntities(post.title.rendered)
        },
        excerpt: {
          rendered: decodeHtmlEntities(post.excerpt.rendered)
        },
        content: {
          rendered: decodeHtmlEntities(post.content.rendered)
        }
      }));
      setPosts(processedPosts);
    } catch (err) {
      setError(err.message || 'Error fetching posts');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  const fetchTags = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/tags`);
      setTags(res.data);
    } catch (err) {
      console.error('Error fetching tags:', err);
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      await Promise.all([
        fetchAllPosts(),
        fetchCategories(),
        fetchTags()
      ]);
    } catch (err) {
      setError(err.message || 'Error fetching data');
      console.error('Fetch error:', err);
    }
  }, [fetchAllPosts, fetchCategories, fetchTags]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getCategoryNames = (categoryIds) => {
    return categoryIds
      .map((id) => categories.find((cat) => cat.id === id)?.name)
      .filter(Boolean);
  };

  const getTagNames = (tagIds) => {
    return tagIds
      .map((id) => tags.find((tag) => tag.id === id)?.name)
      .filter(Boolean);
  };

  // --- New API Methods ---

  // Simple in-memory cache for view counts
  const viewCountCache = {};

  /**
   * Get post views (tries multiple endpoints)
   * @param {number} postId
   * @returns {Promise<number>} view count or 0
   */
  async function getPostViews(postId) {
    if (viewCountCache[postId] !== undefined) return viewCountCache[postId];
    try {
      // Try Post Views Counter plugin endpoint
      const res1 = await axios.get(`https://kadiir.com/wp-json/post-views-counter/v1/posts/${postId}`);
      if (res1.data && typeof res1.data.views === 'number') {
        viewCountCache[postId] = res1.data.views;
        return res1.data.views;
      }
    } catch (e) {}
    try {
      // Try custom field on post
      const res2 = await axios.get(`${API_BASE}/posts/${postId}`);
      if (res2.data && res2.data.views) {
        const views = parseInt(res2.data.views, 10);
        if (!isNaN(views)) {
          viewCountCache[postId] = views;
          return views;
        }
      }
    } catch (e) {}
    viewCountCache[postId] = 0;
    return 0;
  }

  /**
   * Get comments for a post
   * @param {number} postId
   * @param {number} page
   * @param {number} perPage
   * @returns {Promise<{comments: any[], hasMore: boolean}>}
   */
  async function getPostComments(postId, page = 1, perPage = 10) {
    try {
      // Fetch all comments (handle pagination if needed)
      let allComments = [];
      let currentPage = 1;
      let totalPages = 1;
      do {
        const res = await axios.get(`https://kadiir.com/wp-json/wp/v2/comments`, {
          params: { page: currentPage, per_page: 100 }, // get as many as possible per page
        });
        if (currentPage === 1) {
          totalPages = parseInt(res.headers['x-wp-totalpages'] || '1', 10);
        }
        allComments = allComments.concat(res.data);
        currentPage++;
      } while (currentPage <= totalPages);

      // Filter comments for the given postId
      const filtered = allComments.filter(c => c.post === postId);

      // Paginate filtered comments
      const start = (page - 1) * perPage;
      const end = start + perPage;
      const paginated = filtered.slice(start, end);

      return {
        comments: paginated,
        hasMore: end < filtered.length,
      };
    } catch (e) {
      return { comments: [], hasMore: false };
    }
  }
  /**
   * Get popular posts (sorted by view count)
   * @param {number} limit
   * @returns {Promise<any[]>}
   */
  async function getPopularPosts(limit = 10) {
    try {
      // Fetch all posts (could be optimized for large sites)
      let allPosts = [];
      let page = 1;
      let totalPages = 1;
      const perPage = 20;
      do {
        const res = await axios.get(`${API_BASE}/posts`, {
          params: { _embed: true, per_page: perPage, page, context: 'view' },
        });
        if (page === 1) {
          totalPages = parseInt(res.headers['x-wp-totalpages'] || '1', 10);
        }
        allPosts = allPosts.concat(res.data);
        page++;
      } while (page <= totalPages);
      // Get view counts for each post (with caching)
      const postsWithViews = await Promise.all(
        allPosts.map(async (post) => {
          const views = await getPostViews(post.id);
          return { ...post, views };
        })
      );
      // Filter posts with more than 1000 views
      const filtered = postsWithViews.filter(post => post.views > 1000);
      // Sort by views descending
      filtered.sort((a, b) => b.views - a.views);
      return filtered.slice(0, limit);
    } catch (e) {
      return [];
    }
  }

  return {
    posts,
    categories,
    tags,
    loading,
    error,
    fetchAllPosts,
    getCategoryNames,
    getTagNames,
    getPostViews,
    getPostComments,
    getPopularPosts,
  };
}