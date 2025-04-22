import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createPost } from '../API/api';
import '../style/PostForm.css';

const PostForm = ({ refreshPosts }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('posterId', user._id);
    formData.append('message', content);
    
    if (image) {
      formData.append('file', image);
    }
    if (videoUrl) {
      formData.append('video', videoUrl);
    }

    try {
      await createPost(formData);
      setContent('');
      setImage(null);
      setVideoUrl('');
      setIsExpanded(false);
      refreshPosts();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setVideoUrl('');
    }
  };

  const handleVideoChange = (e) => {
    setVideoUrl(e.target.value);
    if (e.target.value) {
      setImage(null);
    }
  };

  return (
    <>
      {!isExpanded && (
        <button 
          className="floating-post-button"
          onClick={() => setIsExpanded(true)}
        >
          +
        </button>
      )}

      {isExpanded && (
        <div className="post-form-container">
          <form onSubmit={handleSubmit} className="post-form">
            <div className="form-header">
              <h3>Créer un post</h3>
              <button 
                type="button" 
                className="close-btn"
                onClick={() => setIsExpanded(false)}
              >
                ×
              </button>
            </div>
            
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Quoi de neuf ?"
              className="post-input"
            />
            
            <div className="button-row">
              <button type="button" className="upload">
                <span className="icon">📷</span> Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
              </button>
              
              <button type="button" className="feeling">
                <span className="icon">🎬</span> Vidéo
                <input
                  type="text"
                  value={videoUrl}
                  onChange={handleVideoChange}
                  placeholder="Lien YouTube"
                  className="video-input"
                />
              </button>
            </div>
            
            <button type="submit" className="post">
              Publier
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default PostForm;