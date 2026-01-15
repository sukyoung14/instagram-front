import { Link } from 'react-router-dom';
import { getImageUrl } from '../api';
import '../styles/PostGrid.css';

const PostGrid = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return <div className="empty-grid">게시물이 없습니다.</div>;
  }

  return (
    <div className="post-grid">
      {posts.map((post) => (
        <Link to={`/post/${post.id}`} key={post.id} className="grid-item">
          {post.imageUrl ? (
            <img src={getImageUrl(post.imageUrl)} alt="" />
          ) : (
            <div className="no-image">
              <p>{post.content?.substring(0, 50)}...</p>
            </div>
          )}
          <div className="grid-overlay">
            <span>♥ {post.likeCount || 0}</span>
            <span>💬 {post.commentCount || 0}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PostGrid;
