import AllergyCheckContainer from './AllergyCheckContainer';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  argTypes: {
    onSubmit: {
      action: 'submitted',
      description: '폼 제출 시 호출되는 콜백 함수',
    },
  },
  component: AllergyCheckContainer,
  parameters: {
    docs: {
      description: {
        component:
          '알레르기 체크 폼 컴포넌트입니다. 해산물류와 동물성 식품 카테고리에서 알레르기 항목을 선택할 수 있습니다.',
      },
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'Allergy/AllergyCheck',
} satisfies Meta<typeof AllergyCheckContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 상태 - UI 확인용
export const Default: Story = {
  args: {
    onSubmit: data => console.log('Form submitted:', data),
  },
  parameters: {
    docs: {
      description: {
        story:
          '기본 상태의 알레르기 체크 폼입니다. 사용자가 직접 항목을 선택하고 테스트할 수 있습니다.',
      },
    },
  },
};
