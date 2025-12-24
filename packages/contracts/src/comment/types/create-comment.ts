import z from 'zod';

import { createCommentSchema } from '../schemas';

export type CreateCommentDto = z.infer<typeof createCommentSchema>;
