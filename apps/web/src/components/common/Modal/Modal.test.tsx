import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, vi } from 'vitest';

import { Modal } from './Modal';

describe('Modal 컴포넌트', () => {
  test('기본 렌더링이 올바르게 동작한다', () => {
    render(
      <Modal
        title="테스트 제목"
        description="테스트 설명"
        open
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
    const handleOpenChange = vi.fn();
    render(
      <Modal
        title="테스트 제목"
        description="테스트 제목"
        open
        onOpenChange={handleOpenChange}
      >
        <div>모달 컨텐츠</div>
      </Modal>
    );

    const closeButton = screen.getByRole('button', { name: /모달 닫기/i });
    fireEvent.click(closeButton);

    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });
});

// 추후 작업
// describe('Share Recipe 모달', () => {});
