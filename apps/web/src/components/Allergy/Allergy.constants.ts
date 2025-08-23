import { z } from 'zod';

export type AllergyCheckItem = {
  id: number;
  label: string;
};

export const itemsSeafood: AllergyCheckItem[] = [
  {
    id: 1,
    label: '어류',
  },
  {
    id: 2,
    label: '게',
  },
  {
    id: 3,
    label: '새우',
  },
  {
    id: 4,
    label: '오징어',
  },
  {
    id: 5,
    label: '조개류',
  },
] as const;

export const itemsAnimal: AllergyCheckItem[] = [
  {
    id: 6,
    label: '돼지고기',
  },
  {
    id: 7,
    label: '닭고기',
  },
  {
    id: 8,
    label: '쇠고기',
  },
  {
    id: 9,
    label: '알류',
  },
  {
    id: 10,
    label: '유제품',
  },
] as const;

export const categories: { items: AllergyCheckItem[]; title: string }[] = [
  {
    items: itemsSeafood,
    title: '해산물류',
  },
  {
    items: itemsAnimal,
    title: '동물성 식품',
  },
];

export const AllergyFormSchema = z.object({
  items: z.array(z.number()),
});
