import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  type Mock,
  vi,
} from 'vitest';

import AllergyPage from '../page';

import type * as TanStackQuery from '@tanstack/react-query';

// vi.mock a module to replace exports
vi.mock('@tanstack/react-query', async importOriginal => {
  const original = await importOriginal<typeof TanStackQuery>();
  return {
    ...original,
    useMutation: vi.fn(),
  };
});

// MSW 핸들러 설정
const server = setupServer(
  http.post('/api/onboarding/allergy', (async () => {
    return HttpResponse.json({ message: 'Success' }, { status: 200 });
  }) as any)
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'QueryClientWrapper';
  return Wrapper;
};

describe('Allergy Page', () => {
  let mockMutate: Mock;

  beforeEach(() => {
    mockMutate = vi.fn();
    (useMutation as Mock).mockReturnValue({
      mutate: mockMutate,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('AllergyPage가 정상적으로 렌더링되어야 한다.', () => {
    render(<AllergyPage />, { wrapper: createWrapper() });
    expect(
      screen.getByRole('heading', { name: '알레르기 정보를 선택해주세요.' })
    ).toBeInTheDocument();
  });

  it('사용자가 알레르기 항목을 선택하고 "선택하기"를 누르면 mutate 함수가 호출된다', async () => {
    const user = userEvent.setup();
    render(<AllergyPage />, { wrapper: createWrapper() });

    // 1. 항목 선택
    await user.click(screen.getByRole('button', { name: '게' }));
    await user.click(screen.getByRole('button', { name: '어류' }));

    // 2. 제출 버튼 클릭
    await user.click(screen.getByRole('button', { name: '선택하기' }));

    // 3. mutate 함수 호출 검증
    expect(mockMutate).toHaveBeenCalledWith({
      categories: [1, 2],
    });
  });
});
