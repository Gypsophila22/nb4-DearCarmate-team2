import { authLoginService } from './auth.login.service.js';

// 토큰 서비스는 클래스로 사용 중

export const authService = {
  authLoginService,
} as const;

// default + freeze (런타임 불변)
export default Object.freeze(authService);
