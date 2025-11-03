import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { EntitySearchConfig } from '../types/search.types';

@ValidatorConstraint({ name: 'validateRelations', async: false })
export class ValidateRelationsConstraint<R>
  implements ValidatorConstraintInterface
{
  validate(relations: (keyof R)[], args: ValidationArguments) {
    const config = args.constraints[0] as EntitySearchConfig<any, R>;

    if (!config?.relations) {
      return relations.length === 0;
    }

    if (!Array.isArray(relations)) {
      return false;
    }

    for (const relation of relations) {
      if (!config.relations.includes(relation)) {
        return false;
      }
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const relations = args.value as (keyof R)[];
    const config = args.constraints[0] as EntitySearchConfig<any, R>;

    if (!Array.isArray(relations)) {
      return 'Relations must be an array';
    }

    for (const relation of relations) {
      if (!config.relations?.includes(relation)) {
        return `Relation "${String(relation)}" is not available`;
      }
    }

    return 'Invalid relation';
  }
}

export function ValidateRelations<R>(
  config: EntitySearchConfig<any, R>,
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [config],
      validator: ValidateRelationsConstraint<R>,
    });
  };
}
