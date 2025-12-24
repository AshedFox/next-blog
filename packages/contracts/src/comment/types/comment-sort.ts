import z from 'zod';

import { commentSortSchema } from '../schemas';

export type CommentSort = z.infer<typeof commentSortSchema>;
