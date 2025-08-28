import { Button } from '../common/Button';
import AllergyCheckContainer from './AllergyCheckContainer';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  argTypes: {
    formId: {
      control: 'text',
      description: 'Form의 고유 ID (외부 버튼 연결용)',
    },
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
          '알레르기 체크 폼 컴포넌트입니다. 해산물류와 동물성 식품 카테고리에서 알레르기 항목을 선택할 수 있습니다. 외부 버튼으로 제어할 수 있습니다.',
      },
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'Allergy/AllergyCheck',
} satisfies Meta<typeof AllergyCheckContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

// 외부 버튼으로 제어하는 예시
export const WithExternalButton: Story = {
  args: {
    formId: 'allergy-form',
    onSubmit: data => console.log('Form submitted:', data),
  },
  decorators: [
    Story => (
      <div className="space-y-6">
        <Story />
        {/* 외부 버튼 */}
        <div className="flex justify-center">
          <Button form="allergy-form" size="full" type="submit">
            선택하기
          </Button>
        </div>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          '외부 버튼으로 폼을 제어하는 예시입니다. formId를 통해 버튼과 폼이 연결됩니다.',
      },
    },
  },
};
