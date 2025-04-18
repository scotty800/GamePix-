import React, { useState, useEffect } from 'react';
import { followUser, unfollowUser } from "../API/api";
import "../style/Follower.css";

const Follower = ({ 
  currentUserId, 
  targetUserId, 
  initialFollowed, 
  initialFollowersCount, 
  initialFollowingCount,
  onFollowChange,
  isOwnProfile
}) => {
  const [isFollowed, setIsFollowed] = useState(initialFollowed);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);
  const [followingCount, setFollowingCount] = useState(initialFollowingCount);

  // Synchronisation avec les props parentes
  useEffect(() => {
    setIsFollowed(initialFollowed);
    setFollowersCount(initialFollowersCount);
    setFollowingCount(initialFollowingCount);
  }, [initialFollowed, initialFollowersCount, initialFollowingCount]);

  const handleFollowAction = async () => {
    try {
      // Optimistic UI update
      const newFollowedState = !isFollowed;
      setIsFollowed(newFollowedState);
      
      if (newFollowedState) {
        setFollowersCount(prev => prev + 1);
        if (isOwnProfile) {
          setFollowingCount(prev => prev + 1);
        }
      } else {
        setFollowersCount(prev => prev - 1);
        if (isOwnProfile) {
          setFollowingCount(prev => prev - 1);
        }
      }

      // Appel API
      if (newFollowedState) {
        await followUser(currentUserId, targetUserId);
      } else {
        await unfollowUser(currentUserId, targetUserId);
      }

      // Rafraîchissement des données parentes
      if (onFollowChange) {
        await onFollowChange();
      }
    } catch (error) {
      // Rollback en cas d'erreur
      setIsFollowed(!isFollowed);
      if (isFollowed) {
        setFollowersCount(prev => prev + 1);
        if (isOwnProfile) {
          setFollowingCount(prev => prev + 1);
        }
      } else {
        setFollowersCount(prev => prev - 1);
        if (isOwnProfile) {
          setFollowingCount(prev => prev - 1);
        }
      }
      console.error("Erreur:", error.message);
    }
  };

  return (
    <div className="follower-container-enhanced">
      <div className="stats-section-enhanced">
        <div className="stat-item-enhanced">
          <span className="stat-title-enhanced">Followers</span>
          <span className="stat-count-enhanced">{followersCount}</span>
        </div>
        <div className="stat-item-enhanced">
          <span className="stat-title-enhanced">Following</span>
          <span className="stat-count-enhanced">{followingCount}</span>
        </div>
      </div>

      {!isOwnProfile && (
        <button 
          className={`follow-button-enhanced ${isFollowed ? 'following' : ''}`}
          onClick={handleFollowAction}
          aria-label={isFollowed ? "Se désabonner" : "S'abonner"}
        >
          {isFollowed ? "Unfollow" : "Follow"}
        </button>
      )}
    </div>
  );
};

export default Follower;