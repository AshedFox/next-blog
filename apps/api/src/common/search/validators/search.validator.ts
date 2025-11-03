import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { EntitySearchConfig } from '../types/search.types';

@ValidatorConstraint({ name: 'validateSearch', async: false })
export class ValidateSearchConstraint<T>
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    if (!value) {
      return true;
    }

    const config = args.constraints[0] as EntitySearchConfig<T, any>;

    if (!config?.searchableFields || config.searchableFields.length === 0) {
      return false;
    }

    if (typeof value !== 'string' || value.trim().length === 0) {
      return false;
    }

    return true;
  }

  defaultMessage({ value, constraints }: ValidationArguments) {
    const config = constraints[0] as EntitySearchConfig<T, any>;

    if (
      value &&
      (!config?.searchableFields || config.searchableFields.length === 0)
    ) {
      return 'Search is not configured for this entity';
    }

    if (value && (typeof value !== 'string' || value.trim().length === 0)) {
      return 'Search query must be a non-empty string';
    }

    return 'Invalid search query';
  }
}

export function ValidateSearch<T>(
  config: EntitySearchConfig<T, any>,
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [config],
      validator: ValidateSearchConstraint<T>,
    });
  };
}
