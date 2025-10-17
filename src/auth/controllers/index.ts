import authLoginController from './auth.login.controller.js';
import authRefreshController from './auth.refresh.controller.js';

const authController = {
  authLoginController,
  authRefreshController,
};

Object.freeze(authController);

export default authController;
