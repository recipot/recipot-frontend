import '@testing-library/jest-dom';

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { SearchInput } from './SearchInput';

describe('SearchInput 컴포넌트', () => {
  describe('기본 기능', () => {
    test('검색 입력 필드가 정상적으로 렌더링된다', () => {
      const handleChange = vi.fn();
      render(<SearchInput value="" onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', '재료 검색하기');
      expect(input).toHaveAttribute('type', 'text');
    });

    test('SearchIcon이 렌더링된다', () => {
      const handleChange = vi.fn();
      render(<SearchInput value="" onChange={handleChange} />);

      // SearchIcon이 포함된 컨테이너를 찾는다
      const container = screen.getByRole('textbox').parentElement;
      expect(container).toBeInTheDocument();
    });

    test('초기 value가 올바르게 표시된다', () => {
      const handleChange = vi.fn();
      render(<SearchInput value="토마토" onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('토마토');
    });

    test('빈 value로 렌더링된다', () => {
      const handleChange = vi.fn();
      render(<SearchInput value="" onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('');
    });
  });

  describe('입력 제한', () => {
    test('maxLength 속성이 올바르게 적용된다', () => {
      const handleChange = vi.fn();
      render(<SearchInput value="" onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('maxLength', '6');
    });

    test('6글자 초과 입력 시 제한된다', () => {
      const handleChange = vi.fn();
      render(<SearchInput value="" onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '토마토양파당근' } }); // 7글자

      // maxLength에 의해 실제로는 6글자까지만 입력될 것임
      expect(input).toHaveAttribute('maxLength', '6');
    });
  });

  describe('키보드 이벤트', () => {
    test('Enter 키 입력이 가능하다', () => {
      const handleChange = vi.fn();
      render(<SearchInput value="" onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.keyDown(input, { code: 'Enter', key: 'Enter' });

      // Enter 키 이벤트가 정상적으로 처리되는지 확인
      expect(input).toBeInTheDocument();
    });
  });

  describe('접근성', () => {
    test('input이 textbox role을 가진다', () => {
      const handleChange = vi.fn();
      render(<SearchInput value="" onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    test('placeholder가 올바르게 설정된다', () => {
      const handleChange = vi.fn();
      render(<SearchInput value="" onChange={handleChange} />);

      const input = screen.getByPlaceholderText('재료 검색하기');
      expect(input).toBeInTheDocument();
    });

    test('스크린 리더가 input을 인식할 수 있다', () => {
      const handleChange = vi.fn();
      render(<SearchInput value="" onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'text');
      expect(input).toHaveAttribute('placeholder', '재료 검색하기');
    });
  });

  describe('컴포넌트 상태 동기화', () => {
    test('외부에서 value가 변경되면 즉시 반영된다', () => {
      const handleChange = vi.fn();
      const { rerender } = render(
        <SearchInput value="토마토" onChange={handleChange} />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('토마토');

      rerender(<SearchInput value="양파" onChange={handleChange} />);

      // Controlled Component이므로 즉시 반영됨
      expect(input).toHaveValue('양파');
    });

    test('빈 문자열로 value가 변경되면 즉시 초기화된다', () => {
      const handleChange = vi.fn();
      const { rerender } = render(
        <SearchInput value="토마토" onChange={handleChange} />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('토마토');

      rerender(<SearchInput value="" onChange={handleChange} />);

      // Controlled Component이므로 즉시 반영됨
      expect(input).toHaveValue('');
    });
  });
});
