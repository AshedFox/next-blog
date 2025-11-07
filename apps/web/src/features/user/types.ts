export const UserRole = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const UserStatus = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export type User = {
  id: string;
  email: string;
  username: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};
