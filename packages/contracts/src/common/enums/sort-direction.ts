export const SortDirection = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type SortDirection = (typeof SortDirection)[keyof typeof SortDirection];

export function isSortDirection(value: unknown): value is SortDirection {
  return Object.values(SortDirection).includes(value as SortDirection);
}
