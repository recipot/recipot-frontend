import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Modal } from './Modal';

describe('Modal 컴포넌트', () => {
  test('기본 렌더링이 올바르게 동작한다', () => {
    render(
      <Modal
        title="테스트 제목"
        description="테스트 설명"
        open={true}
        onOpenChange={() => {}}
      >
        <div>모달 컨텐츠</div>
      </Modal>
    );

    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
    expect(screen.getByText('테스트 제목')).toBeInTheDocument();
    expect(screen.getByText('모달 컨텐츠')).toBeInTheDocument();
  });

  test('닫기 버튼 클릭 시 onOpenChange가 호출된다', () => {
    const handleOpenChange = jest.fn();
    render(
      <Modal
        title="테스트 제목"
        description="테스트 제목"
        open={true}
        onOpenChange={handleOpenChange}
      >
        <div>모달 컨텐츠</div>
      </Modal>
    );

    // Find and click the close button (assuming it has an aria-label)
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });
});

// 추후 작업
describe('Share Recipe 모달', () => {});
