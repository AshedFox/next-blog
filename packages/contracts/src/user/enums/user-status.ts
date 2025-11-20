export const UserStatus = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export const USER_STATUS_VALUES = Object.values(UserStatus) as UserStatus[];

export const USER_STATUS_KEYS = Object.keys(UserStatus) as Array<
  keyof typeof UserStatus
>;

export function isUserStatus(value: unknown): value is UserStatus {
  return USER_STATUS_VALUES.includes(value as UserStatus);
}
