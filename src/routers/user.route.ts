import express from 'express';
import passports from '../lib/passport/index.js';

import { userController } from '../users/controllers/user.controller.js';
import { userSchema } from '../users/schemas/user.schema.js';

const router = express.Router();

router.post('/', userSchema.userRegisterSchema, userController.postRegister);

router
  .route('/me')
  .get(passports.jwtAuth, userController.getMe)
  .patch(
    passports.jwtAuth,
    userSchema.userPatchSchema,
    userController.patchUser
  )
  .delete(passports.jwtAuth, userController.deleteMe);

router.delete(
  '/:id',
  passports.jwtAuth,
  userSchema.userDeleteParamSchema,
  userController.deleteUser
);

export default router;
