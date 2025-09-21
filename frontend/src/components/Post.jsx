import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Post.css';

// Helper to format dates
const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// --- Hardcoded Post Data ---
const postsData = [
  {
    id: 1,
    title: "Navigating Chronic Illness: Sharing My Journey with Lupus",
    author: "Dr. Evelyn Reed",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    date: "2023-10-26T10:00:00Z",
    content: `Living with lupus has been a journey of constant learning and adaptation. When I was first diagnosed, the overwhelming feeling came not just from the physical symptoms, but from the immense task of trying to understand symptoms, treatments, and how to maintain a semblance of normal life. The physical challenges are significant, often invisible to others, making it all the more isolating. However, I’ve come to realize that for many, one of the biggest hurdles has been the invisible nature of the disease. On many days, I look “fine” on the outside, but internally I battle pain, fatigue, and other debilitating effects. This often leads to misunderstandings, especially in social and professional settings.
    
    Learning to advocate for myself, setting boundaries, and finding communities of others who understand. Online forums and support groups have been a lifeline, offering a space where I can share experiences, gain insights, and feel truly seen. Knowing that there are others going through something similar, who understand the nuances of chronic illness, is empowering. It’s like discovering a secret club where everyone speaks your language. This network has taught me that I’m not alone, and together, we can navigate the complexities of chronic illness with more resilience. Every day is a new challenge, and every small victory, a shared story. This journey contributes to a larger movement that makes the journey a little less daunting.
    
    What are your experiences? How have you found connection and strength in your own health journeys?`,
    upvotes: 128,
    downvotes: 4,
    comments: [
      {
        id: 101,
        author: "Sarah J.",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        date: "2023-10-26T14:30:00Z",
        content: "Thank you for sharing your story, Dr. Reed. Your words resonate deeply with me. The invisible illness aspect is so tough to explain to loved ones.",
        likes: 25,
        replies: [
          {
            id: 1011,
            author: "Patient Advocate",
            avatar: "https://randomuser.me/api/portraits/men/3.jpg",
            date: "2023-10-27T09:00:00Z",
            content: "This is beautifully written. Advocacy is key, and communities like Diagnosure are vital for patients to find their voice.",
            likes: 15,
            replies: []
          }
        ]
      },
      {
        id: 102,
        author: "Michael P.",
        avatar: "https://randomuser.me/api/portraits/men/4.jpg",
        date: "2023-10-27T11:00:00Z",
        content: "I totally get the emotional and mental toll—it's often harder than the physical symptoms. Finding a good therapist who understands chronic illness has been life-changing for me.",
        likes: 18,
        replies: [
          {
            id: 1021,
            author: "LupusWarrior",
            avatar: "https://randomuser.me/api/portraits/women/5.jpg",
            date: "2023-10-28T08:15:00Z",
            content: "Your courage is inspiring! I'm still struggling with setting boundaries, but your post gives me hope.",
            likes: 10,
            replies: [
              {
                id: 10211,
                author: "Dr. Evelyn Reed",
                avatar: "https://randomuser.me/api/portraits/women/1.jpg",
                date: "2023-10-28T10:00:00Z",
                content: "Thank you for the kind words, everyone. It truly helps to know we're in this together. Sending strength to you all.",
                likes: 30,
                replies: []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Navigating a New Diagnosis",
    author: "ConfusedPatient",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
    date: "2023-09-05T09:00:00Z",
    content: "I was recently diagnosed with a complex autoimmune disorder and feel completely overwhelmed. There's so much information online, and it's hard to distinguish reliable sources from misinformation. Any advice on where to start with research, specialists, and emotional support? The emotional toll is just as heavy as the physical symptoms. Any words of wisdom or practical steps would be greatly appreciated.",
    upvotes: 87,
    downvotes: 2,
    comments: [
      {
        id: 201,
        author: "SupportGroup",
        avatar: "https://randomuser.me/api/portraits/men/7.jpg",
        date: "2023-09-06T14:30:00Z",
        content: "Take a deep breath. Start by finding a good primary care doctor who can refer you to a specialist. Don't rush into treatments. Information is power, but it's okay to take it one step at a time.",
        likes: 12,
        replies: []
      }
    ]
  },
  {
    id: 3,
    title: "The Power of Patient Advocacy",
    author: "AdvocateAll",
    avatar: "https://randomuser.me/api/portraits/women/8.jpg",
    date: "2023-09-15T11:00:00Z",
    content: "I used to be a passive patient, accepting whatever my doctor said without question. But when my condition worsened, I decided to become my own advocate. I started researching my treatment options, asking detailed questions during appointments, and even sought a second opinion. This one decision completely changed my life for the better. We must empower ourselves and not be afraid to speak up. Who else has a story of advocating for themselves?",
    upvotes: 201,
    downvotes: 15,
    comments: [
      {
        id: 301,
        author: "EmpoweredMe",
        avatar: "https://randomuser.me/api/portraits/women/9.jpg",
        date: "2023-09-16T10:00:00Z",
        content: "Yes! A few years ago, my doctor misdiagnosed me twice. It wasn't until I found a specialist myself that I got the correct diagnosis and treatment. Advocacy is key!",
        likes: 35,
        replies: []
      },
      {
        id: 302,
        author: "CaregiverSupport",
        avatar: "https://randomuser.me/api/portraits/men/10.jpg",
        date: "2023-09-17T12:00:00Z",
        content: "I'm a caregiver, and I've learned that advocating for my loved one is just as important as the care I provide. It's a lot of work, but it's worth it.",
        likes: 20,
        replies: []
      },
    ]
  },
];

const Comment = ({ comment, onLike, onReplyClick }) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = () => {
    onLike(comment.id);
    setIsLiked(!isLiked);
  };

  return (
    <div className={`comment ${comment.parentCommentId ? 'reply' : ''}`}>
      <div className="comment-header">
        <img src={comment.avatar} alt={comment.author} className="avatar" />
        <div className="comment-meta">
          <span className="author-name">{comment.author}</span>
          <span className="comment-date">{formatDate(comment.date)}</span>
        </div>
      </div>
      <p className="comment-content">{comment.content}</p>
      <div className="comment-actions">
        <button 
          className={`like-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLikeClick}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 15l-6-6-6 6"/>
          </svg>
          <span>{comment.likes}</span>
        </button>
        <button className="reply-btn" onClick={() => onReplyClick(comment.id, comment.author)}>
          Reply
        </button>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="replies">
          {comment.replies.map(reply => (
            <Comment key={reply.id} comment={reply} onLike={onLike} onReplyClick={onReplyClick} />
          ))}
        </div>
      )}
    </div>
  );
};

const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [newCommentContent, setNewCommentContent] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [activeReplyInput, setActiveReplyInput] = useState(null);
  
  // New state for post votes
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);

  useEffect(() => {
    const foundPost = postsData.find(p => p.id === parseInt(id));
    setPost(foundPost);
  }, [id]);

  const handleAddComment = () => {
    if (!newCommentContent.trim()) return;

    const newComment = {
      id: Date.now(),
      author: "NewUser",
      avatar: "https://randomuser.me/api/portraits/men/9.jpg",
      date: new Date().toISOString(),
      content: newCommentContent.trim(),
      likes: 0,
      replies: []
    };

    setPost(prevPost => ({
      ...prevPost,
      comments: [newComment, ...prevPost.comments]
    }));
    setNewCommentContent('');
  };

  const handleReplyClick = (commentId, authorName) => {
    setReplyTo({ commentId, authorName });
    setActiveReplyInput(commentId);
    setNewCommentContent('');
  };

  const handleAddReply = (parentCommentId, replyContent) => {
    if (!replyContent.trim()) return;

    const newReply = {
      id: Date.now(),
      author: "ReplyUser",
      avatar: "https://randomuser.me/api/portraits/women/10.jpg",
      date: new Date().toISOString(),
      content: `@${replyTo.authorName} ${replyContent.trim()}`,
      likes: 0,
      replies: [],
      parentCommentId: parentCommentId
    };

    const addReplyToComments = (comments) => {
      return comments.map(comment => {
        if (comment.id === parentCommentId) {
          return {
            ...comment,
            replies: comment.replies ? [newReply, ...comment.replies] : [newReply]
          };
        } else if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: addReplyToComments(comment.replies)
          };
        }
        return comment;
      });
    };

    setPost(prevPost => ({
      ...prevPost,
      comments: addReplyToComments(prevPost.comments)
    }));
    setReplyTo(null);
    setActiveReplyInput(null);
  };
  
  const handleLikeComment = (commentId) => {
    const updateLikes = (comments) => {
      return comments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, likes: comment.likes + 1 };
        } else if (comment.replies && comment.replies.length > 0) {
          return { ...comment, replies: updateLikes(comment.replies) };
        }
        return comment;
      });
    };

    setPost(prevPost => ({
      ...prevPost,
      comments: updateLikes(prevPost.comments)
    }));
  };
  
  const handlePostVote = (direction) => {
    setPost(prevPost => {
        let newUpvotes = prevPost.upvotes;
        let newDownvotes = prevPost.downvotes;
        
        if (direction === 'up') {
            if (upvoted) {
                newUpvotes--;
            } else {
                newUpvotes++;
                if (downvoted) {
                    newDownvotes--;
                    setDownvoted(false);
                }
            }
            setUpvoted(!upvoted);
        } else if (direction === 'down') {
            if (downvoted) {
                newDownvotes--;
            } else {
                newDownvotes++;
                if (upvoted) {
                    newUpvotes--;
                    setUpvoted(false);
                }
            }
            setDownvoted(!downvoted);
        }

        return {
            ...prevPost,
            upvotes: newUpvotes,
            downvotes: newDownvotes
        };
    });
};


  if (!post) {
    return <div>Post not found.</div>;
  }

  const postParagraphs = post.content.split('\n').map((paragraph, index) => (
    <p key={index}>{paragraph}</p>
  ));

  return (
    <div className="post-container">
      {/* Main Post Section */}
      <div className="post">
        <div className="post-header">
          <h1 className="post-title">{post.title}</h1>
          <div className="post-meta">
            <img src={post.avatar} alt={post.author} className="avatar" />
            <div className="author-info">
              <span className="author-name">{post.author}</span>
              <span className="post-date">{formatDate(post.date)}</span>
            </div>
          </div>
        </div>
        <div className="post-content">
          {postParagraphs}
        </div>
        <div className="post-interactions">
          <button 
            className={`vote-button vote-up ${upvoted ? 'active' : ''}`}
            onClick={() => handlePostVote('up')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 15l-6-6-6 6"/>
            </svg>
            <span>{post.upvotes}</span>
          </button>
          <button 
            className={`vote-button vote-down ${downvoted ? 'active' : ''}`}
            onClick={() => handlePostVote('down')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 9l6 6 6-6"/>
            </svg>
            <span>{post.downvotes}</span>
          </button>
          <span className="comments-count">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>Comments ({post.comments.length})</span>
          </span>
        </div>
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <h2 className="comments-heading">Comments ({post.comments.length})</h2>
        <div className="comments-list">
          {post.comments.map(comment => (
            <React.Fragment key={comment.id}>
              <Comment comment={comment} onLike={handleLikeComment} onReplyClick={handleReplyClick} />
              {activeReplyInput === comment.id && replyTo && replyTo.commentId === comment.id && (
                <div className="reply-input-container">
                  <textarea
                    placeholder={`Replying to @${replyTo.authorName}...`}
                    value={newCommentContent}
                    onChange={(e) => setNewCommentContent(e.target.value)}
                    rows={2}
                    className="form-textarea"
                  ></textarea>
                  <div className="reply-actions">
                    <button onClick={() => { setReplyTo(null); setActiveReplyInput(null); setNewCommentContent(''); }} className="button-secondary">Cancel</button>
                    <button onClick={() => handleAddReply(replyTo.commentId, newCommentContent)} className="button-primary">Reply</button>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Main Add Comment Section */}
        <div className="add-comment">
          <h3>Add a Comment</h3>
          <textarea 
            placeholder="Share your thoughts..."
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
            rows={3}
          ></textarea>
          <button className="submit-btn" onClick={handleAddComment}>Post Comment</button>
        </div>
      </div>
    </div>
  );
};

export default Post;