import * as dotenv from 'dotenv';
import express from 'express';
import passport from 'passport';
import path from 'path';
import cors from 'cors';

import errorHandler from './src/middlewares/errorHandler.js';
import { requestLogger } from './src/middlewares/logger.js';

// import authRotuer from "./auth.route.js";
// import carRouter from "./car.route.js";
// import companyRouter from "./company.route.js";
// import userRouter from "./user.route.js";

import routers from './src/routers/index.js';

dotenv.config(); // .env 파일 환경변수 적재

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(passport.initialize());
app.use(requestLogger);
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:3000';

// cors 인증 부분
app.use(
  cors({
    origin: FRONTEND_URL, // 개발 중이면 정확한 프론트 주소
    credentials: true, // 쿠키/Authorization 헤더 쓰면 true
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use('/auth', routers.authRotuer);
app.use('/users', routers.userRouter);
app.use('/cars', routers.carRouter);
app.use('/admin', routers.companyRouter);
app.use('/images', routers.imgaeRouter);

app.use(errorHandler);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server running PORT ${PORT}`);
});
