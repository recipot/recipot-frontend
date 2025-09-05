import '@testing-library/jest-dom';

import * as React from 'react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect, vi } from 'vitest';

// React를 전역적으로 사용할 수 있도록 설정
global.React = React;

expect.extend(matchers);

const ResizeObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
}));

vi.stubGlobal('ResizeObserver', ResizeObserverMock);
