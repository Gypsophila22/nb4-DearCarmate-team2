import { userDeleteParamSchema } from './user.delete.schema.js';
import { userPatchSchema } from './user.patch.schema.js';
import { userRegisterSchema } from './user.register.schema.js';

export const userValidation = {
  userDeleteParamSchema,
  userPatchSchema,
  userRegisterSchema,
} as const satisfies Record<string, import('zod').ZodTypeAny>;

// default + freeze (런타임 불변)
export default Object.freeze(userValidation);
