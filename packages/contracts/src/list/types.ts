import z from 'zod';

import { ListInclude } from './enums';
import {
  baseListSchema,
  createListSchema,
  createListWithRelationsSchema,
  listGetOneSchema,
  listInclusionStateSchema,
  listSchema,
  listSearchResponseSchema,
  listSearchSchema,
  updateListSchema,
} from './schemas';

export type CreateListDto = z.infer<typeof createListSchema>;

export type UpdateListDto = z.infer<typeof updateListSchema>;

export type BaseListDto = z.infer<typeof baseListSchema>;

export type ListDto = z.infer<typeof listSchema>;

export type ListWithRelationsDto<T extends readonly ListInclude[]> = z.infer<
  ReturnType<typeof createListWithRelationsSchema<T>>
>;

export type ListSearchDto = z.infer<typeof listSearchSchema>;

export type ListSearchResponseDto = z.infer<typeof listSearchResponseSchema>;

export type ListGetOneDto = z.infer<typeof listGetOneSchema>;

export type ListInclusionStateDto = z.infer<typeof listInclusionStateSchema>;
