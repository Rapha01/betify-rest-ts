import express from 'express';
import dbcon from './models/dbcon';
import errorMiddleware from './middlewares/errorMiddleware';
import router from './routes/router';

const app = express();
app.use(express.json());

app.use('/', router);

app.use(errorMiddleware);

export default app;
