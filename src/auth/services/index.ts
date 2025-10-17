import { authLoginService } from './auth.login.service.js';

export const authService = {
  authLoginService,
} as const;

// default + freeze (런타임 불변)
export default Object.freeze(authService);
