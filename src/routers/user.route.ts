import express from 'express';
import passports from '../lib/passport/index.js';

import C from '../users/controllers/index.js';
import V from '../users/schemas/index.js';

const router = express.Router();

router.post('/', V.userRegisterSchema, C.postRegister);

router
  .route('/me')
  .get(passports.jwtAuth, C.getMe)
  .patch(passports.jwtAuth, V.userPatchSchema, C.patchUser)
  .delete(passports.jwtAuth, C.deleteMe);

router.delete('/:id', passports.jwtAuth, V.userDeleteParamSchema, C.deleteUser);

export default router;
