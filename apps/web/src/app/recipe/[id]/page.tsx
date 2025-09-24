import RecipeDetail from './components/RecipeDetail';

const sampleRecipe = {
  cookware: [{ name: '냄비' }, { name: '프라이팬' }, { name: '에어프라이어' }],
  description: '연어는 단백질이 풍부하고, 포만감이 좋다고 해요!',
  difficulty: '조리도구 최소 정보',
  id: '1',
  image: '/recipeImage.png',
  ingredients: [
    { amount: '200g', id: '1', name: '고사리', status: 'owned' as const },
    { amount: '1개', id: '2', name: '사과', status: 'owned' as const },
    { amount: '1개', id: '3', name: '새우', status: 'owned' as const },
    {
      amount: '200g',
      id: '4',
      name: '새우',
      status: 'substitutable' as const,
      substitutes: '연어, 참치, 고등어',
    },
    { amount: '1개', id: '5', name: '빵', status: 'required' as const },
  ],
  relatedRecipes: [
    {
      id: '1',
      image: '/recipeImage.png',
      time: '99분',
      title: '띄어쓰기 포함 2줄 20자 까지',
    },
    {
      id: '2',
      image: '/recipeImage.png',
      time: '99분',
      title: '띄어쓰기 포함 2줄 20자 까지',
    },
    {
      id: '3',
      image: '/recipeImage.png',
      time: '99분',
      title: '띄어쓰기 포함 2줄 20자 까지',
    },
  ],
  seasonings: [
    { amount: '1꼬집', name: '소금' },
    { amount: '1스푼', name: '간장' },
    { amount: '1스푼', name: '고추장' },
  ],
  steps: [
    {
      description:
        '같은 사용하는 출판이나 입숨은 모형의 이런 보여줄 입숨을 실제적인 디자인 그래픽 연출을 레이아웃 폰트, 무언가를 입숨을 때로 때로 채워지기 텍스트로, 때로 로렘 디자인 들어가는 전에 로렘 로렘 입숨은 그래픽 로렘 채우기',
      step: 1,
    },
    {
      description:
        '같은 사용하는 출판이나 입숨은 모형의 이런 보여줄 입숨을 실제적인 디자인 그래픽 연출을 레이아웃 폰트, 무언가를 입숨을 때로 때로 채워지기 텍스트로, 때로 로렘 디자인 들어가는 전에 로렘 로렘 입숨은 그래픽 로렘 채우기',
      step: 2,
    },
    {
      description:
        '같은 사용하는 출판이나 입숨은 모형의 이런 보여줄 입숨을 실제적인 디자인 그래픽 연출을 레이아웃 폰트, 무언가를 입숨을 때로 때로 채워지기 텍스트로, 때로 로렘 디자인 들어가는 전에 로렘 로렘 입숨은 그래픽 로렘 채우기',
      step: 3,
    },
    {
      description:
        '같은 사용하는 출판이나 입숨은 모형의 이런 보여줄 입숨을 실제적인 디자인 그래픽 연출을 레이아웃 폰트, 무언가를 입숨을 때로 때로 채워지기 텍스트로, 때로 로렘 디자인 들어가는 전에 로렘 로렘 입숨은 그래픽 로렘 채우기',
      step: 4,
    },
  ],
  subtitle: '빵 한장에 땅콩버터 바르고 사과만 얹으면 뚝딱',
  time: '99분',
  title: '레시피 타이틀 최대 1줄까지',
};

interface RecipePageProps {
  params: {
    id: string;
  };
}

export default function RecipePage({ params }: RecipePageProps) {
  return <RecipeDetail recipe={sampleRecipe} />;
}
