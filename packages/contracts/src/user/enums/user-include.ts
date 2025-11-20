export const UserInclude = {
  articles: 'articles',
} as const;

export type UserInclude = (typeof UserInclude)[keyof typeof UserInclude];

export function isUserInclude(value: string): value is UserInclude {
  return USER_INCLUDE_VALUES.includes(value as UserInclude);
}

export const USER_INCLUDE_KEYS = Object.keys(UserInclude) as Array<
  keyof typeof UserInclude
>;

export const USER_INCLUDE_VALUES = Object.values(UserInclude) as UserInclude[];
