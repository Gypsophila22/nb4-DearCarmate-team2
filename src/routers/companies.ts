import express from "express";
import passport from "passport";

import postCompany from "../controllers/companies/postCompany.js";
import getCompany from "../controllers/companies/getCompany.js";
import patchCompany from "../controllers/companies/patchCompany.js";
import deleteCompany from "../controllers/companies/deleteCompany.js";
import getCompanyUsers from "../controllers/companies/getCompanyUsers.js";

const router = express.Router();

// 회사 등록
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  postCompany.createCompany
);

// 회사 목록 조회
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  getCompany.getCompany
);

router.get(
  "/:companyId/users",
  passport.authenticate("jwt", { session: false }),
  getCompanyUsers.getCompanyUsers
);

// 회사 수정 & 삭제 (체인으로)
router
  .route("/:companyId")
  .patch(
    passport.authenticate("jwt", { session: false }),
    patchCompany.updateCompany
  )
  .delete(
    passport.authenticate("jwt", { session: false }),
    deleteCompany.deleteCompany
  );


export default router;
