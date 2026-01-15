import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import FeedPage from './pages/FeedPage';
import ExplorePage from './pages/ExplorePage';
import AllPostsPage from './pages/AllPostsPage';
import ProfilePage from './pages/ProfilePage';
import PostDetailPage from './pages/PostDetailPage';
import CreatePostPage from './pages/CreatePostPage';
import KakaoCallback from './pages/KakaoCallback';
import './styles/App.css';

// 인증이 필요한 라우트
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// 비로그인 전용 라우트
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return !isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          {/* 공개 라우트 */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            }
          />

          {/* 카카오 콜백 (인증 불필요) */}
          <Route path="/oauth/kakao/callback" element={<KakaoCallback />} />

          {/* 인증 필요 라우트 */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <FeedPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/create"
            element={
              <PrivateRoute>
                <CreatePostPage />
              </PrivateRoute>
            }
          />

          {/* 부분 인증 라우트 (비로그인도 조회 가능) */}
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/all" element={<AllPostsPage />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />

          {/* 기본 리다이렉트 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
