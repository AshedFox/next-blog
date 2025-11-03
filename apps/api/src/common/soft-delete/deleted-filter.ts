export const DeletedMode = {
  ONLY: 'only',
  EXCLUDE: 'exclude',
  INCLUDE: 'include',
} as const;

export type DeletedMode = (typeof DeletedMode)[keyof typeof DeletedMode];

export function getDeletedFilter(mode: DeletedMode = 'exclude') {
  const filters = {
    only: { not: null },
    exclude: null,
    include: undefined,
  } as const;

  return filters[mode];
}
