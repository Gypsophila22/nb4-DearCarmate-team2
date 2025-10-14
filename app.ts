import * as dotenv from "dotenv";
import express from "express";
import passport from "passport";

import errorHandler from "./src/middlewares/errorHandler.js";
import { requestLogger } from "./src/middlewares/logger.js";
import { jwtStrategy } from "./src/lib/passport/jwtStrategy.js";

// import authRotuer from "./auth.route.js";
// import carRouter from "./car.route.js";
//import companyRouter from "./routers/company.route.ts";
// import userRouter from "./user.route.js";

import routers from "./src/routers/index.js";

dotenv.config(); // .env 파일 환경변수 적재

const app = express();

const PORT = process.env.PORT || 4000;

passport.use(jwtStrategy);

app.use(express.json());
app.use(passport.initialize());
app.use(requestLogger);

app.use("/auth", routers.authRotuer);
app.use("/users", routers.userRouter);
app.use("/cars", routers.carRouter);
app.use("/", routers.companyRouter);

app.use(errorHandler);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server running PORT ${PORT}`);
});
