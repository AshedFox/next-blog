import { FilterOperator } from '../enums';

export const STRING_OPERATORS = [
  FilterOperator.EQ,
  FilterOperator.NEQ,
  FilterOperator.IN,
  FilterOperator.NIN,
  FilterOperator.CONTAINS,
  FilterOperator.STARTS_WITH,
  FilterOperator.ENDS_WITH,
] as const;

export const UUID_OPERATORS = [
  FilterOperator.EQ,
  FilterOperator.NEQ,
  FilterOperator.IN,
  FilterOperator.NIN,
] as const;

export const NUMBER_OPERATORS = [
  FilterOperator.EQ,
  FilterOperator.NEQ,
  FilterOperator.IN,
  FilterOperator.NIN,
  FilterOperator.GT,
  FilterOperator.GTE,
  FilterOperator.LT,
  FilterOperator.LTE,
] as const;

export const DATE_OPERATORS = [
  FilterOperator.EQ,
  FilterOperator.NEQ,
  FilterOperator.GT,
  FilterOperator.GTE,
  FilterOperator.LT,
  FilterOperator.LTE,
] as const;

export const BOOLEAN_OPERATORS = [
  FilterOperator.EQ,
  FilterOperator.NEQ,
] as const;

export const ENUM_OPERATORS = [
  FilterOperator.EQ,
  FilterOperator.NEQ,
  FilterOperator.IN,
  FilterOperator.NIN,
] as const;

export const MULTI_VALUE_OPERATORS = [
  FilterOperator.IN,
  FilterOperator.NIN,
] as const;
