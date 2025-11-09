import { Config } from '../types/config';

const config: Config = {
  env: (['dev', 'prod', 'test'] as const).includes(process.env.NODE_ENV as any) ? 
    (process.env.NODE_ENV as 'dev' | 'prod' | 'test') : 'dev',
  db: {
    host: process.env.POSTGRES_HOST || '',
    port: Number(process.env.POSTGRES_PORT) || 5432,
    user: process.env.POSTGRES_USER || '',
    password: process.env.POSTGRES_PASSWORD || '',
    database: process.env.POSTGRES_DBNAME || '',
  },
  apiHost: process.env.HOST || '',
  apiPort: process.env.API_PORT || '',
  appUrl: process.env.APP_URL || '',
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
  mail: {
    user: process.env.MAIL_USER || '',
    password: process.env.MAIL_PASSWORD || '',
    smtpHost: process.env.MAIL_SMTPHOST || '',
    smtpPort: Number(process.env.MAIL_SMTPPORT) || 587,
    from: process.env.MAIL_FROM || '',
  },
  captcha: {
    secret: process.env.CAPTCHA_SECRET || '',
    tickerInterval: Number(process.env.CAPTCHA_TICKER_INTERVAL) || 60000,
  },
  jwt: {
    secret: process.env.JWT_SECRET || '',
    accessExpirationMinutes: Number(process.env.JWT_ACCESS_EXPIRATION_MINUTES) || 15,
    refreshExpirationDays: Number(process.env.JWT_REFRESH_EXPIRATION_DAYS) || 30,
    resetPasswordExpirationMinutes: Number(process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES) || 10,
    verifyEmailExpirationMinutes: Number(process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES) || 60,
  },
};

export default config;


