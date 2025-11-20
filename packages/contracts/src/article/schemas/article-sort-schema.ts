import { createSortSchema } from '../../common';

export const articleSortSchema = createSortSchema(
  ['createdAt', 'updatedAt', 'title'] as const,
  {
    multiple: true,
    default: { field: 'createdAt', direction: 'desc' },
  }
);
