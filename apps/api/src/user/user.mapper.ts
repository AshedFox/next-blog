import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UserInDto } from '@workspace/contracts';

export type UserWithRelations = User & {
  _count?: Prisma.UserCountOutputType;
};

@Injectable()
export class UserMapper {
  mapStats(user: UserWithRelations): UserInDto {
    return {
      ...user,
      stats: user._count,
    };
  }

  map(user: UserWithRelations): UserInDto {
    return this.mapStats(user);
  }

  mapMany(users: UserWithRelations[]): UserInDto[] {
    return users.map((user) => this.map(user));
  }
}
