import z from 'zod';

export function createArrayFilterSchema<
  T extends z.ZodArray<z.ZodType<unknown, string>>,
>(schema: T) {
  return z
    .union([
      z.string().transform((value) => value.split(',').map((s) => s.trim())),
      z.array(z.string()),
    ])
    .pipe(schema);
}
