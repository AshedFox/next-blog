import { UserRole, UserStatus } from '@prisma/client';

export class UserDto {
  id!: string;
  email!: string;
  username!: string;
  name!: string;
  role!: UserRole;
  status!: UserStatus;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date | null;
}
