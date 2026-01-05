import { createApiInstance } from './createApiInstance';

const GUEST_SESSION_KEY = 'guest-session-id';

const guestApi = createApiInstance({ apiName: 'GuestSession' });

interface CreateGuestSessionResponse {
  status: number;
  data: {
    guestSessionId: string;
  };
}

interface MigrateGuestResponse {
  status: number;
  data: {
    message: string;
  };
}

const storage = {
  getSessionId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(GUEST_SESSION_KEY);
  },

  saveSessionId(sessionId: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(GUEST_SESSION_KEY, sessionId);
  },

  clearSessionId(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(GUEST_SESSION_KEY);
  },
};

export const guestSession = {
  /**
   * 저장된 게스트 세션 ID 조회
   */
  getSessionId(): string | null {
    return storage.getSessionId();
  },

  /**
   * 새로운 게스트 세션 생성
   * 7일간 유효한 세션 ID를 발급받아 로컬 스토리지에 저장
   */
  async createSession(): Promise<string> {
    const response = await guestApi.post<CreateGuestSessionResponse>(
      '/v1/auth/guest-session'
    );

    const sessionId = response.data.data.guestSessionId;
    storage.saveSessionId(sessionId);

    return sessionId;
  },

  /**
   * 게스트 세션 ID 조회 또는 생성
   * 저장된 세션이 없으면 새로 생성
   */
  async getOrCreateSessionId(): Promise<string> {
    const existingSessionId = storage.getSessionId();

    if (existingSessionId) {
      return existingSessionId;
    }

    return this.createSession();
  },

  /**
   * 게스트 데이터를 로그인한 유저 계정으로 마이그레이션
   * 로그인 성공 후 호출
   */
  async migrateToUser(): Promise<void> {
    const sessionId = storage.getSessionId();

    if (!sessionId) return;

    try {
      await guestApi.post<MigrateGuestResponse>('/v1/auth/migrate-guest', {
        guestSessionId: sessionId,
      });
    } finally {
      storage.clearSessionId();
    }
  },

  /**
   * 게스트 세션 삭제
   */
  clearSession(): void {
    storage.clearSessionId();
  },
};

export const guestSessionUtils = {
  getSessionId: () => storage.getSessionId(),
  saveSessionId: (sessionId: string) => storage.saveSessionId(sessionId),
  clearSessionId: () => storage.clearSessionId(),
};
