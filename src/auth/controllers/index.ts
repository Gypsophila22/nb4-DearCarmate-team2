import PostLogin from './postLogin.js';
import PostRefresh from './postRefresh.js';

const authController = {
  PostLogin: PostLogin,
  PostRefresh: PostRefresh,
};

Object.freeze(authController);

export default authController;
