declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    DB_CONNECTION_STRING: string;
    DEV_DB_CONNECTION_STRING: string;
  }
}
