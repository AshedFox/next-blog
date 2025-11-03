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
  return (
    typeof value === 'string' &&
    Object.values(FilterOperator).includes(value as FilterOperator)
  );
}

export const StringOperators = [
  FilterOperator.EQ,
  FilterOperator.NEQ,
  FilterOperator.IN,
  FilterOperator.NIN,
  FilterOperator.CONTAINS,
  FilterOperator.STARTS_WITH,
  FilterOperator.ENDS_WITH,
  FilterOperator.GT,
  FilterOperator.GTE,
  FilterOperator.LT,
  FilterOperator.LTE,
] as const;

export type StringOperator = (typeof StringOperators)[number];

export const NumberOperators = [
  FilterOperator.EQ,
  FilterOperator.NEQ,
  FilterOperator.IN,
  FilterOperator.NIN,
  FilterOperator.GT,
  FilterOperator.GTE,
  FilterOperator.LT,
  FilterOperator.LTE,
] as const;
export type NumberOperator = (typeof NumberOperators)[number];

export const DateOperators = [
  FilterOperator.EQ,
  FilterOperator.NEQ,
  FilterOperator.IN,
  FilterOperator.NIN,
  FilterOperator.GT,
  FilterOperator.GTE,
  FilterOperator.LT,
  FilterOperator.LTE,
] as const;

export type DateOperator = (typeof DateOperators)[number];

export const BooleanOperators = [
  FilterOperator.EQ,
  FilterOperator.NEQ,
] as const;

export type BooleanOperator = (typeof BooleanOperators)[number];

export const EnumOperators = [
  FilterOperator.EQ,
  FilterOperator.NEQ,
  FilterOperator.IN,
  FilterOperator.NIN,
] as const;

export type EnumOperator = (typeof EnumOperators)[number];

export const OperatorsByType: Record<FieldType, readonly FilterOperator[]> = {
  string: StringOperators,
  number: NumberOperators,
  date: DateOperators,
  boolean: BooleanOperators,
  enum: EnumOperators,
} as const;

export type FieldType = 'string' | 'number' | 'date' | 'boolean' | 'enum';

export type FieldFilterConfig =
  | true
  | StringOperator[]
  | NumberOperator[]
  | DateOperator[]
  | BooleanOperator[]
  | EnumOperator[];

export type ParsedFilter<T = any, K extends keyof T = keyof T> = {
  operator: FilterOperator;
  value: T[K];
};

export type ParsedFilters<T = any> = {
  [K in keyof T]?: ParsedFilter<T, K>[];
};

export type FilterableFieldConfig =
  | {
      type: Extract<FieldType, 'enum'>;
      enumValues: object;
    }
  | { type: Exclude<FieldType, 'enum'>; operators: FieldFilterConfig };

export type FilterableFieldsConfig<T> = {
  [K in keyof T]?: FilterableFieldConfig;
};
