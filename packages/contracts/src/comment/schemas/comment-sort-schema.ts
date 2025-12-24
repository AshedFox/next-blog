import { createSortSchema } from '../../common';

export const commentSortSchema = createSortSchema(
  ['createdAt', 'updatedAt'] as const,
  {
    multiple: false,
    default: { field: 'createdAt', direction: 'desc' },
  }
).catch({ createdAt: 'desc' });
