export function createSearchParams(
  query: Record<string, string | string[] | undefined>
): URLSearchParams {
  const searchParams = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, v));
    } else {
      searchParams.set(key, value);
    }
  });

  return searchParams;
}

export function createApiSearchParams(
  query: Record<string, string | number | boolean | Date | string[] | undefined>
) {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (!value) {
      continue;
    }
    searchParams.set(key, String(value));
  }
  return searchParams;
}
