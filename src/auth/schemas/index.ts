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
>>>>>>> 5994e76 (feat: user, auth 레이어드 아키텍처 적용, 이미지 등록, 이메일 전송 (#28))

// default + freeze (런타임 불변)
export default Object.freeze(authValidation);
