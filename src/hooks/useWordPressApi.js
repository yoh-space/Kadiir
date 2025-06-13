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
        
        const processedPosts = res.data.map(post => ({
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
        
        allPosts = allPosts.concat(processedPosts);
        page++;
      } while (page <= totalPages);
      
      setPosts(allPosts);
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

  return {
    posts,
    categories,
    tags,
    loading,
    error,
    refresh: fetchData,
    getCategoryNames,
    getTagNames,
  };
}