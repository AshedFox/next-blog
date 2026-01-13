import { CreateListDto } from '@workspace/contracts';

export type CreateListInput = CreateListDto & {
  userId: string;
};
