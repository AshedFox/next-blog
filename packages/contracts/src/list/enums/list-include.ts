export const ListInclude = {
  user: 'user',
  items: 'items',
  itemsCount: 'itemsCount',
} as const;

export type ListInclude = (typeof ListInclude)[keyof typeof ListInclude];

export function isListInclude(value: string): value is ListInclude {
  return LIST_INCLUDE_VALUES.includes(value as ListInclude);
}

export const LIST_INCLUDE_KEYS = Object.keys(ListInclude) as Array<
  keyof typeof ListInclude
>;

export const LIST_INCLUDE_VALUES = Object.values(ListInclude) as ListInclude[];
