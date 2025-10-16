import authRotuer from './auth.route.js';
import carRouter from './car.route.js';
import companyRouter from './company.route.js';
import contractRouter from './contract.route.js';
import customersRouter from './customer.route.js';
import userRouter from './user.route.js';
import documentRouter from './document.route.js';

const routers = {
  authRotuer,
  carRouter,
  companyRouter,
  userRouter,
  contractRouter,
  customersRouter,
  documentRouter,
};

export default routers;

Object.freeze(routers);
