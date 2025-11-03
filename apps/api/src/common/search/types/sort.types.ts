export const SortDirection = { ASC: 'asc', DESC: 'desc' } as const;

export type SortDirection = (typeof SortDirection)[keyof typeof SortDirection];

export type SortField<T> = {
  field: keyof T;
  direction: SortDirection;
};
