import authRotuer from './auth.route.js';
import carRouter from './car.route.js';
import companyRouter from './company.route.js';
import userRouter from './user.route.js';
import imgaeRouter from './images.js';

const routers = {
  authRotuer,
  carRouter,
  companyRouter,
  userRouter,
  imgaeRouter,
};

export default routers;

Object.freeze(routers);
