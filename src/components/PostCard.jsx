import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { likePost, unlikePost, deletePost, getImageUrl } from '../api';
import CommentList from './CommentList';
import '../styles/PostCard.css';

const PostCard = ({ post, onUpdate, onDelete, showComments = false }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [showAllComments, setShowAllComments] = useState(showComments);

  const handleLike = async () => {
    if (!user) return;

    try {
      if (liked) {
        await unlikePost(post.id);
        setLiked(false);
        setLikeCount((prev) => prev - 1);
      } else {
        await likePost(post.id);
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('게시물을 삭제하시겠습니까?')) {
      try {
        await deletePost(post.id);
        if (onDelete) onDelete(post.id);
      } catch (error) {
        console.error('삭제 실패:', error);
      }
    }
  };

  const isOwner = user && post.author && Number(user.id) === Number(post.author.id);

  return (
    <article className="post-card">
      <header className="post-header">
        <Link to={`/profile/${post.author?.username}`} className="author-info">
          {post.author?.profileImageUrl ? (
            <img src={getImageUrl(post.author.profileImageUrl)} alt="" className="author-avatar" />
          ) : (
            <div className="author-avatar default">
              {post.author?.username?.[0]?.toUpperCase()}
            </div>
          )}
          <span className="author-name">{post.author?.username}</span>
        </Link>
        {isOwner && (
          <button className="delete-btn" onClick={handleDelete}>
            삭제
          </button>
        )}
      </header>

      {post.imageUrl && (
        <div className="post-image">
          <img src={getImageUrl(post.imageUrl)} alt="" />
        </div>
      )}

      <div className="post-actions">
        <button
          className={`like-btn ${liked ? 'liked' : ''}`}
          onClick={handleLike}
          disabled={!user}
        >
          {liked ? '♥' : '♡'}
        </button>
        <button
          className="comment-btn"
          onClick={() => setShowAllComments(!showAllComments)}
        >
          💬
        </button>
      </div>

      <div className="post-likes">좋아요 {likeCount}개</div>

      <div className="post-content">
        <Link to={`/profile/${post.author?.username}`} className="author-name">
          {post.author?.username}
        </Link>
        <span className="content-text">{post.content}</span>
      </div>

      {post.commentCount > 0 && !showAllComments && (
        <button
          className="view-comments"
          onClick={() => setShowAllComments(true)}
        >
          댓글 {post.commentCount}개 모두 보기
        </button>
      )}

      {showAllComments && (
        <CommentList postId={post.id} />
      )}

      <div className="post-time">
        {new Date(post.createdAt).toLocaleDateString('ko-KR')}
      </div>
    </article>
  );
};

export default PostCard;
