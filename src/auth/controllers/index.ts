import PostLogin from './auth.login.controller.js';
import PostRefresh from './auth.refresh.controller.js';

const authController = {
  PostLogin: PostLogin,
  PostRefresh: PostRefresh,
};

Object.freeze(authController);

export default authController;
