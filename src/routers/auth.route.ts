import express from 'express';
import authController from '../auth/controllers/index.js';
import authValidation from '../auth/schemas/index.js';

const router = express.Router();

router.post(
  '/login',
  authValidation.authLoginSchema,
  authController.authLoginController
);
router.post('/refresh', authController.authRefreshController);

export default router;
