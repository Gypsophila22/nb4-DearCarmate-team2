import express from 'express';

import passports from '../lib/passport/index.js';
import C from '../users/controllers/index.js';
import V from '../users/schemas/index.js';

const router = express.Router();

router.post('/', V.validatedUserRegister, C.postRegister);

router
  .route('/me')
  .get(passports.jwtAuth, C.getMe)
  .patch(passports.jwtAuth, V.validatedUserPatch, C.patchUser)
  .delete(passports.jwtAuth, C.deleteMe);

router.delete(
  '/:id',
  passports.jwtAuth,
  V.validatedserDeleteParam,
  C.deleteUser,
);

export default router;
