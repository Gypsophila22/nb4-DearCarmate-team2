import './src/config/env.js';

import cors from 'cors';
import express, { NextFunction, request, Request, Response, Router, type } from 'express';
import passport from 'passport';
import path from 'path';

import errorHandler from './src/middlewares/errorHandler.js';
import { requestLogger } from './src/middlewares/logger.js';
import routers from './src/routers/index.js';

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(passport.initialize());
app.use(requestLogger);

//테스트 용으로 만들어놓은 cors입니다.
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.use('/auth', routers.authRouter);
app.use('/users', routers.userRouter);
app.use('/cars', routers.carRouter);
app.use('/admin', routers.companyRouter);
app.use('/images', routers.imageRouter);
app.use('/contracts', routers.contractRouter);
app.use('/customers', routers.customersRouter);
app.use('/companies', routers.companyRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server running PORT ${PORT}`);
});
