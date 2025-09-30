import express from "express";
import * as dotenv from "dotenv";

import authRouter from "./src/routers/auth.js";

dotenv.config(); // .env 파일 환경변수 적재

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log("server running");
});
