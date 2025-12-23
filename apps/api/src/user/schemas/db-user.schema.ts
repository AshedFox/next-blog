import z from 'zod';

import { UserRole, UserStatus } from '@/prisma/generated/enums';

export const dbBaseUserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  username: z.string(),
  name: z.string(),
  role: z.enum(UserRole),
  status: z.enum(UserStatus),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullish(),
});
