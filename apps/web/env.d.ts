declare namespace NodeJS {
  interface ProcessEnv {
    BACKEND_INTERNAL_URL: string;
    REFRESH_ENDPOINT: string;
    ACCESS_TOKEN_COOKIE: string;
    REFRESH_TOKEN_COOKIE: string;
    TOKEN_REFRESH_THRESHOLD: number;
    STORAGE_PUBLIC_URL: string;
  }
}
