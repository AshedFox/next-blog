import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const ROLES_KEY = Symbol('ROLES_KEY');

export const Roles = (...roles: UserRole[]) => {
  const uniqueRoles = Array.from(new Set(roles));
  return SetMetadata(ROLES_KEY, uniqueRoles);
};
