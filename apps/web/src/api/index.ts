import axios from 'axios';

// axios 인스턴스 생성
export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 10000,
});

// 요청 인터셉터: 모든 요청에 토큰 자동 추가
axiosInstance.interceptors.request.use(
  config => {
    // const token = localStorage.getItem('authToken');
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwicm9sZSI6IlUwMTAwMSIsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3NjEwNTQxMjYsImV4cCI6MTc2MTA1NzcyNn0.xaExj26nHKtF7MQytOiBb8xqxSq0Mxpr8ktYhZBqj-U';

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
