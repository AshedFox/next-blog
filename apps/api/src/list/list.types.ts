import { CreateListDto, ListInclusionStateDto } from '@workspace/contracts';

import { List } from '@/prisma/generated/client';

export type CreateListInput = CreateListDto & {
  userId: string;
};

export type ListInclusionState = Pick<
  ListInclusionStateDto,
  'isFavorite' | 'isReadLater'
> & {
  includedInCustomLists: List[];
};
