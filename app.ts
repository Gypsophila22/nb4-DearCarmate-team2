import express from "express";
import * as dotenv from "dotenv";

dotenv.config(); // .env 파일 환경변수 적재

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.listen(PORT, () => {
  console.log("server running");
});
