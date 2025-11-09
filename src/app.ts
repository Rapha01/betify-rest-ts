/// <reference path="./types/auth.d.ts" />
import express from 'express';
import cors from 'cors';
import config from './config/config';
import dbcon from './models/dbcon';
import errorMiddleware from './middlewares/error.middleware';
import router from './routes/router';
import attachUser from './middlewares/auth.middleware';

const app = express();

// Enable CORS for frontend requests
app.use(cors({
  origin: config.cors.origin,
  credentials: true
}));

app.use(express.json());

// Attach user (if provided) to every request — non-blocking.
app.use(attachUser);

app.use('/', router);

app.use(errorMiddleware);

export default app;
