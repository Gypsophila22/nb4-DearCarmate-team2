import express from 'express';
import { authController } from '../auth/controllers/auth.controller.js';
import { authSchema } from '../auth/schemas/auth.schema.js';

const router = express.Router();

router.post(
  '/login',
  authSchema.authLoginSchema,
  authController.authLoginController
);
router.post('/refresh', authController.authRefreshController);

export default router;
