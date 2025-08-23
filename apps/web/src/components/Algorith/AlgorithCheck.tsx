'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { AlgorithFormSchema, categories } from './Algorith.constants';
import AlgorithCheckItem from './AlgorithCheckItem';

import type { z } from 'zod';

/**
 * AlgorithCheck
 * @param onSubmit - onSubmit function
 * @returns AlgorithCheck component
 */
export default function AlgorithCheck({ onSubmit }: { onSubmit: (data: z.infer<typeof AlgorithFormSchema>) => void }) {
  const form = useForm<z.infer<typeof AlgorithFormSchema>>({
    defaultValues: {
      items: [],
    },
    resolver: zodResolver(AlgorithFormSchema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {categories.map((category) => (
          <AlgorithCheckItem
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
