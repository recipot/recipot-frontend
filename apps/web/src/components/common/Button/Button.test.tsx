import '@testing-library/jest-dom';

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { Button } from './Button';

describe('Button 컴포넌트', () => {
  describe('기본 기능', () => {
    test('기본 버튼이 정상적으로 렌더링된다', () => {
      render(<Button>기본 버튼</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('기본 버튼')).toBeInTheDocument();
    });

    test('클릭 이벤트 핸들러가 정상적으로 호출된다', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>클릭 테스트</Button>);

      const button = screen.getByRole('button', { name: '클릭 테스트' });
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('여러 번 클릭 시 핸들러가 매번 호출된다', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>클릭 테스트</Button>);

      const button = screen.getByRole('button', { name: '클릭 테스트' });
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('disabled 상태', () => {
    test('disabled 상태일 때 버튼이 비활성화된다', () => {
      render(<Button disabled>비활성화 버튼</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    test('disabled 상태일 때 클릭 이벤트가 발생하지 않는다', () => {
      const handleClick = vi.fn();
      render(
        <Button disabled onClick={handleClick}>
          비활성화 버튼
        </Button>
      );

      const button = screen.getByRole('button', { name: '비활성화 버튼' });
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    test('disabled 상태에서 적절한 스타일이 적용된다', () => {
      render(<Button disabled>비활성화 버튼</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('disabled:pointer-events-none');
    });
  });

  describe('asChild prop', () => {
    test('asChild가 true일 때 자식 요소가 버튼 역할을 한다', () => {
      render(
        <Button asChild>
          <a href="/test">링크 버튼</a>
        </Button>
      );

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
    });

    test('asChild가 false일 때 button 요소가 렌더링된다', () => {
      render(<Button asChild={false}>일반 버튼</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('HTML 속성', () => {
    test('커스텀 className이 올바르게 적용된다', () => {
      render(<Button className="custom-class">커스텀 클래스</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    test('type 속성이 올바르게 적용된다', () => {
      render(<Button type="submit">Submit 버튼</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    test('id 속성이 올바르게 적용된다', () => {
      render(<Button id="test-button">테스트 버튼</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('id', 'test-button');
    });

    test('data 속성이 올바르게 적용된다', () => {
      render(<Button data-testid="button-test">데이터 속성</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-testid', 'button-test');
    });
  });

  describe('이벤트 핸들링', () => {
    test('onMouseEnter 이벤트가 정상적으로 동작한다', () => {
      const handleMouseEnter = vi.fn();
      render(<Button onMouseEnter={handleMouseEnter}>Hover 테스트</Button>);

      const button = screen.getByRole('button', { name: 'Hover 테스트' });
      fireEvent.mouseEnter(button);
      expect(handleMouseEnter).toHaveBeenCalledTimes(1);
    });

    test('onMouseLeave 이벤트가 정상적으로 동작한다', () => {
      const handleMouseLeave = vi.fn();
      render(<Button onMouseLeave={handleMouseLeave}>Hover 테스트</Button>);

      const button = screen.getByRole('button', { name: 'Hover 테스트' });
      fireEvent.mouseLeave(button);
      expect(handleMouseLeave).toHaveBeenCalledTimes(1);
    });

    test('onFocus 이벤트가 정상적으로 동작한다', () => {
      const handleFocus = vi.fn();
      render(<Button onFocus={handleFocus}>Focus 테스트</Button>);

      const button = screen.getByRole('button', { name: 'Focus 테스트' });
      fireEvent.focus(button);
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    test('onBlur 이벤트가 정상적으로 동작한다', () => {
      const handleBlur = vi.fn();
      render(<Button onBlur={handleBlur}>Blur 테스트</Button>);

      const button = screen.getByRole('button', { name: 'Blur 테스트' });
      fireEvent.focus(button);
      fireEvent.blur(button);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('접근성', () => {
    test('aria-label이 올바르게 적용된다', () => {
      render(<Button aria-label="닫기 버튼">×</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', '닫기 버튼');
    });

    test('aria-describedby가 올바르게 적용된다', () => {
      render(<Button aria-describedby="help-text">도움말 버튼</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-describedby', 'help-text');
    });

    test('키보드 포커스가 정상적으로 동작한다', () => {
      render(<Button>키보드 테스트</Button>);

      const button = screen.getByRole('button');
      expect(button).not.toHaveFocus();

      button.focus();
      expect(button).toHaveFocus();
    });
  });
});
