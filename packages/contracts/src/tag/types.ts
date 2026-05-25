import z from 'zod';

import { baseTagSchema, tagSearchSchema } from './schemas';

export type BaseTagDto = z.infer<typeof baseTagSchema>;
export type TagSearchDto = z.infer<typeof tagSearchSchema>;
