import { Router } from 'express';
import { getDashboard } from '../dashboard/controllers/dashboard.get.controller.js';
import passports from '../lib/passport/index.js';

const router = Router();

router.get('/', passports.jwtAuth, getDashboard);

export default router;
