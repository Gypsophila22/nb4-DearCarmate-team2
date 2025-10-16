import * as dotenv from "dotenv";
import express from "express";
import passport from "passport";

import errorHandler from "./src/middlewares/errorHandler.js";
import { requestLogger } from "./src/middlewares/logger.js";
import { jwtStrategy } from "./src/lib/passport/jwtStrategy.js";

import routers from "./src/routers/index.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;

passport.use(jwtStrategy);

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
