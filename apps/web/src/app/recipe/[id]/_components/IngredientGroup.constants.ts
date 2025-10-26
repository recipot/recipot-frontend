type StatusConfig = {
  label: string;
  labelClass: string;
  color: string;
  textColor: string;
};

export const INGREDIENT_STATUS_CONFIG: Record<string, StatusConfig> = {
  alternativeUnavailable: {
    color:
      'bg-secondary-light-red border-[0.5px] border-secondary-soft-red rounded-[6px] px-3 py-[3px]',
    label: '대체불가',
    labelClass: 'text-15sb text-[#FC5845]',
    textColor: 'text-[#FC5845]',
  },
  notOwned: {
    color:
      'bg-secondary-light-orange border-[0.5px] border-secondary-soft-orange rounded-[6px] px-3 py-[3px]',
    label: '미보유',
    labelClass: 'text-15sb text-primary',
    textColor: 'text-[#F88014]',
  },
  owned: {
    color:
      'bg-secondary-light-green border-[0.5px] border-secondary-soft-green rounded-[6px] px-3 py-[3px]',
    label: '보유',
    labelClass: 'text-15sb text-primary',
    textColor: 'text-[#8EB35B]',
  },
};

export type IngredientStatus = keyof typeof INGREDIENT_STATUS_CONFIG;
