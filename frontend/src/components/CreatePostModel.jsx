import React, { useState, useEffect } from 'react';
import './CreatePostModel.css';

const CreatePostModal = ({ isOpen, onClose, onSubmit }) => {
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!postTitle.trim() || !postContent.trim()) {
      alert('Please fill in both title and content fields.');
      return;
    }

    const postData = {
      title: postTitle.trim(),
      content: postContent.trim(),
      timestamp: new Date().toISOString(),
      author: 'CurrentUser' // This would come from auth context in a real app
    };

    console.log('New Post Data:', postData);
    
    // Call the onSubmit callback if provided
    if (onSubmit) {
      onSubmit(postData);
    }

    // Reset form and close modal
    setPostTitle('');
    setPostContent('');
    onClose();
  };

  const handleCancel = () => {
    setPostTitle('');
    setPostContent('');
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-title-section">
            <h2 className="modal-title">Create New Post</h2>
            <p className="modal-subtitle">
              Fill out the form below to create a new post in the community forum.
            </p>
          </div>
          <button 
            className="modal-close-button"
            onClick={handleCancel}
            aria-label="Close modal"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="postTitle" className="form-label">
              Post Title
            </label>
            <input
              type="text"
              id="postTitle"
              className="form-input"
              placeholder="A New Breakthrough in Diabetes Management"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              maxLength={200}
            />
          </div>

          <div className="form-group">
            <label htmlFor="postContent" className="form-label">
              Post Content
            </label>
            <textarea
              id="postContent"
              className="form-textarea"
              placeholder="Share your thoughts and experiences..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              rows={6}
              maxLength={2000}
            />
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="button-secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="button-primary"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;