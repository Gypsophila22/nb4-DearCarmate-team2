import { validatedserDeleteParam } from './user.delete.schema.js';
import { validatedUserPatch } from './user.patch.schema.js';
import { validatedUserRegister } from './user.register.schema.js';

export const userValidation = {
  validatedserDeleteParam,
  validatedUserPatch,
  validatedUserRegister,
} as const;

// default + freeze (런타임 불변)
export default Object.freeze(userValidation);
