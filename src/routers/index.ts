<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
import authRouter from "./auth.route.js";
import carRouter from "./car.route.js";
import companyRouter from "./company.route.js";
import userRouter from "./user.route.js";
import customersRouter from "./customer.route.js";

const routers = { authRouter, carRouter, companyRouter, userRouter, customersRouter };
=======
>>>>>>> 9c9a97d (feat: user, auth 레이어드 아키텍처 적용, 이미지 등록, 이메일 전송 (#28))
import authRotuer from './auth.route.js';
import carRouter from './car.route.js';
import companyRouter from './company.route.js';
import userRouter from './user.route.js';
import imgaeRouter from './images.js';
import customersRouter from "./customer.route.js";

=======
import authRotuer from './auth.route.js';
import carRouter from './car.route.js';
import companyRouter from './company.route.js';
import userRouter from './user.route.js';
import imgaeRouter from './images.js';
import customersRouter from "./customer.route.js";

>>>>>>> 5994e76 (feat: user, auth 레이어드 아키텍처 적용, 이미지 등록, 이메일 전송 (#28))
const routers = {
  authRotuer,
  carRouter,
  companyRouter,
  userRouter,
  imgaeRouter,
  customersRouter,
};
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 340732a (develop 최신화 && users 파트 companyCode, companyName merge 전 임시 변경)
=======
>>>>>>> 5994e76 (feat: user, auth 레이어드 아키텍처 적용, 이미지 등록, 이메일 전송 (#28))
>>>>>>> 9c9a97d (feat: user, auth 레이어드 아키텍처 적용, 이미지 등록, 이메일 전송 (#28))

export default routers;

Object.freeze(routers);