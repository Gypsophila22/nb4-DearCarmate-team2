import { userRegisterService } from './user.register.service.js';
import { userPatchService } from './user.patch.service.js';
import { userGetService } from './user.get.service.js';
import { userDeleteService } from './user.delete.service.js';

export const userService = {
  userRegisterService,
  userPatchService,
  userGetService,
  userDeleteService,
} as const;

export default Object.freeze(userService);
