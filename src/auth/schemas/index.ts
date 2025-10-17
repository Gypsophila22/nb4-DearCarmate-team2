import { authLoginSchema } from './auth.login.schema.js';

export const authSchema = {
  authLoginSchema,
} as const;

// default + freeze (런타임 불변)
export default Object.freeze(authSchema);
