import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE = 'https://kadiir.com/wp-json/wp/v2';

export default function useWordPressApi() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [postsRes, categoriesRes, tagsRes] = await Promise.all([
        axios.get(`${API_BASE}/posts?_embed`), // fetch with images
        axios.get(`${API_BASE}/categories`),
        axios.get(`${API_BASE}/tags`),
      ]);
      setPosts(postsRes.data);
      setCategories(categoriesRes.data);
      setTags(tagsRes.data);
    } catch (err) {
      setError(err.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  }, []);

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
