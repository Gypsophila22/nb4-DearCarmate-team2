<<<<<<< HEAD
import authRouter from "./auth.route.js";
import carRouter from "./car.route.js";
import companyRouter from "./company.route.js";
import userRouter from "./user.route.js";
import customersRouter from "./customer.route.js";

const routers = { authRouter, carRouter, companyRouter, userRouter, customersRouter };
=======
import authRotuer from './auth.route.js';
import carRouter from './car.route.js';
import companyRouter from './company.route.js';
import userRouter from './user.route.js';
import imgaeRouter from './images.js';
import customersRouter from "./customer.route.js";

const routers = {
  authRotuer,
  carRouter,
  companyRouter,
  userRouter,
  imgaeRouter,
  customersRouter,
};
>>>>>>> 340732a (develop 최신화 && users 파트 companyCode, companyName merge 전 임시 변경)

export default routers;

Object.freeze(routers);
