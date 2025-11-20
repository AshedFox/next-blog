import z from 'zod';

import { articleSchema } from '../schemas';

export type ArticleDto = z.infer<typeof articleSchema>;

export type ArticleInDto = z.input<typeof articleSchema>;
