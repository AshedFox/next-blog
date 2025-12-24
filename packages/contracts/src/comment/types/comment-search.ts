import z from 'zod';

import { commentSearchSchema } from '../schemas';

export type CommentSearch = z.infer<typeof commentSearchSchema>;
