import { postRegister } from './user.register.controller.js';
import { patchUser } from './user.patch.controller.js';
import { getMe } from './user.get.controller.js';
import { deleteMe, deleteUser } from './user.delete.controller.js';

export { postRegister, patchUser, getMe, deleteMe, deleteUser };

const UserController = {
  postRegister,
  patchUser,
  getMe,
  deleteMe,
  deleteUser,
} as const;

export default Object.freeze(UserController);
