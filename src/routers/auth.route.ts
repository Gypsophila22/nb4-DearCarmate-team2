import express from 'express';
<<<<<<< HEAD
=======
import { validate } from '../middlewares/validate.zod.js';
>>>>>>> 5994e76 (feat: user, auth 레이어드 아키텍처 적용, 이미지 등록, 이메일 전송 (#28))
import authController from '../auth/controllers/index.js';
import authValidation from '../auth/schemas/index.js';

const router = express.Router();

<<<<<<< HEAD
router.post('/login', authValidation.authLogin, authController.PostLogin);
=======
router.post(
  '/login',
  validate(authValidation.authLoginSchema),
  authController.PostLogin
);
>>>>>>> 5994e76 (feat: user, auth 레이어드 아키텍처 적용, 이미지 등록, 이메일 전송 (#28))
router.post('/refresh', authController.PostRefresh);

export default router;
