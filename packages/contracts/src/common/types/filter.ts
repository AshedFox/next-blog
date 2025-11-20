import {
  BOOLEAN_OPERATORS,
  DATE_OPERATORS,
  ENUM_OPERATORS,
  NUMBER_OPERATORS,
  STRING_OPERATORS,
  UUID_OPERATORS,
} from '../constants';

export type StringOperator = (typeof STRING_OPERATORS)[number];

export type UuidOperators = (typeof UUID_OPERATORS)[number];

export type NumberOperator = (typeof NUMBER_OPERATORS)[number];

export type DateOperator = (typeof DATE_OPERATORS)[number];

export type BooleanOperator = (typeof BOOLEAN_OPERATORS)[number];

export type EnumOperator = (typeof ENUM_OPERATORS)[number];
