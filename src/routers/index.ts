import authRotuer from './auth.route.js';
import carRouter from './car.route.js';
import companyRouter from './company.route.js';
import userRouter from './user.route.js';
import imgaeRouter from './images.js';
import customersRouter from './customer.route.js';

const routers = {
  authRotuer,
  carRouter,
  companyRouter,
  userRouter,
  imgaeRouter,
  customersRouter,
};

export default routers;

Object.freeze(routers);
