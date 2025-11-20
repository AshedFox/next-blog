export const FilterOperator = {
  EQ: 'eq',
  NEQ: 'neq',
  IN: 'in',
  NIN: 'nin',
  GT: 'gt',
  GTE: 'gte',
  LT: 'lt',
  LTE: 'lte',
  CONTAINS: 'contains',
  STARTS_WITH: 'startsWith',
  ENDS_WITH: 'endsWith',
} as const;

export type FilterOperator =
  (typeof FilterOperator)[keyof typeof FilterOperator];

export function isFilterOperator(value: unknown): value is FilterOperator {
  return Object.values(FilterOperator).includes(value as FilterOperator);
}
