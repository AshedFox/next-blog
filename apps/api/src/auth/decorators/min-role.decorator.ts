import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const MIN_ROLE_KEY = Symbol('MIN_ROLE_KEY');

export const MinRole = (role: UserRole) => SetMetadata(MIN_ROLE_KEY, role);
