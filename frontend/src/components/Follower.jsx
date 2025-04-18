import React, { useState } from 'react';
import { followUser, unfollowUser } from "../API/api";
import "../style/Follower.css";

const Follower = ({ 
  currentUserId, 
  targetUserId, 
  initialFollowed, 
  followersCount, 
  followingCount 
}) => {
  const [isFollowed, setIsFollowed] = useState(initialFollowed);
  const [currentFollowers, setCurrentFollowers] = useState(followersCount);
  const [currentFollowing, setCurrentFollowing] = useState(followingCount);

  const handleFollowAction = async () => {
    try {
      if (isFollowed) {
        await unfollowUser(currentUserId, targetUserId);
        setCurrentFollowers(prev => prev - 1);
      } else {
        await followUser(currentUserId, targetUserId);
        setCurrentFollowers(prev => prev + 1);
      }
      setIsFollowed(!isFollowed);
    } catch (error) {
      console.error("Erreur:", error.message);
    }
  };

  return (
    <div className="follower-container-enhanced">
      <div className="stats-section-enhanced">
        <div className="stat-item-enhanced">
          <span className="stat-title-enhanced">Followers</span>
          <span className="stat-count-enhanced">{currentFollowers}</span>
        </div>
        <div className="stat-item-enhanced">
          <span className="stat-title-enhanced">Following</span>
          <span className="stat-count-enhanced">{currentFollowing}</span>
        </div>
      </div>

      <button 
        className={`follow-button-enhanced ${isFollowed ? 'following' : ''}`}
        onClick={handleFollowAction}
        aria-label={isFollowed ? "Se désabonner" : "S'abonner"}
      >
        {isFollowed ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
};

export default Follower;

