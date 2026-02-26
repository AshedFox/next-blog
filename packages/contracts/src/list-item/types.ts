import z from 'zod';

import { ListItemInclude } from './enums';
import {
  baseListItemSchema,
  createListItemWithRelationsSchema,
  listItemGetOneSchema,
  listItemSchema,
  listItemSearchResponseSchema,
  listItemSearchSchema,
} from './schemas';

export type BaseListItemDto = z.infer<typeof baseListItemSchema>;

export type ListItemDto = z.infer<typeof listItemSchema>;

export type ListItemInDto = z.input<typeof listItemSchema>;

export type ListItemWithRelationsDto<T extends readonly ListItemInclude[]> =
  z.infer<ReturnType<typeof createListItemWithRelationsSchema<T>>>;

export type ListItemSearchDto = z.infer<typeof listItemSearchSchema>;

export type ListItemSearchResponseDto = z.infer<
  typeof listItemSearchResponseSchema
>;

export type ListItemGetOneDto = z.infer<typeof listItemGetOneSchema>;
