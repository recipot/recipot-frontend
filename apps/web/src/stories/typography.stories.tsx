import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const typographyStyles = [
  'text-24',
  'text-22',
  'text-20',
  'text-18',
  'text-18sb',
  'text-17',
  'text-17sb',
  'text-16',
  'text-15',
  'text-15sb',
  'text-14',
  'text-14b',
];

function getWeightLabel(style: string): string {
  if (style === 'text-20' || style === 'text-14b') {
    return 'Bold (700)';
  }

  if (style === 'text-18' || style === 'text-17' || style === 'text-15') {
    return 'Normal (400)';
  }

  return 'Semi-Bold (600)';
}

const meta: Meta = {
  title: 'Design System/Typography',
};

export default meta;

type Story = StoryObj<typeof meta>;

export const AllTextStyles: Story = {
  name: 'Text Styles',
  render: () => (
    <div className="p-4 font-pretendard space-y-6">
      <h1 className="text-3xl font-bold mb-8">Typography</h1>
      {typographyStyles.map(style => (
        <div key={style} className="border-b pb-4">
          <p className={style}>
            거미가 줄을 타고 올라갑니다 비가 오면 끊어집니다
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Class: <span className="font-semibold text-gray-700">{style}</span>{' '}
            | Weight:{' '}
            <span className="font-semibold text-gray-700">
              {getWeightLabel(style)}
            </span>
          </p>
        </div>
      ))}
    </div>
  ),
};
