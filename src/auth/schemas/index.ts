<<<<<<< HEAD
import { authLogin } from './auth.login.schema.js';

export const authValidation = {
  authLogin,
} as const;
=======
import { authLoginSchema } from './auth.login.schema.js';

export const authValidation = {
  authLoginSchema,
} as const satisfies Record<string, import('zod').ZodTypeAny>;
>>>>>>> develop

// default + freeze (런타임 불변)
export default Object.freeze(authValidation);
