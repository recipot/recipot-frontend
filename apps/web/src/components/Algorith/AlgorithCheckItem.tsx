'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import type { AlgorithCheckItem, AlgorithFormSchema } from './Algorith.constants';
import type { Control } from 'react-hook-form';
import type { z } from 'zod';

/**
 * AlgorithCheckItem
 * @param control - react-hook-form control
 * @param items - AlgorithCheckItem[]
 * @param label - string
 * @returns AlgorithCheckItem component
 */
export default function AlgorithCheckItem({
  control,
  items,
  label,
}: {
  items: AlgorithCheckItem[];
  control: Control<z.infer<typeof AlgorithFormSchema>>;
  label: string;
}) {
  return (
    <FormField
      control={control}
      name="items"
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          {items.map((item) => (
            <FormField
              key={item.id}
              control={control}
              name="items"
              render={({ field }) => {
                return (
                  <FormItem key={item.id} className="flex flex-row items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(item.id)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, item.id])
                            : field.onChange(field.value?.filter((value: number) => value !== item.id));
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">{item.label}</FormLabel>
                  </FormItem>
                );
              }}
            />
          ))}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
