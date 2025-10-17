import express from 'express';

import authController from '../auth/controllers/index.js';
import authValidation from '../auth/schemas/index.js';

const router = express.Router();

router.post('/login', authValidation.authLogin, authController.PostLogin);
router.post('/refresh', authController.PostRefresh);

export default router;
