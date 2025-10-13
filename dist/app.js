import express from 'express';
import * as dotenv from 'dotenv';
import './src/lib/passport/jwtStrategy.js';
import passport from 'passport';
import { requestLogger } from './src/lib/middlewares/logger.js';
import authRouter from "./src/routers/auth.js";
import userRouter from './src/routers/users.js';
import customersRouter from "./src/routers/customers.js";
dotenv.config(); // .env 파일 환경변수 적재
const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.json());
app.use(passport.initialize());
app.use(requestLogger);
app.use("/auth", authRouter);
app.use('/users', userRouter);
app.use("/api/customers", customersRouter);
app.listen(PORT, () => {
    console.log(`server running PORT ${PORT}`);
});
//# sourceMappingURL=app.js.map