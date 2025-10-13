import express from 'express';
import PostRefresh from '../controllers/auth/postRefresh.js';
import PostLogin from '../controllers/auth/postLogin.js';
const router = express.Router();
router.post('/login', PostLogin.login);
router.post('/refresh', PostRefresh.refresh);
export default router;
//# sourceMappingURL=auth.js.map