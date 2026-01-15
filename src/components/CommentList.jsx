import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getComments, createComment, deleteComment } from '../api';
import '../styles/CommentList.css';

const CommentList = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      const response = await getComments(postId);
      setComments(response.data.data);
    } catch (error) {
      console.error('댓글 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    try {
      const response = await createComment(postId, { content: newComment });
      setComments((prev) => [...prev, response.data.data]);
      setNewComment('');
    } catch (error) {
      console.error('댓글 작성 실패:', error);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(postId, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
    }
  };

  if (loading) {
    return <div className="loading-small">댓글 로딩 중...</div>;
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <div key={comment.id} className="comment">
          <Link to={`/profile/${comment.author?.username}`} className="comment-author">
            {comment.author?.username}
          </Link>
          <span className="comment-content">{comment.content}</span>
          {user && comment.author && Number(user.id) === Number(comment.author.id) && (
            <button
              className="comment-delete"
              onClick={() => handleDelete(comment.id)}
            >
              ×
            </button>
          )}
        </div>
      ))}

      {user && (
        <form onSubmit={handleSubmit} className="comment-form">
          <input
            type="text"
            placeholder="댓글 달기..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            maxLength={500}
          />
          <button type="submit" disabled={!newComment.trim()}>
            게시
          </button>
        </form>
      )}
    </div>
  );
};

export default CommentList;
