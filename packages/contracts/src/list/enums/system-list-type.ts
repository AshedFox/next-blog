export const SystemListType = {
  FAVORITE: 'FAVORITE',
  READ_LATER: 'READ_LATER',
} as const;

export type SystemListType =
  (typeof SystemListType)[keyof typeof SystemListType];

export const SYSTEM_LIST_TYPE_VALUES = Object.values(
  SystemListType
) as SystemListType[];

export const SYSTEM_LIST_TYPE_KEYS = Object.keys(SystemListType) as Array<
  keyof typeof SystemListType
>;

export function isSystemListType(value: unknown): value is SystemListType {
  return SYSTEM_LIST_TYPE_VALUES.includes(value as SystemListType);
}
