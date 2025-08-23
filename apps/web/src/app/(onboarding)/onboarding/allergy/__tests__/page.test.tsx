// allergyPost API 모킹
import { allergyPost } from '@recipot/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AllergyPage from '../page';

jest.mock('@recipot/api', () => ({
  allergyPost: jest.fn(),
}));

const mockedAllergyPost = jest.mocked(allergyPost);

// QueryClient를 사용한 테스트 래퍼
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        retry: false,
      },
      queries: {
        retry: false,
      },
    },
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return Wrapper;
};

describe('Allergy Page - API 테스트', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    mockedAllergyPost.mockClear();
    // alert 모킹
    global.alert = jest.fn();
  });

  it('사용자가 알레르기 항목을 선택하고 제출하면 API가 호출됨', async () => {
    // API 응답 모킹
    mockedAllergyPost.mockResolvedValueOnce({
      analysis: {
        animalCount: 1,
        seafoodCount: 2,
        totalSelected: 3,
      },
      message: '못 먹는 음식 item POST 완료',
      selectedItems: [1, 2, 6],
      success: true,
    });

    // console.log 스파이
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    // 페이지 렌더링 (QueryClient로 래핑)
    render(<AllergyPage />, { wrapper: createWrapper() });

    // 항목 선택
    await user.click(screen.getByText('어류'));
    await user.click(screen.getByText('돼지고기'));
    await user.click(screen.getByText('게'));

    // 제출
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // API 호출 확인
    expect(mockedAllergyPost).toHaveBeenCalledWith({ categories: [1, 2, 6] });

    // console.log에 성공 로그가 찍혔는지 확인
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('API 호출 성공:', {
        analysis: {
          animalCount: 1,
          seafoodCount: 2,
          totalSelected: 3,
        },
        message: '못 먹는 음식 item POST 완료',
        selectedItems: [1, 2, 6],
        success: true,
      });
    });

    // 스파이 정리
    consoleSpy.mockRestore();
  });

  it('선택된 항목이 없을 때 제출하면 빈 배열로 API 호출됨', async () => {
    // API 응답 모킹
    mockedAllergyPost.mockResolvedValueOnce({
      analysis: {
        animalCount: 0,
        seafoodCount: 0,
        totalSelected: 0,
      },
      message: '못 먹는 음식 item POST 완료',
      selectedItems: [],
      success: true,
    });

    // console.log 스파이
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    render(<AllergyPage />, { wrapper: createWrapper() });

    // 아무것도 선택하지 않고 제출
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // API 호출 확인
    expect(mockedAllergyPost).toHaveBeenCalledWith({ categories: [] });

    // console.log에 성공 로그가 찍혔는지 확인
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('API 호출 성공:', {
        analysis: {
          animalCount: 0,
          seafoodCount: 0,
          totalSelected: 0,
        },
        message: '못 먹는 음식 item POST 완료',
        selectedItems: [],
        success: true,
      });
    });

    // 스파이 정리
    consoleSpy.mockRestore();
  });

  it('복잡한 선택 패턴에서도 올바른 API 호출이 됨', async () => {
    // API 응답 모킹
    mockedAllergyPost.mockResolvedValueOnce({
      analysis: {
        animalCount: 4,
        seafoodCount: 4,
        totalSelected: 8,
      },
      message: '못 먹는 음식 item POST 완료',
      selectedItems: [1, 2, 3, 5, 6, 7, 9, 10],
      success: true,
    });

    // console.log 스파이
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    render(<AllergyPage />, { wrapper: createWrapper() });

    // 해산물류: 어류, 게, 새우, 조개류
    await user.click(screen.getByText('어류'));
    await user.click(screen.getByText('게'));
    await user.click(screen.getByText('새우'));
    await user.click(screen.getByText('조개류'));

    // 동물성 식품: 돼지고기, 닭고기, 알류, 유제품
    await user.click(screen.getByText('돼지고기'));
    await user.click(screen.getByText('닭고기'));
    await user.click(screen.getByText('알류'));
    await user.click(screen.getByText('유제품'));

    // 제출
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // API 호출 확인
    expect(mockedAllergyPost).toHaveBeenCalledWith({
      categories: [1, 2, 3, 5, 6, 7, 9, 10],
    });

    // console.log에 성공 로그가 찍혔는지 확인
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('API 호출 성공:', {
        analysis: {
          animalCount: 4,
          seafoodCount: 4,
          totalSelected: 8,
        },
        message: '못 먹는 음식 item POST 완료',
        selectedItems: [1, 2, 3, 5, 6, 7, 9, 10],
        success: true,
      });
    });

    // 스파이 정리
    consoleSpy.mockRestore();
  });

  it('API 에러 발생 시 콘솔에 에러가 로깅됨', async () => {
    // API 에러 모킹
    mockedAllergyPost.mockRejectedValueOnce(new Error('API 호출 실패: 500'));

    // console.error 스파이
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<AllergyPage />, { wrapper: createWrapper() });

    // 항목 선택
    await user.click(screen.getByText('어류'));

    // 제출
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // console.error에 에러 로그가 찍혔는지 확인
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'API 호출 실패:',
        new Error('API 호출 실패: 500')
      );
    });

    // 스파이 정리
    consoleErrorSpy.mockRestore();
  });

  it('네트워크 에러 발생 시 콘솔에 에러가 로깅됨', async () => {
    // 네트워크 에러 모킹
    mockedAllergyPost.mockRejectedValueOnce(new Error('Network error'));

    // console.error 스파이
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<AllergyPage />, { wrapper: createWrapper() });

    // 항목 선택
    await user.click(screen.getByText('어류'));

    // 제출
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // console.error에 에러 로그가 찍혔는지 확인
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'API 호출 실패:',
        new Error('Network error')
      );
    });

    // 스파이 정리
    consoleErrorSpy.mockRestore();
  });
});
