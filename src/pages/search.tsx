import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Post from '@/components/Post';

const SearchPage = () => {
  const router = useRouter();
  const { q } = router.query;
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (q) {
      fetchSearchResults(q as string);
    }
  }, [q]);

  const fetchSearchResults = async (query: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        console.error('Error fetching search results');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
    }
    setLoading(false);
  };

  const handleAddComment = async (postId: string, content: string, author: string) => {
    // Implement comment functionality if needed
  };

  return (
    <Layout>
      <h1>Search Results for "{q}"</h1>
      {loading ? (
        <p>Loading...</p>
      ) : searchResults.length > 0 ? (
        searchResults.map((post) => (
          <Post
            key={post._id}
            {...post}
            onAddComment={handleAddComment}
          />
        ))
      ) : (
        <p>No results found for "{q}"</p>
      )}
    </Layout>
  );
};

export default SearchPage;