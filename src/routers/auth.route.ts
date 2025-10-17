import express from 'express';
import authController from '../auth/controllers/index.js';
import authSchema from '../auth/schemas/index.js';

const router = express.Router();

router.post(
  '/login',
  authSchema.authLoginSchema,
  authController.authLoginController
);
router.post('/refresh', authController.authRefreshController);

export default router;
