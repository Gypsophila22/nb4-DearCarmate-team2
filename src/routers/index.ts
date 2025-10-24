import authRouter from './auth.route.js';
import carRouter from './car.route.js';
import companyRouter from './company.route.js';
import contractDocumentRouter from './contract-document.route.js';
import contractRouter from './contract.route.js';
import customersRouter from './customer.route.js';
import imageRouter from './image.route.js';
import userRouter from './user.route.js';
import dashboardRouter from './dashborad.route.js';

const routers = {
  authRouter,
  carRouter,
  companyRouter,
  userRouter,
  imageRouter,
  contractRouter,
  customersRouter,
  contractDocumentRouter,
  dashboardRouter,
};

export default routers;

Object.freeze(routers);
