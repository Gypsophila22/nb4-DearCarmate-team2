import express from 'express';
import passports from '../lib/passport/index.js';
<<<<<<< HEAD
=======
import { validate } from '../middlewares/validate.zod.js';
>>>>>>> 5994e76 (feat: user, auth 레이어드 아키텍처 적용, 이미지 등록, 이메일 전송 (#28))

import C from '../users/controllers/index.js';
import V from '../users/schemas/index.js';

const router = express.Router();

<<<<<<< HEAD
router.post('/', V.validatedUserRegister, C.postRegister);
=======
router.post('/', validate(V.userRegisterSchema), C.postRegister);
>>>>>>> 5994e76 (feat: user, auth 레이어드 아키텍처 적용, 이미지 등록, 이메일 전송 (#28))

router
  .route('/me')
  .get(passports.jwtAuth, C.getMe)
<<<<<<< HEAD
  .patch(passports.jwtAuth, V.validatedUserPatch, C.patchUser)
=======
  .patch(passports.jwtAuth, validate(V.userPatchSchema), C.patchUser)
>>>>>>> 5994e76 (feat: user, auth 레이어드 아키텍처 적용, 이미지 등록, 이메일 전송 (#28))
  .delete(passports.jwtAuth, C.deleteMe);

router.delete(
  '/:id',
  passports.jwtAuth,
<<<<<<< HEAD
  V.validatedserDeleteParam,
=======
  validate(V.userDeleteParamSchema),
>>>>>>> 5994e76 (feat: user, auth 레이어드 아키텍처 적용, 이미지 등록, 이메일 전송 (#28))
  C.deleteUser
);

export default router;
