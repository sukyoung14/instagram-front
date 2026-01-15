# 1. bulid
FROM node:20-alpine AS builder
WORKDIR /app

# ARG -> 빌드 단계에서 환경변수 적용
ARG REACT_APP_API_URL=""
# ENV -> 실행할때 환경변수 적용
ENV REACT_APP_API_URL=$REACT_APP_API_URL

COPY package.json ./
COPY package-lock.json ./

RUN npm ci
COPY . .

RUN npm run build

# 2. prod
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]