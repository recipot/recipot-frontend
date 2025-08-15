import React, { useState } from "react";
import { Mail, MessageCircle } from "lucide-react";

import { Button } from "./Button";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  argTypes: {
    size: {
      control: "select",
      options: ["lg", "md", "icon"],
    },
    variant: {
      control: "select",
      options: [
        "default",
        "outline",
        "toggle",
        "kakao",
        "icon-outline",
        "icon-solid",
      ],
    },
  },
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Common/Button",
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 버튼 (Primary)
export const Primary: Story = {
  args: {
    children: "기본 버튼",
    size: "lg",
    variant: "default",
  },
};

// 카카오 버튼
export const Kakao: Story = {
  args: {
    children: "카카오로 시작하기",
    icon: <MessageCircle />,
    size: "lg",
    variant: "kakao",
  },
};

// 토글 버튼 인터랙션
export const Toggle: Story = {
  args: {
    children: "토글 버튼",
    size: "md",
    variant: "toggle",
  },
  render: function Render(args) {
    const [isActive, setIsActive] = useState(false);
    return (
      <Button
        {...args}
        data-state={isActive ? "active" : "inactive"}
        onClick={() => setIsActive(!isActive)}
      />
    );
  },
};

// 아이콘 버튼
export const WithIcon: Story = {
  args: {
    children: "아이콘과 함께",
    icon: <Mail />,
    size: "lg",
    variant: "default",
  },
};

// 로딩 상태 버튼
export const Loading: Story = {
  args: {
    isLoading: true,
    size: "lg",
  },
};

// 비활성화 버튼
export const Disabled: Story = {
  args: {
    children: "비활성화 버튼",
    disabled: true,
    size: "lg",
  },
};
