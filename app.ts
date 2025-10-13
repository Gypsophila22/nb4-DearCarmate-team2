import express from 'express';
import './src/lib/passport/jwtStrategy.js';
import passport from 'passport';
import { requestLogger } from './src/lib/middlewares/logger.js';

import authRouter from "./src/routers/auth.js";
import userRouter from './src/routers/users.js';
import customersRouter from "./src/routers/customers.js";
// import errorHandler from './src/middlewares/errorHandler.ts';

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(passport.initialize());
app.use(requestLogger);

app.use("/auth", authRouter);
app.use('/users', userRouter);
app.use("/api/customers", customersRouter);

// Add the error handler at the very end
// app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server running PORT ${PORT}`);
});
