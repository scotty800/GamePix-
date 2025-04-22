import React, { useState } from 'react';
import { commentPost, editComment, deleteComment } from '../API/api';
import '../style/CommentSystem.css';

const CommentSystem = ({ postId, initialComments, currentUser, refreshPosts }) => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedText, setEditedText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const commentData = {
        commenterId: currentUser._id,
        commenterPseudo: currentUser.pseudo,
        text: newComment
      };
      await commentPost(postId, commentData);
      setNewComment('');
      refreshPosts();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleEditComment = async (commentId, currentText) => {
    if (editingCommentId === commentId) {
      try {
        await editComment(postId, commentId, editedText);
        setEditingCommentId(null);
        refreshPosts();
      } catch (error) {
        console.error("Erreur:", error);
      }
    } else {
      setEditingCommentId(commentId);
      setEditedText(currentText);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(postId, commentId);
      refreshPosts();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <div className="comment-system">
      <div className="comments-list">
        {comments.map(comment => (
          <div key={comment._id} className="comment">
            {editingCommentId === comment._id ? (
              <>
                <input
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
                <button onClick={() => handleEditComment(comment._id, comment.text)}>
                  Valider
                </button>
                <button onClick={() => setEditingCommentId(null)}>
                  Annuler
                </button>
              </>
            ) : (
              <>
                <strong>{comment.commenterPseudo}:</strong> {comment.text}
                {(currentUser._id === comment.commenterId || currentUser._id === postId) && (
                  <div className="comment-actions">
                    <button onClick={() => handleEditComment(comment._id, comment.text)}>
                      ✏️
                    </button>
                    <button onClick={() => handleDeleteComment(comment._id)}>
                      🗑️
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="comment-form">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Ajouter un commentaire..."
        />
        <button type="submit">Publier</button>
      </form>
    </div>
  );
};

export default CommentSystem;