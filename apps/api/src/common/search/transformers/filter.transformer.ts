import { Transform } from 'class-transformer';
import {
  isBooleanString,
  isDateString,
  isNumberString,
  isObject,
} from 'class-validator';

import {
  FilterOperator,
  isFilterOperator,
  ParsedFilters,
} from '../types/filter.types';

const FORBIDDEN_KEYS = ['__proto__', 'constructor', 'prototype'];

export function TransformFilters<T>() {
  return Transform(({ value }): ParsedFilters<T> => {
    const filters: ParsedFilters<T> = {};

    if (isObject(value)) {
      for (const [key, filter] of Object.entries(value)) {
        if (FORBIDDEN_KEYS.includes(key)) {
          continue;
        }

        const field = key as keyof T;

        if (isObject(filter)) {
          for (const [operator, value] of Object.entries(filter)) {
            if (isFilterOperator(operator)) {
              const parsedFilter = {
                operator,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                value: parseFilterValue(value),
              };
              if (filters[field] === undefined) {
                filters[field] = [];
              }
              filters[field].push(parsedFilter);
            }
          }
        } else {
          const parsedFilter = {
            operator: FilterOperator.EQ,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            value: parseFilterValue(filter),
          };

          if (filters[field] === undefined) {
            filters[field] = [];
          }
          filters[field].push(parsedFilter);
        }
      }
    }

    return filters;
  });
}

function parseFilterValue(value: any): any {
  if (!value || typeof value !== 'string') {
    return value;
  }

  if (value.includes(',')) {
    const parts = value.split(',').map((v) => parseSingleValue(v.trim()));
    return parts.length === 1 ? parts[0] : parts;
  }
  return parseSingleValue(value);
}

function parseSingleValue(value: string): string | number | boolean | Date {
  if (value.length > 1000) {
    return value;
  }

  if (isBooleanString(value)) {
    return Boolean(value);
  }

  if (isNumberString(value)) {
    return Number(value);
  }

  if (isDateString(value)) {
    return new Date(value);
  }

  return value;
}
