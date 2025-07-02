
export interface Config {
  env: 'dev' | 'prod' | 'test';
  db: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  },
  apiPort: string;
  apiHost: string;
  appUrl: string;
  mail: {
    user: string;
    password: string;
    smtpHost: string;
    smtpPort: number;
    from: string;
  };
  captcha: {
    secret: string;
    tickerInterval: number;
  };
  jwt: {
    secret: string;
    accessExpirationMinutes: number;
    refreshExpirationDays: number;
    resetPasswordExpirationMinutes: number;
    verifyEmailExpirationMinutes: number;
  };
}
