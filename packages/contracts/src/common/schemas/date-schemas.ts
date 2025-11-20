import z from 'zod';

export const datetimeInSchema = z.iso
  .datetime()
  .transform((value) => new Date(value));

export const datetimeOutSchema = z
  .date()
  .transform((value) => value.toISOString())
  .pipe(z.iso.datetime());
