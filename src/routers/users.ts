import express from 'express';
import PostRegister from '../controllers/users/postRegister.js';
import patchUser from '../controllers/users/patchUser.js';
import getUser from '../controllers/users/getUser.js';
import deleteUser from '../controllers/users/deleteUser.js';
import { jwtAuth } from '../lib/passport/index.js';

const router = express.Router();

router.post('/register', PostRegister.register);
router
  .route('/me')
  .get(jwtAuth, getUser.getMe)
  .patch(jwtAuth, patchUser.patchMe)
  .delete(jwtAuth, deleteUser.deleteMe);
router.delete('/:id', deleteUser.deleteUser);

export default router;
