import { useState, useEffect, useRef } from 'react';
import { getFeed } from '../api';
import PostCard from '../components/PostCard';
import '../styles/Feed.css';

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const pageRef = useRef(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await getFeed(pageRef.current);
      const { content, hasNext } = response.data.data;
      setPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newPosts = content.filter((p) => !existingIds.has(p.id));
        return [...prev, ...newPosts];
      });
      setHasMore(hasNext);
      pageRef.current += 1;
    } catch (error) {
      console.error('피드 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  const handlePostDelete = (postId) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="feed-container">
        <div className="empty-feed">
          <h2>피드가 비어있습니다</h2>
          <p>팔로우하는 사람들의 게시물이 여기에 표시됩니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feed-container">
      <div className="feed-posts">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onUpdate={handlePostUpdate}
            onDelete={handlePostDelete}
          />
        ))}
        {hasMore && (
          <button className="load-more" onClick={loadPosts}>
            더 보기
          </button>
        )}
      </div>
    </div>
  );
};

export default FeedPage;
