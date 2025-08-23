'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { AllergyFormSchema, categories } from './Allergy.constants';
import AllergyCheckItem from './AllergyCheckItem';

import type { z } from 'zod';

/**
 * AllergyCheck
 * @param onSubmit - onSubmit function
 * @returns AllergyCheck component
 */
export default function AllergyCheck({
  onSubmit,
}: {
  onSubmit: (data: z.infer<typeof AllergyFormSchema>) => void;
}) {
  const form = useForm<z.infer<typeof AllergyFormSchema>>({
    defaultValues: {
      items: [],
    },
    resolver: zodResolver(AllergyFormSchema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {categories.map(category => (
          <AllergyCheckItem
            key={category.title}
            control={form.control}
            items={category.items}
            label={category.title}
          />
        ))}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
