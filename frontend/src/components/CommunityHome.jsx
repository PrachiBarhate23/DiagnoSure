import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CommunityHome.css';
import commm from '../assets/commm.jpg';
import CreatePostModal from './CreatePostModel';

const CommunityHome = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample post data
  const posts = [
    {
      id: 1,
      title: "Dealing with Chronic Pain",
      author: "HopeSeeker",
      description: "Sharing my journey and tips for managing daily chronic pain and finding comfort in routine adjustments. Your insights are...",
      votes: 124
    },
    {
      id: 2,
      title: "Navigating a New Diagnosis",
      author: "ConfusedPatient",
      description: "Just received a complex diagnosis. Any advice on where to start with research, specialists, and emotional support?",
      votes: 87
    },
    {
      id: 3,
      title: "The Power of Patient Advocacy",
      author: "AdvocateAll",
      description: "How speaking up for myself, asking questions, and seeking second opinions changed my treatment plan for the...",
      votes: 201
    },
    {
      id: 4,
      title: "Mental Health & Physical Illness",
      author: "MindBodyConnect",
      description: "Discussing the intertwined nature of mental and physical well-being. How do you cope with the emotional toll of...",
      votes: 98
    },
    {
      id: 5,
      title: "Finding the Right Specialist",
      author: "SeekingCare",
      description: "Tips and tricks for researching and choosing the best doctors and clinics for rare or complex conditions. Share your...",
      votes: 72
    },
    {
      id: 6,
      title: "Support for Caregivers",
      author: "CaringHeart",
      description: "A space for those supporting loved ones through illness. Share your challenges, strategies, and self-care tips. You're not...",
      votes: 55
    },
    {
      id: 7,
      title: "Holistic Approaches to Wellness",
      author: "WellnessExplorer",
      description: "Exploring alternative therapies alongside traditional medicine—what has worked for you? Looking for evidence-based...",
      votes: 68
    },
    {
      id: 8,
      title: "My Recovery Story",
      author: "SurvivorSarah",
      description: "From diagnosis to remission, a story of hope and resilience. Sharing my journey to inspire others facing similar battles...",
      votes: 150
    },
    {
      id: 9,
      title: "Understanding Medical Jargon",
      author: "InfoSeeker",
      description: "Demystifying common medical terms to empower patients. Let's build a glossary together for clearer communication with...",
      votes: 45
    }
  ];

  const [filteredPosts, setFilteredPosts] = useState(posts);

  const handleVote = (postId, direction) => {
    console.log(`Voted ${direction} on post ${postId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const results = posts.filter(post =>
      post.title.toLowerCase().includes(lowercasedSearchTerm) ||
      post.author.toLowerCase().includes(lowercasedSearchTerm) ||
      post.description.toLowerCase().includes(lowercasedSearchTerm)
    );
    setFilteredPosts(results);
  };
  
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleNewPostSubmit = (newPost) => {
    const newPostWithDefaults = {
      id: Date.now(),
      ...newPost,
      votes: 0,
    };
    const updatedPosts = [newPostWithDefaults, ...posts];
    setFilteredPosts(updatedPosts);
  };

  return (
    <div className="community-home">
      {/* Map-style header */}
      <div className="map-header">
        <div className="map-header-content">
          <h1>Connect, Share, Heal</h1>
          <p>A supportive space for patients to share experiences, ask questions, and find community on their health journeys.</p>
        </div>
      </div>

      <div className="create-post-section">
        <button 
          className="create-post-button"
          onClick={handleOpenModal}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4.5v15M4.5 12h15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Create New Post
        </button>
      </div>

      <section className="posts-section">
        <div className="posts-container">
          <div className="posts-grid">
            {filteredPosts.map(post => (
              <article key={post.id} className="post-card">
                <div className="post-header">
                  <Link to={`/post/${post.id}`} className="post-link">
                    <h3 className="post-title">{post.title}</h3>
                  </Link>
                  <p className="post-author">By {post.author}</p>
                </div>
                <p className="post-description">{post.description}</p>
                <div className="post-footer">
                  <div className="vote-section">
                    <button 
                      className="vote-button vote-up"
                      onClick={() => handleVote(post.id, 'up')}
                      aria-label="Upvote"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18 15l-6-6-6 6"/>
                      </svg>
                    </button>
                    <span className="vote-count">{post.votes} Votes</span>
                    <button 
                      className="vote-button vote-down"
                      onClick={() => handleVote(post.id, 'down')}
                      aria-label="Downvote"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 9l6 6 6-6"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pagination-section">
        <div className="pagination-container">
          <div className="pagination">
            <button 
              className="pagination-arrow"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            
            {[1, 2, 3, 4, 5].map(page => (
              <button
                key={page}
                className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            
            <button 
              className="pagination-arrow"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === 5}
              aria-label="Next page"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      <CreatePostModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleNewPostSubmit}
      />
    </div>
  );
};

export default CommunityHome;