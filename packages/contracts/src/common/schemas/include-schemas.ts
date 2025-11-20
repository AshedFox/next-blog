import z from 'zod';

export function createIncludeSchema<T extends Record<string, string>>(
  items: T
) {
  return z
    .union([
      z.string().transform((value) => value.split(',').map((s) => s.trim())),
      z.array(z.string()),
    ])
    .pipe(z.array(z.enum(items)));
}
