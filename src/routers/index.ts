import authRouter from './auth.route.js';
import carRouter from './car.route.js';
import companyRouter from './company.route.js';
import userRouter from './user.route.js';
import imageRouter from './images.js';
import customersRouter from "./customer.route.js";

const routers = {
  authRouter,
  carRouter,
  companyRouter,
  userRouter,
  imageRouter,
  customersRouter,
};

export default routers;

Object.freeze(routers);
