import { authLogin } from './auth.login.schema.js';

export const authValidation = {
  authLogin,
} as const;

// default + freeze (런타임 불변)
export default Object.freeze(authValidation);
