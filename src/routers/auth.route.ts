import express from "express";
import PostRefresh from "../auth/controllers/postRefresh.js";
import PostLogin from "../auth/controllers/postLogin.js";

const router = express.Router();

router.post("/login", PostLogin.login);
router.post("/refresh", PostRefresh.refresh);

export default router;
