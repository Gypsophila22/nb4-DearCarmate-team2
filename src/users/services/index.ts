import { userDeleteService } from './user.delete.service.js';
import { userGetService } from './user.get.service.js';
import { userPatchService } from './user.patch.service.js';
import { userRegisterService } from './user.register.service.js';

export const userService = {
  userRegisterService,
  userPatchService,
  userGetService,
  userDeleteService,
} as const;

export default Object.freeze(userService);
