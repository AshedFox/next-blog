export const UserRole = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const USER_ROLE_VALUES = Object.values(UserRole) as UserRole[];

export const USER_ROLE_KEYS = Object.keys(UserRole) as Array<
  keyof typeof UserRole
>;

export function isUserRole(value: unknown): value is UserRole {
  return USER_ROLE_VALUES.includes(value as UserRole);
}
