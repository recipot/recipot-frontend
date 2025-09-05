import '@testing-library/jest-dom';

import * as React from 'react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

// React를 전역적으로 사용할 수 있도록 설정
global.React = React;

expect.extend(matchers);
