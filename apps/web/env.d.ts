declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_BACKEND_URL: string;
    REFRESH_ENDPOINT: string;
    ACCESS_TOKEN_COOKIE: string;
    REFRESH_TOKEN_COOKIE: string;
    TOKEN_REFRESH_THRESHOLD: number;
  }
}
