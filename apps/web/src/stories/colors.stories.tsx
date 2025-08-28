import React from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const colors = {
  Accent: ['accent'],
  Border: ['border'],
  Destructive: ['destructive'],
  'Feel Colors (Background)': [
    'feel-back-default',
    'feel-back-tired',
    'feel-back-soso',
    'feel-back-free',
  ],
  'Feel Colors (Text)': ['feel-tired-text', 'feel-soso-text', 'feel-free-text'],
  'Gray Scale': [
    'gray-900',
    'gray-800',
    'gray-700',
    'gray-600',
    'gray-500',
    'gray-400',
    'gray-300',
    'gray-200',
    'gray-100',
    'gray-50',
  ],
  Input: ['input'],
  Muted: ['muted'],
  Primary: ['primary'],
  Ring: ['ring'],
  Secondary: ['secondary'],
  'Secondary Colors': [
    'secondary-soft-green',
    'secondary-light-green',
    'secondary-soft-orange',
    'secondary-light-orange',
    'secondary-soft-red',
    'secondary-light-red',
  ],
};

const TailwindSafelist = () => (
  <div className="hidden">
    <div className="bg-primary" />
    <div className="bg-secondary" />
    <div className="bg-muted" />
    <div className="bg-accent" />
    <div className="bg-destructive" />
    <div className="bg-border" />
    <div className="bg-input" />
    <div className="bg-ring" />
    <div className="bg-secondary-soft-green" />
    <div className="bg-secondary-light-green" />
    <div className="bg-secondary-soft-orange" />
    <div className="bg-secondary-light-orange" />
    <div className="bg-secondary-soft-red" />
    <div className="bg-secondary-light-red" />
    <div className="bg-feel-tired-text" />
    <div className="bg-feel-soso-text" />
    <div className="bg-feel-free-text" />
    <div className="bg-feel-back-default" />
    <div className="bg-feel-back-tired" />
    <div className="bg-feel-back-soso" />
    <div className="bg-feel-back-free" />
    <div className="bg-gray-900" />
    <div className="bg-gray-800" />
    <div className="bg-gray-700" />
    <div className="bg-gray-600" />
    <div className="bg-gray-500" />
    <div className="bg-gray-400" />
    <div className="bg-gray-300" />
    <div className="bg-gray-200" />
    <div className="bg-gray-100" />
    <div className="bg-gray-50" />
  </div>
);

interface ColorItemProps {
  colorName: string;
}

const ColorItem: React.FC<ColorItemProps> = ({ colorName }) => (
  <div className="mb-4 flex items-center space-x-4">
    <div
      className={`h-16 w-16 rounded-md border border-border bg-${colorName}`}
    />
    <div className="flex flex-col">
      <span className="text-sm font-bold">.{colorName}</span>
      <span className="text-xs text-gray-500">
        hsl(var(--{colorName.replace('gray-', 'gray-')}))
      </span>
    </div>
  </div>
);

interface ColorPaletteProps {
  title: string;
  colorList: string[];
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ colorList, title }) => (
  <div className="mb-8">
    <h2 className="mb-4 border-b pb-2 text-xl font-bold">{title}</h2>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {colorList.map(color => (
        <ColorItem key={color} colorName={color} />
      ))}
    </div>
  </div>
);

const meta: Meta = {
  title: 'Design System/Colors',
};

export default meta;

type Story = StoryObj;

export const AllColors: Story = {
  render: () => (
    <div className="p-4 font-pretendard">
      <TailwindSafelist />
      <h1 className="mb-8 text-3xl font-bold">Color Palette</h1>
      {Object.entries(colors).map(([title, colorList]) => (
        <ColorPalette key={title} title={title} colorList={colorList} />
      ))}
    </div>
  ),
};
