export type ApiError = {
  message: string;
  status: number;
};

export type ApiFetchResult<T> =
  | {
      data: T;
      error?: never;
    }
  | {
      data?: never;
      error: ApiError;
    };
