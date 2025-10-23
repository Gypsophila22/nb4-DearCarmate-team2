import { Router } from 'express';
import passport from 'passport';
import { getDashboard } from '../dashboard/controllers/dashboard.get.controller.js';

const router = Router();

router.get('/', passport.authenticate('jwt', { session: false }), getDashboard);

export default router;
