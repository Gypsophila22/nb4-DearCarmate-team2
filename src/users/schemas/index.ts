<<<<<<< HEAD
import { validatedserDeleteParam } from './user.delete.schema.js';
import { validatedUserPatch } from './user.patch.schema.js';
import { validatedUserRegister } from './user.register.schema.js';

export const userValidation = {
  validatedserDeleteParam,
  validatedUserPatch,
  validatedUserRegister,
} as const;
=======
import { userDeleteParamSchema } from './user.delete.schema.js';
import { userPatchSchema } from './user.patch.schema.js';
import { userRegisterSchema } from './user.register.schema.js';

export const userValidation = {
  userDeleteParamSchema,
  userPatchSchema,
  userRegisterSchema,
} as const satisfies Record<string, import('zod').ZodTypeAny>;
>>>>>>> 5994e76 (feat: user, auth 레이어드 아키텍처 적용, 이미지 등록, 이메일 전송 (#28))

// default + freeze (런타임 불변)
export default Object.freeze(userValidation);
