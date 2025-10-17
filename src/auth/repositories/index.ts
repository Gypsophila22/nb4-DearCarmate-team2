import { userLoginRepository } from './auth.login.repository.js';

export const authRepository = {
  userLoginRepository,
} as const;

// default + freeze (런타임 불변)
export default Object.freeze(authRepository);
