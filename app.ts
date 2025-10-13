import * as dotenv from "dotenv";
import express from "express";
import passport from "passport";

import errorHandler from "./src/middlewares/errorHandler.js";
import { requestLogger } from "./src/middlewares/logger.js";
import routers from "./src/routers/index.js";
import customersRouter from "./src/routers/customers.js";

dotenv.config(); // .env 파일 환경변수 적재

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(passport.initialize());
app.use(requestLogger);

app.use("/auth", routers.authRouter);
app.use("/users", routers.userRouter);
// app.use("/cars", routers.carRouter);
app.use("/admin", routers.companyRouter);
app.use("/api/customers", customersRouter);

app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`server running PORT ${PORT}`);
});