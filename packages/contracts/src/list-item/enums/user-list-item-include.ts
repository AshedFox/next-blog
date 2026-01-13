export const ListItemInclude = {
  list: 'list',
  article: 'article',
} as const;

export type ListItemInclude =
  (typeof ListItemInclude)[keyof typeof ListItemInclude];

export function isListItemInclude(value: string): value is ListItemInclude {
  return LIST_ITEM_INCLUDE_VALUES.includes(value as ListItemInclude);
}

export const LIST_ITEM_INCLUDE_KEYS = Object.keys(ListItemInclude) as Array<
  keyof typeof ListItemInclude
>;

export const LIST_ITEM_INCLUDE_VALUES = Object.values(
  ListItemInclude
) as ListItemInclude[];
