import z from 'zod';

import { articleBlockFormSchema, articleFormSchema } from './validation';

export type ArticleBlockFormData = z.infer<typeof articleBlockFormSchema>;

export type ArticleFormData = z.infer<typeof articleFormSchema>;
