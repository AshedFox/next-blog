export const PaginationType = {
  OFFSET: 'offset',
  CURSOR: 'cursor',
} as const;

export type PaginationType =
  (typeof PaginationType)[keyof typeof PaginationType];

export function isPaginationType(value: string): value is PaginationType {
  return Object.values(PaginationType).includes(value as PaginationType);
}
