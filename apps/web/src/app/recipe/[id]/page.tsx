import RecipeDetail from './_components/RecipeDetail';

interface RecipePageProps {
  params: {
    id: string;
  };
}

export default function RecipePage({ params }: RecipePageProps) {
  return <RecipeDetail recipeId={params.id} />;
}
