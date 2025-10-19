import { z } from 'zod';

export type AllergyCheckItem = {
  id: number;
  label: string;
};

// 어패류
export const itemsSeafood: AllergyCheckItem[] = [
  { id: 1, label: '참치' },
  { id: 2, label: '고등어' },
  { id: 3, label: '멸치' },
  { id: 4, label: '오징어' },
  { id: 5, label: '굴' },
  { id: 6, label: '바지락' },
  { id: 7, label: '젓갈류' },
  { id: 7, label: '연어' },
  { id: 7, label: '새우' },
  { id: 7, label: '홍합' },
  { id: 7, label: '새우젓' },
  { id: 7, label: '명란젓' },
  { id: 7, label: '액젓' },
] as const;

// 육류/계란
export const itemsMeat: AllergyCheckItem[] = [
  { id: 8, label: '닭고기' },
  { id: 9, label: '돼지고기' },
  { id: 10, label: '쇠고기' },
  { id: 11, label: '계란' },
  { id: 12, label: '메추리알' },
  { id: 13, label: '가공육' },
  { id: 13, label: '오리고기' },
  { id: 13, label: '햄' },
  { id: 13, label: '소시지' },
  { id: 13, label: '베이컨' },
] as const;

// 견과류
export const itemsNuts: AllergyCheckItem[] = [
  { id: 14, label: '땅콩' },
  { id: 15, label: '호두' },
  { id: 16, label: '캐슈넛' },
  { id: 17, label: '피스타치오' },
  { id: 18, label: '잣' },
] as const;

// 곡류
export const itemsGrains: AllergyCheckItem[] = [
  { id: 19, label: '밀가루' },
  { id: 20, label: '메밀가루' },
  { id: 21, label: '부침가루' },
  { id: 21, label: '국수면' },
  { id: 21, label: '파스타면' },
  { id: 21, label: '만두' },
  { id: 21, label: '빵' },
  { id: 21, label: '메밀면' },
] as const;

// 유제품
export const itemsDairy: AllergyCheckItem[] = [
  { id: 22, label: '우유' },
  { id: 23, label: '치즈' },
  { id: 24, label: '버터' },
  { id: 25, label: '요거트' },
] as const;

// 기타
export const itemsOthers: AllergyCheckItem[] = [
  { id: 26, label: '어묵' },
  { id: 27, label: '게맛살' },
  { id: 28, label: '땅콩버터' },
  { id: 29, label: '복숭아' },
  { id: 30, label: '사과' },
  { id: 31, label: '배' },
  { id: 31, label: '마라' },
  { id: 31, label: '마요네즈' },
] as const;

export const categories: {
  items: AllergyCheckItem[];
  title: string;
}[] = [
  {
    items: itemsSeafood,
    title: '어패류',
  },
  {
    items: itemsMeat,
    title: '육류/계란',
  },
  {
    items: itemsNuts,
    title: '견과류',
  },
  {
    items: itemsGrains,
    title: '곡류',
  },
  {
    items: itemsDairy,
    title: '유제품',
  },
  {
    items: itemsOthers,
    title: '기타',
  },
];

export const AllergyFormSchema = z.object({
  items: z.array(z.number()),
});
