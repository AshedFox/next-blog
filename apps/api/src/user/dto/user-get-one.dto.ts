import { Prisma } from '@prisma/client';
import { IsOptional } from 'class-validator';

import { TransformInclude, ValidateRelations } from '@/common/search';

export class UserGetOneDto {
  @IsOptional()
  @TransformInclude<Prisma.UserInclude>()
  @ValidateRelations<Prisma.UserInclude>({ relations: ['articles'] })
  include: (keyof Prisma.UserInclude)[] = [];
}
