import z from 'zod';

import { SortDirection } from '../enums';

export const sortDirectionSchema = z.enum(SortDirection);

export const createSortSchema = <T extends readonly string[]>(
  allowedFields: T,
  options: {
    multiple?: boolean;
    default?: { field: T[number]; direction: SortDirection };
  } = {}
): z.ZodType<Partial<Record<T[number], SortDirection>>> => {
  const fieldSet = new Set(allowedFields);

  const singleSortTransformer = (
    value: string,
    ctx: z.RefinementCtx<string | string[]>
  ): Record<string, SortDirection> => {
    let field: string,
      direction: SortDirection = SortDirection.ASC;

    if (value.startsWith('-')) {
      field = value.slice(1);
      direction = SortDirection.DESC;
    } else if (value.includes(':')) {
      const [f, d] = value.split(':');

      if (!f || !d || (d !== SortDirection.ASC && d !== SortDirection.DESC)) {
        ctx.addIssue({
          code: 'invalid_format',
          format: 'field:asc|desc',
          message: `Invalid sort format: ${value}`,
        });
        return {};
      }

      [field, direction] = [f, d];
    } else {
      field = value;
    }

    if (!fieldSet.has(field)) {
      ctx.addIssue({
        code: 'invalid_value',
        values: [...allowedFields],
        message: `Sort field not allowed: ${field}. Allowed: ${allowedFields}`,
      });
      return {};
    }

    return { [field]: direction };
  };

  if (options.multiple) {
    return z
      .string()
      .transform((val) => val.split(',').map((s) => s.trim()))
      .pipe(
        z
          .array(z.string())
          .min(1)
          .transform((arr, ctx) => {
            const result: Partial<Record<string, SortDirection>> = {};

            for (const part of arr) {
              Object.assign(result, singleSortTransformer(part, ctx));
            }

            return result;
          })
      )
      .default(
        options.default
          ? { [options.default.field]: options.default.direction }
          : {}
      ) as z.ZodType<Partial<Record<T[number], SortDirection>>>;
  }

  return z
    .string()
    .transform(singleSortTransformer)
    .default(
      options.default
        ? { [options.default.field]: options.default.direction }
        : {}
    ) as unknown as z.ZodType<Partial<Record<T[number], SortDirection>>>;
};
