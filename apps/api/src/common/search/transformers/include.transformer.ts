import { Transform } from 'class-transformer';

export function TransformInclude<T>() {
  return Transform(({ value }): (keyof T)[] => {
    if (!value || typeof value !== 'string') {
      return [];
    }

    return Array.from(
      new Set(
        value
          .split(',')
          .map((v) => v.trim())
          .filter((v) => v) as (keyof T)[]
      )
    );
  });
}
