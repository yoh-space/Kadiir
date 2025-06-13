import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE = 'https://kadiir.com/wp-json/wp/v2';

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
      const perPage = 25; // WordPress max per_page
      do {
        const res = await axios.get(`${API_BASE}/posts`, {
          params: { _embed: true, per_page: perPage, page },
        });
        if (page === 1) {
          // Get total pages from headers
          totalPages = parseInt(res.headers['x-wp-totalpages'] || '1', 10);
        }
        allPosts = allPosts.concat(res.data);
        page++;
      } while (page <= totalPages);
      setPosts(allPosts);
    } catch (err) {
      setError(err.message || 'Error fetching posts');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchAllPosts(),
        axios.get(`${API_BASE}/categories`).then((res) => setCategories(res.data)),
        axios.get(`${API_BASE}/tags`).then((res) => setTags(res.data)),
      ]);
    } catch (err) {
      setError(err.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  }, [fetchAllPosts]);

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
