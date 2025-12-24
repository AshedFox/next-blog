import z from 'zod';

import { updateCommentSchema } from '../schemas';

export type UpdateCommentDto = z.infer<typeof updateCommentSchema>;
