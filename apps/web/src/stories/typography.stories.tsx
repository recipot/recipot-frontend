import React from "react";

import type { Meta, StoryObj } from "@storybook/react";

const typographyStyles = [
  "heading24",
  "heading22",
  "heading20",
  "body18",
  "body17",
  "body15",
  "paragraph18",
  "paragraph16",
  "paragraph15",
  "paragraph14",
];

const TailwindSafelist = () => (
  <div className="hidden">
    <p className="text-heading24" />
    <p className="text-heading22" />
    <p className="text-heading20" />
    <p className="text-body18" />
    <p className="text-body17" />
    <p className="text-body15" />
    <p className="text-paragraph18" />
    <p className="text-paragraph16" />
    <p className="text-paragraph15" />
    <p className="text-paragraph14" />
  </div>
);

interface TypographySampleProps {
  styleName: string;
}

const TypographySample: React.FC<TypographySampleProps> = ({ styleName }) => (
  <div className="mb-6 pb-6 border-b">
    <p className={`text-${styleName}`}>Ag (heading/body/paragraph)</p>
    <div className="mt-2 text-sm text-gray-500">
      <span className="font-bold text-gray-700">Class:</span> .text-{styleName}{" "}
      | <span className="font-bold text-gray-700">Variable:</span> --
      {styleName.replace(/([A-Z])/g, "-$1").toLowerCase()}
    </div>
  </div>
);

const meta: Meta<typeof TypographySample> = {
  component: TypographySample,
  title: "Design System/Typography",
};

export default meta;

type Story = StoryObj<typeof meta>;

export const AllTextStyles: Story = {
  name: "Text Styles",
  render: () => (
    <div className="p-4 font-pretendard">
      <TailwindSafelist />
      <h1 className="text-3xl font-bold mb-8">Typography</h1>
      {typographyStyles.map((style) => (
        <TypographySample key={style} styleName={style} />
      ))}
    </div>
  ),
};
