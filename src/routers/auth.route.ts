import express from 'express';
import { validate } from '../middlewares/validate.zod.js';
import authController from '../auth/controllers/index.js';
import authValidation from '../auth/schemas/index.js';

const router = express.Router();

router.post(
  '/login',
  validate(authValidation.authLoginSchema),
  authController.PostLogin
);
router.post('/refresh', authController.PostRefresh);

export default router;
