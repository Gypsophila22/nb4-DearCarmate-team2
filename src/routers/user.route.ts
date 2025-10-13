// import express from 'express';
// import { postRegister } from '../users/controllers/user.register.controller.js';
// import { patchUser } from '../users/controllers/user.patch.controller.js';
// import { getMe } from '../users/controllers/user.get.controller.js';
// import {
//   deleteMe,
//   deleteUser,
// } from '../users/controllers/user.delete.controller.js';
// import passports from '../lib/passport/index.js';

// const router = express.Router();

// router.post('/register', postRegister);
// router
//   .route('/me')
//   .get(passports.jwtAuth, getMe)
//   .patch(passports.jwtAuth, patchUser)
//   .delete(passports.jwtAuth, deleteMe);
// router.delete('/:id', deleteUser);

// export default router;

import express from 'express';
import passports from '../lib/passport/index.js';
import { validate } from '../middlewares/validate.zod.js';

import C from '../users/controllers/index.js';
import V from '../users/schemas/index.js';

const router = express.Router();

router.post('/register', validate(V.userRegisterSchema), C.postRegister);

router
  .route('/me')
  .get(passports.jwtAuth, C.getMe)
  .patch(passports.jwtAuth, validate(V.userPatchSchema), C.patchUser)
  .delete(passports.jwtAuth, C.deleteMe);

router.delete(
  '/:id',
  passports.jwtAuth,
  validate(V.userDeleteParamSchema),
  C.deleteUser
);

export default router;
