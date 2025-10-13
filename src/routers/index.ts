import authRotuer from "./auth.route.js";
import carRouter from "./car.route.js";
import companyRouter from "./company.route.js";
import userRouter from "./user.route.js";

const routers = { authRotuer, carRouter, companyRouter, userRouter };

export default routers;

Object.freeze(routers);
