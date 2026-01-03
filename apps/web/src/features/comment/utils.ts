import { CommentSearch } from '@workspace/contracts';

export function createCommentSearchParams(
  query: CommentSearch
): URLSearchParams {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (!value) {
      continue;
    }

    if (key === 'sort') {
      const sort = value as NonNullable<CommentSearch['sort']>;
      Object.entries(sort).forEach(([field, direction]) => {
        searchParams.set(key, `${field}:${direction}`);
      });
      continue;
    }

    searchParams.set(key, String(value));
  }

  return searchParams;
}
