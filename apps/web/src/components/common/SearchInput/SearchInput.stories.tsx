import React, { useState } from 'react';

import { SearchInput } from './SearchInput';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  argTypes: {
    onChange: { action: 'changed' },
    value: { control: 'text' },
  },
  component: SearchInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'Common/SearchInput',
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 예제 (제어된 상태로 렌더링)
function ControlledSearchInput({
  initialValue = '',
  onChange,
}: {
  initialValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange?.(e);
  };

  return <SearchInput value={value} onChange={handleChange} />;
}

export const Default: Story = {
  args: {
    onChange: () => {},
    value: '',
  },
  render: () => <ControlledSearchInput />,
};

export const WithValue: Story = {
  args: {
    onChange: () => {},
    value: '토마토',
  },
  render: () => <ControlledSearchInput initialValue="토마토" />,
};

function InteractiveExample() {
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className="w-80 space-y-4">
      <SearchInput value={value} onChange={handleChange} />
      <div className="text-sm text-gray-600">
        입력된 값: {value || '(비어있음)'}
      </div>
    </div>
  );
}

export const Interactive: Story = {
  args: {
    onChange: () => {},
    value: '',
  },
  name: '상호작용 예제',
  render: () => <InteractiveExample />,
};

function FullWidthExample() {
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className="w-full">
      <SearchInput value={value} onChange={handleChange} />
    </div>
  );
}

export const FullWidth: Story = {
  args: {
    onChange: () => {},
    value: '',
  },
  name: '전체 너비',
  parameters: {
    layout: 'padded',
  },
  render: () => <FullWidthExample />,
};
