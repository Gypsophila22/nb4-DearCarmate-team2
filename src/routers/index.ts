import authRouter from './auth.route.js';
import carRouter from './car.route.js';
import companyRouter from './company.route.js';
import userRouter from './user.route.js';
import imageRouter from './image.route.js';
import customersRouter from './customer.route.js';
import contractRouter from './contract.route.js';
import contractDocumentRouter from './contract-document.route.js';

const routers = {
  authRouter,
  carRouter,
  companyRouter,
  userRouter,
  imageRouter,
  customersRouter,
  contractRouter,
  contractDocumentRouter,
};

export default routers;

Object.freeze(routers);
