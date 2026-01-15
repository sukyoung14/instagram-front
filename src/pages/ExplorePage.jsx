import { useState, useEffect, useRef } from 'react';
import { getExplore } from '../api';
import PostCard from '../components/PostCard';
import '../styles/Feed.css';

const ExplorePage = () => {
  const [posts, setPosts] = useState([]);
  const pageRef = useRef(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await getExplore(pageRef.current);
      const { content, hasNext } = response.data.data;
      setPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newPosts = content.filter((p) => !existingIds.has(p.id));
        return [...prev, ...newPosts];
      });
      setHasMore(hasNext);
      pageRef.current += 1;
    } catch (error) {
      console.error('탐색 로드 실패:', error);
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

  return (
    <div className="feed-container">
      <h1 className="page-title">탐색</h1>
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

export default ExplorePage;
