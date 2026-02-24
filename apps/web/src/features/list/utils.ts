import { ListItemSearchDto, ListSearchDto } from '@workspace/contracts';

export function createListSearchParams(query: ListSearchDto) {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) {
      continue;
    }

    if (key === 'sort') {
      const sort = value as NonNullable<ListSearchDto['sort']>;
      Object.entries(sort).forEach(([field, direction]) => {
        searchParams.set(key, `${field}:${direction}`);
      });
      continue;
    }

    searchParams.set(key, String(value));
  }

  return searchParams;
}

export function createListItemSearchParams(query: ListItemSearchDto) {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (!value) {
      continue;
    }

    if (key === 'sort') {
      const sort = value as NonNullable<ListItemSearchDto['sort']>;
      Object.entries(sort).forEach(([field, direction]) => {
        searchParams.set(key, `${field}:${direction}`);
      });
      continue;
    }

    searchParams.set(key, String(value));
  }

  return searchParams;
}
