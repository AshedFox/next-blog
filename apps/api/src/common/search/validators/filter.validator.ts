import {
  isArray,
  isEnum,
  isObject,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import {
  FilterableFieldConfig,
  FilterOperator,
  OperatorsByType,
  ParsedFilters,
} from '../types/filter.types';
import { EntitySearchConfig } from '../types/search.types';

@ValidatorConstraint({ name: 'validateFilters', async: false })
export class ValidateFiltersConstraint<T>
  implements ValidatorConstraintInterface
{
  validate(filters: ParsedFilters<T>, args: ValidationArguments) {
    const config = args.constraints[0] as EntitySearchConfig<T, any>;

    if (!isObject(filters)) {
      return false;
    }

    if (!config?.filterableFields) {
      return Object.keys(filters).length === 0;
    }

    for (const field in filters) {
      const fieldConfig = config.filterableFields[field];

      if (!fieldConfig) {
        return false;
      }

      const allowedOperators = this.getAllowedOperators(fieldConfig);

      const fieldFilters = filters[field]!;

      if (!isArray(fieldFilters)) {
        return false;
      }

      for (const filter of fieldFilters) {
        if (!isObject(filter)) {
          return false;
        }

        if (!allowedOperators.includes(filter.operator)) {
          return false;
        }

        if (!this.validateValueType(filter.value, fieldConfig)) {
          return false;
        }
      }
    }

    return true;
  }

  private getAllowedOperators(
    fieldConfig: FilterableFieldConfig
  ): FilterOperator[] {
    if (fieldConfig.type !== 'enum' && Array.isArray(fieldConfig.operators)) {
      return fieldConfig.operators;
    }

    return OperatorsByType[fieldConfig.type] as FilterOperator[];
  }

  private validateValueType(
    value: any,
    config: FilterableFieldConfig
  ): boolean {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return false;
      }
      return value.every((v) => this.validateSingleValue(v, config));
    }

    return this.validateSingleValue(value, config);
  }

  private validateSingleValue(
    value: any,
    config: FilterableFieldConfig
  ): boolean {
    if (value === null || value === undefined) {
      return false;
    }

    switch (config.type) {
      case 'string':
        return typeof value === 'string';

      case 'number':
        return typeof value === 'number' && !isNaN(value) && isFinite(value);

      case 'boolean':
        return typeof value === 'boolean';

      case 'date':
        return value instanceof Date && !isNaN(value.getTime());

      case 'enum':
        return isEnum(value, config.enumValues);
      default:
        return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    const filters = args.value as ParsedFilters<T>;
    const config = args.constraints[0] as EntitySearchConfig<T, any>;

    if (!isObject(filters)) {
      return 'Filters must be an object';
    }

    for (const field in filters) {
      const fieldConfig = config.filterableFields?.[field];

      if (!fieldConfig) {
        return `Field "${field}" is not filterable`;
      }

      const allowedOperators = this.getAllowedOperators(fieldConfig);
      const fieldFilters = filters[field]!;

      if (!isArray(fieldFilters)) {
        return `Field filters for field "${field}" must be an array`;
      }

      for (const filter of fieldFilters) {
        if (!isObject(filter)) {
          return `Filter for field "${field}" must be an object`;
        }

        if (!allowedOperators.includes(filter.operator)) {
          return `Operator "${filter.operator}" is not allowed for field "${field}"`;
        }

        if (!this.validateValueType(filter.value, fieldConfig)) {
          return `Invalid value type for field "${String(field)}" (expected ${fieldConfig.type})`;
        }
      }
    }

    return 'Invalid filter configuration';
  }
}

export function ValidateFilters<T>(
  config: EntitySearchConfig<T, any>,
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [config],
      validator: ValidateFiltersConstraint<T>,
    });
  };
}
