import React from 'react';

import LoadingPage from './LoadingPage';
import RecipeSearchLoadingPage from './RecipeSearchLoadingPage';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  component: LoadingPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  title: 'Common/Loading/LoadingPage',
} satisfies Meta<typeof LoadingPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomText: Story = {
  render: () => <LoadingPage>레시피를 검색하고 있어요</LoadingPage>,
};

export const MultilineText: Story = {
  render: () => (
    <LoadingPage>
      맛있는 레시피를
      <br />
      찾고 있어요
    </LoadingPage>
  ),
};

export const RecipeSearch: Story = {
  render: () => <RecipeSearchLoadingPage userName="홍길동" />,
};

export const RecipeSearchDefault: Story = {
  render: () => <RecipeSearchLoadingPage />,
};

export const DataLoading: Story = {
  render: () => <LoadingPage>데이터를 불러오는 중...</LoadingPage>,
};

export const FileUpload: Story = {
  render: () => (
    <LoadingPage>
      파일을 업로드하고 있어요
      <br />
      잠시만 기다려주세요
    </LoadingPage>
  ),
};

export const Processing: Story = {
  render: () => (
    <LoadingPage>
      요청을 처리하고 있어요
      <br />곧 완료됩니다
    </LoadingPage>
  ),
};
