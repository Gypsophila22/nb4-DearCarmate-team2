import passport from 'passport';
import { localStrategy } from './localStrategy.js';
import { jwtStrategy } from './jwtStrategy.js';

passport.use(localStrategy);
passport.use(jwtStrategy);

export const localAuth = passport.authenticate('local', { session: false });
export const jwtAuth = passport.authenticate('jwt', { session: false });

export default passport;
