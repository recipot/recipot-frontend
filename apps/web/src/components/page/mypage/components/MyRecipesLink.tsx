import { ChevronRight, Utensils } from 'lucide-react';

interface MyRecipesLinkProps {
  count: number;
  onClick: () => void;
}

export const MyRecipesLink = ({ count, onClick }: MyRecipesLinkProps) => {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-lg bg-green-100 p-4 text-green-800"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-green-200 p-2">
          <Utensils className="h-5 w-5" />
        </div>
        <span className="font-semibold">내가 만든 요리</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold">{count}</span>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
    </button>
  );
};
