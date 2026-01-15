import { useState, useRef } from 'react';
import { updateProfile, uploadFile, getImageUrl } from '../api';
import '../styles/EditProfileModal.css';

const EditProfileModal = ({ profile, onClose, onUpdate }) => {
  const [name, setName] = useState(profile.name || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [profileImageUrl, setProfileImageUrl] = useState(profile.profileImageUrl || '');
  const [previewUrl, setPreviewUrl] = useState(profile.profileImageUrl ? getImageUrl(profile.profileImageUrl) : null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 미리보기
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    // 업로드
    try {
      const response = await uploadFile(file);
      setProfileImageUrl(response.data.data.url);
    } catch (err) {
      setError('이미지 업로드에 실패했습니다.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await updateProfile(profile.username, {
        name,
        bio,
        profileImageUrl,
      });
      onUpdate(response.data.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || '프로필 수정에 실패했습니다.');
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
      <div className="edit-profile-modal">
        <div className="modal-header">
          <h2>프로필 편집</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="profile-image-section">
            <div className="profile-image-preview" onClick={() => fileInputRef.current?.click()}>
              {previewUrl ? (
                <img src={previewUrl} alt="프로필" />
              ) : (
                <div className="default-avatar">
                  {profile.username[0].toUpperCase()}
                </div>
              )}
              <div className="image-overlay">
                <span>사진 변경</span>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              hidden
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름"
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">소개</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="소개"
              maxLength={500}
              rows={4}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
