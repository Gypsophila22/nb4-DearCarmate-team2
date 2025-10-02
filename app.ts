import './src/lib/passport/jwtStrategy.js';

import * as dotenv from 'dotenv';
import express from 'express';
import passport from 'passport';

import errorHandler from './src/middlewares/errorHandler.js';
import { requestLogger } from './src/middlewares/logger.js';
import authRouter from './src/routers/auth.js';
import carsRouter from './src/routers/carsRouter.js';
import userRouter from './src/routers/users.js';

dotenv.config(); // .env 파일 환경변수 적재

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(passport.initialize());
app.use(requestLogger);

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/cars', carsRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server running PORT ${PORT}`);
});
