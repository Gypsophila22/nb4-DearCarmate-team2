import express from "express";
import PostRefresh from "../auth/controllers/postRefresh.js";
import PostLogin from "../auth/controllers/postLogin.js";

import authValidation from "../auth/schemas/index.js";

const router = express.Router();

router.post("/login", authValidation.authLogin, PostLogin.login);
router.post("/refresh", PostRefresh.refresh);

export default router;
