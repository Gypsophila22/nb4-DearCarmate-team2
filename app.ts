import express from 'express';
import * as dotenv from 'dotenv';
import './src/lib/passport/jwtStrategy.js';
import passport from 'passport';
import { requestLogger } from './src/lib/middlewares/logger.js';

import authRouter from "./src/routers/auth.js";
import userRouter from './src/routers/users.js';
import customersRouter from "./src/routers/customers.js";
import errorHandler from './src/middlewares/errorHandler.js';
import carsRouter from './src/routers/carsRouter.js';
import companyRouter from './src/routers/companies.js';

dotenv.config(); // .env 파일 환경변수 적재

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(passport.initialize());
app.use(requestLogger);

app.use("/auth", authRouter);
app.use('/users', userRouter);
app.use("/api/customers", customersRouter);

// Assuming carsRouter and companyRouter will be used later, but not adding app.use() for them yet as they are empty.
// If they are meant to be used, the user will need to add app.use() for them.

// Add the error handler at the very end
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server running PORT ${PORT}`);
});
