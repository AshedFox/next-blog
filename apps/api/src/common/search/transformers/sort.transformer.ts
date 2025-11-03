import { Transform } from 'class-transformer';

import { SortDirection, SortField } from '../types/sort.types';

export function TransformSort<T>() {
  return Transform(({ value }): SortField<T>[] => {
    if (!value || typeof value !== 'string') {
      return [];
    }

    const sortFields: Map<keyof T, SortField<T>> = new Map();
    const parts = value
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p);

    for (const part of parts) {
      const [key, direction] = part.split(':').map((s) => s.trim());

      if (!key) {
        continue;
      }

      const field = key as keyof T;

      if (!sortFields.has(field)) {
        sortFields.set(field, {
          field,
          direction: (direction as SortDirection) ?? SortDirection.ASC,
        });
      }
    }

    return Array.from(sortFields.values());
  });
}
