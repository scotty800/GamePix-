import React, { useState } from 'react';
import { likePost, unlikePost } from '../API/api';
import '../style/LikeSystem.css';

const LikeSystem = ({ postId, initialLikes, userId, refreshPosts }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(likes.includes(userId));

  const handleLike = async () => {
    try {
      if (isLiked) {
        await unlikePost(postId, userId);
        setLikes(likes.filter(id => id !== userId));
      } else {
        await likePost(postId, userId);
        setLikes([...likes, userId]);
      }
      setIsLiked(!isLiked);
      refreshPosts(); // Rafraîchir les posts après like/unlike
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <div className="like-system">
      <button 
        onClick={handleLike}
        className={`like-button ${isLiked ? 'liked' : ''}`}
      >
        {isLiked ? '❤️' : '🤍'} {likes.length}
      </button>
    </div>
  );
};

export default LikeSystem;