import express from "express";
import PostRegister from "../controllers/users/postRegister.js";
import patchUser from "../controllers/users/patchUser.js";
import getUser from "../controllers/users/getUser.js";
import deleteUser from "../controllers/users/user.delete.user.js";
import passports from "../lib/passport/index.js";

const router = express.Router();

router.post("/register", PostRegister.register);
router
  .route("/me")
  .get(passports.jwtAuth, getUser.getMe)
  .patch(passports.jwtAuth, patchUser.patchMe)
  .delete(passports.jwtAuth, deleteUser.deleteMe);
router.delete("/:id", deleteUser.deleteUser);

export default router;
