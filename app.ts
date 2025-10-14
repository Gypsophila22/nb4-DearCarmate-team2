import * as dotenv from "dotenv";
import express from "express";
import passport from "passport";

import errorHandler from "./src/middlewares/errorHandler.js";
import { requestLogger } from "./src/middlewares/logger.js";
import routers from "./src/routers/index.js";


dotenv.config(); // .env 파일 환경변수 적재

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(passport.initialize());
app.use(requestLogger);

// develop 브랜치의 리팩토링된 라우터들을 사용합니다.
app.use("/auth", routers.authRouter);
app.use("/users", routers.userRouter);
// app.use("/cars", routers.carRouter); // cars 라우터는 여전히 문제가 있으므로 주석 처리 유지
app.use("/admin", routers.companyRouter);

// customer 라우터는 별도로 추가합니다.
app.use("/api/customers", routers.customersRouter);

app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`server running PORT ${PORT}`);
});