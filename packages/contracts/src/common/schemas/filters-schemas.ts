import z from 'zod';

export function createArrayFilterSchema<O, I extends string[] | null>(
  schema: z.ZodType<O, I>
) {
  return z.preprocess((value) => {
    if (value === 'null' || value === null) {
      return null;
    }

    if (Array.isArray(value)) {
      return value;
    }

    if (typeof value === 'string') {
      if (value.trim() === '') {
        return [];
      }
      return value.split(',').map((s) => s.trim());
    }

    return value;
  }, schema);
}
