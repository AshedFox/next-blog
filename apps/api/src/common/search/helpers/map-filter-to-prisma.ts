import { FilterOperator, ParsedFilter } from '../types/filter.types';

export function mapFilterToPrisma<T, K extends keyof T>(
  filter: ParsedFilter<T, K>
): Record<string, unknown> {
  const operatorMap: Record<FilterOperator, string> = {
    [FilterOperator.EQ]: 'equals',
    [FilterOperator.NEQ]: 'not',
    [FilterOperator.IN]: 'in',
    [FilterOperator.NIN]: 'notIn',
    [FilterOperator.GT]: 'gt',
    [FilterOperator.GTE]: 'gte',
    [FilterOperator.LT]: 'lt',
    [FilterOperator.LTE]: 'lte',
    [FilterOperator.CONTAINS]: 'contains',
    [FilterOperator.STARTS_WITH]: 'startsWith',
    [FilterOperator.ENDS_WITH]: 'endsWith',
  };

  const prismaOperator = operatorMap[filter.operator];

  if (!prismaOperator) {
    throw new Error(`Unknown operator: ${filter.operator}`);
  }

  if (
    filter.operator === FilterOperator.CONTAINS ||
    filter.operator === FilterOperator.STARTS_WITH ||
    filter.operator === FilterOperator.ENDS_WITH
  ) {
    return {
      [prismaOperator]: filter.value,
      mode: 'insensitive',
    };
  }

  return { [prismaOperator]: filter.value };
}
