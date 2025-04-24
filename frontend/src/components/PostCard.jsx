import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { updatePost, deletePost } from '../API/api';
import ProfileImg from './ProfileImg';
import LikeSystem from './LikeSystem';
import CommentSystem from './CommentSystem';
import { convertToEmbedUrl } from "../utils/youtubeUrl";
import '../style/PostCard.css';

const PostCard = ({ post, refreshPosts }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.message);

  const handleEdit = async () => {
    try {
      await updatePost(post._id, editedContent);
      setIsEditing(false);
      refreshPosts();
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(post._id);
      refreshPosts();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const handleProfileClick = () => {
    if (post.posterId) {
      navigate(`/profile/${post.posterId}`);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const displayName = post.posterPseudo || post.posterId?.pseudo || "Utilisateur";

  return (
    <div className="post-card">
      <div className="post-card-content">
        <div className="post-header">
          <div className="user-info" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
            <ProfileImg username={displayName} userId={post.posterId} size="small" />
            <div className="user-details">
              <span className="post-username" title={displayName}>
                {displayName}
              </span>
              <span className="post-date">{formatDate(post.createdAt)}</span>
            </div>
          </div>

          {user?._id === post.posterId && (
            <div className="post-actions">
              <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>✏️</button>
              <button className="delete-btn" onClick={handleDelete}>🗑️</button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="post-edit">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="edit-actions">
              <button className="save-btn" onClick={handleEdit}>Enregistrer</button>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>Annuler</button>
            </div>
          </div>
        ) : (
          <div className="post-body">
            <p className="post-message">{post.message}</p>
            {post.picture && (
              <img
                src={post.picture}
                alt={`Contenu posté par ${displayName}`}
                className="post-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
            {post.video && (
              <div className="post-video">
                <iframe
                  className="post-video-iframe"
                  src={convertToEmbedUrl(post.video)}
                  title={`Vidéo postée par ${displayName}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        )}

        <div className="post-interactions">
          <LikeSystem
            postId={post._id}
            initialLikes={post.likes || []}
            userId={user?._id}
            refreshPosts={refreshPosts}
          />
          <CommentSystem
            postId={post._id}
            initialComments={post.comments || []}
            currentUser={user}
            refreshPosts={refreshPosts}
          />
        </div>
      </div>
    </div>
  );
};

export default PostCard;