import React, { useState, useEffect } from 'react';
import { readPosts } from '../API/api';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import '../style/PostsPage.css';

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const postsData = await readPosts();
      // Trier les posts par date de création (du plus récent au plus ancien)
      const sortedPosts = postsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(sortedPosts);
      setError(null);
    } catch (err) {
      setError(err.message || "Erreur lors du chargement des posts");
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="posts-page">
      <PostForm refreshPosts={fetchPosts} />
      
      <div className="posts-list">
        {posts.map(post => (
          <PostCard 
            key={post._id} 
            post={post} 
            refreshPosts={fetchPosts}
          />
        ))}
      </div>
    </div>
  );
};

export default PostsPage;