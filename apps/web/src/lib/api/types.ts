export type ApiFetchResult<T> =
  | {
      data: T;
      error?: never;
    }
  | {
      data?: never;
      error: Error;
    };
