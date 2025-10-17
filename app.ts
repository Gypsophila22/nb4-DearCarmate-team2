import './src/config/env.js';

import express, {
  request,
  Router,
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import cors from 'cors';
import path from 'path';
import passport from 'passport';

import routers from "./src/routers/index.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(passport.initialize());
app.use(requestLogger);

app.use("/auth", routers.authRotuer);
app.use("/users", routers.userRouter);
app.use("/cars", routers.carRouter);
app.use("/companies", routers.companyRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server running PORT ${PORT}`);
});