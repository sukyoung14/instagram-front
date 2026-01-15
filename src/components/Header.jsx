import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getImageUrl } from "../api";
import "../styles/Header.css";

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          Insta
        </Link>

        <nav className="nav">
          {isAuthenticated ? (
            <>
              <Link to="/" className="nav-link">
                홈
              </Link>
              <Link to="/all" className="nav-link">
                전체
              </Link>
              <Link to="/explore" className="nav-link">
                탐색
              </Link>
              <Link to="/create" className="nav-link">
                +
              </Link>
              <Link
                to={`/profile/${user?.username}`}
                className="nav-link profile-link"
              >
                {user?.profileImageUrl ? (
                  <img src={getImageUrl(user.profileImageUrl)} alt="프로필" />
                ) : (
                  <span className="avatar">
                    {user?.username?.[0]?.toUpperCase()}
                  </span>
                )}
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/all" className="nav-link">
                전체
              </Link>
              <Link to="/explore" className="nav-link">
                탐색
              </Link>
              <Link to="/login" className="nav-link">
                로그인
              </Link>
              <Link to="/signup" className="nav-link signup">
                가입하기
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
