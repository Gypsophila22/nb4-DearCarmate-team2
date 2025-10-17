import { userRegisterRepository } from './user.register.repository.js';
import { userPatchRepository } from './user.patch.repository.js'; // ← 파일명 오타 주의!
import { userGetRepository } from './user.get.repository.js';
import { userDeleteRepository } from './user.delete.repository.js';

export {
  userRegisterRepository,
  userPatchRepository,
  userGetRepository,
  userDeleteRepository,
};

const UserRepository = {
  userRegisterRepository,
  userPatchRepository,
  userGetRepository,
  userDeleteRepository,
} as const;

export default Object.freeze(UserRepository);
