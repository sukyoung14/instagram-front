import { useState, useEffect } from 'react';
import { getPosts } from '../api';
import PostCard from '../components/PostCard';
import '../styles/Feed.css';

const AllPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await getPosts();
      setPosts(response.data.data);
    } catch (error) {
      console.error('게시물 로드 실패:', error);
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
      <h1 className="page-title">전체 게시물</h1>
      <div className="feed-posts">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onUpdate={handlePostUpdate}
            onDelete={handlePostDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default AllPostsPage;
