import express from 'express';
import PostRegister from '../controllers/users/postRegister.js';
import patchUser from '../controllers/users/patchUser.js';
import getUser from '../controllers/users/getUser.js';
import deleteUser from '../controllers/users/deleteUser.js';
import passport from 'passport';
const router = express.Router();
router.post('/register', PostRegister.register);
router
    .route('/me')
    .get(passport.authenticate('jwt', { session: false }), getUser.getMe)
    .patch(passport.authenticate('jwt', { session: false }), patchUser.patchMe)
    .delete(passport.authenticate('jwt', { session: false }), deleteUser.deleteMe);
router.delete('/:id', deleteUser.deleteUser);
export default router;
//# sourceMappingURL=users.js.map