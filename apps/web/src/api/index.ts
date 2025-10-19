import axios from 'axios';

// axios 인스턴스 생성
export const axiosInstance = axios.create({
  baseURL: 'http://3.34.40.123/v1', //TODO: 환경변수 관리
  timeout: 10000,
});

// 요청 인터셉터: 모든 요청에 토큰 자동 추가
axiosInstance.interceptors.request.use(
  config => {
    // const token = localStorage.getItem('authToken');
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwicm9sZSI6IlUwMTAwMSIsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3NjA2MjIyNzAsImV4cCI6MTc2MDYyNTg3MH0.EZOIInJTO9sLXFjEUIn8zO5e3PUeHk27I-IRkhOtvVs';

    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 401 에러 처리
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // 토큰 만료 또는 인증 실패 시 처리
      console.error('인증 실패: 로그인이 필요합니다.');
    }
    return Promise.reject(error);
  }
);
