import express from "express";
import PostRegister from "../users/controllers/postRegister.js";
import patchUser from "../users/controllers/patchUser.js";
import getUser from "../users/controllers/getUser.js";
import deleteUser from "../users/controllers/deleteUser.js";
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
