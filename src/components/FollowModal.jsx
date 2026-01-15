import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFollowers, getFollowing, getImageUrl } from '../api';
import '../styles/FollowModal.css';

const FollowModal = ({ username, type, onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, [username, type]);

  const loadUsers = async () => {
    try {
      const response = type === 'followers'
        ? await getFollowers(username)
        : await getFollowing(username);
      setUsers(response.data.data);
    } catch (error) {
      console.error('목록 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{type === 'followers' ? '팔로워' : '팔로잉'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {loading ? (
            <div className="loading-small">로딩 중...</div>
          ) : users.length === 0 ? (
            <div className="empty-list">
              {type === 'followers' ? '팔로워가 없습니다.' : '팔로잉하는 사용자가 없습니다.'}
            </div>
          ) : (
            <ul className="user-list">
              {users.map((user) => (
                <li key={user.id}>
                  <Link to={`/profile/${user.username}`} onClick={onClose} className="user-item">
                    {user.profileImageUrl ? (
                      <img src={getImageUrl(user.profileImageUrl)} alt="" className="user-avatar" />
                    ) : (
                      <div className="user-avatar default">
                        {user.username[0].toUpperCase()}
                      </div>
                    )}
                    <div className="user-info">
                      <span className="user-username">{user.username}</span>
                      {user.name && <span className="user-name">{user.name}</span>}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowModal;
