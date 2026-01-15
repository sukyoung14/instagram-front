import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost, uploadFile } from '../api';
import '../styles/CreatePost.css';

const CreatePostPage = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('내용을 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let imageUrl = null;

      // 이미지가 있으면 먼저 업로드
      if (image) {
        const uploadResponse = await uploadFile(image);
        imageUrl = uploadResponse.data.data.url;
      }

      // 게시물 생성
      await createPost({
        content,
        imageUrl,
      });

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error?.message || '게시물 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <h1>새 게시물</h1>

      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="image-upload">
          {preview ? (
            <div className="preview">
              <img src={preview} alt="미리보기" />
              <button type="button" onClick={() => { setImage(null); setPreview(null); }}>
                삭제
              </button>
            </div>
          ) : (
            <label className="upload-label">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
              <span>이미지 선택</span>
            </label>
          )}
        </div>

        <textarea
          placeholder="문구 입력..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={2200}
        />

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? '게시 중...' : '공유하기'}
        </button>
      </form>
    </div>
  );
};

export default CreatePostPage;
