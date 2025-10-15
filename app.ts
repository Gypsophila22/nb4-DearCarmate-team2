import * as dotenv from "dotenv";
import express from "express";
import passport from "passport";
import cors from "cors";

import errorHandler from "./src/middlewares/errorHandler.js";
import { requestLogger } from "./src/middlewares/logger.js";

// import authRotuer from "./auth.route.js";
// import carRouter from "./car.route.js";
// import companyRouter from "./company.route.js";
// import userRouter from "./user.route.js";

import routers from "./src/routers/index.js";

dotenv.config(); // .env 파일 환경변수 적재

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

app.use("/auth", routers.authRotuer);
app.use("/users", routers.userRouter);
app.use("/cars", routers.carRouter);
app.use("/admin", routers.companyRouter);

app.use(errorHandler);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server running PORT ${PORT}`);
});
