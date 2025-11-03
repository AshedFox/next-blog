import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { EntitySearchConfig } from '../types/search.types';
import { SortDirection, SortField } from '../types/sort.types';

@ValidatorConstraint({ name: 'validateSort', async: false })
export class ValidateSortConstraint<T> implements ValidatorConstraintInterface {
  validate(sortFields: SortField<T>[], args: ValidationArguments) {
    const config = args.constraints[0] as EntitySearchConfig<T, any>;

    if (!config?.sortableFields) {
      return sortFields.length === 0;
    }

    if (!Array.isArray(sortFields)) {
      return false;
    }

    for (const sort of sortFields) {
      if (!config.sortableFields.includes(sort.field)) {
        return false;
      }

      if (
        sort.direction !== SortDirection.ASC &&
        sort.direction !== SortDirection.DESC
      ) {
        return false;
      }
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const sortFields = args.value as SortField<T>[];
    const config = args.constraints[0] as EntitySearchConfig<T, any>;

    if (!Array.isArray(sortFields)) {
      return 'Sort must be an array';
    }

    for (const sort of sortFields) {
      if (!config.sortableFields?.includes(sort.field)) {
        return `Field "${String(sort.field)}" is not sortable`;
      }

      if (
        sort.direction !== SortDirection.ASC &&
        sort.direction !== SortDirection.DESC
      ) {
        return `Invalid sort direction for field "${String(sort.field)}"`;
      }
    }

    return 'Invalid sort configuration';
  }
}

export function ValidateSort<T>(
  config: EntitySearchConfig<T, any>,
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [config],
      validator: ValidateSortConstraint<T>,
    });
  };
}
