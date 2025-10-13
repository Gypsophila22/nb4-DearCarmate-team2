import express from 'express';
import * as dotenv from 'dotenv';
import './src/lib/passport/jwtStrategy.js';
import passport from 'passport';
import { requestLogger } from './src/middlewares/logger.js';
import path from 'path';

import authRouter from './src/routers/auth.js';
import userRouter from './src/routers/users.js';
import imagesRouter from './src/routers/images.js';

import errorHandler from './src/middlewares/errorHandler.js';

dotenv.config(); // .env 파일 환경변수 적재

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(passport.initialize());
app.use(requestLogger);
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/images', imagesRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server running PORT ${PORT}`);
});
