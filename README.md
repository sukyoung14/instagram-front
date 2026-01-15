# Instagram Clone - React Frontend

Spring Boot REST API 백엔드와 연동되는 React 프론트엔드입니다.

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example`을 `.env`로 복사하고 값을 설정합니다:

```bash
cp .env.example .env
```

`.env` 파일:
```
REACT_APP_API_URL=http://localhost:8080
```

### 3. 개발 서버 실행

```bash
npm start
```

브라우저에서 http://localhost:3000 으로 접속합니다.

## 프로젝트 구조

```
src/
├── api/              # API 호출 함수
│   └── index.js
├── components/       # 재사용 컴포넌트
│   ├── Header.jsx
│   ├── PostCard.jsx
│   ├── PostGrid.jsx
│   └── CommentList.jsx
├── contexts/         # React Context
│   └── AuthContext.jsx
├── pages/            # 페이지 컴포넌트
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   ├── FeedPage.jsx
│   ├── ExplorePage.jsx
│   ├── ProfilePage.jsx
│   ├── PostDetailPage.jsx
│   └── CreatePostPage.jsx
├── styles/           # CSS 파일
└── App.jsx           # 라우팅 설정
```

## 백엔드 API

이 프론트엔드는 다음 API를 호출합니다:

### 인증
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 현재 사용자 정보

### 게시물
- `GET /api/posts` - 게시물 목록
- `GET /api/posts/:id` - 게시물 상세
- `POST /api/posts` - 게시물 작성
- `DELETE /api/posts/:id` - 게시물 삭제

### 사용자
- `GET /api/users/:username` - 프로필 조회
- `GET /api/users/:username/posts` - 사용자 게시물

### 댓글
- `GET /api/posts/:id/comments` - 댓글 목록
- `POST /api/posts/:id/comments` - 댓글 작성
- `DELETE /api/comments/:id` - 댓글 삭제

### 좋아요
- `POST /api/posts/:id/like` - 좋아요
- `DELETE /api/posts/:id/like` - 좋아요 취소

### 팔로우
- `POST /api/users/:username/follow` - 팔로우
- `DELETE /api/users/:username/follow` - 언팔로우
- `GET /api/users/:username/followers` - 팔로워 목록
- `GET /api/users/:username/following` - 팔로잉 목록

### 피드
- `GET /api/feed` - 팔로잉 피드
- `GET /api/explore` - 탐색 (전체 게시물)

### 파일
- `POST /api/files/upload` - 이미지 업로드

## 이미지 URL 처리

백엔드에서 `/uploads/xxx.jpg` 형태로 URL을 반환합니다. 프론트엔드에서 이미지를 표시할 때는 `getImageUrl` 헬퍼 함수를 사용합니다.

```javascript
// src/api/index.js
export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_URL}${path}`;
};
```

**사용 예시:**
```jsx
import { getImageUrl } from '../api';

<img src={getImageUrl(post.imageUrl)} alt="" />
```

## 백엔드 CORS 설정

백엔드에 다음 CORS 설정이 필요합니다 (`/uploads/**` 포함):

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // API 경로
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);

        // 업로드 파일 경로 (이미지 로딩용)
        registry.addMapping("/uploads/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET")
                .allowedHeaders("*");
    }
}
```
