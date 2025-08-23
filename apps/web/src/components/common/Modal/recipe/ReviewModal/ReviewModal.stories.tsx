import { useState } from "react";
import { userEvent, within } from "@storybook/test";

import { Button } from "@/components/common/Button/Button";

import { ReviewModal } from "./ReviewModal";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  component: ReviewModal,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "Common/ReviewModal"
} satisfies Meta<typeof ReviewModal>;
export default meta;

type Story = StoryObj<typeof meta>;

const Template = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>리뷰 모달 열기</Button>
      <ReviewModal
        open={open}
        onOpenChange={setOpen}
        recipeTitle="양배추 계란 샐러드"
        recipeImageUrl="/recipeImage.png"
        timesCooked={2}
      />
    </div>
  );
};

export const Initial: Story = {
  args: {
    onOpenChange: () => {},
    open: true,
    recipeImageUrl: "/recipeImage.png",
    recipeTitle: "양배추 계란 샐러드",
    timesCooked: 2
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "리뷰 모달 열기" })
    );
  },
  render: () => <Template key="initial" />
};
